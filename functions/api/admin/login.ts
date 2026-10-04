// POST /api/admin/login { password } -> sets session cookie
import { type CmsEnv, json, bad, verifyPassword, createSessionCookie, currentPasswordHash } from "../_cms";

export const onRequestPost: PagesFunction<CmsEnv> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) return bad("Admin is not configured on this deployment.", 503);
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = typeof body.password === "string" ? body.password : "";
  if (!password) return bad("Password required");
  const ok = await verifyPassword(password, (await currentPasswordHash(env))!);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // slow brute force a little
    return bad("Incorrect password", 401);
  }
  const user = env.ADMIN_USER || "admin";
  return json({ ok: true, user }, 200, { "Set-Cookie": await createSessionCookie(env, user) });
};
