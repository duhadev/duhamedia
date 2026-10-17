# DECISIONS — Duha Media (duhamedia.com)

Phase 0 output, written 2026-10-17. **Status: Gate 0 APPROVED by the human 2026-10-17.** This file is binding; overrides go through the Decision log.

Each entry: **Decision** · rationale · source. Research was done 2026-10-17 against official docs, GitHub (read at tag `v3.91.0`, because Payload's `main` branch already carries v4 code) and the npm registry.

---

## A. Repository inventory

### A1. Stack of the old site
| Item | Finding | Where |
|---|---|---|
| Framework | Next.js **16.1.6**, App Router under `src/app` | `package.json`, `package-lock.json` |
| React | 19.2.3 (pinned exact) | `package.json` |
| Styling | Tailwind CSS **4.1.18** via `@tailwindcss/postcss`. No `tailwind.config`; tokens in `@theme inline` | `src/app/globals.css:1-27`, `postcss.config.mjs` |
| TypeScript | 5.9.3 strict, alias `@/* → ./src/*` | `tsconfig.json` |
| Lint | ESLint 9 + `eslint-config-next` 16.1.6 | `eslint.config.mjs` |
| Package manager | npm (`package-lock.json` only) | |
| Node | no `.nvmrc` / `engines` | |
| Content | Page copy hardcoded in TSX (`src/app/**/page.tsx`, `src/components/sections/*`). Blog posts only in live Neon table `public.posts` (markdown, `react-markdown`) | `src/lib/db.ts`, `src/app/insights/blog/[slug]/page.tsx` |
| Database | Neon via `@neondatabase/serverless`, raw SQL. Schema file is incomplete: API routes write to 5 tables not in `db/schema.sql`; `/admin/inbox` reads a table nothing writes | `db/schema.sql`, `src/app/api/*/route.ts` |
| Auth | Neon Auth `@neondatabase/auth` 0.1.0-beta.21; middleware `src/proxy.ts` (matcher `/admin/:path*`, `/dashboard/:path+`) | `src/lib/auth/*` |
| Other | `@vercel/blob` (client PDF reports), `resend` 6.x, `recharts`, `validator` | |
| Deploy | Vercel Git integration; no `vercel.json`; `next.config.ts` empty | `.vercel/project.json` (gitignored) |
| Docker / CI / tests | none | |
| Git | 25 commits, 2026-04-12 → 2026-04-24, remote `git@github.com:duhadev/duhamedia.git` | |

Env var **names** the old code reads: `DATABASE_URL`, `NEON_DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `OWNER_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL`, `BLOB_READ_WRITE_TOKEN`. All are retired by this rebuild except the Resend key (re-scoped, see K).

### A2. Reusable
- **Assets:** `public/logo.svg`, `logo-capitalized.svg`, `logo-lowercase.svg`; `src/components/ui/LogoMark.tsx` (inline logo); `src/app/icon.svg` (favicon); `public/hero-analytics.png` (actually JPEG, 988×721). Final use depends on `/design-reference/`.
- **Code worth porting (rewritten to new conventions, not copied blind):**
  - `src/lib/sanitize.ts` — input sanitising on `validator`.
  - `src/lib/email/templates.ts`, `index.ts` — Resend notification templates (reference for form-builder emails).
  - `src/lib/schema.ts` — JSON-LD Organization/Breadcrumb helpers. Its logo URL `/logo.png` does not exist (broken today).
  - `src/lib/og-image.tsx` — OG generator (reference only; plugin-seo owns OG now).
  - Markdown renderer map, `src/app/insights/blog/[slug]/page.tsx:14-61`.
  - Skip-link / focus styles in `globals.css`, `ScrollReveal`.
- **Copy:** old positioning is "CRO & Web Design for Shopify Brands" (Class A/B/C tiers) and does not match the new narrative. Possibly reusable with approval: about / methodology / how-it-works narrative, contact routing copy, `/privacy` and `/terms` text (see Q6).
- **Docs:** `design/style-guide.md`, `design/page-layouts.md` — old positioning; superseded by `/design-reference/` once imported.

### A3. Dead or banned (removed in Phase 1, each removal logged in the Decision log)
- **Banned by CLAUDE.md** (no Neon, no Vercel Blob, no public accounts / client portal):
  - `src/app/admin/**` (old custom admin; `/admin` is taken over by Payload), `src/app/dashboard/(portal)/**`, `src/app/auth/**`, `src/app/api/auth/**`, `src/proxy.ts`, `src/lib/auth/*`, `src/lib/db.ts`, `db/schema.sql`, `SETUP.md`.
  - Deps `@neondatabase/serverless`, `@neondatabase/auth`, `@vercel/blob`, `recharts`.
  - Portal marketing: `src/app/dashboard/page.tsx`, `src/components/sections/DashboardShowcase.tsx`, "Dashboard" links in `Header.tsx:58` / `Footer.tsx:9`.
  - n8n mentions (`about/page.tsx`, `dashboard/page.tsx`, `ToolStackStrip.tsx`) — n8n is retired.
  - `CaseStudiesComingSoon` (used in 10 places) — "coming soon" is forbidden by the Launch-state rule.
- **Unused:** `sections/CaseStudies.tsx`, `sections/WhatWeTrack.tsx`, `ui/Button.tsx`, `ui/Card.tsx`, `ui/SectionHeader.tsx`, `lib/auth/server.ts`.
- **Stale:** `public/{file,globe,next,vercel,window}.svg` (create-next-app), `Background.svg` ×2 (2.6 MB, unreferenced), `Background_preview.png` (3.6 MB), stock `README.md`, `design/.obsidian/`, `tsconfig.tsbuildinfo`, `_reference/` (contains files from an unrelated client project: `Home.tsx`, `Locations.tsx`, `Programs.tsx`, `Sponsorship.tsx`, etc.).
- The 5 old public API routes (`/api/audit-request`, `/api/contact`, `/api/founding-client-apply`, `/api/newsletter`, `/api/pdf-lead`) are replaced by form-builder submissions.

### A4. Design reference
`/design-reference/` **does not exist** in this repo, and no handoff files were found anywhere in it. It must be imported before Phase 2. Does not block Gate 0.

---

## B. Restructure path

**Decision:** install Payload **into the existing Next.js app** and reshape in place.
- Move existing routes and root layout into `src/app/(frontend)/`; copy `src/app/(payload)/` verbatim from the blank template at `v3.91.0`; wrap `next.config` with `withPayload`; make the project ESM; add `@payload-config` tsconfig alias; `payload.config.ts` at `src/`.
- Borrow from the official **website template** its machinery only: drafts + preview URL, live preview, revalidation hooks, seed-script pattern, plugin wiring, Dockerfile. Not its demo content, not `plugin-search`/`plugin-nested-docs` (rejected), not its `db-mongodb` default.
- Keep repo, git history and URL structure (see C).
- Rationale: old site is already Next.js App Router; Payload 3 installs natively into one.
- Sources: https://payloadcms.com/docs/getting-started/installation · https://raw.githubusercontent.com/payloadcms/payload/v3.91.0/templates/website/README.md

---

## C. Redirect map

> **Superseded 2026-10-17 (human, Gate 0 Q5):** the old site had no real traffic. **No redirect map; old URLs are not preserved.** Restructure may overwrite anything. `plugin-redirects` stays for marketing self-service only. Phase 5's redirect-map check is therefore empty. Table below kept for the record only.

### C (original proposal, not adopted)

There is no sitemap, robots file or config redirect today. The only redirect is in code (`/15-minute-audit` → `/free-audit`). Every old URL below survives or 301s via `@payloadcms/plugin-redirects`.

| Old URL | Outcome |
|---|---|
| `/` | unchanged (Homepage) |
| `/services` | unchanged (Services Hub) |
| `/about` | unchanged |
| `/contact` | unchanged |
| `/privacy`, `/terms` | unchanged (Legal template) |
| `/services/class-a` | 301 → `/services/shopify-theme-development` *(proposed)* |
| `/services/class-b` (incl. `#conversion-guarantee`) | 301 → `/services/marketing` *(proposed)* |
| `/services/class-c` | 301 → `/services` *(proposed)* |
| `/how-it-works`, `/methodology` | 301 → `/about` |
| `/results`, `/results/case-studies` | 301 → `/work` |
| `/insights` | unchanged (posts hub) |
| `/insights/blog` | unchanged (posts list) |
| `/insights/blog/<slug>` | unchanged for every migrated post. **Slugs exist only in the live Neon DB** — export needed (Q7) |
| `/insights/teardowns` | 301 → `/insights` |
| `/free-audit`, `/15-minute-audit`, `/founding-client`, `/founding-client/apply` | 301 → `/book-a-call` |
| `/dashboard`, `/dashboard/overview`, `/dashboard/experiments`, `/dashboard/reports` | 301 → `/` |
| `/auth/sign-in`, `/auth/email-otp`, `/auth/sign-up` | 301 → `/` |
| `/admin/*` (old custom admin) | replaced by Payload admin at `/admin` |
| `*/opengraph-image` (14 routes) | dropped; OG images come from plugin-seo meta |

**Proposed new paths** for the 21 page types: `/` · `/work` · `/work/<slug>` (case study) · `/services` · `/services/shopify-theme-development` · `/services/marketing` · `/testimonials` · `/about` · `/book-a-call` · `/thank-you` · `/faq` · `/contact` · `/insights/<slug>` (DEV-SEO / MKT-SEO posts) · `/lp/<slug>` (Campaign LP) · `/newsletter` · `/links` (Link-in-Bio) · `/resources/<slug>` (Lead Magnet) · `/reviews` · `/privacy`, `/terms` (Legal) · 404 · `/_showcase` (dev/staging only).

---

## D. Versions & runtime

| Decision | Rationale | Source |
|---|---|---|
| **`payload@3.91.0`**, every `@payloadcms/*` at exactly `3.91.0` | Latest stable (2026-10-15). Plugins declare peer `payload: 3.91.0`, so lockstep is enforced | https://github.com/payloadcms/payload/releases · https://registry.npmjs.org/payload/latest |
| **Payload 4.0 quarantined** | 4.0.0-beta.2 released 2026-10-16; no stable date. Not applicable | https://github.com/payloadcms/payload/releases/tag/v4.0.0-beta.0 |
| **`next` ≥ 16.3.3** (pin exact at install) — upgrade from 16.1.6 | `@payloadcms/next@3.91.0` peer range is `>=15.2.9 <15.3.0 \|\| >=15.3.9 <15.4.0 \|\| >=15.4.11 <15.5.0 \|\| >=16.3.3 <17`. Installation docs say "16.2.6+"; the stricter peer range wins | https://unpkg.com/@payloadcms/next@3.91.0/package.json |
| **`react` / `react-dom` 19.2.6** | Website template pin; plugin peers accept `^19.2.1` | https://raw.githubusercontent.com/payloadcms/payload/v3.91.0/templates/website/package.json |
| **Node 24 LTS**, image `node:24-alpine` | Payload needs ≥ 20.18.1; deployment docs use node 24 | https://payloadcms.com/docs/v3/production/deployment.md |
| **pnpm** (replacing npm) | Payload's preferred manager, used by its templates; yarn 1 unsupported. Confirm Q9 | https://payloadcms.com/docs/getting-started/installation |
| `output: 'standalone'`, persistent Node server in a container | Template Dockerfile pattern | https://raw.githubusercontent.com/payloadcms/payload/v3.91.0/templates/with-postgres/Dockerfile |
| Memory target ≤ ~0.5 GB: `NODE_OPTIONS=--max-old-space-size=384`, **measured in Phase 1** | No official figure. One user reports ~180 MB idle locally, 2–2.5 GB unbounded on Railway (anecdote, low confidence) | https://station.railway.com/questions/wildly-inaccurate-memory-usage-doesn-t-77787d5d |

---

## E. Database adapter & migrations

- **Decision:** `@payloadcms/db-postgres@3.91.0`. Dev uses Drizzle push against local Postgres only. Before every commit with a schema change: `payload migrate:create <name>`, review, commit, log.
- **Decision:** production and staging run migrations with **`prodMigrations`**: `postgresAdapter({ prodMigrations: migrations })`, importing `src/migrations/index.ts` (Payload default `migrationDir`).
  - Rationale: pending migrations run during Payload init, before the server finishes starting, in a long-running container (the case the docs recommend it for). Because the migrations are imported by the config, they are bundled into the standalone output. The `payload` CLI is not guaranteed to exist in a standalone build (undocumented; community reports it missing).
  - Consequence for the server agent's script: it does not run a separate migrate command. It starts the new container (migrations run on boot), polls `/api/health`, and rolls back if health fails. A migration that fails aborts init, so health never goes green and rollback triggers. Recorded in OPS_REQUESTS #3.
  - Migrations must stay backward-compatible with the previous image for the seconds of overlap (no content-holding drops without an approved data step — already a CLAUDE.md rule).
- Sources: https://payloadcms.com/docs/database/migrations · https://payloadcms.com/community-help/discord/running-migrations-on-deployed-instance

---

## F. Building without a database (CI)

- **Fact:** Payload itself needs no DB at build time; Next.js static generation does when a page calls the Local API. Typical failure is "Collecting page data" dying on a Postgres connect.
- **Decision:**
  1. `export const dynamic = 'force-dynamic'` on the `(frontend)` layout segment, so every content page renders at request time (fine at this traffic; Cloudflare caches `/_next/static/*` and media).
  2. No `generateStaticParams` that queries the DB (return `[]` or omit).
  3. **No `NEXT_PUBLIC_*` variables.** Public values (e.g. Turnstile site key, site URL) are read on the server at runtime and passed to client components as props. This also keeps the image environment-agnostic (one image, staging + production).
  4. Phase 1 proof: CI builds with no `DATABASE_URI` set and no network path to any DB.
- **Fallback** if (1) proves insufficient: `next build --experimental-build-mode compile`. **Last resort:** ephemeral Postgres service in the CI job.
- Sources: https://payloadcms.com/docs/v3/production/building-without-a-db-connection.md · https://station.railway.com/questions/payload-cms-requires-database-access-at-b-c1f28386

---

## G. Media storage

- **Decision:** `media` upload collection with `upload.staticDir: process.env.MEDIA_DIR` (absolute path in the container, bind-mounted from the server's `/home` disk; separate dirs for staging and production). Files are served by Payload at `/api/media/file/<filename>` through the collection's `read` access (public read). `alt` is a required text field. Focal point on (requires `imageSizes`, which we define). `sharp` installed.
- Rationale: plain local-disk uploads; no adapter, no vendor.
- Source: https://payloadcms.com/docs/v3/upload/overview.md (env-driven `staticDir` is plain TS config — inference, high confidence)

---

## H. Official agent guidance

- **Decision:** adopt the official **`payloadcms/skills`** repo (skills `payload` and `cms-migration`) into `.claude/` in Phase 1, and reference the version-split `llms.txt` / `llms-full.txt` for **3.x**. These govern *how* Payload code is written; CLAUDE.md governs who and when.
- The Payload repo-root `AGENTS.md`/`CLAUDE.md` are for contributors to Payload itself — not adopted.
- **Installed 2026-10-17** by manual copy (not `npx skills add`, which symlinks from outside `.claude/`) of `skills/payload` and `skills/cms-migration` into `.claude/skills/`, pinned to payloadcms/skills commit `832d5bc4258ae784f08cb7f03a3a674d6b2fa5f1` (2026-07-07; repo has no tags). Targets 3.x (peers `^3.0.0`).
- **CLAUDE.md and this file override the skills** wherever they differ: MongoDB / `DATABASE_URL` examples, storage adapters and `staticDir: 'media'`, `NEXT_PUBLIC_SERVER_URL`, localization, rejected plugins, `blob/main` links (v4 code), `create-payload-app@latest`/npm, `editor`/`user` roles + `authenticatedOrPublished`, jobs `retries: 2` example, "don't run generate:types manually", relationships-over-selects, and cms-migration's v2-era `staticURL`/`s3Adapter`. Each coding agent file carries this override list.
- Sources: https://github.com/payloadcms/skills · https://payloadcms.com/llms.txt

---

## I. Plugins

All official plugins are versioned in lockstep with core (peer `payload: 3.91.0`).

| Plugin | Decision | For this site | Source |
|---|---|---|---|
| `@payloadcms/plugin-seo` | **Approved** (locked) | Per-document meta + OG on all 21 page types; feeds seo-auditor. `generateTitle` / `generateDescription` / `generateURL` against duhamedia.com | https://payloadcms.com/docs/v3/plugins/seo |
| `@payloadcms/plugin-form-builder` | **Approved** (locked) | Contact (p12), pre-call homework (p9), newsletter (p10/16/footer), lead magnet (p18); submissions in Postgres; notification email via Resend | https://payloadcms.com/docs/v3/plugins/form-builder |
| `@payloadcms/plugin-redirects` | **Approved** (locked) | Cutover redirect map (C) + marketing self-service | https://payloadcms.com/docs/v3/plugins/redirects |
| `@payloadcms/plugin-mcp` | **Deferred** — evaluate at Phase 4 (seeding) | Exists at 3.91.0 (`POST /api/mcp`, per-key per-collection permissions). Payload's 4.0 post says it currently needs manual setup and v4 rewrites it. Approve only if it demonstrably simplifies seeding/pipeline ops | https://payloadcms.com/docs/v3/plugins/mcp.md · https://payloadcms.com/posts/blog/payload-40-admin-ui-redesign-tanstack-mcp-and-more |
| `plugin-search`, `plugin-nested-docs`, `storage-s3`, `plugin-sentry`, ecommerce/Stripe, AI writing, community booking | **Rejected** (locked) | per CLAUDE.md | |

Non-plugin dependencies proposed: `@payloadcms/richtext-lexical`, `@payloadcms/email-resend`, `sharp`, `graphql` (peer) — all official/standard. Community: see L (needs approval).

---

## J. Jobs queue (webhook delivery + retries)

- **Decision:** Payload Jobs queue, run **in-process** with `jobs.autoRun: [{ cron: '* * * * *', queue: 'events', limit: 10 }]` (and the same for a `newsletter` queue). No separate worker container. `jobs.shouldAutoRun` can disable it if ever needed.
- **Fact:** native retry backoff is only `fixed` or `exponential` (`retries: { attempts, backoff: { type, delay } }`); no custom schedule function.
- **Decision:** to get the locked schedule (≈1 m, 5 m, 30 m, 2 h, 12 h, then `failed`): task `retries: 0`; the task input carries `attempt`; on 5xx/timeout the task re-queues itself with `payload.jobs.queue({ task, input: { ...input, attempt: n+1 }, queue, waitUntil: new Date(Date.now() + SCHEDULE[n]) })`; on 4xx it marks `failed` immediately. `eventId` is fixed at first enqueue and reused on every retry and admin re-send.
- Sources: https://payloadcms.com/docs/jobs-queue/queues · https://payloadcms.com/docs/jobs-queue/jobs · https://raw.githubusercontent.com/payloadcms/payload/v3.91.0/packages/payload/src/queues/config/types/taskTypes.ts

---

## K. Email transport & newsletter

### K1. Transport
- **Decision:** `@payloadcms/email-resend` — `resendAdapter({ defaultFromAddress, defaultFromName, apiKey: process.env.RESEND_API_KEY })`. Official, calls Resend's REST API directly; lighter than Nodemailer+SMTP.
- DKIM/SPF/DMARC reported present by the server agent; **the human still confirms "Verified" in the Resend dashboard.**
- Source: https://payloadcms.com/docs/email/overview

### K2. Newsletter (Contacts + Segment + Topic; never Audiences)
- Create contact: `POST /contacts` accepts `segments: [{id}]` and `topics: [{id, subscription: 'opt_in'}]` in one call (`resend.contacts.create`). Add/update separately via `POST /contacts/{id|email}/segments/{segment_id}` and `PATCH /contacts/{id|email}/topics`.
- **API key must be `full_access`** — `sending_access` can only send. Server-side only, never exposed. One key serves both transport and contacts (or two keys; server agent's call).
- **Broadcasts:** `segment_id` required; **always set `topic_id`** — without it Resend ignores topic opt-outs and sends to the whole segment. A globally unsubscribed contact gets nothing regardless.
- Topic default (opt-in/opt-out) is immutable after creation → create the newsletter Topic as **opt-in**, public.
- Footer of every broadcast: `{{{RESEND_UNSUBSCRIBE_URL}}}` + the postal address from `site-settings`.
- **CAN-SPAM:** valid physical postal address (street, USPS-registered P.O. box, or registered private mailbox all qualify); clear opt-out; honour within 10 business days; mechanism works ≥ 30 days after send.
- **Double opt-in:** Resend has no built-in DOI (negative finding — not in docs). If approved (Q2): store signup as pending → Resend sends a signed, expiring confirm link → on click, create contact + segment + topic opt-in → then send the `newsletter` event. Same job/retry/status pattern.
- Rate limit 10 req/s per team → the job queue's `limit` keeps us far under it.
- SDK `resend` (6.x; already a dependency) — official.
- Sources: https://resend.com/docs/api-reference/contacts/create-contact · https://resend.com/docs/api-reference/contacts/add-contact-to-segment · https://resend.com/docs/api-reference/contacts/update-contact-topics · https://resend.com/docs/api-reference/api-keys/create-api-key · https://resend.com/docs/api-reference/broadcasts/create-broadcast · https://resend.com/docs/knowledge-base/why-use-topics · https://resend.com/docs/api-reference/introduction · https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business

---

## L. Cloudflare Turnstile

- **Server-side (decided, no dependency):** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret`, `response`, `remoteip`, `idempotency_key` (UUID). Tokens valid 300 s, single use (`timeout-or-duplicate` on reuse). Verified before anything is stored. Lives in `src/integrations/turnstile.ts`.
- **Local dev/test keys (public, from Cloudflare):** site `1x00000000000000000000AA` (pass) / `2x00000000000000000000AB` (fail); secret `1x0000000000000000000000000000000AA` (pass) / `2x0000000000000000000000000000000AA` (fail). Test secrets accept only the dummy token.
- **Widget — needs approval (Q4), community dependency dossier:**

| | `@marsidev/react-turnstile` (recommended) | `react-turnstile` |
|---|---|---|
| Stars | 854 | 158 |
| Last release | 1.6.2, 2026-10-11 | npm 1.1.5; last GitHub release 2023 |
| Weekly downloads | ~2.36 M | ~307 K |
| Maintainers | **1** (marsidev) | 1 |
| Cloudflare stance | Listed and **recommended** on Cloudflare's community resources page ("deployed and confirmed working"); not maintained by Cloudflare | Listed |
| Risk | Single maintainer. Mitigation: it is a thin wrapper over Cloudflare's script; replacing it with a ~40-line component is cheap if abandoned | Stale |

- Sources: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ · https://developers.cloudflare.com/turnstile/troubleshooting/testing/ · https://developers.cloudflare.com/turnstile/community-resources/

---

## M. Booking (Nextcloud Appointments)

- **Findings** (from the Nextcloud Calendar source, `appinfo/routes.php`, `lib/Controller/AppointmentController.php`):
  - Booking URL format: `https://<nextcloud>/index.php/apps/calendar/appointment/<token>`.
  - **Cannot be iframed cross-domain:** the appointment controller sets no custom CSP, so Nextcloud's default `frame-ancestors 'self'` applies. Only the read-only public calendar `/embed/<token>` allows framing. No admin setting; workarounds are proxy header rewrites or patches (fragile).
  - **No post-booking redirect:** the appointment config has no redirect/thank-you URL field; booking ends on Nextcloud's own confirmation page.
- **Decision:** `BookingEmbed` launches in its **designed link-out state** ("Book your call" panel → Nextcloud page, new tab). The embed state is still built and shown on `/_showcase` (CLAUDE.md requires both), plus the no-URL fallback. `/thank-you` is reached from the **pre-call homework form submission**, not from Nextcloud.
- Server agent asked to confirm and not to apply proxy hacks (OPS #4).
- Queued post-launch CalDAV widget: `tsdav` (357★, v2.5.0 on 2026-10-15, ~174 K/wk, active) is the candidate library; dossier again at that time.
- Sources: https://github.com/nextcloud/calendar · https://help.nextcloud.com/t/appointment-form-iframe/144261 · https://github.com/natelindev/tsdav

---

### M2. Booking follow-ups (human, 2026-10-17)
- **Confirmed: launch with link-out.** No iframe, no proxy header override at launch.
- **Logged option (not adopted): Proton booking widget.** The human has Proton Mail; Proton Calendar booking pages could replace or sit alongside Nextcloud. **Conflicts with a locked CLAUDE.md rule** ("Proton is the human's mailbox. The site never touches Proton in any form"), so it needs an explicit human override plus research (embeddability, redirect, how booking events would reach the secretary) before it is considered.
- Other options on file for later: proxy `frame-ancestors` override on the Nextcloud booking path (server agent's call; cookie/same-site risk if Nextcloud is not on a duhamedia.com subdomain); the third-party Nextcloud "Appointments" app (embed support unverified); the queued CalDAV widget (tsdav).

## N. Local dev infrastructure

- **Decision:** `docker-compose.yml` with a single `postgres:<major>` service (pinned to the server's major version, OPS #6), named volume, port 5432 on localhost only. App runs on the host via `pnpm dev`. Not created until Gate 0 clears.

---

## O. MCP wiring

`/mcp` equivalent (session tool list, 2026-10-17):

| MCP | Required? | Status |
|---|---|---|
| Playwright (`@playwright/mcp`, v0.0.83) | **Required** | **Missing** |
| Payload (`@payloadcms/plugin-mcp`) | Expected | Missing (it is served by our own app; wired when/if plugin-mcp is approved, see I) |
| claude-in-chrome, Claude Docs, Google Drive, Figma | — | Connected (not required) |

**Human install step:** `claude mcp add playwright npx @playwright/mcp@latest`, then restart the session. Source: https://github.com/microsoft/playwright-mcp

---

## P. CI cost

- GitHub Free: **2,000 Actions minutes/month** on private repos; 500 MB artifact/package storage for non-container packages.
- GHCR: "Container image storage and bandwidth for the Container registry is **currently free**", with at least one month's notice before any change.
- **Decision:** measure CI build minutes in Phase 1 and record here.
- **Measured 2026-10-17 (run 39058172732, first run, cold cache):** check job 37 s + image job 3 m 16 s ≈ **5 billed minutes per push** (per-job rounding) → ~400 pushes/month inside the free tier. Flag immediately if GHCR billing changes. Fallback (server agent's call): capped on-server build under `/run/lock/duha-heavy.lock`.
- Sources: https://docs.github.com/en/billing/concepts/product-billing/github-actions · https://docs.github.com/en/billing/concepts/product-billing/github-packages

---

## Q. Gate 0 answers (human, 2026-10-17)

| # | Question | Answer |
|---|---|---|
| 1 | Pre-call homework form live at launch | **No — toggled off.** Block still built (section locked); its event stays queued post-launch |
| 2 | Newsletter double opt-in | **Yes** — build confirm-link flow (K2) |
| 3 | Postal address for broadcast footers | **On hold.** Required by CAN-SPAM before the first broadcast → launch blocker until provided (newsletter sending is launch-critical) |
| 4 | `@marsidev/react-turnstile` | **Approved** |
| 5 | Redirect map | **None needed.** Old site unused; kill/overwrite anything freely (see C). Removals still logged |
| 6 | Old `/privacy` `/terms` text | AI-generated, **discard**. Legal pages use the Legal template's placeholder structure; real policy text comes from the human later (no invented policy terms) |
| 7 | Old blog posts | **None exist.** Nothing to migrate; Neon can be retired without export |
| 8 | Pin `payload@3.91.0` | **Yes** |
| 9 | npm → pnpm | **Yes** |
| — | Design handoff | Human sends it in a separate chat → `/design-reference/` before Phase 2 |

**Thank You entry path (decided 2026-10-17, option b):** Nextcloud cannot redirect after booking and the homework form is off, so `BookingEmbed`'s link-out opens Nextcloud in a new tab and sends the original tab to `/thank-you`.

## Q-orig. Gate 0 questions (as asked)

1. **Pre-call homework form** live at launch, sending `type: "contact"`, `form: "precall-homework"`? *Recommended: yes.* (It also becomes the path to `/thank-you`, see M.)
2. **Newsletter double opt-in?** *Recommended: yes* (we build the confirm-link flow; Resend has none).
3. **Postal address** for broadcast footers (CAN-SPAM; a USPS P.O. box is fine).
4. **Approve `@marsidev/react-turnstile`** (community dependency, dossier in L)?
5. **Redirect map:** confirm Class A → Shopify Theme Dev, Class B → Marketing, Class C → Services hub, and the proposed new slugs (C).
6. **Old copy:** reuse the real `/privacy` and `/terms` text (CLAUDE.md otherwise requires placeholder-only legal structure)? Any about / methodology copy to keep?
7. **Old blog posts** live only in Neon. Migrate them into `posts` (keeping `/insights/blog/<slug>` URLs)? If yes, you export them (a read-only query I'll write for you) before Neon is retired.
8. **Pin `payload@3.91.0`** (2 days old) — *recommended*, vs `3.90.2` (Sep 23; its Next.js peer range not yet checked). With 3.91.0, Next.js must move to ≥ 16.3.3.
9. **Switch npm → pnpm?** *Recommended: yes* (Payload's preferred manager).
10. **Prerequisites before Phase 2** (not answers, actions): import the Claude Design handoff into `/design-reference/`; add the Playwright MCP (O).
