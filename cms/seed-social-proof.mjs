#!/usr/bin/env node
// Seeds example Case Studies + Testimonials as DRAFTS (hidden from the public site) so the
// admin shows the shape of each record. Replace them with real ones from the partner.
//   node cms/seed-social-proof.mjs https://psrao-consulting.pages.dev
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const BASE = (process.argv[2] || "https://psrao-consulting.pages.dev").replace(/\/$/, "");
const envFile = join(homedir(), ".config/psrao/admin.env");
let password = process.env.ADMIN_PASSWORD;
if (!password && existsSync(envFile)) password = (readFileSync(envFile, "utf8").match(/^ADMIN_PASSWORD='?([^'\n]+)/m) || [])[1];
if (!password) { console.error("ADMIN_PASSWORD missing"); process.exit(1); }

let cookie = "";
async function api(method, p, body) {
  const res = await fetch(BASE + p, { method, headers: { ...(body == null ? {} : { "Content-Type": "application/json" }), Cookie: cookie }, body: body == null ? undefined : JSON.stringify(body) });
  const sc = res.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status} ${await res.text()}`);
  return res.headers.get("content-type")?.includes("json") ? res.json() : res.text();
}
const uid = () => crypto.randomUUID();

const caseStudies = [
  { id: uid(), status: "draft", title: "EXAMPLE — Fast-track merger closed in 94 days", client: "Listed mid-cap pharma company", sector: "Pharma", metric: "94 days", metricLabel: "from board approval to RD order",
    challenge: "Two wholly-owned subsidiaries had to be folded into the parent before the financial year closed, without the cost and timeline of a full NCLT process.",
    approach: "We structured the scheme under Section 233 of the Companies Act, prepared the board and shareholder documentation, ran the creditor and member approvals, and handled the Regional Director filing and queries end-to-end.",
    outcome: "The merger was sanctioned in 94 days. The client avoided a full NCLT round and completed the consolidation before year-end audit.",
    services: ["Mergers & Amalgamations", "Corporate Restructuring", "Secretarial Compliance"], image: "" },
  { id: uid(), status: "draft", title: "EXAMPLE — Zero observations in SEBI LODR audit", client: "NSE-listed engineering company", sector: "Manufacturing", metric: "0", metricLabel: "qualifications in secretarial audit",
    challenge: "A newly listed company had inherited gaps in its LODR compliance calendar and faced its first secretarial audit under the new disclosure regime.",
    approach: "We rebuilt the compliance calendar, set up disclosure workflows for the board and committees, trained the in-house team, and reviewed every filing for two quarters before the audit.",
    outcome: "The secretarial audit closed with zero qualifications and the company's compliance score on the exchange moved to the top band.",
    services: ["SEBI LODR Compliance", "Secretarial Audit", "Corporate Governance"], image: "" },
  { id: uid(), status: "draft", title: "EXAMPLE — ₹120 Cr FDI round approved without RBI queries", client: "Hyderabad-based SaaS startup", sector: "Technology", metric: "₹120 Cr", metricLabel: "Series B inflow, FEMA-compliant",
    challenge: "An overseas investor round had to close within six weeks, with pricing, valuation reporting and FC-GPR filings under FEMA all on the critical path.",
    approach: "We advised on the instrument structure, coordinated the valuation report, prepared the FC-GPR and annual FLA filings, and liaised with the AD bank so every document was right the first time.",
    outcome: "Funds were received and reported on time with no RBI queries, and the cap table was ready for the next round.",
    services: ["FEMA & RBI Advisory", "Startup Advisory", "Capital Raising"], image: "" },
];

const testimonials = [
  { id: uid(), status: "draft", approved: false, name: "EXAMPLE — A. Sharma", role: "Chief Financial Officer", company: "Listed pharma company", quote: "PS Rao ran our fast-track merger like a project, not a filing. Every approval was ready before we asked, and we closed well ahead of the year-end deadline.", image: "" },
  { id: uid(), status: "draft", approved: false, name: "EXAMPLE — R. Iyer", role: "Company Secretary", company: "NSE-listed engineering company", quote: "They rebuilt our LODR calendar and trained my team. Our first secretarial audit after listing came back clean.", image: "" },
  { id: uid(), status: "draft", approved: false, name: "EXAMPLE — Founder", role: "Co-founder & CEO", company: "SaaS startup", quote: "Our Series B closed with no RBI queries. The FEMA paperwork was handled so cleanly that our investors' counsel had nothing to add.", image: "" },
  { id: uid(), status: "draft", approved: false, name: "EXAMPLE — M. Reddy", role: "Managing Director", company: "Family-owned manufacturing group", quote: "Twenty years of working with PS Rao. They know our business as well as we do, and they tell us what we need to hear.", image: "" },
];

await api("POST", "/api/admin/login", { password });
const existingCS = (await api("GET", "/api/admin/content/case_studies")) || [];
const existingT = (await api("GET", "/api/admin/content/testimonials")) || [];
if (!existingCS.length) { await api("PUT", "/api/admin/content/case_studies", caseStudies); console.log("seeded", caseStudies.length, "case studies (draft)"); } else console.log("case_studies already has", existingCS.length);
if (!existingT.length) { await api("PUT", "/api/admin/content/testimonials", testimonials); console.log("seeded", testimonials.length, "testimonials (draft)"); } else console.log("testimonials already has", existingT.length);
