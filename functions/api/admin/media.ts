// Admin media endpoints (session required).
//   GET    /api/admin/media               -> { items: [{ key, size, uploaded, url }] }
//   POST   /api/admin/media  (multipart "file", optional "folder")  -> { key, url }
//   DELETE /api/admin/media?key=...
import { type CmsEnv, json, bad, requireAdmin, MEDIA_TYPES, slugify, newId } from "../_cms";

const MAX_UPLOAD = 8 * 1024 * 1024; // 8MB

export const onRequestGet: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const items: { key: string; size: number; uploaded: string; url: string; type?: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.MEDIA.list({ cursor, limit: 500, include: ["httpMetadata"] });
    for (const o of page.objects) items.push({ key: o.key, size: o.size, uploaded: o.uploaded.toISOString(), url: `/api/media/${o.key}`, type: o.httpMetadata?.contentType });
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  items.sort((a, b) => b.uploaded.localeCompare(a.uploaded));
  return json({ items });
};

export const onRequestPost: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return bad("file is required");
  if (file.size > MAX_UPLOAD) return bad("File too large (max 8MB)", 413);
  const ext = MEDIA_TYPES[file.type];
  if (!ext) return bad(`Unsupported type ${file.type || "(unknown)"}`, 415);
  const folder = slugify(String(form?.get("folder") || "uploads")) || "uploads";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  const explicit = String(form?.get("key") || "");
  const key = explicit && /^[a-z0-9-]+\/[a-z0-9._-]+$/i.test(explicit) ? explicit : `${folder}/${base}-${newId().slice(0, 8)}.${ext}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return json({ key, url: `/api/media/${key}`, size: file.size, type: file.type }, 201);
};

export const onRequestDelete: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const key = new URL(request.url).searchParams.get("key");
  if (!key) return bad("key required");
  await env.MEDIA.delete(key);
  return json({ ok: true });
};
