# SCHEMA — Duha Media (duhamedia.com)

**Status: PROPOSAL for Gate S** (Phase 2, written 2026-10-17 by `schema-architect`). Nothing under `src/collections/`, `src/globals/` or `src/blocks/` exists yet beyond boot scaffolding. Once the human approves, this file is binding; any later delta needs a mini Gate S, a generated migration and a types run.

**Inputs used:** `CLAUDE.md` (pages 1–21, schema baseline, rules), `DECISIONS.md` (Gate 0 approved; §G media, §I plugins, §J jobs, §M/M2 booking, §Q answers), `PROGRESS.md` Decision log, `design-reference/MERGED.md` (§7 page map, **§10 Resolutions — binding, overrides CLAUDE.md where they conflict**), the final `design-reference/project/*.dc.html` files (section labels = `data-screen-label`), `SiteHeader*.dc.html`, `SiteFooter*.dc.html`, and the boot scaffolding `src/collections/Users.ts`, `src/collections/Media.ts`, `src/access/roles.ts`.

**Citation shorthand:** `p7` = CLAUDE.md page 7. `p7 §Testimonial feed` = the section with that `data-screen-label` in that page's final design file (§7 of MERGED.md names the file). `R#` = MERGED.md §10 resolution number. `D§x` = DECISIONS.md section.

---

## 0. Verification record (Payload 3.91.0)

Every non-obvious API below was checked against the **installed** `node_modules/payload@3.91.0` type definitions, or against GitHub at tag **`v3.91.0`** for plugins not yet installed. Never `main`.

| API used | Verified where | Note |
|---|---|---|
| `auth.maxLoginAttempts`, `auth.lockTime` (ms), `auth.useAPIKey` (`{ reveal?: boolean }`, reveal defaults false), `auth.tokenExpiration`, `auth.useSessions` | `payload/dist/auth/types.d.ts` (3.91.0) · https://payloadcms.com/docs/v3/authentication/overview · https://payloadcms.com/docs/v3/authentication/api-keys | Names confirmed for 3.91.0 |
| `hooks.beforeLogin` `({ collection, context, req, user })` | `payload/dist/collections/config/types.d.ts:164` · https://payloadcms.com/docs/v3/hooks/collections | Used to block interactive login for the pipeline user |
| `versions.drafts` `{ autosave, schedulePublish, validate }`, `versions.maxPerDoc` | `payload/dist/versions/types.d.ts:33-57,97` · https://payloadcms.com/docs/v3/versions/drafts | `drafts.validate` defaults **false** → required fields are enforced on publish only. Relied on below |
| `slugField(args)` (`useAsSlug`, `slugify`, `position`, `required`, `overrides`) | `payload/dist/fields/baseFields/slug/index.d.ts`, exported from `payload` | Returns a row field (slug + `generateSlug` checkbox) |
| Relationship / upload `maxDepth`, `filterOptions`, `hasMany`, `minRows`/`maxRows`; array `minRows`/`maxRows`; select `enumName`; `virtual` | `payload/dist/fields/config/types.d.ts` · https://payloadcms.com/docs/v3/fields/relationship · https://payloadcms.com/docs/v3/fields/upload · https://payloadcms.com/docs/v3/fields/blocks | |
| `type: 'ui'` field (custom admin component, e.g. re-send button) | `fields/config/types.d.ts:686` · https://payloadcms.com/docs/v3/fields/ui | |
| Upload `staticDir`, `mimeTypes`, `focalPoint`, `imageSizes`, `filesRequiredOnCreate` | `payload/dist/uploads/types.d.ts` · https://payloadcms.com/docs/v3/upload/overview | |
| Collection `defaultPopulate`, `enableQueryPresets`, `baseFilter`, `trash`, `orderable` | `collections/config/types.d.ts:247,486,507,598,615` · https://payloadcms.com/docs/v3/query-presets/overview | **`orderable` is marked `@experimental` in 3.91.0 → not used** (explicit `sortOrder` numbers instead). `trash` not used (drafts + delete access already cover it) |
| Local API `context` → `req.context`; REST requests start with `context: {}` | `payload/dist/utilities/createLocalReq.js:5-18`, `utilities/createPayloadRequest.js:55` · https://payloadcms.com/docs/v3/hooks/context | A REST caller **cannot** set `req.context`, so a context flag is an unforgeable server-only gate (used for Turnstile) |
| Lexical `UploadFeature({ collections: { media: { fields } }, maxDepth })` | `packages/richtext-lexical/src/features/upload/server/index.ts` @ v3.91.0 · https://payloadcms.com/docs/v3/rich-text/official-features | Figure captions ("Fig. 1 — …") as upload-node sub-fields |
| form-builder options `fields` (checkbox, country, date, email, message, number, payment, select, state, text, textarea, upload), `formOverrides`, `formSubmissionOverrides`, `redirectRelationships`, `beforeEmail`, `defaultToEmail`, `uploadCollections` | `packages/plugin-form-builder/src/types.ts` @ v3.91.0 · https://payloadcms.com/docs/v3/plugins/form-builder | **Default submission access is `create: () => true` and `read: any logged-in user`** (`src/collections/FormSubmissions/index.ts` @ v3.91.0). Both are overridden below; overrides merge shallowly per key; override hooks run after the plugin's `sendEmail` |
| plugin-redirects options `collections`, `overrides`, `redirectTypes` (`'301'|'302'|'303'|'307'|'308'`), `redirectTypeFieldOverride` | `packages/plugin-redirects/src/types.ts`, `redirectTypes.ts` @ v3.91.0 · https://payloadcms.com/docs/v3/plugins/redirects | |
| plugin-seo options `collections`, `globals`, `uploadsCollection`, `tabbedUI`, `fields`, `generateTitle`/`Description`/`URL`/`Image`, `interfaceName` | `packages/plugin-seo/src/types.ts` @ v3.91.0 · https://payloadcms.com/docs/v3/plugins/seo | |

Skill overrides applied (DECISIONS §H): Postgres not Mongo; `MEDIA_DIR` not `'media'`; no localization; only approved plugins; roles `admin`/`marketing`/pipeline (never `editor`, never `authenticatedOrPublished`); `generate:types` run after every change.

---

## 1. Summary

| | Count | Items |
|---|---|---|
| Collections (ours) | **11** | `pages`, `case-studies`, `posts`, `testimonials`, `clients`, `team-members`, `faqs`, `lead-magnets`, `media`, `downloads`, `users` |
| Collections (plugins) | **3** | `forms`, `form-submissions` (form-builder), `redirects` (redirects) |
| Globals | **4** | `site-settings`, `scarcity`, `navigation`, `seo-defaults` |
| Blocks | **23** | see §8 |
| Block variants | **51** | variants are a `variant` select on one block; never a forked component |
| Page-level (non-block) features | 4 | `readingProgress` flag, `headerVariant`, `footerVariant`, `zeroLeakage` |

### 1.1 Deviations from the CLAUDE.md baseline (each argued in its section)

| # | Baseline | Proposal | One-line reason |
|---|---|---|---|
| X1 | `services` collection (pages 4, 5, 6) | **Dropped.** Service pages are `pages` docs; deliverables/components are `SpecLedger` block items | No page lists services dynamically; every service string appears once (p5 D-01…D-07, p6 E-01…E-06), so a collection would be a second source of truth (§2.4) |
| X2 | `pages.hero` fields | **Hero is the first `layout` block**, not a fixed group | p17 (Link-in-Bio), p20 (Legal), p21 (404) have no hero; p15 swaps VSL/static; p5/p6 heroes carry a breadcrumb rail. A block with a `variant` covers all; a fixed group would be empty on 3 pages |
| X3 | Blocks `ScarcityStrip`, `ClientLogoStrip` | **Merged into `ProofStrip`** (scarcity or metrics + logos) | The design merges them into one section on both pages that have them: p1 §Proof strip (scarcity + 6 names) and p15 §Proof strip (metrics + 2 names) |
| X4 | Block `VideoTile` | **Shared component, not a block** | No design section is a standalone video tile; video only appears inside p7 §Testimonial feed, p2 §Client voice and p15 Hero A. As a block it would be an orphan |
| X5 | Block `MapEmbed` | **Replaced by `DirectContact`** (direct info + map in one block) | p12 desktop §"Direct info + map" and mobile §"Direct line" are one section containing both; the map is used nowhere else |
| X6 | Block `ReadingProgress` | **Page-level flag** (`pages.readingProgress`), always-on in the case-study and post templates | It is not a section; it is a fixed 4px left-edge bar (R10, `site-fx.js readingProgress`) |
| X7 | — | **New block `SpecLedger`** | p5 §Template anatomy, §Specification; p6 §Signal flow, §Channel specification, §Camera work; p18 §What's inside. No baseline block fits a coded deliverable ledger |
| X8 | — | **New block `PostList`** | p16 §Sample content (Latest issue + "Previously" rows + archive link) lists `posts`, which `CaseStudyCards` cannot |
| X9 | — | **New collection `downloads`** (non-image upload) | p18 lead-magnet asset is a PDF/worksheet; `media` is image-only with required alt and image sizes (D§G) |
| X10 | `faqs` "placement rels" | **Selection lives on the `AccordionFAQ` block** (ordered `hasMany` to `faqs`); `faqs` gets `listOnFaqPage` | A reverse rel cannot carry per-page order; p4 §FAQ mini "I already have a store. Which door?" is mini-only, p11 lists by category |
| X11 | Post FAQ via `faqs` | **Posts carry an inline `faq` array** | The pipeline user may only write `posts` (CLAUDE.md), and p13/p14 FAQs are keyword-specific ("What does Shopify development cost in Chicago?") |
| X12 | `users.roles` (hasMany, scaffolding) | **Single `role` select**: `admin` / `marketing` / `pipeline` | Roles are mutually exclusive (pipeline must never also be admin); a single value makes every access check unambiguous. Safe now: only dev data exists (§6.11) |
| X13 | `deliveryStatus` always stamped | **Empty when the form has no event configured** | p9 homework form's event is off at launch (Gate 0 Q1); stamping `pending` forever would pollute the failed/pending view |
| X14 | `testimonials.type` | Named **`format`** (`text` / `video`) plus **`source`** | `type` collides conceptually with `blockType`/event `type`; `source` is the Gate S GBP decision (§2.2) |

---

## 2. Gate S decisions (the open questions CLAUDE.md leaves to Gate S)

### 2.1 `posts` stays ONE collection for three tracks — **decided: yes**
- Shared shape covers almost everything: title, slug, dek, body, publish date, author, SEO, newsletter/final-CTA closers (p13 §Article header/§Article body, p14 same, p16 §Sample content issue rows all have title + date + excerpt).
- Track-specific fields are few and use `admin.condition` on `track`: `diyBridge`, `howWeDoIt`, `educational`, `proof`, `faq` (dev-seo / mkt-seo); `issueNumber`, `issueMetric`, `sentAt` (newsletter-issue).
- The pipeline user's access is "drafts in `posts` only" (CLAUDE.md). Splitting issues into a second collection would either widen that grant or block the pipeline from drafting issues.
- Splitting would only pay off if issues had a radically different page; they have **no designed detail page** at all (open question Q3).

