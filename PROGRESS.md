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
| collection | C3 `clients` | 1, 8, 15 | documented | Gate 1 approved 2026-10-17; Gate 2 n/a; dev + marketing docs done |
| collection | C4 `team-members` | 1, 8, posts | documented | Gate 1 approved 2026-10-17; Gate 2 n/a; dev + marketing docs done |
| collection | C5 `testimonials` (+GBP source) | 1, 7, 9, 15, 19 | documented | Gate 1 approved 2026-10-17; Gate 2 n/a; dev + marketing docs done |
| collection | C6 `faqs` | 4, 5, 6, 11, 13, 14 | documented | Gate 1 approved 2026-10-17; Gate 2 n/a; dev + marketing docs done |
| collection | C7 `case-studies` | 2, 3 + pulls | documented | Gate 1 approved 2026-10-17; dev + marketing docs done; (cosmetic: a few fields still auto-labelled — later sweep); server-side unique slug applied 2026-10-17 (9/9 smoke); coded 43/43; migration c7 proven; reworks verified (errors together, labels, "1 Result", day-only date); awaiting human Gate 1; revalidation of /work + /work/<old|new slug> proven in a real request (PM); QA next; testimonials.caseStudy added; drafts at launch; figuresApproved gate; **+ add `testimonials.caseStudy` rel (own migration)** |
| collection | C8 `posts` | 13, 14, 16 | documented | Gate 1 cleared 2026-10-17 under standing approval: QA core pass; reworks verified in browser by PM (accent inline error posts+case-studies, FAQ question labels; badge +1 per failing group/array is stock); dev + marketing docs done; pipeline user drafts only; **slug must auto-generate server-side for REST creates** (slugField only fills in the admin UI; REST create without slug fails) |
| collection | C9 `lead-magnets` | 18 | documented | Gate 1 cleared 2026-10-17 under standing approval (QA all 9 checks pass; accepted: slug 'required' shown on empty publish until a title exists, stale file error beside the link error after a failed publish); dev + marketing docs done; form rel TODO(P1), SEO TODO(P3) |
| collection | C10 `pages` (shell; layout added with first block) | all | documented | Gate 1 approved by human 2026-10-18; dev + marketing docs done; live revalidation deferred to first block; rich-text internal links + linkField→pages done; **third checkpoint: human Gate 1 + held questions** | **+ enable FAQ answer internal links to pages** (editor config) |
| delta | S1 mini Gate S delta: lead-magnet gating + whatsInside heading + drafts-only marketing delete (posts, lead-magnets, pages) + `downloads` staff-only read (2026-10-21) | 8, 13, 14, 16, 18 + all | cleared | 87/87 smoke; migration proven; heading field verified in browser by PM 2026-10-21; anonymous `/api/downloads` and `/file/*` → 403; dev-docs next |
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
| 2026-10-18 | `src/migrations/20261018_053136_s1_lead_magnet_heading.ts` | + nullable `whats_inside_heading` varchar DEFAULT 'What''s inside' on lead_magnets and _lead_magnets_v | scratch proofs; dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_223525_c10_pages.ts` | + pages, `_pages_v`, header/footer/status enums; nullable pages_id on case_studies_rels, _case_studies_v_rels, posts_rels, _posts_v_rels, locked rels (down hand-fixed) | scratch proofs; dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_221725_c9_lead_magnets.ts` | + lead_magnets (+value_bullets) and `_v` tables, status enums, FK to downloads; nullable lead_magnets_id on case_studies_rels, _case_studies_v_rels, posts_rels, _posts_v_rels, locked rels (down hand-fixed) | scratch proofs; dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_215325_c8_posts.ts` | + posts (+rels, faq, diy facts, fallback metrics) and `_v` tables, enums; posts_id on case_studies_rels(+_v) and locked rels (down hand-fixed) | scratch proofs; dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_210942_c7_case_studies.ts` | + case_studies (+rels, results rows) and `_v` tables, enums; testimonials.case_study_id; locked rels col (down hand-fixed). One FK name auto-truncated to 63 chars (harmless) | scratch proofs; dev via push / no / no |
| 2026-10-17 | `src/migrations/20261017_202453_c3_c6_clients_team_testimonials_faqs.ts` | + clients, team_members(+socials), testimonials, faqs and their `_v` version tables, enums, FKs; locked_documents_rels cols (down hand-fixed: FKs before tables) | scratch proofs; dev via push / no / no |
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
| 2026-10-17 | Conditional required fields use custom `validate` (types stay optional; admin shows "Required for …" text, no asterisk). Drafts collections use `drafts.validate: false` → "required" = required to publish | schema-architect C3–C6 |
| 2026-10-17 | FAQ answer editor restricted to paragraphs/bold/italic/lists/links (default Lexical Relationship/Upload could reference any collection incl. users) | schema-architect C6 |
| 2026-10-17 | Shared helpers: `src/fields/index.ts` (contentVersions, sortOrderField, https/YouTube validators), `src/lib/youtube.ts`, `staffContentAccess`. §3 block factories come with the first block that needs them | schema-architect C3–C6 |
| 2026-10-17 | C3–C6 share **one** migration (all additive, built together) | PM |
| 2026-10-17 | Revalidation helper `src/hooks/revalidateTag.ts`: `revalidateTag(tag,'max')` (Next 16 signature); fires on publish/unpublish/delete, skipped with `context.disableRevalidate`; swallows the outside-Next invariant. Seed script must pass `disableRevalidate: true` | integrator C3–C6 |
| 2026-10-17 | Payload's generated `down()` drops tables before FKs → hand-fix every migration that adds a collection | integrator |
| 2026-10-17 | **Incident (local dev only):** integrator's script deleted dev admin (id 1) by email collision; recreated as id 7 from `.env` DEV_ADMIN_*. Rule for all agents: throwaway users use unique `test+gate-<purpose>@duhamedia.com` addresses and are deleted by returned id only, never by email | PM |
| 2026-10-17 | C3–C6 Gate 1 QA: all 9 checks pass ×4. Fixing D8 (socials row labels). Accepted: D1 no asterisk on conditional-required (descriptions say so), D2/D3/D4/D9 stock layout/autosave (Create New makes a blank draft; edit right before failed publish may not autosave), D5 Lexical console warning, D10 single link type until C10. D6 frontend CSS preloaded in admin + D7 favicon → fix with frontend layout | PM |
| 2026-10-17 | **Gate 1 approved: C3 clients, C4 team-members, C5 testimonials, C6 faqs** (Gate 2 n/a; D8 row-label fix verified in browser by PM) | Human: "approve" |
| 2026-10-17 | Case studies: `readTime` auto-filled at publish only when empty (clear to recalculate); `slugField()` used though marked experimental in 3.91.0 (SCHEMA requires); optional links require text+destination only once partly filled | schema-architect C7 |
| 2026-10-17 | Shared helpers added: `metricFields`, `linkField` (polymorphic; more targets as C8–C10 land), `validateAccentPhrase`, `setPublishedAtOnPublish`, `lexicalText` (word count/read time), `revalidateTagHooks(tag,{paths})` | schema-architect C7 |
| 2026-10-17 | Integrator/schema agents can't reach the human's Playwright session → browser-based proofs are run by the PM (or qa-reviewer) | PM |
| 2026-10-17 | C7 Gate 1 QA: core checks pass. Rework: figures check as field validation (all errors in one attempt) + short tooltip, Published At column/sort, explicit labels. Accepted stock: array-level and row-cell errors show no inline text (toast names the field); story image caption reachable only via Edit Relationship (document in marketing guide); 390px admin overflow/tab height | PM |
| 2026-10-17 | **Convention:** publish rules are field `validate` functions (reported with all other errors); collection `beforeChange` hooks must not throw validation errors; any backstop goes in `afterChange` (runs in the transaction, rolls back). Applies to posts, pages, lead-magnets | C7 rework |
| 2026-10-17 | Smoke scripts pass a fresh `context` object per Local API call (`restoreVersion` mutates context) | C7 rework |
| 2026-10-17 | Admin list for case studies: `defaultSort ['-_status','-publishedAt']` (no nulls-last in Drizzle) → published first, then drafts | C7 rework |
| 2026-10-17 | C7 re-check: error flow + labels pass. Accepted: admin list honours a user's saved sort over `defaultSort` (fresh users get published-first); Payload's "shorter than the max length of 160" wording; approval column shows true/false chips; possible autosave overwrite at automation speed only (unconfirmed for humans). Fixing: rows labels ("Results"), publishedAt day-only display | PM |
| 2026-10-17 | **Gate 1 approved: C7 case-studies (+ testimonials.caseStudy)** (Gate 2 deferred to template/blocks) | Human: "approve" |
| 2026-10-17 | **Standing approval (human):** Gate 1 pre-approved for the next two units — C8 `posts` and C9 `lead-magnets` — provided QA passes and findings are reworked + re-verified as usual. Anything needing human input is deferred and batched to the **third checkpoint (C10 `pages` gate)**. Not covered: schema deltas needing a mini Gate S, production/credentials/DNS, new dependencies — those are held for C10 too | Human |
| 2026-10-17 | **Security fix (C8):** in 3.91.0 updates match a doc's latest version, so the pipeline's draft rule could match a published post with a staff draft on top and unpublish it. Guard `forbidPipelineOnPublished` (reads live row → 403) + `pipelineNeverPublishes` afterChange backstop. C1 comment corrected | schema-architect C8 |
| 2026-10-17 | Slug root cause: `slugField()` writes the slug from a parallel field hook after the required check reads it. `src/hooks/uniqueSlug.ts` fills/uniquifies server-side (`-2`, `-3`…); explicit colliding slugs still 400. **Apply to case-studies too** (small rework after C8 integration) | schema-architect C8 |
| 2026-10-17 | Pipeline should always send `?draft=true` (documented for the content pipeline) | C8 |
| 2026-10-17 | **Deferred to C10 checkpoint (human):** the pipeline can READ a staff draft sitting on top of a published post (cannot write it). Matches SCHEMA "pipeline reads drafts"; tighten? | C8 |
| 2026-10-17 | Open (moved to router unit): renaming/unpublishing a post/lead-magnet/page linked from a case study doesn't purge `/work/<slug>`; solve with tag-based fetching in the router/blocks (no effect while frontend is force-dynamic) | integrator C8 |
| 2026-10-17 | **Deferred to C10 checkpoint (human):** marketing can delete *published* posts (case studies block this). Neither SCHEMA nor CLAUDE.md requires it for posts — keep or align? | C8 dev-docs |
| 2026-10-17 | C8 QA accepted stock: stale tab badges until next attempt; Sections/FAQ tabs appear only once a track is picked (no default track, by SCHEMA); newsletter issues hide Sections too; autosave can leave empty required FAQ rows in a draft | PM |
| 2026-10-17 | Accent-phrase check also runs in the browser (custom `AccentPhraseField` passes `validate`), because Payload strips custom validators from the client config and server-only errors on custom-validated fields could be lost | C8 rework |
| 2026-10-17 | **Deferred to C10 checkpoint (human):** lead-magnet download reachable without the form — public API returns `asset.file`/`externalUrl` + delivery email text (matches SCHEMA §4.3/§6.10 "files are not secret"). Gate it? (fix = staff-only field read on `asset`/`deliveryEmail`; mini Gate S, no DB change) | schema-architect C9 |
| 2026-10-17 | **Deferred to C10 checkpoint (human):** lead-magnet "What's inside" heading is fixed template text (no SCHEMA field). Make it editable? | schema-architect C9 |
| 2026-10-17 | Marketing can delete published lead magnets too — folds into the C8 posts deletion question for C10 | C9 |
| 2026-10-17 | Frontend rule: public lead-magnet/post/case-study queries use `draft: false` (SCHEMA §5.2); `draft: true` with a newer staff draft returns 404 to the public | C9 |
| 2026-10-17 | Block/route checklist item: any frontend that reads a linked doc's title/slug via `linkField` must fetch with that collection's tag (case-studies, posts, lead-magnets) so renames refresh | integrator C9 |
| 2026-10-17 | Transient `InvalidFieldRelationship ... 'posts'` (6× in dev log, 16:40–16:5x) = hot-reload window while C8 added `posts` to linkField before registering Posts; not recurring | PM |
| 2026-10-17 | When P2 redirects lands: update the slug-change notes in docs/marketing.md (posts, case studies, lead magnets) to link the redirect how-to | PM |
| 2026-10-17 | Pages slug rules (PM): `home`→`/`, `404`→not-found doc; reserved: `work/…`, `insights/…`, `newsletter/…`, `resources/…`, `admin`, `api`, any `_` segment (e.g. `_showcase`), `home/…`, `404/…`. Hubs `work`, `newsletter` allowed. Slug-rule errors show in the toast only (Payload SlugField has no client validate) — accepted | schema-architect C10 |
| 2026-10-17 | **Superseded:** payload@3.91.0 admin cannot render a blocks field with `blocks: []` (client config drops `blocks` when empty; `buildClientFieldSchemaMap` calls `.map` on undefined). `pages.layout` stays OUT of the config until the first block clears; the integrator re-adds it via exported `pageLayoutField([...])` (required, minRows 1, zero-leakage NewsletterBand check) with its own migration. Until then pages can publish without sections (nothing renders them yet). NewsletterBand block must use slug `newsletterBand` (zero-leakage check) | C10 |
| 2026-10-17 | Rich-text internal links: `richTextLinkFeature()` (LINK_TARGETS: case-studies, posts, lead-magnets, pages) on FAQ answers, case-study and post editors | C10 |
| 2026-10-17 | Folds into C10 deletion question: marketing can delete published pages incl. `home` and `404` | C10 |
| 2026-10-17 | Router unit checklist: frontend `[...slug]` + `not-found.tsx` (reads `404` doc) must fetch via the `pages` tag; wire live preview/draft mode for pages, posts, case-studies, lead-magnets with URLs from server-side `SITE_URL` via `pagePath`; 404 or 301 `/home` | integrator C10 |
| 2026-10-17 | Lesson: an HTTP 200 on an admin view doesn't prove the form rendered — admin render checks must look at the page (browser) or the dev log | PM, C10 |
| 2026-10-17 | C10 QA notes: a rejected publish leaves the invalid slug in the autosaved draft (published version unaffected); a republish can show "Changed" from an identical autosave (stock); internal-link picker showed only Pages during QA (config lists all 4 targets; re-check once real content exists) | PM |
| 2026-10-18 | **Gate 1 approved: C10 pages** | Human: "approve recs" |
| 2026-10-18 | **Mini Gate S approved (held questions):** (1) lead magnets — `asset` and `deliveryEmail` hidden from public/pipeline reads (staff-only field read; delivery job uses overrideAccess); (2) lead magnets — editable "What's inside" heading field; (3) marketing may delete **drafts only** on posts, lead-magnets and pages (admin any), matching case-studies; (4) pipeline keeps read access to staff drafts on its own posts (no change) | Human: "approve recs" |
| 2026-10-18 | **Open for human:** uploaded lead-magnet files remain publicly listable/fetchable via `downloads` (read public per SCHEMA §6.10), so the S1 gate only fully hides external-URL assets | schema-architect S1 |
| 2026-10-18 | Frontend rule: generated types still mark `lead-magnets.asset`/`deliveryEmail` as present — public-facing code must treat them as absent (field read access strips them) | schema-architect S1 |
| 2026-10-21 | **Mini Gate S approved: `downloads` read = staff only** (option a). Lead-magnet files are delivered as an **email attachment** by the lead_magnet integration (server-side, `overrideAccess`); no public `/api/downloads` list or file URL. Closes the 2026-10-18 open item | Human: "I choose A" |
| 2026-10-21 | Gate 1 standing approval for globals G1–G4 not given: present each global's gate | PM default; human unanswered |
| 2026-10-17 | Local Postgres image provisional `postgres:17-alpine` until server major is known; local port 5433 | OPS #6 open |

## Session handoff
- **In flight:** S1 schema delta (mini Gate S approved), then globals G1–G4.
- **Next up:** session restart (MCPs) → import Claude Design project → write `design-reference/MERGED.md` → Phase 2 (schema-architect → SCHEMA.md → Gate S).
- **Blockers:** OPS_REQUESTS #1–#6 unanswered; postal address (first broadcast only).
