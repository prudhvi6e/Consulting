// Creates all content collections, file relations, the services↔groups o2m, and
// grants the Public role read access. Idempotent-ish: "already exists" is ignored.
// Run after `directus start` is up: node setup.mjs
import { readFileSync } from "node:fs";

const BASE = process.env.CMS_URL || "http://localhost:8055";
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const E = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim() || "";

let token = "";
async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    const msg = json?.errors?.[0]?.message || text;
    const e = new Error(`${method} ${path} → ${res.status}: ${msg}`);
    e.status = res.status; e.msg = msg;
    throw e;
  }
  return json.data;
}
const ignoreExists = (e) => {
  if (e.status && (/(exists|duplicate|already)/i.test(e.msg || ""))) { console.log("  skip (exists):", e.msg?.slice(0, 60)); return; }
  throw e;
};

// ---- field builders ----
const id = () => ({ field: "id", type: "integer", schema: { is_primary_key: true, has_auto_increment: true }, meta: { hidden: true } });
const str = (field, opts = {}) => ({ field, type: "string", meta: { interface: "input", ...opts.meta }, schema: { default_value: opts.default ?? null } });
const txt = (field, iface = "input-multiline") => ({ field, type: "text", meta: { interface: iface } });
const bool = (field, def = false) => ({ field, type: "boolean", schema: { default_value: def }, meta: { interface: "boolean" } });
const int = (field, opts = {}) => ({ field, type: "integer", meta: { interface: "input", hidden: !!opts.hidden }, schema: { default_value: opts.default ?? null } });
const sortField = () => ({ field: "sort", type: "integer", meta: { interface: "input", hidden: true } });
const json = (field) => ({ field, type: "json", meta: { interface: "tags", special: ["cast-json"] } });
const file = (field) => ({ field, type: "uuid", meta: { interface: "file-image", special: ["file"] }, schema: {} });
const ts = (field) => ({ field, type: "timestamp", meta: { interface: "datetime" } });

async function makeCollection(def) {
  console.log("collection:", def.collection);
  try {
    await api("POST", "/collections", {
      collection: def.collection,
      schema: {},
      meta: { icon: def.icon || "article", singleton: !!def.singleton, sort_field: def.sortable ? "sort" : null, note: def.note || null },
      fields: def.fields,
    });
  } catch (e) { ignoreExists(e); }
}
async function makeRelation(rel) {
  try { await api("POST", "/relations", rel); }
  catch (e) { ignoreExists(e); }
}

(async () => {
  token = (await api("POST", "/auth/login", { email: E("ADMIN_EMAIL"), password: E("ADMIN_PASSWORD") })).access_token
    ?? (await (async () => { throw new Error("login failed"); })());

  // --- collections ---
  await makeCollection({ collection: "site_settings", icon: "settings", singleton: true, fields: [
    id(), str("companyName"), str("tagline"), txt("address"), str("phone"), str("email"),
    txt("workingHours"), txt("mapEmbedUrl"), str("linkedin"), str("twitter"), str("facebook"), str("instagram"),
  ]});

  await makeCollection({ collection: "hero_slides", icon: "view_carousel", sortable: true, fields: [
    id(), str("badge"), str("titleTop"), str("titleAccent"), txt("desc"), file("image"), bool("showWater", false), sortField(),
  ]});

  await makeCollection({ collection: "capabilities", icon: "grid_view", sortable: true, fields: [
    id(), str("title"), txt("desc"), file("image"), str("icon"), str("span"), bool("big", false), sortField(),
  ]});

  await makeCollection({ collection: "industries", icon: "factory", sortable: true, fields: [
    id(), str("name"), file("image"), str("icon"), sortField(),
  ]});

  await makeCollection({ collection: "service_groups", icon: "category", sortable: true, fields: [
    id(), str("category"), sortField(),
  ]});

  await makeCollection({ collection: "services", icon: "design_services", sortable: true, fields: [
    id(), str("title"), str("icon"), txt("desc"), bool("featured", false), json("points"),
    int("group", { hidden: true }), sortField(),
  ]});

  await makeCollection({ collection: "team_members", icon: "groups", sortable: true, fields: [
    id(), str("name"), str("role"), file("image"), txt("desc"), str("memberType"), sortField(),
  ]});

  await makeCollection({ collection: "stats", icon: "numbers", sortable: true, fields: [
    id(), int("value"), str("suffix"), str("label"), sortField(),
  ]});

  await makeCollection({ collection: "client_logos", icon: "image", sortable: true, fields: [
    id(), file("image"), sortField(),
  ]});

  await makeCollection({ collection: "articles", icon: "feed", fields: [
    id(), str("title"), str("slug"), txt("excerpt"), txt("body", "input-rich-text-md"), file("cover"),
    str("author"), ts("publishedAt"), str("status", { default: "published" }),
  ]});

  // --- file relations (link uuid fields to directus_files) ---
  const fileFields = [
    ["hero_slides", "image"], ["capabilities", "image"], ["industries", "image"],
    ["team_members", "image"], ["client_logos", "image"], ["articles", "cover"],
  ];
  for (const [collection, field] of fileFields) {
    console.log("file relation:", collection + "." + field);
    await makeRelation({ collection, field, related_collection: "directus_files", schema: { on_delete: "SET NULL" }, meta: { sort_field: null } });
  }

  // --- services -> service_groups (m2o) + service_groups.services (o2m) ---
  console.log("relation: services.group -> service_groups (o2m services)");
  await makeRelation({
    collection: "services", field: "group", related_collection: "service_groups",
    schema: { on_delete: "SET NULL" },
    meta: { one_field: "services", sort_field: "sort", one_deselect_action: "nullify" },
  });

  // --- grant Public read on content collections ---
  const policies = await api("GET", "/policies?limit=-1");
  const pub = policies.find((p) => /public/i.test(p.name) || p.icon === "public");
  if (!pub) throw new Error("public policy not found");
  const collections = ["site_settings","hero_slides","capabilities","industries","service_groups","services","team_members","stats","client_logos","articles","directus_files"];
  for (const collection of collections) {
    console.log("public read:", collection);
    try {
      await api("POST", "/permissions", { policy: pub.id, collection, action: "read", fields: ["*"], permissions: {}, validation: {} });
    } catch (e) { ignoreExists(e); }
  }

  console.log("\n✅ schema + permissions done");
})().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
