# Service pages redesign: implementation plan (PM, 2026-11-09)

The visual spec is `README.md` in this folder plus `Build.dc.html` and `Marketing.dc.html`. This file covers how to build it. The owner approved the design and ordered it built ("Go ahead and build."). That order is also the one-line mini Gate S for the additive schema delta below. The shape follows `design-reference/services-a-2026-11-09/IMPLEMENTATION.md` and `design-reference/home-b-2026-11-09/IMPLEMENTATION.md`.

## PM decisions (binding for every unit)

- **S1. No new blocks.** Every section is an existing block with a new variant or a new field. Each default keeps today's rendering on every other page.
- **S2. Copy.** Verbatim from the artboards, except for README P1–P7 and these items:
  - **Fine print.** The marketing plans fine print keeps the LIVE definition (same rule as /services D4): "Online revenue is the total money taken through your online store, not counting refunds, chargebacks, shipping and losses. Online profit is gross profit: online revenue minus the cost of the products sold." The live first sentence ("Ad spend and influencer costs are paid by you, separately.") is dropped here because the section intro already says it.
  - **FAQ answers** are never touched (P6). Questions are picked by their exact stored text.
  - **Terms (marketing page).** Use the artboard wording. /services is not changed.
- **S3. Hero.** Both pages move from the `service` variant to `typographic` (the /services look). The at-a-glance card is a new Hero field. It replaces the proof line and does not use `stats`. The breadcrumb becomes a light micro line above the eyebrow with two crumbs: "Services" (/services) and the page name. The third crumb ("Phase 01 — …") is dropped. The `$7K` card value is an owner-approved exception to the inline-pricing rule (log with the home B `$7K` exception).
- **S4. Exclusive accordions site-wide.** Native `<details name="…">`, one name per FAQ block and per Terms list, made with React `useId()`. No JS. Icon "+" closed / "–" open (CSS `group-open`), replacing today's rotate-to-×. FAQPage JSON-LD unchanged.
- **S5. Restraint.** New sections never use the 2px ink border. It stays on the hero card, the revision table and the existing PricingPlans build box only. Grey cards are `bg-gray-light`, no border. FinalCTA is the only ink band, so Build's FinalCTA `accentPhrase "scoped"` is cleared (no wine on ink). `bg-white`/`text-white` do not exist in this theme; use `bg-cream`.
- **S6. Revision table on phones.** Stacked rows, PricingPlans precedent (CSS restyle of ONE semantic `<table>`, cells labelled by `data-label`). Not the artboard's sideways-scrolling table.
- **S7. Orphans.** Old variants stay in the schema; nothing dropped; logged (see Orphans).
- **S8. Seed.** `src/seed/pages.ts` NOT updated (2b09e98 / D7 precedent). The data migration is the source of truth.
- **S9. Anchors.** One shared `anchorIdField()` helper: reserved ids + clashes with any earlier `anchorId` in the same layout. All new `anchorId` fields use it; the three existing ones (PricingPlans, PhaseTimeline, AccordionFAQ) switch to it inside their own units. Same field name, no DB change. Closes the home B open item "PhaseTimeline anchorId lacks reserved/clash check".
- **S10 (owner-default decisions, PM 2026-11-09).** (a) Marketing proof slot ships the existing fallback (quiet note under "Proof, in their words") until a testimonial is published. (b) The +/– icon applies site-wide. (c) /services Terms wording stays as is.

## Current live layout (local `duha_site_dev` matches prod shape from `20261108_013300_brochure_restructure`)

**/services/shopify-theme-development (page 62)**

| # | Block | Variant | Notes |
|---|---|---|---|
| 0 | hero | service | eyebrow "Phase 01 — build your store", accent "custom Shopify store", pricingNote, subNote, 1 stat "5 weeks", 3 crumbs |
| 1 | serviceSheet | page | brochure p2 sheet |
| 2 | twoTrackPanels | primary-secondary | "Most start with a revision.", conclusion = 72-hour line |
| 3 | phaseTimeline | build-run | 6 steps; tags; isSignOff on 01 and 05 |
| 4 | caseStudyCards | cards | source track [build-and-growth, build], limit 2, tone grey, fallback testimonials; renders Abu Oud as a single StudyPreview row |
| 5 | accordionFAQ | mini | category builds, limit 6, stacked |
| 6 | finalCTA | — | "Get the build scoped in writing.", accent "scoped", capacity builds-line |