### 2.2 GBP-style reviews (p19) **merge into `testimonials` with a `source` field — decided**
- p7 §Testimonial feed interleaves video testimonials, written quotes and "Google review" cards in **one** Load-More feed; p19 §Review wall interleaves Google reviews, quotes and client names in one staggered wall. One collection = one ordered, paginated query. Two collections would need a hand-merged union for Load More.
- They share one DS component (`Testimonial`: quote, name, role, stars, source tag). R6 makes the source label and stars data, not hard-coded → `source` + `rating` fields.
- p19 hero: "Everything on this page lives somewhere you can verify it — Google, LinkedIn, or a client you can call" → `source` options `google-review` / `linkedin` / `direct`, with `sourceUrl` for the verifiable ones and `verbatim` required for Google ("pulled verbatim from Google at launch, never paraphrased", p7/p19 placeholders).

### 2.3 `team-members` stays a **collection — decided** (not a global)
- There is one founder today (R17 "One founder, no layers"; R5 the only real name is "Abdur-Rahman Ch").
- But p13/p14 §Article header byline "By [Author], Duha Media" needs a **public relationship target**. Users are private auth docs and must never be publicly readable. A global cannot be a relationship target.
- p1 §Founder (2nd) and p8 §Founder render the same person; a collection doc is reused by both via `TeamIntro.member`.
- Cost is small (5 fields). A future hire needs no schema change.

### 2.4 `services` collection — **argued against, dropped (X1)**
- p4 §Two doors: "Shopify Theme Development / For no store, or one that isn't working…" ; p1 §What we do: "First, we build it. A Shopify store that converts…"; p5 §Dev hero: "The store build — Six steps from a broken store…". Three different copies for the same service: nothing is reused verbatim, so a central doc would not remove duplication.
- p5 §Specification D-01…D-07 and p6 §Channel specification E-01…E-06 appear on one page each. They live as `SpecLedger.items`.
- Only overlap: p6 §Signal flow repeats the six E-codes/titles of §Channel specification on the same page (6 short labels edited on the same admin screen). Accepted.
- Case studies are filtered by track via `case-studies.track` (select), which is all the "Proof" sections on p5/p6 need.

### 2.5 FAQ placement (X10/X11)
- `AccordionFAQ.source = category` (p11, one block per category group) or `selected` (ordered `hasMany` → `faqs`, for p4/p5/p6 mini blocks).
- `faqs.listOnFaqPage` (default true) keeps mini-only questions off p11.
- Posts (p13/p14) render their own inline `faq` array through the same `AccordionFAQ` component.

---

## 3. Shared field factories (one definition, reused)

| Factory | Fields | Used by | Why |
|---|---|---|---|
| `linkField({ name })` | group: `type` select (`internal` / `custom`, default internal) · `reference` relationship → `pages`, `case-studies`, `posts`, `lead-magnets` (**maxDepth 1**, condition internal) · `url` text (condition custom; validate `https://`, `mailto:` or `/`-relative) · `label` text required · `newTab` checkbox | every CTA/link field | Internal links resolve to real Next `Link` routes (seo-auditor unit rule) and survive slug changes |
| `pricingNote()` | text, `maxLength: 80`, single line. Description: "Small inline note only, e.g. 'Builds start at $5K'. Never put a price in a headline or metric." | Hero, TwoTrackPanels panels, SpecLedger, CaseStudyCards fallback | CLAUDE.md rule 5 + R13: prices only as small inline notes. There is **no price field anywhere else**, and **no pricing block** exists |
| `metricFields()` | `value` text required (description: "A result or count, never a price") · `label` text required · `sub` text (quiet line) · `accent` checkbox | ProofStrip, MetricEvent, CaseStudyCards fallback, case-study `headlineMetric` | "Metrics are typographic events" (CLAUDE.md context); DS `Metric` = value/label/sub/accent (MERGED §4.1). Structured, never prose |
| `scarcityRef()` | select of the scarcity statement keys (§7.2) + `none` | FinalCTA, OfferBlock, ProofStrip, LinkStack | One edit place for capacity (CLAUDE.md `scarcity` global). Blocks hold **no** scarcity numbers themselves |
| `headlineFields()` | `heading` text required · `accentPhrase` text (validate: must be a substring of `heading`, case-insensitive) | most blocks | DS `AccentHeadline` (MERGED §4.1): "only one accent word or phrase per headline" (§2.2 type rules) |
| `eyebrowField()` | `eyebrow` text · `eyebrowTick` checkbox | most blocks | DS `Eyebrow` `tick`/`muted` used on nearly every section |

Field conventions: camelCase names; every relationship and upload declares `maxDepth`; selects wherever options are enumerated; `localized` is never set; long Postgres enum names get an explicit `enumName` (Postgres 63-char identifier limit; the integrator confirms in the generated migration).

---

## 4. Access model

### 4.1 Roles (`users.role`, `saveToJWT: true`)

| Role | Who | Can | Cannot |
|---|---|---|---|
| `admin` | the human | everything, incl. users, forms definitions, submissions delete, jobs | — |
| `marketing` | marketing person | create/update/delete all content collections and globals, redirects, media/downloads; read submissions + use re-send | manage users (except own name/password); edit `forms` definitions (field names are the integration contract); delete **published** case studies; delete submissions; see jobs |
| `pipeline` | the external content pipeline, API key only | `posts`: create, read, update **while `_status = draft`** | publish, delete, read versions, log in interactively, touch any other collection or global |

Public (no user): read **published** docs of content collections, read media/downloads files, read globals, create form submissions **only via the Turnstile-verified server path**.

### 4.2 Access helpers (`src/access/`)
- `isAdmin`, `isMarketing`, `isStaff` (= admin or marketing), `isPipeline`. Role from `req.user.role`; unknown/absent role = no access.
- `publishedOrStaff`: staff → `true`; else → `{ _status: { equals: 'published' } }`. (Pipeline gets nothing from this helper.)
- `staffOnly`, `adminOnly`.
- `turnstileVerifiedOrAdmin`: `req.context.turnstileVerified === true || isAdmin`. The flag is set only by the server-side form handler after siteverify passes (§6.12); REST callers start with `context: {}` and cannot forge it (verified, §0).

### 4.3 Matrix

| Collection / global | read | create | update | delete | Other |
|---|---|---|---|---|---|
| pages, testimonials, clients, team-members, faqs, lead-magnets | `publishedOrStaff` | staff | staff | staff | `readVersions`: staff |
| case-studies | `publishedOrStaff` | staff | staff | admin: any · marketing: `{ _status: { not_equals: 'published' } }` | `readVersions`: staff. Publish also requires `figuresApproved` (hook) |
| posts | staff: all · pipeline: `{ _status: { equals: 'draft' } }` · public: published | staff, pipeline (hook forbids publish) | staff · pipeline: `{ _status: { equals: 'draft' } }` (hook forbids publish) | staff | `readVersions`: staff |
| media, downloads | `true` (files are public at `/api/<slug>/file/…`) | staff | staff | staff | |
| users | admin: all · marketing: self · pipeline: none *(erratum 2026-10-17, PM: stricter than original "others: self")* | admin | admin; self (not `role`, not API-key fields) | admin | `admin` (panel access): staff only · `unlock`: admin |
| forms | staff (definitions contain notification addresses; the frontend reads them server-side with `overrideAccess: true`, no user) | admin | admin | admin | |
| form-submissions | staff (overrides plugin default "any logged-in user", which would include pipeline) | `turnstileVerifiedOrAdmin` (overrides plugin default `() => true`) | admin (delivery fields are written by jobs with `overrideAccess`) | admin | re-send endpoint: staff |
| redirects | `true` (behaviour is public anyway) | staff | staff | staff | |
| globals (all 4) | `true` | — | staff | — | |
| `payload-jobs`, query presets | integrator config: staff for presets; jobs admin-only | | | | |

Nothing relies on Payload's default access (which is "any logged-in user"): every collection and global above sets all of `read/create/update/delete` explicitly, because the pipeline user **is** logged in.

---

## 5. Launch state and draft rules (data shape)

1. **Drafts** (`versions: { drafts: { autosave: { interval: 375 }, schedulePublish: false, validate: false }, maxPerDoc: 50 }`) on every content-facing collection: `pages`, `case-studies`, `posts`, `testimonials`, `clients`, `team-members`, `faqs`, `lead-magnets`. `schedulePublish` stays off (it would let a scheduled job publish without a human, and would need jobs access for the pipeline). Autosave exists for live preview.
2. **Public queries return published only**, twice over: the read access query (`_status = published`) **and** `draft: false` + `overrideAccess: false` on every Local API call in server components. Relationship population runs through the same access, so a published page pointing at a draft testimonial/case study gets an unpopulated ID; **components treat any non-object relation as absent** and skip it.
3. **No `caseStudiesLive` toggle exists anywhere.** Every case-study surface derives its state from data: `find case-studies where _status = published (+ filters)`. `docs.length === 0` → fallback. Publishing the first study flips every surface automatically; unpublishing flips it back.
4. Surfaces and their fallback (R3, every case-study surface):

| Surface | Block | Live data | Fallback (designed, never "coming soon") |
|---|---|---|---|
| p1 §Featured case studies | CaseStudyCards `cards` | featured, limit 3 | `fallbackMode: ledger` (eyebrow "No studies live yet — the numbers we can show", H2, note + metric ledger; prices only via `pricingNote`) |
| p3 §Study ledger (grid) | CaseStudyCards `ledger`/`staggered` + Load More | all published | `ledger` |
| p5 §Proof, p13 §Proof | CaseStudyCards `cards` | track `build`, limit 2 | `testimonials` (selected testimonials, no study card) |
| p6 §Proof (restored), p14 §Proof | CaseStudyCards `cards` | track `growth` | `metricStrip` (p6 design JS `fallbackStrip`; p14 §Proof fallback "5 Vendors / 1 Team") |
| p8 §Logo strip (restored) | CaseStudyCards `cards` | latest 3 | `logoStrip` ("Logo strip at launch (case study pull later)", CLAUDE.md p8) |
| p15 §Case pull | CaseStudyCards `cards` | manual/featured, 1 | `metricStrip` (p15 design `fallbackStrip`) |
| p19 §Case cross-links | CaseStudyCards `cards` | featured 2 | `note` ("Full case studies publish here as clients sign off…") |
| p2 §Next study | CaseStudyCards `nextLink` | next published by `publishedAt` | hidden section → "All studies" link only |
| "A study in full" card inside p1/p3/p4/p9/p15 TestimonialRow | TestimonialRow `studyCard` | featured study | `fallbackMetric` if set, else the row reflows to testimonials only |
| p7 "Read the full case study" per testimonial | ReviewWall item | `testimonial.caseStudy` if published | button not rendered |
| p17 identity metric "+212%" | LinkStack `identity` | headline metric of latest published study | `identity.fallbackLine` |
| p17 "Case study" link | LinkStack | latest published study | link not rendered |

5. **Seeding**: case studies are seeded as drafts (Phase 4). Testimonials, clients and metrics are seeded as clearly labelled placeholders (R5); the seed is the human's call per page.
6. **Preview**: in Next draft mode with a staff session, template routes query `draft: true` so editors can preview unpublished docs. CaseStudyCards on other pages keep the public behaviour in preview, so the launch state stays visible; `/_showcase` renders populated variants from fixture data, not from the DB.

---

## 6. Collections

Fields tables: **Req** = required on publish (drafts skip validation, `drafts.validate: false`); **Edit** = who edits in the admin (S = staff, A = admin only, P = pipeline too, RO = read-only/system).

