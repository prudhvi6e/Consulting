#!/usr/bin/env node
// Generates the 800px "-w800.webp" mobile variants for every hero/capabilities image already in
// R2 (one-off backfill; cms/optimize-media.mjs creates them for new images).  Usage:
//   node cms/backfill-w800.mjs https://psrao-consulting.pages.dev
import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const BASE = (process.argv[2] || "https://psrao-consulting.pages.dev").replace(/\/$/, "");
const envFile = join(homedir(), ".config/psrao/admin.env");
let password = process.env.ADMIN_PASSWORD;
if (!password && existsSync(envFile)) password = (readFileSync(envFile, "utf8").match(/^ADMIN_PASSWORD='?([^'\n]+)/m) || [])[1];
if (!password) { console.error("ADMIN_PASSWORD missing"); process.exit(1); }

let cookie = "";
async function api(method, p, body, form) {
  const res = await fetch(BASE + p, { method, headers: { ...(form || body == null ? {} : { "Content-Type": "application/json" }), Cookie: cookie }, body: form ? body : body == null ? undefined : JSON.stringify(body) });
  const sc = res.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status} ${await res.text()}`);
  return res.headers.get("content-type")?.includes("json") ? res.json() : res.text();
}

await api("POST", "/api/admin/login", { password });
const media = await api("GET", "/api/admin/media");
const list = (Array.isArray(media) ? media : media.items || []);
const keys = new Set(list.map((m) => m.key));
const targets = [...keys].filter((k) => /^(hero|capabilities)\/.+\.webp$/.test(k) && !/-w800\.webp$/.test(k) && !keys.has(k.replace(/\.webp$/, "-w800.webp")));
console.log(`${targets.length} images need a -w800 variant`);
for (const key of targets) {
  const res = await fetch(`${BASE}/api/media/${key}`); const buf = Buffer.from(await res.arrayBuffer());
  const small = await sharp(buf).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 76, effort: 6 }).toBuffer();
  const f = new FormData(); f.append("file", new Blob([small], { type: "image/webp" }), key.split("/").pop()); f.append("folder", key.split("/")[0]); f.append("key", key.replace(/\.webp$/, "-w800.webp"));
  const r = await api("POST", "/api/admin/media", f, true);
  console.log(`  ${key} -> ${r.key || "?"} (${Math.round(buf.length / 1024)}KB -> ${Math.round(small.length / 1024)}KB)`);
}
console.log("done");
