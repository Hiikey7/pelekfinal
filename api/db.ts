import pg from "pg";
import { AppRole, getSessionFromRequest, hasRole } from "./auth-utils";

const { Pool } = pg;
let pool: pg.Pool | null = null;
let poolConnectionString = "";

type DbFilter = {
  column: string;
  operator: "eq" | "neq" | "in";
  value: unknown;
};

type DbRequest = {
  table: string;
  action: "select" | "insert" | "update" | "delete";
  columns?: string;
  filters?: DbFilter[];
  order?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  payload?: Record<string, unknown> | Record<string, unknown>[];
  single?: boolean;
  maybeSingle?: boolean;
  count?: "exact";
  head?: boolean;
};

function getDatabaseUrl() {
  return process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || "";
}

function shouldUseSsl(connectionString: string) {
  return !/[?&]sslmode=disable(?:&|$)/i.test(connectionString);
}

function getPool(connectionString: string) {
  if (!pool || poolConnectionString !== connectionString) {
    pool = new Pool({
      connectionString,
      max: 3,
      ssl: shouldUseSsl(connectionString)
        ? { rejectUnauthorized: false }
        : undefined,
    });
    pool.on("error", (error) => {
      console.error("Postgres pool error", error);
    });
    poolConnectionString = connectionString;
  }

  return pool;
}

async function dbQuery<T = any>(text: string, values: unknown[] = []) {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL is not configured");
  }

  const result = await getPool(connectionString).query<T>(text, values);
  return result.rows;
}

const tableColumns = {
  amenities: ["created_at", "id", "name"],
  blogs: [
    "author",
    "category",
    "content",
    "created_at",
    "date",
    "excerpt",
    "id",
    "image",
    "read_time",
    "show_on_homepage",
    "title",
    "updated_at",
  ],
  contact_messages: [
    "created_at",
    "email",
    "full_name",
    "id",
    "message",
    "phone",
    "read",
    "subject",
  ],
  expenses: [
    "amount",
    "category",
    "created_at",
    "description",
    "id",
    "title",
    "updated_at",
  ],
  faqs: ["answer", "created_at", "id", "question", "sort_order", "updated_at"],
  offers: [
    "active",
    "created_at",
    "cta_link",
    "cta_text",
    "description",
    "id",
    "image",
    "offer_type",
    "promo_code",
    "title",
    "updated_at",
  ],
  orders: [
    "created_at",
    "id",
    "notes",
    "num_days",
    "payment_method",
    "phone",
    "price_per_night",
    "property_id",
    "property_title",
    "status",
    "total_amount",
    "updated_at",
    "visitor_name",
  ],
  properties: [
    "amenities",
    "bathrooms",
    "bedrooms",
    "category",
    "created_at",
    "description",
    "featured",
    "google_map_link",
    "guests",
    "id",
    "image",
    "images",
    "lat",
    "lng",
    "location",
    "price",
    "price_label",
    "rating",
    "reviews_count",
    "social_media_type",
    "social_media_url",
    "title",
    "type",
    "updated_at",
    "whatsapp",
  ],
  reviews: ["avatar", "comment", "created_at", "date", "id", "name", "rating"],
  site_settings: ["id", "key", "updated_at", "value"],
  user_roles: ["id", "role", "user_id"],
} as const;

type TableName = keyof typeof tableColumns;

const publicReadTables = new Set<TableName>([
  "amenities",
  "blogs",
  "faqs",
  "offers",
  "properties",
  "reviews",
  "site_settings",
]);

function isTableName(table: string): table is TableName {
  return table in tableColumns;
}

function assertColumn(table: TableName, column: string) {
  if (!tableColumns[table].includes(column as never)) {
    throw new Error(`Column "${column}" is not allowed for ${table}`);
  }
}

function normalizeColumns(table: TableName, columns = "*") {
  if (columns.trim() === "*") return "*";

  const selected = columns
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean);

  selected.forEach((column) => assertColumn(table, column));
  return selected.map((column) => `"${column}"`).join(", ");
}

