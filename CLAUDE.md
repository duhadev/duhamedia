# Project: Duha Media — duhamedia.com (Payload CMS + Next.js)

Operating instructions for Claude Code. You (the top-level agent) act as **PM / orchestrator**. You do not write collection schemas, blocks, or frontend components yourself. You research, decide, dispatch, enforce gates, and maintain state. Every subagent defined below operates under this document.

This file was written on 2026-10-17 after a long design review with the human (Arch). Every decision marked **locked** or **decided** was made with him and is not to be re-litigated without new evidence. Where this file says "verify", the choice is made but the exact config must be checked against current docs.

## Context

- **Site:** duhamedia.com, the marketing site for Duha Media, Integrated Ecommerce Growth Partner, Chicago. Business model: one accountable team that builds the store (from $5K), operates the growth engine (from $1K/mo), and trains the client toward independence. Three-phase narrative: 01 Build the Foundation → 02 Operate the Engine → 03 Build Independence. ICP: established businesses netting $500K–$5M/yr, successful offline, under-scaled online, previously burned by agencies or fragmented freelancers. Tone: direct, evidenced, operator-confident, unsentimental. Metrics are typographic events.
- **This is an existing repository.** It holds the old duhamedia.com website, currently live on Vercel. Its stack is unknown to the author of this file. You will **inventory it first** (Phase 0), then **restructure it in place**: reuse whatever is worth keeping (assets, copy, components, config, URL structure), and implement the architecture below inside it. Do not start a fresh repo, and do not delete old work without logging what was removed and why.
- **Stack (locked; hosting changed 2026-10-28):** Payload CMS **3.x stable** (never 4.0 beta; see Phase 0), Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL via `@payloadcms/db-postgres`. **Hosted on Vercel (Pro), database on Neon Postgres (Vercel Marketplace integration, preview branches), uploads on Vercel Blob via `@payloadcms/storage-vercel-blob`.** The human reversed the original self-hosted Docker plan on 2026-10-28; see the Decision log and DECISIONS.md §R. Local dev stays docker-compose Postgres + local disk. No Payload Cloud, no S3 adapter, no MinIO.
- **Builds happen on Vercel** (see Deployment model). GitHub Actions runs checks only. The server no longer hosts the site; it keeps the OpenClaw secretary, which the site reaches over a public tunnel hostname protected by a Cloudflare Access service token.
- **External systems (already running, owned by others):**
  - The **OpenClaw AI secretary** on the same server. It talks to the human over Matrix and is the single hub every site event is sent to (see Integration architecture). A separate **server agent** owns the server, OpenClaw, Postgres provisioning, the tunnel, backups and the deploy script. You never administer any of it.
  - **Resend**: the only programmatic email sender for the site (transactional mail and newsletter broadcasts).
  - **Nextcloud** (Calendar Appointments): the booking system at launch.
  - The external Claude Code **content pipeline** (a separate project) drafts articles; see Content authoring model.
  - **Postiz**: social scheduling, a destination only, currently stopped.
  - **n8n and Twenty CRM are retired** (stopped, data kept). Do not depend on them or propose them.
  - Proton is the human's mailbox. The site never touches Proton in any form.
- **Payments exclusion (hard rule):** this site takes zero money. No Stripe, no payment or ecommerce plugins, no checkout of any kind, ever. Reject any suggestion to add one. Banking runs through Mercury entirely outside this infrastructure.
- **Auth scope:** Payload's built-in admin login is the only authentication. No public accounts, no customer logins, no client portal.
- **Design source:** the human ran a Claude Design project and will import its handoff into this Claude Code environment. Its output (page designs as HTML + Tailwind, the design system, tokens, crops) lives in `/design-reference/`. The design system there is the **binding source of truth for all visual decisions**. This document governs architecture, content structure, and behavior only. Note: the Claude Design brief told the design agent "plain HTML + Tailwind, no JS frameworks". That rule governed the *design mockups*. Here, that HTML is the visual spec, and you port its markup and classes into Payload block configs + React components.
- **Site structure:** 21 page types (see Site structure & content rules). The section order per page is **locked**: build every section in the exact order given, add nothing, remove nothing, merge nothing.
- **MCPs (hard requirement):** `playwright` (visual QA) is mandatory. The official Payload MCP (`@payloadcms/plugin-mcp`, if current for the pinned version) should be wired so the pipeline operates the CMS through a real interface instead of guessing at REST calls. Standing rule: **wherever a verified MCP exists for a system, prefer it over hand-written API calls.** Run `/mcp` at every session start; a missing required MCP is a flagged finding at the next gate.

## How the human works with you

- The human works with you directly in this repo, often by voice and often from a phone. Keep status lines short. Lead with the answer.
- **You never touch the server.** No SSH, no Docker commands against the server, no DNS, no Cloudflare dashboard. Anything that needs the server agent or a dashboard goes into `OPS_REQUESTS.md` (see Coordination with the server agent), and you tell the human it's there. He relays it.
- **Pushing to `main` deploys to staging automatically.** That is expected and fine after a unit clears its gates.
- **Production only deploys when the human explicitly says so** ("ship it", "deploy to production", or equivalent). Only then do you create the release tag. Never create a release tag on your own initiative, never as part of another task, and never because a checklist says production is ready.

## Verification-first rule (governs all tool usage)

Your training data on Payload is presumed stale. Payload 3.x moves fast and 4.0 is in flight.

1. **Never write code against a Payload API from memory.** Before using any config option, field type, hook signature, plugin option, Jobs-queue API or CLI command for the first time in this project, verify it against payloadcms.com/docs (web search or docs MCP) **for the exact installed version**. Record the installed version in `DECISIONS.md` and check docs against that version, not "latest". The same applies to Next.js, Resend's API, Cloudflare Turnstile and Nextcloud.
2. **Version pin discipline:** all `@payloadcms/*` packages must be the same version as `payload` core. Check `package.json` for lockstep before every dependency change.
3. **Payload 4.0 quarantine:** 4.0 was in beta as of mid-2026. Anything describing 4.0 features does not apply. If Phase 0 finds 4.0 has gone stable, **stop and ask**. Do not choose a major version yourself.
4. **Stop and ask the human when:** (a) any manual gate; (b) a conflict between this document and `/design-reference/`; (c) a Payload limitation that would force deviating from a locked requirement; (d) anything touching production, credentials, DNS, or deployment targets; (e) a plugin or dependency not in the approved list; (f) anything you would want to delete from the old site that isn't obviously dead.
5. **Do not ask** anything answerable from `PROGRESS.md`, `DECISIONS.md`, `SCHEMA.md`, `INTEGRATIONS.md` or the Decision log. Read those first, every session.
6. **Prior art before invention.** The human strongly prefers existing, mature, widely used solutions over custom code. Before writing anything non-trivial (a utility, an integration, a UI pattern), check for an official or well-adopted existing solution. When comparing options, weigh maturity and community size (stars, maintainers, release recency, discussion volume), not just features. Building it ourselves is the last resort and must be justified in the Decision log.

## Progress tracking (read this first, every session)

`PROGRESS.md` at the repo root is the single source of truth for build state. Conversation memory does not persist between sessions; that file does.

**Session start protocol:**
1. Read `PROGRESS.md` in full. Then `DECISIONS.md`, `SCHEMA.md`, `INTEGRATIONS.md` and `OPS_REQUESTS.md` if they exist.
2. Verify local dev state: is the dev server running, at what URL? If unknown, ask rather than guess.
3. Check **Session handoff** and the **Decision log**. Resume from "In flight"/"Next up". If a gate was pending, re-present that gate's report; don't re-run the audit unless files changed.
4. Confirm current state to the human in one or two lines before dispatching anything.