**/services/marketing (page 63)**

| # | Block | Variant | Notes |
|---|---|---|---|
| 0 | hero | service | eyebrow "Phase 02 — grow your store", accent "grow it." |
| 1 | serviceSheet | page | brochure p3 sheet |
| 2 | caseStudyCards | cards | source track [build-and-growth, growth], fallback metric-strip, tone light; Abu Oud currently renders here |
| 3 | accordionFAQ | mini | category marketing, limit 6 |
| 4 | finalCTA | — | "One team. One person accountable.", capacity engines-line |

Facts checked in the local DB: all 13 artboard FAQ questions exist and are published (Build ids 49, 33, 31, 40, 32, 43, 50; Marketing ids 34, 35, 39, 29, 38, 51). No testimonial is published (19–25 drafts). The only published case study is Abu Oud (`build-and-growth`). Scarcity `builds-line` and `engines-line` already read as the artboard final-CTA lines.

## Mapping: Build (12 sections → 13 layout rows)

| # | Section | Block / variant | Kind | Row |
|---|---|---|---|---|
| 1 | Hero + at-a-glance card | hero `typographic` + new `glance` group + new `accentWine` + breadcrumb allowed on typographic | NEW FIELD | existing L0 |
| 2 | Jump-to index (7) | categoryTabs, new variant `jump` (`label`, `links[]`) | NEW VARIANT | new |
| 3 | Who it's for + fit card | serviceSheet, new presentation `fit`; groups `marker` (wine / outlined); `box.note` with `{link}`; anchorId "fit" | NEW VARIANT + FIELDS | existing L1 |
| 4 | Revision or scratch | twoTrackPanels, new variant `compare`; new `rows[]` {label, first, second} + `rowsLabel`; `intro` beside the head; `conclusion` under the table; anchorId "start" | NEW VARIANT + FIELDS | existing L2 |
| 5 | The six steps | phaseTimeline, new variant `detail`: phase-'0' steps = hairline strip; `closingLine` = schedule line under the strip; rows with numeral, title, detail, sign-off line (`isSignOff` + `tag`), new step fields `you` / `youGet` / `accent`, block `youLabel` / `youGetLabel`; anchorId "steps" | NEW VARIANT + FIELDS | existing L3 |
| 6 | Where the hours go | twoTrackPanels, new variant `bar`: panel `title` = segment label, `stats[0].value` = "~30", `body` = caption, new panel `share` (flex weight), `accentTitle` = wine segment; `intro` beside the head; anchorId "hours" | NEW VARIANT + FIELD | new |
| 7a | What you get + You own it | serviceSheet, new presentation `deliverables`: head on top, `differentiators.rows` left (4 rows, P1), grey `box` right (label, bold body, `note` with `{link}`); anchorId "get" | NEW VARIANT | new |
| 7b | Preferred tools · Build | specLedger tools `tiles`, `BUILD_TOOLS` from `servicesCopy.ts` | REUSE | new |
| 8 | The work, up close | caseStudyCards (single study → StudyPreview) + eyebrow "The work, up close" + new `centerFacts` + new `spacing: tight` (64/40) | NEW FIELDS | existing L4 |
| 9 | Price | pricingPlans, new `layout: build` (head left, build box right); new `build.rows[]` {label, value, link}; solid `nextLink`; anchorId "price" | NEW VARIANT + FIELD | new |
| 10 | Then we grow it | richContent `band`, new `bandLayout: split` (site width, text left, ghost button right, accent wine) | NEW FIELD | new |
| 11 | Build questions (7) | accordionFAQ mini, `layout: split`, source selected, limit 7, new `accentPhrase` "answers.", anchorId "faq" (condition widened to mini) | NEW FIELD | existing L5 |
| 12 | Final CTA | finalCTA (live); accentPhrase cleared | REUSE | existing L6 |

