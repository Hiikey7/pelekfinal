const fs = require("node:fs");
const dns = require("node:dns/promises");
const { Client } = require("pg");

function readEnvValue(name) {
  const env = fs.readFileSync(".env", "utf8");
  const line = env
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  if (!line) return "";

  const value = line.slice(name.length + 1).trim();
  return value.replace(/^"(.*)"$/, "$1");
}

async function main() {
  const connectionString = readEnvValue("SUPABASE_DATABASE_URL");
  if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL is missing from .env");
  }

  const schema = fs.readFileSync("supabase/schema.sql", "utf8");
  await runSchema(connectionString, schema);

  console.log("Supabase schema applied successfully");
}

async function runSchema(connectionString, schema) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(schema);
    return;
  } catch (error) {
    await client.end().catch(() => {});
    if (error.code !== "ENOTFOUND") throw error;
  }

  const parsed = new URL(connectionString);
  const addresses = await dns.resolve6(parsed.hostname);
  if (!addresses.length) throw new Error(`No IPv6 address found for ${parsed.hostname}`);

  const fallbackClient = new Client({
    host: addresses[0],
    port: Number(parsed.port || 5432),
    database: parsed.pathname.slice(1),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl: {
      rejectUnauthorized: false,
      servername: parsed.hostname,
    },
  });

  try {
    await fallbackClient.connect();
    await fallbackClient.query(schema);
  } finally {
    await fallbackClient.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
