import type { Database, Tables } from "./types";

type FilterOperator = "eq" | "neq" | "in";
type DbAction = "select" | "insert" | "update" | "delete";

type DbFilter = {
  column: string;
  operator: FilterOperator;
  value: unknown;
};

type DbOrder = {
  column: string;
  ascending: boolean;
};

type DbRequest = {
  table: string;
  action: DbAction;
  columns?: string;
  filters: DbFilter[];
  order?: DbOrder;
  limit?: number;
  payload?: unknown;
  single?: boolean;
  maybeSingle?: boolean;
  count?: "exact";
  head?: boolean;
};

type DbResponse<T> = {
  data: T | null;
  error: { message: string } | null;
  count?: number | null;
};

type UploadResponse = {
  path: string;
  publicUrl: string;
};

export type NeonUser = {
  id: string;
  email: string;
  app_metadata?: {
    role?: string;
  };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const SESSION_KEY = "pelek_admin_session";
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

type StoredSession = {
  user: NeonUser;
  access_token: string;
  expires_at: number;
};

async function request<T>(path: string, body?: unknown): Promise<T> {
  const token = getStoredSession()?.access_token;
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error?.message || result.message || "Request failed");
  }

  return result;
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/")) return fileToDataUrl(file);
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return fileToDataUrl(file);
  }

  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });

  if (!image) return fileToDataUrl(file);

  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) return fileToDataUrl(file);

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(type, type === "image/jpeg" ? 0.82 : undefined);
  const optimizedBlob = dataUrlToBlob(dataUrl);

  if (optimizedBlob.size >= file.size) return fileToDataUrl(file);
  return dataUrl;
}

function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as StoredSession;
    if (!session.expires_at || session.expires_at <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

class QueryBuilder<T = unknown> implements PromiseLike<DbResponse<T[]>> {
  private columns = "*";
  private action: DbAction = "select";
  private filters: DbFilter[] = [];
  private sort?: DbOrder;
  private maxRows?: number;
  private payload?: unknown;
  private wantsSingle = false;
  private wantsMaybeSingle = false;
  private countMode?: "exact";
  private headOnly = false;

  constructor(private readonly table: string) {}

  select(columns = "*", options?: { count?: "exact"; head?: boolean }) {
    this.action = "select";
    this.columns = columns;
    this.countMode = options?.count;
    this.headOnly = !!options?.head;
    return this;
  }

  insert(payload: unknown) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: unknown) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, operator: "eq", value });
    return this;
  }

  neq(column: string, value: unknown) {
    this.filters.push({ column, operator: "neq", value });
    return this;
  }

  in(column: string, value: unknown[]) {
    this.filters.push({ column, operator: "in", value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sort = { column, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.maxRows = count;
    return this;
  }

  single() {
    this.wantsSingle = true;
    return this as unknown as PromiseLike<DbResponse<T>>;
  }

  maybeSingle() {
    this.wantsMaybeSingle = true;
    return this as unknown as PromiseLike<DbResponse<T>>;
  }

  then<TResult1 = DbResponse<T[]>, TResult2 = never>(
    onfulfilled?:
      | ((value: DbResponse<T[]>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<DbResponse<T[]>> {
    try {
      const body: DbRequest = {
        table: this.table,
        action: this.action,
        columns: this.columns,
        filters: this.filters,
        order: this.sort,
        limit: this.maxRows,
        payload: this.payload,
        single: this.wantsSingle,
        maybeSingle: this.wantsMaybeSingle,
        count: this.countMode,
        head: this.headOnly,
      };

      return await request<DbResponse<T[]>>("/api/db", body);
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : "Database request failed",
        },
      };
    }
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const uploadedFiles = new Map<string, string>();
type DbTableName = keyof Database["public"]["Tables"];

function from<Table extends DbTableName>(table: Table): QueryBuilder<Tables<Table>>;
function from<T = unknown>(table: string): QueryBuilder<T>;
function from(table: string) {
  return new QueryBuilder(table);
}

export const backend = {
  from,
  auth: {
    async getSession() {
      return { data: { session: getStoredSession() }, error: null };
    },
    onAuthStateChange(
      _callback?: (
        event: string,
        session: { user: NeonUser; access_token: string } | null,
      ) => void,
    ) {
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    },
    async signInWithPassword(credentials: { email: string; password: string }) {
      try {
        const data = await request<{
          user: NeonUser;
          access_token: string;
        }>("/api/auth", credentials);
        const session: StoredSession = {
          user: data.user,
          access_token: data.access_token,
          expires_at: Date.now() + SESSION_DURATION_MS,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { data: { user: data.user, session }, error: null };
      } catch (error) {
        return {
          data: { user: null, session: null },
          error: {
            message: error instanceof Error ? error.message : "Login failed",
          },
        };
      }
    },
    async signOut() {
      localStorage.removeItem(SESSION_KEY);
      return { error: null };
    },
  },
  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          try {
            const optimizedFile = await optimizeImage(file);
            const data = await request<UploadResponse>("/api/upload", {
              bucket,
              path,
              file: optimizedFile,
            });
            uploadedFiles.set(`${bucket}/${path}`, data.publicUrl);
            return { data: { path, publicUrl: data.publicUrl }, error: null };
          } catch (error) {
            return {
              data: null,
              error: {
                message:
                  error instanceof Error ? error.message : "Upload failed",
              },
            };
          }
        },
        getPublicUrl(path: string) {
          return {
            data: {
              publicUrl: uploadedFiles.get(`${bucket}/${path}`) || "",
            },
          };
        },
      };
    },
  },
  functions: {
    async invoke(name: string, options?: { body?: unknown }) {
      try {
        const data = await request(`/api/functions/${name}`, options?.body);
        return { data, error: null };
      } catch (error) {
        return {
          data: null,
          error: {
            message:
              error instanceof Error ? error.message : "Function request failed",
          },
        };
      }
    },
  },
};
