// POST /api/summarize  { text, title? } -> { summary }
type Env = {
  OPENAI_API_KEY?: string;
  OPENAI_SUMMARY_MODEL?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: "Summarization is not configured (missing OPENAI_API_KEY)." }, 503);
  }

  const body = (await request.json().catch(() => ({}))) as { text?: string; title?: string };
  const text = typeof body.text === "string" ? body.text : "";
  const title = typeof body.title === "string" ? body.title : "";
  if (!text.trim()) return json({ error: "text is required" }, 400);

  const model = env.OPENAI_SUMMARY_MODEL || "gpt-4o-mini";

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an expert editor for a corporate-law and company-secretarial firm. Summarize the article into 3–5 concise, plain-English bullet points capturing the key takeaways. Return only the summary.",
          },
          { role: "user", content: `Title: ${title}\n\nArticle:\n${text.substring(0, 12000)}` },
        ],
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("openai summarize failed", r.status, detail);
      return json(
        { error: "The AI service failed to generate a summary. Please try again." },
        502,
      );
    }

    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const summary = data.choices?.[0]?.message?.content?.trim() || "";
    if (!summary) {
      return json({ error: "The AI returned an empty summary. Please try again." }, 502);
    }
    return json({ summary });
  } catch (err) {
    console.error("summarize error", err);
    return json({ error: "Failed to generate summary." }, 500);
  }
};
