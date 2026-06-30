import pg from "pg";

const { Client } = pg;

const requiredEnv = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "SUPABASE_DATABASE_URL",
] as const;

function describeDatabaseUrl() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;

  try {
    const parsed = new URL(connectionString);
    return {
      host: parsed.hostname,
      port: parsed.port || "5432",
      database: parsed.pathname.replace(/^\//, "") || null,
      isPooler: parsed.hostname.includes("pooler.supabase.com"),
      isDirectSupabase: /^db\.[^.]+\.supabase\.co$/.test(parsed.hostname),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid database URL",
    };
  }
}

export default async function handler(req: any, res: any) {
  const env = Object.fromEntries(
    requiredEnv.map((name) => [name, Boolean(process.env[name])]),
  );

  const payload: Record<string, unknown> = {
    ok: Object.values(env).every(Boolean),
    env,
    node: process.version,
    databaseUrl: describeDatabaseUrl(),
  };

  if (req.query?.db === "1") {
    const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
    try {
      if (!connectionString) {
        throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL is not configured");
      }

      const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      await client.connect();
      try {
        const result = await client.query<{ ok: number }>("SELECT 1 AS ok");
        payload.db = { ok: result.rows[0]?.ok === 1 };
      } finally {
        await client.end();
      }
    } catch (error) {
      payload.ok = false;
      payload.db = {
        ok: false,
        message: error instanceof Error ? error.message : "Database check failed",
      };
    }
  }

  return res.status(200).json(payload);
}
