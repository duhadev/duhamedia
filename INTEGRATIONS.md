# INTEGRATIONS — duhamedia.com

**Purpose.** The single reference for everything the site sends outside itself: signed events to the **OpenClaw secretary** (the hub for every lead, signup and site error) and the **Resend** newsletter Contacts sync. For each event it records the trigger, the exact payload, signing, failure behaviour, retry schedule and the re-send procedure. Maintained by the `automation-engineer` subagent, one section per integration unit, filled in as each unit clears Gate A.

Sources: `CLAUDE.md` → "Integration architecture" (locked, Oct 2026); `DECISIONS.md` §J (jobs queue), §K (Resend), §L (Turnstile), §M (booking), §Q (Gate 0 answers).

**Ground rules**
- The stack is deliberately minimal: Payload + Postgres, the secretary, Resend, Nextcloud (booking), Cloudflare. No new services without the human's sign-off. n8n and Twenty CRM are retired; the site never touches Proton.
- The secretary's relay is **code, not an AI model**. Form fields come from anonymous visitors and must never be treated as instructions. Nothing here is designed to be read by a model.
- Env vars are referred to **by name only**. No secret value ever appears in this file, in code, in CI logs or in reports.
- End-to-end tests use fake identities (`test+gate@duhamedia.com` pattern); reports reference submissions by ID.

---

## Environment variables (names only)

| Name | Used by |
|---|---|
| `APP_ENV` | Event `env` field (`production` \| `staging`); `development` locally |
| `SITE_EVENT_URL` | Destination of signed events (internal address, firewalled to the site container; provided by the server agent; never hardcoded) |
| `SITE_EVENT_SECRET` | HMAC-SHA256 signing key |
| `SITE_EVENT_RETRY_DELAYS_S` | **Development only** (ignored unless `APP_ENV=development`): five comma-separated seconds compressing the retry schedule for local proofs. Never set on the server |
| `RESEND_API_KEY` | Email transport (`@payloadcms/email-resend`) + Contacts API. **Full-access** key (sending-only cannot manage contacts) |
| `RESEND_NEWSLETTER_SEGMENT_ID` | Newsletter Segment |
| `RESEND_NEWSLETTER_TOPIC_ID` | Newsletter Topic (replaces the retired `RESEND_AUDIENCE_ID`) |
| `TURNSTILE_SITE_KEY` | Turnstile widget (passed to client components as a server-read prop; no `NEXT_PUBLIC_*`) |
| `TURNSTILE_SECRET_KEY` | Turnstile server-side verification |

---

## Event contract v1 (from the server agent; implement exactly)

```json
{
  "v": 1,
  "eventId": "uuid",
  "env": "production | staging",
  "type": "contact | booking | newsletter | lead_magnet | site_error",
  "form": "contact",
  "submissionId": "123",
  "name": "...", "email": "...", "company": "...",
  "fields": { "...": "..." },
  "timestamp": "ISO-8601",
  "error": { "fingerprint": "...", "message": "...", "stack": "first 20 lines", "url": "...", "count": 1 }
}
```