### 6.1 `pages`
**Justification:** 17 of the 21 page types are single documents assembled from blocks: p1, p3–p12, p15, p16, p17, p19, p20 (×4 docs: Privacy, Terms, Cookies, GDPR, from `SiteFooter` bottom bar), p21. Templates p2/p13/p14/p18 are collections (below).

Config: `admin.useAsTitle: 'title'`, live preview (URL built from server-side `SITE_URL`), drafts (§5), `defaultPopulate: { title, slug }`.

| Field | Type | Req | Edit | Controls / justification |
|---|---|---|---|---|
| `title` | text | ✓ | S | Admin title and default `<title>` source |
| `slug` | `slugField({ slugify })` | ✓ | S | URL path. Custom `slugify` keeps `/` so `services/marketing`, `lp/<campaign>`, `privacy` work in a flat site (no nested-docs, rejected). `home` → `/`, `404` is reserved for the not-found route |
| `layout` | blocks (all 23 blocks, §8) | ✓ (min 1) | S | The page's sections, in order |
| `headerVariant` | select `standard` / `logo-only` / `none` (default standard) | ✓ | S | p15 §LP header and p18 §LM header are logo-only; p17 has no header (the identity strip is inside LinkStack). All others use `SiteHeader` |
| `footerVariant` | select `standard` / `reduced-nav` / `legal-only` (default standard) | ✓ | S | CLAUDE.md rule 4: reduced-nav on p9, p10; legal-only on p15, p17, p18 (MERGED §7 footer table) |
| `zeroLeakage` | checkbox | | S | p15 (CLAUDE.md "zero leakage"). Hook forces `headerVariant: logo-only`, `footerVariant: legal-only`, and rejects any `NewsletterBand` block in `layout` (rule 4: "no header nav, footer links or newsletter band") |
| `readingProgress` | checkbox | | S | R10: on for p8 (About) and p11 (FAQ). Case-study and post templates always show it |
| `noindex` | checkbox | | S | Adds `noindex` + sitemap exclusion. Intended for p10 Thank You, p15 LPs, p17 Link-in-Bio, p21 404 (seo-auditor page scope: "Campaign LP and gated templates are noindexed or excluded") |
| `publishedAt` | date (sidebar) | | S | Set on first publish by hook if empty |
| `meta` | plugin-seo tab (`title`, `description`, `image`) | | S | Per-page meta/OG (D§I) |

Hooks: `beforeChange` set `publishedAt` on first publish; `beforeValidate` `zeroLeakage` enforcement; `afterChange`/`afterDelete` revalidate (§10).

### 6.2 `case-studies`
**Justification:** p2 template (`/work/<slug>`), pulled on p1, p3, p4, p5, p6, p8, p13, p14, p15, p17, p19 (§5 table). **All drafts at launch.**

Config: drafts, live preview, `defaultPopulate` = card fields (`title, slug, client, track, headlineMetric, cardSummary, heroMedia, publishedAt`) so cards never over-fetch.

| Field | Type | Req | Edit | Controls / justification |
|---|---|---|---|---|
| `title` | text | ✓ | S | H1 of p2 §Article header ("The demand was already there. The store was leaking it.") |
| `accentPhrase` | text (substring validate) | | S | Accent span of the H1 |
| `slug` | `slugField()` | ✓ | S | `/work/<slug>` |
| `client` | relationship → `clients`, **maxDepth 1** | ✓ | S | "Work / Study 01 — Northside Goods" (p2 breadcrumb), card `client` |
| `studyNumber` | number | | S | "Study 01" (p2 breadcrumb), "№ 01" (p3 §Study ledger) |
| `track` | select `build` / `growth` / `build-and-growth` / `handover` | ✓ | S | p3 ledger engagement column ("Build + engine", "Engine only", "Handover complete"); filters proof on p5 (build) and p6 (growth) |
| `engagementLine` | text | | S | "Build + engine, 12 months · Hardgoods retail, 3 locations" (p2 header meta, p3 ledger sub-line) |
| `headlineMetric` | group `metricFields()` | ✓ | S | **Restored** p2 hero "oversized result metric" (R2); card metric ("+212% / Revenue, 12 months") on every CaseStudyCards / study card; p17 identity metric |
| `cardSummary` | textarea (max 160) | ✓ | S | Card summary ("Rebuild plus engine. Store stopped leaking demand.") and p3 ledger "what was leaking / what we changed" |
| `inShort` | textarea | ✓ | S | p2 §Article header "In short" grey box |
| `heroMedia` | upload → media, **maxDepth 1** | ✓ | S | **Restored** "browser-framed visual" (CLAUDE.md p2, R2); rendered by Hero `article` with `mediaFrame: browser` |
| `readTime` | number (minutes) | | S | "8 min read" (p2 meta). Hook fills from body word count if empty |
| `narrative` | group of 3 groups `before` / `strategy` / `results`, each `{ title text ✓, body richText ✓ }` | ✓ | S | CLAUDE.md p2: The Before → The Strategy → The Results; design numbers them 01 "What we found" / 02 "The order of work, and why" / 03 "What changed, month by month" (p2 §Article body). Three required fields guarantee all three sections exist. Figures are Lexical upload nodes with a `caption` sub-field ("Fig. 1 — …") |
| `resultsTable` | group: `eyebrow` text ("Results — 12 months, client-reported") · `columns` group (`measure`, `baseline`, `after`, `change` header labels) · `rows` array (min 1) `{ measure ✓, baseline, after ✓, change }` · `method` textarea | ✓ (rows) | S | p2 §Results table ("Online revenue $780K/yr → $2.43M/yr +212%"); method note is required context for client-reported numbers |
| `clientVoice` | group: `testimonial` relationship → testimonials (**maxDepth 2**, so client + poster populate) · `doDifferently` richText · `phaseMapping` textarea · `link` `linkField` | | S | p2 §Client voice: video-first testimonial (text fallback when `format: text`), "04 What we'd do differently", "How this maps to our phases", "See the two tracks" |
| `closing` | group: `newsletterHeading` text · `finalCtaHeading` text | | S | p2 §Newsletter CTA / §Final CTA copy per study ("Want this written about your store?"); empty → `site-settings.templateDefaults` |
| `featured` | checkbox (sidebar) | | S | Picks studies for p1/p4/p19 "featured" sources and the "A study in full" card |
| `figuresApproved` | checkbox (sidebar) | | S | p2 design note: "Publishes only with client-approved figures"; meta line "Client-approved figures". **Hook blocks `_status: published` unless true** |
| `publishedAt` | date (sidebar) | | S | "Published Feb 2026"; order for Next study / Load More |
| `meta` | plugin-seo tab | | S | |

Hooks: `beforeChange` (publish guard on `figuresApproved`; `publishedAt` on first publish; `readTime` fill); revalidate (§10). Delete access protects published studies from marketing (§4.3).

### 6.3 `posts`
**Justification:** p13 DEV-SEO template, p14 MKT-SEO template (`/insights/<slug>`), p16 newsletter issue rows. One collection (§2.1). Pipeline drafts here.

| Field | Type | Req | Edit | Controls / justification |
|---|---|---|---|---|
| `title` | text | ✓ | S P | Keyword-targeted H1 ("Shopify development in Chicago, scoped and priced in writing.") |
| `slug` | `slugField()` | ✓ | S P | |
| `track` | select `dev-seo` / `mkt-seo` / `newsletter-issue` | ✓ | S P | Drives template order and conditional fields |
| `targetKeyword` | text (sidebar) | | S P | p13 design note "demonstrative keyword: 'Shopify development Chicago'"; feeds `generateTitle` and the FAQ eyebrow "<keyword> — common questions" |
| `eyebrow` | text | | S P | "Shopify Theme Development — Chicago" / "Education — integrated growth" |
| `dek` | textarea (max 300) | ✓ | S P | Standfirst under H1; also card/issue excerpt on p16 |
| `author` | relationship → team-members, **maxDepth 1** | | S | "By [Author], Duha Media". Pipeline cannot set it (cannot read team-members); the human sets it in review |
| `publishedAt` / `updatedAtDisplay` | date / date | | S | "Published Jun 12, 2026 · Updated Jul 24, 2026" (p14) |
| `readTime` | number | | S P | "9 min read"; hook fills if empty |
| `heroImage` | upload → media, **maxDepth 1** | | S | Optional; pipeline cannot upload media |
| `body` | richText (Lexical: H2/H3, lists, quote, link, upload-with-caption) | ✓ | S P | p13/p14 §Article body: numbered H2s (component numbers them 01, 02…), pull-quote ("You're not paying five invoices. You're paying six."), figures |
| `howWeDoIt` | group `{ eyebrow, body textarea, link linkField }` — condition dev/mkt | | S P | "How we do it" box (p13 end of body). **Restored as its own section after the DIY bridge on mkt-seo** (R2 "MKT-SEO 'How Duha does it'") |
| `diyBridge` | group `{ eyebrow, heading, accentPhrase, body richText, facts array(max 3) metricFields }` — condition dev/mkt | | S P | p13/p14 §DIY vs done ("Some stores should just hire a freelancer."). `facts` = p13 desktop sub-strip ("4–6 Weeks", "3 Checkpoints"); its "$5K Build floor" shrinks to a `pricingNote` per R13 |
| `pricingNote` | `pricingNote()` | | S P | Inline only |
| `educational` | group `{ eyebrow, heading, body richText }` — condition dev-seo | | S P | **Restored** p13 "Educational block" (R2), placed after Proof, before FAQ (CLAUDE.md p13 order) |
| `proof` | group `{ source select featured/track/manual, caseStudies relationship hasMany → case-studies maxDepth 1, fallbackMode select testimonials/metricStrip, fallbackTestimonials relationship hasMany → testimonials maxDepth 2, fallbackMetrics array metricFields, fallbackNote textarea }` — condition dev/mkt | | S | p13/p14 §Proof with fallback (R3) — same data shape as the CaseStudyCards block |
| `faq` | array `{ question text ✓, answer richText ✓ }` (max 8) — condition dev/mkt | | S P | p13/p14 §FAQ block; inline because pipeline-writable (X11); feeds FAQPage JSON-LD |
| `faqHeading` | text | | S P | "On consolidating your marketing" |
| `closing` | group `{ newsletterHeading, finalCtaHeading }` | | S P | "More like this, monthly." / "Run the numbers on your setup with us." (p14); empty → template defaults |
| `issueNumber` | number — condition newsletter-issue | ✓ (issue) | S P | "ISSUE 011" (p16 §Sample content) |
| `sentAt` | date — condition newsletter-issue | | S P | "[DATE]" column |
| `issueMetric` | text — condition newsletter-issue | | S P | "[metric]" column |
| `meta` | plugin-seo tab | | S P | |

Hooks: `beforeChange` — if `req.user.role === 'pipeline'` and the resulting `_status` is `published`, throw `Forbidden` (create and update); `publishedAt` on first publish (staff only); `readTime` fill; revalidate.

### 6.4 `testimonials`
**Justification:** p1 §Testimonials (3 cards), p3 §Proof pull, p4 §Featured proof, p5 §Proof fallback, p7 §Testimonial feed, p9 §Social proof, p15 §Testimonial, p16 §Social proof (reader quote), p19 §Review wall, p2 §Client voice. GBP reviews merged here (§2.2).

