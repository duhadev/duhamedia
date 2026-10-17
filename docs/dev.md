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
  - [Collections](#collections)
    - [Access helpers + `users` (C1)](#access-helpers--users-unit-c1)
    - [`media` + `downloads` (C2)](#media--downloads-unit-c2)
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

### Collections

Entries are in build order (C1, C2, C3 …), not `SCHEMA.md` §6 order (PM decision).

#### Access helpers + `users` (unit C1)

**Files**
- `src/access/roles.ts`: `ROLES` (`admin`, `marketing`, `pipeline`), `Role` type, `ROLE_LABELS`, `roleOf` (returns `null` for a missing/unknown role, which means no access), predicates `isAdmin`, `isMarketing`, `isStaff` (admin or marketing, never pipeline), `isPipeline`. (The deprecated `authenticated` alias that C1 kept for `Media.ts` was removed in C2.)
- `src/access/index.ts`: re-exports the role module, plus shared helpers:
  - `adminOnly`, `staffOnly` (collection `Access`).
  - `adminOnlyField`, `staffOnlyField` (field `FieldAccess`, boolean only).
  - `publishedOrStaff`: staff → `true`; everyone else (public and pipeline) → `{ _status: { equals: 'published' } }`.
  - `turnstileVerifiedOrAdmin`: `req.context.turnstileVerified === true` or admin. For `form-submissions` create; the flag is set only by the server-side form handler after Turnstile siteverify.
  - `posts`-only helpers, written for unit C8 and not yet attached: `postsRead` (staff all · pipeline drafts · public published), `staffOrPipeline` (create), `staffOrPipelineDrafts` (update: staff all · pipeline drafts · public none).
- `src/access/pipeline.ts`: `forbidPipelinePublish`, a collection `beforeChange` hook for `posts` (attached in C8). For a pipeline user, any `_status` other than `draft` throws `Forbidden` (403); otherwise forces `_status: 'draft'`.
- `src/collections/Users.ts`: the `users` collection.
- `src/migrations/20261017_193341_c1_users_role.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

| Field | Type | Notes |
|---|---|---|
| `email`, `password` | auth (generated) | |
| `name` | text | Admin display name |
| `role` | select `admin` / `marketing` / `pipeline`, required, default `marketing`, `saveToJWT: true` | Field access create/update: admin only. DB enum `enum_users_role` |
| `enableAPIKey`, `apiKey`, `apiKeyIndex` | auth (API key) | `apiKey` field overridden so create/update is admin only; Payload propagates this to `enableAPIKey`, `apiKeyIndex` and `hasAPIKey` read |

- `auth`: `maxLoginAttempts: 5`, `lockTime: 600000` (10 min), `useAPIKey: true` (`reveal` default false), `tokenExpiration: 7200` (2 h), sessions on (default).
- Hooks:
  - `beforeChange` `firstUserIsAdmin`: on create, if the collection has 0 users, sets `role: 'admin'`.
  - `beforeChange` `apiKeyOnlyForPipeline`: a key may exist only on a `pipeline` user. Changing a user's role away from `pipeline` sets `enableAPIKey: false`, `apiKey: null`, `apiKeyIndex: null` in the same save. Enabling/setting a key on any other role throws `ValidationError` on `role`.
  - `beforeLogin` `blockPipelineLogin`: a `pipeline` user's password login throws `AuthenticationError` (generic incorrect-credentials message). Applies to login and reset-password.
- Access matrix:

| Who | admin panel | read | create | update | delete | unlock |
|---|---|---|---|---|---|---|
| admin | yes | all | yes | all | yes | yes |
| marketing | yes | own doc | no | own doc (not `role`, not API-key fields) | no | no |
| pipeline | no | none | no | none | no | no |
| public | no | none | no | no | no | no |

- Pipeline authentication: header `Authorization: users API-Key <key>` only.

**Wiring**
- Registration: `src/payload.config.ts` → `collections` array (see C2 for the current list), `admin.user: Users.slug`.
- Pages using it: none (not publicly rendered).
- Revalidation: n/a.
- Migration: `20261017_193341_c1_users_role`. Up: creates `enum_users_role`, adds `name`, `role` (default `marketing`, not null), `enable_a_p_i_key`, `api_key`, `api_key_index`; data step sets `role = 'admin'` for every user holding `admin` in `users_roles`; drops `users_roles` and `enum_users_roles`. Down (best-effort): restores one `users_roles` row per admin/marketing user; pipeline users get no row and lose their key; a user who held both roles comes back admin only; `name` values are lost.

**Notes**
- Pipeline user has no access to `users` documents (not even its own). This is stricter than `SCHEMA.md` §4.3 ("others: self"); PM decision.
- Nothing relies on Payload's default access ("any logged-in user"), because the pipeline user is logged in. Every collection and global sets read/create/update/delete explicitly from these helpers.
- The pipeline user is created by an admin; its password is never used.

#### `media` + `downloads` (unit C2)

**Files**
- `src/collections/Media.ts`: the `media` collection; exports `MEDIA_DIR` (shared upload root).
- `src/collections/Downloads.ts`: the `downloads` collection; imports `MEDIA_DIR` from `Media.ts`.
- `src/access/roles.ts`: deprecated `authenticated` alias removed (no remaining imports).
- `src/payload.config.ts`: `collections: [Users, Media, Downloads]`.
- `src/migrations/20261017_195538_c2_media_downloads.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

`media` (images only; no drafts; `useAsTitle: 'alt'`; default columns `filename`, `alt`, `updatedAt`):

| Field | Type | Notes |
|---|---|---|
| `alt` | text, required | Custom `validate` (below) |
| `caption` | text, optional | Default caption when used as a figure in an article |
| upload fields | generated | `filename`, `mimeType`, `filesize`, `width`, `height`, `focalX`/`focalY`, `sizes.*` |

- `alt` validator (`validateAlt`): runs Payload's default `text` validator from `payload/shared` first (a custom `validate` replaces the built-in one, so this keeps `required` enforced), then rejects whitespace-only values and file-name-like values matching `/\.(jpe?g|png|webp|gif)$/i`.

- `upload`: `mimeTypes: ['image/*']` (SVG allowed, human decision; Payload runs its own SVG safety check), `focalPoint: true`, `adminThumbnail: 'thumbnail'`.
- `imageSizes` (all `position: 'centre'`):

| Name | Size | Intended use |
|---|---|---|
| `thumbnail` | 400×300 | Admin thumbnail |
| `card` | 768 wide | Cards |
| `browser` | 1440 wide | Page 2 browser-framed case-study hero |
| `wide` | 1600 wide | Wide images |
| `og` | 1200×630 | Open Graph image (`seo-defaults` / plugin-seo) |

`downloads` (non-image lead-magnet deliverables; no drafts; `useAsTitle: 'title'`; default columns `title`, `filename`, `updatedAt`):

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | Admin title and link text in the delivery email |
| upload fields | generated | `filename`, `mimeType`, `filesize` |

- `upload`: `mimeTypes` `application/pdf`, `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx), `application/zip`; `focalPoint: false`, `crop: false`, no `imageSizes`.

Access (both collections):

| Who | read | create | update | delete |
|---|---|---|---|---|
| public | yes | no | no | no |
| admin, marketing (`staffOnly`) | yes | yes | yes | yes |
| pipeline | yes (public read) | no | no | no |

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads]`.
- Storage: `MEDIA_DIR = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')`.
  - `media` `staticDir`: `${MEDIA_DIR}/media`.
  - `downloads` `staticDir`: `${MEDIA_DIR}/downloads`.
  - Payload creates the directories on first upload.
- Serving: `/api/media/file/<filename>` and `/api/downloads/file/<filename>`, public read. Paths containing `../` are rejected with 403.
- Pages using it: `media` is referenced by any unit that renders imagery; `downloads` by `lead-magnets` (page 18). Linked from those entries as they land.
- Revalidation: n/a in this unit. Pages that render media revalidate through their own collection/global hooks.
- Migration: `20261017_195538_c2_media_downloads`. Additive only.
  - Up: creates `downloads` table (+ `updated_at`, `created_at` indexes, unique `filename` index); adds `media.caption` and the `sizes_browser_*` and `sizes_og_*` columns (+ filename indexes); adds `payload_locked_documents_rels.downloads_id` with FK `payload_locked_documents_rels_downloads_fk` (ON DELETE cascade) and index.
  - Down: hand-reordered to drop the FK before `DROP TABLE "downloads" CASCADE` (the generated order failed because CASCADE had already removed the FK); then drops the added indexes and columns.

**Notes**
- `media/` and `downloads/` are siblings under `MEDIA_DIR` on purpose: Payload's file route serves any path under a collection's `staticDir`, so nesting one inside the other would let `/api/media/file/downloads%2F<name>` serve a download.
- `mimeTypes` is enforced server-side by content sniffing (`uploads/checkFileRestrictions.js`), not only in the file picker.
- PDF uploads are validated by Payload 3.91.0 (`payload/dist/utilities/validatePDF.js`): the file must start with `%PDF-` and contain both `xref` and `%%EOF` in its last 1024 bytes. Seed fixtures must be real PDFs.
- A request for a missing file returns **500** "Something went wrong." (stock 3.91.0 behaviour, not 404). The `site_error` reporter must ignore or rate-limit these.
- Non-image assets never go in `media`, so every `media` document has a meaningful alt.

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
- Migration workflow details (from C1):
  - Generate against a scratch DB migrated to HEAD (all committed migrations applied), never the push-managed dev DB.
  - `migrate:create` is interactive on enum/column renames (drizzle create-vs-rename prompts). Run it under a pty and answer each prompt explicitly.
  - Hand-edited data steps (e.g. the C1 admin-preserving `UPDATE`) must be applied to the dev DB by running the migration's SQL before the next push, because push cannot run them.
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