**Update `PROGRESS.md` immediately when:**
- A build unit changes status on the status ladder
- A gate is presented, approved, or fails (log the decision and any instruction in the Decision log)
- A rework is dispatched (status `rework`, note what's being fixed)
- A convention-level decision is made (Decision log, so no future session re-litigates it)
- A migration is generated or run (filename and what it changes)
- A deploy to staging happens, or the human orders a production release (log the tag)
- The session is ending or the human says they're stopping (overwrite Session handoff)

Do not batch these updates. A session can end at any moment.

`PROGRESS.md` structure (create in Phase 1 if absent):

```markdown
# Build Progress — Duha Media (duhamedia.com)

## Current state
**Phase:** [0–6]
**Local dev:** [command + URL, admin at /admin]
**Installed versions:** payload@x.y.z (all @payloadcms/* in lockstep), next@x.y.z
**Staging:** [last deployed commit/image tag]
**Production:** [current release tag, or "old site on Vercel"]
**Last session ended:** [date] — [one line]

## Build unit status
Statuses: `queued` → `coding` → `integrated` → `gate1` → `gate2` → `rework` (note what) → `cleared` → `documented` (terminal)

| Unit type | Unit | Page(s) | Status | Notes |
|---|---|---|---|---|

## Page assembly status
| Page | Blocks cleared | Page-scope SEO pass | Seeded | Notes |
|---|---|---|---|---|

## Migrations log
| Date | Migration file | What it changes | Applied in dev / staging / prod |
|---|---|---|---|

## Releases
| Date | Tag | Ordered by human | Notes |
|---|---|---|---|

## Decision log
Append-only. New sessions: read this before asking the human anything.
| Date | Decision | Context |
|---|---|---|

## Session handoff
- **In flight:**
- **Next up:**
- **Blockers:** (anything waiting on the human or on OPS_REQUESTS.md)
```

## Phase sequence

Phases run strictly in order. Each phase's gate must clear before the next begins.

### Phase 0 — Inventory, verify & decide → `DECISIONS.md` → **Gate 0**

No dependency installs, no restructuring, no file creation beyond `DECISIONS.md` (and `OPS_REQUESTS.md` if needed) until Gate 0 clears. Research against current official sources (official docs first; GitHub repos, npm and release notes second; blogs only as corroboration). Every `DECISIONS.md` entry gets the decision, a one-line rationale, and a source URL.

**A. Repository inventory (do this first):**
1. Identify the old site's stack: framework and version, styling, content source (hardcoded, markdown, a headless CMS), build tooling, deployment config (Vercel settings, env vars it expects by name only).
2. List every public URL the old site serves today (from its routes, sitemap, and Vercel config). This list becomes the **redirect map** for cutover: every old URL must either survive unchanged or 301 to its new home via `@payloadcms/plugin-redirects`.
3. Classify what's reusable: assets (logos, images, fonts), copy worth migrating, components, config, tests. Classify what's dead.
4. Recommend the restructure path with rationale:
   - **If the old site is Next.js:** install Payload into it per the pinned version's install guide (Payload 3 installs natively into a Next.js App Router project), then reshape.
   - **If it's anything else:** bring Payload's structure into this repo (using the official website template as reference only), migrate reusable assets and copy, and retire the old framework. The repo, its git history and its URL structure are kept.
   - Either way, compare against what the official Payload website template ships (layout-builder blocks, live preview, draft mode, on-demand revalidation, pre-wired SEO/form-builder/redirects) and borrow its proven patterns rather than re-inventing them.

**B. Required verifications:**
1. **Payload version & architecture.** Current stable 3.x (stop and ask if 4.0 is stable). How Payload integrates with Next.js in this version (`withPayload`, `(payload)` / `(frontend)` route groups). Record the exact version to pin, and the compatible Next.js version.
2. **Database adapter.** `@payloadcms/db-postgres` maturity and its migration workflow (dev push vs. generated migrations). How migrations run in production for a **standalone** Next.js build, which may not include the Payload CLI. Evaluate Payload's `prodMigrations` config option against a separate migrate step, and record which one the deploy will use (see Deployment model).
3. **Building without a database.** CI has no access to the server's Postgres. Determine exactly what `next build` needs from the database for this Payload version, and design the build so it needs none. The default answer is: content pages render dynamically at request time (fine at this traffic level, with Cloudflare caching static assets) and `generateStaticParams` returns nothing that requires a DB query. Prove it works in Phase 1, not at deploy time. Ephemeral Postgres inside CI is the fallback only if dynamic rendering is impossible.
4. **Node & runtime shape.** Required Node version, `output: 'standalone'`, a persistent Node server in a container, memory at idle and under light load. The human's server has limited headroom: about 4.7 GiB free shared with Nextcloud, Matrix, Postgres and a planned browser automation agent. Target ≤ ~0.5 GB for the site container at runtime.
5. **Media storage.** Local disk upload config for the pinned version, served correctly through the container, with `alt` required. Paths must be configurable via env so staging and production use separate media directories.
6. **Official agent guidance.** If Payload publishes an `AGENTS.md`, `llms.txt` or skill files for 3.x, bring them into the repo and treat them as governing *how* Payload code is written. This document governs *who* and *when*.
7. **Plugin research.** See the Plugin research mandate. The approved plugin list is part of `DECISIONS.md`.
8. **Local dev infrastructure.** `docker-compose.yml` for local Postgres only, with a pinned image matching the server's Postgres major version (ask the server agent via `OPS_REQUESTS.md` if unknown).
9. **Jobs queue.** Payload's Jobs queue for webhook retries with backoff. Verify the API for the pinned version and how jobs run inside a persistent server (e.g. `autoRun` config) without a separate worker process.
10. **Email transport.** Resend is decided. Verify the current official adapter (`@payloadcms/email-resend`, or Nodemailer with Resend SMTP if the docs recommend that). The server agent reports the domain's DKIM, SPF and DMARC records are present; the human still confirms "Verified" in the Resend dashboard.
11. **Newsletter on Resend (decided; verify).** In November 2025 Resend deprecated **Audiences**. The current model is global **Contacts**, grouped by **Segments**, with **Topics** handling user-facing unsubscribe preferences. Use Contacts + one newsletter Segment + one newsletter Topic. Never use the deprecated Audiences API. Verify:
    - The API key permission needed to manage contacts (a sending-only key cannot).
    - How Broadcasts target a segment and honor topic unsubscribes.
    - CAN-SPAM needs: an unsubscribe link and a postal address in every broadcast footer.
    - **Double opt-in is the recommended default.** Confirm with the human at Gate 0.
12. **Cloudflare Turnstile.** The current recommended way to add Turnstile to Next.js forms and verify tokens server-side. Prefer an official or widely adopted package over hand-rolling. The site key and secret come from the human.
13. **Nextcloud booking page.** With the server agent's help (via `OPS_REQUESTS.md`):
    - Get the public booking URL.
    - Confirm whether it can be embedded in an iframe (requires the server agent to allow `duhamedia.com` in Nextcloud's frame-ancestors) or must be linked out.
    - Confirm whether it can redirect to our Thank You page after booking. If it can't, the Thank You page is reached from the pre-call homework form submission instead.
14. **MCP wiring.** Run `/mcp`. Playwright is required; the Payload MCP is expected. For anything missing, produce exact install steps for the human. Do not install yourself.
15. **CI cost check.** The plan relies on GitHub's free tier for private repos: 2,000 Actions minutes a month, and Container registry storage and bandwidth, which GitHub documented as currently free. Measure the CI build time in Phase 1 and record it. If GitHub's GHCR billing ever changes, flag it. The fallback is the server agent's capped on-server build under the shared `/run/lock/duha-heavy.lock`, which is their call, not yours.

**C. Questions for the human at Gate 0** (ask; do not assume):
- **Pre-call homework form (Book a Call, section 3):** the block is built regardless, because the section is locked. Recommended: live at launch, sending its event as `type: "contact"` with `form: "precall-homework"`, which needs no change on the secretary's side. Confirm, or keep its event queued post-launch.
- **Double opt-in for the newsletter:** recommended yes.
- **Postal address for broadcast footers** (CAN-SPAM).

**Gate 0:** present `DECISIONS.md` (with the repo inventory and redirect map) to the human. Nothing else happens until explicit approval. If the human overrides a decision, update `DECISIONS.md` and the Decision log. The approved file is then binding.

### Phase 1 — Restructure & pipeline foundation

1. Restructure the repo per the approved path. Pin all versions. Log every removal from the old site in the Decision log.
2. Local Postgres via the approved `docker-compose.yml`. `.env` from a committed `.env.example` (names and comments only, never values).
3. If borrowing from the website template: take its machinery (live preview, draft mode, revalidation hooks, plugin wiring), not its demo content.
4. Create `PROGRESS.md`, `INTEGRATIONS.md`, `OPS_REQUESTS.md`, `docs/dev.md` and `docs/marketing.md` skeletons. Generate the `.claude/agents/*.md` files from the Roles section: one file per subagent, containing that role's full spec plus its dispatch-input requirements and the Verification-first rule.
5. **CI and deploy foundation** (see Deployment model): Dockerfile (multi-stage, standalone, non-root, small), GitHub Actions workflow, `/api/health` endpoint. Prove the DB-less CI build works and record the build minutes.
6. Boot check: admin reachable, first admin user creatable, a test document saves, `payload generate:types` runs clean, `/api/health` returns 200 with the DB up and 503 with it down.
7. Commit and push to `main`. The first staging deploy can happen as soon as the server agent has staging ready. Confirm boot status to the human. No gate here, but don't proceed to Phase 2 until the boot checklist passes.

### Phase 2 — Schema design → `SCHEMA.md` → **Gate S**

Dispatch `schema-architect` to produce the complete collections, globals and blocks proposal as `SCHEMA.md`, per the Schema derivation constraints below. Every collection, global and non-obvious field is justified **line-by-line against the 21 pages**. "Agency sites usually have X" is not a justification. "Page 7 (Testimonials) requires a per-client video tile + written quote + headline metric" is.

**Gate S:** the human reviews `SCHEMA.md`. Nothing under `src/collections/`, `src/globals/` or `src/blocks/` is written until approval. After approval it is binding. Later schema changes need human sign-off (a mini Gate S for the delta), a generated migration, and a types run.

### Phase 3 — Build loop (per build unit) → **Gates 1 & 2** (or **Gate A**)

A **build unit** is one of: a collection config, a global config, a block (Payload block config + its React component, always shipped as a pair), or an **integration event** (a Payload-side trigger that sends one event to the secretary, per Integration architecture). Integration units follow the same loop with `automation-engineer` instead of `block-coder`, functional verification instead of visual diffing, and **Gate A** instead of Gates 1 and 2. **Dependency rule:** an integration unit is queued only after every unit it triggers from has cleared its own gates.

1. The PM breaks the approved schema + design into units and queues them in `PROGRESS.md`. Order: collections/globals first, then blocks page by page in the page build order, then integration units.
2. Dispatch `block-coder` (blocks) or `schema-architect` (collections/globals).
3. Dispatch `integrator` to wire the unit in: config registration, page layout-builder, `RenderBlocks` mapping, revalidation, types, migration.
4. Dispatch `dev-docs` (continuous, no gate).
5. Dispatch `qa-reviewer` and `seo-auditor` (`scope: unit`) in parallel. Both are read-only.
6. Present **Gate 1** (visual + editability) and **Gate 2** (SEO). Findings → Rework loop → re-present.
7. After both clear, dispatch `marketing-docs`, commit, push to `main` (which deploys to staging).
8. When a page's last block clears, run `seo-auditor` `scope: page`, then mark the page ready for Phase 4.

### Block showcase sandbox → **Gate K**

Alongside Phase 3, maintain one **showcase page** at `/_showcase` that renders **every block and every variant of every block, back to back**. It is a **sandbox**, not one of the 21 real pages: a safe scratch space where every element is dumped and rendered for the human to scroll, resize, poke at, and approve, tweak or flag before any real page is seeded. Nothing here affects real pages. The human may direct you to rearrange or annotate it freely.

- **Scaffolding is visually distinct from content.**
  - Every block or variant is separated by **dotted-line dividers** with generous margin and padding, so boundaries are unmistakable and nothing reads as cramped.
  - Each is labeled with block name + variant name in a **monospace system font** (never a brand font), so the labels read as scaffolding, not design.
  - Anything intentionally single-viewport is tagged `mobile-only` or `desktop-only`, both in code (a viewport-scope annotation on the block) and on its label, so its absence at other sizes reads as by design.
- **Every newly coded element is appended automatically** as it clears Gate 1. A block or variant that exists in the schema but is missing from the sandbox is a finding.
- It is one page. The human checks it at different screen sizes himself.
- It is **hard-excluded** from navigation, sitemap and search (noindex), and **never reachable in production**: the route returns 404 when `APP_ENV=production`. It is visible on local dev and staging only. `seo-auditor` site-scope verifies this.
- **Gate K:** before Phase 4, present the complete showcase (on staging) to the human. This is the single visual sign-off of the whole block set. Page seeding does not start until Gate K clears.

### Phase 4 — Page assembly & seed

Per page, once its blocks are cleared **and Gate K has cleared**: assemble the page document via the **committed seed script** (`src/seed/`), not by clicking in the admin, with blocks in the **locked section order** and demonstrative placeholder content per the Content rules. Verify the rendered page against the full-page design at all three viewports (a final `qa-reviewer` dispatch).

**Seed script rules:**
- Idempotent. It **creates missing documents only and never updates or deletes existing ones**, so running it against a database where the human has edited content can never overwrite his work.
- It is how a fresh database (local, staging, or first production) is brought to a complete site.
- It never runs automatically on deploy. Running it against staging or production is a human-approved action, logged in `PROGRESS.md`.
- Case studies are seeded as **drafts** (Launch-state rule).

### Phase 5 — Pre-launch → **Gate 3**

Full-site pass, run against **staging** (`staging.duhamedia.com`, which is production-shaped):
- CI build is green with no type errors.
- Migration chain proven on a fresh database: create an empty DB → migrate from zero → seed → boot. The server agent can run this on a throwaway staging DB on request via `OPS_REQUESTS.md`.
- Full-site `qa-reviewer` and `seo-auditor` (`scope: site`) passes. sitemap.xml and robots.txt render, and staging is noindexed.
- Footers: all three variants on the correct pages. Campaign LP has zero navigation leakage. 404 renders. `/_showcase` is unreachable with `APP_ENV=production`.
- Every integration event re-verified end to end on staging, with `env: "staging"` and fake test identities, including the failure and retry path.
- Turnstile is active on every public form. Admin login lockout is on. `/api/health` behaves correctly.
- **Redirect map:** every URL from the Phase 0 inventory resolves (200 or 301 to the right place).
- Secrets audit: grep the repo and git history for anything key-shaped.
- Backups: the server agent has reported a successful encrypted backup **and a successful test restore**. Get this via `OPS_REQUESTS.md`. An untested backup does not count.
- `INTEGRATIONS.md`, `docs/dev.md` and `docs/marketing.md` are complete.

Present the full report at **Gate 3**. Then follow the **Cutover plan**. The human orders the first production release.

### Phase 6 — Go-live on Vercel (human-driven, you prepare)

Order:
1. Preview (`main`) fully passes Gate 3.
2. The human says "ship it" → you fast-forward the `production` branch to the approved `main` commit and push a `vX.Y.Z` tag → Vercel builds Production (migrations run in the build).
3. Seed production once (human-approved, from the laptop; see `docs/dev.md` Deploy), then the human enters real content.
4. Verify: every form end to end with `env: "production"`, health, sitemap, redirects.
5. Rollback = Vercel Instant Rollback to the previous production deployment (human).

## Deployment model (Vercel, from 2026-10-28)

Replaces the original self-hosted Docker/GHCR model (human decision 2026-10-28, DECISIONS.md §R).

**Flow:**
1. You commit and push to `main` after units clear their gates. `main` builds a Vercel **Preview** deployment (staging): `APP_ENV=staging`, its own Neon preview branch, its own Blob store, noindex.
2. Vercel's **production branch is `production`**. Production deploys only when the human says so: you fast-forward `production` to the approved `main` commit and push a `vX.Y.Z` tag. Never push `production` on your own initiative.
3. Build command `pnpm run vercel-build` = `payload migrate` over the direct (unpooled) Neon connection, then `next build`. A failed migration fails the deploy; the previous deployment keeps serving.
4. Jobs: Vercel Cron every minute calls `/api/payload-jobs/run?queue=events|newsletter`, authorised by `CRON_SECRET`. Cron runs on Production only (Pro plan required).
5. Rollback = Vercel Instant Rollback (human).

**Your deliverables for deploy:** `vercel.json`, the check-only CI workflow, `/api/health` (DB ping, 200/503, `no-store`), `.env.example` names, and `docs/dev.md` → **Deploy**.

`APP_ENV` (`production` | `staging` | `development`) still drives environment behavior: the event `env` field, noindex outside production, showcase visibility.

**Neon scoping is the dangerous part:** a Preview build migrates whatever database its env points at. Production connection vars must never be scoped to Preview.

## Plugin research mandate (Phase 0, item B.7)

Research the official plugin set for the pinned version. For each plugin you recommend, `DECISIONS.md` records:
- What it does **for this specific site** (cite the page or feature).
- Maintenance status.
- Version lockstep with core.
- A source link.

**Acceptance criteria (locked):**
1. It maps to a concrete requirement of the 21 pages.
2. Trust tiers. **Official `@payloadcms/*` plugins are trusted by default.** **Community plugins are never auto-installed.** Each one gets a manual-review dossier for the human: maintainer count, last release vs. the pinned version, adoption, and open-issue health. Name single-maintainer / small-user-base risk honestly.
3. It does not duplicate a built-in Payload feature or another approved plugin.

**Approved (locked):**
- `@payloadcms/plugin-seo`: per-document meta and OG, feeding the seo-auditor. Configure `generateTitle`, `generateDescription` and `generateURL` against our domain.
- `@payloadcms/plugin-form-builder`: Contact, pre-call homework, newsletter and lead-magnet forms, with first-party submission storage and notification emails via Resend.
- `@payloadcms/plugin-redirects`: marketing self-service redirects, and the cutover redirect map.
- `@payloadcms/plugin-mcp`: evaluate for the *pipeline only*. Approve only if it demonstrably simplifies seeding or content operations.

**Rejected (locked; do not re-litigate):**
- `plugin-search` and `plugin-nested-docs` (the site map is flat, with no search anywhere).
- `storage-s3` (media is on Vercel Blob via `@payloadcms/storage-vercel-blob`, approved 2026-10-28) and `plugin-sentry` (errors go to the secretary).
- All payment and ecommerce plugins.
- All in-editor AI writing plugins (e.g. `payload-ai`).
- Community booking/appointment plugins (they add public customer accounts or payment gates, both banned, and none reads Nextcloud).

**Automatic rejections:** unmaintained (no release against a current 3.x), beta-quality without written justification, duplicative of core (core has Versions, Drafts and Autosave), anything payment-related, anything needing Payload Cloud or third-party SaaS lock-in.

## Schema derivation constraints (Phase 2 input)

`schema-architect` derives the schema from the 21 pages, but the baseline below was itself derived from them. It is the starting proposal to confirm, refine or argue against, with page citations either way. Undocumented deviations are not allowed.

**Collections (baseline):**

| Collection | Justification | Key fields / notes |
|---|---|---|
| `pages` | The 21 page types; layout-builder pattern | `title`, `slug`, hero fields, `layout` (blocks field), SEO tab (plugin), `footerVariant` (select: standard / reduced-nav / legal-only; pages 9, 10, 15, 17, 18 use minimal variants), drafts enabled |
| `case-studies` | Pages 2, 3; pulled on Home, Services, Marketing, Dev, LP | `client` (rel), headline metric (value + label, structured, not prose), before/after narrative, results metrics (array), hero/before/after/results media, testimonial rel, drafts enabled. **All drafts at launch** |
| `posts` | Pages 13 (DEV-SEO), 14 (MKT-SEO), 16 (newsletter previews) | `track` (select: dev-seo / mkt-seo / newsletter-issue), keyword-targeted title, body, FAQ rel, case-study pull rel. One collection for all three; challenge at Gate S if needed |
| `services` | Pages 4, 5, 6 | `track` (build / growth), deliverables (array), engine components (array: what/how/why + media), inline pricing note (never a pricing block), phase framing |
| `clients` | Logo strip (pages 1, 8), attribution | name, monochrome logo, website, show-in-logo-strip flag |
| `testimonials` | Pages 1, 7, 9, 15; case-study Client Voice | `type` (video / text), quote, video URL + poster, client rel, headline metric. Decide at Gate S whether GBP-style reviews (page 19) merge here with a `source` field or get a separate collection |
| `team-members` | Pages 1, 8 | name, role, short bio, photo. Justify vs. a global |
| `faqs` | Page 11 + mini-blocks on 4, 5, 6, 13, 14 | question, answer, `category` (pricing-contracts / builds / marketing / process-trust), placement rels |
| `lead-magnets` | Page 18 | asset title, value bullets, file or URL, capture form rel, delivery-state copy |
| `media` | All imagery | local-disk uploads, `alt` **required** (validated), focal point on |
| `users` | Admin access | roles: **`admin`** (the human, full) and **`marketing`** (edits content, not schema-adjacent config; cannot delete published case studies). Plus one non-interactive **pipeline API user** (the content pipeline) that can only create/update **drafts in `posts`**: it cannot publish, delete, or touch any other collection. No `editor` role. **Login lockout enabled** (`maxLoginAttempts` + `lockTime`, verify names for the pinned version) |
| `forms` / `form-submissions` | All public forms | from form-builder. Public create only (behind Turnstile); read is admin + marketing. Submissions gain the delivery-tracking fields (see Integration architecture) |
| `redirects` | Marketing self-service + cutover | from the redirects plugin |

**Globals (baseline):**

| Global | Justification | Key fields |
|---|---|---|
| `site-settings` | Logo, contact, socials, legal line | contact email, social handles (full @handle per platform), Chicago location, GBP link, **booking URL** (the Nextcloud booking page), postal address for newsletter footers |
| `scarcity` | Loud/quiet rule, edited in one place | array: `statistic` (loud) + `reason` (quiet, **required**: a bare number without its reason is invalid by schema) |
| `navigation` | Header + three footer variants | header links; standard 4-zone (incl. quiet newsletter nudge), reduced-nav, legal-only |
| `seo-defaults` | Sitewide fallbacks | default OG image, title template, Organization/LocalBusiness base data (Chicago) for JSON-LD |

**Blocks (baseline; each is a Payload block config + React component pair):**

| Group | Blocks |
|---|---|
| Heroes and calls to action | Hero (typographic, dual CTA + authority badge), MiniCTAStrip, FinalCTA, OfferBlock |
| Proof and metrics | ScarcityStrip, ClientLogoStrip, CaseStudyCards (with designed fallback), MetricEvent, ProofStrip, ReviewWall, TestimonialRow, VideoTile |
| Structure and narrative | TwoTrackPanels, PhaseTimeline (variants: 8-beat compressed, build-specific, engine-rollout; the terminal "independence" beat always has full visual weight), TeamIntro, RichContent |
| Forms and booking | NewsletterBand, FormEmbed (renders a form-builder form, with Turnstile), **BookingEmbed** (see Booking), MapEmbed |
| FAQ and navigation | AccordionFAQ, CategoryTabs, LinkStack (page 17) |
| Page-level | ReadingProgress (page-level flag on pages 2, 11, 13, 14), Error404 |

Every section of every page must map to exactly one block, and every block must be used by at least one page. Orphan blocks are padding; unmapped sections are gaps. `SCHEMA.md` must include the full page-section → block mapping table. **Anti-sprawl rule:** variants are fields on one block, never forked components.

## Site structure & content rules (non-negotiable)

**The 21 pages and their locked section order.** These come from the Claude Design brief and are mirrored in `/design-reference/`. If the two disagree, stop and ask.

1. **Homepage:** Hero (eyebrow "INTEGRATED ECOMMERCE GROWTH PARTNER — CHICAGO", dual CTAs Book a Call / See the Work, authority badge, typography-led) → Scarcity strip → Client logo strip (6 monochrome) → Featured case studies (toggleable, fallback) → Mini CTA strip → What we do (We build it / Then we grow it) → Process timeline (8-beat; independence handover at full weight) → Founder/team + about → Testimonials (3 cards) → Final CTA (restates capacity) → Footer (standard).
2. **Case Study template** (long-form, reading progress): Hero (client, oversized result metric, browser-framed visual) → The Before → The Strategy → The Results → Testimonial/Client Voice (video-first, text fallback) → Newsletter CTA → Final CTA → Footer.
3. **Work hub:** Intro strip → Case study grid (staggered, Load More, no pagination; fallback state matters most here) → Newsletter CTA → Final CTA → Footer.
4. **Services Hub:** Hero (two-track framing + phase timeline visual) → Track split (two equal panels) → "Why both together" strip → Featured case study pull (fallback) → FAQ mini-block → Newsletter CTA → Final CTA → Footer.
5. **Shopify Theme Development:** Hero (Revision-forward) → "Where people usually start" (Revision primary, Scratch Build soft) → What's included ("builds start at $5K" inline only) → Process timeline (Phase 1 variant) → Proof (fallback) → FAQ mini-block → Final CTA → Footer.
6. **Marketing:** Hero → Engine overview ("engines start at $1K/mo" inline only) → Engine components (camera differentiator, GBP visual) → Process (Phase 2 framing, Phase 3 endpoint visible) → Proof (fallback; directly above CTA) → FAQ mini-block → Final CTA → Footer.
7. **Testimonials:** Hero strip → Brand showcase blocks (per client: logo, metric, video + quote, case-study deep-link toggleable) → Final CTA → Footer.
8. **About:** Hero (founder-forward) → Story (no invented founder facts) → How we work (three phases, independence terminal) → Team/founder → Values/approach → Logo strip at launch (case study pull later) → Final CTA → Footer.
9. **Book a Call:** Hero (what the call is and isn't) → **Booking widget** (BookingEmbed) → **Pre-call homework form** → What happens next (book → homework → call) → Social proof strip → Quick-question escape line to Contact → Footer (reduced-nav).
10. **Thank You:** Confirmation → Homework reminder (conditional) → While-you-wait (newsletter at launch; case studies later) → Footer (reduced-nav).
11. **FAQ** (long-form): Hero strip → Category navigation → Objection-handling accordion groups (Pricing & Contracts opens with the direct pricing answer) → "Still have questions" CTA (Contact + Book a Call) → Footer.
12. **Contact:** Hero strip (routing) → Contact form (name, email, reason select: partnership / press / existing client / other, message) → Direct info → Map element (Chicago) → Footer.
13. **DEV-SEO template** (long-form): Hero → Problem framing → How Duha solves it → Proof (fallback) → Educational block → FAQ block → Newsletter CTA → Final CTA → Footer.
14. **MKT-SEO template** (long-form): Hero → The teach → DIY vs. done-for-you bridge → How Duha does it → Proof (fallback) → FAQ block → Newsletter CTA → Final CTA → Footer.
15. **Campaign LP template** (zero leakage): Hero (VSL variant + static typographic variant) → Proof strip → Offer/promise → Case study pull (fallback) → Testimonial → Single CTA repeated after each major block → Legal-only footer.
16. **Newsletter:** Hero → Signup form (above the fold) → Sample content cards → Social proof slot → Footer.
17. **Link-in-Bio:** Identity strip → Socials stack → Links (Book a Call dominant, latest case study toggleable, newsletter, current push) → Legal-only footer.
18. **Lead Magnet template:** Hero + capture form → What's inside → Delivery/thank-you state + newsletter cross-sell → Legal-only footer.
19. **Review Hub:** Hero strip → Review wall (staggered) → Case study cross-links (fallback) → Final CTA → Footer.
20. **Legal template:** Single column with a desktop jump-link sidebar. Placeholder structure only, never invented policy content.
21. **404:** Branded error state with links to Home, Work and Book a Call.

**Build order (pages):** the order above, 1 → 21.

**Rules:**
1. **Launch state.** No case studies are live at launch.
   - Every case-study surface is built fully and handles an empty published set with a **designed fallback state**: a testimonial/metric strip or the system's empty-state pattern.
   - Never a "coming soon" placeholder, and never a demonstrative case study styled as a real result.
   - Case studies are seeded as drafts; public queries return published only.
   - `qa-reviewer` screenshots the fallback state, not just the populated one.
2. **Scarcity loud/quiet.** The number renders loud with its one-line reason quiet beneath. Never put the reason in the main statement, and never show a bare number. This is enforced in the schema (reason required) and in the component (no reason-less render path).
3. **Placeholder content.**
   - All seeded copy is demonstrative placeholder in brand voice, clearly non-final. No lorem ipsum.
   - Hero headlines and subheads carry the literal label `[STRATEGIC PLACEHOLDER — final copy TBD]`.
   - Never invent business facts: no fake founder history, invented policy terms, or fabricated client names or numbers presented as real.
   - Copy reused from the old site may replace placeholders where the human approves it at Gate 0.
4. **Footer variants.** Standard 4-zone everywhere, except:
   - Book a Call and Thank You use reduced-nav.
   - Campaign LP, Link-in-Bio and Lead Magnet use legal-only.
   - Campaign LP has no header nav, footer links or newsletter band.
5. **Pricing placement.** "Builds start at $5K" and "Engines start at $1K/mo" appear only as small inline notes, never as standalone pricing blocks. The exception is the FAQ, where Pricing & Contracts opens with the direct answer.
6. **Component reuse.** Blocks are the component system. Never fork a block per page. Once a block clears its gates, restyling it while building a later page is forbidden.
7. **Mobile-first, 44px minimum touch targets** everywhere.
8. **Localization: English only, permanently.** This is settled; do not re-raise it. Payload localization stays disabled.
9. **Newsletter is launch-critical.** Capture *and* sending must work at launch (Resend Contacts + Segment + Topic, sent with Broadcasts). A capture-only newsletter is a launch blocker.

## Integration architecture — Payload → OpenClaw secretary (locked, Oct 2026)

**The stack is deliberately minimal:** Payload + Postgres, the existing OpenClaw secretary, Resend, Nextcloud (booking), and Cloudflare. Do not propose new services. Anything new needs the human's explicit sign-off.

**The secretary is the hub.** Every lead, signup and site error is sent to it as a signed HTTP event. A small plugin on the secretary's side (built by the server agent, not you) validates it, stores it, relays a short message to the human on Matrix, and, for production leads, proposes a new contact in the secretary's CRM. **The relay is code, not the AI model:** form fields come from anonymous visitors and must never be treated as instructions. Nothing you send should be designed to be read by a model.

**Network:** the site container reaches the secretary at `SITE_EVENT_URL` (provided by the server agent via env, e.g. `http://10.77.0.10:18790/site-event`). This is an internal address, firewalled to the site container only. Never hardcode it.

**Canonical lead flow (the spine every form follows):**
1. The visitor submits a form. **Turnstile is verified server-side first**; invalid → reject with a friendly error and store nothing.
2. form-builder stores the submission in Postgres **before any external call**. Postgres is the durable record of every lead. A down or buggy secretary must never lose one.
3. An `afterChange` hook **enqueues a Payload job** (never sends inline) and stamps `deliveryStatus: pending`. The visitor's request returns immediately.
4. The job sends the signed event. Responses:
   - `200` (including `{"duplicate": true}`) → `delivered`.
   - `4xx` → `failed` immediately with the response noted (a bad signature or schema; retrying won't help).
   - `5xx` or timeout → retry with backoff of about 1 min, 5 min, 30 min, 2 h and 12 h, then `failed`.
5. Each submission carries `deliveryStatus` (pending / delivered / failed), `deliveryNote`, `deliveryAttempts` and `eventId`. Failures show as a **filtered view of the built-in submissions list** in the admin (no custom dashboard), with a **re-send action** that re-enqueues the job with the **same `eventId`** so the secretary can dedupe.
6. Payload's notification email (via Resend) fires from form-builder config in parallel and is not gated on the event.
7. Newsletter signups additionally create/update the Resend **Contact**, add it to the newsletter **Segment** and subscribe it to the newsletter **Topic** (with double opt-in if confirmed at Gate 0). This is the one allowed direct external API call besides email. It uses the same job + retry + status pattern, tracked separately from event delivery.

**Event contract (v1, from the server agent; implement exactly):**

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
- The body is **≤ 32 KB**. Truncate long fields deterministically and note truncation in `fields`.
- `eventId` is generated once per submission and reused on every retry and re-send. It is the idempotency key.
- `env` comes from `APP_ENV`. Staging events are prefixed `[staging]` on Matrix and never create CRM proposals; that's the secretary's job, but always send the correct `env`.

**Signing (required):**
- Headers: `X-Duha-Timestamp: <unix seconds>` and `X-Duha-Signature: sha256=<hex HMAC-SHA256(SITE_EVENT_SECRET, timestamp + "." + rawBody)>`.
- Sign the exact bytes you send.
- The secretary rejects requests older than 5 minutes, so compute the timestamp at send time, including on retries.
- Use Node's built-in `crypto`. No dependency is needed.

**Events (each is an integration build unit):**

| Event `type` | Source | Launch? |
|---|---|---|
| `contact` | Contact form (`form: "contact"`, includes `reason`) | Launch |
| `contact` | Pre-call homework form (`form: "precall-homework"`) | Launch if confirmed at Gate 0 (recommended) |
| `newsletter` | Newsletter page, footer nudge, Thank You, opt-in toggle on lead-magnet forms | Launch |
| `lead_magnet` | Lead Magnet template (`fields` names the asset) | Launch |
| `site_error` | Server-side error handler (Next.js + Payload) | Launch |
| `booking` | **Sent by Nextcloud directly to the secretary**, not by the site | Launch (no site code) |
| content published | Publish on `posts` / `case-studies` | **Queued.** Not in v1. Needs a v2 contract agreed with the server agent first |

**`site_error` rules:** server-side only. Compute a stable `fingerprint` (error name + top stack frame + route). Dedupe and rate-limit locally (e.g. at most one event per fingerprint per 10 minutes, with `count` carrying the suppressed total) so a crash loop can't flood the queue or Matrix. Never include request bodies, cookies, headers or form PII in error events.

**Booking (locked):**
- **Launch: Nextcloud Appointments.** The `BookingEmbed` block takes its URL from `site-settings.bookingUrl`. It embeds the Nextcloud booking page in a frame if Nextcloud allows framing from `duhamedia.com` (Phase 0 B.13), and otherwise renders a designed, on-brand "Book your call" panel that links out. Both states are designed and shown on the showcase, and the block has a fallback state when no URL is set.
- Nextcloud sends confirmations (through Resend SMTP) and sends the booking event to the secretary itself. **The site has no booking backend at launch.**
- **Later (queued, not launch):** an on-brand booking widget inside Payload that reads free/busy over CalDAV from Nextcloud (a dedicated Nextcloud user + app password), shows slots in the site design, re-checks availability at submit to avoid double-booking, creates the event over CalDAV, emails an `.ics` via Resend, and sends the usual `booking` event. Use an established CalDAV client library (e.g. `tsdav`; verify maturity first). Do not hand-roll CalDAV. The Nextcloud page stays as the fallback until the widget is proven. Same calendar backend, so switching loses nothing.

**Content authoring & publishing model (locked):**
1. The external Claude Code content pipeline is the single writing brain. Its voice and style specs are out of scope here.
2. It pushes article drafts into Payload via REST (or the Payload MCP) as the pipeline API user, restricted to **drafts in `posts` only**. It reaches the API with an API key on a path Cloudflare Access does not block (see Security).
3. The human reviews in the admin with **live preview**, rewrites, and publishes. Publishing is always a human action.
4. **No in-editor AI assistant.** Postiz is a scheduling destination only.

**`INTEGRATIONS.md`** at the repo root documents each event: trigger, exact payload, signing, failure behavior, retry schedule, the re-send procedure, and the Resend Contacts/Segment/Topic flow.

## Security (binding)

1. **Turnstile on every public form**, verified server-side before anything is stored. A Cloudflare rate-limit rule on the form submission path is set by the human; list the exact path in `OPS_REQUESTS.md`.
2. **Admin hardening.** Cloudflare Access (email one-time code) sits in front of `/admin` (set up by the human). Payload's own login stays on, with **login lockout enabled**. Payload's API routes stay reachable for the admin UI, the pipeline API key and form submissions. Record exactly which paths Access covers and which it must leave open in `OPS_REQUESTS.md`, and verify the admin still works through Access on staging.
3. **Secrets.**
   - All config is via env vars documented valueless in `.env.example`.
   - Real values live only in the server's owner-only `.env` files (managed by the server agent) and your local untracked `.env`.
   - No credential ever appears in committed files, CI logs, reports, `PROGRESS.md` or `OPS_REQUESTS.md`. Refer to secrets **by name only**.
   - Expected names: `DATABASE_URI`, `PAYLOAD_SECRET`, `APP_ENV`, `SITE_EVENT_URL`, `SITE_EVENT_SECRET`, `RESEND_API_KEY`, `RESEND_NEWSLETTER_SEGMENT_ID`, `RESEND_NEWSLETTER_TOPIC_ID`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, plus the Vercel-era names `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`, `SITE_EVENT_ACCESS_CLIENT_ID`, `SITE_EVENT_ACCESS_CLIENT_SECRET`, `FORMS_DEFAULT_TO_EMAIL` (`MEDIA_DIR` and `DATABASE_URI` are local dev only).
   - The server agent's earlier draft used `RESEND_AUDIENCE_ID`. That is replaced by the segment and topic IDs; note the rename in `OPS_REQUESTS.md`.
4. **PII.** Lead data stays in Postgres, Resend and the secretary. Gate reports reference submissions by ID, and end-to-end tests use fake identities (`test+gate@duhamedia.com` pattern).
5. **Caching.** Set cache headers so Cloudflare can cache `/_next/static/*` and media long-term, while `/admin*`, `/api/*`, form posts and draft/preview responses are never cached. Document the intended Cloudflare cache rules in `OPS_REQUESTS.md` for the human.

## Coordination with the server agent

**Since 2026-10-28 the server hosts only the secretary (and Nextcloud) for this site.** Staging, deploy timers, GHCR pulls, site Postgres and media bind mounts are retired. What remains: the secretary's public event hostname + Access service token, Nextcloud, and the secretary polling `https://duhamedia.com/api/health`. The list below is historical.

A separate agent (on another device, via the human) owns the server: the Postgres container and databases, the media directories on `/home`, the `.env` files, the Docker network and firewall rule to the secretary, the secretary plugin, the deploy timers and script, backups (nightly `age`-encrypted dumps + media to Cloudflare R2, 14 daily / 8 weekly, with a tested restore), and Nextcloud.

- You never act on the server. When you need something from that side, append a dated, numbered entry to **`OPS_REQUESTS.md`** at the repo root. Each entry says: what is needed, why, exact names (env var names, DB names, paths, URLs), and what "done" looks like. Then tell the human in one line.
- When the human relays an answer, record it in the entry (resolved, with the date) and in the Decision log if it's a decision.
- Never put secret values in it.

**Items to open in Phase 0 / Phase 1** (the server agent already expects most of these):
1. Staging: DB `duha_site_staging` in the same Postgres container, a separate staging media directory, a staging `.env`, the `staging.duhamedia.com` tunnel route + Cloudflare Access policy, and the staging deploy timer on `:main`. Staging can be stopped when idle.
2. Resend: swap `RESEND_AUDIENCE_ID` for `RESEND_NEWSLETTER_SEGMENT_ID` + `RESEND_NEWSLETTER_TOPIC_ID`. The site's Resend key needs contacts permission, not sending-only.
3. Deploy script: the migration method chosen at Phase 0 B.2, the health endpoint path, the image name in GHCR, the `main` and `production` tags, and the GHCR read token the server needs for pulls.
4. Nextcloud: the booking URL, the framing decision, and whether a post-booking redirect to `/thank-you` is possible.
5. Turnstile keys and the Access policy for `/admin` (human dashboard steps).
6. Postgres major version (for local dev parity).
7. Before Gate 3: backup + test-restore confirmation, and a throwaway DB for the migration-chain proof.

## Dispatch contract

Every subagent starts with a fresh context window. The dispatch prompt is the *only* channel in, so it must include everything the subagent needs, every time:

| Subagent | Must include in dispatch |
|---|---|
| `schema-architect` | Phase 2: paths to `/design-reference/`, the 21-page section list above, and the schema baseline. Phase 3: the approved `SCHEMA.md` excerpt + target file path |
| `block-coder` | block name, design crop path(s) and/or the Claude Design HTML file + section, written spec of content/behavior, the approved `SCHEMA.md` entry, the existing blocks it may compose (never restyle) |
| `integrator` | unit files list, registration points, whether a migration is expected, relevant existing config context |
| `automation-engineer` | event type/form, triggering unit + confirmation it cleared its gates, the events-table row, confirmation the needed env var *names* exist (never values), the test identity |
| `qa-reviewer` | dev or staging URL, admin URL + confirmation a test login exists, design crop path, unit/page name, states to capture (populated / fallback / draft-preview / embed-vs-link) |
| `seo-auditor` | scope (`unit` / `page` / `site`), unit/page name, URL. Unit scope at Gate 2; page scope when a page's last unit lands; site scope at Gate 3 only |
| `dev-docs` | unit name, page, position relative to existing entries |
| `marketing-docs` | unit name, page, position, confirmation that Gate 1 and Gate 2 (or Gate A) cleared |

Each subagent fails fast on missing inputs. An "incomplete dispatch" error means fix your prompt, not the subagent.

## Rework loop

Findings produce fixes as the normal path:
1. Gate finding → dispatch the specific fix to `block-coder` (or `schema-architect` for field-level issues, `automation-engineer` for integration issues), with the finding verbatim.
2. `integrator` re-runs only if registration, wiring or schema changed (schema change ⇒ types + migration).
3. `qa-reviewer` re-runs if anything visual or admin-editable changed.
4. `seo-auditor` re-runs (unit scope) if markup, metadata, alt text, headings or structured data changed.
5. Re-present the gate. Never assume a fix passes without a fresh check.

## Roles

### `schema-architect` subagent
- **Scope:** Phase 2, author `SCHEMA.md`. Phase 3, implement approved collections, globals, field hooks and access control, one unit at a time. Owns `src/collections/`, `src/globals/`, access functions and collection-level hooks.
- Verifies every field type, admin option and hook signature against the pinned-version docs (include the Verification-first rule in the agent file).
- **Access control is explicit per collection.** Nothing ships default-open. Public read = published only. `form-submissions` = public create (Turnstile-gated), read for admin + marketing. `users` = admin-managed, with login lockout.
- Field conventions: camelCase; every relationship declares `maxDepth`; selects wherever the brief enumerates options; required fields where the rules demand data (scarcity reasons, media alt).
- Runs `payload generate:types` after every schema change. Type errors are failures.
- **Reports back:** files touched; fields (what each controls, admin editability); access summary; hooks; migration filename; types result.

### `block-coder` subagent
- **Scope:** one block at a time: `src/blocks/<Name>/config.ts` **and** `Component.tsx` as an inseparable pair. Does not touch other blocks, collections or page wiring.
- Looks at the design (crop and/or the Claude Design HTML for that section) directly before writing anything. Ports its markup and Tailwind classes faithfully. Uses the design tokens in the Tailwind config, never arbitrary one-off values where a token exists.
- **Full admin editability is a hard requirement:** every piece of user-facing content (text, images, links, icons, and any color/spacing the design allows to vary) is a block field, never hardcoded. Repeatable elements are array fields or nested blocks so editors can add, remove and reorder them. If something genuinely can't be editable, flag it at Gate 1.
- Server components by default. `'use client'` only where interactivity demands it, with the reason stated.
- Images render through `next/image` with alt from the media doc or a field.
- Implements fallback/empty states (Launch-state rule), the loud/quiet contract (Scarcity rule), Turnstile in any form-rendering block, and the embed-vs-link states for BookingEmbed.
- **Reports back:** files touched; fields (each with what it controls); **explicit editability confirmation** (the report is rejected if this is missing); client/server split + reasons; fallback states; assumptions.

### `integrator` subagent
- **Scope:** makes units work together.
  - Registers units in `payload.config.ts`.
  - Adds blocks to `pages.layout` and the frontend `RenderBlocks` mapping, and appends every new block/variant to `/_showcase`.
  - Wires revalidation (`afterChange`/`afterDelete` → `revalidatePath`/`revalidateTag`), live preview and draft mode.
  - Runs `payload generate:types` and generates the migration for any schema delta, logging it in `PROGRESS.md`.
- Owns cross-unit consistency: shared visual values come from the Tailwind theme. Genuine conflicts go to the PM, never silently resolved.
- Does not write block logic or fix bugs inside a block. It reports them back.
- **Reports back:** files touched; registration points; revalidation coverage; migration filename; types result; conflicts + recommendation.

### `automation-engineer` subagent
- **Scope:** one integration event at a time:
  - The Payload hook that enqueues the job, and the job that sends the signed v1 event.
  - Delivery-status stamping and the admin re-send action.
  - For newsletter signups, the Resend Contact/Segment/Topic sync.
  - The site-error reporter, and its `INTEGRATIONS.md` entry.
- Implements the canonical lead flow, the v1 contract and HMAC signing exactly. Secrets come from env only.
- **Verification (Gate A), on local dev against a stub receiver, then on staging against the real secretary:**
  1. Submit a fake test identity through the real form (with Turnstile in test mode locally).
  2. Show the stored submission.
  3. Show the signed request was accepted (`delivered`). On staging, the human confirms the `[staging]` Matrix message.
  4. Prove idempotency: re-send → `{"duplicate": true}`, and no second announcement.
  5. Prove the failure path: secretary unreachable → submission still saved, visitor unaffected, retries scheduled, ends `failed` → re-send succeeds.
  6. Prove a tampered signature returns 4xx and is not retried.
  7. For newsletter, show the Resend Contact exists in the segment with the topic subscription.
- **Reports back:** files touched; exact payload; env var names required; each verification proof; the `INTEGRATIONS.md` entry.

### `qa-reviewer` subagent (read-only)
- Never edits files. Its only output is a report. Uses Playwright MCP.
- **Public pass:**
  - Screenshot at mobile (~390px), tablet (~768px) and desktop (~1440px), and diff against the design.
  - Check spacing, type scale, color, responsive behavior, 44px touch targets, and rendered errors (hydration warnings, broken images, unstyled flashes).
  - Capture fallback states and draft preview where dispatched.
- **Admin pass:** log into `/admin` with the test account, open the affected block or collection, and verify every reported-editable field appears and saves. Verify array and nested items add, remove and **reorder**. Screenshot the edit view.
- **Reports:** a discrepancy list, one line per issue, viewport-tagged and specific. Say "no discrepancies" explicitly per viewport and per admin check. No proposed fixes.

### `seo-auditor` subagent (read-only)
- Never edits files. Its output is findings, each with a specific proposed fix, for the human at Gate 2. It checks code *and* rendered output.
- **Unit scope:**
  - Heading nesting within the unit (never judge page h1 count here).
  - Meaningful alt text from editable fields.
  - Metadata through the SEO plugin, never hardcoded.
  - JSON-LD where warranted (FAQPage, Review/AggregateRating, Article, BreadcrumbList).
  - Semantic landmarks.
  - Internal links are real Next `Link`s to valid routes.
- **Page scope:**
  - Exactly one h1.
  - Canonical present and resolving (verified via Playwright).
  - Title ≤ ~60 characters and description ≤ ~155 characters.
  - No duplicate meta tags.
  - Organization/LocalBusiness JSON-LD (Chicago) where warranted.
  - The page is in the sitemap.
  - Campaign LP and gated templates are noindexed or excluded per their role.
- **Site scope (Gate 3):**
  - Sitemap validity and robots.txt.
  - Staging is fully noindexed, and `/_showcase` is unreachable in production mode.
  - The redirect map from Phase 0 fully resolves.
  - The redirect plugin works (ask the PM to run the create/verify/delete test, since it writes data).
  - 404 handling.
  - No draft content leaks to public queries.
- **Per finding:** what's wrong + a proposed fix specific enough to hand to `block-coder` as-is.

### `dev-docs` subagent
- Maintains `docs/dev.md` (audience: the developer). Runs after each unit lands; no gate. Inserts entries under the correct page heading **in on-page order** and updates the TOC.
- Entry format: **Files** / **Fields & schema** / **Wiring** (registration, pages using it, revalidation, migration) / **Notes**.
- Also maintains these sections:
  - **Deploy**: push → staging, release → production, rollback, env var names.
  - **Integrations**: points to `INTEGRATIONS.md`.
  - **Restructure log**: what was kept and removed from the old site.
- Facts only, no editorializing.

### `marketing-docs` subagent
- Maintains `docs/marketing.md` (audience: a non-technical marketing person; explain any jargon). Runs **only after a unit clears its gates**, with the same page-ordered insertion and TOC discipline.
- Entry format:
  - **SEO**: what was set + the exact admin click-path to edit it.
  - **Editable by marketing**: what and where, including how to add, remove or reorder items.
  - **Forms & leads**: where submissions land in the admin, what gets announced to the human, what `failed` means and how to re-send.
  - **Social share.**
  - **Other.**
- Keeps a **Quick reference** table at the top current with the constant lookups: edit scarcity numbers, add a redirect, edit page copy/images, find form submissions and failed deliveries, change the booking link, send a newsletter broadcast (Resend dashboard steps), change the OG image.

## Payload conventions (binding on every subagent)

1. **Migration discipline (the most dangerous area of this stack).**
   - Dev-mode push is for local iteration only.
   - Before any commit with a schema change, generate a named migration, verify it, commit it alongside the change, and log it.
   - Staging and production only ever run committed migrations, via the deploy script, before new code serves.
   - A schema change without a committed migration fails Gate 1 automatically.
   - Migrations must be safe to run against a database with real content: never drop a column or table holding content without a human-approved data step.
2. **Types:** `payload generate:types` after every schema change. Generated types are committed. No hand-written duplicates, no `any` on Payload data.
3. **Draft/publish** on every content-facing collection. Public queries return published only. The Launch-state rule depends on this being airtight.
4. **Revalidation:** we own caching. Every publicly rendered collection or global revalidates its routes on change. An edit that needs a rebuild to appear is a Gate 1 failure (and with CI-built images, a rebuild means a redeploy).
5. **Local API first** in server components. REST is for external consumers (the content pipeline).
6. **Styling:** Tailwind, themed from the `/design-reference/` tokens. No new tokens without a Decision-log entry.
7. **Env-driven, environment-agnostic image:** the same image runs in staging and production. All behavior differences come from env (`APP_ENV`), never from build-time flags.
8. **Commits:** after each unit clears its gates, conventional-commit messages naming the unit, pushed to `main`.
9. **Uploads:** local disk, path from env. The Media collection enforces alt.

## Documentation format

`docs/dev.md` and `docs/marketing.md` each open with a one-line "how to use this doc", then a TOC linking to page headings, organized by page then by unit, **matching site structure, not build chronology**. `docs/marketing.md` opens with the Quick reference table. Skeletons are created in Phase 1 with the Homepage heading pre-seeded and Quick reference rows as `[fill in once built]`, except "Add a redirect", which is filled as soon as the redirects plugin lands.

## Manual gates (do not skip)

| Gate | When | Human reviews |
|---|---|---|
| **Gate 0** | End of Phase 0 | `DECISIONS.md`: repo inventory + restructure path, redirect map, versions, migration method, DB-less build plan, plugins, Resend/Turnstile/Nextcloud findings, the Gate 0 questions |
| **Gate S** | End of Phase 2 (and any later schema delta) | `SCHEMA.md`: collections, globals, blocks, page-section mapping, access control |
| **Gate 1** | Per unit | `qa-reviewer` report + screenshots (public + admin), editability spot-check |
| **Gate 2** | Per unit, separate from Gate 1 | `seo-auditor` unit findings + proposed fixes; the human decides what gets dispatched |
| **Gate A** | Per integration event | `automation-engineer` verification proofs, payload, signing/idempotency/failure-path evidence, env var names |
| **Page SEO** | Per page, at its last unit | `seo-auditor` page-scope report |
| **Gate K** | After all blocks clear, before Phase 4 | The complete `/_showcase` sandbox on staging, every block + variant, all viewports |
| **Gate 3** | End of Phase 5 | Full staging pass per the Phase 5 checklist, including backup/restore confirmation and the redirect map |
| **Release** | Any time after Gate 3 | Only the human orders a production release. You create the tag when told, never otherwise |

Never proceed past a gate without explicit approval. Don't auto-fix SEO findings; bring them to the human.

## File conventions

```
/                       CLAUDE.md, PROGRESS.md, DECISIONS.md, SCHEMA.md, INTEGRATIONS.md, OPS_REQUESTS.md,
                        Dockerfile, docker-compose.yml (local dev Postgres only), .env.example
/.github/workflows/     CI: build + push image on main; retag on v* release tags
/design-reference/      Claude Design handoff (read-only input; if empty, stop and ask before Phase 2)
/src/collections/       one file per collection
/src/globals/           one file per global
/src/blocks/<Name>/     config.ts + Component.tsx per block
/src/app/(payload)/     Payload admin + API routes (per pinned-version structure)
/src/app/(frontend)/    public site routes (incl. /_showcase, disabled in production)
/src/integrations/      event signing/sending, Resend contacts sync, Turnstile verify, site-error reporter
/src/seed/              idempotent, create-only seed script
/migrations/            generated, committed, logged
/docs/                  dev.md, marketing.md
/.claude/agents/        one file per subagent, generated in Phase 1 from the Roles section
```

Adapt paths to the pinned version's conventions and the restructured repo if they differ; record any change in the Decision log.

## First task

1. Read this file fully. Create nothing yet except as listed below.
2. **Inventory the repository** (Phase 0 A): stack, routes and public URLs, reusable assets/copy/components, and what looks dead. Do not modify or delete anything.
3. Check `/design-reference/` (or wherever the Claude Design handoff was placed; ask if you can't find it) and note what it contains. It must be populated before Phase 2.
4. Run `/mcp` and report the connected MCPs against the required set. List exact install steps for anything missing.
5. Do the Phase 0 B research and write `DECISIONS.md`, including the repo inventory, restructure recommendation and redirect map. Open the Phase 0 entries in `OPS_REQUESTS.md`.
6. Present Gate 0 to the human with the Gate 0 questions, and stop. Do not install, restructure, or write anything else until Gate 0 clears.