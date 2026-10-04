// GET /api/admin/applications/resume?key=applications/... -> PDF (session required; resumes are never public)
import { type CmsEnv, bad, requireAdmin } from "../../_cms";
export const onRequestGet: PagesFunction<CmsEnv> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!key.startsWith("applications/")) return bad("Invalid key");
  const obj = await env.MEDIA.get(key);
  if (!obj) return bad("Not found", 404);
  const name = key.split("/").pop() || "resume.pdf";
  return new Response(await obj.arrayBuffer(), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${name}"`, "Cache-Control": "private, no-store" } });
};
