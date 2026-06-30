import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let poolConnectionString = "";

export function getDatabaseUrl() {
  return process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || "";
}

function shouldUseSsl(connectionString: string) {
  return !/[?&]sslmode=disable(?:&|$)/i.test(connectionString);
}

export function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL is not configured");
  }

  if (!pool || poolConnectionString !== connectionString) {
    pool = new Pool({
      connectionString,
      max: 3,
      ssl: shouldUseSsl(connectionString)
        ? { rejectUnauthorized: false }
        : undefined,
    });
    poolConnectionString = connectionString;
  }

  return pool;
}

export async function query<T = any>(text: string, values: unknown[] = []) {
  const result = await getPool().query<T>(text, values);
  return result.rows;
}
