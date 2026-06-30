import { AppRole, createSessionToken } from "./auth-utils";

type LoginUser = {
  id: string;
  email: string;
  password: string;
  roles: AppRole[];
};

function configuredUsers(): LoginUser[] {
  const users: LoginUser[] = [];

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    users.push({
      id: "admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      roles: ["admin", "properties", "blogs"],
    });
  }

  if (
    process.env.PROPERTY_BLOG_ADMIN_EMAIL &&
    process.env.PROPERTY_BLOG_ADMIN_PASSWORD
  ) {
    users.push({
      id: "property-blog-admin",
      email: process.env.PROPERTY_BLOG_ADMIN_EMAIL,
      password: process.env.PROPERTY_BLOG_ADMIN_PASSWORD,
      roles: ["properties", "blogs"],
    });
  }

  return users;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: { message: "Method not allowed" } });
    }

    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    const users = configuredUsers();
    if (!users.length || !sessionSecret) {
      return res.status(500).json({
        error: {
          message:
            "Admin auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
        },
      });
    }

    const { email, password } =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const user = users.find(
      (item) => item.email === email && item.password === password,
    );

    if (!user) {
      return res.status(401).json({ error: { message: "Invalid email or password" } });
    }

    const accessToken = createSessionToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    return res.status(200).json({
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        app_metadata: {
          role: user.roles.includes("admin") ? "admin" : "limited_admin",
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Admin login failed",
      },
    });
  }
}