| Field | Type | Req | Edit | Controls / justification |
|---|---|---|---|---|
| `quote` | textarea | ✓ | S | Quote text (DS Testimonial) |
| `authorName` | text | ✓ | S | "J. Alvarez" |
| `authorRole` | text | | S | "3-location retailer, Chicago" |
| `client` | relationship → clients, **maxDepth 1** | | S | Brand pairing: CLAUDE.md p7 "per client: logo"; logo shown on video cards when set |
| `source` | select `direct` / `google-review` / `linkedin` (default direct) | ✓ | S | R6: source tag is data ("Google review" with google-logo icon in p7/p19) |
| `sourceUrl` | text (https) — required when source ≠ direct | | S | p19 "lives somewhere you can verify it" |
| `verbatim` | checkbox — required true when source = google-review | | S | p7/p19: "pulled verbatim from Google at launch, never paraphrased" |
| `rating` | number 1–5, optional | | S | R6: stars are data; no rating → no stars. Never defaulted to 5 |
| `format` | select `text` / `video` (default text) | ✓ | S | p7 feed mixes "Video · Revenue, 12 mo" tiles and written cards; p2 "video-first, text fallback" |
| `video` | group `{ url text (https; validate host on an allow-list, see Q5), poster upload → media maxDepth 1 ✓ when video, durationLabel text }` — condition video | | S | p7 video tiles ("[video poster]" image slots, play icon) |
| `metric` | group `{ value, label }` | | S | p7 tile overlay "+212%" / "Video · Revenue, 12 mo"; "MO 9 / Independence handover" |
| `caseStudy` | relationship → case-studies, **maxDepth 1** | | S | p7 "Read the full case study" deep link, rendered only if that study is published (R3) |
| `reviewDate` | date | | S | Ordering + Review/AggregateRating JSON-LD |
| `sortOrder` | number | | S | Feed/wall order (p7 Load More, p19 wall); `orderable` is experimental in 3.91.0 (§0) |

Hooks: field `validate` for the conditional requirements; revalidate.

### 6.5 `clients`
**Justification:** p1 §Proof strip logo row (6 names), p15 §Proof strip (2 names), p19 §Review wall name tiles, p8 restored logo strip (via CaseStudyCards fallback), case-study and testimonial attribution.

| Field | Type | Req | Edit | Controls |
|---|---|---|---|---|
| `name` | text | ✓ | S | Rendered in Archivo when no logo (the design shows text names, MERGED §4.2) |
| `logo` | upload → media, **maxDepth 1** | | S | Monochrome logo (CLAUDE.md baseline); optional because the design renders names |
| `website` | text (https) | | S | Attribution link |
| `showInLogoStrip` | checkbox | | S | Which clients appear on p1/p8/p15 strips |
| `sortOrder` | number | | S | Strip order |

R5: all current names are placeholders; the seed labels them as such. Empty strip → the logo row is not rendered.

### 6.6 `team-members`
**Justification:** §2.3. p1 §Founder (2nd, "One founder, no layers."), p8 §Founder, post bylines.

| Field | Type | Req | Edit | Controls |
|---|---|---|---|---|
| `name` | text | ✓ | S | "Abdur-Rahman Ch" (R5, real) |
| `role` | text | ✓ | S | "Founder · Chicago" |
| `bio` | textarea (max 400) | | S | "[One-sentence bio, founder-authored…]" — placeholder until he writes it; never invented (rule 3) |
| `photo` | upload → media, **maxDepth 1** | | S | `founder.jpg` image slot |
| `socials` | array `{ platform select linkedin/x/github/instagram/youtube/facebook, url ✓ }` | | S | LinkedIn / Twitter / GitHub icons on the founder card |

"Latest posts" is dropped (R12): no field.

### 6.7 `faqs`
**Justification:** p11 (4 category groups), mini blocks on p4, p5, p6 (§2.5).

| Field | Type | Req | Edit | Controls |
|---|---|---|---|---|
| `question` | text | ✓ | S | DS FAQItem question |
| `answer` | richText | ✓ | S | Answer (links allowed: "see the FAQ") |
| `category` | select `pricing-contracts` / `builds` / `marketing` / `process-trust` | ✓ | S | p11 §Category nav and the four group sections |
| `listOnFaqPage` | checkbox (default true) | | S | Keeps mini-only questions off p11 |
| `sortOrder` | number | | S | Order inside a category. The pricing question ("What does it cost?") sorts first and opens by default (CLAUDE.md p11, rule 5 exception) |

### 6.8 `lead-magnets`
**Justification:** p18 template (`/resources/<slug>`). Rendered from fixed fields; the template has no free layout because all three sections are bound to the asset.

| Field | Type | Req | Edit | Controls |
|---|---|---|---|---|
| `title`, `accentPhrase` | text | ✓ | S | p18 §Capture state H1 "[Asset name placeholder…]" |
| `slug` | `slugField()` | ✓ | S | |
| `eyebrow` | text (default "Free download") | | S | |
| `pitch` | textarea | ✓ | S | "one paragraph: what the asset is… Number first." |
| `form` | relationship → forms, **maxDepth 1** | ✓ | S | Capture form (email + newsletter opt-in checkbox) |
| `formNote` | text | | S | "Email delivery. No drip sequence ambush…" |
| `valueBullets` | array `{ text ✓ }` (min 3, max 6) | ✓ | S | p18 §What's inside (4 bullets) |
| `asset` | group `{ file upload → downloads maxDepth 1, externalUrl text https }`; validate exactly one | ✓ | S | The deliverable sent by email |
| `deliveredState` | group `{ eyebrow ("Sent"), heading ✓, accentPhrase, body, crossSellLine }` | ✓ | S | p18 §Delivered state + newsletter cross-sell |
| `deliveryEmail` | group `{ subject ✓, intro textarea ✓ }` | ✓ | S | The single delivery email ("one send"), sent by the `lead_magnet` integration unit |
| `meta` | plugin-seo tab | | S | |

Lead magnets are `noindex` by default (gated template), flag in the template.

### 6.9 `media`
**Justification:** all imagery (D§G). Revises `src/collections/Media.ts`.

- `upload`: `staticDir: process.env.MEDIA_DIR` (path; dev fallback `./media` as in scaffolding), `mimeTypes: ['image/*']`, `focalPoint: true`, `imageSizes` `thumbnail` 400×300, `card` 768w, `wide` 1600w, plus **`browser` 1440w** (p2 browser-framed hero) and **`og` 1200×630** (seo-defaults / plugin-seo OG image).
- Fields: `alt` text **required**, `validate` rejects whitespace-only and file-name-like values (`/\.(jpe?g|png|webp|gif)$/i`); `caption` text (optional, default caption for figures).
- No drafts (uploads have no publish lifecycle). Access §4.3.

### 6.10 `downloads` (new, X9)
- `upload`: `staticDir: path.join(process.env.MEDIA_DIR, 'downloads')`, `mimeTypes: ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip']`, no image sizes.
- Fields: `title` text required (admin label and email link text).
- Access: read `true` (the link is emailed; files are not secret); write staff.

### 6.11 `users` (revises scaffolding)
- `auth`: `maxLoginAttempts: 5`, `lockTime: 600000` (10 min), `useAPIKey: true` (reveal false, default), `tokenExpiration: 7200`, sessions on (default). Verified §0.
- Fields:

| Field | Type | Req | Edit | Controls |
|---|---|---|---|---|
| (email, password) | auth | ✓ | A / self | |
| `name` | text | | A / self | Admin display |
| `role` | select `admin` / `marketing` / `pipeline` (default marketing), `saveToJWT: true` | ✓ | A (field access) | §4.1 |
| (`enableAPIKey`, `apiKey`) | auth (API key) | | A | Validate in `beforeChange`: API key may be enabled **only** when `role = pipeline` |

- Hooks: `beforeChange` first user → `role: admin` (kept from scaffolding, adapted to single role); API-key/role guard. `beforeLogin`: throw if `role = pipeline` (the pipeline authenticates only with `Authorization: users API-Key <key>`; it is created by the admin with a random password that is never used). `access.admin`: staff only, so the pipeline key cannot open the admin UI.
- **Migration note:** `roles` (hasMany → join table) becomes `role` (column). Only local/dev data exists (one test admin); staging/production have never run. *(Erratum 2026-10-17: the committed migration `20261017_193341_c1_users_role` does include a data step that keeps existing admins as `admin`, because the new column defaults to `marketing`.)* The integrator confirmed no non-dev DB has users.

### 6.12 `forms` (form-builder) — overrides
**Justification:** p9 §Homework form, p10 §Homework reminder, p12 §Contact form, newsletter (p2/3/4/10/13/14 bands, p16 hero, footer nudge), p18 capture.

Plugin options: `fields: { text, email, textarea, select, checkbox, message: true; number, date: true; payment: false, country: false, state: false, upload: false }` (payment hard-off: payments ban), `redirectRelationships: ['pages']` (p9 homework → `/thank-you?homework=done`), `defaultToEmail` (env/settings, not a literal).

Added fields (`formOverrides.fields`, admin-only, sidebar group `integration`):

| Field | Type | Controls |
|---|---|---|
| `formKey` | text, unique, required | Stable machine id, becomes the event `form` value: `contact`, `precall-homework`, `newsletter`, `lead-magnet` |
| `eventType` | select `none` / `contact` / `newsletter` / `lead_magnet` | Event `type` (CLAUDE.md events table) |
| `sendEvent` | checkbox | Off for `precall-homework` at launch (Gate 0 Q1); flipping it on is the queued post-launch change, no schema delta |
| `newsletterSync` | checkbox | Resend Contacts/Segment/Topic + double opt-in for this form |
| `newsletterOptInField` | text | Name of the checkbox field that triggers newsletter sync on lead-magnet forms ("plus the monthly newsletter if you opt in", p18) |

Contact form (p12): fields name, email, `reason` select **partnership / press / existing-client / other**, message (CLAUDE.md p12; design p12 §Contact form). Homework form fields are **TBD** (R17); one `precall-homework` form doc feeds both p9 and p10, so the two field lists can no longer disagree (MERGED Conflict 17).

### 6.13 `form-submissions` (form-builder) — overrides
Access per §4.3. Added fields (`formSubmissionOverrides.fields`, all `admin.readOnly`, sidebar):

| Field | Type | Controls |
|---|---|---|
| `eventId` | text, indexed, unique | UUID generated once at create; reused on every retry and re-send (idempotency key) |
| `deliveryStatus` | select `pending` / `delivered` / `failed`, **optional** | Empty when the form has `sendEvent` off (X13) |
| `deliveryNote` | textarea | Last response/ error summary (no secrets, no PII beyond what is already stored) |
| `deliveryAttempts` | number (default 0) | Attempts so far |
| `lastAttemptAt` | date | When the last attempt ran |
| `sourcePath` | text | Page the form was submitted from (footer nudge vs p16 vs p10), included in event `fields` |
| `leadMagnet` | relationship → lead-magnets, **maxDepth 0** | Which asset (p18; event `fields` names the asset) |
| `newsletter` | group: `syncStatus` select `pending`/`synced`/`failed` · `syncNote` · `syncAttempts` · `optInStatus` select `pending-confirmation`/`confirmed`/`expired` · `confirmTokenHash` (hidden, hash only) · `confirmExpiresAt` · `confirmedAt` | Newsletter sync tracked separately from event delivery (CLAUDE.md lead flow step 7); double opt-in (Gate 0 Q2) |
| `resend` | `ui` field (admin component) | "Re-send" button → staff-only endpoint that re-enqueues with the same `eventId` |

