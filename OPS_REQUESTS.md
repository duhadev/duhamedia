# OPS_REQUESTS — for the server agent

Requests from the duhamedia.com build to the server agent, relayed by the human. Names only — **never secret values** in this file. Each entry: what, why, exact names, what "done" looks like. When answered, mark **Resolved (date)** and note the answer.

---

> **2026-10-28: the site moved to Vercel + Neon + Vercel Blob** (DECISIONS.md §R). The server now only hosts the secretary and Nextcloud for this site. Entries #1–#15 are kept for history with updated statuses; live work is #4, #7, #13, #14, #16, #17.

## #1 — Staging environment · 2026-10-17 · Superseded 2026-10-28 (Vercel Preview replaces server staging; see #16)
- **What:** staging instance of the site.
  - Database `duha_site_staging` inside the existing Postgres container (same container as production, to save RAM).
  - Separate staging media directory on `/home`, bind-mounted into the container at the path given by `MEDIA_DIR`.
  - Owner-only staging `.env` with: `DATABASE_URI`, `PAYLOAD_SECRET`, `APP_ENV=staging`, `SITE_URL`, `MEDIA_DIR`, `SITE_EVENT_URL`, `SITE_EVENT_SECRET`, `RESEND_API_KEY`, `RESEND_NEWSLETTER_SEGMENT_ID`, `RESEND_NEWSLETTER_TOPIC_ID`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
  - Tunnel route `staging.duhamedia.com` with a Cloudflare Access policy (human only).
  - Deploy timer pulling `ghcr.io/duhadev/duhamedia:main`.
- **Why:** every push to `main` previews on staging (CLAUDE.md, Deployment model).
- **Done when:** a pushed image boots on staging and `https://staging.duhamedia.com/api/health` returns 200 through Access. Staging may be stopped when idle.

