// AI endpoints for the Insights articles: summary + text-to-speech.
// Uses the OpenAI REST API via fetch (no SDK dependency).
import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const OPENAI_API_KEY = () => process.env["OPENAI_API_KEY"];
const SUMMARY_MODEL = process.env["OPENAI_SUMMARY_MODEL"] || "gpt-4o-mini";
const TTS_MODEL = process.env["OPENAI_TTS_MODEL"] || "gpt-4o-mini-tts";
const TTS_VOICE = process.env["OPENAI_TTS_VOICE"] || "alloy";

// POST /api/summarize  { text, title? } -> { summary }
router.post("/summarize", async (req, res) => {
  const apiKey = OPENAI_API_KEY();
  if (!apiKey) return res.status(503).json({ error: "Summarization is not configured (missing OPENAI_API_KEY)." });

  const text = typeof req.body?.text === "string" ? req.body.text : "";
  const title = typeof req.body?.title === "string" ? req.body.title : "";
  if (!text.trim()) return res.status(400).json({ error: "text is required" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: SUMMARY_MODEL,
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
      logger.error({ status: r.status, detail }, "openai summarize failed");
      return res.status(502).json({ error: "The AI service failed to generate a summary. Please try again." });
    }

    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const summary = data.choices?.[0]?.message?.content?.trim() || "";
    if (!summary) return res.status(502).json({ error: "The AI returned an empty summary. Please try again." });
    return res.json({ summary });
  } catch (err) {
    logger.error({ err }, "summarize error");
    return res.status(500).json({ error: "Failed to generate summary." });
  }
});

// POST /api/tts  { text } -> audio/mpeg bytes
router.post("/tts", async (req, res) => {
  const apiKey = OPENAI_API_KEY();
  if (!apiKey) return res.status(503).json({ error: "Audio playback is not configured (missing OPENAI_API_KEY)." });

  const text = typeof req.body?.text === "string" ? req.body.text : "";
  if (!text.trim()) return res.status(400).json({ error: "text is required" });

  try {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text.substring(0, 4000),
        response_format: "mp3",
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      logger.error({ status: r.status, detail }, "openai tts failed");
      return res.status(502).json({ error: "The AI service failed to generate audio. Please try again." });
    }

    const audio = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audio.length);
    return res.send(audio);
  } catch (err) {
    logger.error({ err }, "tts error");
    return res.status(500).json({ error: "Failed to generate audio." });
  }
});

export default router;