## Mapping: Marketing (13 sections → 13 layout rows)

| # | Section | Block / variant | Kind | Row |
|---|---|---|---|---|
| 1 | Hero + at-a-glance card | hero `typographic` + `glance` + `accentWine` | NEW FIELD | existing L0 |
| 2 | Jump-to index (7) | categoryTabs `jump` | NEW VARIANT | new |
| 3 | Who it's for + card | serviceSheet `fit` (one group; `box.note` "No store yet? {link}." link "Start with the build"); anchor "fit" | NEW VARIANT | existing L1 |
| 4 | How a month runs | phaseTimeline, new variant `cells`: grey band, 4 white hairline cells; cell label = `number · tag` (wine when `accent`), h3 title, detail; `intro` beside head; `closingLine` "Filming is in person, in Chicago." (P3); anchor "month" | NEW VARIANT | new |
| 5 | Ads first, then the numbers decide | phaseTimeline, new variant `flow`: phase '1' steps = grey panels with decorative arrows, phase '2' steps = outcomes column, `closingLine` bold; anchor "start" | NEW VARIANT | new |
| 6 | The toolkit | specLedger tools, new `toolsLayout: catalog`; new item `groupLabel` (new value starts a new group); ToolsGrid-style head (eyebrow, wine-accent H2, note right); footnote; anchor "toolkit"; items maxRows 12→16 | NEW VARIANT + FIELD | new |
| 7 | Who does what | serviceSheet, new presentation `duties`: grey band, `why.body` paragraph, two groups (marker `ink` You, `wine` Us; >6 items → 2 columns from md); anchor "who" | NEW VARIANT | new |
| 8 | Your first two quarters | phaseTimeline, new variant `ruled`: white band, hairline top/bottom, left dividers, micro tag + bold title + muted detail, intro under H2 | NEW VARIANT | new |
| 9 | Plans and terms | pricingPlans, new `layout: plans`: wine plans box full width (existing table + figures + fine print); terms left, statement + marketing ghost `nextLink` right; anchor "plans" | NEW VARIANT | new |
| 10 | Proof (fallback) | caseStudyCards: track [growth] only (Abu Oud stops matching), `fallbackMode: testimonials`, fallbackEyebrow "Proof, in their words", fallbackHeading null, tone grey, `spacing: tight` | NEW FIELD (spacing) | existing L2 |
| 11 | Marketing questions (6) | accordionFAQ mini split, selected 6, accent "answers.", anchor "faq" | NEW FIELD | existing L3 |
| 12 | No store yet? First, we build it. | richContent band `split` | NEW FIELD | new |
| 13 | Final CTA | finalCTA; heading → "Start with a call, leave with a plan." | REUSE | existing L4 |

**Jump index = CategoryTabs variant, not a new block or page field.** CategoryTabs already is a sticky in-page nav with a scroll-spy client island (`CategoryTabsNav.tsx`: IntersectionObserver, `aria-current="location"`, smooth scroll with reduced motion, plain anchors without JS). Variant `faq` (default) keeps /faq's derived tabs. Variant `jump`: hand-written `links[] {label, anchorId}`, `label` ("Jump to"), `ariaLabel` ("On this page"); numbers 01–07 from link order. RenderBlocks injects the set of `anchorId`s in the layout; links whose target is missing are dropped server-side with a warning. Only the nav island is `'use client'`.

## Wine accent on every section H2

