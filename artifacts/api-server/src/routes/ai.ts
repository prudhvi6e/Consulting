import { Router, type IRouter } from "express";
import { z } from "zod";
import OpenAI from "openai";

const router: IRouter = Router();

const SummarizeBody = z.object({
  text: z.string().min(1).max(20000),
  title: z.string().max(300).optional(),
});

const TtsBody = z.object({
  text: z.string().min(1).max(8000),
  voice: z
    .enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"])
    .optional(),
});

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

router.post("/summarize", async (req, res) => {
  const parsed = SummarizeBody.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid request.", details: parsed.error.flatten() });
  }

  const client = getClient();
  if (!client) {
    return res
      .status(503)
      .json({ error: "AI is not configured. OPENAI_API_KEY is missing." });
  }

  const { text, title } = parsed.data;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise corporate-advisory editor. Summarize the article into a concise executive briefing of 3-5 crisp bullet takeaways in plain English. No preamble, no fluff, no closing remarks. Do not invent facts not present in the article. Return only the bullets, each starting with '- '.",
        },
        {
          role: "user",
          content: `${title ? `Title: ${title}\n\n` : ""}Article:\n${text}`,
        },
      ],
      max_tokens: 500,
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!summary) {
      return res.status(502).json({ error: "No summary was returned." });
    }
    return res.json({ summary });
  } catch (err) {
    req.log.error({ err }, "summarize failed");
    return res.status(502).json({ error: "Failed to generate summary." });
  }
});

router.post("/tts", async (req, res) => {
  const parsed = TtsBody.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid request.", details: parsed.error.flatten() });
  }

  const client = getClient();
  if (!client) {
    return res
      .status(503)
      .json({ error: "AI is not configured. OPENAI_API_KEY is missing." });
  }

  const { text, voice } = parsed.data;

  try {
    const speech = await client.audio.speech.create({
      model: "tts-1",
      voice: voice ?? "nova",
      input: text,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "tts failed");
    return res.status(502).json({ error: "Failed to generate audio." });
  }
});

export default router;
