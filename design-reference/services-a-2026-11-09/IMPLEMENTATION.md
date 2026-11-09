# /services direction A: implementation plan (PM, 2026-11-09)

The visual spec is `README.md` in this folder plus the three artboards. This file says HOW to build it.
The owner approved the design and said "implement everything" (2026-11-09). That is also the
one-line mini Gate S for the additive schema delta below.

## PM decisions (binding for every unit)

- **D1. Subpage logo standard goes site-wide now, in this change.** Every subpage hero
  (TypographicHero, ServiceHero, ArticleHero, FormCardHero, VslHero) puts the 28 px disc in front
  of its eyebrow label. The label stays grey caps (`<Eyebrow muted>`); the disc replaces nothing
  but leads it. On an ink background the disc is cream (same as `SiteLogo` on dark).
- **D2. Corner disc size.** 240 px desktop and 140 px mobile on the default-size typographic heroes
  that already show the corner shape (services, about, work share one rule, which is fine).
- **D3. Homepage is excluded** from D1 and D2. It is identified by the existing
  `verticalMicrocopy` / `featureShape` rule (`Hero/Component.tsx` ~L111).
- **D4. Copy.** Use the artboard text verbatim, with two exceptions:
  - The pricing fine print keeps the LIVE online-profit definition. Do not drop "gross profit:" or anything else from it.
  - FAQ answers stay exactly as stored in the `faqs` collection. They are shared with /faq; do not edit them.
- **D5. FinalCTA button** keeps the live wine-filled style. Only the heading changes.
- **D6. Orphans.** TwoTrackPanels `doors` and PhaseTimeline `steps` stay in the schema, with nothing dropped, and are logged as orphan variants.
- **D7. Seed.** `src/seed/pages.ts` is NOT updated (already stale for /services). The data migration is the source of truth.

## Current live /services layout (from the migrations; local DB matches)

| # | Block | Variant |
|---|---|---|
| 0 | hero | typographic |
| 1 | twoTrackPanels | doors |
| 2 | phaseTimeline | grid |
| 3 | specLedger | tools |
| 4 | pricingPlans | — |
| 5 | phaseTimeline | steps |
| 6 | testimonialRow | — |
| 7 | newsletterBand | — |
| 8 | accordionFAQ | mini |
| 9 | finalCTA | — |

## Mapping: no new blocks, only new fields and variants with defaults that preserve today's rendering

| Unit | Blocks / files | What changes |
|---|---|---|
| **A: Hero + logo standard** | `src/blocks/Hero/{config.ts,Component.tsx,ServiceHero.tsx,ArticleHero.tsx,FormCardHero.tsx,VslHero.tsx,heroMotion.css}`, new `src/blocks/Hero/HeroEyebrow.tsx`, `src/components/ui/AccentHeadline.tsx` | New `accentLine` checkbox: the accent phrase renders in wine on its own line. Allow the accent field on typographic when it is on. New `proofLine` textarea: `**bold**` is ink, the rest grey, with a hairline above. D1 eyebrow disc on every subpage hero. D2 corner disc. Update the comment at `Component.tsx` ~L132 about the eyebrow rule. |
| **B: Build/Grow + tools** | `src/blocks/ServiceSheet/{config.ts,Component.tsx}`, `src/blocks/SpecLedger/{config.ts,Component.tsx,toolLogos.ts}`, `public/brand/tools/{google,googlesearchconsole,claude}.svg` + `README.md` | ServiceSheet: see below. SpecLedger: see below. |
| **C: Process + pricing** | `src/blocks/PhaseTimeline/{config.ts,PhaseGrid.tsx,shared.tsx}`, `src/blocks/PricingPlans/{config.ts,Component.tsx}` | PhaseTimeline: see below. PricingPlans: see below. |
| **D: Proof + FAQ** | `src/blocks/TestimonialRow/{config.ts,Component.tsx}`, `src/components/StudyPreview.tsx`, `src/blocks/AccordionFAQ/{config.ts,Component.tsx}` | TestimonialRow: see below. AccordionFAQ: see below. |
| **E: Integration** (integrator) | `src/payload-types.ts`, schema migration + data migration + `src/migrations/index.ts`, new `src/lib/servicesCopy.ts`, `src/showcase/registry.ts` | One additive schema migration and one data migration (below), plus showcase entries for every new variant/option. |

### Unit B details

**ServiceSheet**
- New `presentation` select: `page` (default) / `section`. Section-only fields:
  - eyebrow + eyebrowTick
  - heading + accentPhrase
  - intro (lede)
  - numeral (desktop only)
  - `accent` checkbox (wine rule and numeral)
- In `section` mode:
  - 2 px rule under the head.
  - Lead-ins render "**Discovery.** text".
  - " / " in number captions renders as a line break.
  - `nextStep.link` renders as an underlined link at the end of the right column.
  - Top hairline.

**SpecLedger**
- New `toolsLayout` select: `row` (default) / `tiles`.
- `tiles` layout:
  - Grey caption heading.
  - auto-fill 200 px tiles: 32 px logo left, then name and grey `line` (the "what for" text).
  - Mobile: 2 per row, logo above name, 28 px.
- Items `maxRows` 10 → 12.
- New logo options:
  - `google`, `google-search-console`, `claude`: brand SVGs, copied from `./logos`.
  - `handshake`, `sparkle`: Phosphor Bold inline SVG (paths are in the artboards), `currentColor`, ink.

### Unit C details

