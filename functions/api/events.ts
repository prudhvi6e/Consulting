// GET /api/events -> [{ id, title, type: "event"|"duedate", date: "YYYY-MM-DD", color }]
// Proxies the firm's existing Events & Due Dates feed (managed from the legacy admin panel)
// so the new site can read it same-origin. Cached at the edge for 10 minutes.
type Env = { EVENTS_SOURCE_URL?: string };

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