function addFilters(
  table: TableName,
  filters: DbFilter[] | undefined,
  params: unknown[],
) {
  if (!filters?.length) return "";

  const clauses = filters.map((filter) => {
    assertColumn(table, filter.column);
    params.push(filter.value);
    const index = params.length;

    if (filter.operator === "eq") return `"${filter.column}" = $${index}`;
    if (filter.operator === "neq") return `"${filter.column}" <> $${index}`;
    if (filter.operator === "in") return `"${filter.column}" = ANY($${index})`;

    throw new Error(`Unsupported filter operator: ${filter.operator}`);
  });

  return ` WHERE ${clauses.join(" AND ")}`;
}

function cleanPayload(table: TableName, payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([column]) => {
      assertColumn(table, column);
      return true;
    }),
  );
}

const writeRolesByTable: Partial<Record<TableName, AppRole>> = {
  blogs: "blogs",
  properties: "properties",
};

function canAccess(req: any, table: TableName, action: DbRequest["action"]) {
  const session = getSessionFromRequest(req);
  if (hasRole(session, "admin")) return true;
  if (action === "select" && publicReadTables.has(table)) return true;

  const requiredRole = writeRolesByTable[table];
  return action !== "select" && !!requiredRole && hasRole(session, requiredRole);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return res
      .status(500)
      .json({
        error: {
          message: "SUPABASE_DATABASE_URL or DATABASE_URL is not configured",
        },
      });
  }

  try {
    const body = req.body as DbRequest;
    const table = body.table;

    if (!isTableName(table)) {
      throw new Error(`Table "${table}" is not allowed`);
    }

    if (!canAccess(req, table, body.action)) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    const params: unknown[] = [];
    const where = addFilters(table, body.filters, params);

    if (body.action === "select") {
      if (body.count === "exact" && body.head) {
        const rows = await dbQuery<{ count: number }>(
          `SELECT count(*)::int AS count FROM "${table}"${where}`,
          params,
        );
        return res.status(200).json({
          data: null,
          error: null,
          count: rows[0]?.count ?? 0,
        });
      }

      const selected = normalizeColumns(table, body.columns);
      let query = `SELECT ${selected} FROM "${table}"${where}`;

      if (body.order) {
        assertColumn(table, body.order.column);
        query += ` ORDER BY "${body.order.column}" ${
          body.order.ascending === false ? "DESC" : "ASC"
        }`;
      }

      if (body.limit) {
        params.push(body.limit);
        query += ` LIMIT $${params.length}`;
      }

      const rows = await dbQuery(query, params);

      if (body.single || body.maybeSingle) {
        return res.status(200).json({
          data: rows[0] ?? null,
          error: body.single && rows.length !== 1 ? { message: "Row not found" } : null,
        });
      }

      return res.status(200).json({ data: rows, error: null });
    }

    if (body.action === "insert") {
      const rowsToInsert = Array.isArray(body.payload)
        ? body.payload
        : [body.payload || {}];
      const inserted = [];

      for (const row of rowsToInsert) {
        const clean = cleanPayload(table, row);
        const columns = Object.keys(clean);

        if (!columns.length) throw new Error("Insert payload is empty");

        const values = Object.values(clean);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        const query = `INSERT INTO "${table}" (${columns
          .map((column) => `"${column}"`)
          .join(", ")}) VALUES (${placeholders}) RETURNING *`;
        const result = await dbQuery(query, values);
        inserted.push(...result);
      }

      return res.status(200).json({ data: inserted, error: null });
    }

    if (body.action === "update") {
      const clean = cleanPayload(table, (body.payload || {}) as Record<string, unknown>);
      const columns = Object.keys(clean);

      if (!columns.length) throw new Error("Update payload is empty");
      if (!where) throw new Error("Update requires at least one filter");

      const values = Object.values(clean);
      const setClause = columns
        .map((column, index) => `"${column}" = $${index + 1}`)
        .join(", ");
      const shiftedWhere = addFilters(table, body.filters, values);
      const rows = await dbQuery(
        `UPDATE "${table}" SET ${setClause}${shiftedWhere} RETURNING *`,
        values,
      );

      return res.status(200).json({ data: rows, error: null });
    }

    if (body.action === "delete") {
      if (!where) throw new Error("Delete requires at least one filter");
      const rows = await dbQuery(`DELETE FROM "${table}"${where} RETURNING *`, params);
      return res.status(200).json({ data: rows, error: null });
    }

    throw new Error("Unsupported action");
  } catch (error) {
    return res.status(400).json({
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Database request failed",
      },
    });
  }
}