| Block | Accent field today | Wine today? | Work |
|---|---|---|---|
| ServiceSheet | yes (`section`) | yes | new presentations use `accentColor="ground"` |
| PricingPlans | yes | yes | none |
| SpecLedger tools | yes (grid head) | yes in `grid` | `catalog` reuses the grid head |
| PhaseTimeline | yes | only `grid` | 4 new variants use ground |
| TwoTrackPanels | yes | only `equal` | `compare` / `bar` use ground |
| RichContent band | yes | no | ground only in `bandLayout: split` |
| AccordionFAQ | **no** | — | NEW `accentPhrase` (headlineFields + validateAccentPhrase); AccentHeadline ground in mini (stacked and split). Empty = /services and /faq unchanged |
| Hero typographic | yes | only with `accentLine` | NEW `accentWine` checkbox (wine inline); accent field shows when `accentLine` or `accentWine` is on |
| CaseStudyCards | via StudyPreview | yes | none |
| FinalCTA | yes | wine on ink | data: clear Build's accent (S5) |

## Units, split by file (no two units touch the same file)

**Unit 0: integrator. Wave 0.**
- `src/lib/servicePagesCopy.ts`: all copy, verbatim. Untyped `as const`; unit F adds `satisfies Partial<…Block>`. Re-export `BUILD_TOOLS` from `servicesCopy.ts`; do not duplicate.
- `src/showcase/servicePages/{index.ts,unitA.ts,unitB.ts,unitC.ts,unitD.ts,unitE.ts}`: stubs exporting empty arrays.
- One import + spread line in `src/showcase/registry.ts`.

**Unit 0b: schema-architect. Wave 0, parallel with 0.**
- New `src/fields/anchorId.ts` exporting `anchorIdField({ condition?, defaultValue?, description })`: reserved ids from `src/lib/anchors.ts` + clash check against every earlier layout row's `anchorId` (path logic as `AccordionFAQ/config.ts` L45–55, widened to any blockType). Config-safe: no React, no `@/` imports.
- Check identifier lengths of the field list below (dbNames given).

**Unit A: block-coder. Hero + jump nav + breadcrumb JSON-LD.**
Files: `src/blocks/Hero/{config.ts,Component.tsx}`, new `src/blocks/Hero/HeroGlance.tsx`, `src/blocks/CategoryTabs/{config.ts,Component.tsx,CategoryTabsNav.tsx}`, `src/components/BreadcrumbJsonLd.tsx`, `src/components/RenderBlocks.tsx`, `src/showcase/servicePages/unitA.ts`.
- Hero `glance` group: `title`, `rows[]` (max 5: `label`, `value`, `accent`), `footer`. Desktop: aside in a `7fr/4fr` grid; `bg-cream border-2 border-ink shadow-lift`; rows as `<dl>`; Archivo 32px values; grey footer band. Below lg: stacks after the CTAs. Takes the place of the `stats` aside; if both set, glance wins + warning.
- Hero `accentWine` checkbox. Breadcrumb condition widened to typographic; `<Breadcrumb tone="light">` above the eyebrow; `heroCrumbs()` accepts `typographic`.
- CategoryTabs: `variant` (`faq` default / `jump`), `label` (default "Jump to"), `links[]` {label, anchorId}. Jump look: cream bar, 1px hairline top, 2px ink bottom, menu icon, label, divider, grey numbers, 4px wine inset underline on `aria-current`, sideways scroll on phones, sticky at `top-header-mobile md:top-header`. Spy offset per variant (≈72+60+24 / 60+52+16).
- RenderBlocks: inject `pageAnchors` for `categoryTabs` rows.

**Unit B: block-coder. Accordions + pricing.**
Files: `src/blocks/AccordionFAQ/{config.ts,Component.tsx}`, `src/blocks/PricingPlans/{config.ts,Component.tsx}`, `src/showcase/servicePages/unitB.ts`.
- AccordionFAQ: S4 `useId()` group name in `GroupFaq` and `AccordionFAQItemsView` (sync components; the async `AccordionFAQBlock` must not call hooks), passed to `FaqRow` as `name`; +/– icon. New `accentPhrase`. `anchorId` via helper, condition widened to mini; section `id` + `scroll-mt-31 md:scroll-mt-34` in stacked and split.
- PricingPlans: Terms get `name` + S4 icon. New `layout` select (`overview` default = today / `build` / `plans`). New `build.rows[]` {label, value, `linkField('link')`}, `dbName: 'pp_build_rows'`; link renders after the value. `anchorId` → helper (default 'pricing' kept). Head's 2px rule only in `overview`.

