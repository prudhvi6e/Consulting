# Website Revamp Plan — PS Rao & Associates (v2)

Rebuild the **public website** as a modern, premium, fast marketing site that
reads as a top-tier advisory firm. The **API, Supabase, and admin panel stay
as-is** — only the public site is rebuilt, consuming the same endpoints.

- **Direction:** premium restrained (Big4 / Stripe / Mercury feel) — authority
  through typography, whitespace, speed, and *purposeful* motion (not heavy FX).
- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion +
  Lenis (smooth scroll). New app lives in `website-v2/`; the old
  `prraoassociates-master/` stays until cutover.

---

## 1. Goals & principles
1. **Trust first.** It sells compliance/secretarial/financial advisory — credibility beats flash.
2. **Fast.** Targets: LCP < 2.0s, CLS < 0.1, INP < 200ms on mid-range mobile.
3. **SEO-ready.** Server-rendered pages, metadata, structured data, clean URLs — this is a lead-gen site.
4. **Accessible.** WCAG AA, full keyboard nav, `prefers-reduced-motion` honored.
5. **Motion with intent.** Every animation has a reason (guide the eye, reward scroll). No motion for its own sake.
6. **Same content source.** Admin panel remains the CMS; the site reads the existing API.

## 2. Architecture & integration
```
 website-v2 (Next.js, SSR/SSG)  ──fetch──►  Express API (existing)  ──►  Supabase
        │                                         │                       │
        └─ Vercel (recommended)                   ├─ Google Calendar (booking)
                                                  └─ OpenAI (chatbot)
```
- **Data fetching:** Next.js **server components** fetch from the API at request/build time → SSR/ISR for SEO. A typed API client wraps the endpoints.
- **Reuse, don't rewrite:** the API contract is stable. No backend changes needed (maybe add a couple of read endpoints if a page needs combined data).
- **Rich text:** `insights` and `jobs` bodies are stored as **Quill Delta JSON** (`{"ops":[...]}`). Render server-side with `quill-delta-to-html` into styled HTML (carry over the current approach).
- **Images:** served by the API at `/uploads`. Configure `next/image` `remotePatterns` for the API host so uploaded images get optimization + lazy loading.
- **Env:** `NEXT_PUBLIC_API_BASE_URL` (and a server-only base for SSR). Dev → `http://localhost:3600`, prod → `https://api.psrao.co.in`.
- **Hosting:** Website → **Vercel**. API stays on its current host (or move to Render/Railway/VPS later). CORS already allows the needed origins; add the Vercel domain.

## 3. Information architecture (pages → data)
| Route | Page | API endpoints |
|-------|------|---------------|
| `/` | Home | carousel, ourservices?forFE, whatweoffer, logos, numbers, eventduedates, insights, ourteam, subscribe |
| `/about` (psraoassociates) | Firm story / why us | static + ourteamsection |
| `/services` | Services overview | ourservices?forFE |
| `/services/[slug]` | Service / key-offering detail | ourservices |
| `/team` | Our team | ourteam, ourteamsection |
| `/insights` | Blogs & articles index | insights (list) |
| `/insights/[type]/[id]` | Article/blog detail | insights?id= (Delta→HTML) |
| `/careers` | Careers landing | jobs (cards) |
| `/careers/jobs` | All openings + filters | careers/jobs |
| `/careers/jobs/[id]` | Job detail | careers/jobs?id= |
| `/careers/jobs/[id]/apply` | Application form (file upload) | post careers/jobapplication |
| `/contact` | Contact + form | contactinformation, post contactus |
| `/consultation` | Free consultation booking | available-slots, create-meeting |
| global | Header / Footer / Chatbot | contactinformation, post chatbot |

## 4. Design system (LOCKED: modern azure + all-sans)
**Palette** — modern fintech-forward, financial authority:
- Ink / near-black `#0B1220` (primary text & dark sections)
- Deep navy `#11203A` (brand base)
- **Accent: azure `#2E6BFF`** (CTAs, links, highlights) — with a slightly darker `#1E54E6` for hover and a soft `#EAF0FF` tint for backgrounds
- Neutrals: warm grays `#F7F7F5 → #6B7280`
- Light-first with intentional dark (ink/navy) sections for rhythm and contrast.

**Typography** — all-sans modern (one refined grotesque family):
- Headlines + body: **Geist** (primary choice) or **General Sans** — single family, varied weights/sizes for hierarchy.
- Headlines: tight tracking, large sizes, heavier weights; body: comfortable 16–18px, relaxed line-height.
- Strict type scale (12/14/16/18/20/24/32/44/64/80).
- Self-hosted via `next/font` (zero layout shift).

**Layout:** 12-col grid, generous margins, big section padding, consistent 8px spacing system, max-width ~1200–1280px content.

