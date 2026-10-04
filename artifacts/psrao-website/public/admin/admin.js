// PS Rao website admin — schema-driven editor over /api/admin/*.
// No build step; plain ES modules. Keep this file dependency-free.

const $ = (sel, el = document) => el.querySelector(sel);
const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "html") el.innerHTML = v;
    else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// ---------------------------------------------------------------- api
const api = {
  async req(method, url, body, isForm) {
    const res = await fetch(url, {
      method,
      headers: isForm || body == null ? {} : { "Content-Type": "application/json" },
      body: isForm ? body : body == null ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { error: text }; }
    if (res.status === 401 && !url.endsWith("/login")) { state.user = null; render(); throw new Error("Session expired — please sign in again."); }
    if (!res.ok) throw new Error((data && data.error) || `${method} ${url} → ${res.status}`);
    return data;
  },
  me: () => api.req("GET", "/api/admin/me"),
  login: (password) => api.req("POST", "/api/admin/login", { password }),
  logout: () => api.req("POST", "/api/admin/logout"),
  get: (name) => api.req("GET", `/api/admin/content/${name}`),
  put: (name, value) => api.req("PUT", `/api/admin/content/${name}`, value),
  media: () => api.req("GET", "/api/admin/media"),
  upload: (file, folder) => { const fd = new FormData(); fd.append("file", file); fd.append("folder", folder || "uploads"); return api.req("POST", "/api/admin/media", fd, true); },
  del: (key) => api.req("DELETE", `/api/admin/media?key=${encodeURIComponent(key)}`),
  password: (current, next) => api.req("POST", "/api/admin/password", { current, next }),
};

// ---------------------------------------------------------------- toast
let toastTimer;
function toast(msg, kind = "ok") {
  $(".toast")?.remove();
  const t = h("div", { class: `toast ${kind}` }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), kind === "err" ? 6000 : 2500);
}

// ---------------------------------------------------------------- schemas
// field types: text, textarea, number, bool, select, image, lines (textarea→string[]), sections (article body), color, date, services (nested)
const ICONS = ["Shield","Zap","Target","TrendingUp","Building2","Briefcase","Scale","Sprout","HardHat","GraduationCap","Landmark","Rocket","HeartPulse","Cpu","Umbrella","Factory","Clapperboard","Pill","ShoppingBag","RadioTower","Truck","FileText","Globe","Users","Award","BookOpen","Gavel","Handshake","PieChart","Layers","Lock","Search"];