**Unit C: block-coder. PhaseTimeline.**
Files: `src/blocks/PhaseTimeline/{config.ts,Component.tsx,shared.tsx}`, new `PhaseDetail.tsx`, new `PhaseCells.tsx` (`cells` + `ruled`), new `PhaseFlow.tsx`, `src/showcase/servicePages/unitC.ts`.
- Variants ADD VALUE `detail`, `cells`, `ruled`, `flow`. Step fields `you`, `youGet` (text), `accent` (checkbox). Block `youLabel` (default "You"), `youGetLabel` (default "You get").
- Conditions widened: `phases`/`phase` to new variants; `tag` to all four; `isSignOff` to `detail`; `closingLine`, `intro`, `anchorId` (helper) to all four.
- Semantic `<ol>`, h3 titles; `detail` rows use `<dl>` for You / You get. `detail` numerals grey, wine when `accent`. No 2px ink strip (hairline cells).

**Unit D: block-coder. ServiceSheet + SpecLedger.**
Files: `src/blocks/ServiceSheet/{config.ts,Component.tsx}`, `src/blocks/SpecLedger/{config.ts,Component.tsx}`, `src/showcase/servicePages/unitD.ts`.
- ServiceSheet: `presentation` ADD VALUE `fit`, `deliverables`, `duties`. New `anchorId`. New `box.note` (textarea; `{link}` replaced by `box.link`, else link at end). New group `marker` select on `ss_incl_groups` (`wine` default / `ink` / `outlined`). Grey card, no border (S5). Section eyebrows keep the wine tick.
- SpecLedger: `toolsLayout` ADD VALUE `catalog`; new item `groupLabel` (condition catalog) + `anchorId`; items maxRows 12→16. Card: 28px logo on top (`TileMark`), bold name, grey line. Each group a hairline grid, auto-fill min 260px, 1 column on phones; empty tracks show no grey.

**Unit E: block-coder. TwoTrackPanels + CaseStudyCards + RichContent band.**
Files: `src/blocks/TwoTrackPanels/{config.ts,Component.tsx}`, new `TwoTrackPanels/{Compare.tsx,HoursBar.tsx}`, `src/blocks/CaseStudyCards/{config.ts,Component.tsx}`, `src/blocks/RichContent/{config.ts,Band.tsx}`, `src/showcase/servicePages/unitE.ts`.
- TwoTrackPanels: variants ADD VALUE `compare`, `bar`. New `rows[]` {label, first, second; `**bold**` via InlineBold}, `dbName: 'ttp_compare_rows'`, + `rowsLabel` (default "Compare"). New panel `share` (number). New `anchorId`. Widen panel `label`/`stats`/`accentTitle` conditions; panel `body` validator exempts `compare`. Compare: first column `gray-light` with 4px ink header bar; 2px ink outer border; stacked on phones (S6).
- CaseStudyCards: new `centerFacts` (→ `StudyPreview factsAlign="center"`) and `spacing` (`default` / `tight` = 64 top / 40 bottom from md), on the single-study path and Fallback paths.
- RichContent: new `bandLayout` (`stacked` default / `split`).

**Unit F: integrator. Last, alone.**
Files: `src/payload-types.ts`, schema + data migrations, `src/migrations/index.ts`, `src/lib/servicePagesCopy.ts` (types), `src/showcase/registry.ts` (cleanup), `PROGRESS.md` migrations log.

**Waves (max 3 parallel):** W0: 0 + 0b · W1: A, C, D · W2: B, E · W3: F · QA: qa-reviewer + seo-auditor.

Each unit adds showcase entries for every new variant/option in its own `unitX.ts`, with distinct anchor ids (e.g. `sp-fit`). Rules for every agent (same as /services): no git operations; no restarting the :3000 server (report Drizzle push prompts); `pnpm` = `npx -y pnpm@11.28.3`; Tailwind tokens only; banned-word list applies; 44px targets; every user-facing string is a field.

