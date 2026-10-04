// GET /api/admin/applications/export.csv (session required)
import { type CmsEnv, type Application, requireAdmin, readCollection } from "../../_cms";
const cols: (keyof Application)[] = ["createdAt", "status", "jobTitle", "name", "email", "phone", "recentJobTitle", "recentEmployer", "yearsOfExperience", "city", "state", "country", "pincode", "message", "notes", "resume"];
const cell = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const onRequestGet: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const apps = (await readCollection<Application[]>(env, "applications")) ?? [];
  const lines = [cols.join(","), ...apps.map((a) => cols.map((c) => cell(a[c])).join(","))];
  return new Response(lines.join("\r\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"` } });
};
