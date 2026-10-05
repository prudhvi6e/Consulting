// Shared helpers for the built-in CMS (KV content + R2 media + cookie-session auth).
// Everything here is Web-standard (fetch, Web Crypto) — no Node APIs.

export type CmsEnv = {
  CMS: KVNamespace;
  MEDIA: R2Bucket;
  ADMIN_PASSWORD_HASH?: string; // "pbkdf2$<iterations>$<saltB64>$<hashB64>"
  ADMIN_SESSION_SECRET?: string; // random string; HMAC key for session cookies
  ADMIN_USER?: string; // display/login name, default "admin"
};

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });

export const bad = (msg: string, status = 400) => json({ error: msg }, status);

// ---------------------------------------------------------------- collections
// Every collection is stored as ONE KV value: `content:<name>` → JSON.
// Small site, few editors → simplest possible model; a write replaces the whole list.
export const COLLECTIONS = [
  "settings",
  "hero",
  "capabilities",
  "industries",
  "service_groups",
  "team",
  "stats",
  "about_stats",
  "client_logos",
  "articles",
  "events",
  "jobs",
  "applications",
  "case_studies",
  "testimonials",
] as const;
export type Collection = (typeof COLLECTIONS)[number];
export const isCollection = (s: string): s is Collection => (COLLECTIONS as readonly string[]).includes(s);

export const contentKey = (c: Collection) => `content:${c}`;

export async function readCollection<T = unknown>(env: CmsEnv, c: Collection): Promise<T | null> {
  return (await env.CMS.get(contentKey(c), "json")) as T | null;
}
export async function writeCollection(env: CmsEnv, c: Collection, value: unknown) {
  await env.CMS.put(contentKey(c), JSON.stringify(value));
  await env.CMS.put("content:_updated", new Date().toISOString());
}

// ---------------------------------------------------------------- crypto utils
const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64url = (s: string) => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);

export async function hashPassword(password: string, iterations = 100_000): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2$${iterations}$${b64(salt)}$${b64(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterStr, saltB64, hashB64] = stored.split("$");
  if (algo !== "pbkdf2") return false;
  const salt = unb64(saltB64);
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: Number(iterStr) }, key, 256));
  const expected = unb64(hashB64);
  if (bits.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < bits.length; i++) diff |= bits[i] ^ expected[i];
  return diff === 0;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(b64(await crypto.subtle.sign("HMAC", key, enc.encode(data))));
}

// ---------------------------------------------------------------- sessions
const COOKIE = "psrao_admin";
const SESSION_TTL_S = 60 * 60 * 24 * 7; // 7 days

export async function createSessionCookie(env: CmsEnv, user: string): Promise<string> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set");
  const payload = b64url(btoa(JSON.stringify({ u: user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S })));
  const sig = await hmac(secret, payload);
  const value = `${payload}.${sig}`;
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_S}`;
}

export const clearSessionCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function getSession(request: Request, env: CmsEnv): Promise<{ user: string } | null> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split(".");
  if (!payload || !sig) return null;
  if ((await hmac(secret, payload)) !== sig) return null;
  try {
    const data = JSON.parse(atob(unb64url(payload))) as { u: string; exp: number };
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return { user: data.u };
  } catch {
    return null;
  }
}

/** Effective password hash: KV override (rotated via /api/admin/password) or the env default. */
export async function currentPasswordHash(env: CmsEnv): Promise<string | null> {
  return (await env.CMS.get("auth:password_hash")) || env.ADMIN_PASSWORD_HASH || null;
}

/** Gate for admin-only endpoints. Returns a Response (401) when not authenticated. */
export async function requireAdmin(request: Request, env: CmsEnv): Promise<Response | null> {
  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) return bad("Admin is not configured on this deployment.", 503);
  const s = await getSession(request, env);
  if (!s) return bad("Unauthorized", 401);
  return null;
}

// ---------------------------------------------------------------- misc
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export const newId = () => crypto.randomUUID();

export type Application = {
  id: string;
  jobId: string | null;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  recentJobTitle: string;
  recentEmployer: string;
  yearsOfExperience: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  message: string;
  resume: string; // R2 key (private; downloaded via /api/admin/applications/resume?key=)
  resumeName: string;
  status: "new" | "shortlisted" | "interview" | "rejected" | "hired";
  createdAt: string;
  notes?: string;
};

export const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};
