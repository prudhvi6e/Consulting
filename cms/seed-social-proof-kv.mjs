// Writes the example drafts from seed-social-proof.mjs straight into KV via the Cloudflare API
// (no admin login needed).  Env: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN.
import { readFileSync } from "node:fs";
const id = process.env.CLOUDFLARE_ACCOUNT_ID, t = process.env.CLOUDFLARE_API_TOKEN;
if (!id || !t) { console.error("CLOUDFLARE_* env missing"); process.exit(1); }
const src = readFileSync(new URL("./seed-social-proof.mjs", import.meta.url), "utf8");
const grab = (n) => src.match(new RegExp("const " + n + " = (\\[[\\s\\S]*?\\n\\]);"))[1];
const uid = () => crypto.randomUUID();
const caseStudies = eval(grab("caseStudies")), testimonials = eval(grab("testimonials"));
const H = { Authorization: "Bearer " + t };
const d = await (await fetch(`https://api.cloudflare.com/client/v4/accounts/${id}/storage/kv/namespaces`, { headers: H })).json();
const ns = d.result.find((n) => n.title.includes("CMS")).id;
for (const [k, v] of [["content:case_studies", caseStudies], ["content:testimonials", testimonials]]) {
  const cur = await fetch(`https://api.cloudflare.com/client/v4/accounts/${id}/storage/kv/namespaces/${ns}/values/${k}`, { headers: H });
  if (cur.ok && (await cur.json())?.length) { console.log(k, "already has data — skipped"); continue; }
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${id}/storage/kv/namespaces/${ns}/values/${k}`, { method: "PUT", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(v) });
  console.log(k, r.status, v.length, "items");
}
