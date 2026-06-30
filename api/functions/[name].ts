import pg from "pg";

const { Pool } = pg;
let pool: pg.Pool | null = null;
let poolConnectionString = "";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  if (req.query.name !== "send-contact-email") {
    return res.status(404).json({ error: { message: "Function not found" } });
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

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: { message: "Name, email, subject, and message are required" },
    });
  }

  try {
    const rows = await dbQuery<{ id: string }>(
      `
      INSERT INTO contact_messages (full_name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [name, email, phone || "", subject, message],
    );

    return res.status(200).json({
      success: true,
      id: rows[0]?.id,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to save contact message",
      },
    });
  }
}
