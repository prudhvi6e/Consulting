// GET /api/events -> [{ id, title, type: "event"|"duedate", date: "YYYY-MM-DD", color }]
// Reads Events & Due Dates from the built-in CMS (KV `content:events`, edited at /admin).
// The legacy api.psrao.co.in feed was imported into KV during the hosting migration and is no longer consulted.
// Cached at the edge for 10 minutes.
type Env = { CMS?: KVNamespace };

type EventRow = { id: string; title: string; type: string; date: string; color?: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const own = env.CMS ? ((await env.CMS.get("content:events", "json")) as EventRow[] | null) : null;
    const rows = Array.isArray(own) ? own : [];
    return json(
      rows
        .filter((x) => x && x.date && x.title)
        .map((x) => ({ id: x.id, title: x.title, type: x.type === "duedate" ? "duedate" : "event", date: x.date, color: x.color || "#2E6BFF" }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    );
  } catch (err) {
    console.error("events kv read failed", err);
    return json({ error: "Events feed unavailable" }, 502);
  }
};
