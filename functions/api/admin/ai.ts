// POST /api/admin/ai  (session required)
//   { task, input, context? }  -> text/event-stream of {"delta": "..."} chunks, or JSON for structured tasks.
// Tasks:
//   improve | shorten | expand | grammar | formal | simplify   -> rewrites `input` (streams text)
//   article      -> { title, slug, category, excerpt, readTime, content: [{heading, paragraphs[]}] }
//   job          -> { description, responsibilities[], requirements[] }
//   excerpt      -> streams a 1-2 sentence excerpt for an article body
//   events       -> { events: [{ title, type, date, note }] } for a given month (needs expert verification)
//   candidate    -> { summary, strengths[], gaps[], fit, score } from resume text + job context
//   alt          -> streams a short image alt text given a description
// Runs on Workers AI (binding AI). Uses OpenAI instead when OPENAI_API_KEY is set.
import { type CmsEnv, json, bad, requireAdmin } from "../_cms";

type Env = CmsEnv & {
  AI?: { run: (model: string, input: unknown) => Promise<unknown> };
  OPENAI_API_KEY?: string;
  OPENAI_CHAT_MODEL?: string;
};

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const FIRM = `You write for PS Rao Corporate Solutions Pvt. Ltd., a firm of Company Secretaries in Hyderabad, India (corporate secretarial, governance, capital markets/SEBI, RBI & FEMA, restructuring, insolvency, due diligence, IPR). Audience: CFOs, founders, boards, compliance heads. Voice: precise, confident, professional British-Indian English; no hype, no emojis, no exclamation marks, no first-person singular. Indian legal context (Companies Act 2013, SEBI LODR, FEMA, IBC, GST). Never invent statistics, case names or section numbers you are not sure of.`;

type Msg = { role: "system" | "user"; content: string };

const S = {
  str: { type: "string" }, strArr: { type: "array", items: { type: "string" } },
  article: { type: "object", required: ["title", "slug", "category", "excerpt", "readTime", "content"], properties: { title: { type: "string" }, slug: { type: "string" }, category: { type: "string" }, excerpt: { type: "string" }, readTime: { type: "string" }, content: { type: "array", maxItems: 6, items: { type: "object", required: ["heading", "paragraphs"], properties: { heading: { type: "string" }, paragraphs: { type: "array", maxItems: 4, items: { type: "string" } } } } } } },
  caseStudy: { type: "object", required: ["title", "client", "sector", "challenge", "approach", "outcome", "metric", "metricLabel", "services"], properties: { title: { type: "string" }, client: { type: "string" }, sector: { type: "string" }, challenge: { type: "string" }, approach: { type: "string" }, outcome: { type: "string" }, metric: { type: "string" }, metricLabel: { type: "string" }, services: { type: "array", items: { type: "string" } } } },
  testimonial: { type: "object", required: ["quote"], properties: { quote: { type: "string" } } },
  jobLists: { type: "object", required: ["responsibilities", "requirements"], properties: { responsibilities: { type: "array", items: { type: "string" } }, requirements: { type: "array", items: { type: "string" } } } },
  events: { type: "object", required: ["events"], properties: { events: { type: "array", maxItems: 14, items: { type: "object", required: ["title", "type", "date", "note"], properties: { title: { type: "string" }, type: { type: "string", enum: ["duedate", "event"] }, date: { type: "string" }, note: { type: "string" } } } } } },
  candidate: { type: "object", required: ["summary", "strengths", "gaps", "fit", "score", "questions"], properties: { summary: { type: "string" }, strengths: { type: "array", items: { type: "string" } }, gaps: { type: "array", items: { type: "string" } }, fit: { type: "string", enum: ["strong", "possible", "weak"] }, score: { type: "number" }, questions: { type: "array", items: { type: "string" } } } },
};