Config: `enableQueryPresets: true` with a shared preset "Failed deliveries" (`deliveryStatus = failed`) — the "filtered view of the built-in submissions list" (CLAUDE.md lead flow step 5). `admin.defaultColumns: ['form', 'deliveryStatus', 'deliveryAttempts', 'createdAt']`.

Hooks (fields reserved here; the job logic is the automation-engineer's units): `beforeChange` on create: stamp `eventId`; stamp `deliveryStatus: pending` only if the form has `sendEvent`. `afterChange` on create: enqueue job (never send inline). Turnstile: the public form handler (server action / route) verifies the token with siteverify, then calls `payload.create({ collection: 'form-submissions', context: { turnstileVerified: true }, overrideAccess: false })`; direct REST `POST /api/form-submissions` is rejected by access.

### 6.14 `redirects` (plugin)
`collections: ['pages', 'case-studies', 'posts', 'lead-magnets']`, `redirectTypes: ['301', '302']`, `overrides.access` per §4.3, `afterChange` revalidate the redirect cache. Marketing self-service (D§C: no cutover map needed).

---

## 7. Globals (no drafts: edits apply immediately; read public; update staff; all revalidate on change)

### 7.1 `site-settings`
| Field | Type | Controls / justification |
|---|---|---|
| `legalName` | text ✓ ("Duha Media LLC") | Footer bottom bar "© 2026 Duha Media LLC" (all footers; p17/p18 inline legal bars); year is computed |
| `footerTagline` | text | "One team. Store, engine, then yours to run. Chicago." (SiteFooter brand zone) |
| `contactEmail` | email ✓ | p12 §Direct line "hello@duhamedia.com" (placeholder in design) |
| `responseTimeNote` | text | "Reply in 1 business day" (p12 mobile) |
| `socials` | array `{ platform select linkedin/instagram/youtube/x/facebook/github, handle text ✓ (full "@handle"), url ✓ }` | p12 socials, p17 §Follow (LinkedIn/Instagram/YouTube @duhamedia), Organization `sameAs` |
| `location` | group `{ locality ✓ "Lombard", region ✓ "IL", country "US", marketArea "Chicago", serviceRadiusMiles 30, latitude, longitude, displayLine }` | R5/R9: Lombard, IL is real; p12 "Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius"; map pin; LocalBusiness JSON-LD. `marketArea` keeps the brand line "— Chicago" (p1 eyebrow) |
| `gbpUrl` | text https | Google Business Profile link (CLAUDE.md baseline; p19 verification) |
| `bookingUrl` | text https, optional | Nextcloud booking page (BookingEmbed). Empty → BookingEmbed no-URL fallback state |
| `bookingMode` | select `link-out` / `embed` (default link-out) | D§M/M2: link-out at launch; embed state stays buildable for when framing is allowed |
| `postalAddress` | group `{ line1, line2, city, region, postalCode, country }`, all optional | CAN-SPAM broadcast footer (D§K2). **On hold** (Gate 0 Q3): may be empty; the first broadcast is blocked until filled |
| `aggregateRating` | group `{ show checkbox, ratingValue number, reviewCount number, asOf date, sourceUrl }` | p19 hero "[Aggregate rating placeholder — pulls from GBP at launch]", p7 eyebrow "Testimonials · 5.0 avg" (R5: "5.0 avg" is placeholder → hidden until real) |
| `templateDefaults` | group `{ newsletterHeading, newsletterLine, finalCtaHeading, finalCtaButton linkField }` | Default closers for the p2/p13/p14 templates and empty NewsletterBand/FinalCTA headings ("One useful email a month." / "Numbers included. Unsubscribe anytime.") |
| `newsletterForm` | relationship → forms, **maxDepth 1** | The one newsletter form used by every NewsletterBand, the footer nudge and p16 hero |

Not in settings: email from-address stays in code (`resendAdapter` is built at init, not per request; Decision log 2026-10-17).

### 7.2 `scarcity`
**Justification:** CLAUDE.md rule 2 + p1 §Proof strip, every §Final CTA capacity line, p15 §Offer block, p17 "Slots open 3/7". The design uses two counts ("3 builds in progress", "3 engines running") and one cap ("We cap at 7").

| Field | Type | Controls |
|---|---|---|
| `capacity` | number ✓ (default 7, min 1) | "We cap at 7" |
| `activeClients` | number ✓ (0…capacity) | "Slots open 3/7", "3 of 7 slots filled" |
| `buildsInProgress` | number ✓ | "{n} builds in progress" |
| `enginesRunning` | number ✓ | "{n} engines running" (p6, p14 Final CTA) |
| `statements` | array (min 1) `{ key select ✓, statistic text ✓, label text, reason text ✓ }` | Each loud statement + its quiet reason. `key` options: `ongoing`, `capacity`, `builds-line`, `engines-line`, `slots-line`, `offer-line` (unique, validated). `statistic` may use tokens `{active}`, `{capacity}`, `{builds}`, `{engines}`, `{open}` |

Validation: `reason` is **required** on every row, so a bare number cannot be saved; `activeClients ≤ capacity`; keys unique. The component has no reason-less render path (block-coder rule). Seed rows: `ongoing` "{active}" / "Projects ongoing" / "Current load, shown transparently."; `capacity` "{capacity}" / "Max client capacity" / "The cap is our quality gate, not a countdown."; `builds-line` "{builds} builds in progress. We cap at {capacity}." / "The cap keeps every build senior-staffed — that's the whole reason."; `engines-line`; `slots-line` "Slots open {active}/{capacity}"; `offer-line` "{active} of {capacity} slots filled" / "capacity is the quality gate".

### 7.3 `navigation`
| Field | Type | Controls |
|---|---|---|
| `header.links` | array (max 6) `linkField` | SiteHeader: Work · Services · Testimonials · About · FAQ (desktop + mobile panel) |
| `header.cta` | `linkField` | "Book a Call" button |
| `footer.standard.columns` | array (max 3) `{ title ✓, links array linkField }` | Pages / Services / Resources zones |
| `footer.standard.newsletterNudge` | group `{ heading ("Newsletter"), line ("One useful email a month. Numbers included."), buttonLabel ("Join") }` | 5th zone; uses `site-settings.newsletterForm` |
| `footer.reduced.links` | array `linkField` | Home / Work / FAQ / Contact (p9, p10) |
| `footer.legalLinks` | array `linkField` | Privacy, Terms, Cookies, GDPR (bottom bar of all three variants; p17/p18 show Privacy + Terms) |

Brand line and legal name come from `site-settings`. Mobile footer renders the same data (`SiteFooterMobile` = `v2`, identical, R17).

### 7.4 `seo-defaults`
| Field | Type | Controls |
|---|---|---|
| `titleTemplate` | text ✓ ("%s — Duha Media") | plugin-seo `generateTitle` |
| `defaultDescription` | textarea ✓ (max 155) | Fallback description |
| `defaultOgImage` | upload → media **maxDepth 1** ✓ | Fallback OG (`og` size) — marketing quick reference "change the OG image" |
| `organization` | group `{ name, logo upload maxDepth 1, foundingDate (optional, never invented) }` | Organization JSON-LD; `sameAs` from `site-settings.socials`, `url` from env `SITE_URL` |
| `localBusiness` | group `{ type select ProfessionalService/MarketingAgency, areaServed text ("Chicago metropolitan area"), openingHours text }` | LocalBusiness JSON-LD (Lombard address from `site-settings.location`) |

---

## 8. Blocks (23)

Each block = `src/blocks/<Name>/config.ts` + `Component.tsx`. All blocks accept `eyebrowField()` / `headlineFields()` where they show an eyebrow or heading. "Pages" lists where the block appears in §9. Template-rendered sections (p2, p13, p14, p18) feed the same component from document fields.

### 8.1 Heroes and calls to action
**1. `Hero`** — pages 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 19 + templates p2, p13, p14, p18.
- `variant` select: **`typographic`** (cream + dot-matrix + wine logo-mask geometry; p1, p3, p4, p7, p9, p10, p11, p12, p16, p19, p15 Hero B) · **`service`** (ink ground + breadcrumb rail; p5 §Breadcrumb + §Dev hero, p6 §Breadcrumb + §Marketing hero) · **`article`** (article header grammar; p8 §Article header, templates p2/p13/p14) · **`vsl`** (p15 Hero A).
- Fields: eyebrow/tick · heading + accentPhrase · `body` textarea · `pricingNote` ("Builds from $5K. Engines from $1K/mo." p1; "Builds start at $5K" p5; "Engines start at $1K/mo" p6 — R13 shrinks the p5/p6 display stats to this note) · `subNote` text ("Six-month minimum — …", R5 placeholder) · `badge` group `{ show, text }` (p1 authority badge "$X.XM client revenue tracked") · `ctas` array max 2 `linkField` (first primary, second ghost; p1 Book a Call / See the Work) · `breadcrumb` array max 4 `linkField` (condition service/article) · `stats` array max 5 `{ label, value }` (p3 aggregates "$3.1M / Client revenue added" — mobile renders them as the §Aggregates strip; p8 Based / Scope / Capacity / Read; p16 Cadence / Length / Filler) · `summary` group `{ label default "In short", body }` (article) · `metaLine` text (article: byline/dates/read time) · `media` upload maxDepth 1 + `mediaFrame` select `none`/`browser`/`full-bleed` (p8 lead image full-bleed; p2 browser frame) · `video` group `{ url, poster upload maxDepth 1 ✓ }` (vsl) · `form` relationship → forms maxDepth 1 + `formNote` (p16 signup inside the hero, "above the fold"; p18 capture) · `phaseStrip` array max 3 `{ number, label }` (**restored** p4 "phase timeline visual", DS `PhaseTimeline compact`) · `showAggregateRating` checkbox (p7, p19) · `verticalMicrocopy` text ("Build · Operate · Hand over", p1) · `geometry` checkbox default true.
- Variants: 4.

**2. `MiniCTAStrip`** — `variant`: **`band`** (ink band + pill button, p1 §Mini CTA "One team. One dashboard. A handover date.") · **`inline`** (quiet one-line escape, p9 restored "Quick-question escape line to Contact": "Have a quick question first? Contact us") · **`button`** (single centred CTA, p15 restored repeats after §Proof strip and §Case pull). Fields: `text`, `link` linkField ✓. Variants: 3.

**3. `FinalCTA`** — p1, p2, p3, p4, p5, p6, p7, p8, p11 (§Still have questions), p13, p14, p19. Fields: heading + accentPhrase (empty → `templateDefaults`) · `body` · `capacity` `scarcityRef()` (default `builds-line`; p6/p14 use `engines-line`; p11 `none`) · `buttons` array 1–2 `linkField` (p11 Book a Call + Contact us). Geometry is fixed by design. Variants: 1.

**4. `OfferBlock`** — p15 §Offer block. Fields: eyebrow ("The offer") · heading ("[Campaign-specific promise, stated as scope.]") · `body` richText · `cta` linkField ✓ · `capacity` `scarcityRef()` (default `offer-line`: "3 of 7 slots filled — capacity is the quality gate."; design: "No countdown timers; capacity is the only true urgency and it carries its reason"). Variants: 1.

### 8.2 Proof and metrics
**5. `ProofStrip`** (absorbs ScarcityStrip + ClientLogoStrip, X3) — `variant`: **`scarcity`** (p1: two scarcity statements loud/quiet + logo row) · **`metrics`** (p15: up to 3 `metricFields` + logo row). Fields: `statements` array max 2 `scarcityRef()` (scarcity) · `metrics` array max 3 (metrics; prices only via `pricingNote`, R13) · `pricingNote` · `logos` group `{ show, eyebrow ("Stores we've run numbers for"), source select flagged/manual, clients relationship hasMany → clients maxDepth 2 }`. Variants: 2.

**6. `CaseStudyCards`** — p1, p3, p5, p6 (restored), p8 (restored logo strip), p13, p14, p15, p19, p2 §Next study.
- `layout` select: **`cards`** (DS CaseStudyCard grid, 1–3) · **`ledger`** (p3 §Study ledger numbered rows, design) · **`staggered`** (CLAUDE.md p3 "staggered grid", restored by R2 — see Q1) · **`next-link`** (p2 §Next study line).
- Live fields: heading + accent · `source` select `featured` / `latest` / `track` / `manual` · `track` select (condition track) · `caseStudies` relationship hasMany → case-studies **maxDepth 1** (condition manual) · `limit` number · `loadMore` checkbox + `pageSize` (p3: "Load More, no pagination") · `allLink` linkField ("All studies →").
- Fallback fields (§5): `fallbackMode` select **`ledger`** / **`testimonials`** / **`metric-strip`** / **`logo-strip`** / **`note`** · `fallbackEyebrow`, `fallbackHeading`, `fallbackBody` · `fallbackMetrics` array max 3 `metricFields` · `pricingNote` · `fallbackTestimonials` relationship hasMany → testimonials **maxDepth 2** · `fallbackLogos` (uses clients flagged for strip). No field can switch a surface to "live" without published data.
- Variants: 4 layouts (fallback modes are states).

**7. `MetricEvent`** — p8 §Company facts; template p2 §Results table. `variant`: **`facts`** (label/value rows, "The company, in numbers") · **`table`** (measure/baseline/after/change, from `case-studies.resultsTable`) · **`strip`** (DS MetricStrip; also the component behind fallback strips). Fields: eyebrow · heading · `items` array `{ label ✓, value ✓, baseline, change, sub }` · `note` textarea ("[Founding year, headcount… fill in from client-approved records — no estimates published.]"). Variants: 3.

**8. `ReviewWall`** — `variant`: **`feed`** (p7 §Testimonial feed: video tiles + written + Google cards, Load More) · **`wall`** (p19 §Review wall: staggered mix incl. a metric tile and client-name tiles). Fields: `source` select `all` / `manual` · `testimonials` relationship hasMany → testimonials **maxDepth 2** · `sourceFilter` select hasMany (direct/google-review/linkedin) · `pageSize` · `inserts` array (wall only) `{ kind select metric/client, metric metricFields, client relationship → clients maxDepth 1, position number }` (p19 "7 Client cap" tile, "NORTHSIDE GOODS" tile) · `wallNote` ("[Demonstrative wall — GBP reviews import verbatim at launch]"). Variants: 2.

**9. `TestimonialRow`** — p1 §Testimonials, p3 §Proof pull, p4 §Featured proof, p9 §Social proof, p15 §Testimonial, p16 §Social proof; template p2 §Client voice. `variant`: **`row`** · **`client-voice`** (p2: one testimonial video-first + "What we'd do differently" + phase mapping + link, fed by `case-studies.clientVoice`). Fields: eyebrow ("What clients say") · heading ("Proof, in their words.") · `testimonials` relationship hasMany 1–3 → testimonials **maxDepth 2** · `leadMetric` group `metricFields` (p16 "[N] Subscribers") · `studyCard` group `{ show, source select featured/manual, caseStudy relationship → case-studies maxDepth 1, fallbackMetric metricFields }` (the "A study in full" card, R3) · `cta` linkField (p15 CTA after the testimonial). Variants: 2.

### 8.3 Structure and narrative
**10. `TwoTrackPanels`** — `variant`: **`equal`** (p1 §What we do "First, we build it. / Then we grow it."; p4 §Two doors with per-panel `pricingNote`, R13 shrinks "$5K and up" to inline) · **`contrast`** (p4 §Why both together: two "Sold to you as '…'" struck claims + reality line, then a conclusion) · **`primary-secondary`** (**restored** p5 "Where people usually start": Revision primary, Scratch Build soft, R2). Fields: heading + accent · `panels` array exactly 2 `{ label, title ✓, claim (contrast: struck text), body ✓, pricingNote, link linkField }` · `conclusion` textarea. Variants: 3.

**11. `PhaseTimeline`** — `variant`: **`accordion`** (p1 §Process: 8 steps across 3 phases, click/scroll-open) · **`arc`** (p4 §The arc: 3 phases with body + link) · **`build-run`** (p5 §Build run: 6 steps, sign-off tags) · **`engine-rollout`** (p6 §Engine rollout: 6 steps with timing, ends "06 Independence — Phase 03") · **`steps`** (p4 §How it starts and p9 §What happens next: numbered step cards with "You leave with" bullets). Fields: eyebrow · heading + accent · `intro` · `phases` array max 3 `{ number, title ✓, body, link }` · `steps` array max 10 `{ number, title ✓, detail, phase select 1/2/3, tag (timing / "Your sign-off"), isSignOff checkbox, outcomes array text }` · `closingLine` ("Then Phase 02, if the numbers say it fits.") · `cta` linkField (p4 Book a Call). **Rule:** the last phase/step in the phase variants always renders at full visual weight (CLAUDE.md, DS PhaseTimeline last-phase "independence handover" tag); there is no field to turn that off. Variants: 5.

**12. `TeamIntro`** — `variant`: **`intro`** (p1 §Founder #1 "Who you'd work with": heading, body, photo, "More about us →") · **`founder-card`** (p1 §Founder #2 and p8 §Founder "One founder, no layers.": member card + socials; no Latest posts, R12). Fields: eyebrow · heading + accent · `body` · `photo` upload maxDepth 1 (intro) · `member` relationship → team-members **maxDepth 2** (founder-card) · `link` linkField. Copy is single-founder (R17). Variants: 2.

**13. `RichContent`** — `variant`: **`article`** (numbered H2 sections + figures; p8 §Article body = 01 Story / 02 How we work / 03 Values; templates p2/p13/p14 body) · **`legal`** (p20 §Legal document: "On this page" desktop sidebar + mobile §Legal head/§Section nav, generated from H2 anchors; counsel placeholders only) · **`band`** (grey-band eyebrow + heading + body + optional facts/link; templates p13/p14 §DIY vs done, "How Duha does it", p13 Educational). Fields: eyebrow · heading + accent · `body` richText ✓ · `lastUpdated` date (legal) · `facts` array max 3 `metricFields` (band) · `link` linkField. Variants: 3.

**14. `SpecLedger`** (new, X7) — `variant`: **`cards`** (p5 §Template anatomy T-01…T-04 with mockup images; p6 §Camera work two image cards) · **`expandable`** (p5 §Specification D-01…D-07; p6 §Channel specification E-01…E-06, "+" rows) · **`signal-flow`** (p6 §Signal flow: E-codes converging on "Everything reports here" + dashboard image) · **`list`** (template p18 §What's inside). Fields: eyebrow · heading · `items` array max 10 `{ code ("D-01"), title ✓, line, image upload maxDepth 1, whatLabel ("What we build"/"What we run"), what, proofLabel ("How you'll know it worked"/"What you'll see on the dashboard"), proof }` · `hub` group `{ heading, body, image }` (signal-flow) · `pricingNote` ("Builds start at $5K. Exact scope is priced on the call."). Variants: 4.

### 8.4 Forms and booking
**15. `NewsletterBand`** — p2, p3, p4, p10, p13, p14; template p18. `variant`: **`band`** (grey band, H3-size heading, quiet line, inline email + dark "Join") · **`cross-sell`** (p18 §Delivered state: delivered heading/body then newsletter cross-sell button, fed by `lead-magnets.deliveredState`). Fields: heading + accent (empty → templateDefaults; p3 "Studies land here first.") · `line` · `buttonLabel`. Form = `site-settings.newsletterForm` (one source). Forbidden on `zeroLeakage` pages. Variants: 2.

**16. `FormEmbed`** — `variant`: **`standard`** (p9 §Homework form; p12 §Contact form; `mobileLayout` select `stacked`/`stepped` — p12 mobile is a one-field-at-a-time flow) · **`reminder`** (p10 §Homework reminder, conditional: shows the form unless the visitor arrives with `?homework=done`, then `doneHeading`/`doneBody` "Homework received."). Fields: eyebrow · heading + accent · `body` · `form` relationship → forms **maxDepth 1** ✓ · `submitLabel` · `doneHeading`, `doneBody` (reminder). Turnstile is always on (component, not a field). Variants: 2.

**17. `BookingEmbed`** — p9 §Booking widget (desktop) and §Booking flow (mobile → link-out, R8). States from `site-settings`: **embed** (`bookingMode: embed` + URL) · **link-out** (default at launch: on-brand "Book your call" panel; opens Nextcloud in a new tab and sends the original tab to `/thank-you`, D§Q) · **no-URL fallback** (`bookingUrl` empty). Fields: heading · `body` · `buttonLabel` · `noteUnderButton` · `fallbackHeading` / `fallbackBody` (+ fallback link to Contact) · `thankYouPage` relationship → pages **maxDepth 0** (default `/thank-you`). Variants: 1 (3 states).

**18. `DirectContact`** (replaces MapEmbed, X5) — p12 §Direct info + map / §Direct line. Fields: `showEmail`, `showSocials`, `showLocation` checkboxes (values from `site-settings`) · `skipFormLine` ("Skip the form") · `map` group `{ show, caption ("Based in Lombard, IL — serving…"), zoom number }`. Map treatment is fixed **monochrome, Lombard, IL** (R9); no treatment select. Variants: 1.

### 8.5 FAQ and navigation
**19. `AccordionFAQ`** — `variant`: **`mini`** (p4 §FAQ mini, p5, p6 §FAQ mini; template p13/p14 §FAQ block) · **`group`** (p11 one block per category section). Fields: eyebrow ("Routing questions") · heading · `source` select `category` / `selected` · `category` select (4 options) · `faqs` relationship hasMany → faqs **maxDepth 1** (selected) · `openFirst` checkbox (p11 Pricing & Contracts "opens with the direct pricing answer") · `anchorId` text (group; target for CategoryTabs: `pricing`, `builds`, `marketing`, `process`) · `allLink` linkField ("All questions, answered straight →"). FAQPage JSON-LD from rendered items. Variants: 2.

**20. `CategoryTabs`** — p11 §Category nav (sticky under the header). Fields: `ariaLabel`. Tabs are derived from the `AccordionFAQ` `group` blocks on the same page (their `heading` + `anchorId`), so tabs can never drift from the groups. Variants: 1.

**21. `LinkStack`** — p17 §Link in bio (one design section containing CLAUDE.md's identity strip → links → socials; design order: identity → Book a call → Follow → On the site). Fields: `identity` group `{ showStudyMetric checkbox, fallbackLine ✓ }` (R3: "+212%" only from a published study) · `primary` group `{ link linkField ✓, capacity scarcityRef() default slots-line }` ("Book a call / Slots open 3/7", dominant) · `showSocials` checkbox (from site-settings) · `links` array `{ link linkField, icon select chart-line-up/quotes/envelope-simple/file-text/arrow-right }` (The work, Clients, Newsletter) · `latestCaseStudy` checkbox (toggleable, CLAUDE.md p17) · `currentPush` group `{ show, link linkField, icon }` (**restored**, R2). Variants: 1.

**22. `PostList`** (new, X8) — p16 §Sample content. Fields: eyebrow ("Recent issues") · `track` select (default newsletter-issue) · `featureLatest` checkbox ("Latest — Issue 012 / New") · `limit` · `archiveLink` linkField ("Full archive →") · `emptyHeading`, `emptyBody` (designed empty state when no issue is published; see Q3). Variants: 1.

### 8.6 Page-level
**23. `Error404`** — p21 (the reserved `404` page doc, rendered by `not-found.tsx`). Fields: `code` ("404") · heading ("This page leaked.") · `body` · `links` array 1–3 `linkField` (Book a Call, Home, Work). Variants: 1.

Not blocks: `ReadingProgress` (page flag, X6), breadcrumb (Hero sub-field), site header/footers (navigation global + page variants), `VideoTile` (component, X4).

---

## 9. Page-section → block mapping (effective order, R2)

Order = the final design's `data-screen-label` order, with CLAUDE.md-required sections the design dropped **reinserted** (marked **R**) and extra design sections kept (marked **+**). Rows marked **chrome** are the header/footer, not blocks. Templates (T) render the listed block component from document fields.

**p1 Homepage** (`Homepage.dc.html`) — pages doc `home`
| # | Section | Block · variant |
|---|---|---|
| 1 | Hero | Hero · typographic (badge, 2 CTAs, pricingNote, verticalMicrocopy) |
| 2 | Proof strip (scarcity + 6 logos; CLAUDE.md's Scarcity strip and Client logo strip, merged in the design) | ProofStrip · scarcity |
| 3 | Featured case studies | CaseStudyCards · cards (fallback ledger) |
| 4 | Mini CTA | MiniCTAStrip · band |
| 5 | What we do | TwoTrackPanels · equal |
| 6 | Process (8-beat) | PhaseTimeline · accordion |
| 7 | Founder #1 "Who you'd work with" (= CLAUDE.md founder/team + about) | TeamIntro · intro |
| 8 | Testimonials (3 + "A study in full") | TestimonialRow · row |
| 9 | **+** Founder #2 "One founder, no layers." | TeamIntro · founder-card |
| 10 | Final CTA (restates capacity) | FinalCTA |
| — | Footer standard | chrome |

**p2 Case Study** (`Case Study.dc.html`) — T `case-studies`
| # | Section | Block · variant |
|---|---|---|
| 1 | Article header + **R** oversized metric + **R** browser-framed visual | Hero · article |
| 2 | Article body (01 Before / 02 Strategy / 03 Results narrative) | RichContent · article |
| 3 | Results table | MetricEvent · table |
| 4 | Client voice (video-first, text fallback) | TestimonialRow · client-voice |
| 5 | **+** Next study | CaseStudyCards · next-link |
| 6 | Newsletter CTA | NewsletterBand · band |
| 7 | Final CTA | FinalCTA |
| — | Footer standard; reading progress on | chrome |

**p3 Work** (`Work.dc.html`) — pages `work`
| # | Section | Block · variant |
|---|---|---|
| 1 | Work hero (+ aggregates; mobile §Aggregates is the same data) | Hero · typographic (stats) |
| 2 | Study ledger → case study grid **R** staggered + Load More + fallback | CaseStudyCards · ledger/staggered (Q1), loadMore, fallback ledger |
| 3 | **+** Proof pull | TestimonialRow · row |
| 4 | Newsletter CTA | NewsletterBand · band |
| 5 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p4 Services Hub** (`Services Hub.dc.html`) — pages `services`
| # | Section | Block · variant |
|---|---|---|
| 1 | Services hero + **R** phase timeline visual | Hero · typographic (phaseStrip) |
| 2 | Two doors (track split) | TwoTrackPanels · equal |
| 3 | Why both together | TwoTrackPanels · contrast |
| 4 | Newsletter CTA (moved up in design) | NewsletterBand · band |
| 5 | **+** The arc | PhaseTimeline · arc |
| 6 | **+** How it starts | PhaseTimeline · steps |
| 7 | Featured proof (featured case study pull, fallback) | TestimonialRow · row (studyCard) |
| 8 | FAQ mini | AccordionFAQ · mini |
| 9 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p5 Shopify Theme Development** (`Shopify Theme Development.dc.html`) — pages `services/shopify-theme-development`
| # | Section | Block · variant |
|---|---|---|
| 1 | **+** Breadcrumb + Dev hero (one ink band) | Hero · service (pricingNote) |
| 2 | **R** Where people usually start (Revision primary / Scratch soft) — after the hero, per CLAUDE.md order | TwoTrackPanels · primary-secondary |
| 3 | **+** Template anatomy | SpecLedger · cards |
| 4 | Specification (= What's included, "builds start at $5K" inline) | SpecLedger · expandable |
| 5 | Build run (Phase 1 process) | PhaseTimeline · build-run |
| 6 | Proof (fallback) | CaseStudyCards · cards (track build, fallback testimonials) |
| 7 | FAQ mini | AccordionFAQ · mini |
| 8 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p6 Marketing** (`Marketing.dc.html`) — pages `services/marketing`
| # | Section | Block · variant |
|---|---|---|
| 1 | **+** Breadcrumb + Marketing hero | Hero · service (pricingNote "Engines start at $1K/mo") |
| 2 | Signal flow (= Engine overview) | SpecLedger · signal-flow |
| 3 | Channel specification (= Engine components) | SpecLedger · expandable |
| 4 | Engine rollout (Phase 2 framing, Phase 3 endpoint) | PhaseTimeline · engine-rollout |
| 5 | Camera work (camera differentiator + GBP visual) | SpecLedger · cards |
| 6 | **R** Proof (fallback) — after the engine sections, before FAQ (CLAUDE.md p6 order; the design's `fallbackStrip` JS exists) | CaseStudyCards · cards (track growth, fallback metric-strip) |
| 7 | FAQ mini | AccordionFAQ · mini |
| 8 | Final CTA | FinalCTA (engines-line) |
| — | Footer standard | chrome |

**p7 Testimonials** (`Testimonials.dc.html`) — pages `testimonials`
| # | Section | Block · variant |
|---|---|---|
| 1 | Testimonials hero | Hero · typographic (showAggregateRating) |
| 2 | Testimonial feed (= brand showcase: per-client metric, video + quote, logo when set, case-study deep link) | ReviewWall · feed |
| 3 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p8 About** (`About.dc.html`) — pages `about`, readingProgress on
| # | Section | Block · variant |
|---|---|---|
| 1 | Article header (founder-forward) | Hero · article (stats, full-bleed media) |
| 2 | Article body: 01 Story · 02 How we work (three phases, independence terminal) · 03 Values | RichContent · article |
| 3 | **+** Company facts | MetricEvent · facts |
| 4 | Founder | TeamIntro · founder-card |
| 5 | **R** Logo strip at launch (case study pull later) — after Founder, before Final CTA (CLAUDE.md p8 order) | CaseStudyCards · cards (fallback logo-strip) |
| 6 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p9 Book a Call** (`Book a Call.dc.html`) — pages `book-a-call`
| # | Section | Block · variant |
|---|---|---|
| 1 | Book hero (what the call is and isn't) | Hero · typographic |
| 2 | Booking widget (desktop) / Booking flow (mobile → link-out, R8) | BookingEmbed |
| 3 | Pre-call homework form | FormEmbed · standard |
| 4 | What happens next (book → homework → call) | PhaseTimeline · steps |
| 5 | Social proof strip | TestimonialRow · row |
| 6 | **R** Quick-question escape line to Contact (in the design it sits at the foot of §Social proof; own block for a 1:1 map) | MiniCTAStrip · inline |
| — | Footer reduced-nav | chrome |

**p10 Thank You** (`Thank You.dc.html`) — pages `thank-you`, noindex
| # | Section | Block · variant |
|---|---|---|
| 1 | Confirmation | Hero · typographic (no CTAs) |
| 2 | Homework reminder (conditional) | FormEmbed · reminder |
| 3 | While-you-wait (newsletter at launch) | NewsletterBand · band |
| — | Footer reduced-nav | chrome |

**p11 FAQ** (`FAQ.dc.html`) — pages `faq`, readingProgress on
| # | Section | Block · variant |
|---|---|---|
| 1 | FAQ hero | Hero · typographic |
| 2 | Category nav | CategoryTabs |
| 3 | Pricing & Contracts (opens with the direct pricing answer) | AccordionFAQ · group (openFirst) |
| 4 | Builds | AccordionFAQ · group |
| 5 | Marketing | AccordionFAQ · group |
| 6 | Process & Trust | AccordionFAQ · group |
| 7 | Still have questions (Book a Call + Contact) | FinalCTA (2 buttons, capacity none) |
| — | Footer standard | chrome |

**p12 Contact** (`Contact.dc.html`) — pages `contact`
| # | Section | Block · variant |
|---|---|---|
| 1 | Contact hero (routing) | Hero · typographic |
| 2 | Contact form (name, email, reason, message) | FormEmbed · standard (mobile stepped) |
| 3 | Direct info + Map (one section in the design at both breakpoints) | DirectContact |
| — | Footer standard | chrome |

**p13 DEV-SEO** (`DEV-SEO Article.dc.html`) — T `posts` track dev-seo, reading progress on
| # | Section | Block · variant |
|---|---|---|
| 1 | Article header (Hero) | Hero · article |
| 2 | Article body (Problem framing + How Duha solves it + "How we do it" box) | RichContent · article |
| 3 | **+** DIY vs done (incl. desktop facts sub-strip) | RichContent · band |
| 4 | Proof (fallback) | CaseStudyCards · cards (from `proof`) |
| 5 | **R** Educational block — after Proof, before FAQ (CLAUDE.md p13 order) | RichContent · band |
| 6 | FAQ block | AccordionFAQ · mini (inline `faq`) |
| 7 | Newsletter CTA | NewsletterBand · band |
| 8 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p14 MKT-SEO** (`MKT-SEO Article.dc.html`) — T `posts` track mkt-seo, reading progress on
| # | Section | Block · variant |
|---|---|---|
| 1 | Article header (Hero) | Hero · article |
| 2 | Article body (The teach) | RichContent · article |
| 3 | DIY vs done-for-you bridge | RichContent · band |
| 4 | **R** How Duha does it — moved out of the body to follow the bridge (CLAUDE.md p14 order) | RichContent · band (`howWeDoIt`) |
| 5 | Proof (fallback) | CaseStudyCards · cards (from `proof`) |
| 6 | FAQ block | AccordionFAQ · mini (inline `faq`) |
| 7 | Newsletter CTA | NewsletterBand · band |
| 8 | Final CTA | FinalCTA (engines-line) |
| — | Footer standard | chrome |

**p15 Campaign LP** (`Campaign LP.dc.html`) — pages `lp/<campaign>`, zeroLeakage, noindex
| # | Section | Block · variant |
|---|---|---|
| — | LP header (logo only) | chrome (`headerVariant: logo-only`) |
| 1 | Hero — VSL variant **or** static typographic variant (the design shows both stacked as a template; one per page, matched to the ad) | Hero · vsl / typographic (with CTA) |
| 2 | Proof strip | ProofStrip · metrics |
| 3 | **R** CTA repeat | MiniCTAStrip · button |
| 4 | Offer / promise (with CTA) | OfferBlock |
| 5 | Case study pull (fallback) | CaseStudyCards · cards (fallback metric-strip) |
| 6 | **R** CTA repeat | MiniCTAStrip · button |
| 7 | Testimonial (with CTA) | TestimonialRow · row (cta) |
| — | Legal-only footer | chrome |

**p16 Newsletter** (`Newsletter.dc.html`) — pages `newsletter`
| # | Section | Block · variant |
|---|---|---|
| 1 | Hero + Signup form above the fold (CLAUDE.md's two sections; the design puts the form inside the hero) | Hero · typographic (form, stats) |
| 2 | Sample content cards (Recent issues) | PostList |
| 3 | Social proof slot ([N] subscribers + reader quote) | TestimonialRow · row (leadMetric) |
| — | Footer standard | chrome |

**p17 Link-in-Bio** (`Link-in-Bio.dc.html`) — pages `links`, headerVariant none, noindex
| # | Section | Block · variant |
|---|---|---|
| 1 | Link in bio: identity → Book a Call (dominant, slots) → Follow (socials) → On the site (work, clients, newsletter, latest case study toggle, **R** current push) | LinkStack |
| — | Legal-only footer | chrome |

**p18 Lead Magnet** (`Lead Magnet.dc.html`) — T `lead-magnets`, noindex
| # | Section | Block · variant |
|---|---|---|
| — | LM header (logo only) | chrome |
| 1 | Hero + capture form (capture state) | Hero · typographic (form) |
| 2 | What's inside | SpecLedger · list |
| 3 | Delivery/thank-you state + newsletter cross-sell (replaces 1–2 after submit) | NewsletterBand · cross-sell |
| — | Legal-only footer | chrome |

**p19 Review Hub** (`Review Hub.dc.html`, desktop only; mobile from the system, R7) — pages `reviews`
| # | Section | Block · variant |
|---|---|---|
| 1 | Review hero (aggregate rating) | Hero · typographic (showAggregateRating) |
| 2 | Review wall (staggered) | ReviewWall · wall |
| 3 | Case study cross-links (fallback) | CaseStudyCards · cards (fallback note) |
| 4 | Final CTA | FinalCTA |
| — | Footer standard | chrome |

**p20 Legal** (`Legal.dc.html`) — pages `privacy`, `terms`, `cookies`, `gdpr`
| # | Section | Block · variant |
|---|---|---|
| 1 | Legal document (desktop: sidebar + body; mobile: §Legal head + §Section nav + body) | RichContent · legal |
| — | Footer standard | chrome |

**p21 404** (`404.dc.html`) — pages `404`, noindex
| # | Section | Block · variant |
|---|---|---|
| 1 | Branded error state (Home, Work, Book a Call) | Error404 |
| — | Footer standard | chrome |

### 9.1 Coverage check (pages × blocks)

| Block | Pages (incl. templates) | Uses |
|---|---|---|
| Hero | 1, 2T, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13T, 14T, 15, 16, 18T, 19 | 18 |
| FinalCTA | 1, 2T, 3, 4, 5, 6, 7, 8, 11, 13T, 14T, 19 | 12 |
| CaseStudyCards | 1, 2T, 3, 5, 6, 8, 13T, 14T, 15, 19 | 10 |
| TestimonialRow | 1, 2T, 3, 4, 9, 15, 16 | 7 |
| NewsletterBand | 2T, 3, 4, 10, 13T, 14T, 18T | 7 |
| RichContent | 2T, 8, 13T (×3), 14T (×3), 20 | 9 |
| AccordionFAQ | 4, 5, 6, 11 (×4), 13T, 14T | 9 |
| PhaseTimeline | 1, 4 (×2), 5, 6, 9 | 6 |
| TwoTrackPanels | 1, 4 (×2), 5 | 4 |
| SpecLedger | 5 (×2), 6 (×3), 18T | 6 |
| MiniCTAStrip | 1, 9, 15 (×2) | 4 |
| MetricEvent | 2T, 8 | 2 |
| TeamIntro | 1 (×2), 8 | 3 |
| FormEmbed | 9, 10, 12 | 3 |
| ProofStrip | 1, 15 | 2 |
| ReviewWall | 7, 19 | 2 |
| OfferBlock, BookingEmbed, DirectContact, CategoryTabs, LinkStack, PostList, Error404 | 15, 9, 12, 11, 17, 16, 21 | 1 each |

**23 / 23 blocks used, 0 orphans. 111 block sections across 21 pages (plus chrome rows), every one mapped to exactly one block.**
- **Restored as their own sections (8):** p5 Where people usually start, p6 Proof, p8 Logo strip, p9 escape line, p13 Educational, p14 How Duha does it, p15 CTA repeats ×2.
- **Restored inside an existing section (5):** p2 hero metric and browser frame, p3 staggered grid + Load More + fallback, p4 hero phase visual, p17 current push.
- **Extra design sections kept (10):** p1 Founder #2, p2 Next study, p3 Proof pull, p4 The arc and How it starts, p5 Breadcrumb and Template anatomy, p6 Breadcrumb (both breadcrumbs folded into the Hero row), p8 Company facts, p13 DIY vs done.

---

## 10. Hooks inventory

*Erratum 2026-10-17 (C7 rework): publish-time rules (e.g. case-studies `figuresApproved`) are implemented as field `validate` functions plus an `afterChange` backstop, not `beforeChange` throws — same behaviour, all errors reported together.*

| Where | Hook | Purpose |
|---|---|---|
| `users` | `beforeChange` | First user → `role: admin`; API key allowed only for `pipeline`; `role` field access admin-only |
| `users` | `beforeLogin` | Reject interactive login for `pipeline` |
| `media` | field `validate` on `alt` | Alt required, not blank, not a file name |
| `pages`, `case-studies`, `posts`, `lead-magnets` | `beforeChange` | `publishedAt` on first publish |
| `pages` | `beforeValidate` | `zeroLeakage` enforcement |
| `case-studies` | `beforeChange` | Block publish unless `figuresApproved` |
| `case-studies`, `posts` | `beforeChange` | `readTime` fill from body |
| `posts` | `beforeChange` | Pipeline can never produce `_status: published` |
| `scarcity` | `validate` + `beforeValidate` | Reason required, keys unique, `activeClients ≤ capacity` |
| `testimonials` | field `validate` | Video needs URL + poster; Google needs `sourceUrl` + `verbatim` |
| `lead-magnets` | field `validate` | Exactly one of file / URL |
| any `headlineFields()` | field `validate` | `accentPhrase` is a substring of `heading` |
| `form-submissions` | `beforeChange` (create) | Stamp `eventId`; `deliveryStatus: pending` if the form sends an event |
| `form-submissions` | `afterChange` (create) | Enqueue the integration job (automation-engineer unit) |
| all public collections + 4 globals | `afterChange` / `afterDelete` | Revalidation (below). Guarded with `req.context.disableRevalidate` for seed runs |

**Revalidation map** (integrator wires; tag-based so every surface that pulls a collection refreshes): `pages` → path of the page; `case-studies` → `/work`, `/work/<slug>`, tag `case-studies` (every CaseStudyCards / study card / LinkStack); `posts` → `/insights/<slug>`, tag `posts` (PostList); `testimonials`, `clients`, `faqs`, `team-members` → their tags; `lead-magnets` → `/resources/<slug>`; globals → layout-wide tag (`site-settings`, `navigation`, `scarcity` render on most pages); `redirects` → redirect cache tag. The `(frontend)` segment is `force-dynamic` (D§F), so this is a safety net for any cached query, not the primary mechanism.

---

## 11. Phase 3 notes (for the PM's unit queue)

*Erratum 2026-10-17 (C10): `pages.layout` cannot ship empty in Payload 3.91.0 (admin crashes on `blocks: []`). It is added with the first block via `pageLayoutField([...])`; same intent, starts absent rather than empty.*

- Suggested unit order: access helpers + `users` → `media` + `downloads` → `clients`, `team-members`, `testimonials`, `faqs` → `case-studies` → `posts` → `lead-magnets` → `pages` (needs blocks registered progressively; the `layout` field starts with the first cleared block) → globals → plugin configs (form-builder overrides, redirects, seo).
- Each unit: `pnpm payload generate:types` (clean), then `pnpm payload migrate:create <unit-name>` before commit. Expected non-trivial migration: `users.roles` → `users.role` (§6.11).
- Postgres identifier length: nested block selects inside `pages_blocks_*` tables can exceed 63 characters; set `enumName`/`dbName` where the generated migration shows truncation.

---

## 12. Open questions for the human

1. **Work grid (p3):** R2 restores the "staggered grid + Load More + fallback", but the design's §Study ledger is a numbered table of the same studies. Showing both would list every study twice. Should p3 use the **ledger** look (with Load More + fallback added) or the **staggered card grid**? The schema supports both through one `layout` field, so this is a one-click choice either way.
2. **Homework form "off at launch" (p9/p10):** the Decision log says the *event* is off (submissions are still stored and shown in the admin), while MERGED R17 says "form is off at launch". Is the form **visible and storing submissions with no secretary event** (what this schema does via `forms.sendEvent = false`), or should the p9/p10 homework sections be **hidden** at launch?
3. **Newsletter issues (p16):** "Read issue 012" and "Full archive →" link to pages that have no design. Do issues get a public web page (e.g. `/newsletter/<slug>`, rendered with the article template), or are the p16 cards display-only until there is an archive? And at launch, when no issue is published, what should p16 §Sample content show? (The schema has an empty-state heading/body; "coming soon" copy is not allowed.)
4. **Scarcity counts:** the design says "3 builds in progress", "3 engines running" and "Slots open 3/7" as if they were one number. Is the cap of 7 counted per **client** (one client with a build and an engine takes one slot)? The schema keeps three counts (active clients, builds, engines) and one cap; confirm that's how you count.
5. **Video hosting:** p7 video testimonials and the p15 VSL need a video source. Media is local disk behind a Cloudflare tunnel, and Cloudflare's terms limit serving video through its CDN outside Stream. Proposal: videos are linked from a host you choose (YouTube unlisted, Vimeo, or similar), with the poster image on our disk. Which host?
6. **Thank You copy with link-out booking:** the original tab reaches `/thank-you` the moment the visitor clicks "Book your call", **before** they actually book in Nextcloud. So "Call booked. Invite's in your inbox." (p10 design) may be untrue. Is reworded copy fine, e.g. "Finish booking in the new tab — then do the homework"? This is copy only; no schema change.

---

## Delta log

### 2026-10-18 — mini Gate S (approved by the human)
1. `lead-magnets.asset` and `lead-magnets.deliveryEmail`: field-level read access = staff only (public and pipeline never see the file link or email text; the lead-magnet delivery job reads with `overrideAccess`).
2. `lead-magnets.whatsInsideHeading`: new text field for the "What's inside" heading (design default copy as `defaultValue`).
3. Delete access on `posts`, `lead-magnets`, `pages`: admin any; marketing only when the doc is not published (same rule as `case-studies`). Supersedes §4.3 "staff delete" for these three.
4. No change: the pipeline keeps read access to staff drafts layered on its own `posts`.

### 2026-10-21 — mini Gate S (approved by the human)
1. `downloads` read access = staff only (supersedes §6.10 "read public"). Lead-magnet files are sent as email attachments by the lead_magnet job (`overrideAccess`); no public list or file URL.
