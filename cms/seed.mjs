// Seeds all content + uploads the website's existing images into Directus.
// Idempotent: wipes each collection first, then re-creates. Run with Directus up:
//   node seed.mjs
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.CMS_URL || "http://localhost:8055";
const __dir = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dir, "../artifacts/psrao-website/src/assets");
const env = readFileSync(path.join(__dir, ".env"), "utf8");
const E = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim() || "";

let token = "";
async function api(method, p, body) {
  const res = await fetch(BASE + p, {
    method, headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await res.text();
  let j; try { j = t ? JSON.parse(t) : {}; } catch { j = { raw: t }; }
  if (!res.ok) throw new Error(`${method} ${p} → ${res.status}: ${j?.errors?.[0]?.message || t}`);
  return j.data;
}

// ---- file upload (cached by path) ----
const uploadCache = new Map();
const mime = (f) => ({ ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" }[path.extname(f).toLowerCase()] || "application/octet-stream");
async function upload(rel) {
  if (uploadCache.has(rel)) return uploadCache.get(rel);
  const abs = path.join(ASSETS, rel);
  const buf = readFileSync(abs);
  const form = new FormData();
  form.append("file", new Blob([buf], { type: mime(abs) }), path.basename(abs));
  const res = await fetch(BASE + "/files", { method: "POST", headers: { Authorization: "Bearer " + token }, body: form });
  if (!res.ok) throw new Error("upload " + rel + " → " + res.status + " " + (await res.text()).slice(0, 120));
  const id = (await res.json()).data.id;
  uploadCache.set(rel, id);
  return id;
}

async function wipe(collection) {
  const ids = await api("GET", `/items/${collection}?limit=-1&fields=id`);
  if (ids.length) await api("DELETE", `/items/${collection}`, ids.map((r) => r.id));
}
const ensureField = async (collection, field) => { try { await api("POST", `/fields/${collection}`, field); } catch (e) { if (!/exist/i.test(e.message)) throw e; } };

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
  companyName: "PS Rao Corporate Solutions",
  tagline: "Company Secretaries · Hyderabad, India",
  address: "6-3-683/10, Flat-102, Suseela Sadan, Anand Nagar Road, Khairtabad, Hyderabad - 500004, Telangana",
  phone: "+91 40 2335 2185",
  email: "info@psraoassociates.com",
  workingHours: "Mon–Fri: 10:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed",
  mapEmbedUrl: "https://www.google.com/maps?q=Anand%20Nagar%20Road%2C%20Khairtabad%2C%20Hyderabad%20500004%2C%20Telangana&output=embed",
  linkedin: "#", twitter: "#", facebook: "#", instagram: "#",
};

function loadArticles() {
  const txt = readFileSync(path.resolve(__dir, "../artifacts/psrao-website/src/data/articles.ts"), "utf8");
  const s = txt.indexOf("= [", txt.indexOf("export const articles")) + 2; // the array's opening '['
  const e = txt.lastIndexOf("];");
  // plain object-literal array (no imports/types inside) → safe to evaluate
  return eval(txt.slice(s, e + 1));
}

// ---------------------------------------------------------------- run
(async () => {
  token = (await api("POST", "/auth/login", { email: E("ADMIN_EMAIL"), password: E("ADMIN_PASSWORD") })).access_token;
  console.log("logged in");

  // extra article fields (collection already created in setup.mjs)
  for (const f of [
    { field: "category", type: "string", meta: { interface: "input" } },
    { field: "date", type: "string", meta: { interface: "input" } },
    { field: "readTime", type: "string", meta: { interface: "input" } },
    { field: "authorRole", type: "string", meta: { interface: "input" } },
    { field: "content", type: "json", meta: { interface: "input-code", options: { language: "json" } } },
  ]) await ensureField("articles", f);

  console.log("wiping…");
  for (const c of ["hero_slides","capabilities","industries","services","service_groups","team_members","stats","client_logos","articles"]) await wipe(c);

  console.log("site_settings"); await api("PATCH", "/items/site_settings", SETTINGS);

  console.log("hero_slides");
  for (let i = 0; i < HERO.length; i++) { const h = HERO[i]; await api("POST", "/items/hero_slides", { badge: h.badge, titleTop: h.titleTop, titleAccent: h.titleAccent, desc: h.desc, image: await upload(h.img), showWater: h.showWater, sort: i + 1 }); }

  console.log("capabilities");
  for (let i = 0; i < CAPS.length; i++) { const c = CAPS[i]; await api("POST", "/items/capabilities", { title: c.title, desc: c.desc, image: await upload(c.img), icon: c.icon, span: c.span, big: c.big, sort: i + 1 }); }

  console.log("industries");
  for (let i = 0; i < INDUSTRIES.length; i++) { const [name, img, icon] = INDUSTRIES[i]; await api("POST", "/items/industries", { name, image: await upload(img), icon, sort: i + 1 }); }

  console.log("service_groups + services");
  for (let g = 0; g < SERVICE_GROUPS.length; g++) {
    const grp = SERVICE_GROUPS[g];
    const created = await api("POST", "/items/service_groups", { category: grp.category, sort: g + 1 });
    for (let s = 0; s < grp.services.length; s++) { const sv = grp.services[s]; await api("POST", "/items/services", { title: sv.title, icon: sv.icon, desc: sv.desc, featured: sv.featured, points: sv.points, group: created.id, sort: s + 1 }); }
  }

  console.log("team_members");
  for (let i = 0; i < TEAM.length; i++) { const t = TEAM[i]; await api("POST", "/items/team_members", { name: t.name, role: t.role, image: await upload(t.img), desc: t.desc, memberType: t.memberType, sort: i + 1 }); }

  console.log("stats");
  for (let i = 0; i < STATS.length; i++) { const s = STATS[i]; await api("POST", "/items/stats", { value: s.value, suffix: s.suffix, label: s.label, sort: i + 1 }); }

  console.log("client_logos");
  const logoDir = path.join(ASSETS, "clients");
  const logos = readdirSync(logoDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (let i = 0; i < logos.length; i++) await api("POST", "/items/client_logos", { image: await upload("clients/" + logos[i]), sort: i + 1 });
  console.log("  logos:", logos.length);

  console.log("articles");
  const arts = loadArticles();
  for (const a of arts) await api("POST", "/items/articles", { title: a.title, slug: a.slug, excerpt: a.excerpt, category: a.category, date: a.date, readTime: a.readTime, author: a.author, authorRole: a.authorRole, content: a.content, status: "published" });
  console.log("  articles:", arts.length);

  console.log("\n✅ seed complete");
})().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