const SCHEMAS = {
  settings: {
    label: "Site settings", group: "General", single: true,
    help: "Company details shown in the header, footer and Contact page.",
    fields: [
      { key: "companyName", label: "Company name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "workingHours", label: "Working hours", type: "text" },
      { key: "mapEmbedUrl", label: "Google Maps embed URL", type: "text", hint: "Google Maps → Share → Embed a map → copy the src=\"…\" URL." },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "twitter", label: "X / Twitter URL", type: "text" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "instagram", label: "Instagram URL", type: "text" },
    ],
  },
  hero: {
    label: "Hero slides", group: "Home page", title: (x) => x.titleTop, sub: (x) => x.titleAccent, thumb: "image", folder: "hero",
    help: "The rotating banner at the top of the home page. Drag to reorder.",
    fields: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "titleTop", label: "Title (first line)", type: "text" },
      { key: "titleAccent", label: "Title (highlighted line)", type: "text" },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "image", label: "Background image", type: "image" },
      { key: "showWater", label: "Show water animation", type: "bool" },
    ],
  },
  capabilities: {
    label: "Capabilities", group: "Home page", title: (x) => x.title, thumb: "image", folder: "capabilities",
    help: "The 'What we do' grid on the home page.",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "icon", label: "Icon", type: "select", options: ICONS },
      { key: "span", label: "Grid span (CSS classes, optional)", type: "text", hint: "e.g. md:col-span-2" },
      { key: "big", label: "Large tile", type: "bool" },
    ],
  },
  industries: {
    label: "Industries", group: "Home page", title: (x) => x.name, thumb: "image", folder: "industries",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "icon", label: "Icon", type: "select", options: ICONS },
    ],
  },
  stats: {
    label: "Home stats", group: "Home page", title: (x) => `${x.value ?? ""}${x.suffix ?? ""}`, sub: (x) => x.label,
    help: "The animated counters on the home page (e.g. 60+ Clients).",
    fields: [
      { key: "value", label: "Number", type: "number" },
      { key: "suffix", label: "Suffix", type: "text", hint: "e.g. + or %" },
      { key: "label", label: "Label", type: "text" },
    ],
  },
  client_logos: {
    label: "Client logos", group: "Home page", title: (x) => (x.image || "").split("/").pop(), thumb: "image", folder: "clients",
    fields: [{ key: "image", label: "Logo", type: "image" }],
  },
  events: {
    label: "Events & due dates", group: "Home page", title: (x) => x.title, sub: (x) => `${x.date || ""} · ${x.type === "duedate" ? "Due date" : "Event"}`, sort: (a, b) => (a.date || "").localeCompare(b.date || ""),
    help: "Compliance calendar on the home page. Sorted by date automatically.",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "type", label: "Type", type: "select", options: [["duedate", "Due date"], ["event", "Event"]] },
      { key: "date", label: "Date", type: "date" },
      { key: "color", label: "Colour", type: "color" },
    ],
    defaults: { type: "duedate", color: "#2E6BFF" },
  },
  service_groups: {
    label: "Services", group: "Pages", title: (x) => x.category, sub: (x) => `${(x.services || []).length} services`,
    help: "Service categories and the services inside each. Drag to reorder categories; services are ordered within a category.",
    fields: [
      { key: "category", label: "Category name", type: "text" },
      { key: "services", label: "Services", type: "services" },
    ],
  },
  team: {
    label: "Team", group: "Pages", title: (x) => x.name, sub: (x) => x.role, thumb: "image", folder: "team",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role / designation", type: "text" },
      { key: "image", label: "Photo", type: "image" },
      { key: "desc", label: "Short bio", type: "textarea" },
      { key: "memberType", label: "Section", type: "select", options: [["leadership", "Leadership"], ["team", "Team"]] },
    ],
    defaults: { memberType: "team" },
  },
  articles: {
    label: "Insights / Articles", group: "Pages", title: (x) => x.title, sub: (x) => `${x.category || ""} · ${x.date || ""}`, chip: (x) => (x.status === "draft" ? "draft" : null),
    help: "Articles on the Insights page. Drafts are hidden from the public site.",
    fields: [
      { key: "title", label: "Title", type: "text", onInput: (item, v) => { if (!item._slugTouched) item.slug = slugify(v); } },
      { key: "slug", label: "URL slug", type: "text", hint: "psrao.co.in/insights/<slug>", onInput: (item) => { item._slugTouched = true; } },
      { key: "status", label: "Status", type: "select", options: [["published", "Published"], ["draft", "Draft"]] },
      { key: "category", label: "Category", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "readTime", label: "Read time", type: "text", hint: "e.g. 5 min read" },
      { key: "author", label: "Author", type: "text" },
      { key: "authorRole", label: "Author role", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Body", type: "sections" },
    ],
    defaults: { status: "published", content: [] },
  },
  jobs: {
    label: "Careers / openings", group: "Pages", title: (x) => x.title, sub: (x) => `${x.department || ""} · ${x.location || ""}`,
    fields: [
      { key: "title", label: "Job title", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "experience", label: "Experience", type: "text", hint: "e.g. 3-5 years" },
      { key: "location", label: "Location", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Full-time", "Part-time", "Internship", "Contract"] },
    ],
    defaults: { location: "Hyderabad", type: "Full-time" },
  },
};
const GROUPS = ["General", "Home page", "Pages"];

// ---------------------------------------------------------------- state
const state = { user: undefined, view: location.hash.slice(1) || "settings", data: {}, dirty: {}, media: null, loading: false };
window.addEventListener("hashchange", () => { state.view = location.hash.slice(1) || "settings"; render(); });
window.addEventListener("beforeunload", (e) => { if (Object.values(state.dirty).some(Boolean)) { e.preventDefault(); e.returnValue = ""; } });

// ---------------------------------------------------------------- views
function render() {
  const app = $("#app");
  app.replaceChildren();
  if (state.user === undefined) { app.append(h("div", { class: "login" }, h("div", { class: "muted" }, "Loading…"))); return; }
  if (!state.user) { app.append(loginView()); return; }
  app.append(shell());
}

function loginView() {
  const pw = h("input", { type: "password", autocomplete: "current-password", placeholder: "Password", required: true });
  const err = h("div", { class: "hint", style: "color:#fca5a5;min-height:1em" });
  const form = h("form", { class: "card", onsubmit: async (e) => {
    e.preventDefault(); err.textContent = ""; btn.disabled = true;
    try { const r = await api.login(pw.value); state.user = r.user; render(); }
    catch (ex) { err.textContent = ex.message; btn.disabled = false; }
  } },
    brand(),
    h("div", { class: "field" }, h("label", {}, "Password"), pw),
    err,
  );
  const btn = h("button", { class: "btn primary", type: "submit" }, "Sign in");
  form.append(btn, h("small", {}, "Content editor for psrao.co.in. Changes go live immediately."));
  return h("div", { class: "login" }, form);
}

const brand = () => h("div", { class: "brand" }, h("div", { class: "mark" }, "PSR"), h("div", {}, h("h1", {}, "PS Rao"), h("small", {}, "Website admin")));

function shell() {
  const side = h("aside", { class: "side" }, brand());
  for (const g of GROUPS) {
    side.append(h("div", { class: "group" }, g));
    for (const [name, s] of Object.entries(SCHEMAS)) if (s.group === g) side.append(h("button", { class: `nav ${state.view === name ? "active" : ""}`, onclick: () => { location.hash = name; } }, s.label, state.dirty[name] ? " •" : ""));
  }
  side.append(h("div", { class: "group" }, "Library"));
  side.append(h("button", { class: `nav ${state.view === "media" ? "active" : ""}`, onclick: () => { location.hash = "media"; } }, "Media"));
  side.append(h("div", { class: "spacer" }));
  side.append(h("a", { class: "nav", href: "/", target: "_blank" }, "View site ↗"));
  side.append(h("button", { class: "nav", onclick: () => { location.hash = "account"; } }, "Account"));
  side.append(h("button", { class: "nav", onclick: async () => { await api.logout(); state.user = null; render(); } }, "Sign out"));
  const main = h("main", { class: "main" });
  if (state.view === "media") mediaView(main);
  else if (state.view === "account") accountView(main);
  else if (SCHEMAS[state.view]) collectionView(main, state.view);
  else { location.hash = "settings"; }
  return h("div", { class: "shell" }, side, main);
}

async function load(name) {
  if (state.data[name] !== undefined) return state.data[name];
  const v = await api.get(name);
  state.data[name] = v ?? (SCHEMAS[name].single ? {} : []);
  return state.data[name];
}

function collectionView(main, name) {
  const s = SCHEMAS[name];
  const saveBtn = h("button", { class: "btn primary", disabled: !state.dirty[name], onclick: () => save(name) }, "Publish changes");
  main.append(h("div", { class: "topbar" }, h("h2", {}, s.label), h("div", { class: "actions" }, h("span", { class: "badge-live" }, h("i"), "live"), saveBtn)));
  if (s.help) main.append(h("div", { class: "help" }, s.help));
  const body = h("div", {}, h("div", { class: "muted" }, "Loading…"));
  main.append(body);
  load(name).then((data) => {
    body.replaceChildren();
    if (s.single) body.append(singleEditor(name, data));
    else body.append(listEditor(name, data));
  }).catch((e) => { body.replaceChildren(h("div", { class: "empty" }, e.message)); });
}

const markDirty = (name) => { if (!state.dirty[name]) { state.dirty[name] = true; const b = $(".topbar .btn.primary"); if (b) b.disabled = false; const nav = [...document.querySelectorAll(".nav")].find((n) => n.textContent.startsWith(SCHEMAS[name].label)); if (nav && !nav.textContent.endsWith("•")) nav.append(" •"); } };

async function save(name) {
  const s = SCHEMAS[name];
  let value = state.data[name];
  if (!s.single) {
    value = value.map((x) => { const { _slugTouched, ...rest } = x; return rest; });
    if (s.sort) value = [...value].sort(s.sort);
    value = value.map((x, i) => ({ ...x, sort: i }));
    state.data[name] = value;
  }
  const btn = $(".topbar .btn.primary"); if (btn) { btn.disabled = true; btn.textContent = "Publishing…"; }
  try { await api.put(name, value); state.dirty[name] = false; toast("Published. The site updates within a minute."); }
  catch (e) { toast(e.message, "err"); state.dirty[name] = true; }
  render();
}

function singleEditor(name, obj) {
  const s = SCHEMAS[name];
  const card = h("div", { class: "card" });
  for (const f of s.fields) card.append(fieldEditor(name, obj, f));
  return card;
}

function listEditor(name, list) {
  const s = SCHEMAS[name];
  const wrap = h("div");
  const listEl = h("div", { class: "list" });
  const addBtn = h("button", { class: "btn", onclick: () => { const item = { id: uid(), ...(s.defaults || {}) }; for (const f of s.fields) if (!(f.key in item)) item[f.key] = f.type === "bool" ? false : f.type === "services" || f.type === "sections" ? [] : f.type === "number" ? 0 : ""; list.unshift(item); markDirty(name); renderList(true); } }, "+ Add");
  wrap.append(h("div", { style: "display:flex;justify-content:flex-end;margin-bottom:12px" }, addBtn), listEl);
  function renderList(openFirst) {
    listEl.replaceChildren();
    if (!list.length) { listEl.append(h("div", { class: "empty" }, "Nothing here yet. Click + Add. (Until you add items, the website shows its built-in defaults.)")); return; }
    list.forEach((item, idx) => listEl.append(itemCard(name, item, idx, list, renderList, openFirst && idx === 0)));
  }
  renderList(false);
  return wrap;
}

function itemCard(name, item, idx, list, rerender, open) {
  const s = SCHEMAS[name];
  const det = h("details", { class: "item", open: open || false, draggable: "true" });
  const thumb = s.thumb && item[s.thumb] ? h("img", { class: "thumb", src: item[s.thumb], alt: "" }) : null;
  const chip = s.chip && s.chip(item) ? h("span", { class: `chip ${s.chip(item)}` }, s.chip(item)) : null;
  const titleEl = h("span", { class: "title" }, s.title ? s.title(item) || "(untitled)" : "(untitled)");
  const subEl = h("span", { class: "sub" }, s.sub ? s.sub(item) || "" : "");
  const summary = h("summary", {},
    s.sort ? null : h("span", { class: "handle", title: "Drag to reorder" }, "⋮⋮"),
    thumb, titleEl, chip, subEl,
    h("button", { class: "btn sm danger", onclick: (e) => { e.preventDefault(); if (confirm(`Delete "${titleEl.textContent}"?`)) { list.splice(idx, 1); markDirty(name); rerender(); } } }, "Delete"),
  );
  const body = h("div", { class: "body" });
  for (const f of s.fields) body.append(fieldEditor(name, item, f, () => { titleEl.textContent = s.title ? s.title(item) || "(untitled)" : ""; subEl.textContent = s.sub ? s.sub(item) || "" : ""; if (thumb && s.thumb) thumb.src = item[s.thumb] || ""; }));
  det.append(summary, body);
  // drag reorder
  if (!s.sort) {
    det.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", String(idx)); det.classList.add("dragging"); });
    det.addEventListener("dragend", () => det.classList.remove("dragging"));
    det.addEventListener("dragover", (e) => e.preventDefault());
    det.addEventListener("drop", (e) => { e.preventDefault(); const from = Number(e.dataTransfer.getData("text/plain")); if (Number.isNaN(from) || from === idx) return; const [moved] = list.splice(from, 1); list.splice(idx, 0, moved); markDirty(name); rerender(); });
  }
  return det;
}

function fieldEditor(name, obj, f, onChange = () => {}) {
  const wrap = h("div", { class: `field ${f.type === "bool" ? "check" : ""}` });
  const set = (v) => { obj[f.key] = v; if (f.onInput) f.onInput(obj, v); markDirty(name); onChange(); };
  const label = h("label", {}, f.label);
  if (f.type === "bool") {
    const inp = h("input", { type: "checkbox", onchange: (e) => set(e.target.checked) }); inp.checked = !!obj[f.key];
    wrap.append(inp, label); return wrap;
  }
  wrap.append(label);
  if (f.type === "text" || f.type === "date" || f.type === "color" || f.type === "number") {
    const inp = h("input", { type: f.type === "text" ? "text" : f.type, oninput: (e) => set(f.type === "number" ? Number(e.target.value) : e.target.value) });
    inp.value = obj[f.key] ?? (f.type === "color" ? "#2E6BFF" : "");
    wrap.append(inp);
  } else if (f.type === "textarea") {
    const ta = h("textarea", { oninput: (e) => set(e.target.value) }); ta.value = obj[f.key] ?? ""; wrap.append(ta);
  } else if (f.type === "select") {
    const sel = h("select", { onchange: (e) => set(e.target.value) });
    sel.append(h("option", { value: "" }, "—"));
    for (const o of f.options) { const [v, l] = Array.isArray(o) ? o : [o, o]; sel.append(h("option", { value: v }, l)); }
    sel.value = obj[f.key] ?? ""; wrap.append(sel);
  } else if (f.type === "image") {
    wrap.append(imageField(name, obj, f, set));
  } else if (f.type === "lines") {
    const ta = h("textarea", { oninput: (e) => set(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean)) });
    ta.value = (obj[f.key] || []).join("\n"); wrap.classList.add("points"); wrap.append(ta, h("div", { class: "hint" }, "One per line."));
  } else if (f.type === "sections") {
    wrap.append(sectionsField(name, obj, f));
  } else if (f.type === "services") {
    wrap.append(servicesField(name, obj, f));
  }
  if (f.hint) wrap.append(h("div", { class: "hint" }, f.hint));
  return wrap;
}

