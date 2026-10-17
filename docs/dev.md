# Developer documentation — duhamedia.com

**How to use this doc:** find the page you are working on in the table of contents, then the unit (block, collection, global or integration) under it; each entry lists its files, fields, wiring and notes. Site-wide units, deployment, integrations and the restructure log have their own sections at the end.

Maintained by the `dev-docs` subagent after each unit lands. Facts only. Env vars are named, never valued.

Entry format for every unit: **Files** / **Fields & schema** / **Wiring** (registration, pages using it, revalidation, migration) / **Notes**. A unit used on several pages is documented once, under the first page (in site order) that uses it; later pages link to that entry.

## Table of contents

1. [Homepage](#1-homepage)
2. [Case Study template](#2-case-study-template)
3. [Work hub](#3-work-hub)
4. [Services Hub](#4-services-hub)
5. [Shopify Theme Development](#5-shopify-theme-development)
6. [Marketing](#6-marketing)
7. [Testimonials](#7-testimonials)
8. [About](#8-about)
9. [Book a Call](#9-book-a-call)
10. [Thank You](#10-thank-you)
11. [FAQ](#11-faq)
12. [Contact](#12-contact)
13. [DEV-SEO template](#13-dev-seo-template)
14. [MKT-SEO template](#14-mkt-seo-template)
15. [Campaign LP template](#15-campaign-lp-template)
16. [Newsletter](#16-newsletter)
17. [Link-in-Bio](#17-link-in-bio)
18. [Lead Magnet template](#18-lead-magnet-template)
19. [Review Hub](#19-review-hub)
20. [Legal template](#20-legal-template)
21. [404](#21-404)
- [Site-wide units (collections, globals, header, footers)](#site-wide-units)
- [Block showcase sandbox (`/_showcase`)](#block-showcase-sandbox-_showcase)
- [Deploy](#deploy)
- [Integrations](#integrations)
- [Restructure log](#restructure-log)

---

## 1. Homepage

Locked section order: Hero → Scarcity strip → Client logo strip → Featured case studies → Mini CTA strip → What we do → Process timeline → Founder/team + about → Testimonials → Final CTA → Footer (standard).

*No units documented yet.*

## 2. Case Study template

*No units documented yet.*

## 3. Work hub

*No units documented yet.*

## 4. Services Hub

*No units documented yet.*

## 5. Shopify Theme Development

*No units documented yet.*

## 6. Marketing

*No units documented yet.*

## 7. Testimonials

*No units documented yet.*

## 8. About

*No units documented yet.*

## 9. Book a Call

*No units documented yet.*

## 10. Thank You

*No units documented yet.*

## 11. FAQ

*No units documented yet.*

## 12. Contact

*No units documented yet.*

## 13. DEV-SEO template

*No units documented yet.*

## 14. MKT-SEO template

*No units documented yet.*

## 15. Campaign LP template

*No units documented yet.*

## 16. Newsletter

*No units documented yet.*

## 17. Link-in-Bio

*No units documented yet.*

## 18. Lead Magnet template

*No units documented yet.*

## 19. Review Hub

*No units documented yet.*

## 20. Legal template

*No units documented yet.*

## 21. 404

*No units documented yet.*

---

## Site-wide units

Collections, globals, header and footer variants, and anything not owned by a single page.

*No units documented yet.*

## Block showcase sandbox (`/_showcase`)

Renders every block and every variant back to back, for review at Gate K. Hidden from navigation, sitemap and search (noindex), and returns 404 when `APP_ENV=production`. Visible on local dev and staging only.

*Not built yet.*

---

## Deploy

Source: `DECISIONS.md` §D, §E, §F and `OPS_REQUESTS.md` #3. Items marked **TBD** are not yet confirmed or built.

### Push → staging
1. A unit clears its gates and is committed and pushed to `main`.
2. GitHub Actions builds one Docker image per commit **with no database access** (the `(frontend)` layout is `force-dynamic`; no DB-querying `generateStaticParams`; no `NEXT_PUBLIC_*` variables). It runs typecheck and lint, then pushes to the private GHCR repository `ghcr.io/duhadev/duhamedia`, tagged `sha-<commit>` and `main`.
3. The server's staging timer (owned by the server agent) pulls `:main` every few minutes and deploys it to `staging.duhamedia.com` (behind Cloudflare Access, always noindexed).
4. On container start, Payload's `prodMigrations` runs any pending committed migrations before the server serves. The deploy script then polls `GET /api/health` (200 = DB reachable, 503 otherwise); on failure it rolls back to the previous image and alerts the human through the secretary.

### Release → production
1. **Only when the human explicitly orders it** ("ship it", "deploy to production"), the PM creates and pushes a git tag `vX.Y.Z`.
2. CI **re-tags the already-built image** of that commit as `vX.Y.Z` and `production`. Production never gets a rebuild; it always runs an image that already ran on staging.
3. The server's production timer pulls `:production`; migrations run on start (as above); health is polled; failure rolls back automatically.

### Rollback
- Automatic: the deploy script rolls back if `/api/health` does not go green after a deploy (a failed migration aborts startup, so health never passes).
- Manual (human-triggered): point `production` back at the previous `vX.Y.Z` — via a CI job or a documented manual retag. **TBD:** the exact job/command, written when the workflow lands in Phase 1.
- Migrations must stay backward-compatible with the previous image for the seconds of deploy overlap; never drop content-holding columns/tables without a human-approved data step.

### Image and runtime
- Multi-stage Dockerfile, `output: 'standalone'`, non-root user, port 3000, Node 24 (`node:24-alpine`), no secrets baked in, all config from env at runtime.
- Memory target ≤ ~0.5 GB (`NODE_OPTIONS=--max-old-space-size=384`). **TBD:** measured figure (Phase 1).
- CI build minutes per run: **TBD** (measured in Phase 1; GitHub Free = 2,000 min/month).
- GHCR read token for server pulls: provided by the server agent (name **TBD**).

### Environment variables (names only)

| Name | Purpose |
|---|---|
| `DATABASE_URI` | Postgres connection string (`duha_site_staging` on staging) |
| `PAYLOAD_SECRET` | Payload signing secret |
| `APP_ENV` | `production` \| `staging` \| `development`; drives event `env`, staging noindex, `/_showcase` visibility |
| `SITE_URL` | Canonical origin, read at runtime (replaces the old `NEXT_PUBLIC_SITE_URL`) |
| `MEDIA_DIR` | Absolute path of the media directory in the container (bind-mounted; separate for staging/production) |
| `SITE_EVENT_URL` | Internal address of the OpenClaw secretary's site-event endpoint |
| `SITE_EVENT_SECRET` | HMAC key for signing site events |
| `RESEND_API_KEY` | Resend full-access key (email transport + contacts) |
| `RESEND_NEWSLETTER_SEGMENT_ID` | Resend newsletter Segment |
| `RESEND_NEWSLETTER_TOPIC_ID` | Resend newsletter Topic (replaces the retired `RESEND_AUDIENCE_ID`) |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (passed to client components as a prop) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret for server-side verification |

Local dev: values live only in the untracked `.env`, created from the committed `.env.example` (names and comments only). Local Postgres via `docker-compose.yml` (major version **TBD**, OPS_REQUESTS #6).

---

## Integrations

Every lead, signup and site error is sent to the OpenClaw secretary as a signed HTTP event, and newsletter signups sync to Resend Contacts. The full contract, signing, retry schedule, re-send procedure and per-event status live in [`INTEGRATIONS.md`](../INTEGRATIONS.md).

---

## Local development

- `docker compose up -d` → Postgres 17 (provisional) on **127.0.0.1:5433** (5432 is taken by another project on the dev laptop).
- `cp .env.example .env`, fill values, then `pnpm dev` → http://localhost:3000, admin at `/admin`.
- Dev DB `duha_site_dev` uses Drizzle push. **Never run `migrate:create` against it** — use a scratch DB (push and migrations must not share a database).
- Schema change: `pnpm payload migrate:create <name>` (scratch DB), review, commit with `pnpm generate:types` output.
- Local image test: `docker build .` then `docker run --network host --env-file .env …`.
- `next.config.ts` sets `agentRules: false`: Next 16.3 otherwise appends an agent-rules block to `CLAUDE.md` on `next dev`.

## Restructure log

Phase 1, 2026-10-17. The old site had no traffic (human, Gate 0), so it was removed wholesale. Everything removed is in git history at commit `de85e93`.

**Removed**
- All old routes in `src/app/`: pages (`/`, `15-minute-audit`, `about`, `contact`, `founding-client` + `/apply`, `free-audit`, `how-it-works`, `insights` + `/blog`, `/blog/[slug]`, `/teardowns`, `methodology`, `privacy`, `results` + `/case-studies`, `services` + `/class-a|b|c`, `terms`), custom `admin/**`, client portal `dashboard/**`, `auth/**`, API routes `audit-request`, `auth/[...path]`, `contact`, `founding-client-apply`, `newsletter`, `pdf-lead`, 14 `opengraph-image.tsx`, old `layout.tsx`, `not-found.tsx`, `globals.css`.
- `src/components/**` (28 files), `src/lib/**` (auth, db, email, og-image, sanitize, schema), `src/proxy.ts`.
- `db/schema.sql`, `SETUP.md`, `_reference/**`, `design/**`, `Background.svg`, `Background_preview.png`, `public/{file,globe,next,vercel,window,Background}.svg`, `public/hero-analytics.png`, stock `README.md`, `package-lock.json` (npm → pnpm).
- Dependencies: `@neondatabase/auth`, `@neondatabase/serverless`, `@vercel/blob`, `recharts`, `validator`, `@types/validator`, `react-markdown`, `resend` (re-add with the newsletter sync).

**Kept**
- `public/logo.svg`, `public/logo-capitalized.svg`, `public/logo-lowercase.svg`; favicon moved to `src/app/(frontend)/icon.svg`.

**Added**
- Payload 3.91.0 in place: `src/payload.config.ts`, `src/app/(payload)/**` (verbatim from `templates/blank` at v3.91.0), `src/app/(frontend)/**` placeholder, boot-scaffolding `users` + `media` collections (revised at Gate S), `src/access/roles.ts`, `src/lib/env.ts`, `src/app/api/health/route.ts`, `src/migrations/`.
- `Dockerfile`, `.dockerignore`, `docker-compose.yml` (local Postgres only), `.env.example`, `.github/workflows/{build,release}.yml`.
