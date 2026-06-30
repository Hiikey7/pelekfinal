const requiredEnv = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "SUPABASE_DATABASE_URL",
] as const;

export default async function handler(req: any, res: any) {
  const env = Object.fromEntries(
    requiredEnv.map((name) => [name, Boolean(process.env[name])]),
  );

  const payload: Record<string, unknown> = {
    ok: Object.values(env).every(Boolean),
    env,
    node: process.version,
  };

  if (req.query?.db === "1") {
    try {
      const { query: dbQuery } = await import("../server/postgres");
      const rows = await dbQuery<{ ok: number }>("SELECT 1 AS ok");
      payload.db = { ok: rows[0]?.ok === 1 };
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
