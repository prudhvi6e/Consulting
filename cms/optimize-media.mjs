#!/usr/bin/env node
// Re-encodes every image referenced by CMS content as WebP at a sensible width, uploads the
// optimised copies to R2 and rewrites the content to point at them.  Safe to re-run.
//
//   node cms/optimize-media.mjs https://psrao-consulting.pages.dev
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const BASE = (process.argv[2] || "https://psrao-consulting.pages.dev").replace(/\/$/, "");
let password = process.env.ADMIN_PASSWORD;
const envFile = path.join(os.homedir(), ".config/psrao/admin.env");
if (!password && existsSync(envFile)) password = (readFileSync(envFile, "utf8").match(/^ADMIN_PASSWORD='?([^'\n]+)/m) || [])[1];
if (!password) { console.error("ADMIN_PASSWORD missing"); process.exit(1); }

let cookie = "";
async function api(method, p, body, form) {
  const res = await fetch(BASE + p, { method, headers: { ...(form || body == null ? {} : { "Content-Type": "application/json" }), Cookie: cookie }, body: form ? body : body == null ? undefined : JSON.stringify(body) });
  const sc = res.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
  if (!res.ok) throw new Error(method + " " + p + " → " + res.status + " " + (await res.text()).slice(0, 200));
  const ct = res.headers.get("content-type") || "";
  return ct.includes("json") ? res.json() : res.arrayBuffer();
}

// width budget per folder (CSS px * ~1.5 for retina without going overboard)
const WIDTH = { hero: 1600, capabilities: 900, industries: 700, team: 600, clients: 320, uploads: 1200 };

const cache = new Map();
async function optimise(url) {
  if (!url || !url.startsWith("/api/media/")) return url;
  if (/-opt-[0-9a-f]{8}\.webp$/.test(url)) return url; // already optimised
  if (cache.has(url)) return cache.get(url);
  const key = url.slice("/api/media/".length);
  const folder = key.split("/")[0];
  const maxW = WIDTH[folder] || 1200;
  const buf = Buffer.from(await api("GET", url));
  const img = sharp(buf, { animated: false });
  const meta = await img.metadata();
  const isLogo = folder === "clients";
  let pipeline = img.rotate();
  if ((meta.width || 0) > maxW) pipeline = pipeline.resize({ width: maxW, withoutEnlargement: true });
  // logos keep alpha and get lossless-ish quality; photos get good lossy quality
  const out = await pipeline.webp(isLogo ? { quality: 90, alphaQuality: 100, effort: 6 } : { quality: 78, effort: 6 }).toBuffer();
  const form = new FormData();
  const base = path.basename(key).replace(/\.[^.]+$/, "").replace(/-[0-9a-f]{8}$/, "") + "-opt";
  form.append("file", new Blob([out], { type: "image/webp" }), base + ".webp");
  form.append("folder", folder);
  const r = await api("POST", "/api/admin/media", form, true);
  // mobile variant for large banners: same key with "-w800" before the extension; the site's
  // srcset points at it, so it must exist for every hero/capability image.
  if (folder === "hero" || folder === "capabilities") {
    const small = await sharp(buf).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 76, effort: 6 }).toBuffer();
    const f2 = new FormData(); f2.append("file", new Blob([small], { type: "image/webp" }), base + ".webp"); f2.append("folder", folder); f2.append("key", r.key.replace(/\.webp$/, "-w800.webp"));
    await api("POST", "/api/admin/media", f2, true);
  }
  const saved = Math.round((1 - out.length / buf.length) * 100);
  console.log(`  ${key}  ${Math.round(buf.length / 1024)}KB → ${Math.round(out.length / 1024)}KB (${saved}%)  ${meta.width}px → ${Math.min(meta.width || 0, maxW)}px`);
  cache.set(url, r.url);
  return r.url;
}

(async () => {
  await api("POST", "/api/admin/login", { password });
  console.log("logged in to", BASE);
  const plan = [
    ["hero", (x) => x.image, (x, v) => (x.image = v)],
    ["capabilities", (x) => x.image, (x, v) => (x.image = v)],
    ["industries", (x) => x.image, (x, v) => (x.image = v)],
    ["team", (x) => x.image, (x, v) => (x.image = v)],
    ["client_logos", (x) => x.image, (x, v) => (x.image = v)],
  ];
  const oldKeys = new Set();
  for (const [name, get, set] of plan) {
    const list = await api("GET", "/api/admin/content/" + name);
    if (!Array.isArray(list)) continue;
    console.log(name);
    for (const item of list) { const before = get(item); const after = await optimise(before); if (after !== before) { set(item, after); oldKeys.add(before.slice("/api/media/".length)); } }
    await api("PUT", "/api/admin/content/" + name, list);
  }
  // remove superseded originals
  for (const k of oldKeys) { try { await api("DELETE", "/api/admin/media?key=" + encodeURIComponent(k)); } catch {} }
  console.log(`\n✅ optimised ${cache.size} images, removed ${oldKeys.size} originals`);
})().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
