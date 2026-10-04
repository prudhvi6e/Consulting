// Public read API for site content.
//   GET /api/cms            -> { settings, hero, ..., _updated }
//   GET /api/cms/<name>     -> that collection (or null when never edited)
import { type CmsEnv, COLLECTIONS, isCollection, json, bad, readCollection } from "../_cms";

const CACHE = { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" };

export const onRequestGet: PagesFunction<CmsEnv> = async ({ env, params }) => {
  const segs = (params.path as string[] | undefined) ?? [];
  if (segs.length === 0) {
    const entries = await Promise.all(COLLECTIONS.map(async (c) => [c, await readCollection(env, c)] as const));
    const out: Record<string, unknown> = Object.fromEntries(entries);
    out._updated = await env.CMS.get("content:_updated");
    return json(out, 200, CACHE);
  }
  const name = segs[0];
  if (!isCollection(name)) return bad("Unknown collection", 404);
  const data = await readCollection(env, name);
  if (name === "articles" && Array.isArray(data)) {
    // public only sees published articles
    return json((data as { status?: string }[]).filter((a) => a.status !== "draft"), 200, CACHE);
  }
  return json(data, 200, CACHE);
};
