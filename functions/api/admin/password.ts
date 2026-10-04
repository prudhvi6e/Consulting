// POST /api/admin/password { current, next } -> rotates the admin password.
// The new hash is stored in KV (key "auth:password_hash") and takes precedence over the env var.
import { type CmsEnv, json, bad, requireAdmin, verifyPassword, hashPassword } from "../_cms";

export const onRequestPost: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const body = (await request.json().catch(() => ({}))) as { current?: string; next?: string };
  const current = body.current ?? "";
  const next = body.next ?? "";
  if (next.length < 10) return bad("New password must be at least 10 characters");
  const stored = (await env.CMS.get("auth:password_hash")) || env.ADMIN_PASSWORD_HASH!;
  if (!(await verifyPassword(current, stored))) return bad("Current password is incorrect", 401);
  await env.CMS.put("auth:password_hash", await hashPassword(next));
  return json({ ok: true });
};