const REWRITE: Record<string, string> = {
  improve: "Improve the clarity, flow and polish of the text. Keep the meaning, length and structure. Return only the rewritten text.",
  shorten: "Rewrite the text to be roughly half as long while keeping every key point. Return only the rewritten text.",
  expand: "Expand the text with relevant detail and context, roughly doubling its length. Keep the voice. Return only the rewritten text.",
  grammar: "Fix spelling, grammar and punctuation only. Do not change wording or tone otherwise. Return only the corrected text.",
  formal: "Rewrite the text in a more formal, professional register suitable for a corporate advisory firm. Return only the rewritten text.",
  simplify: "Rewrite the text in plain English a non-lawyer business owner would understand, without losing accuracy. Return only the rewritten text.",
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  try { return await handle(ctx); }
  catch (e) {
    console.error("ai error", e);
    const debug = new URL(ctx.request.url).searchParams.get("debug") === "1";
    return json({ error: (e as Error).message || "AI request failed", ...(debug ? { raw: (e as { raw?: string }).raw } : {}) }, 502);
  }
};

const handle: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  if (!env.AI && !env.OPENAI_API_KEY) return bad("AI is not configured on this deployment.", 503);

  const body = (await request.json().catch(() => ({}))) as { task?: string; input?: string; context?: Record<string, unknown> };
  const task = String(body.task || "");
  const input = String(body.input || "").slice(0, 24_000);
  const ctx = body.context || {};

  // ---- streaming rewrites
  if (REWRITE[task]) {
    if (!input.trim()) return bad("Nothing to rewrite");
    const words = input.trim().split(/\s+/).length;
    const field = String(ctx.field || "");
    // Short fields (titles, taglines, labels) must stay short — the model otherwise pads them into paragraphs.
    const lengthRule = task === "expand"
      ? (words < 25 ? ` Keep it to at most ${Math.max(12, words * 2)} words.` : "")
      : words < 25 ? ` This is a short "${field || "field"}" of ${words} words: the result must also be a single short phrase or sentence of at most ${Math.max(8, Math.round(words * 1.3))} words, with no explanation.` : "";
    return stream(env, [{ role: "system", content: `${FIRM}\n\n${REWRITE[task]}${lengthRule}` }, { role: "user", content: input }], Math.min(1200, Math.max(60, words * 4)));
  }
  if (task === "excerpt") {
    return stream(env, [{ role: "system", content: `${FIRM}\n\nWrite a one- or two-sentence excerpt (max 40 words) that makes a reader want to open this article. Return only the excerpt.` }, { role: "user", content: input }], 120);
  }
  if (task === "alt") {
    return stream(env, [{ role: "system", content: "Write a concise alt text (max 12 words) for an image, for accessibility. Return only the alt text." }, { role: "user", content: input }], 40);
  }

  // ---- structured generation
  if (task === "article") {
    const topic = String(ctx.topic || input);
    if (!topic.trim()) return bad("Give the article a topic");
    const out = await complete(env, [
      { role: "system", content: `${FIRM}\n\nWrite an original thought-leadership article. Respond ONLY with minified JSON matching exactly:\n{"title":string,"slug":string(lowercase-hyphenated),"category":string(one of: Governance, Capital Markets, Compliance, Restructuring, FEMA & RBI, Insolvency, Due Diligence, Startups),"excerpt":string(max 40 words),"readTime":string(e.g. "6 min read"),"content":[{"heading":string,"paragraphs":[string,...]},...]}\nRules: 4 to 6 sections; the first section has an empty heading and introduces the topic; EVERY section has at least 2 paragraphs and EVERY paragraph is 70-130 words of flowing prose (no bullet lists); end with a section headed "How PS Rao can help" (2 paragraphs). The excerpt is a complete, compelling sentence of 20-40 words, not a list of keywords. Total length target: ${String(ctx.length || "medium")} (short = at least 550 words, medium = at least 900 words, long = at least 1400 words). Tone: ${String(ctx.tone || "authoritative")}.` },
      { role: "user", content: `Topic: ${topic}\n${ctx.points ? `Key points to cover:\n${String(ctx.points)}` : ""}` },
    ], 5000, S.article);
    return json(parseJson(out));
  }
  if (task === "job") {
    const brief = `Title: ${ctx.title || input}\nDepartment: ${ctx.department || "-"}\nExperience: ${ctx.experience || "-"}\nLevel: ${ctx.level || "-"}\nType: ${ctx.type || "Full-time"}\nLocation: ${ctx.location || "Hyderabad"}\n${ctx.notes ? `Notes from hiring manager: ${ctx.notes}` : ""}`;
    // Prose and lists are generated separately: in JSON mode the model ignores length limits and
    // runs the description into the token budget, truncating the object.
    const [description, lists] = await Promise.all([
      complete(env, [
        { role: "system", content: `${FIRM}\n\nWrite the description for a job posting: exactly two paragraphs separated by a blank line, 60-90 words each. First paragraph: the role and the work. Second: the team and growth. Return only the two paragraphs.` },
        { role: "user", content: brief },
      ], 400),
      complete(env, [
        { role: "system", content: `${FIRM}\n\nFor the job below, respond ONLY with minified JSON: {"responsibilities":[string x 5-7],"requirements":[string x 5-7]}. Each item is one complete, specific sentence of 10-22 words; never join two items in one string. Be specific to Indian company-secretarial practice.` },
        { role: "user", content: brief },
      ], 1200, S.jobLists),
    ]);
    const parsed = parseJson(lists) as { responsibilities?: string[]; requirements?: string[] };
    return json({ description: description.trim(), responsibilities: parsed.responsibilities || [], requirements: parsed.requirements || [] });
  }
  if (task === "case_study") {
    const facts = String(ctx.facts || input);
    if (!facts.trim()) return bad("Give the facts of the engagement");
    const out = await complete(env, [
      { role: "system", content: `${FIRM}\n\nTurn the facts of a client engagement into a short, anonymised case study for the firm's website. Respond ONLY with minified JSON matching exactly:\n{"title":string(max 10 words, outcome-led, e.g. "Fast-track merger closed in 94 days"),"client":string(anonymised client descriptor, e.g. "Listed mid-cap pharma company"),"sector":string(exactly one of: Pharma, FMCG, Technology, Manufacturing, Financial Services, Real Estate, Infrastructure, Startups, Healthcare, Retail, Other),"challenge":string(2-3 sentences, 50-80 words),"approach":string(3-4 sentences, 70-110 words, what PS Rao did),"outcome":string(2-3 sentences, 40-70 words),"metric":string(the single headline number, e.g. "94 days" or "₹120 Cr"),"metricLabel":string(max 6 words, e.g. "from board approval to NCLT order"),"services":[string x 2-4](service names used)}\nRules: never name the client or any individual; never invent numbers — if the facts give no figure, set metric to "" and metricLabel to ""; plain professional English; no superlatives.` },
      { role: "user", content: `Facts from the partner:\n${facts}` },
    ], 1500, S.caseStudy);
    return json(parseJson(out));
  }
  if (task === "testimonial") {
    const notes = String(ctx.notes || input);
    if (!notes.trim()) return bad("Give the client's words or notes");
    const out = await complete(env, [
      { role: "system", content: `${FIRM}\n\nA client has given feedback informally (notes, a WhatsApp message, or a few bullet points). Polish it into a website testimonial in the client's own voice: first person, 2-3 sentences, 35-60 words, specific about what the firm did and why it mattered. Keep every fact; add none. Respond ONLY with minified JSON: {"quote":string}.` },
      { role: "user", content: notes },
    ], 300, S.testimonial);
    return json(parseJson(out));
  }
  if (task === "events") {
    const month = String(ctx.month || input); // YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(month)) return bad("month must be YYYY-MM");
    const out = await complete(env, [
      { role: "system", content: `You are a compliance calendar assistant for an Indian Company Secretary firm. For the given month list the recurring statutory due dates that commonly apply to Indian companies (GST returns GSTR-1/GSTR-3B, TDS/TCS payment and returns, PF and ESI contributions, advance tax instalments, SEBI LODR quarterly/half-yearly/annual filings for listed companies, MCA/ROC annual filings AOC-4/MGT-7/DIR-3 KYC/DPT-3/MSME-1, Board meeting and AGM timelines, FEMA/RBI FLA/APR returns, income-tax return deadlines) that fall in that month. Respond ONLY with minified JSON: {"events":[{"title":string(short, e.g. "GSTR-3B (monthly) for ${month}"),"type":"duedate"|"event","date":"YYYY-MM-DD","note":string(which law/form and who it applies to, max 20 words)}]}. 6 to 14 items. Only include dates you are confident about; mark anything that varies by company with "(check applicability)" in the title.` },
      { role: "user", content: `Month: ${month}` },
    ], 2500, S.events);
    return json(parseJson(out));
  }
  if (task === "candidate") {
    if (!input.trim()) return bad("No resume text");
    const out = await complete(env, [
      { role: "system", content: `You are an experienced recruiter for an Indian Company Secretary firm. Assess the candidate against the role. Respond ONLY with minified JSON: {"summary":string(3-4 sentences),"strengths":[string x 3-5],"gaps":[string x 2-4],"fit":"strong"|"possible"|"weak","score":number(0-100),"questions":[string x 3](interview questions to probe gaps)}. Be fair and specific; base everything on the resume text and the role; never guess protected characteristics.` },
      { role: "user", content: `ROLE\nTitle: ${ctx.jobTitle || "-"}\nRequirements: ${ctx.requirements || "-"}\nExperience wanted: ${ctx.experience || "-"}\n\nAPPLICANT FORM\n${ctx.form || "-"}\n\nRESUME TEXT\n${input}` },
    ], 1200, S.candidate);
    return json(parseJson(out));
  }
  return bad("Unknown task");
};

