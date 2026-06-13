// POST /api/tts  { text } -> audio/mpeg bytes
type Env = {
  OPENAI_API_KEY?: string;
  OPENAI_TTS_MODEL?: string;
  OPENAI_TTS_VOICE?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: "Audio playback is not configured (missing OPENAI_API_KEY)." }, 503);
  }

  const body = (await request.json().catch(() => ({}))) as { text?: string };
  const text = typeof body.text === "string" ? body.text : "";
  if (!text.trim()) return json({ error: "text is required" }, 400);

  const model = env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
  const voice = env.OPENAI_TTS_VOICE || "alloy";

  try {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        voice,
        input: text.substring(0, 4000),
        response_format: "mp3",
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("openai tts failed", r.status, detail);
      return json(
        { error: "The AI service failed to generate audio. Please try again." },
        502,
      );
    }

    // Stream the audio straight through with the right content type.
    return new Response(r.body, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("tts error", err);
    return json({ error: "Failed to generate audio." }, 500);
  }
};
