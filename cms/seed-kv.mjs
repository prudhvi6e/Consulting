#!/usr/bin/env node
// Seeds the built-in CMS (KV + R2) with the website's current content and images.
// Safe to re-run: it REPLACES every collection and re-uploads images under seed/.
//
//   node cms/seed-kv.mjs https://psrao-consulting.pages.dev
//
// Needs ADMIN_PASSWORD in the environment (or ~/.config/psrao/admin.env).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dir, "../artifacts/psrao-website/src/assets");
const BASE = (process.argv[2] || "https://psrao-consulting.pages.dev").replace(/\/$/, "");

let password = process.env.ADMIN_PASSWORD;
const envFile = path.join(os.homedir(), ".config/psrao/admin.env");
if (!password && existsSync(envFile)) password = (readFileSync(envFile, "utf8").match(/^ADMIN_PASSWORD='?([^'\n]+)/m) || [])[1];
if (!password) { console.error("ADMIN_PASSWORD missing"); process.exit(1); }

let cookie = "";
async function api(method, p, body, form) {
  const res = await fetch(BASE + p, { method, headers: { ...(form || body == null ? {} : { "Content-Type": "application/json" }), Cookie: cookie }, body: form ? body : body == null ? undefined : JSON.stringify(body) });
  const sc = res.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
  const txt = await res.text();
  if (!res.ok) throw new Error(method + " " + p + " → " + res.status + " " + txt.slice(0, 200));
  return txt ? JSON.parse(txt) : null;
}
const uid = () => crypto.randomUUID();
const mime = (f) => ({ ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" })[path.extname(f).toLowerCase()] || "application/octet-stream";
const uploadCache = new Map();
async function upload(rel, folder) {
  if (uploadCache.has(rel)) return uploadCache.get(rel);
  const abs = path.join(ASSETS, rel);
  const form = new FormData();
  form.append("file", new Blob([readFileSync(abs)], { type: mime(abs) }), path.basename(abs));
  form.append("folder", folder);
  const r = await api("POST", "/api/admin/media", form, true);
  uploadCache.set(rel, r.url);
  process.stdout.write(".");
  return r.url;
}

// ---------------------------------------------------------------- data
const HERO = [
  { badge: "Next-Gen Advisory Firm", titleTop: "Professionals at work", titleAccent: "for you.", desc: "Minding your business as ours. We combine decades of specialized corporate law expertise with AI-augmented workflows to deliver unparalleled corporate governance, restructuring, and compliance solutions.", img: "images/office-abstract.jpg", showWater: true },
  { badge: "Corporate Restructuring", titleTop: "Restructuring built", titleAccent: "for growth.", desc: "Pragmatic, effective strategies that help emerging and mid-cap companies navigate complex transitions, mergers, and reorganizations to unlock lasting value.", img: "images/capability-restructuring.jpg", showWater: false },
  { badge: "Governance & Compliance", titleTop: "Governance you", titleAccent: "can trust.", desc: "Sound ethical standards and superior corporate governance frameworks that keep you compliant, credible, and ready for listing, scrutiny, and what comes next.", img: "images/capability-governance.jpg", showWater: false },
  { badge: "Financial Markets", titleTop: "Capital markets,", titleAccent: "navigated.", desc: "End-to-end advisory across public issues, takeovers, insider trading, securities and FEMA, so you can move on opportunities with confidence and clarity.", img: "images/capability-markets.jpg", showWater: false },
];

const CAPS = [
  { title: "Corporate Restructuring", desc: "Pragmatic, effective restructuring strategies for emerging and mid-cap companies navigating complex transitions, mergers and demergers.", img: "images/capability-restructuring.jpg", icon: "Scale", span: "col-span-2 md:col-span-1 md:row-span-2", big: true },
  { title: "Capital Markets", desc: "Public issues, takeovers, insider trading and securities.", img: "images/capability-markets.jpg", icon: "TrendingUp", span: "", big: false },
  { title: "RBI & FEMA", desc: "Cross-border transactions, overseas investment and approvals.", img: "images/industry-finance.jpg", icon: "Landmark", span: "", big: false },
  { title: "Corporate Governance", desc: "Sound ethical standards and superior governance frameworks for listing compliance and board confidence.", img: "images/capability-governance.jpg", icon: "Briefcase", span: "col-span-2", big: false },
  { title: "Legal Due Diligence", desc: "Meticulous verification of compliance, risks and obligations ahead of strategic investments and mergers.", img: "images/capability-duediligence.jpg", icon: "Shield", span: "col-span-2", big: false },
];

const INDUSTRIES = [
  ["Financial Institutions", "images/industry-finance.jpg", "Landmark"],
  ["Information Technology", "images/industry-tech.jpg", "Cpu"],
  ["Health & Personal Care", "images/industry-healthcare.jpg", "HeartPulse"],
  ["Pharmaceutical", "images/Pharma.jpg", "Pill"],
  ["Manufacturing", "images/industry-manufacturing.jpg", "Factory"],
  ["Construction & Engineering", "images/industry-realestate.jpg", "HardHat"],
  ["Transportation & Infrastructure", "images/Trans & infra.jpg", "Truck"],
  ["Energy", "images/industry-energy.jpg", "Zap"],
  ["Retail & Franchising", "images/industry-retail.jpg", "ShoppingBag"],
  ["Venture Capital & Angel Investors", "images/industry-startup.jpg", "Rocket"],
  ["Agriculture & Plantations", "images/james-baltz-jAt6cN6zl8M-unsplash.jpg", "Sprout"],
  ["Defence", "images/Defence.jpg", "Shield"],
  ["Education", "images/Education.jpg", "GraduationCap"],
  ["Insurance", "images/Insurance.jpg", "Umbrella"],
  ["Media & Entertainment", "images/Entertainment.jpg", "Clapperboard"],
  ["Telecom & Broadcasting", "images/Telecom.jpg", "RadioTower"],
];

const SERVICE_GROUPS = [
  { category: "Secretarial & Governance", services: [
    { title: "Corporate Secretarial Services", icon: "Building2", featured: true, desc: "Responsible for shareholder administration and communication, corporate governance and statutory compliances. Our dynamic team has the experience and acumen to provide complete solutions for all corporate secretarial matters — from incorporation and share capital issues to share transfers, board & shareholder meetings, reports and statutory record maintenance.", points: ["Incorporation of Business Entities", "Issue of Share Capital & Equity Restructuring", "Share Registration & Transfers", "Meetings of Directors & Shareholders", "Reports & Maintenance"] },
    { title: "Corporate Governance Services", icon: "Briefcase", featured: false, desc: "A set of principles, processes, customs, policies and laws affecting the way a corporation is directed, administered or controlled. We help establish sound ethical and professional standards on which the edifice of a corporate is built.", points: [] },
    { title: "Secretarial / Compliance Audit & Certification", icon: "FileCheck", featured: false, desc: "Secretarial audit covers the non-financial aspects of the business and their impact on company performance, verifying compliance of applicable laws, regulations and guidelines — strengthening governance and giving the Board confidence in its compliance posture.", points: [] },
  ]},
  { category: "Capital Markets & Banking", services: [
    { title: "Capital Markets Services", icon: "TrendingUp", featured: true, desc: "We stay updated on the movements and trends in the capital market and provide overall consultancy for Public Issues, Rights Issues and Bonus Issues — covering marketing strategy, timing and pricing, SEBI compliances, prospectus drafting, takeover code, insider trading and securities certifications.", points: ["Public Issue of Equity & Listing", "Takeover Code & Insider Trading", "Securities Compliance & Certifications"] },
    { title: "Banking Services", icon: "Landmark", featured: false, desc: "Diligence Reports and Certification in respect of Consortium / Multiple banking arrangements made by Scheduled Commercial Banks and Urban Co-operative Banks, along with Loan Syndication, Loan Documentation and Registration of Charges.", points: [] },
    { title: "RBI & FEMA Services", icon: "Globe2", featured: false, desc: "Cross-border transactions are the order of the present business era. Overseas investments into India, branch offices, subsidiaries and joint ventures are primarily governed by FEMA — with RBI permissions and approvals. We guide clients end-to-end through these requirements.", points: [] },
  ]},
  { category: "Restructuring & Resolution", services: [
    { title: "Corporate Restructuring Services", icon: "Network", featured: false, desc: "The process of significantly changing a company's business model, management team or financial structure to address challenges and increase shareholder value. We formulate and implement pragmatic, effective strategies across mergers, amalgamations, demergers and acquisitions — keeping the needs of emerging and mid-cap companies in view.", points: [] },
    { title: "Insolvency & Bankruptcy", icon: "Gavel", featured: false, desc: "The Insolvency and Bankruptcy Code, 2016 transformed a fragmented system into an integrated, time-bound platform for resolving insolvency of corporates, firms and individuals. We advise across this framework — IBBI, Adjudicating Authorities and Insolvency Professionals — to protect and recover stakeholder value.", points: [] },
  ]},
  { category: "Advisory, Diligence & IP", services: [
    { title: "Legal Due Diligence", icon: "BookOpen", featured: true, desc: "Our due diligence specialists and legal experts have a proven track record of conducting meticulous due diligence for enterprises of every size — in respect of potential acquisitions, strategic investments, collaborations and joint ventures — issuing clear reports and supporting negotiations and agreements.", points: [] },
    { title: "Regulatory Approvals & Representation", icon: "Stamp", featured: false, desc: "Organizations need to obtain corporate approvals from various government, judicial and quasi-judicial bodies under numerous laws and regulations. We secure these approvals and represent clients before the relevant authorities, ensuring timely and effective outcomes.", points: [] },
    { title: "Intellectual Property Rights", icon: "Lightbulb", featured: false, desc: "Patents, trademarks, copyrights and trade secrets are valuable assets of the company, and legally protecting them from outside use is critical. We help clients identify, register and safeguard their intellectual property.", points: [] },
  ]},
];

const TEAM = [
  { name: "Mr. P S Rao", role: "Founder Partner", img: "brand/p-s-rao.jpg", memberType: "founder", desc: "A Commerce Graduate and a fellow member of Company Secretary with nearly two decades of experience. Expert in Company Law, FEMA, Mergers & Acquisitions, Corporate Restructuring, Joint Ventures, Due Diligence Audits, and Capital Market Issues. Former member of the Secretarial Standards Board of ICSI." },
  { name: "Mr. P Sai Sampath", role: "Director", img: "brand/p-sai-sampath.jpg", memberType: "founder", desc: "A young entrepreneur and a professional in the secretarial sector with over 8 years of experience. He completed his Company Secretary (CS) qualification in 2022 and works closely with the firm's leadership across corporate secretarial and compliance engagements." },
];

const STATS = [
  { value: 60, suffix: "+", label: "Clients Served" },
  { value: 80, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Compliance Reports" },
];

const SETTINGS = {
  companyName: "PS Rao Corporate Solutions Pvt. Ltd.",
  tagline: "Company Secretaries · Hyderabad, India",
  address: "6-3-683/10, Flat-102, Suseela Sadan, Anand Nagar Road, Khairtabad, Hyderabad - 500004, Telangana",
  phone: "+91 40 2335 2185",
  email: "info@psrao.co.in",
  workingHours: "Mon–Fri: 10:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed",
  mapEmbedUrl: "https://www.google.com/maps?q=Anand%20Nagar%20Road%2C%20Khairtabad%2C%20Hyderabad%20500004%2C%20Telangana&output=embed",
  linkedin: "#", twitter: "#", facebook: "#", instagram: "#",
};



function loadArticles() {
  const txt = readFileSync(path.resolve(__dir, "../artifacts/psrao-website/src/data/articles.ts"), "utf8");
  const s = txt.indexOf("= [", txt.indexOf("export const articles")) + 2;
  const e = txt.lastIndexOf("];");
  return eval(txt.slice(s, e + 1));
}
function loadJobs() {
  const txt = readFileSync(path.resolve(__dir, "../artifacts/psrao-website/src/pages/careers.tsx"), "utf8");
  const s = txt.indexOf("= [", txt.indexOf("const ROLES")) + 2;
  const e = txt.indexOf("];", s);
  return eval(txt.slice(s, e + 1));
}

(async () => {
  await api("POST", "/api/admin/login", { password });
  console.log("logged in to", BASE);

  const put = async (name, value) => { const r = await api("PUT", "/api/admin/content/" + name, value); console.log(" ", name, "→", r.count); };
  const withSort = (arr) => arr.map((x, i) => ({ id: uid(), ...x, sort: i }));

  await put("settings", SETTINGS);

  const hero = []; for (const h of HERO) hero.push({ badge: h.badge, titleTop: h.titleTop, titleAccent: h.titleAccent, desc: h.desc, image: await upload(h.img, "hero"), showWater: h.showWater });
  await put("hero", withSort(hero));

  const caps = []; for (const c of CAPS) caps.push({ title: c.title, desc: c.desc, image: await upload(c.img, "capabilities"), icon: c.icon, span: c.span, big: c.big });
  await put("capabilities", withSort(caps));

  const inds = []; for (const [name, img, icon] of INDUSTRIES) inds.push({ name, image: await upload(img, "industries"), icon });
  await put("industries", withSort(inds));

  await put("service_groups", withSort(SERVICE_GROUPS.map((g) => ({ category: g.category, services: g.services.map((s, i) => ({ id: uid(), ...s, sort: i })) }))));

  const team = []; for (const t of TEAM) team.push({ name: t.name, role: t.role, image: await upload(t.img, "team"), desc: t.desc, memberType: t.memberType === "founder" ? "leadership" : "team" });
  await put("team", withSort(team));

  await put("stats", withSort(STATS));

  const logoDir = path.join(ASSETS, "clients");
  const logos = readdirSync(logoDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const logoItems = []; for (const f of logos) logoItems.push({ image: await upload("clients/" + f, "clients") });
  await put("client_logos", withSort(logoItems));

  await put("articles", withSort(loadArticles().map((a) => ({ title: a.title, slug: a.slug, excerpt: a.excerpt, category: a.category, date: a.date, readTime: a.readTime, author: a.author, authorRole: a.authorRole, content: a.content, status: "published" }))));

  await put("jobs", withSort(loadJobs()));

  // Events: import from the firm's legacy feed so nothing is lost when the old host goes away.
  try {
    const rows = await (await fetch("https://api.psrao.co.in/get/eventduedates")).json();
    const events = rows.filter((x) => x && x.eventduedate).map((x) => ({ id: uid(), title: x.title, type: x.typeofdate === "duedate" ? "duedate" : "event", date: new Date(x.eventduedate).toISOString().slice(0, 10), color: x.color || "#2E6BFF" }));
    await put("events", events);
  } catch (e) { console.warn("  events: legacy feed unavailable, skipped (", e.message, ")"); }

  console.log("\n✅ seed complete — open", BASE + "/admin/");
})().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