// ---------------------------------------------------------------- helpers
type Schema = Record<string, unknown>;
async function complete(env: Env, messages: Msg[], max_tokens: number, schema?: Schema): Promise<string> {
  if (env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: env.OPENAI_CHAT_MODEL || "gpt-4o-mini", temperature: 0.5, max_tokens, messages, ...(schema ? { response_format: { type: "json_schema", json_schema: { name: "out", schema, strict: false } } } : {}) }),
    });
    if (r.ok) { const d = (await r.json()) as { choices: { message: { content: string } }[] }; return d.choices[0]?.message?.content ?? ""; }
    if (!env.AI) throw new Error(`OpenAI ${r.status}`);
  }
  // Workers AI: JSON mode (response_format) constrains output to the schema, which is far more
  // reliable than prompting for JSON. Streamed and collected because non-streamed 70B calls can
  // exceed the request limit (error 1101).
  const s = (await env.AI!.run(MODEL, { messages, max_tokens, temperature: 0.4, stream: true, ...(schema ? { response_format: { type: "json_schema", json_schema: schema } } : {}) })) as ReadableStream<Uint8Array>;
  const reader = s.pipeThrough(sseMap((d) => d.response)).getReader();
  const dec = new TextDecoder(); let buf = "", full = "";
  for (;;) {
    const { value, done } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() ?? "";
    for (const l of lines) { if (!l.startsWith("data:")) continue; const p = l.slice(5).trim(); if (!p || p === "[DONE]") continue; try { full += (JSON.parse(p) as { delta: string }).delta; } catch { /* skip */ } }
  }
  return full;
}

