// Serves uploaded media from R2 with long-lived caching.  GET /api/media/<key>
import type { CmsEnv } from "../_cms";

export const onRequestGet: PagesFunction<CmsEnv> = async ({ env, params, request, waitUntil }) => {
  const key = ((params.key as string[] | undefined) ?? []).join("/");
  if (!key) return new Response("Not found", { status: 404 });

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const obj = await env.MEDIA.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  const body = await obj.arrayBuffer(); // buffer so the edge-cache copy and the response are independent
  const res = new Response(body, { headers });
  waitUntil(cache.put(request, res.clone()));
  return res;
};
