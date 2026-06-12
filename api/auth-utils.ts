import { createHmac, timingSafeEqual } from "node:crypto";

export type AppRole = "admin" | "properties" | "blogs";

export type AuthSession = {
  id: string;
  email: string;
  roles: AppRole[];
};

const tokenVersion = "v1";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createSessionToken(session: AuthSession) {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");

  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = sign(payload, secret);
  return `${tokenVersion}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): AuthSession | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  if (token === secret) {
    return {
      id: "admin",
      email: process.env.ADMIN_EMAIL || "admin",
      roles: ["admin", "properties", "blogs"],
    };
  }

  const [version, payload, signature] = token.split(".");
  if (version !== tokenVersion || !payload || !signature) return null;

  const expected = sign(payload, secret);
  if (!signaturesMatch(signature, expected)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as AuthSession;
    if (!parsed.id || !parsed.email || !Array.isArray(parsed.roles)) return null;
    return {
      id: parsed.id,
      email: parsed.email,
      roles: parsed.roles.filter((role): role is AppRole =>
        ["admin", "properties", "blogs"].includes(role),
      ),
    };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: any) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return verifySessionToken(token);
}

export function hasRole(session: AuthSession | null, role: AppRole) {
  return !!session && (session.roles.includes("admin") || session.roles.includes(role));
}