## Migrations (unit F)

**Schema:** `src/migrations/<generated>_service_pages_schema.ts/.json` via `pnpm payload migrate:create service_pages_schema`, on a SCRATCH DB migrated to HEAD, under a pty (`docs/dev.md`). Never against `duha_site_dev`. All additive on `pages` + `_pages_v`. Enum ADD VALUE: phase_timeline variant ×4; service_sheet presentation ×3; spec_ledger tools_layout `catalog`; two_track_panels variant ×2. New enums: category_tabs variant, pricing_plans layout, case_study_cards spacing, rich_content band_layout, ss_incl_groups marker. New tables: `hero_glance_rows`, `pages_blocks_category_tabs_links`, `pp_build_rows` (+ link rels path), `ttp_compare_rows`. Identifiers ≤ 63 chars. Keep the F88 down guard. Prove up / down / up.

**Data:** `src/migrations/<ts sorting AFTER the schema file>_service_pages.ts` (Migration order rule, 2026-11-08). Copy from `src/lib/servicePagesCopy.ts`. `patchPage` per page, guarded on the exact live shapes above (blockType + variant + length). FAQ ids looked up by question text, in artboard order. Lexical band bodies via `src/showcase/lexical.ts`. Clear rows the new presentations do not render (ServiceSheet numbers / nextStep / old groups; hero pricingNote / subNote / stats / badge `show:false`). `down` is a no-op.

**Loud failure** (no change to shared `contentPatch.ts`): a shape mismatch stays a WARN skip (idempotent re-run), logged with the found shape; a failure after the shape matched throws (own transaction → rollback → failed deploy, previous release keeps serving):

```ts
let shaped = false // set true as the first line inside the 'fn' op
const before = c.done.length
await patchPage(c, { slug, expect, ops: [['fn', (doc) => { shaped = true; /* … */ }]] })
if (shaped && c.done.length === before) throw new Error(`${slug}: shape matched but the write failed: ${c.skipped.at(-1)}`)
```

Also throw when the shape matched and any of the 13 FAQ questions is missing.

**Acceptance:** `tsc --noEmit` + lint clean; local data migration applies 2, re-run skips 2; `/_showcase` renders every new option; no banned words, no `[` placeholders.

## Orphans created (kept, nothing dropped)

Hero `service`; ServiceSheet `page`; TwoTrackPanels `primary-secondary`; PhaseTimeline `build-run`; CaseStudyCards `metric-strip` stays only on `lp/sample-campaign`. Existing orphans stay: TwoTrack `doors`, PhaseTimeline `steps`, ProofStrip `scarcity`, PhaseTimeline `accordion`, TeamIntro `intro`, `engine-rollout`.

## QA plan

**qa-reviewer** at 390 / 768 / 1440: both pages vs the artboards (order, restraint, wine H2 accents, hero card stacking on phones, no horizontal overflow at 390, 44px targets). Jump bar: sticky under the header without overlap; sideways scroll at 390; scroll-spy underline; clicks land clear of both bars; keyboard + reduced motion; no-JS anchors. Accordions: one open per group, first open on load, +/– follows state. Regression: /services (FAQ + Terms exclusive, rest identical), /faq (each group exclusive, tabs unchanged), home (TwoTrack equal, grid row, toolkit), /about + /work (CaseStudyCards), one post with an inline FAQ.

**seo-auditor** page scope, both pages: one h1; h2 per section, h3 inside; BreadcrumbList = 2 crumbs matching the visible trail; FAQPage = exactly the 7 / 6 rendered questions; unique DOM ids; jump links resolve; cross-links between the pages; meta title + description present.

## Risks

- Wide schema delta (~9 block configs): defaults keep today's render; regression QA; scratch up/down/up.
- A `dev push` prompt on enum ADD VALUE while units edit configs: report, do not restart.
- `<details name>` needs Safari 17.2+ / Firefox 130+; older browsers allow several open (harmless).
- Prod content edits before release change the shape → migration WARN-skips; post-release check must read "applied 2".
