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
- **`MEDIA_DIR` bind mount must be writable by uid 1001.**
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
