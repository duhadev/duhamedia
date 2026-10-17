# Build Progress — Duha Media (duhamedia.com)

## Current state
**Phase:** 3 — Build loop. Gate S **approved** 2026-10-17; SCHEMA.md binding
**Local dev:** `docker compose up -d` (Postgres 127.0.0.1:5433) + `pnpm dev` → http://localhost:3000, admin at /admin (test admin `test+gate@duhamedia.com`, creds in local `.env` `DEV_ADMIN_*`)
**Installed versions:** payload@3.91.0 (all @payloadcms/* 3.91.0 lockstep), next@16.3.8, react 19.2.6, pnpm 11.28.3, image node:24-alpine
**Staging:** none yet (OPS_REQUESTS #1). Image `ghcr.io/duhadev/duhamedia:sha-e061dd8…` / `:main` built + pushed by CI 2026-10-17
**Production:** old site on Vercel
**Last session ended:** — (session 1 in progress, 2026-10-17)

## Build unit status
Statuses: `queued` → `coding` → `integrated` → `gate1` → `gate2` → `rework` (note what) → `cleared` → `documented` (terminal)

| Unit type | Unit | Page(s) | Status | Notes |
|---|---|---|---|---|
| collection | C1 access helpers + `users` (roles→role, pipeline user, lockout) | all | documented | Gate 1 approved 2026-10-17 (batched w/ C2); Gate 2 n/a; dev + marketing docs done |
| collection | C2 `media` (final) + `downloads` | all, p18 | documented | Gate 1 approved 2026-10-17; alt pattern widened; Gate 2 n/a; dev + marketing docs done |
| collection | C3 `clients` | 1, 8, 15 | coding | |
| collection | C4 `team-members` | 1, 8, posts | queued | |
| collection | C5 `testimonials` (+GBP source) | 1, 7, 9, 15, 19 | queued | |
| collection | C6 `faqs` | 4, 5, 6, 11, 13, 14 | queued | |
| collection | C7 `case-studies` | 2, 3 + pulls | queued | drafts at launch; figuresApproved gate |
| collection | C8 `posts` | 13, 14, 16 | queued | pipeline user drafts only |
| collection | C9 `lead-magnets` | 18 | queued | |
| collection | C10 `pages` (shell; layout grows per block) | all | queued | |
| global | G1 `site-settings` · G2 `scarcity` · G3 `navigation` · G4 `seo-defaults` | all | queued | one unit each |
| plugin | P1 form-builder (overrides + delivery fields) · P2 redirects · P3 seo | all | queued | one unit each |
| block | 23 blocks in page build order (SCHEMA.md §8–9) | — | queued after collections/globals | appended to /_showcase on Gate 1 |
| integration | contact · newsletter (DOI) · lead_magnet · site_error | — | queued after triggering units clear | Gate A |

## Page assembly status
| Page | Blocks cleared | Page-scope SEO pass | Seeded | Notes |
|---|---|---|---|---|

## Migrations log
| Date | Migration file | What it changes | Applied in dev / staging / prod |
|---|---|---|---|
| 2026-10-17 | `src/migrations/20261017_195538_c2_media_downloads.ts` | + downloads table; media + caption, sizes browser/og; locked_documents_rels + downloads_id (down hand-fixed: drop FK before table) | scratch proofs (from-zero, down/up); dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_193341_c1_users_role.ts` | users: + name, role (enum admin/marketing/pipeline), API-key cols; data step keeps admins; drops users_roles | scratch proofs (up/down/from-zero); dev DB via same SQL / no / no |
| 2026-10-17 | `src/migrations/20261017_181819_initial.ts` | Boot scaffolding: users (+roles, sessions), media, payload_kv, locked_documents, preferences, migrations | scratch + image-check DBs only (dev uses push) / no / no |

## Releases
| Date | Tag | Ordered by human | Notes |
|---|---|---|---|

## Decision log
Append-only. New sessions: read this before asking the human anything.
| Date | Decision | Context |
|---|---|---|
| 2026-10-17 | **Gate 0 approved.** `DECISIONS.md` is binding | Human: "Gate zero is a go … phase one is a go" |
| 2026-10-17 | Pre-call homework form: block built, **event off at launch** (queued) | Gate 0 Q1 |
| 2026-10-17 | Newsletter **double opt-in: yes** (self-built confirm link) | Gate 0 Q2 |
| 2026-10-17 | Postal address for broadcasts **on hold** → blocks first broadcast, not build | Gate 0 Q3 |
| 2026-10-17 | `@marsidev/react-turnstile` approved | Gate 0 Q4 |
| 2026-10-17 | Old site had no traffic: **no redirect map**, overwrite/delete old code freely (still log removals). No old blog posts; no Neon export | Gate 0 Q5/Q7 |
| 2026-10-17 | Old privacy/terms were AI-generated → discarded; Legal pages = placeholder structure | Gate 0 Q6 |
| 2026-10-17 | Pin payload@3.91.0; switch npm → pnpm | Gate 0 Q8/Q9 |
| 2026-10-17 | Booking: **link-out** at launch. Link-out opens Nextcloud in new tab and sends original tab to `/thank-you` | Nextcloud can't be framed or redirect; option (b) |
| 2026-10-17 | Proton booking widget logged as idea only — conflicts with CLAUDE.md "site never touches Proton" | DECISIONS §M2 |
| 2026-10-17 | Design System artifact embedded at `design-reference/design-system/`; Claude Design project import pending `claude_design` MCP | `design-reference/README.md` |
| 2026-10-17 | Design precedence: **design project = gold standard**; DS artifact fills gaps (fonts/colours/type); artifact's tiers/positioning/CTA copy overridden. Merge → `design-reference/MERGED.md` | Human, after DS import |
| 2026-10-17 | Payload skills installed at `.claude/skills/` (commit 832d5bc, manual copy); CLAUDE.md/DECISIONS override them (list in DECISIONS §H). 8 subagent files in `.claude/agents/`; docs/INTEGRATIONS skeletons created | Phase 1, agent B |
| 2026-10-17 | Migrations live in **`src/migrations/`** (Payload default), not CLAUDE.md's `/migrations/` (File conventions allow adapting) | PM choice, human: "choose whatever best" |
| 2026-10-17 | pnpm **11.28.3**, not 12.x: Payload v3.91.0 templates declare `engines.pnpm ^9 \|\| ^10 \|\| ^11` | Phase 1 |
| 2026-10-17 | next pinned **16.3.8** (latest 16.3 patch; 16.4 too new / above template) | Phase 1 |
| 2026-10-17 | `/api/health` = Next route handler (not Payload endpoint) so it can return 503 when Payload init fails | Phase 1 |
| 2026-10-17 | `prodMigrations` runs at first Payload init (first request / health hit), not at process start | Phase 1; OPS #3 updated |
| 2026-10-17 | Email from-address hardcoded `no-reply@duhamedia.com` / "Duha Media" for now; revisit at Gate S (site-settings) | PM choice |
| 2026-10-17 | `next.config.ts` `agentRules: false` — Next 16.3 `next dev` appended rules to CLAUDE.md; reverted to the human's version byte-for-byte | Phase 1 incident |
| 2026-10-17 | Old-site live secrets moved `.env.local` → `.env.local.old-site` (gitignored, never committed); human to revoke Neon/Blob/old Resend keys and delete | Phase 1 |
| 2026-10-17 | **Removed old site** — full list in `docs/dev.md` → Restructure log | Phase 1 |
| 2026-10-17 | Claude Design project imported to `design-reference/project/` (87 files, sizes verified) | via claude_design MCP + Playwright |
| 2026-10-17 | Playwright MCP pinned `@playwright/mcp@0.0.83 --executable-path /usr/bin/chromium` (no Google Chrome on laptop) | human ran |
| 2026-10-17 | **Design conflicts resolved** (MERGED.md §10): design section order wins + CLAUDE.md-required sections restored (overrides CLAUDE.md locked order); page colour values win; only real facts = Lombard, IL + founder "Abdur-Rahman Ch"; pricing inline only; one-founder story; homework fields TBD; recs accepted for the rest | Human, after merge |
| 2026-10-17 | **Gold standard = red-disc page designs** (`project/*.dc.html`); all yellow/multicolour-disc DS copies (`_ds/`, Design System project + its UI-kit `index.html`, April artifact) are outdated, gap-fill only. DS project imported to `design-reference/design-system-project/` | Human |
| 2026-10-17 | SCHEMA.md drafted (11 collections + 3 plugin, 4 globals, 23 blocks / 51 variants); Gate S presented | schema-architect |
| 2026-10-17 | **Gate S approved** — SCHEMA.md binding; later schema changes need a mini Gate S | Human: "approval" |
| 2026-10-17 | Gate S Q1–Q6 → PM recommendations adopted as defaults (human may override): Q1 Work page = ledger layout + Load More + fallback; Q2 homework form visible + stores submissions, no secretary event (`sendEvent=false`), hideable in admin; Q3 newsletter issues get `/newsletter/<slug>` via article template, designed empty state pre-launch; Q4 scarcity cap counted per client; Q5 video = external host link + local poster — host = **YouTube unlisted** (confirmed by human 2026-10-17; embed via youtube-nocookie.com); Q6 Thank You copy reworded for link-out ("finish booking in the new tab…") | Gate S |
| 2026-10-17 | Pipeline user gets **no** access to its own `users` doc (stricter than SCHEMA §4.3 matrix; matches CLAUDE.md). `authenticated` alias made staff-only to close an interim media-write hole; C2 replaces it | PM, C1 |
| 2026-10-17 | `migrate:create` is interactive on enum/column renames → drive it with a pty and answer create/rename explicitly; hand-edited data steps are applied to the push-managed dev DB via the migration SQL before push | integrator, C1 |
| 2026-10-17 | Gate 2 (SEO) skipped for units with no public rendering (users, downloads admin-only, etc.); logged per unit | PM |
| 2026-10-17 | 44px touch-target rule applies to the **public site**; stock Payload admin controls are exempt. Stock admin quirks (stale key UI after role change until reload, "Unauthorized" wording, clipped meta strip at 390px) accepted, not patched | PM, C1 Gate 1 |
| 2026-10-17 | API-key widget gated by role-aware **field access** on `apiKey` (admin.condition can't hide the Auth-view widget in 3.91.0). Key issued only after saving user as Pipeline. REST key attempts on non-pipeline users now 200-with-key-stripped; hook still 400s access-skipping calls and revokes on demotion | C1 rework |
| 2026-10-17 | `payload run` fails on local Node 26 (undici "Illegal constructor"); use tsx `--env-file=.env` for scripts locally. Container uses Node 24 | C1 rework |
| 2026-10-17 | Storage: media at `${MEDIA_DIR}/media`, downloads at `${MEDIA_DIR}/downloads` (siblings) so the media route can't serve download files if downloads are ever gated. Path only, no migration | PM, C2 integrator finding |
| 2026-10-17 | Missing upload file → Payload returns 500 (stock 3.91.0). `site_error` unit must ignore or rate-limit missing-file errors so broken image links can't flood the secretary; seo-auditor site pass to check | C2 integrator finding |
| 2026-10-17 | SVG uploads stay allowed in `media` (`image/*`; Payload 3.91.0 runs its own SVG safety check on upload; uploads are staff-only) | Human |
| 2026-10-17 | Accepted stock Payload admin quirks (C2 QA): list thumbnail `<img alt>` = filename; "Edit Image" (crop/focal) hidden below tablet width in admin; `/favicon.ico` 404 on admin pages (frontend icon is `(frontend)/icon.svg`) — revisit favicon when the layout lands | PM |
| 2026-10-17 | **Gate 1 approved: C1 users, C2 media+downloads** (Gate 2 n/a) | Human: "approve" |
| 2026-10-17 | C3–C6 built by one schema-architect dispatch, strictly one unit after another with a report per unit (independent small collections) | PM |
| 2026-10-17 | Local Postgres image provisional `postgres:17-alpine` until server major is known; local port 5433 | OPS #6 open |

## Session handoff
- **In flight:** nothing. First CI run green (~5 billed min/push).
- **Next up:** session restart (MCPs) → import Claude Design project → write `design-reference/MERGED.md` → Phase 2 (schema-architect → SCHEMA.md → Gate S).
- **Blockers:** OPS_REQUESTS #1–#6 unanswered; postal address (first broadcast only).
