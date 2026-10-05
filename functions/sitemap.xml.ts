// GET /sitemap.xml — built from CMS content so new articles/jobs appear automatically.
type Env = { CMS: KVNamespace };

const SITE = "https://psrao.co.in";
const STATIC: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/team", priority: "0.7", changefreq: "monthly" },
  { path: "/insights", priority: "0.8", changefreq: "weekly" },
  { path: "/careers", priority: "0.6", changefreq: "weekly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
];

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const today = new Date().toISOString().slice(0, 10);
  const updated = ((await env.CMS.get("content:_updated")) || today).slice(0, 10);
  const urls: string[] = STATIC.map((s) => entry(s.path, updated, s.changefreq, s.priority));

  const articles = ((await env.CMS.get("content:articles", "json")) as { slug: string; status?: string; date?: string }[] | null) || [];
  for (const a of articles) if (a.slug && a.status !== "draft") urls.push(entry(`/insights/${a.slug}`, toIso(a.date) || updated, "monthly", "0.7"));

  const jobs = ((await env.CMS.get("content:jobs", "json")) as { id: string; status?: string; expiresOn?: string }[] | null) || [];
  for (const j of jobs) if (j.id && j.status !== "closed" && (!j.expiresOn || j.expiresOn >= today)) urls.push(entry(`/careers/apply/${j.id}`, updated, "weekly", "0.5"));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};

const entry = (path: string, lastmod: string, changefreq: string, priority: string) =>
  `  <url><loc>${SITE}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

function toIso(d?: string): string | null {
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const t = Date.parse(d);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}