**PhaseTimeline** (`grid` is used only on /services, so restyle it in place)
- Grey band with white cells.
- Step-0 strip (2 px ink border) from steps with new phase option `'0'`, labelled by `tag`.
- Phase 1 ink bar; Phase 2 wine bar.
- Explicit columns: Phase 1 = 6 at xl, 3 at lg; Phase 2 = 2.
- Mobile: 2 per row with 1 px divider gaps.

**PricingPlans** (/services only, restyle in place)
- Build box: 2 px ink border; `nextLink` renders as a solid button.
- Marketing box: 2 px WINE border with label "Grow your store".
- Plans:
  - One semantic table: table on desktop, CSS-restyled to one grey card per plan with a 4 px ink top bar on mobile.
  - New per-plan `figures` array {value, unit}, max 2, `dbName: 'pp_plan_figures'`. Two figures show "or" between them. Falls back to `first` text when empty.
  - "After that" is bold.
- New `marketing.nextLink` (ghost button).
- Terms render as closed `<details>`, max-w 760.

### Unit D details

**TestimonialRow / StudyPreview**
- New `studyCard.centerFacts` checkbox (default false) → `StudyPreview factsAlign="center"`: three equal columns, centred.
- When the heading is empty, an eyebrow is set and there are no cards, the eyebrow takes the heading slot and the study title becomes h2.

**AccordionFAQ**
- New `layout` select: `stacked` (default) / `split`.
  - Left: eyebrow, heading, `intro`, link.
  - Right: the questions.
  - Mobile: the link goes below the last question (grid order).
- New `intro` textarea.

Other pages that use these blocks must look IDENTICAL after the change:
- Hero: every page.
- ServiceSheet: /services/shopify-theme-development, /services/marketing.
- PhaseTimeline: home accordion, Shopify build-run, Marketing engine-rollout.
- TestimonialRow / StudyPreview: home, /work, LP, /newsletter, plus single-study CaseStudyCards (Shopify, Marketing, About, LP, Reviews).
- AccordionFAQ: Shopify / Marketing mini, /faq group, posts.

The only intended visible change elsewhere is D1/D2.

## Migrations (unit E)

### Schema migration

One schema migration, all additive (pages + `_pages_v`), generated ONCE after A–D land.
- Run `pnpm payload migrate:create services_redesign_schema` against a SCRATCH DB migrated to HEAD, under a pty (see `docs/dev.md` ~L189 and ~L3717). NEVER against the push-managed `duha_site_dev`.
- Every identifier must be ≤ 63 chars.
- Enum changes must be `ADD VALUE`.
- Keep the F88 down guard.
- Prove up / down / up.

### Data migration

`src/migrations/20261109_*_services_redesign.ts`. Its filename MUST sort after the schema file (Migration order rule, 2026-11-08).
- Uses `patchPage` (`src/lib/contentPatch.ts`).
- Copy lives in `src/lib/servicesCopy.ts`, verbatim from the artboards apart from D4.
- **Guard:** the exact current 10-block shape above. Anything else is skipped and logged, so the migration is idempotent.
- Look up FAQ ids by question text.

New layout:

| # | Block | Content |
|---|---|---|
| 0 | hero | Existing hero: new body, accentPhrase "Then we grow it.", accentLine, ctas [Book a Call, custom `/services#pricing` "See pricing"], proofLine |
| 1 | serviceSheet section | Build: numeral 01, captions with " / ", only "No templates", "See the build →" |
| 2 | specLedger tools tiles | "Preferred tools · Build", 5 tiles, no footnote |
| 3 | serviceSheet section | Grow, accent, numeral 02: "How it's paid" box with "See plans" → /services#pricing, only "One person accountable", "See the marketing →" |
| 4 | specLedger tools tiles | Existing block: "Preferred tools · Grow · accounts in your name", 11 tiles, footnote "Product names and logos are trademarks of their respective owners and are shown to identify the tools we work with." |
| 5 | phaseTimeline grid | Existing block: three phase-0 steps prepended, details per the artboard |
| 6 | pricingPlans | Existing block: figures, after values, `threshold` cleared, build/marketing nextLinks, "Grow your store", terms |
| 7 | testimonialRow | Existing block: heading null, eyebrow "The work, up close" with tick, centerFacts |
| 8 | accordionFAQ | Existing block: split; eyebrow "Questions"; "Straight answers."; intro; 4 FAQs (cost / just the build / who pays for ads / guarantee); allLink "All questions →" |
| 9 | finalCTA | Existing block: "Start with a call, leave with a plan." |

Removed from the layout: the old L1 (`doors`), L5 (`steps`) and L7 (newsletterBand).

## Rules for every agent

- Do NOT edit files outside your unit.
- Do NOT git commit, stash, checkout or reset.
- Do NOT restart or kill the :3000 dev server. The PM runs it. Config edits trigger Drizzle dev push on `duha_site_dev`; if it prompts or errors, report it, do not fix it by restarting.
- `pnpm` = `npx -y pnpm@11.28.3`. `payload run` fails on local Node 26; use tsx with `--env-file`.
- Server components by default. Every user-facing string is a block field. 44 px touch targets.
- Use the Tailwind tokens: ink #111111, wine #C20E59 only as an accent, band #F5F5F4, grey text #5F5B55, Archivo Black display, DM Sans body.
- Banned words in copy: engine, funnel, convert/conversion, dashboard, CRM, handover/handoff, leverage, seamless, robust, optimize, streamline, innovative.
- Verify Payload APIs against the installed payload@3.91.0 docs, never from memory.
- Headless chromium is fine for your own screenshots. Only qa-reviewer uses the Playwright MCP.