function imageField(name, obj, f, set) {
  const img = h("img", { src: obj[f.key] || "", alt: "" });
  const urlInp = h("input", { type: "text", placeholder: "/api/media/… or https://…", oninput: (e) => { set(e.target.value); img.src = e.target.value; } });
  urlInp.value = obj[f.key] || "";
  const file = h("input", { type: "file", accept: "image/*", style: "display:none", onchange: async (e) => {
    const fl = e.target.files[0]; if (!fl) return;
    upBtn.disabled = true; upBtn.textContent = "Uploading…";
    try { const r = await api.upload(fl, SCHEMAS[name].folder || name); set(r.url); img.src = r.url; urlInp.value = r.url; state.media = null; toast("Uploaded"); }
    catch (ex) { toast(ex.message, "err"); }
    upBtn.disabled = false; upBtn.textContent = "Upload";
  } });
  const upBtn = h("button", { class: "btn sm", type: "button", onclick: () => file.click() }, "Upload");
  const pickBtn = h("button", { class: "btn sm", type: "button", onclick: () => mediaPicker((url) => { set(url); img.src = url; urlInp.value = url; }) }, "Choose from library");
  const clearBtn = h("button", { class: "btn sm", type: "button", onclick: () => { set(""); img.src = ""; urlInp.value = ""; } }, "Clear");
  return h("div", { class: "img-field" }, img, h("div", { class: "controls" }, h("div", { class: "btns" }, upBtn, pickBtn, clearBtn, file), urlInp));
}

