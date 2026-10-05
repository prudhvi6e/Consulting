#!/usr/bin/env node
// Pre-renders each route of the built SPA to static HTML so crawlers and social scrapers get
// real content (title, meta, JSON-LD, body text) without executing JS.  The React app then
// hydrates on top.  Runs after `vite build`; needs Playwright's Chromium.
//
//   node scripts/prerender.mjs            (uses live CMS at https://psrao-consulting.pages.dev for /api)
//
// Output: dist/public/<route>/index.html for every route, plus the original index.html for the
// SPA fallback.  _redirects already serves /* → /index.html for anything we did not pre-render.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dir, "../dist/public");
const API_ORIGIN = process.env.PRERENDER_API_ORIGIN || "https://psrao-consulting.pages.dev";
const PORT = 4173 + Math.floor(Math.random() * 500);

// Pristine Vite shell, read once: every route must render from it, not from an already
// pre-rendered index.html (which would carry the home page's markup, cache and preloads).
const SHELL = readFileSync(path.join(DIST, "index.html"));

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain" };

// Static server for dist + proxy /api to the live deployment so pages render real CMS content.
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname.startsWith("/api/")) {
    try {
      const r = await fetch(API_ORIGIN + url.pathname + url.search, { headers: { accept: req.headers.accept || "*/*" } });
      res.writeHead(r.status, { "content-type": r.headers.get("content-type") || "application/octet-stream" });
      res.end(Buffer.from(await r.arrayBuffer()));
    } catch (e) { res.writeHead(502); res.end(String(e)); }
    return;
  }
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!existsSync(file) || statSync(file).isDirectory() || file.endsWith(".html")) {
    res.writeHead(200, { "content-type": "text/html" }); res.end(SHELL); return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

async function routes() {
  const list = ["/", "/about", "/services", "/team", "/insights", "/careers", "/contact"];
  try {
    const arts = await (await fetch(API_ORIGIN + "/api/cms/articles")).json();
    for (const a of arts || []) if (a.slug) list.push(`/insights/${a.slug}`);
  } catch (e) { console.warn("  could not list CMS articles:", e.message); }
  // bundled fallback articles too (in case CMS is empty)
  const src = readFileSync(path.resolve(__dir, "../src/data/articles.ts"), "utf8");
  for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) if (!list.includes(`/insights/${m[1]}`)) list.push(`/insights/${m[1]}`);
  try {
    const jobs = await (await fetch(API_ORIGIN + "/api/cms/jobs")).json();
    for (const j of jobs || []) if (j.id) list.push(`/careers/apply/${j.id}`);
  } catch {}
  return list;
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  // fresh page per route: a long-lived tab accumulates listeners/animation frames from each app instance
  const list = await routes();
  console.log(`pre-rendering ${list.length} routes…`);
  let ok = 0;
  for (const route of list) {
    const page = await ctx.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      // wait for the SEO component to set the canonical (proves the page component mounted)
      await page.waitForSelector('link[rel="canonical"]', { timeout: 10000 }).catch(() => {});
      // scroll through the page so every whileInView reveal has fired, then back to top
      await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(900);
      // snapshot react-query cache (exposed by main.tsx in prerender mode) → window.__CMS__
      const cache = await page.evaluate(() => (window.__QUERY_CACHE__ ? window.__QUERY_CACHE__() : null));
      let html = await page.content();
      html = html.replace(/<script>window\.__CMS__=[\s\S]*?<\/script>/, "").replace(/<link rel="preload" as="image"[^>]*>/g, "");
      if (cache) html = html.replace("</head>", `<script>window.__CMS__=${JSON.stringify(cache).replace(/</g, "\\u003c")}</script></head>`);
      // mark as pre-rendered so the client knows to hydrate rather than re-create
      html = html.replace("<html", '<html data-prerendered="1"');
      // Vite's runtime injects <link rel=modulepreload> for every lazy chunk the page loaded
      // during capture (WebGL hero, chat widget…). Shipping those in the HTML makes the browser
      // fetch them before the LCP image; strip all but the entry's own preloads.
      html = html.replace(/<link rel="modulepreload" as="script"[^>]*>/g, "");
      // preload the LCP image (first fetchpriority="high" <img>) so it starts before CSS/JS parse
      const lcp = /<img[^>]*fetchpriority="high"[^>]*>/.exec(html);
      if (lcp) {
        const src = /src="([^"]+)"/.exec(lcp[0])?.[1];
        const srcset = /srcset="([^"]+)"/.exec(lcp[0])?.[1];
        const sizes = /sizes="([^"]+)"/.exec(lcp[0])?.[1];
        if (src) html = html.replace("</head>", `<link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}" imagesizes="${sizes || "100vw"}"` : ""} fetchpriority="high"></head>`);
      }
      // `route.html` (not `route/index.html`): Cloudflare Pages serves `/x.html` at `/x` with no
      // trailing-slash redirect, so the canonical clean URL is what crawlers fetch.
      const out = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route + ".html");
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, "<!DOCTYPE html>\n" + html.replace(/^<!DOCTYPE html>\s*/i, ""));
      ok++;
      process.stdout.write(".");
    } catch (e) { console.warn(`\n  ✗ ${route}: ${e.message.split("\n")[0]}`); }
    await page.close();
  }
  await browser.close(); server.close();
  console.log(`\n✅ pre-rendered ${ok}/${list.length}`);
})().catch((e) => { console.error(e); process.exit(1); });
