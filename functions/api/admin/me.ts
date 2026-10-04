// GET /api/admin/me -> { user } | 401
import { type CmsEnv, json, bad, getSession } from "../_cms";
type Env = CmsEnv & { AI?: unknown; OPENAI_API_KEY?: string };
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) return bad("Admin is not configured on this deployment.", 503);
  const s = await getSession(request, env);
  return s ? json({ ...s, ai: !!(env.AI || env.OPENAI_API_KEY) }) : bad("Unauthorized", 401);
};
