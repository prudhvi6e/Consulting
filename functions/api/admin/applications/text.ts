// GET /api/admin/applications/text?key=applications/...  -> { text }  (session required)
// Extracts resume text with Workers AI's document converter so the screening assistant can read it.
import { type CmsEnv, json, bad, requireAdmin } from "../../_cms";

type Env = CmsEnv & { AI?: { toMarkdown: (docs: { name: string; blob: Blob }[]) => Promise<{ name: string; data: string }[]> } };

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  if (!env.AI?.toMarkdown) return bad("AI is not configured on this deployment.", 503);
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!key.startsWith("applications/")) return bad("Invalid key");
  const cached = await env.CMS.get(`resume-text:${key}`);
  if (cached) return json({ text: cached });
  const obj = await env.MEDIA.get(key);
  if (!obj) return bad("Not found", 404);
  const blob = new Blob([await obj.arrayBuffer()], { type: "application/pdf" });
  const [res] = await env.AI.toMarkdown([{ name: key.split("/").pop() || "resume.pdf", blob }]);
  const text = (res?.data || "").slice(0, 30_000);
  if (text) await env.CMS.put(`resume-text:${key}`, text, { expirationTtl: 60 * 60 * 24 * 30 });
  return json({ text });
};