function sectionsField(name, obj, f) {
  if (!Array.isArray(obj[f.key])) obj[f.key] = [];
  const list = obj[f.key];
  const wrap = h("div", { class: "sections" });
  const draw = () => {
    wrap.replaceChildren();
    list.forEach((sec, i) => {
      const headInp = h("input", { type: "text", placeholder: "Section heading (optional)", oninput: (e) => { sec.heading = e.target.value; markDirty(name); } }); headInp.value = sec.heading || "";
      const ta = h("textarea", { placeholder: "Paragraphs — separate with a blank line.", oninput: (e) => { sec.paragraphs = e.target.value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean); markDirty(name); } }); ta.value = (sec.paragraphs || []).join("\n\n");
      wrap.append(h("div", { class: "section" },
        h("div", { class: "head" }, headInp,
          h("button", { class: "btn sm icon", type: "button", title: "Move up", onclick: () => { if (i > 0) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; markDirty(name); draw(); } } }, "↑"),
          h("button", { class: "btn sm icon", type: "button", title: "Move down", onclick: () => { if (i < list.length - 1) { [list[i + 1], list[i]] = [list[i], list[i + 1]]; markDirty(name); draw(); } } }, "↓"),
          h("button", { class: "btn sm danger", type: "button", onclick: () => { list.splice(i, 1); markDirty(name); draw(); } }, "✕")),
        ta));
    });
    wrap.append(h("button", { class: "btn sm", type: "button", onclick: () => { list.push({ heading: "", paragraphs: [] }); markDirty(name); draw(); } }, "+ Add section"));
  };
  draw();
  return wrap;
}

