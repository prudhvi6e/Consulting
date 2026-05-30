# PS Rao & Associates — Web Platform

The complete web platform for **PS Rao & Associates** (a corporate / financial
consultancy). It is made of **three applications** that live side by side in this
folder:

| Folder | App | What it is | Stack |
|--------|-----|------------|-------|
| `Backend-master/` | **API** | REST API + business logic, file uploads, Google-Calendar booking, AI chatbot | Node.js, Express, PostgreSQL (Supabase) |
| `prraoassociates-master/` | **Website** | The public-facing marketing site visitors see | React + TypeScript + Vite |
| `adminpanel-master/` | **Admin** | Internal CMS where staff manage all site content | React + TypeScript + Vite |

## How they fit together

```
  Website (public)  ─┐
   localhost:3000    │
                     ├──►  API  ──►  PostgreSQL (Supabase)
   Admin (CMS)      ─┘   localhost:3600   ├──►  Google Calendar (consultation booking)
   localhost:5173                         └──►  OpenAI (chatbot)
```

- The **API** is the single source of truth. Both React apps talk to it over HTTP.
- The **Admin** app creates/edits content (carousel, services, team, jobs,
  insights, …); the **Website** reads and displays that same content.
- Content, job applications, and contact submissions are stored in **PostgreSQL**
  (hosted on Supabase). File uploads (images, resumes) are stored on disk under
  `Backend-master/uploads/` and served at `/uploads`.

---

## Running everything locally

### Prerequisites
- **Node.js 18+** (tested on Node 22)
- A **PostgreSQL database** — the project targets **Supabase**. See
  `Backend-master/README-SUPABASE.md` for creating the schema.

### 1. API  (`Backend-master`)
```bash
cd Backend-master
npm install
# create .env from the template and fill in the values:
cp .env.example .env        # then edit .env
npm start                   # http://localhost:3600
```
Required `.env` values (see `.env.example`):
- `DATABASE_URL` — your Supabase Postgres connection string (URL-encode special
  characters in the password)
- `DB_SSL=true` for Supabase
- `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `OPENAI_API_KEY`

A successful start prints `Connected to Postgres!`.

### 2. Website  (`prraoassociates-master`)
```bash
cd prraoassociates-master
npm install
npm run dev                 # http://localhost:3000
```

### 3. Admin  (`adminpanel-master`)
```bash
cd adminpanel-master
npm install
npm run dev                 # http://localhost:5173
```

### Pointing the front-ends at the API
Both apps default to the **local** API (`http://localhost:3600`) for development:
- Website: `prraoassociates-master/src/constants/CONSTS.ts` → `BASE_URL = LOCAL`
- Admin: `adminpanel-master/src/constants.ts` → `LOCALDOMAIN = Local`

To use the production API instead, switch those to `PROD` / `production`.

---

## API project structure (`Backend-master`)

The API was refactored from a single 2000-line file into focused modules:

```
Backend-master/
├── index.js                  # entry point: builds the app, mounts routers, listens
├── .env                      # secrets & config (not committed)
├── supabase/migrations/      # database schema (run on Supabase)
├── uploads/                  # uploaded files (images, resumes)
└── src/
    ├── config.js             # env vars, CORS, Google/OpenAI config, ROOT_DIR
    ├── db.js                 # Postgres pool + query adapter
    ├── utils.js              # deleteFile, serviceTransformation
    ├── middleware/
    │   ├── auth.js           # JWT authentication (authenticateToken)
    │   └── upload.js         # multer file-upload handling
    ├── services/
    │   ├── calendar.js       # Google Calendar (consultation slots & booking)
    │   └── chatgpt.js        # OpenAI chatbot call
    └── routes/               # one router per feature area
        ├── auth.routes.js          # register / login / refresh-token
        ├── uploads.routes.js       # image/file uploads
        ├── meetings.routes.js      # available-slots / create-meeting
        ├── carousel.routes.js      # home carousel slides
        ├── ourservices.routes.js   # services + key offerings
        ├── homeBlocks.routes.js    # whatweoffer, logos, numbers, events, team-section, contact-info
        ├── insights.routes.js      # blogs & articles
        ├── ourteam.routes.js       # team member profiles
        ├── careers.routes.js       # job listings + applications
        ├── contactus.routes.js     # contact form + newsletter subscribers
        └── chatbot.routes.js       # AI chatbot proxy
```

Every route file exports an `express.Router()` mounted in `index.js`. Shared
concerns (DB, auth, uploads) are imported from `src/`.

> **Note:** `index.monolith.bak.js` is the original single-file version, kept as a
> reference. It can be deleted once you're comfortable with the new structure.

### Database
- Schema lives in `Backend-master/supabase/migrations/`. Apply it to your Supabase
  project (SQL Editor or `supabase db push`). Details in `README-SUPABASE.md`.
- The API connects directly to Postgres via the `pg` driver (not `supabase-js`).

---

## Security notes
- All secrets live in `Backend-master/.env` (git-ignored). Never commit real keys.
- If any secret has ever been exposed, **rotate it**: OpenAI key, the Supabase
  database password, and the JWT secrets.