## #2 — Resend env rename + key scope · 2026-10-17 · Moved to Vercel env 2026-10-28 (see #16)
- **What:** replace `RESEND_AUDIENCE_ID` with `RESEND_NEWSLETTER_SEGMENT_ID` and `RESEND_NEWSLETTER_TOPIC_ID` in both `.env` files. Resend deprecated Audiences; the site uses Contacts + one Segment + one Topic.
- The site's `RESEND_API_KEY` must be a **full-access** key (sending-only keys cannot manage contacts).
- The newsletter Topic must be created **opt-in** and public (a topic's default cannot be changed later).
- Separate staging and production segment/topic IDs are preferred so staging signups never enter the real list.
- **Done when:** both env files carry the two new names and the old name is gone.

## #3 — Deploy script contract · 2026-10-17 · Superseded 2026-10-28 (no server deploy script; Vercel builds + migrates)
- **Image:** `ghcr.io/duhadev/duhamedia`. Tags: `sha-<commit>` and `main` on every push to `main`; `vX.Y.Z` and `production` on a human-ordered release (re-tag of an image that already ran on staging — never rebuilt).
- **Migrations:** run by Payload's `prodMigrations` **on container start**, before the server serves. The script does **not** run a separate migrate command. A failed migration aborts startup → health never passes → script rolls back.
- **Health:** `GET /api/health` → 200 (DB reachable) or 503. No sensitive detail in the body.
- **Script flow:** pull → start new container → poll `/api/health` → on failure roll back to previous image and alert via the secretary → prune old images.
- **Runtime env names:** as in #1, with `APP_ENV=production` for production.
- **Container:** listens on port 3000, runs as **uid:gid 1001:1001**, `NODE_OPTIONS=--max-old-space-size=384`. Measured locally: 66 MiB idle, 131 MiB peak after 100 requests, 85 MiB settled. Image 324 MB.
- **`MEDIA_DIR` bind mount must be writable by uid 1001.** The app creates two subfolders inside it: `media/` (images) and `downloads/` (lead-magnet files). Back up the whole `MEDIA_DIR`.
- The image has a Docker `HEALTHCHECK` on `/api/health` (30 s start period). Note: Next boots lazily, so **`prodMigrations` runs at the first request that initialises Payload** — in practice the first health hit. A failed migration keeps health at 503 (and is retried on each poll), so the rollback rule still holds.
- **Rollback:** the `release` workflow's manual trigger (input `tag`) moves `:production` back to an existing `vX.Y.Z`, no rebuild.
- **Needed from you:** a GHCR read token on the server for pulls (token name only here).
- **Done when:** you confirm the script matches this contract.

## #4 — Nextcloud booking · 2026-10-17 · Open (server agent; unchanged)
- **What:** the public Nextcloud Calendar Appointments booking URL (`/index.php/apps/calendar/appointment/<token>`), to store in `site-settings.bookingUrl`.
- **Finding to confirm:** from the Nextcloud Calendar source, appointment pages send `frame-ancestors 'self'` with no admin setting to change it, and offer no post-booking redirect. The site will therefore **link out** to the booking page (no iframe): the link opens Nextcloud in a new tab and sends the original tab to `/thank-you` (decided 2026-10-17; the pre-call homework form is off at launch). Please confirm, and **do not** add reverse-proxy header rewrites to force framing.
- **Done when:** URL provided and finding confirmed (or corrected).

## #5 — Cloudflare dashboard items (human) · 2026-10-17 · Superseded 2026-10-28 (see #16 / DECISIONS §R)
- **Turnstile:** create a widget for `duhamedia.com` and `staging.duhamedia.com`; values go into `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` in each `.env`.
- **Access on `/admin*`:** email one-time code, human only. Access must **leave open all of `/api/*`** — this covers `/api/health`, Payload REST (admin UI calls, pipeline API key, form submissions), `/api/graphql` and `/api/media/file/*`. To verify on staging.
- **Rate-limit rule** on the form submission path: exact path supplied in Phase 3 when the form endpoints exist.
- **Cache rules:** long-cache `/_next/static/*` (immutable) and `/api/media/file/*`. **Bypass** `/admin*` and every other `/api/*` (`/api/health` also sends `no-store`). Frontend HTML is dynamic — do not edge-cache it until revalidation and preview are wired.

## #6 — Postgres major version · 2026-10-17 · Moot 2026-10-28 (site DB is Neon; local docker-compose stays postgres:17)
- **What:** the major version of the server's Postgres container (e.g. 16 / 17).
- **Why:** local `docker-compose.yml` pins the same major for dev parity.
- **Done when:** version given.

## #7 — Pre-Gate 3 proofs · 2026-10-17 · Open, changed 2026-10-28 (Neon backup/restore + Blob; see #16)
- An encrypted backup **and a successful test restore** of the site DB + media.
- A throwaway staging database for the migration-chain proof (empty DB → migrate from zero → seed → boot).
- **Done when:** both reported, before Gate 3.

---

### New env var names introduced in Phase 0
- `MEDIA_DIR` — absolute path of the media directory in the container.
- `SITE_URL` — canonical origin (replaces the old `NEXT_PUBLIC_SITE_URL`; read at runtime, never inlined at build).

## #8 — Form notification fallback address · 2026-10-21 · Moved to Vercel env 2026-10-28 (see #16)
- **Need:** set env `FORMS_DEFAULT_TO_EMAIL=hello@duhamedia.com` in the staging and production `.env` files (not a secret).
- **Why:** form-builder sends each new-submission notice to the form's own "Email to"; when a form has none, it falls back to this variable, and without it to the from-address (`no-reply@…`), which nobody reads. Human decision F16 (2026-10-21).
- **Done when:** both env files carry the variable and the containers were restarted to pick it up.

## #9 — Cloudflare cache bypass for preview routes · 2026-10-22 · Superseded 2026-10-28 (no Cloudflare proxy in front of Vercel; `/_preview*` already sends no-store)
- **Need:** add `/_preview*` to the cache-bypass rule alongside `/admin*` and `/api/*` (never cache). Do NOT put `/_preview*` behind Cloudflare Access separately — it is gated by the Payload staff session, and logged-in staff must reach it from the admin's Preview button.
- **Why:** draft preview routes (`/_preview?path=…`, `/_preview/exit`) set the Next draft-mode cookie and render unpublished content for staff; responses already send `Cache-Control: private, no-store`, this is belt-and-braces at the edge.
- **Done when:** a request to `/_preview/exit` on staging shows `cf-cache-status: BYPASS` (or DYNAMIC).

## #10 — Cloudflare rate-limit rule for public form submissions · 2026-10-22 · Superseded 2026-10-28 (Vercel Firewall instead; see #16)
- **Need:** one WAF rate-limiting rule on the duhamedia.com zone (covers production and staging hostnames):
  - Match: URI Path equals `/api/form-submit` (the endpoint only accepts POST, so no method condition is needed — Free/Pro rules cannot match method or headers anyway).
  - Counting: per IP.
  - Threshold: Free plan → 5 requests per 10 seconds, action Block, duration 10 seconds (Free allows only a 10 s period and 10 s timeout). Pro or higher → 10 requests per 1 minute, action Block for 10 minutes.
  - Keep `/api/form-submit` inside the existing cache-bypass rule (`/api/*`) and OUTSIDE Cloudflare Access (public visitors must reach it).
- **Why:** CLAUDE.md Security §1. Every public form (contact, pre-call homework, newsletter, lead magnet, footer nudge) submits only to this path; Turnstile is verified server-side before anything is stored, and this rule caps abuse before it reaches the server.
- **Also:** `SITE_URL` must be exactly the public origin on staging and production (`https://staging.duhamedia.com`, `https://duhamedia.com`) — the form route's same-origin check and the Turnstile hostname check both depend on it; a wrong value makes every form submission fail.
- **Done when:** 6+ rapid POSTs to `https://staging.duhamedia.com/api/form-submit` from one IP within 10 s return Cloudflare's 429/block page; a single normal form submit on staging still works.

## #11 — Keep the `X-Robots-Tag` header on staging · 2026-10-23 · Superseded 2026-10-28 (header comes straight from Vercel; verify on Preview)
- **Need:** no Cloudflare Transform Rule, cache setting or header-modification rule may strip or override the `X-Robots-Tag` response header on `staging.duhamedia.com` (or production).
- **Why:** outside production the site now sends `X-Robots-Tag: noindex, nofollow` from `src/proxy.ts` (driven by `APP_ENV`), replacing the per-page robots meta. Staging's noindex depends on this header plus `robots.txt` `Disallow: /`.
- **Done when:** `curl -sI https://staging.duhamedia.com/` (through Access) shows `x-robots-tag: noindex, nofollow`; production shows no such header.

## #12 — `SITE_URL` is now mandatory on staging and production · 2026-10-23 · Moved to Vercel env 2026-10-28 (see #16)
- **Need:** each server `.env` sets `SITE_URL` to the exact public origin: staging `https://staging.duhamedia.com`, production `https://duhamedia.com` (no trailing slash needed). `APP_ENV` must be `staging` / `production` respectively.
- **Why:** canonicals, sitemap, Open Graph URLs, live preview and the form route's Turnstile hostname check all use it. With `APP_ENV` ≠ development and `SITE_URL` unset or invalid, pages error and `/api/health` returns **503**, so the deploy script's health poll rolls the release back instead of serving localhost URLs.
- **Done when:** after a staging deploy, `curl -s https://staging.duhamedia.com/api/health` returns 200 and the homepage canonical is `https://staging.duhamedia.com`.

## #13 — Staging Gate A for site events · 2026-10-23 · Open, changed 2026-10-28 (run on Vercel Preview once #17 is done)
- **Need:** staging `.env` has the real `SITE_EVENT_URL` and `SITE_EVENT_SECRET` (shared with the secretary plugin); `SITE_EVENT_RETRY_DELAYS_S` must NOT be set on any server (dev-only override). For the failure-path proof, the server agent briefly blocks the site container → secretary route (real retry schedule is ~15 h), then unblocks.
- **Why:** A1 (contact event) passed every Gate A proof locally against a stub; CLAUDE.md requires the same proofs on staging against the real secretary, with the human confirming the `[staging]` Matrix message and no second message after a re-send.
- **Note (2026-10-28):** crons run on Production only, so on a Preview the queue must be run by hand as admin: `GET /api/payload-jobs/run?queue=events` while logged in.
- **Done when:** one staging contact submission with a fake identity shows `delivered`, one `[staging]` Matrix message arrives, an admin re-send yields `{"duplicate": true}` and no second message, and a blocked-then-unblocked run ends `failed` → re-send `delivered`.

## #14 — Resend for newsletter double opt-in + contacts · 2026-10-24 · Open, changed 2026-10-28 (Resend values go into Vercel env; see #16)
- **Need:** `RESEND_API_KEY` = a **full_access** key (sending-only cannot manage contacts), server-side only; separate staging and production `RESEND_NEWSLETTER_SEGMENT_ID` and `RESEND_NEWSLETTER_TOPIC_ID` (topic created **opt-in**, public); human confirms `duhamedia.com` shows "Verified" in Resend and that `no-reply@duhamedia.com` may send (double opt-in sender "Duha Media"); decide a reply-to if wanted. Cloudflare Access must leave `/newsletter/confirm` public; `/api/form-submissions/:id/newsletter/*` stays admin-only (like `/resend`). Staging `SITE_URL` = staging origin (confirm links point there; behind Access they only open for the human).
- **Why:** A2 (newsletter signup → double opt-in → Resend Contact + Segment + Topic → `newsletter` event) passed every proof locally against stubs; staging must prove a real confirmation email, the contact in the segment with topic opt-in, and one `[staging]` Matrix message.
- **Done when:** a staging signup with `test+gate-a2@duhamedia.com` receives the email, the click shows "You're on the list.", the Resend dashboard shows the contact in the newsletter segment with the topic opted in, and one `[staging]` Matrix message arrives (none on re-send).

## #15 — How to run the seed against staging (and first production) · 2026-10-24 · Resolved 2026-10-28 (seed runs from the laptop against Neon; docs/dev.md Deploy)
- **Need:** a way to run `pnpm seed` (create-only, one transaction, never overwrites) against `duha_site_staging` — and later once against production — when the human approves. The production image is a Next standalone build with no `src/` and no Payload CLI, so it can't run inside the running container. Proposed: a one-off container from the image's **builder** stage (or a `seed` tag built by CI from the same commit) with `DATABASE_URI`, `PAYLOAD_SECRET`, `MEDIA_DIR` (pointing at the environment's media dir), `APP_ENV` set, running `pnpm seed`; a dry run first with `SEED_DRY_RUN=1` (rolls back).
- **Why:** CLAUDE.md Phase 4 — the committed seed brings a fresh DB to a complete site; it never runs on deploy and only with the human's approval, after Gate K.
- **Note (2026-10-27):** the seed now reads one committed binary, `src/seed/files/founder-avatar.jpg`, so whatever runs the seed must include `src/seed/files/` (the builder stage does).
- **Done when:** the server agent confirms the method (and image/tag name), a staging dry run reports its creations and rolls back, then — on the human's go — a real run, logged in PROGRESS.md.

## #16 — Vercel / Neon / Blob setup (human, dashboards) · 2026-10-28 · Open
- **Vercel plan:** Pro (per-minute crons fail the deploy on Hobby; Hobby is non-commercial).
- **Project `duhamedia`** (already linked to the GitHub repo): Framework Next.js; build command comes from `vercel.json` (`pnpm run vercel-build`); Node.js 24.x; "Automatically expose System Environment Variables" ON; **Production Branch = `production`** (Settings → Git) so `main` only builds Previews.
- **Neon** (Vercel Marketplace integration): connect to Production; preview branching ON for Preview only. Check the production `DATABASE_URL` / `DATABASE_URL_UNPOOLED` are NOT scoped to Preview (a Preview build migrates whatever DB it sees).
- **Blob:** two stores, `duhamedia-production` → Production, `duhamedia-preview` → Preview (each injects `BLOB_READ_WRITE_TOKEN`).
- **Env vars** (names only; values from you / the server agent):
  - Production: `PAYLOAD_SECRET`, `APP_ENV=production`, `SITE_URL=https://duhamedia.com`, `CRON_SECRET` (≥16 random chars), `SITE_EVENT_URL`, `SITE_EVENT_SECRET`, `SITE_EVENT_ACCESS_CLIENT_ID`, `SITE_EVENT_ACCESS_CLIENT_SECRET`, `RESEND_API_KEY` (full access), `RESEND_NEWSLETTER_SEGMENT_ID`, `RESEND_NEWSLETTER_TOPIC_ID`, `FORMS_DEFAULT_TO_EMAIL=hello@duhamedia.com`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `ENABLE_EXPERIMENTAL_COREPACK=1`.
  - Preview: same names except `APP_ENV=staging`, a DIFFERENT `PAYLOAD_SECRET`, separate Resend segment/topic IDs, `SITE_URL` optional (falls back to the branch URL), no `CRON_SECRET` needed. Never set `SITE_EVENT_RETRY_DELAYS_S`.
- **Domains:** `duhamedia.com` + `www.duhamedia.com` on Production; optionally `staging.duhamedia.com` assigned to branch `main`. DNS records as Vercel shows (DNS-only in Cloudflare, grey cloud).
- **Turnstile:** widget hostnames `duhamedia.com`, `www.duhamedia.com`, `staging.duhamedia.com` (forms on raw `*.vercel.app` preview URLs fail the hostname check).
- **Protection:** Vercel Deployment Protection on Preview (replaces Access on staging). Firewall rate-limit rule: path `/api/form-submit`, per IP, ~10 req / 1 min → block (as #10).
- **Backups (#7):** confirm Neon's point-in-time restore window on the plan, and test one restore to a branch before launch.
- **Done when:** a Preview build of `main` goes green and `/api/health` returns 200 on it.

## #17 — Secretary event endpoint reachable from Vercel (server agent) · 2026-10-28 · Resolved 2026-10-28
- **Need:** expose the secretary's `/site-event` receiver on a public HTTPS hostname via the Cloudflare tunnel, behind a Cloudflare Access application with a **Service Auth** policy (service token, so failures return 401/403, not a login redirect). Give the human `SITE_EVENT_URL` (the full https URL), `SITE_EVENT_ACCESS_CLIENT_ID`, `SITE_EVENT_ACCESS_CLIENT_SECRET` for Vercel env. HMAC signing (`SITE_EVENT_SECRET`) unchanged; the secretary still checks it.
- **Retire:** staging container, deploy timers, GHCR pulls, site media bind mounts, `duha_site_staging` (after nothing needs it).
- **Keep:** the secretary polls `https://duhamedia.com/api/health` every 5 min; Nextcloud booking (#4).
- **Done when:** a signed test POST from outside the server with the service token reaches the secretary, and one without the token gets 401/403.
- **Answer (2026-10-28):** live at `https://events.duhamedia.com/site-event` behind Cloudflare Access (service token; 401 without it, no redirect). Server-side hosting plan retired, nothing was built. Receiver rules: `eventId` 8–100 `[A-Za-z0-9_-]`; `email` required except `site_error`; `fields` flat, ≤ 50 keys, scalar, each ≤ 5000 chars; 429 = retry. Errors are deduped by fingerprint on their side (max 1/h). Their doc names the token vars `CF_ACCESS_CLIENT_*`; the site reads `SITE_EVENT_ACCESS_CLIENT_ID/SECRET` — human uses the site's names in Vercel. Nextcloud → secretary booking webhook not wired yet; no uptime check on their side (use Vercel monitoring). Copy: `~/secretary-infra/docs/SITE_EVENTS_HANDOFF.md`.

## #18 — Upgrade Vercel team to Pro (human, billing) · 2026-10-28 · Open — REMIND AT GO-LIVE
- **State now:** team `duhadevs-projects` is on **Hobby**. The site runs on Hobby as a stopgap (human, 2026-10-28): jobs run right after each form submit via `after()`, and the cron drains all queues **once a day**.
- **Why upgrade:**
  - **Licensing:** Vercel Hobby is for personal, non-commercial use. duhamedia.com is a business site, so Pro is required before it serves real visitors.
  - **Retries:** on Hobby a failed event/email send waits up to ~24 h for the daily cron instead of ~1–5 min.
  - Firewall rate-limit rule on `/api/form-submit` and other Pro limits (confirm in dashboard).
- **When:** before the first production release ("ship it"), at the latest. PM must raise this at Gate 3 and again when the human orders a release.
- **After upgrading, PM does:** restore per-minute crons in `vercel.json` (`* * * * *` per queue `events` / `newsletter`), keep the `after()` immediate run, redeploy, update DECISIONS §R + docs/dev.md.
- **Done when:** team plan shows Pro (`vercel api /v2/teams/<teamId>` → `billing.plan: pro`) and the per-minute crons deploy.

## #19 — Previews show production data (Neon branching) · 2026-10-28 · Deferred (human, 2026-10-28: keep the separate preview DB for now)
- **Now:** two separate Neon databases (production; preview) with their own credentials. Previews are NOT synced with production; the preview DB is seeded on its own.
- **Human wants:** Previews to mirror production read-only. Plan: replace the separate preview DB with **Neon preview branching** off the production DB (copy-on-write snapshot per Preview; Preview writes never reach production). A truly read-only live connection is rejected: Preview builds run `payload migrate`.
- **Steps (after production is live and has content):** disconnect the preview Neon DB from the project; on the production Neon integration enable "Create database branch for each Preview deployment" (Preview only); PM verifies on one Preview that the branch `DATABASE_URL` / `DATABASE_URL_UNPOOLED` are present at BUILD time, and whether branches can reset from production on each deploy.
- **Media decision needed then:** A) Previews use the production Blob token (images work; rule: never upload/delete media in a Preview admin) — PM recommends; B) keep separate stores (images broken on Previews).
- **Done when:** a Preview of `main` shows production pages/content and a Preview edit does not appear in production.

## #20 — Replace PRIVATE Blob stores with PUBLIC ones (human) · 2026-10-28 · Open
- **Found:** both stores (`duhamedia-preview`, `duhamedia`) were created **private**; `@payloadcms/storage-vercel-blob@3.91.0` supports public only ("Cannot use public access on a private store"). Every upload (seed images, admin uploads) fails until fixed.
- **Workaround now (human, 2026-10-28):** text-only seed (`scripts/seed-remote.sh`, Blob token left empty). Seeded media rows exist but their images 404 on Vercel.
- **Fix:** per environment create a **Public** Blob store, connect it (Preview-only / Production-only, default prefix `BLOB`), disconnect + delete the private one, redeploy; then re-upload the seed images in the admin (or re-run the seed against an empty DB with the new token).
- **Done when:** an image upload in each environment's admin succeeds and displays.
