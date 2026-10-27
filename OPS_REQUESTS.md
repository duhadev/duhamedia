# OPS_REQUESTS — for the server agent

Requests from the duhamedia.com build to the server agent, relayed by the human. Names only — **never secret values** in this file. Each entry: what, why, exact names, what "done" looks like. When answered, mark **Resolved (date)** and note the answer.

---

## #1 — Staging environment · 2026-10-17 · Open
- **What:** staging instance of the site.
  - Database `duha_site_staging` inside the existing Postgres container (same container as production, to save RAM).
  - Separate staging media directory on `/home`, bind-mounted into the container at the path given by `MEDIA_DIR`.
  - Owner-only staging `.env` with: `DATABASE_URI`, `PAYLOAD_SECRET`, `APP_ENV=staging`, `SITE_URL`, `MEDIA_DIR`, `SITE_EVENT_URL`, `SITE_EVENT_SECRET`, `RESEND_API_KEY`, `RESEND_NEWSLETTER_SEGMENT_ID`, `RESEND_NEWSLETTER_TOPIC_ID`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
  - Tunnel route `staging.duhamedia.com` with a Cloudflare Access policy (human only).
  - Deploy timer pulling `ghcr.io/duhadev/duhamedia:main`.
- **Why:** every push to `main` previews on staging (CLAUDE.md, Deployment model).
- **Done when:** a pushed image boots on staging and `https://staging.duhamedia.com/api/health` returns 200 through Access. Staging may be stopped when idle.

