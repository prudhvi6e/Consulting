import { type CmsEnv, json, clearSessionCookie } from "../_cms";
export const onRequestPost: PagesFunction<CmsEnv> = async () => json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