- `name`, `email` and `company` (when the form has them) are **always top-level**, not only inside `fields`.
- `error` is present only for `site_error`.
- The body is **≤ 32 KB**. Long fields are truncated deterministically and the truncation is noted in `fields`.
- `eventId` is generated once per submission and reused on every retry and re-send. It is the idempotency key.
- `env` comes from `APP_ENV`. Staging events are prefixed `[staging]` on Matrix and never create CRM proposals (the secretary's job), but the site always sends the correct `env`.

### Signing (required)

- Headers:
  - `X-Duha-Timestamp: <unix seconds>`
  - `X-Duha-Signature: sha256=<hex HMAC-SHA256(SITE_EVENT_SECRET, timestamp + "." + rawBody)>`
- Sign the **exact bytes** sent.
- The secretary rejects requests older than 5 minutes, so the timestamp is computed **at send time, including on retries**.
- Node's built-in `crypto`; no dependency.

---

## Canonical lead flow (every form follows this)

1. The visitor submits a form. **Turnstile is verified server-side first** (`POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret`, `response`, `remoteip`, `idempotency_key`; tokens valid 300 s, single use). Invalid → friendly error, **nothing stored**.
2. form-builder stores the submission in Postgres **before any external call**. Postgres is the durable record of every lead; a down or buggy secretary can never lose one.
3. An `afterChange` hook **enqueues a Payload job** (never sends inline) and stamps `deliveryStatus: pending`. The visitor's request returns immediately.
4. The job sends the signed event:
   - `200` (including `{"duplicate": true}`) → `delivered`.
   - `4xx` → `failed` immediately, response noted in `deliveryNote` (bad signature or schema; retrying won't help).
   - `5xx` or timeout → retry per the schedule below, then `failed`.
5. Each submission carries `deliveryStatus` (pending / delivered / failed), `deliveryNote`, `deliveryAttempts` and `eventId`.
6. Payload's notification email (via Resend) fires from form-builder config in parallel and is **not** gated on the event.
7. Newsletter signups additionally sync the Resend Contact / Segment / Topic (see below), with the same job + retry + status pattern, tracked separately from event delivery.

## Form submission path (S4-7, lead flow steps 1–2)

Every public form (contact, pre-call homework, newsletter, lead-magnet capture, footer nudge) goes through ONE server path: **`POST /api/form-submit`** (`src/app/api/form-submit/route.ts`). Nothing in the browser can write a submission any other way: `form-submissions` create access is `turnstileVerifiedOrAdmin` (src/access/index.ts), so an anonymous `POST /api/form-submissions` returns **403** (verified 2026-10-21).

| Step | Where | What happens | On failure |
|---|---|---|---|
| 1. Turnstile | `src/integrations/turnstile.ts` → `verifyTurnstile(token, remoteIp)` | `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` (JSON: `secret`, `response`, `remoteip`, `idempotency_key` = fresh UUID), 10 s timeout. Never throws; returns `{ ok, codes }`. Outside development the reply `hostname` must equal the `SITE_URL` host. | Friendly "couldn't confirm you're a person" error; **nothing is read or stored**. Server log: `[turnstile] verification failed: <codes>` (codes only, no token/IP/form data). |
| 2. Load form | `src/integrations/forms/handleSubmission.ts` | The form doc by id (trusted Local API read; forms are staff-read). | Unknown/deleted form → "This form has changed… refresh". |
| 3. Validate | same, `validateSubmission()` | Against the form's OWN field definitions: required; email format (≤ 254); select value must be one of the options; text ≤ 500, textarea ≤ 5000; number finite; date `YYYY-MM-DD`; checkbox `true`/`false` (required = must be ticked). Unknown field names, duplicate keys or file values reject the whole submission. Empty optional fields are not stored. | Field errors inline ("Please check the highlighted fields"), or the "refresh" message for unknown/duplicate fields. Nothing stored. |
| 4. Store | same | `payload.create('form-submissions', { overrideAccess: false, context: { turnstileVerified: true } })` with `form`, `submissionData` (`[{ field, value }]`), `sourcePath` (same-site path only) and `leadMagnet` (kept only if it is a published lead magnet whose capture form is this form). This is the **only** code that sets `turnstileVerified`. | Generic "something went wrong, please try again" (error name logged, no values). |
| 5. Hooks (existing) | `src/hooks/formSubmissions.ts`, plugin `sendEmail` | `beforeChange`: fresh `eventId` (UUID); `deliveryStatus: pending` only when the form has **Send event** on and an event type; otherwise empty. `afterChange`: form-builder's notification email (Resend). | Not gated on the event. |
| 6. Respond | `src/app/api/form-submit/route.ts` | JSON (`Accept: application/json`, what `PayloadForm` sends): `200 { ok: true, redirect? }` — `redirect` is the form's redirect confirmation, resolved from the stored form doc. No-JS form post: `303` to that redirect, or a minimal noindex HTML page with the outcome and a "Go back" link to `_source`. | `400 { ok: false, message, fieldErrors? }` (HTML page without JS). |

- **Where event sending hooks in (A1, built):** `enqueueSubmissionDelivery`, a `form-submissions` `afterChange` (operation `create`) in `formSubmissionOverrides.hooks` (src/plugins/formBuilder.ts → src/hooks/formSubmissions.ts), after the plugin's `sendEmail`. It enqueues the delivery job when `deliveryStatus === 'pending'` and the form's event type is one the job can build (today: `contact`). Hooking the collection rather than the handler means admin-entered submissions follow the same path. The newsletter sync job is a later unit.
- **Turnstile env behaviour:**
  - `development`: an unset `TURNSTILE_SECRET_KEY` / `TURNSTILE_SITE_KEY` falls back to Cloudflare's always-pass test keys.
  - `staging` / `production`: an unset secret, or any Cloudflare **test** secret, **fails closed** ("This form is unavailable right now") and logs `missing-secret` / `test-secret-in-production`. An unset site key renders the form with no widget; submitting shows the same message.
  - Cloudflare's always-pass test secret passes **any** non-empty token (observed 2026-10-21; the docs say "accepts only the dummy token"). Local proofs of the reject path therefore use the always-fail secret `2x0000000000000000000000000000000AA`.
- **Visitor IP** for `remoteip`: `CF-Connecting-IP`, else the first `X-Forwarded-For` hop. Sent to Cloudflare only; never stored or logged.
- **Endpoint contract — `POST /api/form-submit`:**
  - Static Next route outside both route groups (like `/api/health`). Next resolves it before Payload's `(payload)/api/[...slug]` catch-all, and no collection or global is called `form-submit` (verified: the route answers here, and `/api/forms` is still Payload's).
  - Request: `multipart/form-data` or `application/x-www-form-urlencoded`, at most 64 KB (`MAX_BODY_BYTES`, enforced while streaming, so a missing or false `Content-Length` doesn't get round it). Keys: `_form` (form id), `f:<fieldName>` per field, optional `_source` (page path) and `_leadMagnet` (id), `cf-turnstile-response`.
  - Guards: same-origin only (`Sec-Fetch-Site` must be `same-origin` when present; `Origin` must equal the `SITE_URL` origin, or the request host in development; a request with neither header is refused) → `403`. Other methods → `405` (`Allow: POST`). Wrong content type → `415`. Body too big → `413`.
  - Every response is `Cache-Control: no-store, max-age=0`.
- **Rate limiting** is a Cloudflare rule set by the human (OPS_REQUESTS.md) on the path `/api/form-submit`. The path only accepts POST, so matching on the path alone is enough on the Free/Pro plans, which cannot match on method or headers.
- **Client:** `src/components/forms/` — `PayloadForm` posts with `fetch` (the form's own FormData), and its plain `action="/api/form-submit" method="post"` is the no-JS fallback (a no-JS visitor has no Turnstile token, so they get the friendly Turnstile page). `CMSForm` (server: loads the form, strips `emails` and integration settings, reads the site key at runtime, renders rich-text confirmation/message blocks), `PayloadForm` (client renderer), `TurnstileWidget` (`@marsidev/react-turnstile@1.6.2`, flexible width, auto-refresh on expiry, reset after every attempt since tokens are single-use).

## Retry schedule and implementation (DECISIONS §J)

| Attempt | Delay before it |
|---|---|
| 1 | immediate |
| 2 | ≈ 1 min |
| 3 | ≈ 5 min |
| 4 | ≈ 30 min |
| 5 | ≈ 2 h |
| 6 | ≈ 12 h |
| — | then `failed` |

- Payload Jobs queue, run **in-process** (`jobs.autoRun` with a per-minute cron, `queue: 'events'`, `limit: 10`; same for a `newsletter` queue). No separate worker container.
- Payload's native backoff is only `fixed` / `exponential`, so the locked schedule is implemented by hand: the task has `retries: 0` and carries `attempt` in its input; on 5xx/timeout it re-queues itself with `payload.jobs.queue({ task, input: { ...input, attempt: n + 1 }, queue, waitUntil: now + SCHEDULE[n] })`; on 4xx it marks `failed` immediately.
- `eventId` is fixed at first enqueue and never regenerated.

**Implementation (A1, verified against the installed payload@3.91.0):**

| What | Where |
|---|---|
| Jobs config: `jobs.tasks: [deliverSiteEvent]`, `autoRun: [{ cron: '* * * * *', queue: 'events', limit: 10 }]`, `access.queue/run/cancel` = admin only (Payload's default is any logged-in user, which includes the pipeline) | src/payload.config.ts |
| Task `deliverSiteEvent` (queue `events`, `retries: 0`, input `{ submissionId, attempt }`), the schedule, `queueDelivery()` | src/integrations/events/deliveryTask.ts |
| Event building + ≤ 32 KB serialisation | src/integrations/events/contract.ts |
| HMAC signing + POST + response classification | src/integrations/events/send.ts |
| Enqueue on create (afterChange) | src/hooks/formSubmissions.ts → `enqueueSubmissionDelivery` |
| Re-send endpoint | src/integrations/events/resendEndpoint.ts |
| Re-send button (sidebar `ui` field `resendDelivery`) | src/components/admin/ResendDeliveryButton.tsx |
| Jobs tables | migration `src/migrations/20261023_204052_a1_event_delivery.ts` |

- **Where jobs run.** Inside the site container. There is no worker process. Payload starts its cron on the first `getPayload({ cron: true })`: any admin or `/api/*` request, plus `/api/health` and `/api/form-submit` (both pass `cron: true`). The deploy script's first health poll therefore starts delivery. The cron never starts during `next build`. Finished jobs are deleted (`deleteJobOnComplete` default), so `payload_jobs` only holds queued or scheduled attempts.
- **Same transaction.** The job row is written with the submission's `req`, so it commits or rolls back together with the lead.
- **Per attempt:** the job re-reads the submission and skips unless it is `pending`. That makes a stray or duplicate job harmless. It then builds the body, signs it with a fresh timestamp, POSTs it with a **10 s timeout**, and stamps `deliveryStatus`, `deliveryNote`, `deliveryAttempts` (+1, a lifetime total across re-sends) and `lastAttemptAt`. Status writes carry `context.siteEventDeliveryWrite`, are updates (never creates), and so never re-trigger the enqueue or the notification email.
- **Classification:**
  - `2xx` → `delivered`. The note says `already received (duplicate)` when the body is `{"duplicate": true}`.
  - `5xx`, timeout or network error (e.g. `ECONNREFUSED`) → the next attempt is queued with `waitUntil`, and the status stays `pending`.
  - `4xx` and `3xx` → `failed` immediately, with the status and a ≤ 200-char sanitised excerpt of the response.
  - `SITE_EVENT_URL` / `SITE_EVENT_SECRET` unset or invalid → `failed` immediately ("not sent: … not retried"). Fix the env, then re-send.
  - An internal error on our side (e.g. a DB blip while reading) is treated like a 5xx.
- **Timing:** the cron ticks every minute, so each delay is "at least" its value plus up to 60 s.
- **Development-only compression:** `SITE_EVENT_RETRY_DELAYS_S=5,5,5,5,5` (five positive seconds). It is honoured only when `APP_ENV=development`, and staging and production always use the locked schedule. Used for the Gate A failure-path proof.
- **Logs:** `[site-event] …` lines carry `submissionId`, `attempt` and the outcome only. They never contain field values, the URL, the secret or the body.

## Re-send procedure

- Failed deliveries appear as a **filtered view of the built-in form-submissions list** in the admin (`deliveryStatus = failed`). No custom dashboard.
- A **re-send action** on a submission re-enqueues the job with the **same `eventId`**, so the secretary dedupes (`{"duplicate": true}` → `delivered`, no second announcement).
- **Find failures:** Admin → **Form Submissions**, filter *Delivery status equals Failed*. Direct URL: `/admin/collections/form-submissions?where[deliveryStatus][equals]=failed`. A shared query preset "Failed deliveries" (a document in `payload-query-presets`, staff-visible) is to be created by the seed script (TODO(seed)); it is never hand-inserted in production.
- **Re-send:** open the submission → sidebar → **Re-send to secretary**. The button is enabled when the status is `failed` or `delivered`, and disabled while `pending`, since a chain is already queued. A toast confirms, and the page refreshes to `pending`. The next cron tick (≤ 1 min) sends attempt 1 of a fresh chain with the full schedule. `deliveryAttempts` keeps counting.
- **API:** `POST /api/form-submissions/:id/resend`, staff only (admin + marketing; never the pipeline user or the public → 403). It sets `pending` and queues the job in one transaction. Responses:
  - `200 {"ok":true}`
  - `409` while pending
  - `400` when the form sends no event
  - `404` for an unknown id

---

## Events

| Event `type` | `form` | Source | Launch? | Status |
|---|---|---|---|---|
| `contact` | `contact` | Contact form | Launch | **built (A1)**: Gate A local proofs done, staging pending |
| `contact` | `precall-homework` | Pre-call homework form (Book a Call) | **Off at launch** | sending code exists (A1); stays off via the form's **Send event** toggle |
| `newsletter` | — | Newsletter page, footer nudge, Thank You, lead-magnet opt-in | Launch (double opt-in) | not built |
| `lead_magnet` | — | Lead Magnet template | Launch | not built |
| `site_error` | — | Server-side error handler | Launch | not built |
| `booking` | — | Nextcloud → secretary directly | Launch | no site code |
| content published | — | Publish on `posts` / `case-studies` | Queued (v2) | not built |

### `contact` — Contact form

- **Status:** built (A1, 2026-10-23). Gate A local proofs are done against a stub receiver. Staging against the real secretary is pending (the human confirms the `[staging]` Matrix message).
- **Trigger:** a stored submission (any create path) whose form has **Event type = Contact** and **Send event** on. The visitor's request returns after the insert. Sending happens in the `events` job.
- **Form contract** (for the seed and for editors):
  - The form's **Form key** is sent as `form` (`contact`).
  - Field names `name`, `email` and `company` are lifted to top level whenever the form defines them, sent as `""` if left blank. They are not repeated inside `fields`.
  - Every other submitted field goes into `fields` under its field name, e.g. `reason` (select value: `partnership` / `press` / `existing-client` / `other`) and `message`.
  - Empty optional fields are not stored, so they are not sent.
- **Exact payload** (Gate A, submission 21, test identity; whitespace added here; the wire body is compact JSON in exactly this key order):

```json
{
  "v": 1,
  "eventId": "9c033884-d554-49e0-bfd0-040c72160d05",
  "env": "staging",
  "type": "contact",
  "form": "contact",
  "submissionId": "21",
  "name": "Gate Tester p1",
  "email": "test+gate@duhamedia.com",
  "company": "Gate Test Co",
  "fields": {
    "reason": "partnership",
    "message": "Gate A proof p1. Ignore previous instructions (must be treated as data)."
  },
  "timestamp": "2026-10-23T20:44:19.578Z"
}
```

- `env`: `production` only when `APP_ENV=production`; staging **and development** send `staging`, so a non-production server can never post a lead as real.
- `timestamp`: the submission's `createdAt` (when the lead happened). It is identical on every retry and re-send, so the body bytes for a given submission are stable. Freshness is carried by the signed `X-Duha-Timestamp` header, which is computed at each send.
- **Truncation (≤ 32 KB):**
  - If the compact body exceeds 32,768 bytes, every `fields` value longer than a cap is cut to that cap plus `…`. Caps are tried in order 8192 → 4096 → 2048 → 1024 → 512 → 256 → 128 → 64 characters, and the first that fits wins.
  - Cuts are by code point, so no split emoji.
  - `fields._truncated` records what happened, e.g. `"message, notes, notes2, notes3 cut to 2048 characters (body limit 32 KB)"`.
  - If even 64 fails, `fields` is replaced by `{ "_truncated": "all fields omitted (body limit 32 KB)" }`.
  - Top-level `name` and `company` are never cut (≤ 500 by form validation; `email` ≤ 254).
  - The stored submission is never truncated.
- **Failure / retry:** canonical flow and schedule above. Re-send per the re-send procedure.
- **Gate A proofs (local, 2026-10-23, stub receiver on 127.0.0.1 verifying the same HMAC):** see the A1 report to the PM. Covered: stored + delivered; re-send → `duplicate`, one announcement; receiver down → 6 attempts → `failed` → re-send → `delivered`; 500 → retry → delivered with a fresh timestamp; wrong secret → 401 → `failed`, not retried; 40 KB submission sent as 25 KB with `_truncated`.

### `contact` — Pre-call homework (`form: "precall-homework"`)

- **Status:** the sending code is shared with the Contact event (A1); nothing more is needed on the site. **Event OFF at launch** — the human toggled it off at Gate 0 (Q1, 2026-10-17). The block on Book a Call is still built (the section is locked); its event stays **queued post-launch**.
- When enabled: `type: "contact"`, `form: "precall-homework"` (no change needed on the secretary's side). Enabling it is a data change on the form: Form key `precall-homework`, Event type Contact, **Send event** on. Until then its submissions are stored with an empty delivery status and never queued. Turning it on needs the human's go-ahead (Gate 0 Q1) and its own Gate A on staging.
- Note: `/thank-you` is reached from `BookingEmbed`'s link-out (Nextcloud opens in a new tab, the original tab goes to `/thank-you`), not from this form.

### `newsletter`

- **Status:** not built.
- **Sources:** Newsletter page (16), the standard footer's newsletter nudge, Thank You (10), the opt-in toggle on lead-magnet forms (18).
- **Double opt-in: yes** (human, Gate 0 Q2). Flow: store the signup as pending → Resend sends a signed, expiring confirm link → on click, create the Contact + add to Segment + Topic opt-in → **then** send the `newsletter` event.
- Resend sync and event delivery are tracked separately, each with the job/retry/status pattern.
- See [Resend newsletter flow](#resend-newsletter-flow-contacts--segment--topic).

### `lead_magnet`

- **Status:** not built.
- **Trigger:** capture form on the Lead Magnet template (18). `fields` names the asset. If the newsletter opt-in toggle is ticked, the newsletter flow runs as well.
- **Delivery (mini Gate S 2026-10-21):** an uploaded asset is sent as an **email attachment** (Resend), read from disk server-side with `overrideAccess` — `downloads` is staff-only, so there is no public file URL. External-URL assets are linked in the email body.

### `site_error`

- **Status:** not built.
- **Source:** server-side error handler (Next.js + Payload). Server-side only.
- `fingerprint` = error name + top stack frame + route (stable).
- Local dedupe/rate limit: at most one event per fingerprint per 10 minutes; `count` carries the suppressed total. A crash loop must not flood the queue or Matrix.
- **Never** include request bodies, cookies, headers or form PII. `stack` = first 20 lines.
- **Missing upload files:** Payload 3.91.0 answers a request for a file missing from disk (`/api/media/file/<name>`, `/api/downloads/file/<name>`) with a **500** "Something went wrong.", not a 404. These must not page the human per request: ignore them, or collapse them into one rate-limited fingerprint per collection (noted 2026-10-17, C2).

### `booking`

- **Status:** no site code. Nextcloud Calendar Appointments sends confirmations (through Resend SMTP) and sends the `booking` event to the secretary itself. The site has no booking backend at launch.
- The site's `BookingEmbed` links out to the Nextcloud page (`site-settings.bookingUrl`) in a new tab and sends the original tab to `/thank-you` (Nextcloud cannot be framed cross-domain and has no post-booking redirect).
- Queued post-launch: an on-brand CalDAV widget (candidate library `tsdav`) that would send the usual `booking` event from the site.

### content published

- **Status:** queued, not in v1. Publishing on `posts` / `case-studies` would need a **v2 contract agreed with the server agent first**.

---

## Resend newsletter flow (Contacts + Segment + Topic)

Resend deprecated **Audiences** in November 2025. The site uses global **Contacts**, one newsletter **Segment** and one newsletter **Topic**. The Audiences API is never used.

- **Create contact:** `POST /contacts` with `segments: [{ id: RESEND_NEWSLETTER_SEGMENT_ID }]` and `topics: [{ id: RESEND_NEWSLETTER_TOPIC_ID, subscription: 'opt_in' }]` in one call (`resend.contacts.create`, SDK `resend` 6.x).
- **Existing contact:** `POST /contacts/{id|email}/segments/{segment_id}` and `PATCH /contacts/{id|email}/topics`.
- **Key scope:** `RESEND_API_KEY` is full-access, server-side only.
- **Topic default** was created **opt-in** and public (a topic's default cannot be changed later).
- **Broadcasts** (sent by a person from the Resend dashboard): `segment_id` required and **`topic_id` always set** — without it Resend ignores topic opt-outs and sends to the whole segment. A globally unsubscribed contact gets nothing regardless.
- **Footer of every broadcast (CAN-SPAM):** `{{{RESEND_UNSUBSCRIBE_URL}}}` + the postal address from `site-settings`. The postal address is **on hold** (Gate 0 Q3) — a launch blocker until the human provides it; never invent one.
- **Rate limit:** 10 req/s per team; the queue's `limit` keeps us far under it.
- Separate staging and production Segment/Topic IDs are requested (OPS_REQUESTS #2) so staging signups never enter the real list.
- *Exact calls, confirm-link signing/expiry and Gate A proof: filled in when built.*