## #2 — Resend env rename + key scope · 2026-10-17 · Open
- **What:** replace `RESEND_AUDIENCE_ID` with `RESEND_NEWSLETTER_SEGMENT_ID` and `RESEND_NEWSLETTER_TOPIC_ID` in both `.env` files. Resend deprecated Audiences; the site uses Contacts + one Segment + one Topic.
- The site's `RESEND_API_KEY` must be a **full-access** key (sending-only keys cannot manage contacts).
- The newsletter Topic must be created **opt-in** and public (a topic's default cannot be changed later).
- Separate staging and production segment/topic IDs are preferred so staging signups never enter the real list.
- **Done when:** both env files carry the two new names and the old name is gone.

## #3 — Deploy script contract · 2026-10-17 · Open
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

## #4 — Nextcloud booking · 2026-10-17 · Open
- **What:** the public Nextcloud Calendar Appointments booking URL (`/index.php/apps/calendar/appointment/<token>`), to store in `site-settings.bookingUrl`.
- **Finding to confirm:** from the Nextcloud Calendar source, appointment pages send `frame-ancestors 'self'` with no admin setting to change it, and offer no post-booking redirect. The site will therefore **link out** to the booking page (no iframe): the link opens Nextcloud in a new tab and sends the original tab to `/thank-you` (decided 2026-10-17; the pre-call homework form is off at launch). Please confirm, and **do not** add reverse-proxy header rewrites to force framing.
- **Done when:** URL provided and finding confirmed (or corrected).

## #5 — Cloudflare dashboard items (human) · 2026-10-17 · Open
- **Turnstile:** create a widget for `duhamedia.com` and `staging.duhamedia.com`; values go into `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` in each `.env`.
- **Access on `/admin*`:** email one-time code, human only. Access must **leave open all of `/api/*`** — this covers `/api/health`, Payload REST (admin UI calls, pipeline API key, form submissions), `/api/graphql` and `/api/media/file/*`. To verify on staging.
- **Rate-limit rule** on the form submission path: exact path supplied in Phase 3 when the form endpoints exist.
- **Cache rules:** long-cache `/_next/static/*` (immutable) and `/api/media/file/*`. **Bypass** `/admin*` and every other `/api/*` (`/api/health` also sends `no-store`). Frontend HTML is dynamic — do not edge-cache it until revalidation and preview are wired.

## #6 — Postgres major version · 2026-10-17 · Open
- **What:** the major version of the server's Postgres container (e.g. 16 / 17).
- **Why:** local `docker-compose.yml` pins the same major for dev parity.
- **Done when:** version given.

## #7 — Pre-Gate 3 proofs · 2026-10-17 · Open (needed later)
- An encrypted backup **and a successful test restore** of the site DB + media.
- A throwaway staging database for the migration-chain proof (empty DB → migrate from zero → seed → boot).
- **Done when:** both reported, before Gate 3.

---

### New env var names introduced in Phase 0
- `MEDIA_DIR` — absolute path of the media directory in the container.
- `SITE_URL` — canonical origin (replaces the old `NEXT_PUBLIC_SITE_URL`; read at runtime, never inlined at build).

## #8 — Form notification fallback address · 2026-10-21 · Open (address re-confirmed by human 2026-10-27)
- **Need:** set env `FORMS_DEFAULT_TO_EMAIL=hello@duhamedia.com` in the staging and production `.env` files (not a secret).
- **Why:** form-builder sends each new-submission notice to the form's own "Email to"; when a form has none, it falls back to this variable, and without it to the from-address (`no-reply@…`), which nobody reads. Human decision F16 (2026-10-21).
- **Done when:** both env files carry the variable and the containers were restarted to pick it up.

## #9 — Cloudflare cache bypass for preview routes · 2026-10-22 · Open (human, Cloudflare dashboard)
- **Need:** add `/_preview*` to the cache-bypass rule alongside `/admin*` and `/api/*` (never cache). Do NOT put `/_preview*` behind Cloudflare Access separately — it is gated by the Payload staff session, and logged-in staff must reach it from the admin's Preview button.
- **Why:** draft preview routes (`/_preview?path=…`, `/_preview/exit`) set the Next draft-mode cookie and render unpublished content for staff; responses already send `Cache-Control: private, no-store`, this is belt-and-braces at the edge.
- **Done when:** a request to `/_preview/exit` on staging shows `cf-cache-status: BYPASS` (or DYNAMIC).

## #10 — Cloudflare rate-limit rule for public form submissions · 2026-10-22 · Open (human, Cloudflare dashboard)
- **Need:** one WAF rate-limiting rule on the duhamedia.com zone (covers production and staging hostnames):
  - Match: URI Path equals `/api/form-submit` (the endpoint only accepts POST, so no method condition is needed — Free/Pro rules cannot match method or headers anyway).
  - Counting: per IP.
  - Threshold: Free plan → 5 requests per 10 seconds, action Block, duration 10 seconds (Free allows only a 10 s period and 10 s timeout). Pro or higher → 10 requests per 1 minute, action Block for 10 minutes.
  - Keep `/api/form-submit` inside the existing cache-bypass rule (`/api/*`) and OUTSIDE Cloudflare Access (public visitors must reach it).
- **Why:** CLAUDE.md Security §1. Every public form (contact, pre-call homework, newsletter, lead magnet, footer nudge) submits only to this path; Turnstile is verified server-side before anything is stored, and this rule caps abuse before it reaches the server.
- **Also:** `SITE_URL` must be exactly the public origin on staging and production (`https://staging.duhamedia.com`, `https://duhamedia.com`) — the form route's same-origin check and the Turnstile hostname check both depend on it; a wrong value makes every form submission fail.
- **Done when:** 6+ rapid POSTs to `https://staging.duhamedia.com/api/form-submit` from one IP within 10 s return Cloudflare's 429/block page; a single normal form submit on staging still works.

## #11 — Keep the `X-Robots-Tag` header on staging · 2026-10-23 · Open (human, Cloudflare dashboard)
- **Need:** no Cloudflare Transform Rule, cache setting or header-modification rule may strip or override the `X-Robots-Tag` response header on `staging.duhamedia.com` (or production).
- **Why:** outside production the site now sends `X-Robots-Tag: noindex, nofollow` from `src/proxy.ts` (driven by `APP_ENV`), replacing the per-page robots meta. Staging's noindex depends on this header plus `robots.txt` `Disallow: /`.
- **Done when:** `curl -sI https://staging.duhamedia.com/` (through Access) shows `x-robots-tag: noindex, nofollow`; production shows no such header.

## #12 — `SITE_URL` is now mandatory on staging and production · 2026-10-23 · Open (server agent)
- **Need:** each server `.env` sets `SITE_URL` to the exact public origin: staging `https://staging.duhamedia.com`, production `https://duhamedia.com` (no trailing slash needed). `APP_ENV` must be `staging` / `production` respectively.
- **Why:** canonicals, sitemap, Open Graph URLs, live preview and the form route's Turnstile hostname check all use it. With `APP_ENV` ≠ development and `SITE_URL` unset or invalid, pages error and `/api/health` returns **503**, so the deploy script's health poll rolls the release back instead of serving localhost URLs.
- **Done when:** after a staging deploy, `curl -s https://staging.duhamedia.com/api/health` returns 200 and the homepage canonical is `https://staging.duhamedia.com`.

## #13 — Staging Gate A for site events · 2026-10-23 · Open (server agent + human)
- **Need:** staging `.env` has the real `SITE_EVENT_URL` and `SITE_EVENT_SECRET` (shared with the secretary plugin); `SITE_EVENT_RETRY_DELAYS_S` must NOT be set on any server (dev-only override). For the failure-path proof, the server agent briefly blocks the site container → secretary route (real retry schedule is ~15 h), then unblocks.
- **Why:** A1 (contact event) passed every Gate A proof locally against a stub; CLAUDE.md requires the same proofs on staging against the real secretary, with the human confirming the `[staging]` Matrix message and no second message after a re-send.
- **Done when:** one staging contact submission with a fake identity shows `delivered`, one `[staging]` Matrix message arrives, an admin re-send yields `{"duplicate": true}` and no second message, and a blocked-then-unblocked run ends `failed` → re-send `delivered`.

## #14 — Resend for newsletter double opt-in + contacts · 2026-10-24 · Open (server agent + human)
- **Need:** `RESEND_API_KEY` = a **full_access** key (sending-only cannot manage contacts), server-side only; separate staging and production `RESEND_NEWSLETTER_SEGMENT_ID` and `RESEND_NEWSLETTER_TOPIC_ID` (topic created **opt-in**, public); human confirms `duhamedia.com` shows "Verified" in Resend and that `no-reply@duhamedia.com` may send (double opt-in sender "Duha Media"); decide a reply-to if wanted. Cloudflare Access must leave `/newsletter/confirm` public; `/api/form-submissions/:id/newsletter/*` stays admin-only (like `/resend`). Staging `SITE_URL` = staging origin (confirm links point there; behind Access they only open for the human).
- **Why:** A2 (newsletter signup → double opt-in → Resend Contact + Segment + Topic → `newsletter` event) passed every proof locally against stubs; staging must prove a real confirmation email, the contact in the segment with topic opt-in, and one `[staging]` Matrix message.
- **Done when:** a staging signup with `test+gate-a2@duhamedia.com` receives the email, the click shows "You're on the list.", the Resend dashboard shows the contact in the newsletter segment with the topic opted in, and one `[staging]` Matrix message arrives (none on re-send).

## #15 — How to run the seed against staging (and first production) · 2026-10-24 · Open (server agent; decision needed)
- **Need:** a way to run `pnpm seed` (create-only, one transaction, never overwrites) against `duha_site_staging` — and later once against production — when the human approves. The production image is a Next standalone build with no `src/` and no Payload CLI, so it can't run inside the running container. Proposed: a one-off container from the image's **builder** stage (or a `seed` tag built by CI from the same commit) with `DATABASE_URI`, `PAYLOAD_SECRET`, `MEDIA_DIR` (pointing at the environment's media dir), `APP_ENV` set, running `pnpm seed`; a dry run first with `SEED_DRY_RUN=1` (rolls back).
- **Why:** CLAUDE.md Phase 4 — the committed seed brings a fresh DB to a complete site; it never runs on deploy and only with the human's approval, after Gate K.
- **Note (2026-10-27):** the seed now reads one committed binary, `src/seed/files/founder-avatar.jpg`, so whatever runs the seed must include `src/seed/files/` (the builder stage does).
- **Done when:** the server agent confirms the method (and image/tag name), a staging dry run reports its creations and rolls back, then — on the human's go — a real run, logged in PROGRESS.md.