function servicesField(name, obj, f) {
  if (!Array.isArray(obj[f.key])) obj[f.key] = [];
  const list = obj[f.key];
  const wrap = h("div", { class: "sections" });
  const draw = () => {
    wrap.replaceChildren();
    list.forEach((sv, i) => {
      const det = h("details", { class: "section" });
      const t = h("span", { style: "flex:1" }, sv.title || "(untitled service)");
      det.append(h("summary", { style: "display:flex;gap:8px;align-items:center;cursor:pointer;list-style:none" }, t,
        sv.featured ? h("span", { class: "chip" }, "featured") : null,
        h("button", { class: "btn sm icon", type: "button", onclick: (e) => { e.preventDefault(); if (i > 0) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; markDirty(name); draw(); } } }, "↑"),
        h("button", { class: "btn sm icon", type: "button", onclick: (e) => { e.preventDefault(); if (i < list.length - 1) { [list[i + 1], list[i]] = [list[i], list[i + 1]]; markDirty(name); draw(); } } }, "↓"),
        h("button", { class: "btn sm danger", type: "button", onclick: (e) => { e.preventDefault(); if (confirm(`Delete "${sv.title}"?`)) { list.splice(i, 1); markDirty(name); draw(); } } }, "✕")));
      const sub = [
        { key: "title", label: "Service title", type: "text" },
        { key: "icon", label: "Icon", type: "select", options: ICONS },
        { key: "desc", label: "Description", type: "textarea" },
        { key: "points", label: "Key points", type: "lines" },
        { key: "featured", label: "Featured", type: "bool" },
      ];
      const body = h("div", { style: "display:grid;gap:12px;padding-top:8px" });
      for (const sf of sub) body.append(fieldEditor(name, sv, sf, () => { t.textContent = sv.title || "(untitled service)"; }));
      det.append(body);
      wrap.append(det);
    });
    wrap.append(h("button", { class: "btn sm", type: "button", onclick: () => { list.push({ id: uid(), title: "", icon: "", desc: "", points: [], featured: false }); markDirty(name); draw(); const last = wrap.querySelectorAll("details"); if (last.length) last[last.length - 1].open = true; } }, "+ Add service"));
  };
  draw();
  return wrap;
}

