// Admin application management (session required).
//   PATCH  /api/admin/applications   { id, status?, notes? }
//   DELETE /api/admin/applications?id=...        (also deletes the resume from R2)
//   GET    /api/admin/applications/resume?key=   (handled in applications/resume.ts)
//   GET    /api/admin/applications/export.csv    (handled in applications/export.ts)
import { type CmsEnv, type Application, json, bad, requireAdmin, readCollection, writeCollection } from "../_cms";

const STATUSES = ["new", "shortlisted", "interview", "rejected", "hired"];

export const onRequestPatch: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const body = (await request.json().catch(() => ({}))) as { id?: string; status?: string; notes?: string };
  if (!body.id) return bad("id required");
  const apps = (await readCollection<Application[]>(env, "applications")) ?? [];
  const a = apps.find((x) => x.id === body.id);
  if (!a) return bad("Not found", 404);
  if (body.status !== undefined) { if (!STATUSES.includes(body.status)) return bad("Invalid status"); a.status = body.status as Application["status"]; }
  if (body.notes !== undefined) a.notes = String(body.notes).slice(0, 4000);
  await writeCollection(env, "applications", apps);
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return bad("id required");
  const apps = (await readCollection<Application[]>(env, "applications")) ?? [];
  const a = apps.find((x) => x.id === id);
  if (!a) return bad("Not found", 404);
  if (a.resume) await env.MEDIA.delete(a.resume).catch(() => {});
  await writeCollection(env, "applications", apps.filter((x) => x.id !== id));
  return json({ ok: true });
};
