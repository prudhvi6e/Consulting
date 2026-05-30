# PS Rao & Associates

A futuristic, heavily-animated marketing website for PS Rao & Associates — a Hyderabad-based firm of Company Secretaries and corporate advisors.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/psrao-website/` — the marketing website (react-vite, presentation-first, served at `/`). This is the primary product.
  - `src/pages/` — one file per route: `home`, `about`, `services`, `team`, `insights`, `contact`, `not-found`.
  - `src/components/layout/` — `Navbar.tsx` (sticky/condensing nav) and `AppLayout.tsx` (page transitions, scroll-to-top, footer).
  - `src/index.css` — theme tokens (light + dark), fonts, reduced-motion media query. Source of truth for the palette.
  - `src/assets/brand/` — real logo (`ps-logo.png`/`.svg`) and team photos; `src/assets/images/` — generated hero/section imagery + the PSR monogram.
  - `src/assets/firm-content-reference.txt` — the firm's real services/team/contact copy used to write the site.
- `artifacts/api-server/` now hosts the AI backend used by article pages: `src/routes/ai.ts` exposes `POST /api/summarize` (gpt-4o-mini) and `POST /api/tts` (tts-1, voice nova). Both are zod-validated, return 503 when `OPENAI_API_KEY` is missing, and map OpenAI errors (429 quota, 401 bad key) to clear messages. `lib/db/` remains unused.
- `artifacts/psrao-website/src/pages/article.tsx` — article reader at `/insights/:slug`; "Listen" calls `/api/tts` (audio/mpeg blob) and "AI Summary" calls `/api/summarize`. Article content lives in `src/data/articles.ts` (`articles`, `getArticleBySlug`, `getArticlePlainText`).
- `artifacts/psrao-website/src/pages/careers.tsx` — Careers page at `/careers`; applications go through `mailto:` (no backend submit).

## Architecture decisions

- Presentation-first marketing site with one small backend concern: the AI article features (summarize + listen). No DB, no OpenAPI codegen. The contact and careers forms open the visitor's email client via `mailto:` (no backend send) rather than faking a submission.
- AI requires the user's own `OPENAI_API_KEY` (standard `openai` client, NOT a Replit integration). The frontend calls the relative paths `/api/summarize` and `/api/tts` (routed by the shared proxy to api-server) — never prefixed with `BASE_URL`. Errors are always surfaced to the user (no silent fallbacks / fake summaries or audio).
- Motion is central (framer-motion). Reduced motion is handled globally via `MotionConfig reducedMotion="user"` in `App.tsx` plus a `prefers-reduced-motion` CSS media query and a guarded `scrollTo`.
- Palette is locked to the firm brand: ink `#0B1220`, deep navy, electric azure accent `#2E6BFF`. Display font Space Grotesk, body Inter.

## Product

A futuristic, animated marketing site positioning PS Rao & Associates as a next-generation corporate advisory firm. Pages: Home (flagship), About, Services (9 service areas), Team, Insights (placeholder articles), Contact. Fully responsive, dark/light theme, SEO meta per page.

## User preferences

- No emojis anywhere in the UI.
- Site must look more modern/premium than the Big4 and vinodkothari.com — cinematic motion with credible advisory authority.

## Gotchas

- In `index.css`, the Google Fonts `@import url(...)` MUST come before `@import "tailwindcss"`. Tailwind v4 inlines its import, and any `@import` placed after it is dropped ("@import must precede all other statements"), silently disabling the custom fonts.
- framer-motion cubic-bezier `ease` arrays must be a fixed tuple (`as const`) or typed `Easing`, otherwise they infer as `number[]` and fail typecheck.
- Embla (`useEmblaCarousel`) treats the ref'd viewport's FIRST child as the slide container/track. Any decorative layer (e.g. a gradient-overlay `<div>`) placed as the viewport's first child makes embla mis-target, so slides aren't clipped/managed and bleed sideways. Keep the structure strictly viewport (`overflow-hidden`, ref) → track (`flex`) → slides; put overlays/indicators OUTSIDE the viewport.
- Tailwind v4 does NOT ship a `marquee` keyframe. The home logo/industry marquee uses `animate-[marquee_..._linear_infinite]`, which silently does nothing unless `@keyframes marquee` is defined in `index.css`. It is (translateX(0) → translateX(-33.3333%) for the tripled `[...LOGOS,...LOGOS,...LOGOS]` track). Keep the keyframe shift in sync with the number of track copies.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