**Components:** Button (primary/ghost/link, subtle magnetic hover), Card (service, insight, job, team), Stat, LogoMarquee, Accordion (services/FAQ), Tabs, Input/Select/FileUpload, Modal/Sheet, Breadcrumbs, Pagination, Toast, Nav (sticky, condense on scroll), Footer, ChatWidget.

**Imagery:** consistent duotone/treatment on photos; custom line-icon set; subtle grain/gradient mesh for dark sections (restrained).

## 5. Motion system
**Principles:** purposeful, fast (150–400ms), eased (`easeOut`/custom cubic), GPU-friendly (transform/opacity only), and **disabled under `prefers-reduced-motion`**.

**Patterns:**
- Lenis smooth scroll (light) as the backbone.
- Scroll-reveal: staggered fade/translate-up on section entry (IntersectionObserver / Framer `whileInView`).
- **Number count-ups** for the stats block.
- **Logo marquee** (infinite, pauses on hover) for client logos.
- Sticky header that condenses; section-aware nav highlighting.
- Hero: restrained — typographic reveal + a single subtle motion element (slow gradient/parallax image), **not** a heavy WebGL scene.
- Page transitions: quick crossfade/clip (App Router + Framer).
- Micro-interactions: button magnetism, link underline draw, card hover lift.

**Performance budget for motion:** no layout thrash, lazy-mount below-fold animations, cap concurrent animations, ship motion code split per route.

## 6. SEO & performance
- SSR/SSG/ISR per page; `generateMetadata` for titles/OG/Twitter; canonical URLs.
- Structured data: `Organization`, `BreadcrumbList`, `Article` (insights), `JobPosting` (careers) — the JobPosting schema can boost Google Jobs visibility.
- `next/image` everywhere, responsive `sizes`, AVIF/WebP, blur placeholders.
- Fonts via `next/font` (self-hosted, no layout shift).
- Sitemap + robots; redirect old URLs (`/home` → `/`, keep `/ourservices` etc. as redirects to new routes).

## 7. Accessibility
WCAG AA contrast, semantic landmarks, focus-visible styles, skip-link, keyboard-operable menus/modals/carousel, `aria` on interactive bits, captions/alt text, reduced-motion path.

## 8. Phased build schedule
**Phase 0 — Foundations**
Scaffold `website-v2` (Next.js + TS + Tailwind), design tokens, fonts, Tailwind theme, typed API client, layout shell (Header/Footer), motion primitives (Lenis + reveal/stagger hooks), `next/image` config, env wiring.

**Phase 1 — Homepage** (the proof-of-concept)
Hero, services preview, stats count-up, client-logo marquee, what-we-offer, insights teaser, team teaser, events/calendar teaser, subscribe, CTA. This sets the visual bar.

**Phase 2 — Core pages**
About / PS Rao story, Services overview + service/key-offering detail, Team.

**Phase 3 — Insights**
Index (filter blog/article), detail page with Delta→HTML rendering + typographic article styling, PDF viewer, related posts.

**Phase 4 — Conversion pages**
Careers (landing, listing + filters, job detail with JobPosting schema, apply form with file upload), Contact (form → `contactus`), Free Consultation (calendar slots + `create-meeting`).

**Phase 5 — Polish & launch**
Chatbot widget, 404/500, SEO/sitemap/redirects, perf pass (Lighthouse), a11y audit, cross-browser/responsive QA, analytics, deploy to Vercel, DNS cutover.

## 9. Decisions
**Locked:**
- ✅ Direction: premium restrained, modern fintech-forward.
- ✅ Accent: **azure `#2E6BFF`**.
- ✅ Typography: **all-sans modern** (Geist / General Sans).
- ✅ Stack: Next.js (App Router) + TS + Tailwind + Framer Motion + Lenis.

**Still open (don't block Phase 0):**
1. **Domain/hosting:** stage v2 on Vercel first, then cut over `psraoassociates.com` / `psrao.co.in`?
2. **Content:** reuse current copy, or rewrite for a sharper, more premium voice (recommended — current copy is dense)?
3. **Logo/brand:** keep existing logo or refresh the mark?
4. **API hosting:** leave on current host, or migrate alongside (Render/Railway) for reliability?

## 10. New app structure (Phase 0 target)
```
website-v2/
├── app/                      # App Router pages (route = folder)
│   ├── layout.tsx            # root layout, fonts, header/footer, Lenis
│   ├── page.tsx              # home
│   ├── about/ services/ team/ insights/ careers/ contact/ consultation/
├── components/               # ui/ (buttons, cards, inputs) + sections/ (hero, stats, …)
├── lib/
│   ├── api.ts                # typed API client (wraps the Express endpoints)
│   ├── delta.ts              # Quill Delta → HTML
│   └── motion.ts             # reveal/stagger variants, reduced-motion helpers
├── styles/                   # tailwind globals, tokens
├── public/
└── next.config.ts            # image remotePatterns, redirects
```
```
```