async function stream(env: Env, messages: Msg[], max_tokens: number): Promise<Response> {
  const headers = { "Content-Type": "text/event-stream", "Cache-Control": "no-store" };
  if (env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: env.OPENAI_CHAT_MODEL || "gpt-4o-mini", temperature: 0.4, max_tokens, messages, stream: true }),
    });
    if (r.ok && r.body) return new Response(r.body.pipeThrough(sseMap((d) => d.choices?.[0]?.delta?.content)), { headers });
    if (!env.AI) return bad(`OpenAI ${r.status}`, 502);
  }
  const s = (await env.AI!.run(MODEL, { messages, max_tokens, temperature: 0.4, stream: true })) as ReadableStream<Uint8Array>;
  return new Response(s.pipeThrough(sseMap((d) => d.response)), { headers });
}

/** Re-emit upstream SSE as our own `data: {"delta": "..."}` events. */
function sseMap(pick: (d: any) => string | undefined) {
  let buf = "";
  const dec = new TextDecoder(); const enc = new TextEncoder();
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, ctrl) {
      buf += dec.decode(chunk, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try { const delta = pick(JSON.parse(payload)); if (delta) ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ delta })}\n\n`)); } catch { /* skip */ }
      }
    },
    flush(ctrl) { ctrl.enqueue(enc.encode("data: [DONE]\n\n")); },
  });
}

function parseJson(text: string): unknown {
  // Strip code fences / preambles, take the outermost {...}, and repair the usual LLM slips
  // (literal newlines or tabs inside strings, trailing commas, smart quotes).
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
  let slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  const attempts = [
    () => JSON.parse(slice),
    () => JSON.parse(escapeNewlinesInStrings(slice)),
    () => JSON.parse(escapeNewlinesInStrings(slice).replace(/,\s*([}\]])/g, "$1")),
    () => JSON.parse(closeTruncated(escapeNewlinesInStrings(cleaned.slice(start >= 0 ? start : 0)))),
  ];
  const errs: string[] = [];
  for (const a of attempts) { try { return a(); } catch (e) { errs.push((e as Error).message); } }
  console.error("ai json parse failed:", JSON.stringify(slice.slice(0, 300)));
  console.error("ai json parse errors:", errs.join(" | "));
  const e = new Error("The model returned something unexpected. Please try again.") as Error & { raw?: string };
  e.raw = text.slice(0, 1500);
  throw e;
}
/** Best-effort repair of JSON cut off by a token limit: close the open string, drop a dangling
 *  partial value, then close every open bracket. Loses the tail, keeps everything complete. */
function closeTruncated(s: string): string {
  let inStr = false, esc = false; const stack: string[] = []; let lastGood = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') { inStr = false; lastGood = i + 1; } continue; }
    if (ch === '"') inStr = true;
    else if (ch === "{" || ch === "[") stack.push(ch === "{" ? "}" : "]");
    else if (ch === "}" || ch === "]") { stack.pop(); lastGood = i + 1; }
    else if (ch === ",") lastGood = i;
  }
  let out = s.slice(0, lastGood).replace(/,\s*$/, "").replace(/:\s*$/, ': ""').replace(/,\s*"[^"]*$/, "");
  // if we cut after a key (e.g. `{"a":"x","b"`), drop the dangling key
  out = out.replace(/,\s*"[^"]*"\s*$/, "");
  while (stack.length) out += stack.pop();
  return out;
}
/** Replace raw control characters that appear inside JSON string literals with escapes. */
function escapeNewlinesInStrings(s: string): string {
  let out = ""; let inStr = false; let esc = false;
  for (const ch of s) {
    if (inStr) {
      if (esc) { out += ch; esc = false; continue; }
      if (ch === "\\") { out += ch; esc = true; continue; }
      if (ch === '"') { inStr = false; out += ch; continue; }
      const code = ch.charCodeAt(0);
      if (code === 10) { out += "\\n"; continue; }
      if (code === 13) { continue; }
      if (code === 9) { out += "\\t"; continue; }
      if (code < 32) { continue; }
      out += ch; continue;
    }
    if (ch === '"') inStr = true;
    out += ch;
  }
  return out;
}
