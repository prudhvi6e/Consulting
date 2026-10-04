// GET /api/events -> [{ id, title, type: "event"|"duedate", date: "YYYY-MM-DD", color }]
// Reads from the built-in CMS (KV) when populated; otherwise proxies the firm's legacy Events & Due Dates feed (managed from the legacy admin panel)
// so the new site can read it same-origin. Cached at the edge for 10 minutes.
type Env = { EVENTS_SOURCE_URL?: string; CMS?: KVNamespace };

type LegacyRow = { id: number; title: string; typeofdate: string; eventduedate: string; color: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  // Prefer events managed in the built-in CMS (/admin → Events & Due Dates).
  try {
    const own = env.CMS ? ((await env.CMS.get("content:events", "json")) as { id: string; title: string; type: string; date: string; color?: string }[] | null) : null;
    if (Array.isArray(own) && own.length) {
      return json(
        own
          .filter((x) => x && x.date && x.title)
          .map((x) => ({ id: x.id, title: x.title, type: x.type === "duedate" ? "duedate" : "event", date: x.date, color: x.color || "#2E6BFF" }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      );
    }
  } catch (err) {
    console.error("events kv read failed", err);
  }
  const source = env.EVENTS_SOURCE_URL || "https://api.psrao.co.in/get/eventduedates";
  try {
    const r = await fetch(source, { cf: { cacheTtl: 600, cacheEverything: true } } as RequestInit);
    if (!r.ok) return json({ error: `upstream ${r.status}` }, 502);
    const rows = (await r.json()) as LegacyRow[];
    const out = rows
      .filter((x) => x && x.eventduedate)
      .map((x) => ({
        id: x.id,
        title: x.title,
        type: x.typeofdate === "duedate" ? "duedate" : "event",
        date: new Date(x.eventduedate).toISOString().slice(0, 10),
        color: x.color || "#2E6BFF",
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return json(out);
  } catch (err) {
    console.error("events proxy failed", err);
    return json({ error: "Events feed unavailable" }, 502);
  }
};
