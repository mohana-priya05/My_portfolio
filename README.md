# Mohana Priya — Portfolio

A premium personal portfolio for **Mohana Priya** (Full Stack Developer) built with
Next.js 16 (App Router), React 19, TypeScript, Zod, Tailwind CSS 4 and lucide icons.

Two experiences in one app:

- **Public portfolio** — SEO-ready landing page, project detail pages,
  light/dark theme, responsive from 320px to 1440px+, accessible.
- **Admin panel** (`/admin`) — password-protected editors for every content section,
  plus a media manager. All content is stored as **versioned JSON files** — there is
  **no database anywhere** (no PostgreSQL, MySQL, MongoDB, Redis, Prisma, TypeORM,
  Sequelize, or ORM migrations).

---

## How content works (no database)

Every content section lives in `content/*.json` (12 files):

| File                 | Section                               | Editor path        |
| -------------------- | ------------------------------------- | ------------------ |
| `profile.json`       | Name, title, contact details          | `/admin/profile`   |
| `hero.json`          | Hero heading, tagline, CTAs           | `/admin/hero`      |
| `about.json`         | About summary + body                  | `/admin/about`     |
| `statistics.json`    | Stats cards (2+, 5+, 10+, 25+)        | `/admin/about`     |
| `skills.json`        | Skill categories                      | `/admin/skills`    |
| `experience.json`    | Work experience timeline              | `/admin/experience`|
| `projects.json`      | Projects + project detail pages       | `/admin/projects`  |
| `education.json`     | Education (BCA AI & DS, MGR College)  | `/admin/education` |
| `mentorship.json`    | Training & mentorship                 | `/admin/mentorship`|
| `ai-tools.json`      | AI tools & practices                  | `/admin/ai-tools`  |
| `social-links.json`  | Email/socials                         | `/admin/social-links`|
| `settings.json`      | SEO metadata, resume, admin text      | `/admin/settings`  |

The flow on every admin save:

1. The client editor serializes the form.
2. `POST`/`PUT /api/admin/content/[key]` validates it with a Zod schema.
3. The file is written to local `content/` (default `CONTENT_WRITE_LOCAL=true`),
   so the dev server reflects changes immediately.
4. If GitHub is configured, the same change is committed to GitHub via the
   **GitHub Contents API** — the commit history is your content versioning.
   Binary assets (`public/images`, `public/resume`) are committed the same way.

Nothing sensitive (tokens, hashes) is ever stored in these files — they are public
content only.

### Content rules

Empty/optional fields are **hidden on the public site** and simply editable in the
admin panel (no invented URLs, companies, or metrics). For example:

- A project with no `githubUrl` or `liveUrl` shows no buttons.
- An experience/project with no company shows no company line.
- Contact details with no URL are omitted from the footer.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Never commit
`.env.local`.

| Variable | Purpose | Required? |
| --- | --- | --- |
| `ADMIN_EMAIL` | Email used to sign in to `/admin` | yes (for admin) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password | yes (for admin) |
| `JWT_SECRET` | Secret for the `admin_session` HTTP-only cookie | yes (for admin) |
| `SESSION_MAX_AGE` | Session lifetime in seconds (default `43200`) | no |
| `GITHUB_OWNER` | GitHub username / org | for GitHub storage |
| `GITHUB_REPOSITORY` | Repository name | for GitHub storage |
| `GITHUB_BRANCH` | Branch (default `main`) | no |
| `GITHUB_TOKEN` | Fine-grained PAT, Contents read/write on that repo | for GitHub storage |
| `CONTENT_WRITE_LOCAL` | `true` (default) — also write to local `content/` | no |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/sitemap | no |

**Important — bcrypt hashes and `$`:** Next.js expands `$VAR` inside `.env` values,
which would silently corrupt a bcrypt hash like `$2b$12$...`. Escape every `$` as
`\$` when putting a hash in `.env.local`:

```
ADMIN_PASSWORD_HASH="\$2b\$12\$EXAMPLE..."
```

Generate a hash with the included script:

```bash
node scripts/hash-password.mjs "your-password"
```

### Enabling GitHub storage

1. Create (or use) a repository, e.g. `mohana-priya-portfolio`.
2. Create a **fine-grained personal access token** with:
   - Scope: Contents → Read and write (on that repo only).
   - Commit the initial seed files (`content/`, `public/images/`, `public/resume/`)
     to the repo so SHA lookups succeed.
3. Set `GITHUB_OWNER`, `GITHUB_REPOSITORY`, `GITHUB_TOKEN` (and `GITHUB_BRANCH`).
4. Restart the dev server. The dashboard shows the GitHub connection status and
   every admin save creates a commit like `content: Update projects`.

The app still works fully without GitHub configured — content is stored locally.

---

## Project structure

```
content/                  # The content store (versioned JSON)
scripts/
  hash-password.mjs       # BCrypt hash generator for admin setup
src/
  app/
    (public)/             # Public site (Navbar + Footer layout)
      page.tsx            # Homepage: all sections
      projects/[slug]/    # Project detail pages (ISR)
    admin/                # /admin — login, dashboard, per-section editors
    api/admin/content/    # GET/PUT content files (auth + validation)
    api/admin/images/     # List/upload/delete public media
    api/admin/login|logout
  components/
    public/               # Navbar, Hero, About, Skills, Experience, Projects, etc.
    admin/                # Shell, editors, UI kit, toast, media manager
  lib/
    auth/                 # session (jose JWT), password (bcryptjs), rate limiting
    content/              # read/write/validate content files
    github/               # GitHub Contents API client (commits)
    validation/           # Zod schemas (reused by server + client)
  proxy.ts                # Next 16 proxy — guards /admin routes
  types/content.ts        # TypeScript types for every content file
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (next/core-web-vitals + react-hooks)
npx tsc --noEmit   # type check
```

## Security notes

- Admin credentials live only in server-side environment variables; the GitHub
  token, JWT secret and password hash never reach the browser.
- The admin session is an HTTP-only, SameSite=Strict cookie signed with jose (HS256).
- Login is rate-limited (in-memory per IP).
- A `src/proxy.ts` (Next 16 Proxy, formerly Middleware) guards every `/admin/*`
  page except `/admin/login`.