// ---------------------------------------------------------------- media
async function loadMedia() { if (!state.media) state.media = (await api.media()).items; return state.media; }
const fmtSize = (n) => (n > 1e6 ? (n / 1e6).toFixed(1) + " MB" : Math.round(n / 1024) + " KB");

function mediaGrid(items, onPick) {
  const grid = h("div", { class: "media-grid" });
  if (!items.length) grid.append(h("div", { class: "empty", style: "grid-column:1/-1" }, "No files uploaded yet."));
  for (const it of items) {
    const isImg = (it.type || "").startsWith("image/");
    grid.append(h("div", { class: "media-tile", title: it.key, onclick: () => onPick(it) },
      isImg ? h("img", { src: it.url, alt: "", loading: "lazy" }) : h("div", { style: "aspect-ratio:1;display:grid;place-items:center;color:var(--muted)" }, "PDF"),
      h("div", { class: "meta" }, it.key.split("/").pop(), h("br"), fmtSize(it.size))));
  }
  return grid;
}

function uploader(folderDefault, onDone) {
  const folder = h("input", { type: "text", value: folderDefault || "uploads", style: "max-width:200px" });
  const file = h("input", { type: "file", accept: "image/*,application/pdf", multiple: true, style: "display:none", onchange: (e) => doUpload([...e.target.files]) });
  const zone = h("div", { class: "dropzone", onclick: () => file.click(),
    ondragover: (e) => { e.preventDefault(); zone.classList.add("over"); }, ondragleave: () => zone.classList.remove("over"),
    ondrop: (e) => { e.preventDefault(); zone.classList.remove("over"); doUpload([...e.dataTransfer.files]); } },
    "Drop files here or click to upload (JPG, PNG, WebP, SVG, PDF · max 8 MB)");
  async function doUpload(files) {
    for (const fl of files) {
      zone.textContent = `Uploading ${fl.name}…`;
      try { await api.upload(fl, folder.value); } catch (ex) { toast(ex.message, "err"); }
    }
    zone.textContent = "Drop files here or click to upload (JPG, PNG, WebP, SVG, PDF · max 8 MB)";
    state.media = null; toast("Uploaded"); onDone();
  }
  return h("div", { style: "display:grid;gap:10px;margin-bottom:16px" }, h("div", { class: "field", style: "max-width:260px" }, h("label", {}, "Folder"), folder), zone, file);
}

