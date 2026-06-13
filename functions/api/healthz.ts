// GET /api/healthz
export const onRequestGet: PagesFunction = async () =>
  new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
