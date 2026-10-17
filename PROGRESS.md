# Build Progress — Duha Media (duhamedia.com)

## Current state
**Phase:** 1 — Restructure & pipeline foundation: boot checklist PASSED 2026-10-17; committed + pushed
**Local dev:** `docker compose up -d` (Postgres 127.0.0.1:5433) + `pnpm dev` → http://localhost:3000, admin at /admin (test admin `test+gate@duhamedia.com`, creds in local `.env` `DEV_ADMIN_*`)
**Installed versions:** payload@3.91.0 (all @payloadcms/* 3.91.0 lockstep), next@16.3.8, react 19.2.6, pnpm 11.28.3, image node:24-alpine
**Staging:** none yet (OPS_REQUESTS #1). Image `ghcr.io/duhadev/duhamedia:sha-e061dd8…` / `:main` built + pushed by CI 2026-10-17
**Production:** old site on Vercel
**Last session ended:** — (session 1 in progress, 2026-10-17)

## Build unit status
Statuses: `queued` → `coding` → `integrated` → `gate1` → `gate2` → `rework` (note what) → `cleared` → `documented` (terminal)

| Unit type | Unit | Page(s) | Status | Notes |
|---|---|---|---|---|
| — | (queued after Gate S) | | | |

## Page assembly status
| Page | Blocks cleared | Page-scope SEO pass | Seeded | Notes |
|---|---|---|---|---|

## Migrations log
| Date | Migration file | What it changes | Applied in dev / staging / prod |
|---|---|---|---|
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
| 2026-10-17 | Local Postgres image provisional `postgres:17-alpine` until server major is known; local port 5433 | OPS #6 open |

## Session handoff
- **In flight:** nothing. First CI run green (~5 billed min/push).
- **Next up:** session restart (MCPs) → import Claude Design project → write `design-reference/MERGED.md` → Phase 2 (schema-architect → SCHEMA.md → Gate S).
- **Blockers:** OPS_REQUESTS #1–#6 unanswered; postal address (first broadcast only).
