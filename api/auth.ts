export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !adminPassword || !sessionSecret) {
    return res.status(500).json({
      error: {
        message:
          "Admin auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
      },
    });
  }

  const { email, password } = req.body || {};

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: { message: "Invalid email or password" } });
  }

  return res.status(200).json({
    access_token: sessionSecret,
    user: {
      id: "admin",
      email,
      app_metadata: {
        role: "admin",
      },
    },
  });
}
