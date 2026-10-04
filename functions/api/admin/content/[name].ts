// Admin content endpoints (session required).
//   GET /api/admin/content/<name>   -> full collection incl. drafts
//   PUT /api/admin/content/<name>   -> replace collection (body = JSON value)
import { type CmsEnv, isCollection, json, bad, requireAdmin, readCollection, writeCollection } from "../../_cms";

const MAX_BYTES = 2_000_000; // KV value limit is 25MB; keep content sane

export const onRequestGet: PagesFunction<CmsEnv> = async ({ request, env, params }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const name = String(params.name);
  if (!isCollection(name)) return bad("Unknown collection", 404);
  return json(await readCollection(env, name));
};

export const onRequestPut: PagesFunction<CmsEnv> = async ({ request, env, params }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const name = String(params.name);
  if (!isCollection(name)) return bad("Unknown collection", 404);
  const text = await request.text();
  if (text.length > MAX_BYTES) return bad("Payload too large", 413);
  let value: unknown;
  try { value = JSON.parse(text); } catch { return bad("Invalid JSON"); }
  if (name === "settings") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return bad("settings must be an object");
  } else if (!Array.isArray(value)) {
    return bad(`${name} must be an array`);
  }
  await writeCollection(env, name, value);
  return json({ ok: true, count: Array.isArray(value) ? value.length : 1 });
};