function mediaView(main) {
  main.append(h("div", { class: "topbar" }, h("h2", {}, "Media library")));
  const body = h("div", {}, h("div", { class: "muted" }, "Loading…"));
  main.append(body);
  const draw = async () => {
    const items = await loadMedia();
    body.replaceChildren(uploader("uploads", draw), mediaGrid(items, (it) => {
      const bg = h("div", { class: "modal-bg", onclick: (e) => { if (e.target === bg) bg.remove(); } });
      bg.append(h("div", { class: "modal", style: "width:min(560px,100%)" },
        h("header", {}, h("h3", {}, it.key.split("/").pop()), h("button", { class: "btn sm", onclick: () => bg.remove() }, "Close")),
        h("div", { class: "content", style: "display:grid;gap:12px" },
          (it.type || "").startsWith("image/") ? h("img", { src: it.url, style: "max-width:100%;border-radius:8px" }) : null,
          h("div", { class: "field" }, h("label", {}, "URL (use this in any image field)"), h("input", { type: "text", readonly: true, value: it.url, onclick: (e) => e.target.select() })),
          h("div", { class: "muted" }, `${fmtSize(it.size)} · ${new Date(it.uploaded).toLocaleString()}`),
          h("div", {}, h("button", { class: "btn danger", onclick: async () => { if (!confirm("Delete this file? Anywhere it is used will show a broken image.")) return; await api.del(it.key); state.media = null; bg.remove(); toast("Deleted"); draw(); } }, "Delete file")))));
      document.body.append(bg);
    }));
  };
  draw().catch((e) => body.replaceChildren(h("div", { class: "empty" }, e.message)));
}

function mediaPicker(onPick) {
  const bg = h("div", { class: "modal-bg", onclick: (e) => { if (e.target === bg) bg.remove(); } });
  const content = h("div", { class: "content" }, h("div", { class: "muted" }, "Loading…"));
  bg.append(h("div", { class: "modal" }, h("header", {}, h("h3", {}, "Choose an image"), h("button", { class: "btn sm", onclick: () => bg.remove() }, "Close")), content));
  document.body.append(bg);
  const draw = async () => { const items = (await loadMedia()).filter((x) => (x.type || "").startsWith("image/")); content.replaceChildren(uploader("uploads", draw), mediaGrid(items, (it) => { onPick(it.url); bg.remove(); })); };
  draw().catch((e) => content.replaceChildren(h("div", { class: "empty" }, e.message)));
}

// ---------------------------------------------------------------- account
function accountView(main) {
  main.append(h("div", { class: "topbar" }, h("h2", {}, "Account")));
  const cur = h("input", { type: "password", autocomplete: "current-password" });
  const nxt = h("input", { type: "password", autocomplete: "new-password" });
  const nxt2 = h("input", { type: "password", autocomplete: "new-password" });
  const btn = h("button", { class: "btn primary", type: "submit" }, "Change password");
  main.append(h("form", { class: "card", style: "max-width:460px", onsubmit: async (e) => {
    e.preventDefault();
    if (nxt.value !== nxt2.value) return toast("New passwords do not match", "err");
    btn.disabled = true;
    try { await api.password(cur.value, nxt.value); toast("Password changed"); cur.value = nxt.value = nxt2.value = ""; }
    catch (ex) { toast(ex.message, "err"); }
    btn.disabled = false;
  } },
    h("div", {}, h("div", {}, "Signed in as ", h("b", {}, state.user)), h("small", {}, "Single shared editor account.")),
    h("div", { class: "field" }, h("label", {}, "Current password"), cur),
    h("div", { class: "field" }, h("label", {}, "New password (min 10 characters)"), nxt),
    h("div", { class: "field" }, h("label", {}, "Repeat new password"), nxt2),
    h("div", {}, btn)));
}

// ---------------------------------------------------------------- boot
(async () => {
  try { const me = await api.me(); state.user = me.user; }
  catch (e) { state.user = null; if (/not configured/i.test(e.message)) { document.body.innerHTML = `<div class="login"><div class="card"><h1>Admin not configured</h1><p class="muted">${e.message}</p></div></div>`; return; } }
  render();
})();
