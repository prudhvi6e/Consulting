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
- `artifacts/api-server/` — the website's own Express backend (everything self-contained; no external repo). Routes under `/api`: `available-slots` + `create-meeting` (Google Calendar booking via a service account, in `src/lib/google-calendar.ts`), `summarize` + `tts` (OpenAI, in `src/routes/ai.ts`), and `healthz`. Runs on port 5000; the website's Vite dev server proxies `/api` to it. Secrets live in `artifacts/api-server/.env` + `service-account-creds.json` (both gitignored; see `.env.example`). `lib/db/` exists from the scaffold but is not used.

## Architecture decisions

- Self-contained: the only backend is the in-repo `api-server`; the site does not depend on any other repo (the former external `Backend-master` is no longer used). The "Consult Us" page books a real Google Calendar meeting (with Meet link + email invites) through `api-server`; Insights articles use its OpenAI summary + TTS endpoints. DB/OpenAPI codegen remain unused.
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
- Tailwind v4 does NOT ship a `marquee` keyframe. The home logo marquee uses `animate-[marquee_..._linear_infinite]`, which silently does nothing unless `@keyframes marquee` is defined in `index.css`. It is (translateX(0) → translateX(-50%)) for a track of **two** identical logo groups, each with a trailing `pr-16 md:pr-32` matching its internal `gap-16 md:gap-32` so the seam gap equals the inter-item gap and the wrap is seamless. Keep the keyframe shift (-50%) in sync with the two-copy track; if you change the copy count, change the shift too.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
