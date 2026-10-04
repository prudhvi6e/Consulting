// POST /api/chat  { messages: [{role, content}] } -> { reply }
// Website assistant for PS Rao Corporate Solutions Pvt. Ltd. Uses OpenAI; keyed server-side.
type Env = { OPENAI_API_KEY?: string; OPENAI_CHAT_MODEL?: string; AI?: { run: (model: string, input: unknown) => Promise<{ response?: string }> } };
type Msg = { role: "user" | "assistant"; content: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const SYSTEM_PROMPT = `You are the virtual assistant for PS Rao Corporate Solutions Pvt. Ltd. (formerly P S Rao & Associates), a Hyderabad-based firm of Company Secretaries and corporate advisors founded in 2012.

Services: Corporate Secretarial & Compliance, Corporate Governance, Secretarial Audit, Corporate Restructuring (mergers, demergers, amalgamations), Capital Markets (IPO, listing, SEBI/LODR compliance), RBI & FEMA matters, Legal Due Diligence, Insolvency & Resolution, Liaisoning & Representation before ROC, RD, NCLT, MCA, RBI, SEBI, Stock Exchanges and other authorities, Intellectual Property, and advisory for startups, MSMEs and listed companies.

Office: 6-3-683/10, Flat-102, Suseela Sadan, Anand Nagar Road, Khairtabad, Hyderabad - 500004, Telangana. Phone: +91 40 2335 2185. Email: info@psrao.co.in. Careers: career@psrao.co.in. Free consultation can be booked on the Contact page (/contact) which creates a Google Meet invite.

Rules: Be concise, warm and professional. Answer questions about the firm, its services, and general Indian company-law/compliance topics at a high level. Do not give definitive legal opinions; for specific matters, invite the visitor to book a free consultation. If asked something unrelated to the firm or corporate compliance, politely steer back. Never invent fees, names of clients, or case outcomes. Reply in plain text (no markdown headings), max ~120 words.`;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey && !env.AI) return json({ error: "Chat is not configured." }, 503);

  const body = (await request.json().catch(() => ({}))) as { messages?: Msg[] };
  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "A user message is required." }, 400);
  }

  const chatMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];
  const debug = new URL(request.url).searchParams.has("debug");
  const errors: string[] = [];

  // 1) OpenAI (if a key is set and has quota)
  if (apiKey) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: env.OPENAI_CHAT_MODEL || "gpt-4o-mini", temperature: 0.4, max_tokens: 350, messages: chatMessages }),
      });
      if (r.ok) {
        const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return json({ reply, engine: "openai" });
      } else {
        const t = await r.text().catch(() => "");
        console.warn("openai chat failed", r.status, t);
        errors.push(`openai ${r.status}: ${t.slice(0, 200)}`);
      }
    } catch (err) {
      console.warn("openai chat error", err);
      errors.push(`openai threw: ${String(err)}`);
    }
  }

  // 2) Cloudflare Workers AI fallback (free tier, no external key)
  if (env.AI) {
    try {
      const out = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages: chatMessages, max_tokens: 350, temperature: 0.4 });
      const reply = out?.response?.trim();
      if (reply) return json({ reply, engine: "workers-ai" });
    } catch (err) {
      console.error("workers ai error", err);
      errors.push(`workers-ai threw: ${String(err)}`);
    }
  }

  if (!env.AI) errors.push("no AI binding");
  return json({ error: "The assistant is temporarily unavailable. Please try again.", ...(debug ? { detail: errors } : {}) }, 502);
};
