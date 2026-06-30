const requiredEnv = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "SUPABASE_DATABASE_URL",
] as const;

export default function handler(_req: any, res: any) {
  const env = Object.fromEntries(
    requiredEnv.map((name) => [name, Boolean(process.env[name])]),
  );

  return res.status(200).json({
    ok: Object.values(env).every(Boolean),
    env,
    node: process.version,
  });
}
