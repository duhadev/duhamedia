# Developer documentation — duhamedia.com

**How to use this doc:** find the page you are working on in the table of contents, then the unit (block, collection, global or integration) under it; each entry lists its files, fields, wiring and notes. Site-wide units, deployment, integrations and the restructure log have their own sections at the end.

Maintained by the `dev-docs` subagent after each unit lands. Facts only. Env vars are named, never valued.

Entry format for every unit: **Files** / **Fields & schema** / **Wiring** (registration, pages using it, revalidation, migration) / **Notes**. A unit used on several pages is documented once, under the first page (in site order) that uses it; later pages link to that entry.

## Table of contents

- [Frontend foundation (B0)](#frontend-foundation-unit-b0)
- [Site chrome (B1)](#site-chrome-unit-b1)
- [Page router (B2)](#page-router-unit-b2)
- [Shared components and form foundation (big steps 4 and 5)](#shared-components-and-form-foundation-big-step-4)
1. [Homepage](#1-homepage)
   - [Hero (B3)](#hero-unit-b3)
   - [ProofStrip (B3)](#proofstrip-unit-b3)
   - [CaseStudyCards (B3)](#casestudycards-unit-b3)
   - [MiniCTAStrip (B3)](#minictastrip-unit-b3)
   - [TwoTrackPanels (B3)](#twotrackpanels-unit-b3)
   - [PhaseTimeline (B3)](#phasetimeline-unit-b3)
   - [TeamIntro (B3)](#teamintro-unit-b3)
   - [TestimonialRow (B3)](#testimonialrow-unit-b3)
   - [TeamIntro, founder-card variant (B3)](#teamintro-founder-card-variant-unit-b3)
   - [FinalCTA (B3)](#finalcta-unit-b3)
2. [Case Study template](#2-case-study-template)
   - [Template route and view (S4-12)](#template-route-and-view-unit-s4-12)
   - [Hero, article variant (S4-1)](#hero-article-variant-unit-s4-1)
   - [RichContent, article variant (S4-8)](#richcontent-article-variant-unit-s4-8)
   - [MetricEvent, table variant (S4-9)](#metricevent-table-variant-unit-s4-9)
   - [TestimonialRow, client-voice variant (S4-10)](#testimonialrow-client-voice-variant-unit-s4-10)
   - [CaseStudyCards, next-link layout (S4-2)](#casestudycards-next-link-layout-unit-s4-2)
   - [NewsletterBand (S4-11)](#newsletterband-unit-s4-11)
3. [Work hub](#3-work-hub)
   - [Hero, typographic stats (S4-1)](#hero-typographic-stats-unit-s4-1)
   - [CaseStudyCards, ledger layout and Load More (S4-2)](#casestudycards-ledger-layout-and-load-more-unit-s4-2)
4. [Services Hub](#4-services-hub)
   - [Hero, phaseStrip (S4-1)](#hero-phasestrip-unit-s4-1)
   - [TwoTrackPanels, doors and contrast variants (S4-3)](#twotrackpanels-doors-and-contrast-variants-unit-s4-3)
   - [PhaseTimeline, arc and steps variants (S4-4)](#phasetimeline-arc-and-steps-variants-unit-s4-4)
   - [AccordionFAQ, mini variant (S4-6)](#accordionfaq-mini-variant-unit-s4-6)
5. [Shopify Theme Development](#5-shopify-theme-development)
   - [Hero, service variant (S4-1)](#hero-service-variant-unit-s4-1)
   - [TwoTrackPanels, primary-secondary variant (S4-3)](#twotrackpanels-primary-secondary-variant-unit-s4-3)
   - [SpecLedger, cards (anatomy) and expandable variants (S4-5)](#specledger-cards-anatomy-and-expandable-variants-unit-s4-5)
   - [PhaseTimeline, build-run variant (S4-4)](#phasetimeline-build-run-variant-unit-s4-4)
   - [CaseStudyCards, track source and testimonials fallback (S4-2)](#casestudycards-track-source-and-testimonials-fallback-unit-s4-2)
6. [Marketing](#6-marketing)
   - [SpecLedger on the Marketing page: signal-flow, expandable, cards (feature) (S4-5)](#specledger-on-the-marketing-page-signal-flow-expandable-cards-feature-unit-s4-5)
   - [PhaseTimeline, engine-rollout variant (S4-4)](#phasetimeline-engine-rollout-variant-unit-s4-4)
   - [CaseStudyCards, metric-strip fallback (S4-2)](#casestudycards-metric-strip-fallback-unit-s4-2)
7. [Testimonials](#7-testimonials)
   - [Hero, compact size and aggregate rating (S5-1)](#hero-compact-size-and-aggregate-rating-unit-s5-1)
   - [ReviewWall, feed variant (S5-2)](#reviewwall-feed-variant-unit-s5-2)
8. [About](#8-about)
   - [MetricEvent, facts variant (S5-3)](#metricevent-facts-variant-unit-s5-3)
   - [CaseStudyCards, logo-strip fallback (S5-4)](#casestudycards-logo-strip-fallback-unit-s5-4)
9. [Book a Call](#9-book-a-call)
   - [Hero, callouts (S5-1)](#hero-callouts-unit-s5-1)
   - [BookingEmbed (S5-5)](#bookingembed-unit-s5-5)
   - [FormEmbed, standard variant (S5-6)](#formembed-standard-variant-unit-s5-6)
   - [MiniCTAStrip, inline variant (S5-7)](#minictastrip-inline-variant-unit-s5-7)
10. [Thank You](#10-thank-you)
    - [FormEmbed, reminder variant (S5-6)](#formembed-reminder-variant-unit-s5-6)
11. [FAQ](#11-faq)
    - [CategoryTabs (S5-9)](#categorytabs-unit-s5-9)
    - [AccordionFAQ, group variant (S5-8)](#accordionfaq-group-variant-unit-s5-8)
    - [Page-level FAQPage JSON-LD (PageFaqJsonLd)](#page-level-faqpage-json-ld-pagefaqjsonld)
12. [Contact](#12-contact)
    - [FormEmbed, stepped phone layout (S5-6)](#formembed-stepped-phone-layout-unit-s5-6)
    - [DirectContact (S5-10)](#directcontact-unit-s5-10)
    - [Organization / LocalBusiness JSON-LD (OrganizationJsonLd)](#organization--localbusiness-json-ld-organizationjsonld)
13. [DEV-SEO template](#13-dev-seo-template)
14. [MKT-SEO template](#14-mkt-seo-template)
15. [Campaign LP template](#15-campaign-lp-template)
16. [Newsletter](#16-newsletter)
17. [Link-in-Bio](#17-link-in-bio)
18. [Lead Magnet template](#18-lead-magnet-template)
19. [Review Hub](#19-review-hub)
20. [Legal template](#20-legal-template)
21. [404](#21-404)
- [Site-wide units (collections, globals, header, footers)](#site-wide-units)
  - [Collections](#collections)
    - [Access helpers + `users` (C1)](#access-helpers--users-unit-c1)
    - [`media` + `downloads` (C2)](#media--downloads-unit-c2)
    - [Shared helpers for content collections (C3–C6)](#shared-helpers-for-content-collections-c3c6)
    - [`clients` (C3)](#clients-unit-c3)
    - [`team-members` (C4)](#team-members-unit-c4)
    - [`testimonials` (C5)](#testimonials-unit-c5)
    - [`faqs` (C6)](#faqs-unit-c6)
    - [`case-studies` (C7)](#case-studies-unit-c7)
    - [`posts` (C8)](#posts-unit-c8)
    - [`lead-magnets` (C9)](#lead-magnets-unit-c9)
    - [`pages` (C10)](#pages-unit-c10)
  - [Globals](#globals)
    - [`site-settings` (G1)](#site-settings-unit-g1)
    - [`scarcity` (G2)](#scarcity-unit-g2)
    - [`navigation` (G3)](#navigation-unit-g3)
    - [`seo-defaults` (G4)](#seo-defaults-unit-g4)
  - [Plugins](#plugins)
    - [`form-builder` (P1)](#form-builder-unit-p1)
    - [`redirects` (P2)](#redirects-unit-p2)
    - [`seo` (P3)](#seo-unit-p3)
  - [Error handling (S3)](#error-handling-unit-s3)
- [Block showcase sandbox (`/_showcase`)](#block-showcase-sandbox-_showcase)
- [Deploy](#deploy)
- [Integrations](#integrations)
- [Restructure log](#restructure-log)

---

## Frontend foundation (unit B0)

Sitewide frontend machinery, not tied to a page. Every block unit depends on it.

**Files**
- `src/app/(frontend)/styles.css`: Tailwind CSS 4 tokens in `@theme` (no `tailwind.config`). `--color-*: initial` removes the default palette, so only design colours exist. The header comment holds the design-var to Tailwind-name mapping table. Fonts are wired in a separate `@theme inline` block; `@layer base` sets html/body defaults, a 2px ink `:focus-visible` ring and a `prefers-reduced-motion` override.
- `src/app/(frontend)/fonts.ts`: `archivoBlack` (Archivo Black, weight 400) and `dmSans` (DM Sans, variable) via `next/font/google`; downloaded at build time and self-hosted. CSS variables `--font-archivo-black` / `--font-dm-sans` feed `--font-display` / `--font-body` / `--font-sans`. Mono (`--font-mono`) is the system stack (`ui-monospace, "SF Mono", Menlo, monospace`), not loaded.
- `src/app/(frontend)/layout.tsx`, `page.tsx`, `[...slug]/page.tsx`, `src/lib/pages.ts`: created in B0, rewritten by B2; documented in [Page router (B2)](#page-router-unit-b2).
- `src/components/RenderBlocks.tsx`: maps `pages.layout` rows to components via `blockComponents`. Unknown `blockType`: always `console.error`; staging/development render a visible dotted-border warning in place; production renders nothing for that row.
- `src/components/ui/*` (barrel `index.ts`): `Container` (max 1200px, gutter 20px below `md`, 24px from `md`), `Section` (tone `light|grey|dark`, pad `default|tight|none`, optional dividers), `Eyebrow`, `AccentHeadline` (`level` = visual size, `1|2|3|'section'`; `as` = HTML element; `level="section"` = the finals' section headline, `text-h3` (1.75rem) on mobile and `text-h2` (3rem) from `md`, so a block uses it instead of overriding the size with a class), `Button` / `ButtonLink` / `buttonClasses` (variants `primary|ghost|ghost-light|dark`, sizes `sm|md|lg`), `CMSLink` / `resolveLinkHref` / `CMSLinkData`, `Media`, `DotMatrix`.
  - `CMSLink` renders a `linkField` value: site paths as Next `Link`, `https:`/`mailto:` as `<a>`, `newTab` adds `target="_blank" rel="noopener noreferrer"`. Renders nothing when the destination does not resolve (empty, unpopulated or unpublished reference, no URL) or there is no text. `ButtonLink` behaves the same.
  - `Media` renders a media doc with `next/image` (alt from the doc; `alt=""` only for decorative images). It keeps the upload path and query and drops the origin; with `fill`, the focal point sets `object-position`. Renders nothing for an empty or id-only upload.
- `src/lib/cx.ts`: class-name joiner.
- `src/lib/accentPhrase.ts`: `splitAccentPhrase(heading, accent)` returns `[before, accent, after]` (case-insensitive match, heading's own spelling) or `null`. Shares its matching rule with `accentPhraseError` / `validateAccentPhrase`.
- `src/blocks/index.ts`: `pageBlocks` (block configs only; 19 blocks registered after big step 5, in this order: `Hero`, `MiniCTAStrip`, `FinalCTA`, `ProofStrip`, `CaseStudyCards`, `MetricEvent`, `ReviewWall`, `TestimonialRow`, `TwoTrackPanels`, `PhaseTimeline`, `TeamIntro`, `RichContent`, `SpecLedger`, `NewsletterBand`, `FormEmbed`, `BookingEmbed`, `DirectContact`, `AccordionFAQ`, `CategoryTabs`; the order is the admin "Add section" picker order. B3 registered the first 9, without `MetricEvent`; big step 5 added `ReviewWall`, `FormEmbed`, `BookingEmbed`, `DirectContact`, `CategoryTabs`). Must not import React or CSS because `payload.config.ts` loads it.
- `src/blocks/components.ts`: `blockComponents` (`blockType` to component), typed `{ [K in PageBlockType]: ComponentType<BlockData<K>> }`; a missing entry is a type error. Keys: `hero`, `miniCTAStrip`, `finalCTA`, `proofStrip`, `caseStudyCards`, `metricEvent`, `reviewWall`, `testimonialRow`, `twoTrackPanels`, `phaseTimeline`, `teamIntro`, `richContent`, `specLedger`, `newsletterBand`, `formEmbed`, `bookingEmbed`, `directContact`, `accordionFAQ`, `categoryTabs`.
- `src/blocks/types.ts`: `PageLayoutBlock`, `PageBlockType`, `BlockData<K>`, all derived from the generated `Page` type (resolve to `never` while no block exists).
- `src/fields/index.ts`: shared field factories. B3 added `eyebrowField()`, `headlineFields()`, `scarcityRef()` and the `required` option of `metricFields()` (below); `linkField`, `metricFields`, `pricingNote`, `validateAccentPhrase` / `accentPhraseAdminField` and `contentVersions` predate B3.
  - `eyebrowField({ defaultTick = true, description })`: a `row` (no data nesting) holding `eyebrow` (text, 70% width) and `eyebrowTick` (checkbox "Show the diamond marker", 30%, default from `defaultTick`). Both optional; an empty eyebrow renders nothing.
  - `headlineFields({ required = true, description })`: returns two fields to spread: `heading` (text, `required` per option) and `accentPhrase` (text, label "Accent phrase", `validate: validateAccentPhrase('heading')` and `admin.components.Field: accentPhraseAdminField('heading')`). The accent must be a case-insensitive substring of `heading`; empty is allowed. `required: false` is for blocks whose empty heading falls back to defaults (FinalCTA) or hides the headline.
  - `scarcityRef({ name = 'key', label, description, defaultValue = 'none' })`: a `select` of the `scarcity` global's statement keys (`SCARCITY_KEYS` in `src/lib/scarcity.ts`: `ongoing`, `capacity`, `builds-line`, `engines-line`, `slots-line`, `offer-line`) plus `none`. The block stores only the key; the number and reason are read from the global at render. Used by ProofStrip (`statements[].key`) and FinalCTA (`capacity`, default `builds-line`).
  - `metricFields({ required = true })`: `value` and `label` text fields (required unless `required: false`), `sub` text, `accent` checkbox. The field shapes, and so the DB columns, are identical either way. `required: false` is used by `testimonialRow.studyCard.fallbackMetric`.
- `src/showcase/registry.ts` (`showcaseEntries`, `ShowcaseEntry`, `ShowcaseViewport`) and `src/showcase/enabled.ts` (`showcaseEnabled()` = not production).
- `src/app/(frontend)/%5Fshowcase/page.tsx`: the `/_showcase` route.
- `src/plugins/seo.ts`: exports `HOME_SEO_TITLE` (`Duha Media — Integrated Ecommerce Growth Partner, Chicago`), used by `generateTitle` for the `home` page (see [P3](#seo-unit-p3)).

**Fields & schema**
- None of its own. `pages.layout` is added to `pages` only once `pageBlocks` has at least one block, because the Payload 3.91 admin crashes on a blocks field with `blocks: []`. An empty blocks field creates no tables; the first block unit (Hero, B3) generated the migration that adds the `pages_blocks_*` / `_pages_v_blocks_*` tables. Block fields are documented per block under [1. Homepage](#1-homepage).

**Wiring**
- `src/app/(frontend)/layout.tsx` is the root layout of the `(frontend)` group and imports `styles.css` and the fonts.
- Breakpoints: Tailwind defaults. The design's mobile build applies below `md` (768px), the desktop build from `md`. Write mobile-first (`text-h1-mobile md:text-h1`).
- Revalidation: unchanged. The frontend is `force-dynamic` and reads through the Local API on each request, so published edits appear without a rebuild; no `next build` database access.
- Migration: none.

**Notes**
- How to add a block:
  1. Create `src/blocks/<Name>/config.ts` exporting a `Block` with a unique `slug` and `interfaceName: '<Name>Block'` (NewsletterBand uses the slug literal `newsletterBand`). Import shared factories with **relative** paths (`import { eyebrowField, headlineFields } from '../../fields'`), not the `@/` alias: `payload.config.ts` loads the config under the Payload CLI, which does not resolve the alias.
  2. Create `src/blocks/<Name>/Component.tsx`, typed `BlockData<'<slug>'>` (props are the generated row type; an async server component is fine for blocks that read data).
  3. Add the config to `pageBlocks` in `src/blocks/index.ts` (configs only, no React or CSS imports).
  4. Run `pnpm generate:types`.
  5. Add `'<slug>': Component` to `src/blocks/components.ts`. A missing entry is a type error.
  6. Add showcase fixtures to `showcaseEntries` in `src/showcase/registry.ts`: `{ block, variant, viewport?, label, data }` (include the fallback / empty states).
  7. Migration: generate with `pnpm payload migrate:create <name>` against a **fresh scratch database migrated to HEAD** (never the push-managed dev DB), under a pty (the command prompts), and check that generated identifiers are at most 63 characters. Prove it with `migrate` up, `migrate:down`, `migrate` up again. Commit the `.ts` and `.json` and register it in `src/migrations/index.ts`.
  8. pnpm is run as `npx -y pnpm@11.28.3 <command>` in the agent environment.
  9. `block-coder` self-checks the rendered block with headless chromium before reporting.
- Tokens come from `design-reference/merged-tokens.css` and `MERGED.md`; new tokens need a Decision-log entry. Not ported: the mobile canvas colour `#DED9D0` and the X/Twitter card colours.
- `--color-gray-warm` is `#747069` (darkened from the design's `#8A857D`, which fails AA contrast at 3.66:1; the exact value is flagged for PM/human sign-off). Dividers keep the original rgba.
- Page-level metadata, draft mode/live preview and redirect fallback are in [Page router (B2)](#page-router-unit-b2). The home fallback title must match `HOME_SEO_TITLE`.

---

## Site chrome (unit B1)

Sitewide header and footers. Not a block; not tied to one page.

**Files**
- `src/components/chrome/SiteHeader.tsx`: async server component. Variants `standard | logo-only | none` (`HeaderVariant`).
- `src/components/chrome/MobileNav.tsx`: the only `'use client'` file in the chrome. Menu toggle (`aria-expanded` / `aria-controls`), Escape closes and returns focus to the button, closes on route change. Panel links are rendered on the server and passed in as `children`.
- `src/components/chrome/SiteFooter.tsx`: async server component. Variants `standard | reduced-nav | legal-only` (`FooterVariant`).
- `src/components/chrome/SiteLogo.tsx`, `NavLink.tsx`, `PageShell.tsx`, `footerNudgeForm.ts`, `index.ts` (barrel).
- `src/lib/chrome.ts`: `getChrome()` (React `cache`, `server-only`; Local API `findGlobal` on `navigation` and `site-settings`, `depth: 1`, `overrideAccess: false`), plus `toNavItems` / `toNavItem` (drop links with no text or unresolved destination) and `getNewsletterHref()` (published `newsletter` page lookup).
- `public/logo-duha.png`: logo mark, rendered unoptimised.

**Fields & schema**
- None changed. Reads existing fields only:
  - Header links: `navigation.header.links`. Header CTA: `navigation.header.cta`.
  - Footer brand line: `site-settings.footerTagline`.
  - Footer columns: `navigation.footer.standard.columns[]`.
  - Newsletter nudge: `navigation.footer.standard.newsletterNudge.{heading,line,buttonLabel}`; inline form: `site-settings.newsletterForm` (relationship to `forms`).
  - Reduced footer links: `navigation.footer.reduced.links`.
  - Legal bar: `navigation.footer.legalLinks`, plus "© {current year} {`site-settings.legalName`}" (falls back to `Duha Media`).
  - Variant selection: `pages.headerVariant` / `pages.footerVariant`.

**Wiring**
- Each route wraps its `<main>` in `<PageShell header={page.headerVariant} footer={page.footerVariant}>`, because the variants are per-page fields and the root layout cannot see the page. Routes: `src/app/(frontend)/page.tsx` (published `home`; the placeholder uses defaults), `[...slug]/page.tsx`, `not-found.tsx` and `%5Fshowcase/page.tsx` (the last two use standard/standard). `PageShell` defaults are `standard` / `standard`.
- Variant behaviour:
  - Header `standard`: sticky, logo (links to `/`), links and CTA; below `md` they sit in the MobileNav panel.
  - Header `logo-only`: logo, not a link; never reads navigation.
  - Header `none`: renders nothing.
  - Footer `standard`: brand (logo + tagline), link columns, newsletter nudge, legal bar.
  - Footer `reduced-nav`: logo + reduced links, legal bar.
  - Footer `legal-only`: legal bar only.
- Newsletter nudge (F42): when `site-settings.newsletterForm` is set and the form exists (`getNewsletterFormId` in `src/lib/chrome.ts`, trusted `findByID`, `depth: 0`), the nudge renders an inline email form through `CMSForm` (`tone="dark"`, `submitVariant="ghost-light"`, `submitSize="sm"`, `turnstileAppearance="interaction-only"`, classes from `src/components/chrome/footerNudgeForm.ts`, `submitLabel` = `newsletterNudge.buttonLabel`). The form is submitted without `sourcePath`. A set-but-missing form logs one warning per process and the nudge falls back to the link below. Without `newsletterForm`, the nudge button links to the published `newsletter` page and is hidden while that page is unpublished or missing.
- `footerNudgeForm.ts` slots (`footerNudgeFormClassNames`): `form` (`flex flex-row flex-wrap items-start gap-x-2 gap-y-2`), `fields` (`flex min-w-0 flex-1 flex-wrap gap-4`), `field` (`gap-0!`), `label` (`sr-only`), `control` (text size and `placeholder:text-cream/60`), `footer` (`contents`, lifts the button into the form's flex row), `submit` (`self-stretch`), `turnstile` and `status` (`order-last basis-full`, wrap onto their own line), `success` (`text-small`).
- Skip link and focus target (F41): `PageShell` renders a skip link (`href="#main"`, first focusable element) and wraps `children` in `<div id="main" tabIndex={-1} className="outline-none">`, so the target exists regardless of which route file owns `<main>`. `id="main"` is a reserved FAQ anchor id (see [AccordionFAQ group](#accordionfaq-group-variant-unit-s5-8)).
- Accessible names (F41): the logo link (`SiteLogo`, `href` set) has `aria-label` = `<seo-defaults organization name> home` (from `SiteHeader`; falls back to `Duha Media home`) and the mark image has `alt=""`, so the link is announced once. The desktop nav is `aria-label="Main"`, the mobile panel nav `aria-label="Main (mobile)"`, the toggle button `aria-label="Menu"`.
- Footer semantics (F95, reversing the F41 `h2`): link-column titles are `<p id="footer-col-<index>">` (class `HEADING`), each column is `<nav aria-labelledby="footer-col-<index>">`. The nudge heading is also a `<p>`. Other footer navs: `aria-label="Footer"` (reduced) and `aria-label="Legal"`.
- Dark-ground focus ring: `<footer>` carries `data-tone="dark"`; see [Dark-ground focus ring](#dark-ground-focus-ring-rule).
- Fallbacks:
  - A global read failure logs `console.error` and renders minimal chrome (logo, no links, bare ©).
  - Unresolved links and empty columns are dropped.
  - The menu toggle renders only when there are links or a CTA.
- Revalidation: unchanged. The globals already revalidate on save and the frontend is `force-dynamic`.
- Migration: none.

**Notes**
- The footer inline form (F42) and the four F41 accessibility fixes (skip link, logo accessible name, distinct nav labels, footer column titles) landed in big step 5; they are described under Wiring above. Footer column titles are `<p>` (F95), not `h2`.
- The footer form's field ids are unique per instance (see [Forms: stepped layout and per-instance ids](#forms-stepped-layout-and-per-instance-ids-big-step-5)).

---

## Page router (unit B2)

Resolves `pages` documents to URLs and produces their head metadata, draft preview, redirects, sitemap and robots. Sitewide; not a block.

**Files**
- `src/lib/pages.ts`: `getPage(slug)` (React `cache`; replaces B0's `getPublishedPage`), `getPreviewUser()`, `pageLayout(page)`, `PAGE_QUERY_DEPTH = 2`.
- `src/lib/metadata.ts` (`server-only`): `getSeoDefaults()` (cached `findGlobal` on `seo-defaults`, `depth: 1`, `overrideAccess: false`; returns `{}` on a failed read), `titleTemplate()`, `siteName()`, `pageMetadata(page, { preview })`, `homeFallbackMetadata()`.
- `src/lib/redirects.ts` (`server-only`): `findRedirect(path)` returning `{ location, permanent } | null`.
- `src/lib/preview.ts`: `PREVIEW_ROUTE` (`/_preview`), `EXIT_PREVIEW_ROUTE` (`/_preview/exit`), `PREVIEW_BREAKPOINTS` (mobile 390x844, tablet 768x1024, desktop 1440x900), `previewUrl(path)`. No `server-only` and no `next/*` imports, because `Pages.ts` imports it and the Payload CLI loads that file.
- `src/lib/env.ts` (`server-only`): `getAppEnv()` (`APP_ENV` = `production` or `staging`, anything else is `development`), `isProduction()`, `getSiteUrl()` (`SITE_URL` without trailing slashes; falls back to `http://localhost:3000` when unset).
- `src/app/sitemap.ts`, `src/app/robots.ts`: Next metadata routes (`/sitemap.xml`, `/robots.txt`), both `force-dynamic`.
- `src/app/(frontend)/layout.tsx`: `force-dynamic`; `generateMetadata` (site-wide defaults); html/body shell with both font variables. No header or footer.
- `src/app/(frontend)/page.tsx` (`/`), `src/app/(frontend)/[...slug]/page.tsx` (every other page), `src/app/(frontend)/not-found.tsx`.
- `src/app/(frontend)/%5Fpreview/route.ts` (`GET /_preview`) and `src/app/(frontend)/%5Fpreview/exit/route.ts` (`GET /_preview/exit`). The folder is `%5Fpreview` for the same reason as `%5Fshowcase`.
- `src/components/PageView.tsx`: one `pages` doc in its chrome (`PageShell` with the doc's `headerVariant` / `footerVariant`, then `<main>` with `RenderBlocks`). Shared by `/` and `[...slug]`.
- `src/components/ReadingProgress.tsx`: the only client island added by B2.
- `src/collections/Pages.ts`: `admin.preview` and `admin.livePreview`.

**Fields & schema**
- None. No migration. Reads existing fields: `pages.{slug,title,meta,headerVariant,footerVariant,readingProgress,noindex,zeroLeakage,layout,updatedAt}`, `seo-defaults.{titleTemplate,defaultDescription,defaultOgImage,organization.name}`, `redirects`.

**Wiring**
- Routing:
  - `/` renders the `home` doc (`HOME_SLUG`). With no home doc visible it renders a placeholder (`Duha Media` / `Site rebuild in progress.`) inside `PageShell` with default variants, never a 404.
  - `/<slug>`: the catch-all joins segments with `/` (slug keeps `/` between segments, see `src/lib/pagePath.ts`). `/home` calls `permanentRedirect('/')` (308). `/404` (`NOT_FOUND_SLUG`) calls `notFound()`. No page: `findRedirect('/<slug>')`; a hit calls `permanentRedirect` (308) or `redirect` (307); otherwise `notFound()`.
  - `not-found.tsx` is a placeholder (`Page not found` + link to `/`) in `PageShell` with standard variants. It does not read the `404` doc yet (Error404 block pending). Its metadata is `title: 'Page not found'` with `robots: null`, because Next adds its own `noindex` to not-found responses and the layout's non-production robots would otherwise duplicate it.
- Page query (`getPage`):
  - Public: `find` on `pages` with `where` slug equals and `_status` equals `published`, `draft: false`, `overrideAccess: false`, `depth: PAGE_QUERY_DEPTH`, `limit: 1`, `pagination: false`.
  - Draft preview: only when Next draft mode is on AND `getPreviewUser()` returns a user; then `draft: true`, `user`, `overrideAccess: false` (collection access still applies).
  - `PAGE_QUERY_DEPTH = 2`: the page's own relationships are depth 1 (block relations), the documents they point at are depth 2. Payload caps population by the **absolute** depth against each field's `maxDepth` (payload@3.91.0 `fields/hooks/afterRead/relationshipPopulationPromise.js:86`), so a nested relationship with `maxDepth: 1` never populates under a page. For that reason the nested fields that block components read are `maxDepth: 2`: `clients.logo`, `team-members.photo`, `testimonials.client`, `testimonials.video.poster`, `case-studies.client`, `case-studies.heroMedia`, and the block relations `proofStrip.logos.clients`, `caseStudyCards.caseStudies`, `testimonialRow.testimonials`, `testimonialRow.studyCard.caseStudy`, `teamIntro.member`.
- Metadata (`pageMetadata`; Next `generateMetadata`). Title is emitted as `title.absolute`, so the layout template is never applied twice. Precedence per field:
  - Title: `page.meta.title` (SEO tab) → for slug `home`, `HOME_SEO_TITLE` (same constant as plugin-seo `generateTitle`) → `seo-defaults.titleTemplate` with `%s` replaced by `page.title` (the template is used only if it contains exactly one `%s`, else `DEFAULT_TITLE_TEMPLATE` from `src/globals/SeoDefaults.ts`).
  - Description: `page.meta.description` → `seo-defaults.defaultDescription` → none.
  - Share image (Open Graph and Twitter): `page.meta.image` → `seo-defaults.defaultOgImage`; each is used only through its `sizes.og` (1200x630) rendition (url, width, height, alt). A media doc with no `og` size, or an unpopulated id, counts as none. Twitter card is `summary_large_image` with an image, `summary` without.
  - Canonical and `og:url`: `getSiteUrl()` + `pagePath(slug)` (absolute; `/` for `home`). Not emitted for a doc with no path.
  - `og:siteName`: `seo-defaults.organization.name`, else `Duha Media`.
  - Robots: `{ index: false, follow: false }` when `APP_ENV` is not `production`, or the render is a draft preview, or `page.noindex === true`, or `page.zeroLeakage === true`; otherwise `{ index: true, follow: true }`. `robots` is a nested metadata field, so the page's value replaces the layout's: exactly one robots tag.
  - Layout defaults (`layout.tsx` `generateMetadata`), for routes that set none (not-found, `/_showcase`, `/home` and `/404` in the catch-all): `metadataBase` = `getSiteUrl()`, `title.default` = site name, `title.template` = the seo-defaults template, description = `defaultDescription`, robots noindex/nofollow when not production.
  - `homeFallbackMetadata()` (no home doc visible): `HOME_SEO_TITLE`, path `/`, indexable in production.
- Draft preview:
  - Admin: `Pages.admin.preview` and `Pages.admin.livePreview.url` both return `previewUrl(pagePath(slug))` = `<SITE_ORIGIN>/_preview?path=<path>`, where the origin comes from `siteOrigin()` in `src/plugins/seo.ts` (server-side `SITE_URL`; empty, so a relative URL, when unset). `null` (no preview) while the doc has no slug and for the `404` doc. Live preview breakpoints are `PREVIEW_BREAKPOINTS`.
  - `GET /_preview?path=`: `path` must pass `getSafeRedirect` (`payload/shared`; same-origin relative path only), else 400. `payload.auth({ headers: request.headers, canSetHeaders: false })` must return a `users` user for whom `isStaff` is true (admin or marketing), else 403 (the pipeline API user and the public are refused). On success it enables Next draft mode and answers 307 to the path. Every refusal also disables draft mode.
  - No shared secret or token in the URL: the admin session cookie is the credential.
  - The staff session is re-checked on every page request in `getPreviewUser()`; the draft-mode cookie alone never shows a draft (it outlives a logout). A failed auth call is treated as no user.
  - Every response from both preview routes sets `Cache-Control: private, no-store, max-age=0`.
  - `GET /_preview/exit?path=`: disables draft mode, 307 to a safe `path` (default `/`).
  - `_`-prefixed first segments are reserved (`pageSlugError`, redirects `from` validation), so no page or redirect can collide with `/_preview`.
- Redirect fallback (`findRedirect`):
  - Runs only after the page lookup found nothing (flag F22): a redirect never overrides a live page.
  - Looks up `redirects.from` with both the raw and the percent-decoded request path; public read, `overrideAccess: false`, `depth: 0`. `redirects` has no drafts, so a saved redirect is live at once.
  - `to.type = custom`: the stored `to.url`. `to.type = reference`: the target's public path via `docPath(relationTo, doc)`, and only while the target is **published** (queried with `_status: published`, `draft: false`, `overrideAccess: false`); otherwise no redirect (404). A resolved location equal to the request path is ignored.
  - Status: stored type `301` → `permanentRedirect` (HTTP 308); `302` → `redirect` (HTTP 307). In the App Router a page can only emit 308/307; search engines treat 308 as 301 and 307 as 302.
  - A lookup error is logged and treated as not found.
- Sitemap (`/sitemap.xml`): `find` on `pages` with `_status: published`, slug not `404`, `depth: 0`, `draft: false`, `overrideAccess: false`, `limit: 0`, sorted by `slug`. Documents with `noindex === true` or `zeroLeakage === true` are dropped in code (an SQL `<> true` would also drop NULL rows). `home` appears once, as `<SITE_URL>/`. `lastModified` is `updatedAt`. `/_showcase` and `/_preview` never appear. A DB failure is a 500, not an empty sitemap. Published `case-studies` are appended after the pages as `<SITE_URL>/work/<slug>` (newest `publishedAt` first, `select: { slug, updatedAt }`; see [Template route and view (S4-12)](#template-route-and-view-unit-s4-12)). Posts and lead-magnets are added when their routes land. Same sitemap in every environment (not filtered by `APP_ENV`).
- Robots (`/robots.txt`): `Sitemap: <SITE_URL>/sitemap.xml` always. Not production: `User-agent: *`, `Disallow: /`. Production: `Allow: /` and `/api/media/file/`; `Disallow: /admin`, `/api/`, `/_showcase`, `/_preview`.
- `readingProgress`: `PageView` renders `<ReadingProgress />` before `<main>` when `page.readingProgress` is true (flag set per page; About and FAQ per `Pages.ts`). The component is a `'use client'` island because it reads scroll position: a fixed 4px bar (`--reading-progress-width`) on the left edge in `accent-primary`, `aria-hidden`, `pointer-events-none`, height driven by `transform: scaleY(0..1)`, rAF-throttled scroll and resize listeners, no transition.
- Revalidation: unchanged. Everything is `force-dynamic` and read per request; the `pages` hooks (tag `pages` plus the page path) still run on publish.

**Notes**
- Live preview: autosave is off (S3/F21), so the live pane shows the last **saved** draft and does not auto-refresh on Save draft. Open decision, tracked as F57.
- Structured data in page output (big step 5): one merged FAQPage ([PageFaqJsonLd](#page-level-faqpage-json-ld-pagefaqjsonld)) and, on `home` and `contact`, Organization / LocalBusiness ([OrganizationJsonLd](#organization--localbusiness-json-ld-organizationjsonld)). `PageView` now renders both after `RenderBlocks`.
- Open SEO findings, F65 (Gate 2, none applied): `getSiteUrl()` falls back to `http://localhost:3000` when `SITE_URL` is unset, so a production container without it would emit localhost canonicals and sitemap URLs silently (and `getSiteUrl` and `siteOrigin` are two separate helpers); home canonical vs sitemap trailing-slash consistency; the `/` placeholder (no home doc) is indexable in production and absent from the sitemap; the seo-defaults placeholder description and OG alt are live until seeded; seed must set `noindex` on Thank You and gated templates; Organization/LocalBusiness JSON-LD (page scope); `not-found` has no description.
- QA of the authenticated preview and the redirect create/verify/delete test were pending when this entry was written.
- Case-study cards link to `/work/<slug>`; that route now exists ([S4-12](#template-route-and-view-unit-s4-12)). Posts and lead-magnets still have no frontend route.

---

## Shared components and form foundation (big step 4)

Sitewide helpers added while building pages 2 to 6. Several blocks depend on them; they are not tied to one page.

### RichText wrapper (`src/components/RichText.tsx`)

**Files**
- `src/components/RichText.tsx`: exports `RichText`, `RichTextData` (= `Faq['answer']`, the generated Lexical shape shared by every `richText` field), `safeHref`, `richTextLinkHref`, `linkConverters`.

**Fields & schema**: none.

**Wiring**
- `RichText({ data, converters?, linkClassName?, className?, disableContainer? })` wraps `RichText` from `@payloadcms/richtext-lexical/react`. It merges `defaultConverters`, then `linkConverters(linkClassName)`, then the caller's `converters` (which must return only the node types they override; spreading `defaultConverters` back in replaces the shared link converters). Renders nothing when `data.root` is missing.
- `safeHref(href)`: returns the trimmed value only for `/…` (not `//`), `#…`, `http(s):`, `mailto:`, `tel:`; otherwise `null`.
- `richTextLinkHref(fields)`: `linkType = internal` resolves through `docPath(relationTo, value)` and only when the populated target's `_status` is `published` (absent `_status` counts as published); an unpopulated or unpublished target returns `null`. Other link types go through `safeHref(fields.url)`. A `null` href renders the link text as plain text.
- `linkConverters(className?)`: `link` and `autolink` converters. A site-relative href without `newTab` renders through `next/link`; everything else is an `<a>`, `newTab` adds `target="_blank" rel="noopener noreferrer"`.
- Used by: `AccordionFAQ` (answers), `TestimonialRow` (client-voice `doDifferently`), `RichContent` (`ArticleBody`, with article converters layered on top), `CMSForm` (form confirmation and `message` blocks).

**Notes**
- The `_status` check depends on `_status` being in the populated collection's `defaultPopulate` (next section).
- PROGRESS flag F74.

### `defaultPopulate` rule

- A relationship populated by Payload carries only the fields listed in the target collection's `defaultPopulate` (it is the `select` for populated docs; payload@3.91.0 `fields/hooks/afterRead/relationshipPopulationPromise.js:38`). Payload does not add `_status` to it (`utilities/sanitizeSelect.js`), so it must be listed explicitly for any collection whose populated docs are filtered on `_status`.
- `case-studies` `defaultPopulate`: `title`, `slug`, `client`, `track`, `studyNumber`, `engagementLine`, `headlineMetric`, `cardSummary`, `heroMedia`, `featured`, `publishedAt`, `_status`.
- `pages`, `lead-magnets`: `title`, `slug`, `_status`. `posts`: `title`, `slug`, `track`, `dek`, `publishedAt`, `issueNumber`, `_status`.
- Consequence for blocks: a manually picked case study arrives trimmed to those fields (or as a bare id when it is unpublished or unreadable). `CaseStudyCards` `ledger` / `next-link` therefore re-reads any pick that lacks `studyNumber` (see [S4-2](#casestudycards-next-link-layout-unit-s4-2)).

### Form foundation (S4-7)

**Files**
- `src/app/api/form-submit/route.ts`: `POST /api/form-submit`.
- `src/integrations/turnstile.ts`: `verifyTurnstile(token, remoteIp?)`, `getTurnstileSiteKey()`, `TURNSTILE_TEST_SITE_KEY`.
- `src/integrations/forms/shared.ts`: client-safe contract (path, caps, FormData keys, `PublicForm`, `PublicFormField`, `FormSubmitResult`, `FormSubmitResponse`).
- `src/integrations/forms/handleSubmission.ts`: `parseSubmissionFormData`, `validateSubmission`, `handleFormSubmission`.
- `src/components/forms/CMSForm.tsx` (server), `PayloadForm.tsx` (client), `TurnstileWidget.tsx` (client), `publicForm.ts` (`toPublicForm`), `index.ts` (barrel).

**Fields & schema**
- No new collection. The form definition is the form-builder `forms` doc ([P1](#form-builder-unit-p1)). Migration `20261022_052303_b4_pages_2_6_blocks` adds a nullable `placeholder` varchar to `forms_blocks_text`, `forms_blocks_email` and `forms_blocks_textarea`.

**Wiring**
- Route contract:
  - Static route outside both route groups (like `/api/health`), so Payload's `[...slug]` catch-all never sees it; the stable path lets one Cloudflare rate-limit rule match on path alone (OPS_REQUESTS #10).
  - `force-dynamic`. Same-origin POST only (`Sec-Fetch-Site` / `Origin` checked against `SITE_URL`; outside staging and production the request `Host` over http is also accepted). 403 otherwise.
  - Content type `multipart/form-data` or `application/x-www-form-urlencoded` (415 otherwise); body cap `MAX_BODY_BYTES` = 64 KB, enforced while streaming (413).
  - FormData keys: `_form` (form id), `f:<field name>` (field values), optional `_source` (page path, same-site only, stored as `sourcePath`), optional `_leadMagnet` (lead-magnet id; accepted only when that published lead magnet's capture form is this form), and `cf-turnstile-response`.
  - `Accept: application/json` (what `PayloadForm` sends): JSON `FormSubmitResponse`; 200 `{ ok: true, redirect? }` on success, 400 `{ ok: false, message, fieldErrors? }` on a rejected submission. Without it (no-JS post): 303 to the form's redirect confirmation, or a minimal HTML page. Always `Cache-Control: no-store`. GET/PUT/PATCH/DELETE/HEAD/OPTIONS return 405.
- `handleFormSubmission` order: (1) `verifyTurnstile`, nothing is read or stored before it passes (misconfigured secret returns "unavailable", a failed check returns the friendly "couldn't confirm" message); (2) load the form with a trusted Local API read; (3) `validateSubmission` against the form's own fields (unknown or duplicate keys reject the whole submission; per-type length and format caps from `MAX_LENGTH`); (4) `payload.create('form-submissions')` with `overrideAccess: false` and `context.turnstileVerified = true`, the only code path that sets that flag (`turnstileVerifiedOrAdmin`, `src/access/index.ts`).
- `verifyTurnstile`: Cloudflare siteverify, 10 s timeout, never throws, logs error codes only. Outside development `TURNSTILE_SECRET_KEY` is required and Cloudflare's test secrets are refused (`test-secret-in-production`); the reply hostname must equal the host of `SITE_URL` (a wrong `SITE_URL` breaks every form). Development falls back to the always-pass test secret and test site key.
- `CMSForm` (server): props = `PayloadFormProps` minus `form`, `siteKey`, `confirmation`, `messages`, plus `form` (id or populated `Form`; always re-read by id with a trusted read, then reduced by `toPublicForm` so `emails`, `redirect`, `confirmationMessage` and integration fields never reach the browser), optional `confirmation` node. Reads `TURNSTILE_SITE_KEY` at request time (prop, no `NEXT_PUBLIC_*`). Renders the confirmation message and `message` blocks as server-rendered `RichText`. Renders nothing when the form cannot be loaded.
- `PayloadForm` (client) props: `form`, `siteKey`, `confirmation?`, `messages?`, `sourcePath?`, `leadMagnetId?`, `submitLabel?`, `turnstileAppearance?` (`'always'` default, or `'interaction-only'`), `tone?` (`light` | `dark`), `submitVariant?`, `submitSize?`, `className?`, `classNames?`, and, added in big step 5, `layout?`, `steppedBelow?`, `steps?`, `selectAsOptions?`, `progressLabel?`, `startLabel?`, `nextLabel?`, `backLabel?`, `idPrefix?` (see [Forms: stepped layout and per-instance ids](#forms-stepped-layout-and-per-instance-ids-big-step-5)).
  - `classNames` slots: `form`, `fields`, `field`, `label`, `control`, `error`, `turnstile`, `footer`, `submit`, `status`, `success`. The layout slots `form`, `fields`, `footer`, `turnstile`, `submit` REPLACE the default layout classes when set (defaults: form `flex flex-col gap-6`, fields `flex flex-wrap gap-4`, footer `flex flex-col gap-3`, submit `self-start`, turnstile `min-h-[65px] w-full`, or `w-full` with `interaction-only`); the others are appended.
  - Behaviour: submits with `fetch` and the form's own FormData; keeps inputs on error; resets the Turnstile token and focuses the status region after each response; a `redirect` in the response navigates (site path via `router.push`). Without JS the plain `action` / `method="post"` posts to the same route. `placeholder` is rendered on `text`, `email`, `textarea` and `select` fields.
- `TurnstileWidget` (client) props: `siteKey`, `appearance?` (`'always'` | `'interaction-only'`, Cloudflare's `appearance`), `onTokenChange?`, `theme?`, `className?`. Uses `@marsidev/react-turnstile` (pinned 1.6.2, Gate 0 Q4), `size: 'flexible'`, auto refresh on expiry and timeout, hidden input name `cf-turnstile-response`. `interaction-only` collapses the row to zero height unless Cloudflare needs a click.
- Env vars (names only): `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `SITE_URL`, `APP_ENV`.
- Full submission path, event contract and retry rules: `INTEGRATIONS.md`, section "Form submission path (S4-7, lead flow steps 1–2)".

**Notes**
- Event sending is not in this path. The `form-submissions` `afterChange` enqueue and the delivery job remain `TODO(integration)` in `src/plugins/formBuilder.ts`.
- First consumer: [NewsletterBand](#newsletterband-unit-s4-11). Big step 5 added the footer nudge form ([B1](#site-chrome-unit-b1)) and `FormEmbed` ([standard](#formembed-standard-variant-unit-s5-6), [reminder](#formembed-reminder-variant-unit-s5-6), [stepped](#formembed-stepped-phone-layout-unit-s5-6)). The lead-magnet capture is not built yet.
- PROGRESS flag F71 (rate-limit path, hostname check, custom validation, misconfiguration returns 400).

### Showcase Lexical builders (`src/showcase/lexical.ts`)

- Tiny builders for static Lexical fixtures in `/_showcase` (never DB data). Exports: `text(t, { bold })`, `p(...children)`, `h('h2'|'h3'|'h4', t)`, `quote(t)`, `hr()`, `ul(...items)`, `internalLink(t, doc | null)` (`doc: null` = unresolved target, renders as plain text), `customLink(t, url, newTab?)`, `figure(media, caption)` (upload node with the RichContent `caption` field), `root(...children)`; type `LexicalRoot` (= `Faq['answer']`).
- Used by the showcase fixtures for `accordionFAQ` answers, `richContent` bodies and `testimonialRow` client-voice `doDifferently`.

### Forms: stepped layout and per-instance ids (big step 5)

**Files**
- `src/components/forms/PayloadForm.tsx`, `FieldControl.tsx`, `steps.ts` (`FormStep`, `ResolvedStep`, `resolveSteps`), `CMSForm.tsx`, `TurnstileWidget.tsx`.

**Fields & schema**: none. The editor-facing fields that feed these props are on [FormEmbed](#formembed-standard-variant-unit-s5-6) (`steps`, `stepped`).

**Wiring**
- Stepped layout (`PayloadForm` props):
  - `layout`: `'stacked'` (default) or `'stepped'`. `steppedBelow`: `'sm'` | `'md'` (default) | `'lg'` (`40rem`, `48rem`, `64rem`).
  - `steps`: `FormStep[]` = `{ fieldNames: string[], heading?, hint? }`. `selectAsOptions` (default false): `select` fields render as tap-to-pick option rows. `progressLabel` (default `Question {n} of {m}`; `{n}` and `{m}` are replaced), `startLabel` (first-step button; default = `nextLabel`), `nextLabel` (default `Next`), `backLabel` (default `Back`; accessible name of the arrow-only Back button).
  - Progressive enhancement: the server render, no-JS and viewports at or above `steppedBelow` are the stacked form. Below it, after hydration (`useBelow`, `useSyncExternalStore` on `matchMedia`), one step shows at a time. All fields stay in the DOM (hidden), so the submission is the same FormData to the same route.
  - `resolveSteps(fields, steps?)`: no `steps` = one step per input field with the field label as heading. With `steps`: an input field goes to the first step naming it; unknown names are ignored; steps with no real field are dropped; input fields no step names are appended to the LAST step; `message` blocks travel with the next input field (or the last step). A single-field step with no heading takes the field label.
  - Validation: while stepped the form is `noValidate`; per-step validation is inline (the field's own error slot, cleared on edit). A step change moves focus to the step heading (`<h3 id="<idBase>-step-<i>" tabIndex={-1}>`); a failed field or server error focuses that field, jumping to its step. Turnstile mounts on the last step only.
  - The Next and Send buttons are keyed (`key="next"` / `key="send"`). They previously shared one unkeyed slot, so React changed the button's `type` to `submit` during the click and the form submitted on arrival at the last step.
  - Slots added to `PayloadFormClassNames`: `progress`, `step`, `stepHeader`, `stepNav` (stepped-only; they replace the defaults when set), `option` (appended).
- Per-instance ids (F97, F98):
  - `CMSForm` takes a number from a request-scoped counter (`cache(() => ({ n: 0 }))`) and passes `idPrefix = f<n>` to `PayloadForm`; the id base is `<idPrefix>-<useId()>`. `useId()` alone collided between the layout's footer form and a page-block form (same RSC tree path).
  - Field ids are `<idBase>-<field name>`; the Turnstile container id is `<idBase>-turnstile` (`TurnstileWidget` takes an `id` prop; the library default `cf-turnstile` is shared and was duplicated).
  - `FormEmbed`'s reminder switch used to render the form twice in the streamed HTML, which also duplicated ids; see [FormEmbed, reminder variant](#formembed-reminder-variant-unit-s5-6).

**Notes**
- Residual differences from the design inside this foundation, accepted by default (F84): progress label 13px vs the design's 11px, text check marks and arrows instead of icons, textarea fixed at 150px, no personalised "Got it, {firstName}" or booking line on the stepped confirmation.

### VideoFacade (`src/components/VideoFacade.tsx`)

**Files**: `src/components/VideoFacade.tsx`; `src/lib/youtube.ts` (`youtubeVideoId(url)`). Used by `ReviewWall/feed.tsx` and `TestimonialRow/Component.tsx`.

**Fields & schema**: none. The video URL is `testimonials.video.url`.

**Wiring**
- Props: `videoId`, `label` (accessible name of the play control), `title` (iframe title), `className?`, `children?` (poster and overlays, server-rendered by the caller). The wrapper supplies `group relative`.
- Click-to-load: no request to YouTube is made until the click. On click the control is replaced by an iframe at `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` (`allow="autoplay; encrypted-media; picture-in-picture"`, `allowFullScreen`, `loading="lazy"`) and focus moves to it.
- Before hydration (and without JS) the control is an `<a href="https://www.youtube.com/watch?v=<id>" target="_blank" rel="noopener noreferrer">` with sr-only text `<label> (opens YouTube in a new tab)`; after hydration (`useSyncExternalStore`) it is a `<button type="button" aria-label=label>`.
- Revalidation and migration: none.

**Notes**
- F51(c) decision: embed the player, click-to-load, nocookie. A video testimonial without a poster renders an empty tile with the play control and does not fetch a YouTube thumbnail (F82).
- No Content-Security-Policy exists in the app (F83). If one is added (or set at Cloudflare) it needs `frame-src https://www.youtube-nocookie.com`.

### Button transition (`src/components/ui/Button.tsx`)

- The base class list uses `transition-[color,background-color,border-color,filter,translate]` (previously `transition-all`), duration 180ms. `transition-all` tweened `outline-color` from the inherited cream ring to ink, so the header "Book a Call" button showed a cream ring on white at the first frames of focus. Applies to every `Button` / `ButtonLink`.

### Dark-ground focus ring rule

- `src/app/(frontend)/styles.css`, `@layer base`: `:focus-visible` is a 2px ink ring with 2px offset; `[data-tone='dark'] :focus-visible, [data-tone='dark']:focus-visible` sets `outline-color` to the `cream` token.
- Hook: `data-tone`. `Section` (`src/components/ui/Section.tsx`) renders `data-tone={tone}` (`light` | `grey` | `dark`), and the standard `<footer>` in `SiteFooter` carries `data-tone="dark"`. The skip link sets its own cream outline (`focus:outline-cream`).

### Absolute media URLs for structured data (`src/lib/metadata.ts`)

- `absoluteMediaUrl(media, size = 'og')` returns an absolute URL for a populated media doc: `sizes.og.url` for `'og'` (falling back to `url`), `url` for `'original'`; relative URLs are prefixed with `getSiteUrl()`. Unpopulated ids return `undefined`.
- Logos in JSON-LD use `'original'`: the Article JSON-LD publisher logo (`caseStudyJsonLd`) and [OrganizationJsonLd](#organization--localbusiness-json-ld-organizationjsonld). Share images keep `'og'`.

---

## 1. Homepage

Variants added to these blocks by big step 4 (Hero, CaseStudyCards, TwoTrackPanels, PhaseTimeline, TestimonialRow) are documented under pages 2 to 6, where each is first used.

Locked section order: Hero → Scarcity strip → Client logo strip → Featured case studies → Mini CTA strip → What we do → Process timeline → Founder/team + about → Testimonials → Final CTA → Footer (standard).

The homepage also renders the company structured data: [Organization / LocalBusiness JSON-LD](#organization--localbusiness-json-ld-organizationjsonld) (documented under page 12).

All blocks below are registered in `src/blocks/index.ts` and `src/blocks/components.ts` (shared description in [B0](#frontend-foundation-unit-b0)) and have fixtures in `src/showcase/registry.ts`. Every block lives on `pages.layout` (tables `pages_blocks_<slug>` plus `_pages_v_blocks_<slug>` for versions). Unless stated, revalidation is the `pages` collection hook (tag `pages` + the page path) and the frontend is `force-dynamic`. Client islands: the only one among these blocks is `PhaseTimeline/AccordionSteps.tsx`; every other block is a server component. Data-reading blocks (ProofStrip, CaseStudyCards, TestimonialRow, FinalCTA) are async server components using the Local API with public access.

### Hero (unit B3)

Section: Hero. Variant built now: `typographic`. Later units append `service`, `article`, `vsl` to `variant.options` with their own fields.

**Files**
- `src/blocks/Hero/config.ts`, `src/blocks/Hero/Component.tsx` (`HeroBlock`, server component).

**Fields & schema** (slug `hero`, `interfaceName: 'HeroBlock'`)
- `variant`: select, required, default `typographic`.
- `eyebrow` / `eyebrowTick`: `eyebrowField()` row (tick default true).
- `heading` (required) / `accentPhrase`: `headlineFields()`.
- `badge`: group. `badge.show` checkbox (default true); `badge.text` text (shown while `show` is not false). The pill renders only when `show !== false` and `text` is non-blank.
- `body`: textarea.
- `pricingNote`: `pricingNote()` text (max 80). Rendered inline after `body` in the same paragraph.
- `ctas`: array, max 2 rows, each `{ link }` (`linkField`, required). Row 1 renders `primary`, row 2 `ghost`.
- `subNote`: text, small note under the buttons.
- `verticalMicrocopy`: text. Vertical on the left from `lg`; under the paragraph below `lg`.
- `geometry`: checkbox, default true. The wine logo-shaped mask (`/logo-duha.png`) behind the headline.

**Wiring**
- Registered as the first entry of `pageBlocks`; component key `hero`.
- Showcase: `hero` / `typographic` (homepage copy), `hero` / `typographic — minimal` (heading only, geometry off).
- Reads no collection or global.
- Migration: `20261022_025136_b3_hero` (tables `pages_blocks_hero`, `pages_blocks_hero_ctas`, `_pages_v_*` equivalents, enum `enum_pages_blocks_hero_variant`; the first block migration, which adds the `layout` tables to `pages`).

**Notes**
- The only block that renders an `h1` (via `AccentHeadline level={1} as="h1"`).
- Every optional field renders nothing when empty. Mobile-first; desktop build from `md`.

### ProofStrip (unit B3)

Section: Scarcity strip + Client logo strip. Variant built now: `scarcity`. The `metrics` variant (page 15) comes later.

**Files**
- `src/blocks/ProofStrip/config.ts`, `src/blocks/ProofStrip/Component.tsx` (`ProofStripBlock`, async server component).

**Fields & schema** (slug `proofStrip`, `interfaceName: 'ProofStripBlock'`)
- `variant`: select, required, default `scarcity`.
- `statements`: array, max 2 rows; each row `{ key }` = `scarcityRef()` (default `none`). Shown side by side.
- `pricingNote`: text (max 80), centred under the statements.
- `logos`: group.
  - `logos.show`: checkbox, default true.
  - `logos.eyebrow`: text, default `Stores we've run numbers for`.
  - `logos.source`: select `flagged` (default; clients ticked "Show in logo strip") or `manual`.
  - `logos.clients`: relationship to `clients`, `hasMany`, `maxDepth: 2`; shown when `source = manual`.

**Wiring**
- Registered in `pageBlocks`; component key `proofStrip`.
- Showcase: `proofStrip` / `scarcity`, `scarcity — logos hidden`, `scarcity — one statement`, `scarcity — logo images`.
- Data read through the Local API (public access, `overrideAccess: false`):
  - `scarcity` global (`findGlobal`, `depth: 0`) for the picked keys.
  - `clients`: `flagged` → `find` where `showInLogoStrip = true` and `_status = published`, sort `sortOrder`, `limit: 12`, `depth: 1`; `manual` → picked ids fetched with `_status = published` (`depth: 1`), keeping the editor's order.
- Migration: `20261022_030147_b3_homepage_batch1` (tables `pages_blocks_proof_strip`, `pages_blocks_proof_strip_statements`, `_pages_v_*`; the `clients` relationship adds a column to `pages_rels` / `_pages_v_rels`).

**Notes**
- Loud/quiet contract (CLAUDE.md rule 2): a statement renders only with a usable statistic (tokens filled by `fillScarcityTokens`) AND a non-blank `reason`; otherwise it is skipped with a `console.error`. There is no render path for a number without its reason. A purely numeric statistic renders large (`ongoing`, `capacity` style); other statements render as a headline line.
- The whole block renders nothing when there are no resolvable statements and no logo clients.
- Client without a logo renders its name as text. Unpublished clients are never shown.
- A failed read is logged and degrades (statements skipped / row hidden); it never fails the page.

### CaseStudyCards (unit B3)

Section: Featured case studies (toggleable, with fallback). Layout built now: `cards`. Fallback modes built now: `ledger` and `note`. Later units append the `ledger` / `staggered` / `next-link` layouts, the `track` source, `loadMore`, and the `testimonials` / `metric-strip` / `logo-strip` fallback modes.

**Files**
- `src/blocks/CaseStudyCards/config.ts`, `src/blocks/CaseStudyCards/Component.tsx` (`CaseStudyCardsBlock`, async server component; `StudyCard` internal).

**Fields & schema** (slug `caseStudyCards`, `interfaceName: 'CaseStudyCardsBlock'`)
- `layout`: select, required, default `cards`.
- `eyebrow` / `eyebrowTick` and `heading` / `accentPhrase` (`headlineFields({ required: false })`): shown only when studies are live.
- `source`: select, required, default `featured`: `featured` (studies ticked Featured), `latest`, `manual`.
- `caseStudies`: relationship to `case-studies`, `hasMany`, `maxDepth: 2`; shown when `source = manual`.
- `limit`: number 1 to 3, default 3.
- `cardLinkLabel`: text, default `Read the case study`.
- `allLink`: `linkField`, optional "All studies" link (shown only when studies are live).
- `fallbackMode`: select, required, default `ledger`: `ledger` or `note`.
- `fallbackEyebrow` (default `No studies live yet — the numbers we can show`), `fallbackHeading` (default `Numbers anyway.`), `fallbackAccentPhrase` (default `anyway.`, validated as a substring of `fallbackHeading`, same admin component as `accentPhrase`), `fallbackBody` (textarea, default `Studies publish here as clients sign off.`).
- `fallbackMetrics`: array, max 3 rows, `metricFields()` (value, label, sub, accent); shown when `fallbackMode = ledger`.
- `pricingNote`: text (max 80).

**Wiring**
- Registered in `pageBlocks`; component key `caseStudyCards`.
- Showcase: `caseStudyCards` / `cards` (3 published fixture studies, manual), `cards — featured (DB)`, `cards — fallback ledger`, `cards — fallback note`.
- Data: `source = featured | latest` → `find` on `case-studies` with `_status = published`, `draft: false`, `overrideAccess: false`, `depth: 1`, `limit`, sort `-publishedAt` (plus `featured = true` for `featured`). `source = manual` → the page-populated `caseStudies`, keeping only populated objects with `_status = published`.
- Migration: `20261022_031049_b3_homepage_batch2` (tables `pages_blocks_case_study_cards`, `pages_blocks_case_study_cards_fallback_metrics`, `_pages_v_*`; relationship columns in the rels tables; enum `enum_pages_blocks_case_study_cards_layout`).

**Notes**
- Launch-state rule (CLAUDE.md rule 1): no field forces the live state. Cards render only from published studies. With none (also if all are unpublished or the read fails) the designed fallback renders: `ledger` shows the text block beside a ruled list of the metric rows (a pricing note, if set, sits under the list); `note` shows the text block only (the pricing note under the text). If `fallbackMode` is `ledger` but there are no metric rows it renders like `note`.
- A draft study is never shown, even when picked by hand: an unreadable pick arrives as a bare id and is dropped.
- Fallback body copy must state what is true; no "coming soon".
- Card links go to `/work/<slug>`, a route that does not exist yet.
- Ledger rows were prices in the design; CLAUDE.md rule 5 forbids price blocks, so rows are `metricFields` and a price is only the small `pricingNote`.

### MiniCTAStrip (unit B3)

Section: Mini CTA strip. Variant built now: `band`. `inline` and `button` come later.

**Files**
- `src/blocks/MiniCTAStrip/config.ts`, `src/blocks/MiniCTAStrip/Component.tsx` (`MiniCTAStripBlock`, server component).

**Fields & schema** (slug `miniCTAStrip`, `interfaceName: 'MiniCTAStripBlock'`)
- `variant`: select, required, default `band`.
- `text`: text, required; the one-line statement (shown in capitals).
- `link`: `linkField`, required; button text and destination. The whole strip is one link.

**Wiring**
- Registered in `pageBlocks`; component key `miniCTAStrip`. Showcase: `miniCTAStrip` / `band`, `band — link unresolved`.
- Reads no collection or global.
- Migration: `20261022_030147_b3_homepage_batch1` (table `pages_blocks_mini_c_t_a_strip`, `_pages_v_*`, enum for `variant`).

**Notes**
- Fallback: a link that does not resolve (empty reference, unpublished target, no label) renders the text alone, no button.
- Dark section; the whole strip is a 44px-minimum link target.

### TwoTrackPanels (unit B3)

Section: What we do (We build it / Then we grow it). Variant built now: `equal`. `contrast` and `primary-secondary` come later as new options with their own fields.

**Files**
- `src/blocks/TwoTrackPanels/config.ts`, `src/blocks/TwoTrackPanels/Component.tsx` (`TwoTrackPanelsBlock`, server component).

**Fields & schema** (slug `twoTrackPanels`, `interfaceName: 'TwoTrackPanelsBlock'`)
- `variant`: select, required, default `equal`.
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: false })`.
- `heading` (required) / `accentPhrase`: `headlineFields()`.
- `panels`: array, exactly 2 rows (`minRows` and `maxRows` 2); each row:
  - `label`: text, optional small tag.
  - `title`: text, required (shown in capitals).
  - `accentTitle`: checkbox, default false (title in the wine accent colour).
  - `body`: textarea, required.
  - `pricingNote`: text (max 80), appended inline after `body`.
  - `link`: `linkField`, optional, appended inline after the paragraph.

**Wiring**
- Registered in `pageBlocks`; component key `twoTrackPanels`. Showcase: `twoTrackPanels` / `equal`, `equal — no links/pricing`.
- Reads no collection or global.
- Migration: `20261022_030147_b3_homepage_batch1` (tables `pages_blocks_two_track_panels`, `pages_blocks_two_track_panels_panels`, `_pages_v_*`).

**Notes**
- A track missing its `title` or `body` is skipped (logged with `console.error`). Each track is one running paragraph: title, body, pricing note, link.
- Prices appear only through the small inline `pricingNote` (CLAUDE.md rule 5).

### PhaseTimeline (unit B3)

Section: Process timeline (8-beat; independence handover at full weight). Variant built now: `accordion`. Later units append `arc` / `build-run` / `engine-rollout` / `steps` with their own fields (`phases.link`, `steps.tag`, `isSignOff`, `outcomes`, `cta`).

**Files**
- `src/blocks/PhaseTimeline/config.ts`, `src/blocks/PhaseTimeline/Component.tsx` (`PhaseTimelineBlock`, server component), `src/blocks/PhaseTimeline/AccordionSteps.tsx` (client island).

**Fields & schema** (slug `phaseTimeline`, `interfaceName: 'PhaseTimelineBlock'`)
- `variant`: select, required, default `accordion`, not clearable.
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: false })`.
- `heading` (required) / `accentPhrase`: `headlineFields()`.
- `intro`: textarea, optional.
- `phases`: array, 1 to 3 rows; each `number` (text, e.g. "Phase 1"), `title` (text, required), `body` (textarea; shown in the admin only when the variant is not `accordion`, and not rendered by `accordion`).
- `steps`: array, 1 to 10 rows; each `number` (text), `title` (text, required), `phase` (select `1` / `2` / `3`, required, default `1`, not clearable), `detail` (textarea).
- `closingLine`: text, optional.

**Wiring**
- Registered in `pageBlocks`; component key `phaseTimeline`. Showcase: `phaseTimeline` / `accordion` (8 steps, 3 phases), `accordion — minimal` (1 phase, 3 steps, a step without detail, closing line).
- Reads no collection or global.
- Migration: `20261022_031049_b3_homepage_batch2` (tables `pages_blocks_phase_timeline`, `pages_blocks_phase_timeline_phases`, `pages_blocks_phase_timeline_steps`, `_pages_v_*`, enum for `variant`).

**Notes**
- Independence rule (CLAUDE.md): the LAST phase always renders at full visual weight (accent label and accent bar). There is deliberately no field to switch it off.
- Server render: every step is a native `<details>`/`<summary>` (works with JS off), the first step open. A phase or step without a title is skipped (logged). A step pointing at a phase that does not exist is shown under the last phase (logged).
- Client island `AccordionSteps.tsx` (`'use client'`, reason: click and scroll listeners): one step open at a time and always one open (clicking the open step does nothing); a `toggle` backstop for opens that bypass the click; below `md` the step nearest 45% of the viewport height opens on scroll (rAF-throttled, 24px hysteresis, paused after a click until the visitor scrolls half a screen, disabled under `prefers-reduced-motion: reduce`, never moves focus). The design's desktop auto-advance timer is not ported (WCAG 2.2.2).
- Transitions use the design's exact cubic-bezier values; the global reduced-motion override in `styles.css` zeroes them.

### TeamIntro (unit B3)

Section: Founder/team + about, first instance (`intro` variant). The second homepage instance uses the `founder-card` variant: see [TeamIntro, founder-card variant](#teamintro-founder-card-variant-unit-b3). Variants built now: `intro` and `founder-card`. Later pages reuse these or append new options.

**Files**
- `src/blocks/TeamIntro/config.ts`, `src/blocks/TeamIntro/Component.tsx` (`TeamIntroBlock`, server component; one component for both variants).

**Fields & schema** (slug `teamIntro`, `interfaceName: 'TeamIntroBlock'`)
- `variant`: select, required, default `intro`: `intro` or `founder-card`.
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: false })`.
- `heading` (required) / `accentPhrase`: `headlineFields()`.
- `body`: textarea.
- `photo`: upload to `media`, `maxDepth: 1`; shown when `variant = intro`.
- `member`: relationship to `team-members`, required, `maxDepth: 2`; shown when `variant = founder-card`.
- `link`: `linkField`, optional.

**Wiring**
- Registered in `pageBlocks`; component key `teamIntro`. Showcase: `teamIntro` / `intro`, `intro — no photo`, `founder-card`, `founder-card — no member` (the two `founder-card` entries sit after the TestimonialRow entries, matching homepage order).
- Reads no collection or global itself; `member` and `photo` come populated from the page query (`PAGE_QUERY_DEPTH = 2`).
- Migration: `20261022_031049_b3_homepage_batch2` (table `pages_blocks_team_intro`, `_pages_v_*`, enum `enum_pages_blocks_team_intro_variant`; `photo` is a column, `member` is a relation column).

**Notes**
- `intro`: text column plus a 4:5 photo (full-bleed under the text on mobile). No photo: text only, single column.
- Link renders only when it resolves and has a label.
- Client island: none.

### TestimonialRow (unit B3)

Section: Testimonials (3 cards) plus the "A study in full" card. Variant built now: `row`. `client-voice` (page 2) comes later; `leadMetric` (page 16) is deliberately not built.

**Files**
- `src/blocks/TestimonialRow/config.ts`, `src/blocks/TestimonialRow/Component.tsx` (`TestimonialRowBlock` async server wrapper and `TestimonialRowView` pure render), `src/blocks/TestimonialRow/loadFeaturedStudy.ts` (`server-only`).

**Fields & schema** (slug `testimonialRow`, `interfaceName: 'TestimonialRowBlock'`)
- `variant`: select, required, default `row`.
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: false })`.
- `heading` / `accentPhrase`: `headlineFields({ required: false })`.
- `testimonials`: relationship to `testimonials`, `hasMany`, 1 to 3, `maxDepth: 2`.
- `studyCard`: group.
  - `show`: checkbox, default true.
  - `label`: text, default `A study in full`.
  - `source`: select, required, default `featured` (newest published study ticked Featured) or `manual`.
  - `caseStudy`: relationship to `case-studies`, `maxDepth: 2`; shown when `source = manual`.
  - `readLabel`: text, default `Read the study`.
  - `fallbackMetric`: group = `metricFields({ required: false })` (value, label, sub, accent); the quiet figure shown while no study is published.
- `cta`: `linkField`, optional "link under the cards".

**Wiring**
- Registered in `pageBlocks`; component key `testimonialRow`. Showcase: `testimonialRow` / `row`, `row — mixed, no study`, `row — published study (manual)`, `row — empty`.
- Data: testimonials and the manual `caseStudy` come populated from the page query. `loadFeaturedStudy()` (only when the card is shown and `source = featured`): `find` on `case-studies` where `featured = true` and `_status = published`, sort `-publishedAt`, `limit: 1`, `depth: 1`, `overrideAccess: false`; a failed read is logged and treated as none.
- Migration: `20261022_031049_b3_homepage_batch2` (table `pages_blocks_testimonial_row`, `_pages_v_*`, enum for `variant`; relation columns in the rels tables; `studyCard` and `fallbackMetric` are flattened columns).

**Notes**
- Published only: a testimonial renders only with `_status` published (or unset); drafts are skipped. A study card renders only for a published study that has a slug and a non-blank headline metric value and label.
- States: no testimonials and no study/figure → the block renders nothing; testimonials only (no study, no complete fallback figure) → the cards reflow into a row; study/figure only → the study column alone. The fallback figure needs both `value` and `label`, otherwise nothing renders in the slot.
- A video testimonial renders a poster with a link to the YouTube watch URL in a new tab (no embed); an unparseable YouTube URL logs an error and the quote renders alone. Rating shows stars only when set.
- The inline video tile is a stop-gap; it is flagged to be replaced by the shared VideoTile (SCHEMA X4) when that exists.

### TeamIntro, founder-card variant (unit B3)

Section: second founder block, "One founder, no layers." Same block and files as [TeamIntro](#teamintro-unit-b3); this entry covers the variant only.

**Files**
- `src/blocks/TeamIntro/config.ts`, `src/blocks/TeamIntro/Component.tsx`.

**Fields & schema**
- Select `variant = founder-card`. Fields used: `eyebrow`, `heading`, `accentPhrase`, `body`, `member` (required, `team-members`, `maxDepth: 2`), `link`. `photo` is hidden in the admin for this variant.
- Reads from the member: `name`, `role`, `photo` (decorative, `alt=""`), `socials` (platform and https URL; each opens in a new tab with a platform icon and label).

**Wiring**
- Component key `teamIntro`. Showcase: `teamIntro` / `founder-card` and `founder-card — no member`.
- Migration: `20261022_031049_b3_homepage_batch2`.

**Notes**
- Fallback: no member, an unpopulated member (id only: draft or unreadable) or a member whose `_status` is not `published` makes the whole block render nothing (logged with `console.error`), never a half card.
- No "latest posts" (R12); copy is single-founder (R17). The headline renders at `level={2}` with the wine accent colour.

### FinalCTA (unit B3)

Section: Final CTA (restates capacity), the dark band before the footer. One variant; the dot matrix and wine logo mark are fixed by the design.

**Files**
- `src/blocks/FinalCTA/config.ts`, `src/blocks/FinalCTA/Component.tsx` (`FinalCTABlock`, async server component).

**Fields & schema** (slug `finalCTA`, `interfaceName: 'FinalCTABlock'`)
- `heading` / `accentPhrase`: `headlineFields({ required: false })`. Empty heading falls back to the site default.
- `body`: textarea, optional.
- `capacity`: `scarcityRef({ name: 'capacity', defaultValue: 'builds-line' })`; `none` hides the line.
- `buttons`: array, 1 to 2 rows, each `{ link }` (`linkField`, required). Empty falls back to the site default button.

**Wiring**
- Registered in `pageBlocks`; component key `finalCTA`. Showcase: `finalCTA` / `default`, `default — no capacity`, `default — template defaults` (empty heading and no buttons, `engines-line`).
- Data (public Local API, `overrideAccess: false`): `site-settings` global (`depth: 1`) for `templateDefaults.finalCtaHeading` and `templateDefaults.finalCtaButton`; `scarcity` global (`depth: 0`) when `capacity` is not `none`.
- Migration: `20261022_030147_b3_homepage_batch1` (tables `pages_blocks_final_c_t_a`, `pages_blocks_final_c_t_a_buttons`, `_pages_v_*`).

**Notes**
- Loud/quiet contract: the capacity line renders the statistic (loud, bold) with its reason quiet beneath; a missing statement, an unfillable token or a blank reason skips the line with a `console.error`. Never a bare number.
- Editing `site-settings` or `scarcity` revalidates through their global hooks (layout-wide), so default headline/button and capacity changes appear without a rebuild.
- A heading left empty with no site default logs an error and the headline is omitted. The accent phrase only applies to an explicit heading.
- The CTA buttons use the `ghost-light` variant; the second button has a lighter border.

## 2. Case Study template

Data source: the [`case-studies` collection (C7)](#case-studies-unit-c7) (site-wide section). Locked section order: Hero (client, oversized result metric, browser-framed visual) → The Before → The Strategy → The Results → Testimonial / Client Voice → Newsletter CTA → Final CTA → Footer. The template is not a `pages` doc: one `case-studies` document is fed into existing block components (no layout builder). Blocks below are documented in on-page order.

### Template route and view (unit S4-12)

**Files**
- `src/app/(frontend)/work/[slug]/page.tsx`: the route `/work/<slug>`.
- `src/components/CaseStudyView.tsx`: `CaseStudyView({ study })`, the on-page composition.
- `src/lib/caseStudies.ts`: `getCaseStudy(slug)`, `CASE_STUDY_QUERY_DEPTH = 2`.
- `src/lib/metadata.ts`: `caseStudyMetadata(study, { preview })`, `caseStudyJsonLd(study)`.
- `src/app/sitemap.ts` (case-study entries), `src/collections/CaseStudies.ts` (`admin.preview` / `admin.livePreview`).

**Fields & schema**
- None added. Reads the existing `case-studies` fields; no migration. Mapping from the document to the blocks, in locked page order:

| # | Section | Block · variant | Study fields → props |
|---|---|---|---|
| 1 | Hero | `hero` · `article` | `title` → `heading`; `accentPhrase`; `geometry: true`; `breadcrumb` = [`Work` → `/work`, current crumb `Study NN — <client name>` (parts omitted when missing; `Study` if both)]; `headlineMetric` → `resultMetric`; `engagementLine` → `body`; `publishedAt` + `figuresApproved` + `readTime` → `metaLine` (`Published Mon YYYY · Client-approved figures · N min read`, each part only when present); `inShort` → `summary.body` (label `In short`); `heroMedia` → `media`, `mediaFrame: 'browser'` |
| 2 | The Before / The Strategy / The Results | `richContent` · `article` | `narrative.before`, `.strategy`, `.results` (each `title` + `body`) are joined into ONE Lexical document: each non-empty `title` becomes an H2 followed by that section's body; `numberSections: true` (01 / 02 / 03) |
| 3 | Results table | `metricEvent` · `table` | `resultsTable` via `resultsTableToMetricEvent`: `eyebrow` → `eyebrow`, `columns` → `columns`, `method` → `note`, `rows[]` (`measure`, `baseline`, `after`, `change`) → `items[]` (`label`, `baseline`, `value` = after, `change`); first row `accent` |
| 4 | Client voice | `testimonialRow` · `client-voice` | `clientVoice` group passed straight to `TestimonialClientVoiceView`; labels passed explicitly: number `04`, heading `What we'd do differently`, phases label `How this maps to our phases` |
| 5 | Next study | `caseStudyCards` · `next-link` | `source: 'latest'`, `nextLabels` `Next study` / `Read it →`, empty `allLink`; `currentStudy` = `{ id, studyNumber, publishedAt }` |
| 6 | Newsletter CTA | `newsletterBand` · `band` | `closing.newsletterHeading` → `heading` |
| 7 | Final CTA | `finalCTA` | `closing.finalCtaHeading` → `heading`; `capacity: 'builds-line'`; `buttons: []` (site defaults) |

**Wiring**
- Route:
  - `getCaseStudy(slug)` (React `cache`, dedupes page and metadata): public = `find` on `case-studies` where slug equals and `_status` is `published`, `draft: false`, `overrideAccess: false`, `depth: 2`. Draft preview: only when Next draft mode is on AND `getPreviewUser()` returns a staff user; then `draft: true`, `user`, `overrideAccess: false`.
  - No study: `findRedirect('/work/<slug>')` (a hit calls `permanentRedirect` or `redirect`), else `notFound()`.
  - `/work` itself is the `work` pages doc served by `[...slug]`; the `[slug]` segment matches one segment only, and `pageSlugError` forbids pages under `work/`, so they cannot collide.
  - `force-dynamic` through the `(frontend)` layout; no `generateStaticParams`.
- `CaseStudyView` renders `PageShell` (standard header and footer), `<ReadingProgress />` (template behaviour, not a field), then `<main>` with the seven sections. It has no markup or styling of its own.
- Metadata: `caseStudyMetadata` = title `meta.title` → seo-defaults template with `%s` = study title; description `meta.description` → `cardSummary` → `inShort` → seo-defaults; share image `meta.image` → `heroMedia` (its `og` size) → seo-defaults; canonical `/work/<slug>`; Open Graph type `article` with published and modified times; noindex in draft preview (and outside production, per `buildMetadata`).
- JSON-LD: `caseStudyJsonLd` emits schema.org `Article` (headline, `datePublished`, `dateModified`, `image` from `heroMedia`, `url` / `mainEntityOfPage`, `author` and `publisher` = the seo-defaults Organization), serialised with `<` escaped.
- Sitemap: published case studies appended after pages (see [B2](#page-router-unit-b2)).
- Preview: `CaseStudies.admin.preview` and `admin.livePreview.url` = `previewUrl('/work/<slug>')` (`/_preview?path=…`), none until the doc has a slug; breakpoints `PREVIEW_BREAKPOINTS`.
- Revalidation: the `case-studies` hooks revalidate `/work`, `/work/<slug>` and tag `case-studies` (SCHEMA §10). Unchanged.
- Migration: none.

**Notes**
- Each section keeps its block's own empty state: no client voice renders nothing; no other published study renders no next line; no newsletter form and no `/newsletter` page renders no band.
- PROGRESS flag F76: template labels (`Work`, `Study NN`, `Published`, `Client-approved figures`, `min read`, `In short`, `Next study`, `Read it →`, client-voice labels) are hardcoded in `CaseStudyView`; the capacity line is `builds-line` for every study; the breadcrumb `Work` link 404s until the `work` page doc is published.
- Case studies are drafts at launch, so `/work/<slug>` is 404 to the public until a study is published.

### Hero, article variant (unit S4-1)

Section: Hero. Variants of `hero` after this unit: `typographic`, `service`, `article`. Files shared by the three variants of S4-1 are listed here.

**Files**
- `src/blocks/Hero/config.ts`, `Component.tsx` (dispatches on `variant`), `ArticleHero.tsx`, `ServiceHero.tsx`, `Breadcrumb.tsx`, `logoMask.ts` (the logo mask style shared by `typographic` and `article`).

**Fields & schema** (slug `hero`; fields shown only for the listed variants via `admin.condition`)
- `variant`: options now `typographic`, `service`, `article`.
- `breadcrumb` (`service`, `article`): array, max 4; row = `label` (text, required), `page` (relationship to the `LINK_TARGETS` collections, `maxDepth: 1`), `url` (text; a site path or an `https://` address, validated). Beyond SCHEMA (F70): it is `{label, page, url}`, not a `linkField`, so middle crumbs can be plain text.
- `resultMetric` (`article`): group = `metricFields({ required: false })`. Beyond SCHEMA §8.1 (F70).
- `metaLine` (`article`): text, right side of the rule under the headline.
- `summary` (`article`): group `label` (default `In short`), `body` (textarea; empty hides the box).
- `media` (`article`): upload to `media`, `maxDepth: 1`; `mediaFrame` select `none` (default) | `browser` | `full-bleed`.
- `body` is also used by `article` (left side of the rule: the engagement scope). `eyebrow`, `heading` / `accentPhrase`, `geometry` (typographic and article) unchanged.
- `stats`, `phaseStrip`: see the p3 and p4 entries.

**Wiring**
- Registered since B3; no change to registration. Showcase: `hero` / `article — browser media`, `article — no media`, `article — full-bleed media`.
- Used by the case-study template ([S4-12](#template-route-and-view-unit-s4-12)) with props computed from the study.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (tables `pages_blocks_hero_breadcrumb`, `pages_blocks_hero_stats`, `pages_blocks_hero_phase_strip` and the `_pages_v_*` equivalents; columns `result_metric_*`, `meta_line`, `summary_label`, `summary_body`, `media_id`, `media_frame` on `pages_blocks_hero`; enum `enum_pages_blocks_hero_media_frame`).

**Notes**
- `article`: 820px column on the dot-matrix ground, the only h1. Breadcrumb is `nav aria-label="Breadcrumb"` with an ordered list; the last crumb is `aria-current="page"` and never a link. The result metric, meta rule, summary box and media each render only when filled. Media: `browser` = 2px ink frame, hard shadow, grey bar with three dots; `full-bleed` = edge to edge; `none` = ring shadow.
- The browser frame and metric are derived designs (F70, needs design sign-off).
- The `typographic` markup is unchanged when `stats` and `phaseStrip` are empty (rendered HTML diffed identical).

### RichContent, article variant (unit S4-8)

Section: The Before / The Strategy / The Results (also About body and the SEO article templates later).

**Files**
- `src/blocks/RichContent/config.ts`, `src/blocks/RichContent/Component.tsx` (`RichContentBlock`, exported `ArticleBody({ data, numbered })`, type `RichContentProps`).

**Fields & schema** (slug `richContent`, `interfaceName: 'RichContentBlock'`)
- `variant`: select, required, default `article` (only option; `legal` / `band` come later).
- `eyebrow` / `eyebrowTick`: `eyebrowField()`.
- `heading` / `accentPhrase`: `headlineFields({ required: false })`; empty heading is allowed.
- `numberSections`: checkbox, default true. Adds 01, 02, 03 above each H2.
- `body`: richText, required, own Lexical editor: paragraph, headings H2 to H4, bold, italic, bullet and ordered lists, quote, horizontal rule, `richTextLinkFeature()`, upload of `media` with a `caption` text field (`maxDepth: 1`), fixed and inline toolbars.

**Wiring**
- Registered in `pageBlocks`; component key `richContent`. Showcase: `richContent` / `article`, `article — minimal`.
- Reads no collection. Renders through the shared [RichText wrapper](#richtext-wrapper-srccomponentsrichtexttsx) with article converters on top: h1 and h2 render as numbered `h2`, h5/h6 as `h4`; quote, horizontal rule; uploads render through `Media` in a 2px ink frame with the caption. `ArticleBody` is the prose on its own so the case-study template can render a Lexical document it built from `narrative`.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (tables `pages_blocks_rich_content`, `_pages_v_blocks_rich_content`, enum `enum_pages_blocks_rich_content_variant`).

**Notes**
- Renders nothing (with a `console.warn`) when the body is empty and there is no heading. An unpopulated upload node is logged and skipped; a non-image upload renders as a download link. Internal links to an unpublished or unresolved target render as plain text.
- Server component; no client island.

### MetricEvent, table variant (unit S4-9)

Section: The Results table.

**Files**
- `src/blocks/MetricEvent/config.ts`, `src/blocks/MetricEvent/Component.tsx` (`MetricEventBlock`, `MetricEventData`, `resultsTableToMetricEvent`).

**Fields & schema** (slug `metricEvent`, `interfaceName: 'MetricEventBlock'`)
- `variant`: select, required, default `table` (only option).
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: false })`.
- `heading` / `accentPhrase`: `headlineFields({ required: false })`.
- `columns`: group `measure`, `baseline`, `after`, `change` (text; defaults `Measure`, `Before`, `After`, `Change`). Beyond SCHEMA (F69).
- `items`: array; each = `metricFields()` (`value` = the "after" figure, `label` = the measure, `sub`, `accent`) plus `baseline` and `change` text.
- `note`: textarea, the method line under the table.

**Wiring**
- Registered in `pageBlocks`; component key `metricEvent`. Showcase: `metricEvent` / `table`, `table — one row`, `table — sparse rows`, `table — empty`.
- `resultsTableToMetricEvent(doc.resultsTable)` maps `eyebrow`, `columns`, `method` → `note`, `rows` → `items`, first row accented.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (tables `pages_blocks_metric_event`, `pages_blocks_metric_event_items`, `_pages_v_*`, enum `enum_pages_blocks_metric_event_variant`).

**Notes**
- A real `<table>` with explicit ARIA roles; below `md` rows become stacked cards using CSS only. Rows without both `label` and `value` are dropped; with no valid row the block renders nothing (`console.warn`).
- The change carries its own sign, an arrow (▲ for a leading `+`, ▼ for `-`, `−` or `–`) and a screen-reader word (`Increase:` / `Decrease:`), so it never relies on colour (the arrows are an addition to the design, F69). Text without a sign (e.g. `Handover`) is shown as written.
- Server component.

### TestimonialRow, client-voice variant (unit S4-10)

Section: Testimonial / Client Voice. Extends the [homepage TestimonialRow](#testimonialrow-unit-b3).

**Files**
- `src/blocks/TestimonialRow/config.ts`, `src/blocks/TestimonialRow/Component.tsx` (exports `TestimonialClientVoiceView`, `TestimonialRowView`, `TestimonialRowBlock`).

**Fields & schema**
- `variant`: options now `row` and `client-voice`.
- Row fields (`eyebrow`, `heading`, `testimonials`, `studyCard`, `cta`) are now shown only for `row` (or unset); their names and shapes are unchanged.
- `clientVoice` (`client-voice`): group mirroring `case-studies.clientVoice` field for field: `testimonial` (relationship to `testimonials`, `maxDepth: 2`), `doDifferently` (richText, small editor: paragraph, bold, italic, lists, link, inline toolbar), `phaseMapping` (textarea), `link` (`linkField`).
- `differentlyNumber` (text, default `04`; clear to hide), `differentlyHeading` (text, default `What we'd do differently`), `phaseLabel` (text, default `How this maps to our phases`).

**Wiring**
- Component key `testimonialRow` (dispatches on `variant`). Showcase: `testimonialRow` / `client-voice`, `client-voice — text only`, `client-voice — no testimonial`.
- The template passes `study.clientVoice` and the three label defaults explicitly to `TestimonialClientVoiceView`.
- `doDifferently` renders through the shared [RichText wrapper](#richtext-wrapper-srccomponentsrichtexttsx).
- Migration: `20261022_052303_b4_pages_2_6_blocks` (`client_voice_*` columns on `pages_blocks_testimonial_row`, `differently_number`, `differently_heading`, `phase_label`; enum `enum_pages_blocks_testimonial_row_client_voice_link_type`; the `testimonial` relationship column).

**Notes**
- Renders only for a populated testimonial whose `_status` is `published` (or absent); otherwise the whole section renders nothing with a server-side `console.warn` (the case study still reads whole). A video testimonial shows its poster (link out to YouTube) above the quote; a text testimonial shows the quote only.
- The "what we'd do differently" part renders only when the rich text has non-blank text. The phases box renders when `phaseMapping` or a resolvable, labelled `link` exists.
- Row variant regression was only partly re-checked by the coder; QA re-shoots the row entries.
- Server component.

### CaseStudyCards, next-link layout (unit S4-2)

Section: Next study. Extends the [homepage CaseStudyCards](#casestudycards-unit-b3). This entry also records the fields S4-2 added for all layouts.

**Files**
- `src/blocks/CaseStudyCards/config.ts`, `Component.tsx` (dispatches on `layout`; exports type `CurrentStudy`), `ledger.tsx`, `LoadMore.tsx` (client island, see page 3).

**Fields & schema** (new in S4-2; `layout`, `source`, `limit`, … from B3 unchanged)
- `layout`: options now `cards`, `ledger`, `next-link`.
- `tone`: select `light` (default) | `grey`; background of the whole section, live and fallback.
- `source`: option `track` added (see page 5).
- `nextLabels` (`next-link`): group `label` (default `Next study`), `readLabel` (default `Read it →`).
- `allLink`: with `next-link`, shown on its own when there is no other published study.
- Ledger and fallback fields: see pages 3, 5 and 6.
- Beyond SCHEMA: PROGRESS flag F72 (`track` is hasMany; `staggered` layout and `logo-strip` fallback not built).

**Wiring**
- Component key `caseStudyCards`. Showcase: `caseStudyCards` / `next-link`.
- The template passes `currentStudy` (a prop, not a block field). Order: study number ascending (unnumbered last), then `publishedAt`, then id; the next published study after the current one, wrapping to the first, never the current study. `source = manual` uses the first published pick that is not the current study.
- Data: `find` on `case-studies` with `draft: false`, `overrideAccess: false`, `depth: 1`, `where` published and `id not_equals current`, `limit: 200`. Manual picks are resolved by `resolvePicks`: a pick that is not a complete published object (the `defaultPopulate` subset has no `studyNumber`) is re-read by id, published only, so drafts and unreadable ids are dropped; complete published objects (showcase fixtures) are used as they are.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (`tone`, `next_labels_*`, `ledger_labels_*`, `page_size`, `load_more*` columns on `pages_blocks_case_study_cards`; enums `enum_pages_blocks_case_study_cards_tone`, `…_track`; table `pages_blocks_case_study_cards_track`; `_pages_v_*` equivalents).

**Notes**
- Output is a boxed line `Next study / <client> — <cardSummary or title> / Read it →` in the 820px column, linking to `/work/<slug>`. With no other published study it renders only `allLink` when set and labelled, else nothing. `next-link` without `currentStudy` and a non-manual source logs an error and renders nothing.
- The existing `cards` markup is unchanged (outerHTML of the four B3 entries compared identical).
- Server component.

### NewsletterBand (unit S4-11)

Section: Newsletter CTA. Also used on pages 3 and 4; later pages reuse this entry.

**Files**
- `src/blocks/NewsletterBand/config.ts`, `Component.tsx` (`NewsletterBandBlock`, `NewsletterBandData`), `formClassNames.ts` (`bandFormClassNames`).

**Fields & schema** (slug literal `newsletterBand`, `interfaceName: 'NewsletterBandBlock'`)
- `variant`: select, required, default `band` (only option; `cross-sell` is added by the lead-magnet unit).
- `heading` / `accentPhrase`: `headlineFields({ required: false })`. Empty heading falls back to `site-settings.templateDefaults.newsletterHeading` (and its default line).
- `line`: text, the quiet line; with an empty heading the default line from site-settings is used.
- `buttonLabel`: text, default `Join`.
- `tone` (`grey` default | `light`) and `spacing` (`standard` default | `roomy`). Beyond SCHEMA (F75).
- The signup form is not a block field: it is `site-settings.newsletterForm`.

**Wiring**
- Registered in `pageBlocks`; component key `newsletterBand`. Showcase: `newsletterBand` / `band`, `band — light, roomy`, `band — custom button` (three entries).
- Data (public reads, `overrideAccess: false`): `site-settings` global (`depth: 0`) for `newsletterForm` and `templateDefaults`; when no form is set, the published `newsletter` page (`docPath`) for the fallback link.
- Form: `CMSForm` with `tone="light"`, `submitVariant="dark"`, `turnstileAppearance="interaction-only"` and `bandFormClassNames` (layout slots replace the defaults; `control` keeps `!` overrides for the flat input). See [Form foundation](#form-foundation-s4-7).
- Zero-leakage pages cannot hold this block: the `Pages` `beforeValidate` hook rejects `NEWSLETTER_BAND_BLOCK_SLUG` (`src/collections/Pages.ts`) when `zeroLeakage` is set.
- Migration: `20261022_053011_b4b_newsletter_band` (tables `pages_blocks_newsletter_band`, `_pages_v_blocks_newsletter_band`; enums `…_variant`, `…_tone`, `…_spacing`).

**Notes**
- Empty states: no form chosen → text plus a Join button linking to the published `newsletter` page; no form and no such page → the whole band renders nothing (logged once). A missing heading with no site default logs an error and omits the headline.
- Submissions carry no `sourcePath` (the block does not know the page path; F75). The success state needs a real Turnstile round trip and was not proven in isolation.
- Async server component; the form is the `PayloadForm` client island inside `CMSForm`.

### FinalCTA

The seventh section uses [FinalCTA (B3)](#finalcta-unit-b3) with `heading` from `closing.finalCtaHeading` and `capacity: 'builds-line'`; no new fields.

## 3. Work hub

Pages doc `work` (route `/work`, served by `[...slug]`). Order: Hero (intro strip) → Case study grid (ledger, Load More, fallback) → Newsletter CTA → Final CTA → Footer. The design also has a Proof pull (SCHEMA §9 p3, `TestimonialRow` · `row`).

### Hero, typographic stats (unit S4-1)

Variant `typographic` with `stats` (Work intro strip). Same block and files as [Hero, article variant](#hero-article-variant-unit-s4-1).

**Fields & schema**
- `stats`: array, max 5, row = `value` (required) and `label` (required). Shown for `typographic` and `service`. Intended for results or counts, never a price.

**Wiring**
- Showcase: `hero` / `typographic + stats` (two figures), `typographic + stats x5`.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (`pages_blocks_hero_stats`, `_pages_v_blocks_hero_stats`).

**Notes**
- With figures: the desktop (`lg`) layout is a two-column grid with the figures in a ruled right column and the logo shape parked in the corner; below `lg` the figures render as an "Aggregates" strip under the hero (1 to 3 figures in one row, 4 or 5 in two columns, an odd last one spanning both). Without figures the markup is the unchanged homepage hero.

### CaseStudyCards, ledger layout and Load More (unit S4-2)

Section: Study ledger (case study grid). Extends [CaseStudyCards](#casestudycards-next-link-layout-unit-s4-2).

**Files**
- `src/blocks/CaseStudyCards/ledger.tsx` (`toLedgerRow`, `LedgerRow`, `LEDGER_COLS`, `LEDGER_LIST`), `LoadMore.tsx` (`LedgerLoadMore`, `'use client'`), `Component.tsx` (`StudyLedger`).

**Fields & schema** (`layout = ledger`)
- `pageSize`: number 1 to 24, default 6 (rows at first and per click). `loadMore`: checkbox, default true.
- `loadMoreLabel` (default `Load more studies`), `loadMoreLoadingLabel` (`Loading…`), `loadMoreErrorLabel` (`Could not load more studies. Try again.`), shown when `loadMore` is on.
- `ledgerLabels`: group `number` (`№`), `client` (`Client`), `summary` (`What was leaking / what we changed`), `metric` (`Returned`), `kind` (`Case study`, phones), `readLabel` (`Read the study →`, phones).
- Reuses `eyebrow`, `heading`, `source` (`featured` | `latest` | `track` | `manual`), `caseStudies`, `tone`, and the fallback fields.

**Wiring**
- Showcase: `caseStudyCards` / `ledger` (three published fixture studies, manual), `ledger — latest (DB)` (the launch state: with none published it is the ledger fallback).
- Data: automatic sources run `find` on `case-studies` (`draft: false`, `overrideAccess: false`, `depth: 1`, `limit: pageSize`, `sort: -publishedAt`, published filter). `hasNextPage` and a REST query string (where, sort, select limited to the fields a row reads, `populate` of `clients.name`) are handed to the island. Manual picks are resolved by `resolvePicks` and show every published pick, without Load More.
- Load More: public REST, no route of our own: `GET /api/case-studies?<query>&limit=<pageSize>&page=<n>&depth=1` with `credentials: 'omit'`, so collection read access (`publishedOrStaff`) returns published studies only, plus the explicit `_status` filter in the query. Rows already shown are de-duplicated by id.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (see S4-2 above).

**Notes**
- Client island `LoadMore.tsx` (`'use client'`, reason: appends rows on click with state and a browser `fetch`). The first page is server-rendered; the button renders only after hydration (so it is never a dead control without JS) and only while more rows exist. Focus moves to the first new row; the list is `aria-live="polite"`; an error shows `loadMoreErrorLabel`.
- Launch state: with no published study (or a failed read) the designed fallback renders (see [homepage CaseStudyCards](#casestudycards-unit-b3)).
- Newest first (the design shows ascending numbers; no sort field, F72). The ledger desktop grid starts at `lg`.

### Newsletter CTA, Final CTA, Proof pull

- Newsletter CTA: [NewsletterBand](#newsletterband-unit-s4-11) with `tone: light`, `spacing: roomy` (fixture `band — light, roomy`).
- Final CTA: [FinalCTA (B3)](#finalcta-unit-b3).
- Proof pull (SCHEMA §9 p3 row 3): [TestimonialRow `row`](#testimonialrow-unit-b3); no new fields.

## 4. Services Hub

Pages doc `services`. Order (SCHEMA §9 p4): Hero → Two doors → Why both together → Newsletter CTA → The arc → How it starts → Featured proof → FAQ mini → Final CTA → Footer.

### Hero, phaseStrip (unit S4-1)

Variant `typographic` with `phaseStrip`. Same block and files as [Hero, article variant](#hero-article-variant-unit-s4-1).

**Fields & schema**
- `phaseStrip` (`typographic` only): array, max 3, row = `number` (required, e.g. `01`) and `label` (required). Beyond SCHEMA §8.1 as a styled strip (F70: "system-styled", the design has none).

**Wiring**
- Showcase: `hero` / `typographic + phaseStrip`.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (`pages_blocks_hero_phase_strip`, `_pages_v_*`).

**Notes**
- Rendered as a three-column ordered list under the buttons. The last step is always at full weight (ink top rule, accent number, trailing arrow).

### TwoTrackPanels, doors and contrast variants (unit S4-3)

Sections: Two doors (track split) and Why both together. Extends the [homepage TwoTrackPanels](#twotrackpanels-unit-b3).

**Files**
- `src/blocks/TwoTrackPanels/config.ts`, `src/blocks/TwoTrackPanels/Component.tsx` (`Equal`, `Contrast`, `PrimarySecondary`, `Doors`).

**Fields & schema**
- `variant`: options now `equal`, `contrast`, `primary-secondary`, `doors`.
- `panels[].claim` (text, `contrast` only): the struck-through claim.
- `panels[].label`: used by `equal`, `contrast`, `primary-secondary`. `panels[].accentTitle`, `pricingNote`, `link`: `equal`, `primary-secondary`, `doors`.
- `panels[].body`: textarea, no longer `required` at the field level (so the DB column stays nullable); a `validate` function requires it for every variant except `contrast`.
- `conclusion` (textarea): `contrast`, `primary-secondary`, `doors`.
- Beyond SCHEMA §8.3: `doors` (F67, F74: p4 "Two doors" differs from the homepage `equal`; needs a mini Gate S), `claim` and `conclusion` (F66).

**Wiring**
- Component key `twoTrackPanels` (dispatches on `variant`). Showcase: `twoTrackPanels` / `doors`, `doors — no links/pricing`, `contrast`, `contrast — no panels`.
- Reads no collection or global.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (enum values `contrast`, `primary-secondary`, `doors` added to the variant enums; columns `claim` on `…_panels` and `conclusion` on the block, plus `_pages_v_*`). The migration contains no `DROP NOT NULL`.

**Notes**
- `doors`: each panel is one linked card (title, paragraph, filled CTA; ink for the first door, wine when `accentTitle`). The design's large price numeral is not rendered; the price is the small inline `pricingNote` (CLAUDE.md rule 5). `heading` is a required field for every variant (PROGRESS F74).
- `contrast`: desktop two bordered grey cards, mobile a ruled list; each panel = small label, struck `claim` (`<del>`), reality line (`title`, `h3`); then `conclusion`. Panels missing `claim` or `title` are skipped with a `console.error`; with no valid panel only the heading and conclusion render.
- `equal`, `primary-secondary`, `doors` skip a panel missing `title` or `body` (logged).
- Equal-variant pixel regression was not proven by the coder; QA re-shoots the `equal` entries against the earlier captures.
- Server component.

### Newsletter CTA

[NewsletterBand](#newsletterband-unit-s4-11) with `spacing: roomy`.

### PhaseTimeline, arc and steps variants (unit S4-4)

Sections: The arc and How it starts. Extends the [homepage PhaseTimeline](#phasetimeline-unit-b3).

**Files**
- `src/blocks/PhaseTimeline/config.ts`, `Component.tsx` (dispatches on `variant`), `ArcPhases.tsx`, `StepCards.tsx`, `StepRun.tsx` (build-run and engine-rollout, see pages 5 and 6), `SwipeTrack.tsx` (client), `shared.tsx` (`Headline`, `titledSteps`).

**Fields & schema** (each field is shown only for the variants that use it, through `admin.condition` on the block's `variant`)
- `variant`: options now `accordion`, `arc`, `steps`, `build-run`, `engine-rollout`; not clearable.
- `phases` (`accordion`, `arc`): `body` (textarea, from B3) is now shown for `arc`; added `link` (`linkField`, `arc`). Max 3 rows.
- `steps` (`accordion`, `steps`, `build-run`, `engine-rollout`): added `tag` (text; `steps`, `build-run`, `engine-rollout`), `isSignOff` (checkbox, `build-run`), `outcomes` (array max 4 of `{ text }`, `steps`). Max 10 rows.
- `closingLine`: now also `steps`, `build-run`, `engine-rollout`. `cta` (`linkField`): `steps`.
- `eyebrow`: `accordion`, `build-run`, `engine-rollout`.
- Beyond SCHEMA: PROGRESS flag F73 (hardcoded "You leave with" and "Swipe →").

**Wiring**
- Component key `phaseTimeline`. Showcase: `phaseTimeline` / `arc`, `arc — minimal`, `steps`, `steps — minimal`, `steps — empty`.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (`link_*` columns on `pages_blocks_phase_timeline_phases`, `tag` and `is_sign_off` on `…_steps`, table `pages_blocks_phase_timeline_steps_outcomes`, block `cta_*` columns, variant enum values, and the `_pages_v_*` equivalents).

**Notes**
- `arc`: one ruled row per phase (number in mono, display title, body, optional link). Desktop puts the label in a column of at least 200px (wider only if a word needs it). The LAST phase title is always in the accent colour. Phases without a title are skipped (logged).
- `steps`: numbered cards with the number, a boxed `tag`, title, sentence, then a grey "You leave with" foot listing `outcomes`. Stacked below `lg`; one row with arrows between from `lg`. Closing line and button: the line first on desktop, the full-width button first on phones. Every card has the same full weight, the last included; there is no field to reduce it. With no steps only the heading renders.
- The design's endless tag-flash animation (7.5 s) is not ported (WCAG 2.2.2).
- Server components; the `accordion` variant is unchanged (regression script identical at 390, 1009 and 1440 px).

### Featured proof

[TestimonialRow `row`](#testimonialrow-unit-b3) (SCHEMA §9 p4 row 7). No new fields.

### AccordionFAQ, mini variant (unit S4-6)

Section: FAQ mini (also pages 5 and 6; later pages link here).

**Files**
- `src/blocks/AccordionFAQ/config.ts`, `src/blocks/AccordionFAQ/Component.tsx` (`AccordionFAQBlock`, async server component).

**Fields & schema** (slug `accordionFAQ`, `interfaceName: 'AccordionFAQBlock'`)
- `variant`: select, required, default `mini` (only option; `group` for page 11 is added later).
- `eyebrow` / `eyebrowTick`: `eyebrowField()`, optional.
- `heading`: text, required; the section `h2`, shown in capitals.
- `source`: select `selected` (default) | `category`.
- `category`: select, options taken from `Faqs` (`pricing-contracts`, `builds`, `marketing`, `process-trust`), shown for `category`.
- `faqs`: relationship to `faqs`, `hasMany`, `maxDepth: 1`, shown for `selected`.
- `limit`: number 1 to 12, default 6. `openFirst`: checkbox, default false.
- `allLink`: `linkField`, optional underlined link under the list.

**Wiring**
- Registered in `pageBlocks` (last); component key `accordionFAQ`. Showcase: `accordionFAQ` / `mini`, `mini — category (DB)`, `mini — empty`.
- Data: `selected` uses the page-populated `faqs`, keeping only populated objects with `_status = published`, in the editor's order. `category` runs `find` on `faqs` (`draft: false`, `overrideAccess: false`, `depth: 1`, sort `sortOrder`, published and category filter). A failed read is logged and renders nothing.
- JSON-LD: a `FAQPage` script for exactly the rendered items (`Question` name, `Answer` text = plain text of the Lexical answer), `<` escaped.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (table `pages_blocks_accordion_f_a_q`, `_pages_v_*`, enums `…_variant`, `…_source`, `…_category`, `…_all_link_type`).

**Notes**
- Native `<details>` / `<summary>` (works without JS; answers crawlable). Answers render through the shared [RichText wrapper](#richtext-wrapper-srccomponentsrichtexttsx).
- No published question: renders nothing, with one server-side `console.warn`.
- Server component; no client island.

### Final CTA

[FinalCTA (B3)](#finalcta-unit-b3).

## 5. Shopify Theme Development

Pages doc `services/shopify-theme-development`. Order (SCHEMA §9 p5): Breadcrumb + Dev hero → Where people usually start → Template anatomy → Specification → Build run → Proof → FAQ mini → Final CTA → Footer.

### Hero, service variant (unit S4-1)

Section: Breadcrumb + Dev hero (also page 6). Same block and files as [Hero, article variant](#hero-article-variant-unit-s4-1).

**Fields & schema** (`variant = service`)
- Uses `eyebrow` / `eyebrowTick`, `heading` / `accentPhrase`, `body`, `pricingNote`, `ctas` (max 2), `subNote`, `breadcrumb`, `stats` (max 5).
- Beyond SCHEMA (F70): the CTA styling (primary `Button` with overrides).

**Wiring**
- Showcase: `hero` / `service — build`, `service — growth`, `service — minimal`.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (variant enum value `service`).

**Notes**
- Ink band with a breadcrumb bar on top (rendered only when a crumb has a label), eyebrow with a yellow diamond, the only h1, body. The aside (right column from `lg`, full-bleed rows on phones) shows `stats`, the pricing note, the sub-note and the buttons; it is omitted when all are empty.
- R13: the design's `$5K` / `$1K/mo` display statistic is not rendered; the price is the small inline `pricingNote`.
- Server component.

### TwoTrackPanels, primary-secondary variant (unit S4-3)

Section: Where people usually start. Same block and files as [TwoTrackPanels, doors and contrast](#twotrackpanels-doors-and-contrast-variants-unit-s4-3).

**Fields & schema** (`variant = primary-secondary`)
- Uses `eyebrow`, `heading` / `accentPhrase`, `panels` (exactly 2: `label`, `title`, `accentTitle`, `body` required, `pricingNote`, `link`), `conclusion`.

**Wiring**
- Showcase: `twoTrackPanels` / `primary-secondary`. Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- Derived design (F66, needs design sign-off): the section is missing from the final Shopify design. Primary = 2px ink border on grey, tag, filled `ButtonLink`; secondary = hairline border, muted copy, text link; columns 3fr / 2fr from `md`.

### SpecLedger, cards (anatomy) and expandable variants (unit S4-5)

Sections: Template anatomy and Specification (what's included). New block.

**Files**
- `src/blocks/SpecLedger/config.ts`, `src/blocks/SpecLedger/Component.tsx` (`SpecLedgerBlock`, `SpecLedgerData`).

**Fields & schema** (slug `specLedger`, `interfaceName: 'SpecLedgerBlock'`; conditions read the parent block's `variant`)
- `variant`: select, required, default `cards`: `cards`, `expandable`, `signal-flow`.
- `cardLayout` (`cards`): `anatomy` (default) | `feature`. Beyond SCHEMA (F68).
- `tone`: `auto` (default) | `light` | `grey`; automatic = grey for anatomy cards and signal flow, white otherwise. Beyond SCHEMA (F68).
- `eyebrow` / `eyebrowTick` (`eyebrowField({ defaultTick: false })`): the small grey caption; the section's `h2` unless a headline or the hub headline already is.
- `heading` / `accentPhrase`: `headlineFields({ required: false })`.
- `note` (anatomy cards): text. Beyond SCHEMA (F68).
- `items`: array, max 10: `code` (text, max 8), `title` (required), `line` (cards, expandable), `image` (upload, `maxDepth: 1`, cards), `whatLabel`, `what`, `proofLabel`, `proof` (expandable).
- `firstOpen` (expandable): checkbox, default true. Beyond SCHEMA (F68).
- `hub` (signal-flow): see page 6.
- `pricingNote`: text (max 80), under the content.

**Wiring**
- Registered in `pageBlocks`; component key `specLedger`. Showcase: `specLedger` / `cards — anatomy`, `expandable — p5`, `signal-flow`, `expandable — p6`, `cards — feature`, `expandable — sparse`, `cards — anatomy, no image`, `signal-flow — hub, no image` (eight entries; the registry orders them p5 anatomy, p5 expandable, p6 signal-flow, p6 expandable, p6 feature, then the three sparse states).
- Reads no collection.
- Migration: `20261022_052303_b4_pages_2_6_blocks` (tables `pages_blocks_spec_ledger`, `pages_blocks_spec_ledger_items`, `_pages_v_*`; enums `…_variant`, `…_card_layout`, `…_tone`).

**Notes**
- `cards` / `anatomy`: 2 x 2 grid (one column on phones) of framed cards with the coded title, picture (4:3, keeps its shape without an image) and one line. `expandable`: native `<details>` rows with a "+" marker (several may be open); the first is open when `firstOpen` is not false.
- Items without a `title` are dropped; the block renders nothing when there are no items and no heading or caption. An unknown variant logs an error and renders nothing.
- One copy set serves desktop and mobile (the mobile design shows shorter copy; F68). Fixture copy is written from the design with placeholder markers (T-01 to T-04, D-01 to D-07).
- Server component; no client island.

### PhaseTimeline, build-run variant (unit S4-4)

Section: Build run (Phase 1 process). Same block and files as [PhaseTimeline, arc and steps](#phasetimeline-arc-and-steps-variants-unit-s4-4).

**Fields & schema** (`variant = build-run`)
- Uses `eyebrow`, `heading`, `steps` (`number`, `title`, `detail`, `tag`, `isSignOff`), `closingLine`.

**Wiring**
- Showcase: `phaseTimeline` / `build-run`, `build-run — minimal`. Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- One ink band (`StepRun`). Below `lg` a horizontal swipe row of bordered cards (numeral, title, `detail`; a sign-off step shows its `tag` with a diamond) with progress bars; from `lg`, a 3-column grid of cells split by hairlines showing the `tag`. A filler cell pads an incomplete last row.
- Client island `SwipeTrack.tsx` (`'use client'`, reason: the progress bars follow the scroll position). The server renders the row and the bars (first bar lit), so the row still scrolls with JS off. While the row overflows it gets `tabIndex 0`, `role="region"` and `aria-labelledby` the section heading, so arrow keys scroll it.
- Every step has the same full weight, the last included; "Swipe →" is hardcoded (F73).

### CaseStudyCards, track source and testimonials fallback (unit S4-2)

Section: Proof (fallback). Extends [CaseStudyCards](#casestudycards-next-link-layout-unit-s4-2).

**Fields & schema**
- `source = track`: `track` select, `hasMany`, options `build`, `growth`, `build-and-growth`, `handover` (table `pages_blocks_case_study_cards_track`). A track source with no type ticked logs an error and renders the fallback. Page 5 uses `build` + `build-and-growth`.
- `fallbackMode`: options now also `testimonials` and `metric-strip` (default stays `ledger`; hidden for `next-link`).
- `fallbackTestimonials`: relationship to `testimonials`, `hasMany`, max 3, `maxDepth: 2`; shown for `testimonials`.
- `fallbackEyebrow`, `fallbackHeading`, `fallbackAccentPhrase`, `fallbackBody`, `pricingNote` apply to every fallback mode.

**Wiring**
- Showcase: `caseStudyCards` / `cards — track build, fallback testimonials` (reads the DB; with none published the testimonials fallback renders).
- Data: `where` published and `track in <ticked>`; same query options as the other automatic sources.
- Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- `testimonials` fallback: headline, then the small label (`fallbackEyebrow`) and up to three published picked testimonials as quote cards. The design's "A study in full" card is not rendered (SCHEMA §5). With no usable testimonial it degrades to the `note` text block.
- The quote card duplicates the `TestimonialRow` card markup (flagged to promote one shared card later). Draft testimonials are skipped.

### FAQ mini and Final CTA

[AccordionFAQ `mini`](#accordionfaq-mini-variant-unit-s4-6) and [FinalCTA (B3)](#finalcta-unit-b3).

## 6. Marketing

Pages doc `services/marketing`. Order (SCHEMA §9 p6): Breadcrumb + Marketing hero → Signal flow → Channel specification → Engine rollout → Camera work → Proof → FAQ mini → Final CTA → Footer.

Hero: [Hero, service variant](#hero-service-variant-unit-s4-1) (`pricingNote` `Engines start at $1K/mo`).

### SpecLedger on the Marketing page: signal-flow, expandable, cards (feature) (unit S4-5)

Sections: Signal flow, Channel specification, Camera work. Same block and files as [SpecLedger (page 5)](#specledger-cards-anatomy-and-expandable-variants-unit-s4-5).

**Fields & schema**
- `signal-flow`: `items` (`code`, `title`; no `line`, no `image`) are the tiles; `hub` group (condition `variant = signal-flow`): `kicker`, `heading`, `body`, `note` (desktop only), `image` (upload, `maxDepth: 1`). `kicker` and `note` are beyond SCHEMA (F68).
- `expandable`: as on page 5, with labels `What we run` and `What you'll see on the dashboard`.
- `cards` with `cardLayout = feature`: two image cards (title and line on top, large picture below, side by side).

**Wiring**
- Showcase: `specLedger` / `signal-flow`, `expandable — p6`, `cards — feature`, `signal-flow — hub, no image`.
- Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- `signal-flow`: tiles converge on the hub card (splits at `lg`). The hub renders only when it has text or an image; with neither, only the tiles show.
- The feature cards render an `h3` without a preceding `h2` when the section has no caption or heading (the SEO auditor may flag it).
- Feature-card and signal-flow copy on `/_showcase` is written from the design with placeholder markers.

### PhaseTimeline, engine-rollout variant (unit S4-4)

Section: Engine rollout (Phase 2 framing, Phase 3 endpoint visible). Same block and files as [PhaseTimeline, arc and steps](#phasetimeline-arc-and-steps-variants-unit-s4-4).

**Fields & schema** (`variant = engine-rollout`)
- Uses `eyebrow`, `heading`, `steps` (`number`, `title`, `detail`, `tag` for timing), `closingLine`. `isSignOff` is not used.

**Wiring**
- Showcase: `phaseTimeline` / `engine-rollout`, `engine-rollout — minimal`. Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- Same ink band and phone swipe row as `build-run` (`StepRun` + `SwipeTrack`); the desktop single row of columns starts at `xl` (1280px) because six columns clip below it (F73). The tag shows under the title on computers; `detail` shows on phones.
- The last step (Independence, Phase 03) renders like every other step, at full weight; nothing can dim it.

### CaseStudyCards, metric-strip fallback (unit S4-2)

Section: Proof (fallback, directly above the FAQ). Extends [CaseStudyCards](#casestudycards-next-link-layout-unit-s4-2).

**Fields & schema**
- `fallbackMode = metric-strip`: `fallbackMetrics` (array max 3, `metricFields()`), shown for `ledger` and `metric-strip`. The `$1K/mo` figure from the design is a `pricingNote` (rule 5), not a metric (F72). Page 6 uses `source = track` with `growth` + `build-and-growth`.

**Wiring**
- Showcase: `caseStudyCards` / `cards — track growth, fallback metric strip`. Migration: `20261022_052303_b4_pages_2_6_blocks`.

**Notes**
- Renders the text block, then a centred strip of up to three facts (on a `grey` section the strip takes the white ground). With no metric rows it degrades to the `note` text block. The strip duplicates the future `MetricEvent` strip (to be merged later).

### FAQ mini and Final CTA

[AccordionFAQ `mini`](#accordionfaq-mini-variant-unit-s4-6) and [FinalCTA (B3)](#finalcta-unit-b3) (`capacity: engines-line` per SCHEMA §9).

## 7. Testimonials

Locked section order (SCHEMA §9): Hero (typographic, `showAggregateRating`) → Testimonial feed → Final CTA ([FinalCTA (B3)](#finalcta-unit-b3)) → Footer (standard). Migration for all big step 5 blocks and fields: `20261022_141454_b5_pages_7_12_blocks` (summary under [Hero, compact size](#hero-compact-size-and-aggregate-rating-unit-s5-1)).

### Hero, compact size and aggregate rating (unit S5-1)

Section: Testimonials hero. Extends [Hero (B3)](#hero-unit-b3). The `compact` size is also used by pages 9, 10, 11 and 12; those pages link here.

**Files**
- `src/blocks/Hero/config.ts`, `src/blocks/Hero/Component.tsx` (`HeroBlock` loads the rating, `TypographicHero` renders; `Wrap` is the content column).

**Fields & schema** (new on the `typographic` variant; the shapes for the other variants are unchanged)
- `size`: select `default` | `compact`, default `default`; shown only for `typographic`.
- `callouts`: array, max 2 rows, shown only for `typographic`; each `label` (text, required) and `text` (textarea, required). Documented under [page 9](#hero-callouts-unit-s5-1).
- `showAggregateRating`: checkbox, default false; shown only for `typographic`.

**Wiring**
- Registered already (B3); no new registration. Showcase: `hero` / `typographic compact + rating` (p7), `typographic compact + callouts` (p9), `typographic compact` (p10, p12), `typographic compact — minimal` (p11).
- Rating: `loadAggregateRating()` runs only when `showAggregateRating` is true. Local API `find` on `testimonials`, `where` `_status = published` and `rating exists`, `select: { rating: true }`, `depth: 0`, `pagination: false`, `overrideAccess: false`. Ratings outside 1 to 5 are ignored. Average = mean to one decimal; the count is the number of rated testimonials. Nothing rated, or a failed read (logged), renders no rating line. Computed per request, never stored.
- Rating text: appended to the eyebrow as `<eyebrow> · <avg> avg · <N> rating(s)` (`rating` singular when N is 1). With no eyebrow the rating text is the eyebrow.
- Migration: `20261022_141454_b5_pages_7_12_blocks` adds `size` (enum `enum_pages_blocks_hero_size`, default `default`) and `show_aggregate_rating` (boolean, default false) to `pages_blocks_hero` and `_pages_v_blocks_hero`, and the tables `pages_blocks_hero_callouts` / `_pages_v_blocks_hero_callouts`. The same migration also creates the tables for `ReviewWall`, `FormEmbed` (+ `_reasons`, `_steps`), `BookingEmbed`, `DirectContact`, `CategoryTabs`, `pages_texts` / `_pages_v_texts` (hasMany text for `formEmbed.steps[].fieldNames`), adds `anchor_id` and `spacing` (enum `enum_pages_blocks_accordion_f_a_q_spacing`) to the AccordionFAQ tables, and adds enum values `inline` (`miniCTAStrip.variant`), `logo-strip` (`caseStudyCards.fallbackMode`), `facts` (`metricEvent.variant`) and `group` (`accordionFAQ.variant`). Additive; scratch-database up/down/up proven. Registered in `src/migrations/index.ts`. (An earlier `20261022_140138_b5_pages_7_12_blocks` was regenerated as `…141454…` when `formEmbed.stepped.sendAnotherLabel` was added.)

**Notes**
- Compact styling: no width cap on the h1, mobile h1 2.25rem; paragraph max 52ch; the logo shape is 340px (220px on mobile) at the top-right; content padding 80/56px desktop and 48/36px mobile.
- Content column (`Wrap`): `narrow = compact && no stats && !showAggregateRating`. Narrow = the 820px column (`max-w-205`); otherwise the full site container (`max-w-site`, 1200px). The page 7 hero therefore uses the wide column only because its rating flag is ticked; unticking the flag shrinks it to 820px (F107, flagged; an explicit width field would be a schema delta).
- No `Review` / `AggregateRating` JSON-LD is emitted anywhere (self-serving ratings, F64/F78).
- The hero is still the only block that renders the page `h1`.

### ReviewWall, feed variant (unit S5-2)

Section: Testimonial feed (brand showcase). New block.

**Files**
- `src/blocks/ReviewWall/config.ts`, `Component.tsx` (`ReviewWallBlock`, async server component; exports `ReviewWallProps`), `feed.tsx` (`FeedCardData`, `FeedLabels`, `toFeedCard`, `FeedItems`, `FEED_LIST`), `LoadMore.tsx` (`FeedLoadMore`, client island).
- Uses `src/components/VideoFacade.tsx` ([VideoFacade](#videofacade-srccomponentsvideofacadetsx)) and `src/lib/youtube.ts`.

**Fields & schema** (slug `reviewWall`, `interfaceName: 'ReviewWallBlock'`)
- `variant`: select, required, default `feed` (only option; `wall` for page 19 will add its own option).
- `eyebrow` / `eyebrowTick`: `eyebrowField({ defaultTick: true })`. `heading` / `accentPhrase`: `headlineFields({ required: false })`. Both empty on the Testimonials page.
- `source`: select, required, default `all`: `all` (published testimonials) or `manual`.
- `sourceFilter`: select, `hasMany`, options `direct`, `google-review`, `linkedin`; shown when `source = all`; empty = every kind. Stored in table `pages_blocks_review_wall_source_filter`.
- `testimonials`: relationship to `testimonials`, `hasMany`, `maxDepth: 2`; shown when `source = manual`.
- `pageSize`: number 1 to 24, default 6 (cards at first and per Load More).
- `showStudyLinks`: checkbox, default true. `studyLinkLabel`: text, default `Read the full case study`; shown while links are on.
- `labels`: group `video` (`Video`), `googleReview` (`Google review`), `linkedin` (`LinkedIn`), `play` (`Play the video testimonial from`, the person's name is appended).
- `loadMore`: group `label` (`Load more`), `loadingLabel` (`Loading…`), `errorLabel` (`Could not load more testimonials. Try again.`).
- `emptyNote`: textarea; one quiet line when nothing matches.

**Wiring**
- Registered in `pageBlocks` (after `MetricEvent`); component key `reviewWall`.
- Showcase (5 entries, `reviewWall` / `feed`): hand-picked mix (video, Google, LinkedIn, direct; the draft study on card 4 gives no link), case-study links off, Load More at 2 per load, live (all published testimonials from the database), fallback (LinkedIn-only filter with an empty note).
- Data (Local API, `draft: false`, `overrideAccess: false`):
  - `source = all`: `find` on `testimonials`, `where` `_status = published` (plus `source in <sourceFilter>` when set), `sort: ['sortOrder', '-createdAt']`, `limit: pageSize`, `depth: 2`; `hasNextPage` is kept.
  - `source = manual`: the page-populated picks in pick order (`resolvePicks`). Picks that arrive as bare ids (drafts, unreadable) are dropped. Because the page is read at depth 2 and `testimonials.caseStudy` has `maxDepth: 1`, a pick whose `caseStudy` is still a number (when links are on), or whose video client's `logo` is a number, is re-read in one public `find` (`id in <ids>`, published only, `depth: 2`). Fully populated picks (showcase fixtures, live preview) trigger no query. A failed re-read is logged and the picks render without links or logos.
- Load More (`FeedLoadMore`, `'use client'`, reason: appending cards on click and a browser fetch):
  - The first page is server-rendered; the button renders only after hydration (`useSyncExternalStore`), so there is no dead control without JS. It renders at all only when `cards.length > pageSize` or the automatic source has `hasNextPage`.
  - Hand-picked cards are all resolved on the server and revealed `pageSize` at a time. For `source = all`, later pages come from public REST: `GET /api/testimonials?<where and sort as qs brackets>&limit=<pageSize>&page=<n>&depth=2` with `credentials: 'omit'` and `Accept: application/json`. The `where` carries an explicit `_status = published` filter; collection read access (`publishedOrStaff`) also limits an anonymous request to published docs. A draft case study is therefore not populated and its link never renders. Cards already shown are de-duplicated by id.
  - The list is `aria-live="polite"`, `aria-busy` while loading; focus moves to the first new card; an error shows `errorLabel` in a `role="alert"` line.
  - The query-string serialiser `toQuery` duplicates the one in `CaseStudyCards` (same qs bracket syntax).
- Revalidation: `pages` hook only; testimonials are read per request (`force-dynamic`).
- Migration: `20261022_141454_b5_pages_7_12_blocks` (tables `pages_blocks_review_wall`, `pages_blocks_review_wall_source_filter`, `_pages_v_*`; enums `…_variant`, `…_source`, `…_source_filter`; the existing `testimonials_id` rels column is reused).

**Notes**
- Card data (`toFeedCard`): a testimonial is skipped when not published or when `quote` or `authorName` is empty. `format = video` needs a valid YouTube URL (`youtubeVideoId`); otherwise it degrades to a text card and logs an error. Stars come from `rating` (0 = no stars, never defaulted). Client logo and name show on video cards only. The case-study link needs `caseStudy._status = published` and `showStudyLinks` (`docPath('case-studies', …)`).
- Video cards use the poster as the click-to-load facade; text cards cover written quotes, Google reviews and LinkedIn. Breakpoints: card type and padding switch at `md`; the side-by-side video card and two-up text pairs start at `lg`.
- Empty state: no card and no `emptyNote` renders nothing (warn); with `emptyNote` it renders the header and the note line. Never "coming soon".
- Alternative left open by the coder: raising `testimonials.caseStudy` `maxDepth` to 2 would remove the re-read.
- The dev-only testimonial id 7 ("tmp") was deleted on the human's instruction (Decision log 2026-10-22).

## 8. About

Locked section order (SCHEMA §9): Article header ([Hero, article variant](#hero-article-variant-unit-s4-1), `stats`, full-bleed media) → Article body ([RichContent, article variant](#richcontent-article-variant-unit-s4-8)) → Company facts (MetricEvent `facts`, below) → Founder ([TeamIntro, founder-card variant](#teamintro-founder-card-variant-unit-b3)) → Logo strip at launch (CaseStudyCards `logo-strip` fallback, below) → Final CTA ([FinalCTA (B3)](#finalcta-unit-b3)) → Footer (standard). `pages.readingProgress` is on for About ([Page router](#page-router-unit-b2)).

### MetricEvent, facts variant (unit S5-3)

Section: Company facts. Extends [MetricEvent, table variant](#metricevent-table-variant-unit-s4-9).

**Files**
- `src/blocks/MetricEvent/config.ts`, `src/blocks/MetricEvent/Component.tsx` (`MetricEventBlock` dispatches on `variant`; `MetricTable`, `MetricFacts`).

**Fields & schema**
- `variant`: options now `table` and `facts`.
- Fields used by `facts`: `eyebrow` (the table caption, e.g. "The company, in numbers"), `heading` / `accentPhrase` (optional), `items` (each `metricFields()`: `value`, `label`, `sub`, `accent`; the `baseline` and `change` fields belong to `table`), `note` (quiet line under the list). `columns` is not used.

**Wiring**
- Registered (S4-9); no new registration. Showcase: `metricEvent` / `facts` (4 rows with a note), `facts` (one row).
- Reads no collection or global.
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`ALTER TYPE … ADD VALUE 'facts'` on `enum_pages_blocks_metric_event_variant` and `enum__pages_v_blocks_metric_event_variant`; no new columns).

**Notes**
- Output: a real `<table>` in the 820px column on a light section; label (`th scope="row"`) left, value right in the display face (`accent` rows in the accent colour); `sub` shows under the label. Row order is the editor's order; the first row has the heavy top rule. The caption is the visible eyebrow, or sr-only (`heading` or `Facts`) when the eyebrow is empty. Markup is identical at both breakpoints.
- Rows without both `label` and `value` are skipped; with no valid row the block renders nothing (`console.warn`). No colour-only meaning.
- Placeholder rows must stay demonstrative (CLAUDE.md content rule 3: no invented founding year, headcount or counts).
- Server component.

### CaseStudyCards, logo-strip fallback (unit S5-4)

Section: Logo strip at launch (case study pull later). Extends [CaseStudyCards (B3)](#casestudycards-unit-b3) and its S4-2 extensions.

**Files**
- `src/blocks/CaseStudyCards/config.ts`, `src/blocks/CaseStudyCards/Component.tsx` (`Fallback` dispatches; `resolveLogoClients`, `LogoStripFallback`).

**Fields & schema**
- `fallbackMode`: option `logo-strip` added ("Logo strip: the text block, then the client logos (falls back to the note if there are none)").
- `fallbackLogos`: relationship to `clients`, `hasMany`, `maxRows: 12`, `maxDepth: 1`; shown when `fallbackMode = logo-strip`. Optional: empty = every published client ticked `showInLogoStrip`; picks choose and order by hand.
- Uses the existing `fallbackEyebrow`, `fallbackHeading`, `fallbackAccentPhrase`, `fallbackBody`, `pricingNote` and `tone`.

**Wiring**
- Registered (B3); no new registration. Showcase: `caseStudyCards` / `logo-strip` (4 fixture clients; 2 clients on a grey section; database-backed with zero clients, which shows the note).
- Data (Local API, `overrideAccess: false`): picks are re-read by id (`id in <ids>`, `_status = published`, `depth: 1`) and kept in the editor's order; with no picks, `clients` where `showInLogoStrip = true` and `_status = published`, `sort: 'sortOrder'`, `limit: 12`, `depth: 1`. A failed read is logged and degrades to the note.
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`ALTER TYPE … ADD VALUE 'logo-strip'` on `enum_pages_blocks_case_study_cards_fallback_mode` and the `_pages_v` enum; the `clients_id` column on the rels tables already exists from ProofStrip).

**Notes**
- Only used while no case study is published; once one is, the block renders the cards (Launch-state rule). With no usable client the section renders the `note` fallback (text block only).
- Output: text block, then a row of grey-scaled logos at 55% opacity (a client without a logo renders its name in the display face). Grid columns follow the count (`LOGO_COLS`), a centred flex row from `lg`.
- `resolveLogoClients` and the row markup duplicate the ProofStrip logo-strip rule (ProofStrip keeps them private and is a cleared block); flagged for a later shared extraction.
- Server component.

## 9. Book a Call

Locked section order (SCHEMA §9): Hero (compact, callouts) → Booking widget → Pre-call homework form → What happens next ([PhaseTimeline, steps variant](#phasetimeline-arc-and-steps-variants-unit-s4-4)) → Social proof strip ([TestimonialRow (B3)](#testimonialrow-unit-b3), `row`) → Quick-question escape line (MiniCTAStrip `inline`) → Footer (reduced-nav). For the compact Hero see [page 7](#hero-compact-size-and-aggregate-rating-unit-s5-1).

### Hero, callouts (unit S5-1)

Section: Book hero ("what the call is and isn't"). Part of [Hero, compact size](#hero-compact-size-and-aggregate-rating-unit-s5-1).

**Fields & schema**
- `callouts`: array, max 2 rows (`label` text, required; `text` textarea, required), `typographic` only.

**Wiring**
- Rendered by `TypographicHero`: rows with an empty `label` or `text` are dropped; up to two. Mobile: stacked; from `md`, a two-column grid, each item with a 2px ink top rule and the label in bold followed by the text. Placed under the paragraph, above the buttons.
- Showcase: `hero` / `typographic compact + callouts`. Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_hero_callouts`, `_pages_v_blocks_hero_callouts`).

**Notes**
- The p9 placeholder uses `subNote` for the audience line. Compact Hero column: 820px (no rating flag).

### BookingEmbed (unit S5-5)

Section: Booking widget (desktop) / Booking flow (mobile). New block.

**Files**
- `src/blocks/BookingEmbed/config.ts`, `Component.tsx` (`BookingEmbedBlock` async loader; `BookingEmbedView` synchronous view; `Panel`, `Note`; exports `BookingEmbedData`, `BookingMode`, `BookingSettingsOverride`), `BookingLaunchLink.tsx` (client island).

**Fields & schema** (slug `bookingEmbed`, `interfaceName: 'BookingEmbedBlock'`; no `variant` field)
- `heading` (required) / `accentPhrase`: `headlineFields()`. `body`: textarea.
- `buttonLabel`: text, required, default `Book your call`. `noteUnderButton`: text.
- `newTabLabel`: text, default `Trouble with the calendar? Open it in a new tab` (embed state only).
- `thankYouPage`: relationship to `pages`, `maxDepth: 0`; empty = the page with slug `thank-you`.
- `fallbackHeading` (required, default `Booking is offline. Write to us instead.`), `fallbackBody`, `fallbackLink` (`linkField`, normally Contact): inside a collapsible "When no booking link is set".
- The booking address and mode are NOT block fields: `site-settings.bookingUrl` and `site-settings.bookingMode` (`embed` | `link-out`, Booking tab) are read at render, so every booking surface changes together.

**Wiring**
- Registered in `pageBlocks`; component key `bookingEmbed`. Showcase: `bookingEmbed` / `link-out`, `embed`, `no-url`. The showcase forces a state through the non-schema prop `settingsOverride: { bookingUrl, bookingMode?, thankYouHref? }`, typed in `ShowcaseEntry` (`bookingEmbed: { settingsOverride?: BookingSettingsOverride }`); page content never sets it.
- Data (`load`, Local API, `overrideAccess: false`): `findGlobal` `site-settings` `depth: 0`; in `link-out` mode with a valid URL, `find` on `pages` for the chosen page (or slug `thank-you`), `limit: 1`, `depth: 0`, `draft: false` → `docPath`. A failure is logged and the block shows the no-URL state.
- URL rule (`safeBookingUrl`): only `https:` addresses count. Empty (warn) or invalid (error) = the no-URL state.
- States, chosen at render:
  - `link-out` (default, launch): a bordered panel (2px ink border, dot matrix, wine logo shape, display heading) with a full-width bar button. The button is `BookingLaunchLink`: an `<a target="_blank" rel="noopener noreferrer">` to the booking URL; on click it also calls `router.push(thankYouHref)` in a `setTimeout(0)` so this tab moves to Thank You (DECISIONS §Q option b). Without JS, or with no published Thank You page, it is a plain new-tab link. The bar has an sr-only `(opens in a new tab)`.
  - `embed` (`bookingMode = embed`): below `md` the same link-out panel (no thank-you redirect); from `md` an `<iframe>` of the booking URL (`loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, `sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"`, `title` = heading or button label) plus the `newTabLabel` link.
  - no-URL fallback: the panel with `fallbackHeading` (or the heading), `fallbackBody` and the Contact link as the bar button; logs an error when the Contact link does not resolve.
- Unique ids: `BookingEmbedView` is a synchronous component so `React.useId()` can make the heading id unique (`booking-<block id>` or `booking-panel-<useId>`). In embed mode the mobile panel's heading id gets a `-mobile` suffix and the desktop heading is an sr-only `<p>` (not an `h2`), so the DOM never holds two identical ids or two identical `h2`. The section is `aria-labelledby` that id.
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_booking_embed`, `_pages_v_blocks_booking_embed`; enum `…_fallback_link_type`; FK `thank_you_page_id` to `pages`, `ON DELETE set null`).

**Notes**
- Framing of the Nextcloud page from `duhamedia.com` depends on the server's frame-ancestors setting (OPS_REQUESTS); the launch state is link-out (TBD: confirmed booking URL and framing answer are not recorded in the code).
- The design has no link-out or fallback panel (MERGED Conflict 8); both reuse the booking-flow frame.
- Client island reason: two navigations from one click.

### FormEmbed, standard variant (unit S5-6)

Section: Pre-call homework form (page 9); also the Contact form (page 12). New block. The `reminder` variant is on [page 10](#formembed-reminder-variant-unit-s5-6), the stepped phone layout on [page 12](#formembed-stepped-phone-layout-unit-s5-6).

**Files**
- `src/blocks/FormEmbed/config.ts` (exports `REASON_ICONS`), `Component.tsx` (`FormEmbedBlock`, `Standard`, `Reminder`, `formExists`, `steppedProps`, `steppedConfirmation`), `ReminderSwitch.tsx` and `SendAnother.tsx` (client islands). The form itself is the shared [`CMSForm` / `PayloadForm`](#form-foundation-s4-7).

**Fields & schema** (slug `formEmbed`, `interfaceName: 'FormEmbedBlock'`)
- `variant`: select, required, default `standard` (`standard` | `reminder`).
- `form`: relationship to `forms`, required, `maxDepth: 1`.
- `eyebrow` / `eyebrowTick` (standard only; `eyebrowField({ defaultTick: false })`), `heading` / `accentPhrase` (`headlineFields({ required: false })`), `body` (textarea), `submitLabel` (text; empty = the form's own label).
- `ground`: select `light` (default, "White, roomy", Book a Call) | `grey` ("Grey band, tighter", Contact); standard only. Beyond SCHEMA §8.4 (flagged).
- `mobileLayout`: select `stacked` (default) | `stepped`; standard only.
- Reminder-only and stepped-only fields are listed on their entries.

**Wiring**
- Registered in `pageBlocks`; component key `formEmbed`. Showcase fixtures reference the dev form id 14 ("DEV Contact (showcase)", kept for QA) and render nothing where no form exists; entries cover standard (homework), standard stepped (Contact, two entries), reminder and an empty-form entry.
- `formExists`: trusted `payload.count` on `forms` (`overrideAccess: true`, because forms are staff-read and a public request gets a bare id). No form chosen, a deleted form (FK is `set null`) or a failed check hides the whole section and logs an error.
- Standard render: `Section` (`tone` from `ground`; padding `py-section-mobile md:py-section` for light, `py-12 md:py-section-tight` for grey), an 820px column, optional eyebrow / `h2` heading / lead, then `CMSForm` with `tone="light"`, `submitVariant="dark"`, `submitSize="md"` and class slots `standardForm` (`fields: flex flex-wrap gap-x-4 gap-y-5`, `submit: w-full md:w-auto md:self-start`). Form-builder field `width` (percent) drives the two-column grid: `PayloadForm` sizes a field under 100% as `calc(width% - 0.5rem)` from `sm`, which assumes the `gap-x-4` column gap.
- Turnstile is always on (inside `CMSForm`). Revalidation: `pages` hook only. Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_form_embed`, `pages_blocks_form_embed_reasons`, `pages_blocks_form_embed_steps` and `_pages_v_*`; enums `…_variant`, `…_ground`, `…_mobile_layout`, `…_reasons_icon`; FK `form_id` to `forms`, `ON DELETE set null`; `pages_texts` / `_pages_v_texts` for `steps.fieldNames`).

**Notes**
- The p9 homework form needs a seeded form (`precall-homework`); the code does not create it.
- Async server component; the only client code is `PayloadForm` (and the reminder / send-another islands on their variants).

### MiniCTAStrip, inline variant (unit S5-7)

Section: Quick-question escape line to Contact. Extends [MiniCTAStrip (B3)](#minictastrip-unit-b3).

**Files**
- `src/blocks/MiniCTAStrip/config.ts`, `Component.tsx` (`MiniCTAStripBlock` dispatches; `MiniCTAInline`).

**Fields & schema**
- `variant`: options now `band` and `inline`. `text` and `link` are shared; with `inline`, `text` is the lead-in sentence (shown as written) and `link` is the underlined link after it.

**Wiring**
- Showcase: `miniCTAStrip` / `inline`, `inline — link unresolved`. Migration: `20261022_141454_b5_pages_7_12_blocks` (`ALTER TYPE … ADD VALUE 'inline'` on `enum_pages_blocks_mini_c_t_a_strip_variant` and the `_pages_v` enum).

**Notes**
- Output: a light section with one sentence in a paragraph (0.9375rem, grey) and the link as bold ink text with a 2px underline. The link's hit area is extended to 44px with an `after:` pseudo-element (`-inset-y-3`) so the underline stays tight to the text. An unresolved link renders the sentence alone.
- Inline links inside a sentence are measured below 44px in QA (F99); accepted by default under the WCAG 2.5.8 inline exception, with the MiniCTAStrip hit area still to be verified.
- Server component.

## 10. Thank You

Locked section order (SCHEMA §9): Confirmation ([Hero, compact](#hero-compact-size-and-aggregate-rating-unit-s5-1), no buttons) → Homework reminder (conditional; FormEmbed `reminder`) → While-you-wait ([NewsletterBand (S4-11)](#newsletterband-unit-s4-11)) → Footer (reduced-nav). The page is `noindex` (set on the document; the seed must set it, F65).

Hero note: the p10 showcase hero reads "Call booked. Invite's in your inbox." That conflicts with SCHEMA Q6 (the Thank You page is reached from the homework form or, with link-out booking, when the booking tab opens), so the copy is to be reworded before seeding (F80).

### FormEmbed, reminder variant (unit S5-6)

Section: Homework reminder (conditional). Part of [FormEmbed](#formembed-standard-variant-unit-s5-6).

**Files**
- `src/blocks/FormEmbed/Component.tsx` (`Reminder`), `src/blocks/FormEmbed/ReminderSwitch.tsx` (client island).

**Fields & schema** (`variant = reminder`)
- Uses `form`, `heading` / `accentPhrase`, `body`, `submitLabel` from the shared set.
- `alertLabel`: text; phones only, the warning bar across the top of the card (e.g. "Required before your call"); empty = no bar.
- `reasons`: array, max 5 rows, phones only; each `icon` (select `chart` | `clock` | `target` | `check`, required, default `check`) and `text` (text, required).
- `doneHeading` (default `Homework received.`) and `doneBody`: the "done" state text, joined with a space.

**Wiring**
- Registered with `formEmbed`. Showcase: `formEmbed` / `reminder`.
- Render: on a grey band from `md` (`py-12 md:bg-gray-light md:py-section-tight`; white on phones), a 2px ink card with shadow; heading and lead; `reasons` list (`md:hidden`); the form via `CMSForm` (class slots `reminderForm`). `confirmation` = the done text when set, else the form's own message.
- `ReminderSwitch` (`'use client'`, reason: reads `useSearchParams`): blocks receive only their own row, not the page's `searchParams`. It renders the server-rendered `done` node when `?homework=done`, else `pending`. `done` is a `role="status"` success line; when there is no done text it falls back to `pending`.
- No `<Suspense>` around it, on purpose: the `(frontend)` segment is `force-dynamic`, so `useSearchParams` never bails out of a static prerender, and a Suspense fallback of `pending` put the same form (same ids) into the streamed HTML twice (F98). To verify when pushing: that the CI `next build` still passes with `useSearchParams` outside Suspense. If the router ever passes `searchParams` to blocks, this can become a server-side branch.
- Migration: see [FormEmbed, standard](#formembed-standard-variant-unit-s5-6) (`pages_blocks_form_embed_reasons`, enum `…_reasons_icon`).

**Notes**
- Desktop design shows a two-column field grid in the reminder card; the build follows the form's field widths, and the phone-only reasons and alert bar are hidden from `md` (F101, default accepted until the homework form is seeded).
- Server component with one client island.

## 11. FAQ

Locked section order (SCHEMA §9): Hero (compact, eyebrow and heading only) → Category nav → Pricing & Contracts group (`openFirst`) → Builds → Marketing → Process & Trust → Still have questions ([FinalCTA (B3)](#finalcta-unit-b3), two buttons, capacity `none`) → Footer (standard). `pages.readingProgress` is on for FAQ. For the compact Hero see [page 7](#hero-compact-size-and-aggregate-rating-unit-s5-1).

### CategoryTabs (unit S5-9)

Section: Category nav. New block.

**Files**
- `src/blocks/CategoryTabs/config.ts`, `Component.tsx` (`CategoryTabsBlock`, `deriveCategoryTabs`, `CategoryTab`, `CategoryTabSource`), `CategoryTabsNav.tsx` (client island).

**Fields & schema** (slug `categoryTabs`, `interfaceName: 'CategoryTabsBlock'`)
- `ariaLabel`: text, required, default `FAQ categories` (screen-reader name of the nav, not shown).
- The visible tabs are NOT fields. They are derived from the page's AccordionFAQ `group` blocks.

**Wiring**
- Registered last in `pageBlocks`; component key `categoryTabs`. Showcase: `categoryTabs` with four tabs (placed directly before the four AccordionFAQ group entries so the anchors resolve), and a zero-tab entry (renders nothing, warns).
- Derivation: `RenderBlocks` computes `deriveCategoryTabs([...blocks])` once per page and injects `tabs` into every `categoryTabs` row (a row that already carries `tabs`, like a showcase fixture, keeps its own). `deriveCategoryTabs` takes each `accordionFAQ` row with `variant = group` and a non-empty `anchorId`, in layout order, as `{ label: heading (or anchorId), anchorId, from: { source, faqs, category, limit } }`; a duplicate `anchorId` is warned about and skipped (first wins).
- Published-only filter: `CategoryTabsBlock` (async server component) calls `loadAccordionFaqs` per tab that has `from` and drops tabs whose group would render nothing (no published questions), so no tab links to a missing section. Hand-written tabs (no `from`) are never filtered. With no valid tab the block renders nothing (warn).
- `CategoryTabsNav` (`'use client'`, reason: scroll-spy (scroll listener and offset math), smooth scroll and `aria-current` state): sticky bar (`sticky top-header-mobile md:top-header z-10`, sticky on phones too), the active tab gets `aria-current="location"`, reduced motion switches smooth scroll off. Without JS the tabs are plain in-page anchors.
- Revalidation: `pages` hook only. Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_category_tabs`, `_pages_v_blocks_category_tabs`).

**Notes**
- Active state is derived from scroll position (ink pill on mobile, wine underline on desktop in the design); the design's phone tab bar is non-sticky wrapping pills, the build is sticky on phones too (flagged by the coder).
- Real `/faq` is not seeded yet, so the sticky bar on a real page is untested (QA note).

### AccordionFAQ, group variant (unit S5-8)

Section: category groups (Pricing & Contracts, Builds, Marketing, Process & Trust). Extends [AccordionFAQ, mini variant](#accordionfaq-mini-variant-unit-s4-6).

**Files**
- `src/blocks/AccordionFAQ/config.ts` (exports `RESERVED_ANCHOR_IDS`), `Component.tsx` (`GroupFaq`; exports `loadAccordionFaqs`, `faqJsonLdItems`).

**Fields & schema**
- `variant`: options now `mini` and `group`. One `group` block per category.
- `anchorId`: text, `group` only; validated (below). It becomes the section `id`.
- `spacing`: select `middle` (default) | `first` | `last` | `only`, `group` only. Page-edge padding: middle `py-5 md:py-8`, first `pt-11 pb-5 md:pt-16 md:pb-8`, last `pt-5 pb-12 md:pt-8 md:pb-16`, only `pt-11 pb-12 md:pt-16 md:pb-16`. Beyond SCHEMA.
- Shared with `mini`: `eyebrow`, `heading` (required), `source` (`selected` | `category`), `category` (options come from `faqs.category`), `faqs` (relationship, hasMany, `maxDepth: 1`), `limit` (1 to 12, default 6), `openFirst`, `allLink`.
- `anchorId` validator (`validateAnchorId`): lowercase letters, numbers and single hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`); not equal to, and not prefixed `<id>-` by, any of `RESERVED_ANCHOR_IDS` (`main`, `__next`, `dc-water`); and not the same as an earlier `group` block's `anchorId` in the same layout (checked from the block's position in `options.data.layout`, on publish like every field validator). `main` is the skip-link target in `PageShell`; `dc-water` is the map SVG pattern id prefix ([DirectContact](#directcontact-unit-s5-10)). If the `dc-water` id naming changes, update `RESERVED_ANCHOR_IDS`.

**Wiring**
- Same registration as `mini`. Showcase: four `group` entries (pricing with `openFirst` and `first` spacing, builds, marketing, process with `last` spacing).
- Output: `<Section id={anchorId} class="scroll-mt-31 md:scroll-mt-34 …">` (124px / 136px scroll margin; clears the sticky header and the sticky category bar on phones and from `md`), an 820px column, an `h2` in the display face, then the shared native `<details>` question rows (`FaqRow`). A group renders nothing (warn) when it has no published question.
- A group emits no JSON-LD itself. `mini` emits its own FAQPage unless `emitJsonLd={false}` is injected (see the next entry).
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`anchor_id` varchar and `spacing` enum columns on `pages_blocks_accordion_f_a_q` and `_pages_v_blocks_accordion_f_a_q`; `ALTER TYPE … ADD VALUE 'group'` on the variant enums).

**Notes**
- A duplicate `anchorId` inside an unpublished draft still renders duplicate ids in the preview only (validators do not run for drafts); accepted, drafts are never public.
- Server component.

### Page-level FAQPage JSON-LD (PageFaqJsonLd)

**Files**
- `src/components/PageFaqJsonLd.tsx`, `src/components/PageView.tsx`, `src/components/RenderBlocks.tsx`.

**Fields & schema**: none.

**Wiring**
- `PageView` renders `<RenderBlocks blocks={layout} pageJsonLd />` and `<PageFaqJsonLd layout={layout} />`. With `pageJsonLd`, `RenderBlocks` injects `emitJsonLd={false}` into every `accordionFAQ` row, so the blocks emit none.
- `PageFaqJsonLd` (async server component): collects the published questions of every `accordionFAQ` block on the page through `loadAccordionFaqs` (same published-only rules and limit clamp as the render path), de-duplicates by FAQ id in layout order, and emits ONE `application/ld+json` `FAQPage` (`mainEntity` from `faqJsonLdItems`; `<` escaped to `<`). Renders nothing when there is no question.
- Applies to every `pages` document (`/` and `[...slug]`); the case-study template is unaffected. A `category`-source block reads the database twice per request (here and when it renders; `force-dynamic`, no cache).
- Migration: none.

**Notes**
- Fixes the finding that two AccordionFAQ blocks on one page produced two FAQPage scripts (A1 of F78).

## 12. Contact

Locked section order (SCHEMA §9): Hero (compact, routing line) → Contact form (FormEmbed `standard`, mobile stepped) → Direct info + map (DirectContact) → Footer (standard). For the compact Hero see [page 7](#hero-compact-size-and-aggregate-rating-unit-s5-1); for the standard FormEmbed see [page 9](#formembed-standard-variant-unit-s5-6). The page also renders [OrganizationJsonLd](#organization--localbusiness-json-ld-organizationjsonld).

### FormEmbed, stepped phone layout (unit S5-6)

Section: Contact form (phone build: one question at a time). Part of [FormEmbed](#formembed-standard-variant-unit-s5-6); the engine is [Forms: stepped layout](#forms-stepped-layout-and-per-instance-ids-big-step-5).

**Files**
- `src/blocks/FormEmbed/config.ts`, `Component.tsx` (`steppedProps`, `toFormSteps`, `stepHeading`, `steppedConfirmation`, class maps `steppedForm`, `steppedCard`, `steppedControl`, `steppedNav`), `SendAnother.tsx`; `src/components/forms/PayloadForm.tsx`, `steps.ts`.

**Fields & schema** (shown when `variant = standard` and `mobileLayout = stepped`)
- `steps`: array, max 10 rows: `fieldNames` (text, `hasMany`, required: the form-builder field "Name"s in this step), `heading` / `accentPhrase` (`headlineFields({ required: false })`), `hint` (text). Empty array = one question per step, headed by the field label. A form field no step names is added to the last step.
- `stepped`: group, "Stepped layout: buttons and progress": `progressLabel` (default `Question {n} of {m}`), `startLabel` (`Start`), `nextLabel` (`Next`), `backLabel` (`Back`, read aloud), `sendAnotherLabel` (`Send another`), `selectAsOptions` (checkbox, default true).
- `steps` and `stepped` are schema additions beyond SCHEMA §8.4 (F79, flagged for a mini Gate S).

**Wiring**
- `steppedProps` maps the block onto `PayloadForm`: `layout: 'stepped'`, `steppedBelow: 'md'`, `steps` (blank names dropped; empty `steps` becomes `undefined`), `selectAsOptions`, and the four labels. Below `md` the form is the design's card (2px ink border, min height 520px, progress block on top, nav bar pinned to the bottom behind a 2px rule, dotted ground on step 1, wine mark on steps 1 and 2); from `md` the layout is the stacked form. The class maps use `max-md:` scoping so the stacked rendering keeps its defaults.
- Confirmation (`steppedConfirmation`): the form's own `confirmationMessage` rendered through `RichText` on a dark panel with a check mark and a "Send another" bar. Skipped (`undefined`, so `CMSForm`'s own handling applies) for redirect-type forms, a form with no message, or a failed read. `SendAnother` (`'use client'`) reloads the page, because `PayloadForm` has no reset and a second submission needs a fresh Turnstile token.
- Dev form for QA: id 14 ("DEV Contact (showcase)"); the showcase has two stepped entries.
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_form_embed_steps`, `pages_texts` with `path` for `fieldNames`, the `stepped_*` columns on `pages_blocks_form_embed`, and the `_pages_v` equivalents). This file was regenerated when `sendAnotherLabel` was added.

**Notes**
- The wine-mark disc on the stepped card is kept as a small corner cap clear of the progress bar and the heading, a departure from the design geometry (F102, accepted by the human).
- Step headings are `<h3>` inside the card with focus moved to them on step change (F81).
- Keying of the Next / Send buttons fixed "step-4 error shown on arrival" (see the forms entry).

### DirectContact (unit S5-10)

Section: Direct info + map. New block; replaces the baseline `MapEmbed` (X5 / R9).

**Files**
- `src/blocks/DirectContact/config.ts`, `Component.tsx` (`DirectContactBlock`, async server component; `SocialIcon`), `ServiceAreaMap.tsx` (`ServiceAreaMap`, `mapStamp`).

**Fields & schema** (slug `directContact`, `interfaceName: 'DirectContactBlock'`; no variant)
- `showEmail`, `showSocials`, `showLocation`: checkboxes, default true.
- `skipFormLine`: text, max 40, default `Skip the form` (phones; empty hides it).
- `rowLabels`: group `email` (`Email`), `socials` (`Socials`), `location` (`Location`), `replyTime` (`Reply time`), each max 30. Beyond SCHEMA.
- `map`: group `show` (checkbox, default true), `caption` (textarea, default "Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway."; also the screen-reader description), `zoom` (number 0.5 to 2, step 0.25, default 1).
- Values are not block fields: they come from `site-settings` at render (`contactEmail`, `responseTimeNote`, `socials[]` (`handle`, `url`), `location` (`displayLine`, `locality`, `region`, `latitude`, `longitude`, `serviceRadiusMiles`)).

**Wiring**
- Registered in `pageBlocks`; component key `directContact`. Showcase: all rows plus map, no map, email only, map only at zoom 1.5.
- `loadSettings`: `findGlobal` `site-settings`, `depth: 0`, `overrideAccess: false`; a failure is logged and the block renders without details. Rows without a value are omitted; socials need a non-empty `handle` and an `http(s)` `url`. If no row and no map would render, the block renders nothing (warn).
- Map: a static schematic SVG drawn by the site (no external map service, no dependencies, no tiles), centred on `latitude` / `longitude` (fallback Lombard 41.88 / -88.008), with the service-radius ring (`serviceRadiusMiles`, fallback 30). Social icons are hand-inlined SVG (unverified against real profiles; dev has no socials).
- Per-instance pattern id (F89): `ServiceAreaMap` renders both a mobile and a desktop SVG, and the water hatching pattern id is `dc-water-<size>-<useId()>` (non-alphanumerics stripped), so the page holds no duplicate id (the same id used to appear 4 times on the showcase and the hatching could vanish).
- Migration: `20261022_141454_b5_pages_7_12_blocks` (`pages_blocks_direct_contact`, `_pages_v_blocks_direct_contact`).

**Notes**
- Row labels show on `md` and up (and for location and reply time on phones). The email link and the social links are 44px tall at all widths after the Gate 1 rework.
- Server component; no interactivity.

### Organization / LocalBusiness JSON-LD (OrganizationJsonLd)

Rendered on page 1 (Homepage) and page 12 (Contact). Documented once, here; the Homepage section links to this entry.

**Files**
- `src/components/OrganizationJsonLd.tsx` (exports `OrganizationJsonLd`, `CONTACT_SLUG`, `ORGANIZATION_JSONLD_SLUGS`), `src/components/PageView.tsx`, `src/lib/metadata.ts` (`absoluteMediaUrl`).

**Fields & schema**: none. Reads the `seo-defaults` global (`organization.name`, `organization.logo`, `organization.foundingDate`, `localBusiness.type`, `localBusiness.areaServed`, `localBusiness.openingHours`) and `site-settings` (`legalName`, `contactEmail`, `location.{locality,region,country,latitude,longitude}`, `socials[].url`, `gbpUrl`) through `getSeoDefaults()` and `getChrome()`.

**Wiring**
- `PageView` renders `<OrganizationJsonLd />` inside `<main>` when `page.slug` is in `ORGANIZATION_JSONLD_SLUGS` (`home`, `contact`). One `application/ld+json` script.
- `@type` = `seo-defaults.localBusiness.type` (only `ProfessionalService`, a schema.org LocalBusiness subtype) when set, else `Organization`. Properties: `name`, `legalName`, `url` (`SITE_URL`), `logo` (`ImageObject`, original upload via `absoluteMediaUrl(…, 'original')`), `email`, `foundingDate`, `address` (`PostalAddress`: locality, region, country), `sameAs` (social profile URLs plus the GBP link, de-duplicated). With a business type: `geo` (`GeoCoordinates`, when both coordinates are numbers), `areaServed`, `openingHours` (the stored "a; b" string split on `;`).
- `compact` drops empty strings, non-finite numbers, empty arrays and objects with nothing but `@type`. Nothing is hardcoded and nothing is emitted for an unset field; `<` is escaped to `<`.
- Revalidation: both globals' `revalidateGlobalHook` purge the whole `(frontend)` layout on save, which covers `/` and `/contact`. Migration: none.

**Notes**
- No `aggregateRating` (Google excludes self-published ratings).
- Open flags: F103 (no switch to enable LocalBusiness; dev `localBusiness.type` is null, so the output is `Organization` until the seed or an editor sets it), F104 (schema.org marks `ProfessionalService` deprecated but still valid; S2 locked it), F105 (the address is locality, region and country only, which may not qualify for a Google local rich result; a street and postal code would be a human fact and possibly a field), F106 (stored geo has fewer than the 5 decimals Google recommends).

## 13. DEV-SEO template

Data source: the [`posts` collection (C8)](#posts-unit-c8), `track = dev-seo`, route `/insights/<slug>` (site-wide section). No blocks documented yet.

## 14. MKT-SEO template

Data source: the [`posts` collection (C8)](#posts-unit-c8), `track = mkt-seo`, route `/insights/<slug>` (site-wide section). No blocks documented yet.

## 15. Campaign LP template

*No units documented yet.*

## 16. Newsletter

Issue rows and issue pages come from the [`posts` collection (C8)](#posts-unit-c8), `track = newsletter-issue`, route `/newsletter/<slug>`. No blocks documented yet.

## 17. Link-in-Bio

*No units documented yet.*

## 18. Lead Magnet template

Data source: the [`lead-magnets` collection (C9)](#lead-magnets-unit-c9), route `/resources/<slug>` (site-wide section). No blocks documented yet.

## 19. Review Hub

*No units documented yet.*

## 20. Legal template

*No units documented yet.*

## 21. 404

*No units documented yet.*

---

## Site-wide units

Collections, globals, header and footer variants, and anything not owned by a single page.

### Collections

Entries are in build order (C1, C2, C3 …), not `SCHEMA.md` §6 order (PM decision).

#### Access helpers + `users` (unit C1)

**Files**
- `src/access/roles.ts`: `ROLES` (`admin`, `marketing`, `pipeline`), `Role` type, `ROLE_LABELS`, `roleOf` (returns `null` for a missing/unknown role, which means no access), predicates `isAdmin`, `isMarketing`, `isStaff` (admin or marketing, never pipeline), `isPipeline`. (The deprecated `authenticated` alias that C1 kept for `Media.ts` was removed in C2.)
- `src/access/index.ts`: re-exports the role module, plus shared helpers:
  - `adminOnly`, `staffOnly` (collection `Access`).
  - `adminOnlyField`, `staffOnlyField` (field `FieldAccess`, boolean only).
  - `publishedOrStaff`: staff → `true`; everyone else (public and pipeline) → `{ _status: { equals: 'published' } }`.
  - `turnstileVerifiedOrAdmin`: `req.context.turnstileVerified === true` or admin. For `form-submissions` create; the flag is set only by the server-side form handler after Turnstile siteverify.
  - `posts`-only helpers, attached to `posts` in [C8](#posts-unit-c8): `postsRead` (staff all · pipeline drafts · public published), `staffOrPipeline` (create), `staffOrPipelineDrafts` (update: staff all · pipeline drafts · public none).
- `src/access/pipeline.ts`: the `posts` pipeline guards, all attached in [C8](#posts-unit-c8) (details there): `forbidPipelinePublish` (`beforeChange`: for a pipeline user, any `_status` other than `draft` throws `Forbidden` (403); otherwise forces `_status: 'draft'`), `forbidPipelineOnPublished` (`beforeChange`), `pipelineNeverPublishes` (`afterChange` backstop).
- `src/collections/Users.ts`: the `users` collection.
- `src/migrations/20261017_193341_c1_users_role.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

| Field | Type | Notes |
|---|---|---|
| `email`, `password` | auth (generated) | |
| `name` | text | Admin display name |
| `role` | select `admin` / `marketing` / `pipeline`, required, default `marketing`, `saveToJWT: true` | Field access create/update: admin only. DB enum `enum_users_role` |
| `enableAPIKey`, `apiKey`, `apiKeyIndex` | auth (API key) | `apiKey` field overridden so create/update is admin only; Payload propagates this to `enableAPIKey`, `apiKeyIndex` and `hasAPIKey` read |

- `auth`: `maxLoginAttempts: 5`, `lockTime: 600000` (10 min), `useAPIKey: true` (`reveal` default false), `tokenExpiration: 7200` (2 h), sessions on (default).
- Hooks:
  - `beforeChange` `firstUserIsAdmin`: on create, if the collection has 0 users, sets `role: 'admin'`.
  - `beforeChange` `apiKeyOnlyForPipeline`: a key may exist only on a `pipeline` user. Changing a user's role away from `pipeline` sets `enableAPIKey: false`, `apiKey: null`, `apiKeyIndex: null` in the same save. Enabling/setting a key on any other role throws `ValidationError` on `role`.
  - `beforeLogin` `blockPipelineLogin`: a `pipeline` user's password login throws `AuthenticationError` (generic incorrect-credentials message). Applies to login and reset-password.
- Access matrix:

| Who | admin panel | read | create | update | delete | unlock |
|---|---|---|---|---|---|---|
| admin | yes | all | yes | all | yes | yes |
| marketing | yes | own doc | no | own doc (not `role`, not API-key fields) | no | no |
| pipeline | no | none | no | none | no | no |
| public | no | none | no | no | no | no |

- Pipeline authentication: header `Authorization: users API-Key <key>` only.

**Wiring**
- Registration: `src/payload.config.ts` → `collections` array (the latest collection entry, currently [C9](#lead-magnets-unit-c9), lists it), `admin.user: Users.slug`.
- Pages using it: none (not publicly rendered).
- Revalidation: n/a.
- Migration: `20261017_193341_c1_users_role`. Up: creates `enum_users_role`, adds `name`, `role` (default `marketing`, not null), `enable_a_p_i_key`, `api_key`, `api_key_index`; data step sets `role = 'admin'` for every user holding `admin` in `users_roles`; drops `users_roles` and `enum_users_roles`. Down (best-effort): restores one `users_roles` row per admin/marketing user; pipeline users get no row and lose their key; a user who held both roles comes back admin only; `name` values are lost.

**Notes**
- Pipeline user has no access to `users` documents (not even its own). This is stricter than `SCHEMA.md` §4.3 ("others: self"); PM decision.
- Nothing relies on Payload's default access ("any logged-in user"), because the pipeline user is logged in. Every collection and global sets read/create/update/delete explicitly from these helpers.
- The pipeline user is created by an admin; its password is never used.

#### `media` + `downloads` (unit C2)

**Files**
- `src/collections/Media.ts`: the `media` collection; exports `MEDIA_DIR` (shared upload root).
- `src/collections/Downloads.ts`: the `downloads` collection; imports `MEDIA_DIR` from `Media.ts`.
- `src/access/roles.ts`: deprecated `authenticated` alias removed (no remaining imports).
- `src/payload.config.ts`: `collections: [Users, Media, Downloads]`.
- `src/migrations/20261017_195538_c2_media_downloads.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

`media` (images only; no drafts; `useAsTitle: 'alt'`; default columns `filename`, `alt`, `updatedAt`):

| Field | Type | Notes |
|---|---|---|
| `alt` | text, required | Custom `validate` (below) |
| `caption` | text, optional | Default caption when used as a figure in an article |
| upload fields | generated | `filename`, `mimeType`, `filesize`, `width`, `height`, `focalX`/`focalY`, `sizes.*` |

- `alt` validator (`validateAlt`): runs Payload's default `text` validator from `payload/shared` first (a custom `validate` replaces the built-in one, so this keeps `required` enforced), then rejects whitespace-only values and file-name-like values matching `/\.(jpe?g|png|webp|gif)$/i`.

- `upload`: `mimeTypes: ['image/*']` (SVG allowed, human decision; Payload runs its own SVG safety check), `focalPoint: true`, `adminThumbnail: 'thumbnail'`.
- `imageSizes` (all `position: 'centre'`):

| Name | Size | Intended use |
|---|---|---|
| `thumbnail` | 400×300 | Admin thumbnail |
| `card` | 768 wide | Cards |
| `browser` | 1440 wide | Page 2 browser-framed case-study hero |
| `wide` | 1600 wide | Wide images |
| `og` | 1200×630 | Open Graph image (`seo-defaults` / plugin-seo) |

`downloads` (non-image lead-magnet deliverables; no drafts; `useAsTitle: 'title'`; default columns `title`, `filename`, `updatedAt`):

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | Admin title and link text in the delivery email |
| upload fields | generated | `filename`, `mimeType`, `filesize` |

- `upload`: `mimeTypes` `application/pdf`, `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx), `application/zip`; `focalPoint: false`, `crop: false`, no `imageSizes`.

Access:

`media`:

| Who | read | create | update | delete |
|---|---|---|---|---|
| public | yes | no | no | no |
| admin, marketing (`staffOnly`) | yes | yes | yes | yes |
| pipeline | yes (public read) | no | no | no |

`downloads` (changed in [S1](#lead-magnets-unit-c9), mini Gate S 2026-10-21): `read: staffOnly`, so the table above does not apply to it.

| Who | read | create | update | delete |
|---|---|---|---|---|
| public | no (403) | no | no | no |
| admin, marketing (`staffOnly`) | yes | yes | yes | yes |
| pipeline | no (403) | no | no | no |

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads]`.
- Storage: `MEDIA_DIR = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')`.
  - `media` `staticDir`: `${MEDIA_DIR}/media`.
  - `downloads` `staticDir`: `${MEDIA_DIR}/downloads`.
  - Payload creates the directories on first upload.
- Serving: `/api/media/file/<filename>` is public read. `/api/downloads` and `/api/downloads/file/<filename>` are staff-only since S1 (the collection `read` access also governs the static file route); anonymous requests return 403 (verified 2026-10-21). Paths containing `../` are rejected with 403.
- Pages using it: `media` is referenced by any unit that renders imagery; `downloads` by `lead-magnets` (page 18). Linked from those entries as they land.
- Revalidation: n/a in this unit. Pages that render media revalidate through their own collection/global hooks.
- Migration: `20261017_195538_c2_media_downloads`. Additive only.
  - Up: creates `downloads` table (+ `updated_at`, `created_at` indexes, unique `filename` index); adds `media.caption` and the `sizes_browser_*` and `sizes_og_*` columns (+ filename indexes); adds `payload_locked_documents_rels.downloads_id` with FK `payload_locked_documents_rels_downloads_fk` (ON DELETE cascade) and index.
  - Down: hand-reordered to drop the FK before `DROP TABLE "downloads" CASCADE` (the generated order failed because CASCADE had already removed the FK); then drops the added indexes and columns.

**Notes**
- `media/` and `downloads/` are siblings under `MEDIA_DIR` on purpose: Payload's file route serves any path under a collection's `staticDir`, so nesting one inside the other would let `/api/media/file/downloads%2F<name>` serve a download.
- `mimeTypes` is enforced server-side by content sniffing (`uploads/checkFileRestrictions.js`), not only in the file picker.
- PDF uploads are validated by Payload 3.91.0 (`payload/dist/utilities/validatePDF.js`): the file must start with `%PDF-` and contain both `xref` and `%%EOF` in its last 1024 bytes. Seed fixtures must be real PDFs.
- A request for a missing file returns **500** "Something went wrong." (stock 3.91.0 behaviour, not 404). The `site_error` reporter must ignore or rate-limit these.
- Non-image assets never go in `media`, so every `media` document has a meaningful alt.
- S1: `downloads` files are no longer publicly fetchable by URL. The `lead_magnet` integration delivers them as email attachments (not yet built); it must read the file with `overrideAccess`. No migration for this change.
- S3: `media` has `beforeDelete: [blockDeleteIfReferenced({ noun: 'image', hints })]` with the default-OG-image hint (`seo-defaults:defaultOgImage`), and `upload.handlers: [missingFileHandler(MEDIA_STATIC_DIR)]`. `downloads` has `beforeDelete: [blockDeleteIfReferenced({ noun: 'file' })]` and `upload.handlers: [missingFileHandler(DOWNLOADS_STATIC_DIR)]`. See [Error handling](#error-handling-unit-s3).

#### Shared helpers for content collections (C3–C6)

Introduced with C3–C6 and reused by later content collections.

- `src/fields/index.ts`:
  - `contentVersions`: `drafts.autosave: false` (S3; was `autosave.interval: 375`), `drafts.schedulePublish: false`, `drafts.validate: false`, `maxPerDoc: 50`. With `validate: false`, draft saves skip all field validation (built-in and custom), so "required" means "required to publish".
  - S3 autosave off (F21): used by the 8 `contentVersions` collections (`pages`, `clients`, `team-members`, `testimonials`, `faqs`, `case-studies`, `posts`, `lead-magnets`). In payload@3.91.0 the admin create view creates a draft as soon as it opens when autosave is on and `drafts.validate` is off (`@payloadcms/next` `views/Document/index.js:247-279`); there is no option to skip that, and `drafts.validate: true` would enforce required fields on every draft save (breaks "required to publish"). The editor now gets "Save draft" + "Publish". Live preview: client-side `useLivePreview` still updates on every keystroke; server-rendered preview (`RefreshRouteOnSave`) refreshes on Save draft. The slug is fixed at first save unless regenerated. Migration and flags: [Error handling](#error-handling-unit-s3).
  - `sortOrderField(description?)`: `sortOrder` number field, indexed, sidebar, step 1. Lower numbers first. Used instead of `orderable` (experimental in 3.91.0).
  - `validateHttpsUrl`: text validator; runs `text()` from `payload/shared` first (a custom `validate` replaces the built-in one); empty passes unless `required`; otherwise must parse as an `https:` URL.
  - `validateYouTubeUrl`: same pattern; non-empty value must yield a video id from `youtubeVideoId`.
- `src/lib/youtube.ts`: `youtubeVideoId(input)` returns the 11-character id or `null`. Accepts https only; hosts `youtube.com`, `www.`/`m.youtube.com`, `youtu.be`, `youtube-nocookie.com`, `www.youtube-nocookie.com`; paths `watch?v=`, `youtu.be/<id>`, `/embed/`, `/shorts/`, `/live/`. Video components must reuse this function, so validation and rendering share one definition.
- `src/access/index.ts`: `staffContentAccess` preset = `read: publishedOrStaff`, `readVersions: staffOnly`, `create`/`update`/`delete: staffOnly`. Public and pipeline get published docs only and no writes; `readVersions` staff-only keeps drafts out of `/api/<slug>/versions`.
- S1 additions to `src/access/index.ts` (Delta log 2026-10-18):
  - `adminOrMarketingUnpublished` (`Access`): admin `true`; marketing returns `{ _status: { not_equals: 'published' } }`; everyone else `false`. Payload 3.91.0 applies the `Where` to the main collection row on delete, so a published doc with a newer staff draft still counts as published. `not_equals` also matches NULL `_status`. Used by `case-studies`, `posts`, `lead-magnets`, `pages`.
  - `staffContentAccessDraftDelete`: `staffContentAccess` with `delete: adminOrMarketingUnpublished`. Used by `lead-magnets` and `pages`. `faqs`, `team-members`, `clients`, `testimonials` keep `staffContentAccess` (staff delete).
- `src/hooks/revalidateTag.ts`: `revalidateTagHooks(tag)` returns `{ afterChange, afterDelete }`.
  - Calls Next 16 `revalidateTag(tag, 'max')` (the profile argument is required in next@16.3.8).
  - `afterChange` fires only when the saved doc is published or the previous doc was published (publish, re-publish, unpublish). Draft/autosave edits of an unpublished doc do nothing.
  - `afterDelete` always fires.
  - Skipped when `context.disableRevalidate` is set. The seed script must pass `context: { disableRevalidate: true }`.
  - Outside a Next request (Local API scripts, seed, migrations) Next throws "Invariant: static generation store missing"; that case is logged at debug and swallowed. Any other error is logged at error level and swallowed, so a revalidation failure never fails a save.
  - Pattern from the Payload website template at v3.91.0 (`templates/website/src/collections/Posts/hooks/revalidatePost.ts`).
- `src/app/(payload)/admin/importMap.js`: regenerated; now includes the `@payloadcms/richtext-lexical` client components (first `richText` field is `faqs.answer`).

#### `clients` (unit C3)

**Files**
- `src/collections/Clients.ts`
- Migration shared with C4–C6: `src/migrations/20261017_202453_c3_c6_clients_team_testimonials_faqs.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`); `useAsTitle: 'name'`; `defaultSort: 'sortOrder'`; default columns `name`, `showInLogoStrip`, `sortOrder`, `_status`, `updatedAt`.

| Field | Type | Notes |
|---|---|---|
| `name` | text, required | Shown as text in the logo strip when there is no logo |
| `logo` | upload → `media`, `maxDepth: 1`, optional | Monochrome logo |
| `website` | text, `validateHttpsUrl` | Optional |
| `showInLogoStrip` | checkbox, default `false`, sidebar | Include in logo strips |
| `sortOrder` | `sortOrderField` | Order in the logo strip |

- Access: `staffContentAccess`.

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs]`.
- Pages using it (per `SCHEMA.md`): p1 proof-strip logo row, p8 logo strip (via the CaseStudyCards fallback), p15 proof strip, p19 review-wall name tiles; attribution target for `testimonials.client` and (C7) case studies. Linked from block entries as they land.
- Revalidation: tag `clients` (`revalidateTagHooks('clients')` on `afterChange` / `afterDelete`).
- Migration: `20261017_202453_c3_c6_clients_team_testimonials_faqs` (see C6 entry for the combined summary). Tables `clients`, `_clients_v`; enums `enum_clients_status`, `enum__clients_v_version_status`; FK `logo_id` → `media` (ON DELETE set null).

**Notes**
- All client names are placeholders at launch; the seed labels them as such.
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. See [Error handling](#error-handling-unit-s3).

#### `team-members` (unit C4)

**Files**
- `src/collections/TeamMembers.ts`
- Migration: shared C3–C6 migration (see C6).

**Fields & schema**

Drafts on (`contentVersions`); `useAsTitle: 'name'`; default columns `name`, `role`, `_status`, `updatedAt`.

| Field | Type | Notes |
|---|---|---|
| `name` | text, required | Site display name and byline |
| `role` | text, required | Short title line |
| `bio` | textarea, `maxLength: 400` | Optional |
| `photo` | upload → `media`, `maxDepth: 1` | Optional portrait |
| `socials` | array (`platform` select required: `linkedin` / `x` / `github` / `instagram` / `youtube` / `facebook`; `url` text required, `validateHttpsUrl`) | Reorderable; `initCollapsed` |

- Access: `staffContentAccess`.

**Wiring**
- Registration: `src/payload.config.ts` `collections` array (as C3).
- Pages using it (per `SCHEMA.md`): p1 founder/team, p8 team/founder (via `TeamIntro.member`), p13/p14 post bylines (C8).
- Revalidation: tag `team-members`.
- Migration: shared C3–C6 migration. Tables `team_members`, `team_members_socials`, `_team_members_v`, `_team_members_v_version_socials`; enums `enum_team_members_socials_platform`, `enum_team_members_status`, `enum__team_members_v_version_socials_platform`, `enum__team_members_v_version_status`; FK `photo_id` → `media` (set null); socials `_parent_id` FKs ON DELETE cascade.

**Notes**
- A collection rather than a global (Gate S §2.3): post bylines need a public relationship target, and a global cannot be one.
- No "latest posts" field (R12).
- The bio stays placeholder until the founder writes it; no invented founder facts.
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. See [Error handling](#error-handling-unit-s3).

#### `testimonials` (unit C5)

**Files**
- `src/collections/Testimonials.ts`
- Uses `validateHttpsUrl`, `validateYouTubeUrl` (`src/fields/index.ts`) and `number`, `upload` validators from `payload/shared`.
- Migration: shared C3–C6 migration (see C6).

**Fields & schema**

Drafts on (`contentVersions`); `useAsTitle: 'authorName'`; `defaultSort: 'sortOrder'`; default columns `authorName`, `source`, `format`, `client`, `sortOrder`, `_status`.

| Field | Type | Notes |
|---|---|---|
| `quote` | textarea, required | |
| `authorName` | text, required | |
| `authorRole` | text | Optional |
| `client` | relationship → `clients`, `maxDepth: 1` | Optional brand pairing |
| `source` | select `direct` / `google-review` / `linkedin`, required, default `direct`, sidebar | Drives source label |
| `sourceUrl` | text | Shown when `source` ≠ `direct`; custom validate: required when shown, then `validateHttpsUrl` |
| `verbatim` | checkbox, default `false` | Shown when `source` = `google-review`; custom validate: must be `true` |
| `rating` | number, `min: 1`, `max: 5`, step 1, sidebar | Optional; custom validate: `number()` then integer only. Empty = no stars (never defaulted) |
| `format` | select `text` / `video`, required, default `text`, sidebar | Named `format`, not `type` (X14) |
| `video` | group, shown when `format` = `video` | `url` (custom validate: required, then `validateYouTubeUrl`); `poster` upload → `media`, `maxDepth: 1` (custom validate: required, then `upload()`); `durationLabel` text, optional |
| `metric` | group | `value` text, `label` text; both optional. Value is a result, never a price |
| `caseStudy` | relationship → `case-studies`, `maxDepth: 1` | Optional; "Read the full case study" deep link once that study is published. Added in C7 |
| `reviewDate` | date, `dayOnly`, sidebar | Optional |
| `sortOrder` | `sortOrderField` | Order in feed and review wall |

- Conditional requirements use custom `validate` functions instead of `required: true`, so generated types stay optional. They run on publish only (`drafts.validate: false`), and a field hidden by `admin.condition` (or inside a hidden group) is not validated (payload@3.91.0 `fields/hooks/beforeChange/promise.js:44`).
- Access: `staffContentAccess`.

**Wiring**
- Registration: `src/payload.config.ts` `collections` array (as C3).
- Pages using it (per `SCHEMA.md`): p1 testimonials, p2 client voice, p3 proof pull, p4 featured proof, p5 proof fallback, p7 testimonial feed, p9 social proof, p15 testimonial, p16 social proof, p19 review wall.
- Revalidation: tag `testimonials`.
- Migration: shared C3–C6 migration. Tables `testimonials`, `_testimonials_v`; enums `enum_testimonials_source`, `enum_testimonials_format`, `enum_testimonials_status` and the `_v` equivalents; FKs `client_id` → `clients`, `video_poster_id` → `media` (both ON DELETE set null). Group fields are flattened columns (`video_url`, `video_poster_id`, `video_duration_label`, `metric_value`, `metric_label`).
- Migration (C7): `20261017_210942_c7_case_studies` adds `testimonials.case_study_id` and `_testimonials_v.version_case_study_id` (FKs → `case_studies`, ON DELETE set null) + indexes. See the [C7 entry](#case-studies-unit-c7).

**Notes**
- Google-Business-Profile-style reviews are merged into this collection via `source` (Gate S §2.2), so p7 and p19 feeds are one query.
- Video = unlisted YouTube; poster stored locally in `media` (Gate S Q5).
- `caseStudy` relationship (SCHEMA §6.4) was added in C7 with the C7 migration (the former `TODO(C7)` is resolved).
- All reviewers, quotes and metrics are placeholders at launch.
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. See [Error handling](#error-handling-unit-s3).

#### `faqs` (unit C6)

**Files**
- `src/collections/Faqs.ts`
- `src/migrations/20261017_202453_c3_c6_clients_team_testimonials_faqs.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`); `useAsTitle: 'question'`; `defaultSort: ['category', 'sortOrder']`; default columns `question`, `category`, `listOnFaqPage`, `sortOrder`, `_status`.

| Field | Type | Notes |
|---|---|---|
| `question` | text, required | |
| `answer` | richText, required | Field-level `lexicalEditor` with only `ParagraphFeature`, `BoldFeature`, `ItalicFeature`, `UnorderedListFeature`, `OrderedListFeature`, `LinkFeature({ enabledCollections: [] })`, `InlineToolbarFeature`. Stored as `jsonb` |
| `category` | select `pricing-contracts` / `builds` / `marketing` / `process-trust`, required, sidebar | FAQ page group |
| `listOnFaqPage` | checkbox, default `true`, sidebar | Untick for mini-block-only questions |
| `sortOrder` | `sortOrderField` | Order within category; first Pricing & Contracts question opens by default |

- Access: `staffContentAccess`.

**Wiring**
- Registration: `src/payload.config.ts` `collections` array (as C3).
- Pages using it (per `SCHEMA.md`): p11 FAQ page; FAQ mini-blocks on p4, p5, p6. Placement lives on the `AccordionFAQ` block (ordered hasMany → `faqs`, X10), not on this collection.
- Revalidation: tag `faqs`.
- Migration `20261017_202453_c3_c6_clients_team_testimonials_faqs` (one combined migration for C3–C6, additive only):
  - Up: creates 10 tables (`clients`, `_clients_v`, `team_members`, `team_members_socials`, `_team_members_v`, `_team_members_v_version_socials`, `testimonials`, `_testimonials_v`, `faqs`, `_faqs_v`), 16 enums, their FKs and indexes; adds `clients_id`, `team_members_id`, `testimonials_id`, `faqs_id` to `payload_locked_documents_rels` with FKs (ON DELETE cascade) and indexes.
  - Down: hand-reordered to drop the four `payload_locked_documents_rels_*_fk` constraints before the `DROP TABLE … CASCADE` statements (same fix as C2), then drops the added indexes, columns and enums.

**Notes**
- The restricted editor excludes headings, uploads and relationship features (the default editor's Relationship/Upload features could reference any collection, including `users`).
- Answer links: done in [C10](#pages-unit-c10). The answer editor uses `richTextLinkFeature()` (internal links to `LINK_TARGETS` plus external URLs).
- Post FAQs (p13/p14) are an inline array on `posts` (X11), not documents here.

#### `case-studies` (unit C7)

**Files**
- `src/collections/CaseStudies.ts`: the `case-studies` collection, its access, hooks and two Lexical editor configs.
- `src/collections/Testimonials.ts`: adds `caseStudy` (see [C5](#testimonials-unit-c5)).
- `src/fields/index.ts` (new shared factories, reused by later units):
  - `metricFields()`: `Field[]` to spread inside a named group. Row `value` (text, required) + `label` (text, required); `sub` (text); `accent` (checkbox, default `false`). No default numbers (R5); value is a result, never a price (R13).
  - `validateAccentPhrase(headingField)`: text validator; runs `text()` first; empty passes; otherwise the value must be a case-insensitive substring of the sibling field `headingField`.
  - `linkField({ name, label?, description?, required? })`: group `{ type, newTab, reference, url, label }`.
    - `type` select `internal` / `custom` (required, default `internal`, `admin.isClearable: false` since G3: an emptied required `type` blocked saving; applies to every `linkField` use); `newTab` checkbox (default `false`).
    - `reference`: polymorphic relationship, `relationTo: ['case-studies']` (`LINK_TARGETS`), `maxDepth: 1`, shown when `type` = `internal`.
    - `url`: text, shown when `type` = `custom`; accepts `https://…`, `mailto:…` or a site path starting with a single `/`.
    - `label`: text ("Link text").
    - `required: true` → must be filled to publish. Optional links (default) may be left fully empty; once any of `label` / `url` / `reference` is filled, label and destination are both required.
    - `validateReference` awaits `relationship()` from `payload/shared`: the built-in relationship validator is async in payload@3.91.0 and must be awaited.
- `src/hooks/revalidateTag.ts`: `revalidateTagHooks(tag, { paths? })` gained the optional `paths(doc)` option (see Wiring).
- `src/hooks/publishedAt.ts`: `setPublishedAtOnPublish`, a collection `beforeChange` hook. When the effective status (`data._status ?? originalDoc._status`) is `published` and neither `data.publishedAt` nor `originalDoc.publishedAt` is set, sets `publishedAt` to now. An editor-entered date is never overwritten. SCHEMA §10 lists it for pages, case-studies, posts, lead-magnets; attached to case-studies only so far.
- `src/lib/lexicalText.ts`: `lexicalWordCount(value)` (counts words of every `text` node in Lexical JSON; never throws on malformed input), `WORDS_PER_MINUTE = 225`, `readTimeMinutes(words)` (`null` for 0 words, else `max(1, round(words / 225))`).
- `src/components/admin/ResultRowLabel.tsx`: `'use client'` array RowLabel (`useRowLabel`) for `resultsTable.rows`: "`measure` — `change`" (falls back to `after`), else "Result 01".
- `src/app/(payload)/admin/importMap.js`: regenerated; adds `ResultRowLabel` and the Lexical `FixedToolbarFeatureClient`, `UploadFeatureClient`, `BlockquoteFeatureClient`.
- `src/payload.config.ts`: `CaseStudies` registered.
- `src/payload-types.ts`: regenerated.
- `src/migrations/20261017_210942_c7_case_studies.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`: autosave interval 375, `schedulePublish: false`, `validate: false`); labels "Case study" / "Case studies"; `useAsTitle: 'title'`.

- `defaultSort: ['-_status', '-publishedAt']`: published studies first (`'published'` > `'draft'`), newest first, then drafts. Postgres sorts NULLs first on DESC and `@payloadcms/drizzle@3.91.0` has no nulls-last option (`queries/buildOrderBy.js`), hence the explicit `_status` key. Public queries are published-only, so for them this is effectively `-publishedAt`. A user's saved list sort in the admin overrides it.
- `defaultColumns`: `title`, `client`, `track`, `figuresApproved`, `_status`, `publishedAt`, `updatedAt`. `featured` is not a default column; it is still filterable in the list.
- Explicit sentence-case `label`s: `accentPhrase` "Accent phrase", `studyNumber` "Study number", `engagementLine` "Engagement line", `headlineMetric` "Headline metric", `cardSummary` "Card summary", `inShort` "In short", `heroMedia` "Hero media", `narrative` "Story sections" (sub-groups "01 — The before" / "02 — The strategy" / "03 — The results", each `title` "Heading", `body` "Text"), `resultsTable` "Results table", `resultsTable.columns` "Column headings", `resultsTable.rows` "Results", `resultsTable.method` "How it was measured", `clientVoice` "Client voice", `clientVoice.doDifferently` "What we'd do differently", `clientVoice.phaseMapping` "How this maps to our phases", `clientVoice.link` "Link", `closing` "Closing", `closing.newsletterHeading` "Newsletter heading", `closing.finalCtaHeading` "Final CTA heading", `figuresApproved` "Client approved the figures", `readTime` "Read time", `publishedAt` "Published". Fields without an explicit `label` (Payload derives it from the name): `title`, `client`, `track`, `resultsTable.eyebrow`, the `columns` and `rows` sub-fields (`measure`, `baseline`, `after`, `change`), `featured`, and the `slugField()` fields.

Tab **Summary**:

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | Study headline (H1) |
| `accentPhrase` | text, `validateAccentPhrase('title')` | Optional accent-coloured phrase from the headline |
| `client` | relationship → `clients`, `maxDepth: 1`, required | |
| `track` | select `build` / `growth` / `build-and-growth` / `handover`, required | Decides which service pages pull the study |
| `studyNumber` | number, `min: 1`, step 1 | "Study 01" / "№ 01" |
| `engagementLine` | text | |
| `headlineMetric` | group, `metricFields()` | Oversized result on the study and on cards |
| `cardSummary` | textarea, required, `maxLength: 160` | Cards and the Work ledger |
| `inShort` | textarea, required | "In short" box |
| `heroMedia` | upload → `media`, `maxDepth: 1`, required | Browser-framed visual |

Tab **Story**: `narrative` group with three sub-groups `before`, `strategy`, `results` (labels "01 — The before", "02 — The strategy", "03 — The results"), each `title` (text, required) + `body` (richText, required, `narrativeEditor`).

- `narrativeEditor`: `ParagraphFeature`, `BoldFeature`, `ItalicFeature`, `UnorderedListFeature`, `OrderedListFeature`, `BlockquoteFeature`, `LinkFeature({ enabledCollections: [] })`, `UploadFeature({ enabledCollections: ['media'], maxDepth: 1, collections: { media: { fields: [caption (text)] } } })`, `FixedToolbarFeature`, `InlineToolbarFeature`.

Tab **Results**: `resultsTable` group:

| Field | Type | Notes |
|---|---|---|
| `eyebrow` | text | |
| `columns` | group ("Column headings"): `measure`, `baseline`, `after`, `change` (text) | Table header labels |
| `rows` | array ("Results"; `labels` Result / Results), required, `minRows: 1`, custom `validate`, RowLabel `ResultRowLabel` | Per row: `measure` (text, required), `baseline` (text), `after` (text, required), `change` (text). Reorderable. The `validate` returns `t('validation:requiresAtLeast', { count: 1, label: 'Result' })` when empty, because the built-in array validator in payload@3.91.0 ignores `labels` (words it "1 Rows") |
| `method` | textarea | How the numbers were measured |

Tab **Client voice & closing**:

| Field | Type | Notes |
|---|---|---|
| `clientVoice.testimonial` | relationship → `testimonials`, `maxDepth: 2` | Video plays first; text shows as a quote |
| `clientVoice.doDifferently` | richText (`asideEditor`: paragraph, bold, italic, lists, `LinkFeature({ enabledCollections: [] })`, inline toolbar) | "What we'd do differently" |
| `clientVoice.phaseMapping` | textarea | "How this maps to our phases" |
| `clientVoice.link` | `linkField` (optional) | |
| `closing.newsletterHeading`, `closing.finalCtaHeading` | text | Empty = site-wide defaults |

Outside the tabs:

| Field | Type | Notes |
|---|---|---|
| `slugField()` | `generateSlug` checkbox (hidden, default `true`) + `slug` text (required) | Unique index on `slug`. `slugField` is marked `@experimental` in payload@3.91.0; used because SCHEMA requires it. See slug behaviour below |
| `featured` | checkbox, default `false`, indexed, sidebar | Homepage, Services, Review Hub featured spots |
| `figuresApproved` | checkbox ("Client approved the figures"), default `false`, sidebar, `validate: validateFiguresApproved` | Required to publish (see Publish rule below). Error message "Tick this before publishing."; the longer explanation is in `admin.description` |
| `readTime` | number, `min: 1`, step 1, sidebar | Minutes; empty = filled on publish |
| `publishedAt` | date ("Published"), indexed, sidebar, `admin.date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' }` | Set on first publish; orders Work and "Next study" |

- Slug behaviour:
  - Admin: the slug box opens locked with an Unlock button (Generate / Lock controls of Payload's `SlugField` client component).
  - Because `contentVersions` enables autosave, the `generateSlug` hook stops regenerating the slug from the title once the doc is published (or the slug was edited by hand); the slug is not hard-locked and can still be changed by hand.
  - REST creates without `slug` fail with "Slug required" (observed in the C7 rework; `slugField` only fills the slug in the admin UI in practice). REST callers creating case studies must pass `slug` and `generateSlug: false`. (`posts`, C8, generates slugs server-side; see [C8 Slugs](#posts-unit-c8).)

- `defaultPopulate` (card fields only, used when another doc populates a case study): `title`, `slug`, `client`, `track`, `headlineMetric`, `cardSummary`, `heroMedia`, `publishedAt`.
- Access:

| Who | read | readVersions | create | update | delete |
|---|---|---|---|---|---|
| admin | all | yes | yes | yes | any |
| marketing | all | yes | yes | yes | only where `_status` ≠ `published` |
| pipeline, public | published only (`publishedOrStaff`) | no | no | no | no |

S1: the delete rule is now the shared `adminOrMarketingUnpublished` helper (see [Shared helpers](#shared-helpers-for-content-collections-c3c6)); behaviour is unchanged.

- Publish rule (`figuresApproved`), two layers:
  1. `validateFiguresApproved` (field `validate` on `figuresApproved`): runs the built-in `checkbox()` validator from `payload/shared` first; `true` passes; on a server save (`event: 'submit'`) it returns "Tick this before publishing." only when the merged `data._status` is `published`. Being a field validator, it is reported together with every other field error in one attempt. Draft saves skip validation (`drafts.validate: false`); a non-draft update of a draft and a version restore that publishes are validated. In admin form state (`event: 'onChange'`, only after a submit attempt) it ignores `_status`, like the built-in `required` errors it is shown with.
  2. `blockUnapprovedPublish` (FIRST `afterChange` hook, before revalidation): backstop for any publish path that skips field validation (none known in 3.91.0). If `doc._status` is `published` and `figuresApproved` is not `true`, throws `ValidationError` on path `figuresApproved`. It runs inside the operation's transaction (update, create, restoreVersion), so the throw rolls the publish back. Must stay first in `afterChange`.
- Hooks:
  - `beforeChange`: `[setPublishedAtOnPublish, fillReadTime]`.
    1. `setPublishedAtOnPublish` (above).
    2. `fillReadTime`: on publish only, when `readTime` is empty (not a positive number), sets it from `readTimeMinutes` over the word count of `narrative.before/strategy/results.body`. A set value is kept; clear the field to recalculate on the next publish. 0 words leaves it empty.
  - `afterChange`: `[blockUnapprovedPublish, revalidate.afterChange]`.
  - `afterDelete`: `[revalidate.afterDelete]`.
- Convention (PROGRESS.md Decision log, 2026-10-17): publish rules are field `validate` functions plus an `afterChange` backstop; collection `beforeChange` hooks never throw validation errors (collection `beforeChange` runs before field validation in payload@3.91.0, so a throw there hides every other publish error). Applies to posts, pages, lead-magnets.

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs, CaseStudies]`.
- Pages using it (per PM dispatch / `SCHEMA.md` §5): template for p2 (`/work/<slug>`); surfaces on p3 (Work hub); pulls on p1, p4, p5, p6, p8, p13, p14, p15, p17, p19. Also the target of `testimonials.caseStudy` and `linkField` internal links. Linked from block entries as they land.
- Revalidation: `revalidateTagHooks('case-studies', { paths: (doc) => ['/work', doc.slug ? `/work/${doc.slug}` : null] })`.
  - `afterChange`, when the doc is published or was published: `revalidateTag('case-studies', 'max')`, then `revalidatePath` for the de-duplicated paths of both `doc` and `previousDoc` (a slug change purges the old and new URL).
  - `afterDelete`: tag + the deleted doc's paths.
  - `context.disableRevalidate` skips both. `revalidatePath` uses the same guard as `revalidateTag` (outside a Next request it is logged at debug and swallowed; other errors logged and swallowed).
  - Proven in a real Next request on 2026-10-17 (PM): dev log showed the tag, `/work` and the old/new slug paths on publish, slug change and delete.
  - Blocks and pages that query case studies must use the `case-studies` tag in their queries for the tag purge to reach them.
- Migration: `20261017_210942_c7_case_studies`. Additive only.
  - Up: creates enums `enum_case_studies_track`, `enum_case_studies_client_voice_link_type`, `enum_case_studies_status` and the three `_v` equivalents; tables `case_studies`, `case_studies_results_table_rows`, `case_studies_rels` (polymorphic `linkField.reference`), `_case_studies_v`, `_case_studies_v_version_results_table_rows`, `_case_studies_v_rels`; FKs `client_id` → `clients`, `hero_media_id` → `media`, `client_voice_testimonial_id` → `testimonials` (all ON DELETE set null), rows/rels parent FKs ON DELETE cascade; unique `case_studies_slug_idx`, indexes on `featured`, `published_at`, `_status` and the relationship columns. Adds `testimonials.case_study_id`, `_testimonials_v.version_case_study_id` (FKs set null) and `payload_locked_documents_rels.case_studies_id` (FK cascade), each indexed.
  - Down: hand-fixed to drop the `testimonials`, `_testimonials_v` and `payload_locked_documents_rels` FKs on `case_studies` before the `DROP TABLE … CASCADE` statements, then drops the added indexes, columns and enums.
  - The generated FK name `_case_studies_v_version_client_voice_testimonial_id_testimonials_id_fk` exceeds Postgres's 63-character identifier limit and is truncated by Postgres; any command naming it is truncated identically, so it has no effect.

**Notes**
- Launch state: all case studies are drafts at launch; every surface derives its fallback from an empty published set. There is no "live" toggle field.
- Deferred:
  - `linkField` targets: `posts` (C8), `lead-magnets` (C9) and `pages` (C10) are present (done in [C10](#pages-unit-c10); additive `pages_id` columns on the `_rels` tables).
  - Rich-text internal links in `narrativeEditor` / `asideEditor`: done in C10 (`richTextLinkFeature()`).
  - SEO `meta` tab (plugin-seo unit, `collections: ['case-studies']`).
  - Live preview URL and draft mode for `/work/<slug>` (when the route lands).
- Reading progress on p2 is a template behaviour of `/work/<slug>`, not a field (R10).
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. See [Error handling](#error-handling-unit-s3).

#### `posts` (unit C8)

One collection for three tracks: `dev-seo` (p13) and `mkt-seo` (p14) at `/insights/<slug>`, and `newsletter-issue` (p16 rows) at `/newsletter/<slug>`. It is the only collection the pipeline user can write.

**Files**
- `src/collections/Posts.ts`: the collection, access, hooks, two Lexical editor configs (`bodyEditor`, `shortEditor`), `validateIssueNumber`, `fillReadTime`, revalidation config.
- `src/hooks/uniqueSlug.ts`: `uniqueSlug`, `uniqueSlugHooks(collection)` (`beforeValidate` + `slugFieldOverrides`). Written generically; attached to `posts` only so far.
- `src/access/pipeline.ts`: `forbidPipelinePublish`, `forbidPipelineOnPublished`, `pipelineNeverPublishes` (the first written in C1, all attached here).
- `src/access/index.ts`: `postsRead`, `staffOrPipeline`, `staffOrPipelineDrafts` (written in C1), attached here.
- `src/fields/index.ts`: `LINK_TARGETS` is now `['case-studies', 'posts']` (`linkField` internal references may point at posts). Reuses `contentVersions`, `metricFields`, `linkField`, `pricingNote`, `validateAccentPhrase`.
- Reused hooks/libs: `src/hooks/publishedAt.ts`, `src/hooks/revalidateTag.ts`, `src/lib/lexicalText.ts`.
- `src/payload.config.ts`: `Posts` registered. `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` regenerated.
- `src/migrations/20261017_215325_c8_posts.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`); labels "Post" / "Posts"; `useAsTitle: 'title'`; `defaultColumns`: `title`, `track`, `_status`, `publishedAt`, `updatedAt`.

- `defaultSort: ['-_status', '-publishedAt']` (same reasoning as [C7](#case-studies-unit-c7): no nulls-last in `@payloadcms/drizzle@3.91.0`).
- `defaultPopulate`: `title`, `slug`, `track`, `dek`, `publishedAt`, `issueNumber`.
- Track-specific fields are hidden with `admin.condition` on `track` (a hidden field is not validated).
  - `isArticle` = `dev-seo` or `mkt-seo`; `isDevSeo`; `isIssue` = `newsletter-issue`.

Tab **Article** (always shown):

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | H1 |
| `issueNumber` | number, `min: 1`, `validate: validateIssueNumber` | Issue track only; required when `track` = `newsletter-issue` (message "Required for newsletter issues."), ignored otherwise |
| `sentAt` | date (day only) | Issue track only |
| `issueMetric` | text | Issue track only; number on the issue row |
| `eyebrow` | text | |
| `dek` | textarea ("Standfirst"), required, `maxLength: 300` | Also the excerpt on newsletter cards |
| `heroImage` | upload → `media`, `maxDepth: 1` | Staff-only write |
| `body` | richText, required, `bodyEditor` | |
| `pricingNote` | `pricingNote()` factory | Inline price note only (R13) |

- `bodyEditor`: paragraph, `HeadingFeature` (h2, h3 only), bold, italic, lists, blockquote, `LinkFeature({ enabledCollections: [] })`, `UploadFeature` (media only, `maxDepth: 1`, extra `caption` text field), fixed + inline toolbar.
- `shortEditor`: paragraph, bold, italic, lists, `LinkFeature({ enabledCollections: [] })`, inline toolbar.

Tab **Sections** (articles only; tab `admin.condition: isArticle`):

| Field | Type | Notes |
|---|---|---|
| `diyBridge` | group: `eyebrow`, `heading` (text), `accentPhrase` (`validateAccentPhrase('heading')`), `body` (richText, `shortEditor`), `facts` (array, `maxRows: 3`, `metricFields()`) | Facts are never prices |
| `howWeDoIt` | group: `eyebrow` (text), `body` (textarea), `link` (`linkField`, optional) | |
| `educational` | group: `eyebrow`, `heading` (text), `body` (richText, `shortEditor`) | `dev-seo` only |
| `proof` | group, staff-only write | See below |

`proof` (article tracks): `source` select `featured` / `track` / `manual` (default `track`); `caseStudies` relationship → `case-studies`, `hasMany`, `maxDepth: 1` (shown when `source` = `manual`); `fallbackMode` select `testimonials` / `metricStrip` (empty = track default: dev-seo testimonials, mkt-seo metric strip, per field description); `fallbackTestimonials` relationship → `testimonials`, `hasMany`, `maxDepth: 2` (hidden when mode is `metricStrip`); `fallbackMetrics` array of `metricFields()` (hidden when mode is `testimonials`); `fallbackNote` textarea.

Tab **FAQ** (articles only): `faqHeading` (text); `faq` array "Questions" (`maxRows: 8`), each `question` (text, required) + `answer` (richText, required, `shortEditor`). Inline array (SCHEMA X11); feeds FAQPage JSON-LD and the AccordionFAQ component (not built yet).

Tab **Closing**: `closing` group: `newsletterHeading`, `finalCtaHeading` (text). Empty = site-wide defaults.

Outside the tabs:

| Field | Type | Notes |
|---|---|---|
| `slug` (+ hidden `generateSlug`) | `slugField({ overrides: slug.slugFieldOverrides })` | Unique index; see Slugs below |
| `track` | select `dev-seo` / `mkt-seo` / `newsletter-issue`, required, indexed, sidebar | |
| `targetKeyword` | text, sidebar | |
| `author` | relationship → `team-members`, `maxDepth: 1`, sidebar | Staff-only write |
| `readTime` | number, `min: 1`, sidebar | Empty = filled on publish from the body word count (`fillReadTime`) |
| `publishedAt` | date, indexed, sidebar | Staff-only write; set on first publish by `setPublishedAtOnPublish` |
| `updatedAtDisplay` | date ("Updated (shown)"), sidebar | Staff-only write |

Pipeline-dropped fields (field access create/update = `staffOnlyField`; values sent by the pipeline are silently dropped): `author`, `heroImage`, `publishedAt`, `updatedAtDisplay`, `proof`.

Access:

| Who | read | readVersions | create | update | delete |
|---|---|---|---|---|---|
| admin | all | yes | yes | yes | any |
| marketing | all | yes | yes | yes | only where `_status` ≠ `published` (`adminOrMarketingUnpublished`, S1) |
| pipeline | `_status = draft` only | no | yes (forced draft) | drafts only, and never a post whose live row is published | no |
| public | published only | no | no | no | no |

**Pipeline guards** (in order; auth header `Authorization: users API-Key <key>`; the pipeline should always send `?draft=true`, otherwise Payload validates the save as complete — required fields — though it is still stored as a draft):
1. Access: `postsRead` / `staffOrPipelineDrafts` restrict the pipeline to `_status = draft`.
2. `beforeChange` `forbidPipelinePublish`: any non-draft `_status` from the pipeline throws `Forbidden` (403); otherwise `_status` is forced to `draft`.
3. `beforeChange` `forbidPipelineOnPublished`: on update by the pipeline, the main row is read directly (`payload.db.findOne`, no hooks, same transaction); if it is published, or the id is unknown, 403. Reason: in payload@3.91.0 `updateByID` looks the doc up through `getLatestCollectionVersion`, which applies the access query to the LATEST VERSION. A published post with a newer staff draft on top would match `_status = draft`, and a pipeline save would overwrite the main row with `draft`, unpublishing the live post. A post staff have unpublished is a draft again and is editable.
4. `afterChange` `pipelineNeverPublishes` (first in the list): throws `Forbidden` inside the transaction if a pipeline write ends up `published` (rollback backstop; no known 3.91.0 path reaches it).
5. No delete, no `readVersions` for the pipeline.

**Slugs**
- Root cause: `slugField()` generates the slug in a field `beforeChange` hook on the hidden `generateSlug` checkbox. Sibling fields are processed in parallel and the generator awaits before writing `data.slug`, so on a validated save the `required` check reads the slug while it is still empty ("Slug required"). It also never de-duplicates and, on autosave collections, re-derives the slug from the title on later saves of an unpublished doc.
- `uniqueSlugHooks('posts')`:
  - `beforeValidate`: when the resulting slug is empty and a title exists, fills `slugify(title)`; on collision tries `-2`, `-3` … up to `-50`, then appends an 8-character UUID fragment. Uniqueness is checked with `payload.count` against the main table (`overrideAccess: true`, same transaction), excluding the doc itself on update.
  - `slugFieldOverrides`: wraps the `generateSlug` field's `beforeChange` hook. After Payload's generator runs on update, a slug it re-derived from the title is made unique, and a partial update without `title` cannot wipe an existing slug.
  - An explicit slug is not renamed; it is normalised by the field and a collision returns 400 (unique index).
- Known limits: a duplicate of a duplicate collides; two concurrent creates with the same title can race (the loser gets the unique-index error and can retry).

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs, CaseStudies, Posts]`.
- Hooks: `beforeValidate: [slug.beforeValidate]`; `beforeChange: [forbidPipelinePublish, forbidPipelineOnPublished, setPublishedAtOnPublish, fillReadTime]`; `afterChange: [pipelineNeverPublishes, revalidate.afterChange]`; `afterDelete: [revalidate.afterDelete]`. Publish-rule convention from C7 applies (hooks after the first do not throw validation errors); `validateIssueNumber` is a field validator.
- Pages using it: p13 (`dev-seo`), p14 (`mkt-seo`) at `/insights/<slug>`; p16 (`newsletter-issue` rows, PostList) and `/newsletter/<slug>` issue pages. Routes and blocks are not built yet.
- Revalidation: `revalidateTagHooks('posts', { paths })`. Tag `posts`, plus `/insights/<slug>` for article tracks or `/newsletter` and `/newsletter/<slug>` for issues, for both `doc` and `previousDoc` (a slug or track change purges the old URL). Behaviour of the hook is as in C7. Proven live 2026-10-17 (create, track change, delete). Queries that render posts must use the `posts` tag.
- Migration: `20261017_215325_c8_posts`. Additive.
  - Up: enums `enum_posts_*` and `enum__posts_v_version_*` (track, status, `how_we_do_it_link_type`, `proof_source`, `proof_fallback_mode`); tables `posts`, `posts_diy_bridge_facts`, `posts_proof_fallback_metrics`, `posts_faq`, `posts_rels`, and the `_posts_v*` equivalents; FKs `hero_image_id` → `media` and `author_id` → `team_members` (set null), rels FKs to `case-studies`, `posts`, `testimonials` (cascade); adds `posts_id` to `case_studies_rels`, `_case_studies_v_rels` (new `linkField` target) and `payload_locked_documents_rels`.
  - Down: hand-fixed (drops the added FKs and columns on the other tables before dropping the posts tables).

**Notes**
- SEO `meta` tab is deferred (plugin-seo with `collections: ['posts']`, editable by staff and pipeline).
- Deferred: live preview and draft mode with the `/insights/<slug>` and `/newsletter/<slug>` routes; rich-text internal links in `bodyEditor`/`shortEditor` and `linkField` target `pages`: done in [C10](#pages-unit-c10) (`lead-magnets` added in [C9](#lead-magnets-unit-c9)).
- `/work/<slug>` is not purged when a post linked from a case study changes (open; not addressed in C10).
- Reading progress (p11/p13/p14) is a template behaviour, not a field (R10). The FAQ renders through the AccordionFAQ component when it exists.
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. See [Error handling](#error-handling-unit-s3).

#### `lead-magnets` (unit C9)

The p18 Lead Magnet template, route `/resources/<slug>`. Rendered from fixed fields (no layout builder). Section order is bound to the asset: capture state → what's inside → delivered state + newsletter cross-sell. Legal-only footer and logo-only header are template behaviour.

**Files**
- `src/collections/LeadMagnets.ts`: collection, access, hooks, validators (`validateBullets`, `validateAssetFile`, `validateAssetUrl`), revalidation config.
- `src/lib/leadMagnetAsset.ts`: pure asset rule (`assetFileError`, `assetUrlError`, message constants). No imports; shared by the server validators and the admin client components.
- `src/components/admin/LeadMagnetAssetFields.tsx` (client): `LeadMagnetAssetFileField`, `LeadMagnetAssetUrlField`.
- `src/components/admin/ValueBulletRowLabel.tsx` (client): array `RowLabel` using `useRowLabel`; shows the bullet text truncated to 60 characters, fallback `Bullet NN`.
- `src/fields/index.ts`: `LINK_TARGETS` is now `['case-studies', 'posts', 'lead-magnets']`.
- `src/payload.config.ts`: `LeadMagnets` registered. `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` regenerated.
- `src/migrations/20261017_221725_c9_lead_magnets.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`; required means required to publish). Labels "Lead magnet" / "Lead magnets"; `useAsTitle: 'title'`; `defaultColumns`: `title`, `slug`, `_status`, `publishedAt`, `updatedAt`.
- `defaultSort: ['-_status', '-publishedAt']` (same reasoning as [C7](#case-studies-unit-c7)).
- `defaultPopulate: { title: true, slug: true }`, so link targets never populate the asset or the delivery email.

Tab **Capture**:

| Field | Type | Notes |
|---|---|---|
| `eyebrow` | text | Default `Free download` |
| `title` | text, required | H1 |
| `accentPhrase` | text, `validateAccentPhrase('title')`, `accentPhraseAdminField('title')` | Optional |
| `pitch` | textarea, required | |
| `formNote` | text | Small line under the form |

Tab **What's inside** (S1 adds `whatsInsideHeading`: text, label "Heading", `defaultValue: "What's inside"`, shown above the bullets): `valueBullets` array "Bullets", required, `minRows: 3`, `maxRows: 6`, each row `text` (text, required). Custom `validate: validateBullets` replaces the built-in array check so the message names bullets ("requires at least 3 bullets" via `validation:requiresAtLeast` / `requiresNoMoreThan`); accepts the value as an array or a row count. `RowLabel`: `ValueBulletRowLabel`.

Tab **Asset & email**:

| Field | Type | Notes |
|---|---|---|
| `asset.file` | upload → `downloads`, `maxDepth: 1`, `validate: validateAssetFile` | Admin `Field`: `LeadMagnetAssetFileField` |
| `asset.externalUrl` | text ("Or a link"), `validate: validateAssetUrl` | Admin `Field`: `LeadMagnetAssetUrlField` |
| `deliveryEmail.subject` | text, required | |
| `deliveryEmail.intro` | textarea, required | |

Tab **Delivered state** (`deliveredState` group): `eyebrow` (default `Sent`), `heading` (required), `accentPhrase` (`validateAccentPhrase('heading')`), `body` (textarea), `crossSellLine` (text, "Newsletter cross-sell line").

Outside the tabs: `slug` (+ hidden `generateSlug`) via `slugField({ overrides: slug.slugFieldOverrides })`; `publishedAt` (date, indexed, sidebar, day only, "Set automatically on first publish").

Asset rule (exactly one of file or URL), in `leadMagnetAsset.ts`:
- `assetFileError`: error `ASSET_MISSING_MESSAGE` if the file is empty and `externalUrl` is empty.
- `assetUrlError`: error `ASSET_URL_FORMAT_MESSAGE` if the value is not a parseable `https:` URL; `ASSET_BOTH_MESSAGE` if `file` is also set. Empty URL passes.
- Server validators call the built-in `upload` (async) / `text` validator from `payload/shared` first, then the rule.
- Client wrappers pass the same functions as the `validate` prop of `UploadField` / `TextField` from `@payloadcms/ui`. Reason: Payload strips custom validators from the client config, so a server-only error on a custom-validated field can be lost when autosave merges form state. Errors display only after a submit attempt, not while drafting.

Access: `staffContentAccessDraftDelete` (SCHEMA §4.3 + Delta 2026-10-18; was `staffContentAccess` in C9). Public and pipeline read published documents only; only staff write; versions are staff-only; delete: admin any, marketing only where `_status` ≠ `published`.

Field-level read (S1): `asset` and `deliveryEmail` groups have `access.read: staffOnlyField` (const `staffReadOnly` in `LeadMagnets.ts`). Public and pipeline responses omit both groups. `src/payload-types.ts` still types them as present, so the frontend must treat them as absent. The future `lead_magnet` job must read the document with `overrideAccess: true` (the Local API default) or these groups come back empty.

Slug: `uniqueSlugHooks('lead-magnets')` (`beforeValidate` fills from title, `-2`, `-3` … on collision; see [C8 Slugs](#posts-unit-c8)). `publishedAt`: `setPublishedAtOnPublish`, never overwrites an entered date.

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs, CaseStudies, Posts, LeadMagnets]`.
- Hooks: `beforeValidate: [slug.beforeValidate]`; `beforeChange: [setPublishedAtOnPublish]`; `afterChange: [revalidate.afterChange]`; `afterDelete: [revalidate.afterDelete]`.
- Pages using it: p18 at `/resources/<slug>`. The route and blocks are not built yet.
- Revalidation: `revalidateTagHooks('lead-magnets', { paths })`. Tag `lead-magnets` plus `/resources/<slug>` for `doc` and `previousDoc` (a slug change purges the old URL). Proven live 2026-10-17. Any block or route that reads a linked lead magnet's title or slug must fetch with the `lead-magnets` tag.
- Migration: `20261017_221725_c9_lead_magnets`. Additive.
  - Up: enums `enum_lead_magnets_status`, `enum__lead_magnets_v_version_status`; tables `lead_magnets`, `lead_magnets_value_bullets`, `_lead_magnets_v`, `_lead_magnets_v_version_value_bullets`; FKs `asset_file_id` / `version_asset_file_id` → `downloads` (set null), parent FKs cascade/set null; unique `lead_magnets_slug_idx`; adds `lead_magnets_id` (FK cascade, indexed) to `case_studies_rels`, `_case_studies_v_rels`, `posts_rels`, `_posts_v_rels` (new `linkField` target) and `payload_locked_documents_rels`.
  - Down: hand-fixed to drop the FKs held on `lead_magnets` by those five tables before the `DROP TABLE … CASCADE` statements, then drops the added indexes, columns and enums.

**Notes**
- Frontend rule (SCHEMA §5.2): public queries use `draft: false`. With `draft: true`, a published document with a newer staff draft returns 404 to the public.
- Noindex is template behaviour (SCHEMA §6.8; gated template), so there is no `noindex` field.
- P1 (commit e370604): `form` relationship added in tab Capture, label "Capture form", → `forms`, `maxDepth: 1`, `required: true` (required to publish; drafts skip validation). Forms are staff-read, so a public read gets the id only; the frontend loads the form server-side. Migration `20261021_233028_p1_form_builder` adds `lead_magnets.form_id` and `_lead_magnets_v.version_form_id` (FKs → `forms`, ON DELETE set null, indexed). Reverse link: `form-submissions.leadMagnet`. See [P1](#form-builder-unit-p1).
- Deferred:
  - SEO `meta` tab (P3, `collections: ['lead-magnets']`).
  - Live preview and draft mode with the `/resources/<slug>` route.
- Resolved by S1 (mini Gate S, committed 6bbf0f8):
  - The asset link and delivery email text are no longer exposed to the public API (field-level read, above). Files in `downloads` are also staff-only to fetch (see [C2](#media--downloads-unit-c2)).
  - The "What's inside" heading is now the `whatsInsideHeading` field.
- S1 migration: `20261018_053136_s1_lead_magnet_heading` (+ `.json`), registered in `src/migrations/index.ts`. Additive.
  - Up: `lead_magnets.whats_inside_heading` and `_lead_magnets_v.version_whats_inside_heading`, both nullable `varchar DEFAULT 'What''s inside'`.
  - Down: drops both columns. The `downloads` read change needed no migration.

**S3 pointer**
- `beforeDelete: [blockDeleteIfReferenced({ counted: { 'form-submissions': leadMagnetSubmissionsSentence } })]`: blocked while form submissions requested the lead magnet; autosave off. See [Error handling](#error-handling-unit-s3).

#### `pages` (unit C10)

The single-document pages (all 21 page types except the templates p2, p13, p14, p18, which are their own collections): p1 `home`, p3 `work`, p4 `services`, p5 `services/shopify-theme-development`, p6 `services/marketing`, p7 `testimonials`, p8 `about`, p9 `book-a-call`, p10 `thank-you`, p11 `faq`, p12 `contact`, p15 `lp/<campaign>`, p16 `newsletter`, p17 `links`, p19 `reviews`, p20 `privacy`/`terms`/`cookies`/`gdpr`, p21 `404`. Shell only: `layout` has no blocks registered yet.

**Files**
- `src/collections/Pages.ts`: collection, access, hooks, slug and layout validators, `NEWSLETTER_BAND_BLOCK_SLUG`.
- `src/lib/pagePath.ts`: URL rules shared by the collection and the future router (`HOME_SLUG`, `NOT_FOUND_SLUG`, `TEMPLATE_PREFIXES`, `slugifyPath`, `pageSlugError`, `pagePath`).
- `src/fields/index.ts`: `LINK_TARGETS` is now `['pages', 'case-studies', 'posts', 'lead-magnets']`; new `richTextLinkFeature()` = `LinkFeature({ enabledCollections: [...LINK_TARGETS], maxDepth: 1 })`.
- `src/collections/Faqs.ts` (answer editor), `src/collections/CaseStudies.ts` (`narrativeEditor`, `asideEditor`), `src/collections/Posts.ts` (`bodyEditor`, `shortEditor`): now include `richTextLinkFeature()`.
- `src/payload.config.ts` (registered), `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` (regenerated).
- `src/migrations/20261017_223525_c10_pages.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Drafts on (`contentVersions`). Labels "Page" / "Pages"; `useAsTitle: 'title'`; `defaultColumns`: `title`, `slug`, `footerVariant`, `_status`, `updatedAt`; `defaultPopulate: { title: true, slug: true }`.

| Field | Type | Notes |
|---|---|---|
| `title` | text, required | Admin title and default tab title |
| `layout` | blocks, required, `minRows: 1`, label "Sections", `blocks: []`, `validate: validateLayout` | Hero is the first block (X2). Empty block list is valid in payload@3.91.0 (typed `unknown[]`) |
| `slug` | `slugField({ slugify: slugifyPath, overrides })` | See slug rules. Hidden `generateSlug` from `slugField` |
| `headerVariant` | select `standard` / `logo-only` / `none`, required, default `standard`, sidebar | Logo-only: p15 (and p18 template); none: p17 |
| `footerVariant` | select `standard` / `reduced-nav` / `legal-only`, required, default `standard`, sidebar | Reduced-nav: p9, p10; legal-only: p15, p17 |
| `zeroLeakage` | checkbox, default `false`, sidebar | p15 |
| `readingProgress` | checkbox, default `false`, sidebar | p8, p11 (R10, X6: flag, not a block) |
| `noindex` | checkbox, default `false`, sidebar | p10, p15, p17, p21 |
| `publishedAt` | date, indexed, sidebar, day only | Set automatically on first publish (`setPublishedAtOnPublish`) |

Slug rules (`uniqueSlugHooks('pages')` for server-side unique fill from title; plus `normaliseSlug` field `beforeValidate` and `validateSlug`, which runs the built-in `text()` first, then `pageSlugError`):
- The slug is the path without the leading `/`. Each `/`-separated segment is slugified; empty segments are dropped. Pattern: lowercase letters, digits, `-`, `_`, with `/` between segments.
- `home` renders at `/`. `404` is the reserved not-found document and has no path of its own (`pagePath` returns `null`). Neither can have sub-pages (`home/…`, `404/…` rejected).
- Reserved first segments: `admin`, `api`. Any segment starting with `_` is rejected.
- `work`, `insights`, `newsletter`, `resources` as a first segment with sub-paths are rejected (they belong to case studies, posts, lead magnets); the bare hubs `work` and `newsletter` are allowed.
- Slug-rule errors surface as a toast only: the `slugField` `SlugField` component has no client-side `validate`.

Zero leakage:
- `enforceZeroLeakage` (collection `beforeValidate`, runs on every save, draft or publish): when `zeroLeakage` is true (from `data`, else `originalDoc`), forces `headerVariant: 'logo-only'` and `footerVariant: 'legal-only'`.
- `validateLayout`: runs the built-in `blocks()` check, then returns a field error on `layout` if `zeroLeakage` is true and any block has `blockType === 'newsletterBand'`.
- `blockLeakyPublish` (first `afterChange` hook): backstop on publish with `zeroLeakage`; throws `ValidationError` (rolls back the publish) if `layout` has a NewsletterBand or the header/footer variant is not logo-only/legal-only.
- The NewsletterBand block's slug must be exactly `newsletterBand` (`NEWSLETTER_BAND_BLOCK_SLUG` in `Pages.ts`), or the unit must update the constant.

Access: `staffContentAccessDraftDelete` (SCHEMA §4.3 + Delta 2026-10-18; S1 changed it from `staffContentAccess`). Public and the pipeline user read published documents only; only staff write; versions staff-only; delete: admin any, marketing only where `_status` ≠ `published`.

**Wiring**
- Registration: `src/payload.config.ts` → `collections: [Users, Pages, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs, CaseStudies, Posts, LeadMagnets]`.
- Hooks: `beforeValidate: [slug.beforeValidate, enforceZeroLeakage]`; `beforeChange: [setPublishedAtOnPublish]`; `afterChange: [blockLeakyPublish, revalidate.afterChange]`; `afterDelete: [revalidate.afterDelete]`.
- Layout: `pageLayoutField(pageBlocks)` is attached once `pageBlocks` is non-empty (nine blocks since B3); `layout` is required (min 1) to publish, drafts save without it.
- Pages using it: all single-document pages listed above. Routing, metadata, preview, redirects, sitemap and robots: [Page router (B2)](#page-router-unit-b2).
- Revalidation: `revalidateTagHooks('pages', { paths: (doc) => [pagePath(doc?.slug)] })`. Tag `pages` plus the page path for `doc` and `previousDoc` (old and new slug); `home` → `/`; `404` → tag only. Live proof is deferred until a page can publish (first block registered). Anything that reads pages must fetch with the `pages` tag.
- `richTextLinkFeature()` on FAQ answers, case-study editors and post editors: internal links to `pages`, `case-studies`, `posts`, `lead-magnets` (`maxDepth: 1`), plus external URLs. Population runs through the reader's access, so an internal link to a draft stays an unpopulated ID for the public.
- Migration: `20261017_223525_c10_pages`. Additive.
  - Up: enums `enum_pages_header_variant`, `enum_pages_footer_variant`, `enum_pages_status` and the three `enum__pages_v_version_*`; tables `pages`, `_pages_v` (parent FK ON DELETE set null); adds `pages_id` (FK cascade) to `case_studies_rels`, `_case_studies_v_rels`, `posts_rels`, `_posts_v_rels` (new `linkField` target) and `payload_locked_documents_rels`.
  - Down: hand-fixed (drops those FKs/columns before dropping the pages tables).

**Notes**
- P3 (see [`seo` (P3)](#seo-unit-p3)): `title` now sits inside an unnamed "Content" tab (the first top-level field is a `tabs` field so plugin-seo can append its SEO tab). Admin layout only; no schema or column change. The future `layout` field (`pageLayoutField(...)`, `TODO(blocks)` in `Pages.ts`) goes inside that Content tab. The sidebar fields and `slug` stay top-level. The `meta` group is added by P3 (migration `20261022_001520_p3_seo`).
- Live preview and draft mode: done in B2 for `pages` only (`admin.preview`, `admin.livePreview`); see [Page router (B2)](#page-router-unit-b2).
- S3: `beforeDelete: [blockDeleteIfReferenced()]`; autosave off. Blocks paths on other collections (e.g. a future `layout` block holding a relationship to `pages`) are scanned, not queried. See [Error handling](#error-handling-unit-s3).
- Router checklist (for the router unit):
  - Done in B2: `[...slug]` route; `/home` redirects (308) to `/`; live preview and draft mode for `pages`.
  - Still open: `not-found.tsx` reading the `404` doc; live preview and draft mode for `posts`, `case-studies`, `lead-magnets`.
- Frontend rule (SCHEMA §5.2): public queries use `draft: false`.

### Globals

#### `site-settings` (unit G1)

Site-wide facts shared by every page: footer legal line and brand line, contact email, socials, location, booking link, GBP link and aggregate rating, newsletter/final-CTA defaults, postal address for newsletter footers (SCHEMA §7.1, §4.3, §10).

**Files**
- `src/globals/SiteSettings.ts`: global config.
- `src/hooks/revalidateTag.ts`: new `revalidateGlobalHook(tag)` (`GlobalAfterChangeHook`); `safeRevalidatePath` gained an optional third argument `type?: 'layout' | 'page'`.
- `src/components/admin/SocialRowLabel.tsx`: client component, row label for the `socials` array (`<Platform> — <handle>`, falls back to the URL, then `Social link NN`). Also used by `team-members` socials (those rows have no `handle`).
- `src/payload.config.ts`: `globals: [SiteSettings]`.
- `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js`: regenerated.
- `src/migrations/20261021_222539_g1_site_settings.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Slug `site-settings`, label "Site settings". No drafts, no versions: a save is live immediately. Admin layout is five tabs.

Brand & contact:

| Field | Type | Notes |
|---|---|---|
| `legalName` | text, required | Copyright line in every footer |
| `footerTagline` | text, `maxLength` 120 | Brand line under the logo in the standard footer |
| `contactEmail` | email, required | Contact page |
| `responseTimeNote` | text, `maxLength` 60 | Optional |
| `socials` | array | Row label `SocialRowLabel` |
| `socials.platform` | select, required | `linkedin`, `instagram`, `youtube`, `x`, `facebook`, `github` |
| `socials.handle` | text, required | `beforeValidate` adds a leading `@` and trims; validate: built-in `text()` then `^@[A-Za-z0-9._-]{1,100}$` |
| `socials.url` | text, required | `validateHttpsUrl` |

Location (group `location`):

| Field | Type | Default |
|---|---|---|
| `locality` | text, required | `Lombard` |
| `region` | text, required | `IL` |
| `country` | text | `US` |
| `displayLine` | text | `Lombard, IL` |
| `marketArea` | text | `Chicago` |
| `serviceRadiusMiles` | number, 0 to 500 | `30` |
| `latitude` | number, -90 to 90 | none |
| `longitude` | number, -180 to 180 | none |

Booking:

| Field | Type | Notes |
|---|---|---|
| `bookingUrl` | text | `validateHttpsUrl`; empty means the BookingEmbed fallback state |
| `bookingMode` | select, required | `link-out` (default) / `embed` |

Reviews:

| Field | Type | Notes |
|---|---|---|
| `gbpUrl` | text | `validateHttpsUrl` |
| `aggregateRating.show` | checkbox | default `false` |
| `aggregateRating.ratingValue` | number, 1 to 5 | Shown only when `show`; required when `show` is true |
| `aggregateRating.reviewCount` | number, min 0 | Same condition and rule |
| `aggregateRating.asOf` | date (day only) | Same condition and rule |
| `aggregateRating.sourceUrl` | text | Same condition; `validateHttpsUrl`, required when `show` is true |

Each conditional validator calls the built-in validator from `payload/shared` first, then applies the rule.

Newsletter & closers:

| Field | Type | Default |
|---|---|---|
| `templateDefaults.newsletterHeading` | text | `One useful email a month.` |
| `templateDefaults.newsletterLine` | text | `Numbers included. Unsubscribe anytime.` |
| `templateDefaults.finalCtaHeading` | text | none |
| `templateDefaults.finalCtaButton` | `linkField` | none; internal targets are `pages`, `case-studies`, `posts`, `lead-magnets` |
| `postalAddress.line1`, `line2`, `city`, `region`, `postalCode`, `country` | text | none |

Defaults that are facts: location only. Legal name, contact email, socials, GBP link, coordinates, postal address and rating start empty (MERGED §10 R5).

Access:
- `read`: public (`() => true`).
- `update`: `staffOnly`.
- `readVersions`: `staffOnly` (versions are not enabled).

**Wiring**
- Registration: `src/payload.config.ts` → `globals: [SiteSettings]`.
- Revalidation: `afterChange: [revalidateGlobalHook('site-settings')]` calls `revalidateTag('site-settings', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set. Same guard as the collection hooks: outside a Next request the error is logged at debug and swallowed.
- Pages using it: all footers (standard, reduced-nav, legal-only), p9 (BookingEmbed), p12, p17, p7, p19, p2/p13/p14 closers, empty NewsletterBand/FinalCTA headings. The consuming components are not built yet. Anything that reads the global must fetch with the `site-settings` tag.
- Migration: `20261021_222539_g1_site_settings`. Additive.
  - Up: tables `site_settings`, `site_settings_socials`, `site_settings_rels` (internal-link targets of `finalCtaButton`: `pages`, `case_studies`, `posts`, `lead_magnets`; FKs cascade); enums `enum_site_settings_socials_platform`, `enum_site_settings_booking_mode`, `enum_site_settings_template_defaults_final_cta_button_type`.
  - Down: hand-fixed (drops the child tables first, then `site_settings`, then the three enums).

**Notes**
- In payload@3.91.0 a global has no stored row until it is first saved (`findOne` returns an empty-shaped result), and field defaults apply on that first save, not on read. The frontend must treat every field as optional. The seed must save the global, including the required `legalName` and `contactEmail`.
- `aggregateRating` values are returned by the public API even when `show` is false. The frontend must check `show` before rendering or emitting JSON-LD.
- `postalAddress` group has field-level `access.read: staffOnlyField` (F6, S1 delta, commit 986a432): omitted from public and pipeline responses. `src/payload-types.ts` still types it as present, so the frontend must treat it as absent. The newsletter broadcast job reads it server-side with `overrideAccess` (the Local API default).
- P1 (commit e370604): `newsletterForm` added in tab "Newsletter & closers": relationship → `forms`, `maxDepth: 1`, label "Newsletter form"; the one signup form behind every NewsletterBand, the footer nudge and the p16 hero. Forms are staff-read, so the frontend loads it server-side. Migration `20261021_233028_p1_form_builder` adds nullable `site_settings.newsletter_form_id` (FK → `forms`, ON DELETE set null, indexed). See [P1](#form-builder-unit-p1).
- `SocialRowLabel` keeps its own copy of the six platform labels, because a `'use client'` module cannot share constants with the server config.

#### `scarcity` (unit G2)

The one place capacity and scarcity statements are edited (SCHEMA §7.2, §4.3, §10). Blocks hold no numbers; they reference a statement by key.

**Files**
- `src/globals/Scarcity.ts`: global config.
- `src/lib/scarcity.ts`: dependency-free shared module (no server imports), read by the config, the admin row label and future blocks. Exports `SCARCITY_KEYS` (`{ label, value }` list), `ScarcityKey`, `SCARCITY_KEY_LABELS`, `ScarcityCounts`, `SCARCITY_TOKENS`, `unknownScarcityTokens(statistic)`, `fillScarcityTokens(statistic, counts)`, and the validation message constants/builders, including `overCapacityMessage(label, capacity)` (replaces `activeOverCapacityMessage`, S2).
- `src/components/admin/ScarcityRowLabel.tsx`: client component (`useRowLabel`), row label for `statements`: `<Type label> — <statistic>`, falls back to `Statement NN`.
- `src/payload.config.ts`: `globals: [SiteSettings, Scarcity]`.
- `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js`: regenerated.
- `src/migrations/20261021_223802_g2_scarcity.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Slug `scarcity`, label "Capacity & scarcity". No drafts, no versions: a save is live immediately.

| Field | Type | Notes |
|---|---|---|
| `capacity` | number, required, `min` 1 | `defaultValue` 7 (real cap, F7). Whole number. Not capped |
| `activeClients` | number, required, `min` 0 | No default. Whole number; must be ≤ `capacity` (read from `siblingData`) |
| `buildsInProgress` | number, required, `min` 0 | No default. Whole number; must be ≤ `capacity` (F8) |
| `enginesRunning` | number, required, `min` 0 | No default. Whole number; must be ≤ `capacity` (F8) |
| `statements` | array, required, `minRows` 1 | Sortable, `initCollapsed`, row label `ScarcityRowLabel` |
| `statements.key` | select, required | Options from `SCARCITY_KEYS`: `ongoing`, `capacity`, `builds-line`, `engines-line`, `slots-line`, `offer-line`. Unique across rows |
| `statements.label` | text | Optional caption; trimmed |
| `statements.statistic` | text, required | The loud line; trimmed; non-blank; only known tokens |
| `statements.reason` | text, required | The quiet line; trimmed; non-blank |

Counts are laid out in one row of four (25% width each).

Tokens usable in `statistic`: `{active}`, `{capacity}`, `{builds}`, `{engines}`, `{open}` (`capacity - activeClients`, floored at 0, null if either is missing).

Loud/quiet rule (CLAUDE.md content rule 2): `reason` is required and non-blank, so a statement cannot be saved without its reason. Blocks must have no render path that shows a statement or number without its reason.

Validation (field validators, no throwing hooks; each calls the built-in validator from `payload/shared` first, because a custom `validate` replaces the built-in):
- Counts: built-in `number()`, then `Number.isInteger` (`validateCount`). `activeClients`, `buildsInProgress` and `enginesRunning` use `validateCappedCount(label)`: `validateCount`, then value ≤ sibling `capacity`, else `overCapacityMessage(label, capacity)`. `capacity` itself uses `validateCount` only.
- `key`: built-in `select()`, then no other row in `data.statements` may use the same key.
- `statistic`: blank check, built-in `text()`, then `unknownScarcityTokens` must be empty.
- `reason`: blank check, then built-in `text()`.
- `statements`: custom `minRows` message (`validation:requiresAtLeast`, label "Statement"), because the built-in array message ignores `labels`.
- Trimming of `label`, `statistic`, `reason` is a field `beforeValidate` hook.
- No client validate wrappers: the global has no drafts/autosave, and the admin's server-built form state runs the same custom validators, so errors show inline (same as G1).

Access:
- `read`: public (`() => true`).
- `update`: `staffOnly`.
- `readVersions`: `staffOnly` (versions are not enabled).
- The pipeline user is logged in but not staff, so it is denied on update.

**Wiring**
- Registration: `src/payload.config.ts` → `globals: [SiteSettings, Scarcity]`.
- Revalidation: `afterChange: [revalidateGlobalHook('scarcity')]` calls `revalidateTag('scarcity', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set (seed).
- Pages using it (consuming blocks not built yet): p1 ProofStrip scarcity variant (max 2 statements); FinalCTA capacity line on p1 to p8, p13, p14, p19 (p11 uses none); p15 OfferBlock (`offer-line`); p17 LinkStack (`slots-line`). Anything that reads the global must fetch with the `scarcity` tag.
- Migration: `20261021_223802_g2_scarcity`. Additive.
  - Up: enum `enum_scarcity_statements_key`; tables `scarcity` (four `numeric NOT NULL` count columns) and `scarcity_statements` (FK to `scarcity` cascades; `_order` and `_parent_id` indexes).
  - Down: drops `scarcity_statements`, then `scarcity`, then the enum.
- S2 delta migration: `src/migrations/20261022_000002_s2_scarcity_seo_delta.ts`. Up: sets `scarcity.capacity` column default 7 (also covers the `seo-defaults` change, see [G4](#seo-defaults-unit-g4)). Down: drops the default.

**Notes**
- In payload@3.91.0 a global has no stored row until first saved. The frontend must treat every field as optional, render nothing until the global is saved, and fetch with the `scarcity` tag. The seed must save all four counts and at least one statement (the counts and `statements` are required).
- `fillScarcityTokens` returns `null` when a token's count is missing; the component must skip that statement rather than print a half-filled number.
- Deferred: the `scarcityRef()` field factory (SCHEMA §3) ships with the first consuming block and must import `SCARCITY_KEYS` from `src/lib/scarcity.ts`.
- S2 (commit e0e4271, F7/F8 resolved): `capacity` has `defaultValue: 7` (the real cap). As with any global default, it applies on first save, not on read. `buildsInProgress` and `enginesRunning` are now capped by `capacity` the same way as `activeClients`.
- S2 migration `20261022_000002_s2_scarcity_seo_delta` sets the `scarcity.capacity` column default to 7 (see Migration above).

#### `navigation` (unit G3)

Header links and the three footer variants' links (SCHEMA §7.3, §4.3, §10). Which header/footer a page shows is chosen per page by `pages.headerVariant` / `pages.footerVariant` ([C10](#pages-unit-c10)), not here.

**Files**
- `src/globals/Navigation.ts`: global config, `linkArray` helper, `maxRowsValidate`, `validateColumnTitle`.
- `src/components/admin/NavRowLabels.tsx`: client components `NavLinkRowLabel` (link text, else URL, else `Link NN`) and `FooterColumnRowLabel` (column title), both via `useRowLabel`.
- `src/fields/index.ts`: `linkField` `type` select gets `admin.isClearable: false` (shared change, see Notes).
- `src/payload.config.ts`: `globals: [SiteSettings, Scarcity, Navigation]`.
- `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js`: regenerated.
- `src/migrations/20261021_224808_g3_navigation.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Slug `navigation`, label "Navigation". No drafts, no versions: a save is live immediately. `header` and `footer` are named tabs; they store like groups, so the data paths are as below.

| Path | Type | Notes |
|---|---|---|
| `header.links` | array of `{ link }`, `maxRows: 6` | Menu links, left to right. Sortable, `initCollapsed`, row label `NavLinkRowLabel` |
| `header.cta` | `linkField` (optional) | Header button ("Book a Call"). Fully empty = no button; once any of label / URL / reference is filled, label and destination are both required (half-filled is rejected) |
| `footer.standard.columns` | array, `maxRows: 3` | Row label `FooterColumnRowLabel` |
| `footer.standard.columns[].title` | text, required | Trimmed; blank rejected ("Add the column heading, e.g. "Pages".") |
| `footer.standard.columns[].links` | array of `{ link }` | Unlimited rows |
| `footer.standard.newsletterNudge.heading` | text, default `Newsletter` | Trimmed |
| `footer.standard.newsletterNudge.line` | text, default `One useful email a month. Numbers included.` | Trimmed |
| `footer.standard.newsletterNudge.buttonLabel` | text, default `Join` | Trimmed. The three fields share one row (30/50/20 %) |
| `footer.reduced.links` | array of `{ link }` | Reduced-nav footer: p9 Book a Call, p10 Thank You |
| `footer.legalLinks` | array of `{ link }` | Bottom bar of all three footer variants; the legal-only footer (p15, p17, p18) is this bar alone |

- Every array row is `{ link: linkField({ required: true }) }`, so consumers read `links[i].link.*` (`type`, `newTab`, `reference`, `url`, `label`). A row cannot be saved empty or half-filled.
- The newsletter nudge holds copy only. The form it submits is `site-settings.newsletterForm` ([G1](#site-settings-unit-g1), P1).
- The brand-zone text of the standard footer is `site-settings.footerTagline`; "© year legalName" is `site-settings.legalName`. Neither is stored here.
- Max-row messages: the built-in array validator words the limit as "no more than N Rows" and ignores `labels`, so `maxRowsValidate` replaces it with `validation:requiresNoMoreThan` and the noun ("links", "columns"). `maxRows` is kept on the fields, so the admin also stops offering "Add" at the limit.
- No link defaults. A label without a target fails `linkField` validation and the target pages do not exist yet, so all arrays (including column titles) start empty; the seed fills them. The only defaults are the three nudge strings.

Access:
- `read`: public (`() => true`).
- `update`, `readVersions`: `staffOnly`.
- The pipeline user is logged in but not staff, so it is denied on update.

**Wiring**
- Registration: `src/payload.config.ts` → `globals: [SiteSettings, Scarcity, Navigation]`.
- Revalidation: `afterChange: [revalidateGlobalHook('navigation')]` calls `revalidateTag('navigation', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set (seed).
- Pages using it (consuming header/footer components not built yet): header on every page with `headerVariant = standard` (`logo-only`: p15, p18; `none`: p17, which render none of these links); standard footer on all pages except p9, p10, p15, p17, p18; reduced footer p9, p10; legal bar on all footers, alone on p15, p17, p18.
- Integrator note: the chrome fetch should carry the `navigation` tag and also the `pages` and linked-collection tags, so a renamed linked page refreshes the chrome. Moot while the frontend is `force-dynamic`.
- Migration: `20261021_224808_g3_navigation`. Additive.
  - Up: 5 enums (`enum_navigation_header_links_link_type`, `enum_navigation_footer_standard_columns_links_link_type`, `enum_navigation_footer_reduced_links_link_type`, `enum_navigation_footer_legal_links_link_type`, `enum_navigation_header_cta_type`); 7 tables (`navigation_header_links`, `navigation_footer_standard_columns_links`, `navigation_footer_standard_columns`, `navigation_footer_reduced_links`, `navigation_footer_legal_links`, `navigation`, `navigation_rels`).
  - Down: hand-fixed.

**Notes**
- A global has no stored row until its first save (payload@3.91.0). `findGlobal` on an unsaved global returns `{}`; every field is optional to the frontend, and empty zones (no links, no button, no columns) must render without error.
- Skip links whose `reference` is null or an unpopulated ID: a deleted target, or a draft (population runs through the reader's access, so drafts stay unpopulated for anonymous readers). Do not render a link without a resolved target.
- Open flag F10: deleting a page (or other linked document) that is referenced in navigation leaves a dangling relationship row; the next save of this global is blocked by the foreign key until that link is fixed or removed.
- Open flag F9: no default navigation rows (see Fields). Open flag F11: the p17/p18 legal links are a subset of the global's legal links.
- Shared change: `linkField`'s `type` select has `admin.isClearable: false`, because an emptied required `type` blocked saving. Affects every `linkField` use (see [C7](#case-studies-unit-c7)).

#### `seo-defaults` (unit G4)

Site-wide search and social fallbacks, plus Organization / LocalBusiness JSON-LD inputs (SCHEMA §7.4, §4.3, §10). Consumed by P3 (`@payloadcms/plugin-seo`; see its entry under Plugins).

**Files**
- `src/globals/SeoDefaults.ts`: global config, validators, and exports `TITLE_PLACEHOLDER` (`'%s'`), `DEFAULT_DESCRIPTION_MAX` (`155`), `LOCAL_BUSINESS_TYPES` (`['ProfessionalService']`) and `DEFAULT_LOCAL_BUSINESS_TYPE` (`'ProfessionalService'`) for P3.
- `src/payload.config.ts`: `globals: [SiteSettings, Scarcity, Navigation, SeoDefaults]`.
- `src/payload-types.ts`: regenerated.
- `src/migrations/20261021_231646_g4_seo_defaults.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Slug `seo-defaults`, label "SEO defaults". No drafts: a save is live immediately.

| Path | Type | Notes |
|---|---|---|
| `titleTemplate` | text, required | Default `%s — Duha Media`. Trimmed. Must contain exactly one `%s` (zero or more than one rejected; blank rejected) |
| `defaultDescription` | textarea, required | `maxLength` 155 (`DEFAULT_DESCRIPTION_MAX`). Trimmed. Whitespace-only rejected |
| `defaultOgImage` | upload → `media`, required, `maxDepth: 1` | Column is NOT NULL. Custom validator runs the built-in `upload` check, then loads the media doc and rejects it if `sizes.og.url` is absent (image too small to produce the `og` 1200×630 size) |
| `organization.name` | text, default `Duha Media`, `maxLength` 80 | Trimmed |
| `organization.foundingDate` | text, optional | ISO date text: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Trimmed. No default |
| `organization.logo` | upload → `media`, optional, `maxDepth: 1` | |
| `localBusiness.type` | select, optional | Options from `LOCAL_BUSINESS_TYPES`: `ProfessionalService` only. `defaultValue` `DEFAULT_LOCAL_BUSINESS_TYPE` (`ProfessionalService`) (F12/F13) |
| `localBusiness.areaServed` | text, default `Chicago metropolitan area`, `maxLength` 120 | Trimmed |
| `localBusiness.openingHours` | text, optional | schema.org format, e.g. `Mo-Fr 09:00-17:00`; several entries separated by `;`, e.g. `Mo-Fr 09:00-17:00; Sa 10:00-14:00`. Each entry validated (day list/ranges, 24h `HH:MM-HH:MM`). Trimmed. No default |

- Custom validators call the `payload/shared` built-in first, because a custom `validate` replaces the built-in one in payload@3.91.0.
- Not stored here: Organization `url` (server-side `SITE_URL`), `sameAs` (`site-settings.socials`), LocalBusiness address/geo (`site-settings.location`).

Access:
- `read`: public (`() => true`).
- `update`, `readVersions`: `staffOnly`. The pipeline user is denied.

**Wiring**
- Registration: `src/payload.config.ts` → `globals: [SiteSettings, Scarcity, Navigation, SeoDefaults]`.
- Revalidation: `afterChange: [revalidateGlobalHook('seo-defaults')]` calls `revalidateTag('seo-defaults', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set (seed).
- Pages using it: all (fallbacks for any document without its own SEO values). No consumer exists yet.
- P3 consumption (implemented in P3 except the router items):
  - `generateTitle`: replace `%s` in `titleTemplate` with the document title.
  - `generateDescription`: fall back to `defaultDescription`.
  - `generateImage`: `defaultOgImage` → `sizes.og.url`.
  - `generateURL`: built from server-side `SITE_URL`.
  - Organization JSON-LD: `url` from `SITE_URL`, `sameAs` from `site-settings.socials`.
  - LocalBusiness JSON-LD: address/geo from `site-settings.location`; split `openingHours` on `;`.
- Migration: `20261021_231646_g4_seo_defaults`. Additive.
  - Up: enum `enum_seo_defaults_local_business_type` (`ProfessionalService`, `MarketingAgency`); table `seo_defaults` with `default_og_image_id` integer NOT NULL; FKs `seo_defaults_default_og_image_id_media_id_fk` and `seo_defaults_organization_logo_id_media_id_fk` to `media(id)`, both `ON DELETE set null`; two indexes on the media columns.
  - Down: `DROP TABLE "seo_defaults" CASCADE`, then `DROP TYPE` for the enum (order verified; no child tables).
- Migration (S2 delta): `20261022_000002_s2_scarcity_seo_delta`. Data step first: `UPDATE "seo_defaults"` remaps stored `MarketingAgency` to `ProfessionalService`; then the column is cast to text, the enum `enum_seo_defaults_local_business_type` is dropped and recreated with `ProfessionalService` only, the column default is set to `ProfessionalService` and the column cast back. Also sets `scarcity.capacity` default 7. Down: re-adds `MarketingAgency` to the enum and drops both defaults; rows remapped by up stay `ProfessionalService`.

**Notes**
- A global has no stored row until its first save (payload@3.91.0). `findGlobal` on an unsaved global returns `{}`: consumers must treat every field as optional.
- First save requires a `defaultOgImage` at least 1200×630. The seed must upload a ≥1200×630 placeholder OG image before the first save.
- F12/F13 resolved (S2): `MarketingAgency` removed from the options (not a schema.org type); `localBusiness.type` defaults to `ProfessionalService`.
- F15 resolved (S2): the `defaultOgImage` validator that rejects images not producing the `og` (1200×630) size is kept.
- P3 (see [`seo` (P3)](#seo-unit-p3)) now consumes this global: `SeoDefaults.ts` exports `DEFAULT_TITLE_TEMPLATE` (`'%s — Duha Media'`) and `validateOgImage` (also used as the per-document share-image validator). `src/plugins/seo.ts` reads `titleTemplate`, `defaultDescription` and `defaultOgImage` through `findGlobal`.
- Open flag F14: deleting the media document used as `defaultOgImage` fails with a raw foreign-key error (the column is NOT NULL while the FK is `set null`). To be fixed in unit S3 (friendly blocked deletes).

### Plugins

Official `@payloadcms/*` plugins, configured in `src/plugins/`.

#### `form-builder` (unit P1)

`@payloadcms/plugin-form-builder` at exactly `3.91.0` (lockstep with `payload`). Adds the `forms` and `form-submissions` collections used by every public form (Contact, pre-call homework, newsletter, lead-magnet capture). SCHEMA refs: §0 "form-builder options", §4.3, §6.12, §6.13, §10, X13.

**Files**
- `src/plugins/formBuilder.ts` (new folder `src/plugins/`): exports `formBuilder` (the configured plugin), `FORM_EVENT_TYPES`; internal `formsEditor`, `adaptPluginFields`, `formIntegrationFields`, `submissionSystemFields`, `withFormMaxDepth`, `validateFormKey`, `validateEventType`.
- `src/hooks/formSubmissions.ts`: `stampSubmissionDelivery`.
- `src/hooks/revalidateTag.ts`: new `revalidateLiveCollectionHooks(tag)`.
- `src/access/index.ts`: reuses `staffOnly`, `adminOnly`, `adminOnlyField`, `turnstileVerifiedOrAdmin` (C1).
- `src/fields/index.ts`: reuses `richTextLinkFeature()`.
- `src/collections/LeadMagnets.ts` (`form`), `src/globals/SiteSettings.ts` (`newsletterForm`): see [C9](#lead-magnets-unit-c9), [G1](#site-settings-unit-g1).
- `src/payload.config.ts`: `plugins: [formBuilder]`; new top-level `queryPresets`.
- `.env.example`: `FORMS_DEFAULT_TO_EMAIL`.
- `src/payload-types.ts`, `src/app/(payload)/admin/importMap.js`: regenerated.
- `src/migrations/20261021_233028_p1_form_builder.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Plugin options:
- Field types on: `text`, `email`, `textarea`, `select`, `checkbox`, `message`, `number`, `date`. Off: `payment`, `country`, `state`, `upload`. Every key is set explicitly because `fields` merges over the plugin defaults (checkbox/country/email/message/number/select/state/text/textarea on; payment/upload off; `date` absent unless enabled).
- No payment path is reachable: the Payment block is not registered with `payment: false`; the payment submission fields exist only when `fields.payment` is truthy; the only payment code (`createCharge` → `handlePayment`) is a no-op because `handlePayment` is never passed.
- `redirectRelationships: ['pages']` (p9 homework redirects to `/thank-you?homework=done`; the plugin declares `maxDepth` 2 on this relationship). Migration adds `forms_rels` with `pages_id` (FK cascade).
- `defaultToEmail: process.env.FORMS_DEFAULT_TO_EMAIL || undefined`. Recipient resolution in the plugin: form `emails[].emailTo`, else `defaultToEmail`, else the from-address (`defaultFromAddress`).
- Rich-text fields added by the plugin (`confirmationMessage`, `emails.message`, the Message block) use `formsEditor`: `ParagraphFeature`, `BoldFeature`, `ItalicFeature`, `UnorderedListFeature`, `OrderedListFeature`, `richTextLinkFeature()`, `InlineToolbarFeature` (the FAQ-answer feature set, no Relationship/Upload features).
- `localized` keys are stripped from the plugin's default fields by `adaptPluginFields` (localization is disabled; Payload would also drop them).
- The plugin's `form` relationship on `form-submissions` is given `maxDepth: 0`.

`forms` additions (sidebar, appended after the plugin's fields). `defaultColumns`: `title`, `formKey`, `eventType`, `sendEvent`, `updatedAt`. No drafts (every save is live).

| Field | Type | Notes |
|---|---|---|
| `formKey` | text, required, unique, indexed, `validateFormKey` | Kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). Equals the event `form` value: `contact`, `precall-homework`, `newsletter`, `lead-magnet`. Do not rename once live |
| `eventType` | select `none` / `contact` / `newsletter` / `lead_magnet`, required, default `none`, `validateEventType` | Must not be `none` while `sendEvent` is on |
| `sendEvent` | checkbox, default `false` | Send each submission to the secretary. The pre-call homework form has this off at launch (X13): submissions are stored, no event |
| `newsletterSync` | checkbox, default `false` | Sync the submitter to Resend (contact, segment, topic, double opt-in) |
| `newsletterOptInField` | text | Shown when `newsletterSync`. Name of the checkbox field that must be ticked (lead-magnet forms); empty = sync every submission (newsletter form) |

`form-submissions` additions (appended after the plugin's fields):

| Field | Type | Notes |
|---|---|---|
| `eventId` | text, unique, indexed, `disableDuplicate`, read-only | Idempotency key; set by `stampSubmissionDelivery` |
| `deliveryStatus` | select `pending` / `delivered` / `failed`, indexed, read-only | Empty when the form sends no event |
| `deliveryNote` | textarea, read-only | Last response or error summary |
| `deliveryAttempts` | number, min 0, default 0, read-only | |
| `lastAttemptAt` | date (day and time), read-only | |
| `sourcePath` | text, read-only | Page path the form was submitted on |
| `leadMagnet` | relationship → `lead-magnets`, `maxDepth: 0`, read-only | Asset requested |
| `newsletter` (group, read-only) | `syncStatus` (pending / synced / failed), `syncNote`, `syncAttempts` (default 0), `optInStatus` (pending-confirmation / confirmed / expired), `confirmTokenHash` (text, `hidden: true`), `confirmExpiresAt`, `confirmedAt` | Resend sync, tracked separately from event delivery. `confirmTokenHash` is never in API responses or the admin |

- Field-level `access.create: adminOnlyField` on `deliveryNote`, `deliveryAttempts`, `lastAttemptAt` and the `newsletter` group, so values a public submitter forges at create are stripped. `eventId` and `deliveryStatus` are overwritten by the hook. `sourcePath` and `leadMagnet` have no field-level create restriction (the form handler may set them).
- Admin UI: all system fields are `admin.readOnly`. `defaultColumns` on `form-submissions`: `form`, `deliveryStatus`, `deliveryAttempts`, `createdAt`. `enableQueryPresets: true`.
- Collection access (set explicitly on both; plugin defaults are looser, including a default "any logged-in user" delete on submissions that would include the pipeline user):

| Collection | read | create | update | delete |
|---|---|---|---|---|
| `forms` | `staffOnly` | `adminOnly` | `adminOnly` | `adminOnly` |
| `form-submissions` | `staffOnly` | `turnstileVerifiedOrAdmin` | `adminOnly` | `adminOnly` |

- Query presets (top-level `queryPresets` in `payload.config.ts`): `access` read/create/update/delete = `staffOnly` (Payload's default is any logged-in user, which includes the pipeline); `constraints: {}` (built-in Only me / Everyone / Specific users). Enabled on `form-submissions` only.
- The pipeline user is denied on `forms`, `form-submissions` and query presets.

**Wiring**
- Registration: `src/payload.config.ts` → `plugins: [formBuilder]`; `queryPresets` as above.
- Hooks, `forms`: `afterChange` / `afterDelete` = `revalidateLiveCollectionHooks('forms')`. Collections without drafts feed public pages, so every save and delete calls `revalidateTag('forms', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set; same safe-guard behaviour as the other revalidate hooks.
- Hooks, `form-submissions`:
  - `beforeChange`: plugin `createCharge` (no-op), then `stampSubmissionDelivery`. On `create` only: `eventId` = fresh `randomUUID()` (node:crypto) on every create, overwriting any caller-supplied value; `deliveryStatus` = `pending` only if the submission's form has `sendEvent` true and `eventType` not `none`, else `null` (caller values overwritten either way). The form is read with `overrideAccess: true` and the same `req`. Updates (re-send) never regenerate `eventId`.
  - `afterChange`: the plugin's `sendEmail` (notification email via Resend). It is awaited inside the submit request (open flag F20). No integration `afterChange` exists yet (`TODO(integration)`).
- Pages using it: p9 (homework form), p10, p12 (contact form), p16 and every NewsletterBand / footer nudge (via `site-settings.newsletterForm`), p18 (via `lead-magnets.form`). Blocks (FormEmbed, NewsletterBand) are not built yet.
- Frontend rule: forms are staff-read, so the frontend reads form definitions server-side with `overrideAccess` and must never pass the `emails` array (notification addresses) to client components.
- Migration: `20261021_233028_p1_form_builder`. Additive.
  - Up: enums `enum_forms_confirmation_type`, `enum_forms_redirect_type`, `enum_forms_event_type`, `enum_form_submissions_delivery_status`, `enum_form_submissions_newsletter_sync_status`, `enum_form_submissions_newsletter_opt_in_status`, and four `enum_payload_query_presets_*` (read/update/delete constraint, related_collection = `form-submissions`); tables `forms`, `forms_blocks_{checkbox,email,message,number,select,select_options,text,textarea,date}`, `forms_emails`, `forms_rels`, `form_submissions`, `form_submissions_submission_data`, `payload_query_presets`, `payload_query_presets_rels`; unique `forms_form_key_idx` and `form_submissions_event_id_idx`, index on `delivery_status`; `form_submissions.form_id` NOT NULL FK → `forms` ON DELETE set null; adds `lead_magnets.form_id`, `_lead_magnets_v.version_form_id`, `site_settings.newsletter_form_id` (FKs → `forms`, set null) and `forms_id` / `form_submissions_id` on `payload_locked_documents_rels` (FK cascade); all with indexes.
  - Down: hand-fixed to drop the five FKs that point into the new tables (`lead_magnets`, `_lead_magnets_v`, `payload_locked_documents_rels` ×2, `site_settings`) before the `DROP TABLE … CASCADE` statements (same fix as C2), then drops the added indexes, columns and enums.

`TODO(integration)` list (nothing below exists yet; each is an `automation-engineer` unit):
1. Form handler (server action or route): Turnstile siteverify first, then `payload.create` on `form-submissions` with `context.turnstileVerified = true` and `overrideAccess: false`; may set `sourcePath` and `leadMagnet`.
2. `afterChange` on create: enqueue the event delivery job (never send inline) and, for forms with `newsletterSync`, the newsletter sync job. Jobs write with `overrideAccess` (field-level create restrictions otherwise strip their values); reading or writing `newsletter.confirmTokenHash` needs `showHiddenFields`.
3. `resend` `ui` field on `form-submissions` plus a staff-only endpoint that re-enqueues the job keeping the same `eventId`. A `ui` field has no column, so no migration.
4. Seed the shared "Failed deliveries" query preset (a `payload-query-presets` document, not config): `title`, `isShared: true`, `relatedCollection: 'form-submissions'`, `where` `deliveryStatus` equals `failed`, access constraint `everyone` for read/update/delete as chosen.
5. Move the plugin's notification email off the request path (F20).

**Notes**
- Open flags (PROGRESS.md "Flags for checkpoint"):
  - F16: `FORMS_DEFAULT_TO_EMAIL` is new and optional; whether the server sets it is an OPS question.
  - F17: forms are admin-write, so `marketing` cannot edit form copy or notification addresses.
  - F18: deleting a form that has submissions raises a raw DB error (the `form_id` column is NOT NULL while the FK is `set null`, as in F14). A friendly `beforeDelete` check is recommended; not built.
  - F19: deleting a `pages` document used as a form redirect silently clears that redirect.
  - F20: the plugin's notification email is awaited inside the submit request; the visitor waits on Resend. Plugin default for now; fix planned in the contact integration unit.
  - F21 (all drafts-enabled collections): opening a create view autosaves a blank draft; strays accumulate if the editor leaves.
- "Failed deliveries" is a shared preset document (`payload-query-presets`), not config, so it exists only after the seed or an admin creates it.
- The precall-homework form is created with `sendEvent` off at launch (X13); its submissions get no `deliveryStatus`, so they never appear in "Failed deliveries".
- Payload's `queryPresets` access function (default) was verified in `payload@3.91.0` `query-presets/access.js`; the config overrides it for all four operations.
- S3: `forms` has `beforeDelete: [blockDeleteIfReferenced({ counted: { 'form-submissions': formSubmissionsSentence } })]` (`src/plugins/formBuilder.ts`): a form with submissions cannot be deleted. See [Error handling](#error-handling-unit-s3).

#### `redirects` (unit P2)

`@payloadcms/plugin-redirects` at exactly `3.91.0` (lockstep with `payload`). Adds the `redirects` collection (marketing self-service redirects). No cutover redirects are seeded (DECISIONS §C / Gate 0: no redirect map). SCHEMA refs: §0 "plugin-redirects options", §4.1 (marketing), §4.3, §6.14, §10.

**Files**
- `src/plugins/redirects.ts`: exports `redirects` (the configured plugin). Internal: `ownHosts`, `normaliseFrom`, `fromPathError`, `validateFrom`, `validateUrl`, `validateReference`, `typeFieldOverride`, `shapeFields`.
- `src/lib/docPath.ts` (new): `docPath(collection, doc)` and type `RoutableDoc`.
- `src/hooks/revalidateTag.ts`: reuses `revalidateLiveCollectionHooks` (P1).
- `src/access/index.ts`: reuses `staffOnly`. `src/fields/index.ts`: reuses `LINK_TARGETS`. `src/lib/pagePath.ts`: reused by `docPath`.
- `src/payload.config.ts`: `plugins: [formBuilder, redirects]`.
- `src/payload-types.ts`: regenerated.
- `src/migrations/20261021_235030_p2_redirects.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Plugin options: `collections: [...LINK_TARGETS]` (`pages`, `case-studies`, `posts`, `lead-magnets`), `redirectTypes: ['301', '302']`, `redirectTypeFieldOverride`, `overrides` (labels Singular "Redirect" / Plural "Redirects"; `admin.useAsTitle: 'from'`; `defaultColumns`: `from`, `to.type`, `type`, `updatedAt`; no drafts, so every save is live).

| Field | Type | Notes |
|---|---|---|
| `from` (label "Old address") | text, required, unique, indexed (plugin defaults) | `beforeValidate` tidy (`normaliseFrom`): trims; a pasted full URL on an own host (`duhamedia.com`, `www.duhamedia.com`, host of `SITE_URL`) with no query/hash is reduced to its path; trailing slashes are stripped (so `/old/` and `/old` collide on the unique index). Validator (`validateFrom`, calls `text()` first) rejects: no leading `/`; whitespace; `?` or `#`; `/` alone; `//`; any segment starting with `_`; first segment `admin` or `api`. Unique via the plugin's `redirects_from_idx`. Case-sensitive (`/Old` ≠ `/old`) |
| `to.type` (label "Send visitors to") | radio `reference` / `custom`, default `reference` | Options labelled "A page on this site" / "Another address" |
| `to.reference` (label "Page") | relationship (polymorphic) → `pages`, `case-studies`, `posts`, `lead-magnets`; `maxDepth: 1` | Value shape `{ relationTo, value }`. Shown when `to.type = reference`. `validateReference` (calls `relationship()` first, skips on `onChange`): rejects a target with no public path per `docPath` (e.g. the `404` page) and a target whose path equals `from` (self-loop), both checked on save |
| `to.url` (label "Address") | text | Shown when `to.type = custom`. `validateUrl`: either a site path starting with `/` (single slash, no spaces) or an `https://` URL; rejects a path equal to `from`, and an own-host URL whose pathname equals `from` (self-loop) |
| `type` (label "Redirect type") | select `301` / `302`, required, default `301` | Plugin adds the field only because `redirectTypes` is set; the plugin gives it no default, the override supplies `301` |

- Hidden conditional fields (`to.reference` while type is `custom`, `to.url` while `reference`) are not required or validated while hidden (payload@3.91.0 `fields/hooks/beforeChange/promise.js`).
- A custom `validate` replaces the built-in one, so each validator above calls `text()` / `relationship()` first.
- Access (the plugin sets only `read: () => true`; it never sets create/update/delete, which would default to any logged-in user, including the pipeline user):

| Collection | read | create | update | delete |
|---|---|---|---|---|
| `redirects` | public (`() => true`) | `staffOnly` | `staffOnly` | `staffOnly` |

**Wiring**
- Registration: `src/payload.config.ts` → `plugins: [formBuilder, redirects]`. The plugin adds no admin components (nothing for the import map).
- Revalidation: `afterChange` / `afterDelete` = `revalidateLiveCollectionHooks('redirects')` → `revalidateTag('redirects', 'max')` and `revalidatePath('/', 'layout')`. Skipped when `context.disableRevalidate` is set.
- `src/lib/docPath.ts` returns the public path of a link target, or `null` for a doc with no slug or no public path:
  - `pages` → `pagePath(slug)` (`home` → `/`, the `404` doc → `null`)
  - `case-studies` → `/work/<slug>`
  - `posts` → `/newsletter/<slug>` when `track` is `newsletter-issue`, otherwise `/insights/<slug>`
  - `lead-magnets` → `/resources/<slug>`
  - Used by the redirects self-loop check now; intended for the redirect router and future link rendering.
- Pages using it: none render it yet. There is no site route or proxy applying redirects (`TODO(router)` below).
- Migration: `20261021_235030_p2_redirects`. Additive.
  - Up: enums `enum_redirects_to_type` (`reference`, `custom`) and `enum_redirects_type` (`301`, `302`); tables `redirects` (`from` NOT NULL, `to_type` default `reference`, `to_url`, `type` default `301` NOT NULL, timestamps) and `redirects_rels` (`pages_id`, `case_studies_id`, `posts_id`, `lead_magnets_id`, each FK cascade); unique `redirects_from_idx`; indexes on `updated_at`, `created_at` and the rels columns; adds `payload_locked_documents_rels.redirects_id` (FK cascade, indexed).
  - Down: hand-fixed (logged in PROGRESS Decision log). The generated order dropped the tables with CASCADE before dropping the locked-documents FK, so `DROP CONSTRAINT` failed. The fixed order drops that FK, its index and column first, then `redirects_rels`, then `redirects`, then the two enums.

`TODO(router)` list (nothing below exists yet; the router is a later unit):
1. On a not-found request, look up `redirects` by `from` via the Local API, using the tidied pathname (query string ignored); `depth: 1`, `limit: 1`; cache the lookup under tag `redirects`.
2. Honour `type`: `301` → `permanentRedirect`, `302` → `redirect`.
3. `to.type = custom`: use `to.url` as-is. `to.type = reference`: build the destination with `docPath`; only published targets (`overrideAccess: false`, no user). An unpopulated or null reference yields no redirect, so the request falls through to 404.
4. No server-side chaining (one hop only); guard that destination ≠ request path.
5. Precedence: redirects apply only when no live document matches the address (F22).
6. The proxy matcher must exclude `/admin`, `/api` and `/_next`.

**Notes**
- Open flags (PROGRESS.md "Flags for checkpoint"):
  - F22: a redirect does not override a live page at the same address; the router applies redirects only on not-found (website-template pattern).
  - F23: deleting a redirect's target document leaves a dead redirect (the reference is emptied); the router skips it and the request 404s. Alternative (block deletion while redirects point at it, via a hook) needs a mini Gate S.
  - F24: two-step loops (A→B, B→A) are not blocked, only self-loops; accepted, the router never chains server-side.
  - F25: the old address is case-sensitive (`/Old` ≠ `/old`); exact match kept.
- Self-loop checks run on save only; `validateReference` and the `to.url` loop check do not run on `onChange`.
- Verified against the installed plugin (`node_modules/@payloadcms/plugin-redirects/dist`, 3.91.0): `overrides` is spread first (hooks pass through untouched; the plugin adds none), then `access` = `{ read: () => true, ...overrides.access }` and `admin` = `{ defaultColumns, ...overrides.admin }`.

#### `seo` (unit P3)

`@payloadcms/plugin-seo` at exactly `3.91.0` (lockstep with `payload`). Adds a `meta` group (title, description, share image) in an "SEO" tab on `pages`, `case-studies`, `posts` and `lead-magnets`, with generators fed by `seo-defaults`. SCHEMA refs: §0 "plugin-seo options", §6.1, §6.2, §6.3, §6.8 `meta` rows, §7.4. Commit `a22403c`.

**Files**
- `src/plugins/seo.ts`: exports `seo` (the configured plugin wrapper), `SEO_COLLECTIONS`, `META_TITLE_TARGET` (`60`), `generateTitle`, `generateDescription`, `generateImage`, `generateURL`, `truncate`, `siteOrigin`. Internal: `shapeFields`, `validateMetaDescription`, `trim`, `hideMetaGroupLabel`, `HELP_TEXT`, `withHelpText`.
- `src/collections/Pages.ts`: `title` moved into an unnamed "Content" tab (see [C10](#pages-unit-c10)).
- `src/globals/SeoDefaults.ts`: new exports `DEFAULT_TITLE_TEMPLATE`, `validateOgImage` (see [G4](#seo-defaults-unit-g4)).
- `src/lib/docPath.ts` (P2): reused by `generateURL`.
- `src/payload.config.ts`: `plugins: [formBuilder, redirects, seo]`.
- `src/payload-types.ts`: regenerated (`SeoMeta` interface via `interfaceName`); `src/app/(payload)/admin/importMap.js` regenerated.
- `src/migrations/20261022_001520_p3_seo.ts` (+ `.json`), registered in `src/migrations/index.ts`.

**Fields & schema**

Plugin options: `collections: ['pages', 'case-studies', 'posts', 'lead-magnets']`, `uploadsCollection: 'media'`, `tabbedUI: true`, `interfaceName: 'SeoMeta'`, `fields: shapeFields`, and the four generators below.

`tabbedUI` behaviour (verified in `plugin-seo@3.91.0` `dist/index.js`): when a collection's first field is a `tabs` field, the plugin appends an "SEO" tab to it and leaves the later top-level fields (sidebar fields) top-level. Otherwise it wraps ALL fields in a new first tab, which would bury the sidebar fields. `posts`, `case-studies` and `lead-magnets` already started with tabs; `pages` did not, so its main fields were put in an unnamed "Content" tab in this unit. The plugin rebuilds the tabs field as `{ type: 'tabs', tabs }` only, so the original tabs field must carry no other props.

The plugin's `meta` group is labelled "SEO" and sits in a tab also labelled "SEO"; `hideMetaGroupLabel` sets the group `label: false` so the admin and error paths do not read "SEO > SEO". Admin only: no schema or type change.

| Path | Type | Notes |
|---|---|---|
| `meta.title` (label "Search title") | text | Plugin length indicator 50–60 (soft; never blocks a save). `beforeValidate` trim. `localized` forced `false` |
| `meta.description` (label "Search description") | textarea, `maxLength` 155 (`DEFAULT_DESCRIPTION_MAX`) | Indicator 100–155. Custom `validateMetaDescription` (calls built-in `textarea()` first) rejects > 155 characters. Trimmed. `localized` forced `false` |
| `meta.image` (label "Share image") | upload → `media`, `maxDepth: 1` | Field present because `uploadsCollection` is set. Validator `validateOgImage` (from `seo-defaults`): rejects a media doc with no `sizes.og.url`, i.e. smaller than 1200×630. Field `access.create` and `access.update` = `staffOnlyField`. `localized` forced `false` |

- The plugin marks all three `localized: true`; `shapeFields` resets it to `false` (localization is permanently off).
- Validation timing: `drafts.validate: false` (repo `contentVersions`), so the 155 limit and the image-size check run on publish only. Drafts and autosaves, including the pipeline's, are never rejected for length.
- Access: the plugin adds none; `meta` fields inherit each collection's access. `meta.image` writes are staff only. The pipeline user can set `meta.title` and `meta.description` on its own `posts` drafts (F30); a `meta.image` value from the pipeline is dropped silently (not an error).
- Help text: the plugin's field components ignore `admin.description` and print fixed i18n strings instead. The wrapper overrides `lengthTipTitle`, `lengthTipDescription` and `imageAutoGenerationTip` under the config's `i18n.translations.en['plugin-seo']` (the plugin merges its strings under the config's, `dist/index.js:348-351`). The `admin.description` values stay only as generated-type doc comments. Strings are shared by all four collections (copy says "this page").

Generators (all catch errors and return a usable string, `''` as last resort, because a throwing generator makes the admin button silently set `''`):

| Generator | Rule |
|---|---|
| `generateTitle` | `seo-defaults.titleTemplate` (fallback `DEFAULT_TITLE_TEMPLATE`; a template without exactly one `%s` also falls back) with `%s` = the doc `title`. Whitespace collapsed. Posts only: when the templated title is longer than 60 characters (`META_TITLE_TARGET`) and `targetKeyword` is set, `%s` = the keyword with its first letter capitalised (F27). Empty doc title → `''`. Home page generates "Home — Duha Media" (F29) |
| `generateDescription` | Own summary: posts `dek`; case-studies `cardSummary`, else `inShort`; lead-magnets `pitch`; pages none. Else `seo-defaults.defaultDescription`. Else `''`. Truncated to 155 characters at a word boundary with a trailing `…` (`truncate`) |
| `generateImage` | case-studies `heroMedia` / posts `heroImage` when that media doc has a `sizes.og.url`; otherwise `seo-defaults.defaultOgImage`; otherwise `''`. Pages and lead-magnets use the default image |
| `generateURL` | `SITE_URL` origin + `docPath(collection, doc)`; relative path when `SITE_URL` is unset or invalid; `''` when the doc has no public path (e.g. the `404` page). `process.env.SITE_URL` is read directly because `src/lib/env.ts` imports `server-only` and the plugin runs in the admin bundle too |

- `seo-defaults` is read with `findGlobal` (`depth: 0`); a read failure is logged as a warning and treated as `{}` (a global has no row until first save).
- Generate endpoints: `POST /api/plugin-seo/generate-{title,description,url,image}`. Each requires a logged-in user with admin-panel access (`users` `access.admin` = staff only), so the pipeline key cannot call them. The admin buttons send the current (possibly unsaved) form data as `doc`; uploads arrive as ids.

**Wiring**
- Registration: `src/payload.config.ts` → `plugins: [formBuilder, redirects, seo]`. Order-independent (touches only the four collections, endpoints and translations); registered last. The `seo` export wraps the plugin to apply `hideMetaGroupLabel` and `withHelpText` after it runs.
- Pages using it: every document on the four collections. No frontend consumer exists yet.
- Revalidation: none of its own. `meta` is a field on collections that already revalidate (`pages`, `case-studies`, `posts`, `lead-magnets`); an edit to `meta` triggers their existing hooks.
- Migration: `20261022_001520_p3_seo`. Additive.
  - Up: adds `meta_title` varchar, `meta_description` varchar and `meta_image_id` integer to `pages`, `case_studies`, `posts`, `lead_magnets`, and `version_meta_title`, `version_meta_description`, `version_meta_image_id` to `_pages_v`, `_case_studies_v`, `_posts_v`, `_lead_magnets_v`; eight FKs from the image columns to `media(id)` (`ON DELETE set null`); eight indexes on the image columns. All columns nullable; no existing data touched.
  - Down: drops the FKs, then the indexes, then the 24 columns.

**Notes**
- Flags (PROGRESS.md "Flags for checkpoint"):
  - F26: title length is soft (indicator 50–60); description is a hard 155 limit on publish.
  - F27: posts generated title becomes "Keyword — Duha Media" when title + template exceeds 60 characters and `targetKeyword` is set.
  - F28: the per-document share image must also be at least 1200×630 on publish (same rule as F15 for `defaultOgImage`).
  - F29: the homepage's generated title is "Home — Duha Media" (editable in the SEO tab).
  - F30: the pipeline can set the SEO title and description on its post drafts, not the share image.
- Empty `meta.*` values are not filled on save: the frontend must fall back to the generator rules and `seo-defaults` itself (the title help text states the site builds an empty title the same way).
- `TODO(router)` (nothing below exists yet; the router unit):
  1. `generateMetadata` for each route: title/description from `meta.*`, else the generator rules; `og:image` from `meta.image.sizes.og`, else the generated fallback; canonical from `generateURL` rules; `noindex` from `pages.noindex` and on staging.
  2. JSON-LD (Organization / LocalBusiness from `seo-defaults`, plus per-type schemas).
  3. `sitemap.xml` and `robots.txt`.
  4. Live preview and draft mode.

### Error handling (unit S3)

Commit `eecd05c`. Standing rule (2026-10-21, "proper error reporting throughout"): no raw database or stack error reaches editors or visitors; a blocked action names what blocks it and how to fix it.

**Files**
- `src/hooks/blockDeleteIfReferenced.ts`: `blockDeleteIfReferenced(options)` (`CollectionBeforeDeleteHook` factory), `formSubmissionsSentence`, `leadMagnetSubmissionsSentence`, `DEFAULT_OG_IMAGE_HINT`.
- `src/lib/missingFileHandler.ts`: `missingFileHandler(staticDir)` (`upload.handlers` entry).
- `src/components/errors/ErrorMessage.tsx`: shared visitor message (client component).
- `src/app/(frontend)/error.tsx`: error boundary for public pages.
- `src/app/global-error.tsx`: root-layout boundary (covers `(frontend)` and `(payload)`).
- `src/fields/index.ts`: `contentVersions.drafts.autosave: false`.
- Collections using the hook: `Media.ts`, `Downloads.ts`, `Clients.ts`, `TeamMembers.ts`, `Testimonials.ts`, `CaseStudies.ts`, `Posts.ts`, `LeadMagnets.ts`, `Pages.ts`, and `forms` in `src/plugins/formBuilder.ts`. `missingFileHandler` is on `Media.ts` and `Downloads.ts`.
- `src/migrations/20261022_014336_s3_friendly_errors.ts` (+ `.json` snapshot), registered in `src/migrations/index.ts`.

**Delete protection: `blockDeleteIfReferenced`**
- Runs in `beforeDelete`. In payload@3.91.0 `deleteByID` runs `beforeDelete` hooks (`collections/operations/deleteByID.js:70-79`) before it unlinks upload files (`:90`) and before the row delete (`:127`). A failed foreign-key delete would otherwise already have removed the files and returned a raw "Failed query". Bulk delete (`operations/delete.js:105-116`) runs the hook per doc and collects each message in `errors[]`.
- Error: `APIError(message, 409)`. A non-500 `APIError` is public, so REST returns the message verbatim; the admin shows it as a toast on single delete and one line per blocked doc on bulk delete.
- References are derived at runtime from the config, cached per target slug (per config, for the life of the process):
  - every `relationship` / `upload` field whose `relationTo` includes the target, at any depth: groups, named tabs, arrays, blocks (incl. block references), walked over `flattenedFields`;
  - in every global, and in every collection except `payload-*` internals.
- Not counted:
  - Drafts-enabled referencing collections: only published docs count (`_status = published` on the main table). `_v` tables are never read.
  - Rich-text (Lexical) links and uploads (JSON, no FK). The renderer must drop links whose target no longer resolves.
  - Join fields (virtual).
  - Self-references (`id not_equals` the doc being deleted).
- Query method: Local API with `overrideAccess: true` and the operation's `req` (same transaction); `depth: 0`; collections via `find` with one OR of the matching paths, globals via `findGlobal`. Polymorphic paths query `{ relationTo, value }`. Paths inside a `blocks` field are scanned (all published docs, `pagination: false`), not queried, because drizzle resolves `layout.<field>` against the first block that has a field of that name only (`@payloadcms/drizzle@3.91.0` `queries/getTableColumnFromPath.js:140`). Matching docs are walked to name the exact place (e.g. "row 2").
- Message: names the document, lists up to 5 places then "(+N more)", and says to remove it there or choose a different one. Places read `<Collection> "<title>" → <field path>`; globals lead the list.
- Options: `noun` (lower-case noun in the message), `counted` (a referencing collection reported as a count sentence instead of a list), `hints` (extra sentence when a specific place blocks; key `<slug>:<dot path>`).
- Specials:
  - `media`: if the default social share image blocks (`seo-defaults:defaultOgImage`), appends `DEFAULT_OG_IMAGE_HINT` (Globals → SEO defaults → Default social share image → choose another → Save).
  - `forms`: blocked while `form-submissions` exist (`formSubmissionsSentence`; leads stay on record; delete the submissions first).
  - `lead-magnets`: blocked while submissions requested it (`leadMagnetSubmissionsSentence`).
- Bypass: `context.skipReferenceCheck = true` (seed resets, QA cleanup).

**Missing files: `missingFileHandler`**
- Without it payload@3.91.0 answers a missing file with `500 Something went wrong.` (`uploads/endpoints/getFile.js:61-79`).
- GET/HEAD only. Other methods return `undefined` (falls through), because `upload.handlers` is also called for client uploads from a multipart POST/PATCH; that path keeps failing as before.
- On ENOENT: logs a warning and answers `404` with body `{"errors":[{"message":"File not found."}]}` and the same CORS headers as Payload's file responses (`headersWithCors`).
- Read access is checked before handlers run, so a staff-only `downloads` file still answers 403 to the public; the handler cannot reveal whether a file exists to someone without read access.
- A path that resolves outside `staticDir` returns `undefined`; Payload rejects it (400 "Invalid filename.").

**Error pages**
- `src/app/(frontend)/error.tsx`: boundary for public pages and nested layouts; does not wrap `(frontend)/layout.tsx` itself. Props `error` and `retry` (the Next 16.3.8 prop for re-rendering the segment; the legacy name is `reset`).
- `src/app/global-error.tsx`: resolved once at the app root (Next 16.3.8), used for both root layouts including the admin. Renders its own `<html>`/`<body>`, gets no global CSS, uses a React `<title>` and `noindex`.
- `ErrorMessage`: never shows `error.message`. Shows the `digest` as "Reference" when present (server component errors; client-side errors have none). Buttons: "Try again" (calls `retry`), link to the homepage; 44px minimum height; inline styles only so it renders without the site CSS.
- Copy is placeholder (F34); the real error state is designed later with the page-21 Error404 block family.

**Autosave off (F21)**
- `contentVersions.drafts.autosave: false` on the 8 collections (see [Shared helpers](#shared-helpers-for-content-collections-c3c6)). Reason: with autosave on and `drafts.validate` off, the 3.91.0 admin create view creates a draft the moment it opens; there is no option to defer it, and `drafts.validate: true` would break required-to-publish.
- Live preview: client-side `useLivePreview` still updates instantly; server-rendered preview refreshes on Save draft (`RefreshRouteOnSave`).
- The slug is fixed at first save unless regenerated.

**Wiring**
- Registration: hooks and handlers are set on each collection config (see Files); the error files are Next file conventions, no registration.
- Revalidation: none (no public data rendered by this unit).
- Migration: `20261022_014336_s3_friendly_errors`. A deliberate no-op expand step. The generated diff would have dropped `autosave` and its `_<slug>_v_autosave_idx` index on the 8 `_v` tables; replaced by a no-op so the previous image (which still reads/writes `autosave` during deploy overlap) keeps working. The new image never names the column. The JSON snapshot already reflects the new schema, so later `migrate:create` runs do not regenerate the drop. `down()` is a no-op.
- Contract migration owed (F31), once no image that declares `autosave` can run: hand-written, `DROP INDEX IF EXISTS "_<slug>_v_autosave_idx"` and `ALTER TABLE "_<slug>_v" DROP COLUMN IF EXISTS "autosave"` for the 8 `_v` tables (`_pages_v`, `_clients_v`, `_team_members_v`, `_testimonials_v`, `_faqs_v`, `_case_studies_v`, `_posts_v`, `_lead_magnets_v`). The column holds version metadata only.

**Notes**
- What the `site_error` integration unit needs from this unit's surface:
  - Payload `afterError` for non-public errors and status >= 500.
  - Next `instrumentation` `onRequestError`, `nodejs` runtime only; skip `/api/health`; include the `digest`, which matches the "Reference" shown to the visitor.
  - Ignore the client-upload "Expected response from the upload handler." 500 (see `missingFileHandler`, GET/HEAD only).
  - The error boundaries do not report anything themselves.
- Flags F31–F35: F31 contract migration owed (above); F32 autosave off → server-rendered live preview refreshes on Save Draft, new docs preview after first save (router unit may use client-side `useLivePreview` for instant preview); F33 Lexical links/uploads aren't delete-protected — the rich-text renderer must skip unresolved targets; F34 placeholder error copy (above); F35 a blocked delete is fixed by editing the referencing docs first (by design).

## Block showcase sandbox (`/_showcase`)

Renders every block and every variant back to back, for review at Gate K. Hidden from navigation, sitemap and search (noindex), and returns 404 when `APP_ENV=production`. Visible on local dev and staging only.

Implemented in [B0](#frontend-foundation-unit-b0).

- Route: `src/app/(frontend)/%5Fshowcase/page.tsx`. The folder is `%5Fshowcase` because a `_folder` is a private folder excluded from routing; `%5F` (URL-encoded `_`) creates a segment starting with an underscore.
- `notFound()` when `APP_ENV=production` (`showcaseEnabled()`); always `robots: { index: false, follow: false }`.
- Entries come from `showcaseEntries` in `src/showcase/registry.ts`, each rendered through `RenderBlocks`. Scaffolding: system-mono labels (block, variant, `mobile-only`/`desktop-only` tag), dotted dividers between entries, and an empty-state message ("No blocks yet.") while the registry is empty.
- Entries: 78 in `showcaseEntries` (75 + 3 `newsletterBand`).
  - Homepage group (B3, 27 entries, in order): `hero` x2, `proofStrip` x4, `caseStudyCards` x4, `miniCTAStrip` x2, `twoTrackPanels` x2, `phaseTimeline` x2, `teamIntro` (intro) x2, `testimonialRow` x4, `teamIntro` (founder-card) x2, `finalCTA` x3.
  - Big step 4 group (51 entries, appended after the homepage group). Ordering rule: grouped by block in SCHEMA §9 page order of first use, and variants within a group in page order: `hero` article x3 (p2), stats x2 (p3), phaseStrip x1 (p4), service x3 (p5, p6) → `richContent` x2 (p2) → `metricEvent` x4 (p2) → `testimonialRow` client-voice x3 (p2) → `newsletterBand` x3 (p2, p3) → `caseStudyCards` next-link, ledger x2 (p3), track build (p5), track growth (p6) → `twoTrackPanels` doors x2, contrast x2 (p4), primary-secondary x1 (p5) → `phaseTimeline` arc x2, steps x3 (p4), build-run x2 (p5), engine-rollout x2 (p6) → `accordionFAQ` x3 (p4) → `specLedger` x8 (p5, p6).
  - The grouping rule is stated in the comment above the first big-step-4 entry in `src/showcase/registry.ts`.
- Fixtures are static objects typed to the generated block rows, so fallback and empty states render without database content. Entries that read published data from the database: `caseStudyCards` / `cards — featured (DB)`, `ledger — latest (DB)`, `cards — track build, fallback testimonials`, `cards — track growth, fallback metric strip`, and `accordionFAQ` / `mini — category (DB)` (with no data they show their fallback or render nothing).

---

## Deploy

Source: `DECISIONS.md` §D, §E, §F and `OPS_REQUESTS.md` #3. Items marked **TBD** are not yet confirmed or built.

### Push → staging
1. A unit clears its gates and is committed and pushed to `main`.
2. GitHub Actions builds one Docker image per commit **with no database access** (the `(frontend)` layout is `force-dynamic`; no DB-querying `generateStaticParams`; no `NEXT_PUBLIC_*` variables). It runs typecheck and lint, then pushes to the private GHCR repository `ghcr.io/duhadev/duhamedia`, tagged `sha-<commit>` and `main`.
3. The server's staging timer (owned by the server agent) pulls `:main` every few minutes and deploys it to `staging.duhamedia.com` (behind Cloudflare Access, always noindexed).
4. On container start, Payload's `prodMigrations` runs any pending committed migrations before the server serves. The deploy script then polls `GET /api/health` (200 = DB reachable, 503 otherwise); on failure it rolls back to the previous image and alerts the human through the secretary.

### Release → production
1. **Only when the human explicitly orders it** ("ship it", "deploy to production"), the PM creates and pushes a git tag `vX.Y.Z`.
2. CI **re-tags the already-built image** of that commit as `vX.Y.Z` and `production`. Production never gets a rebuild; it always runs an image that already ran on staging.
3. The server's production timer pulls `:production`; migrations run on start (as above); health is polled; failure rolls back automatically.

### Rollback
- Automatic: the deploy script rolls back if `/api/health` does not go green after a deploy (a failed migration aborts startup, so health never passes).
- Manual (human-triggered): point `production` back at the previous `vX.Y.Z` — via a CI job or a documented manual retag. **TBD:** the exact job/command, written when the workflow lands in Phase 1.
- Migrations must stay backward-compatible with the previous image for the seconds of deploy overlap; never drop content-holding columns/tables without a human-approved data step.

### Image and runtime
- Multi-stage Dockerfile, `output: 'standalone'`, non-root user, port 3000, Node 24 (`node:24-alpine`), no secrets baked in, all config from env at runtime.
- Memory target ≤ ~0.5 GB (`NODE_OPTIONS=--max-old-space-size=384`). **TBD:** measured figure (Phase 1).
- CI build minutes per run: **TBD** (measured in Phase 1; GitHub Free = 2,000 min/month).
- GHCR read token for server pulls: provided by the server agent (name **TBD**).

### Environment variables (names only)

| Name | Purpose |
|---|---|
| `DATABASE_URI` | Postgres connection string (`duha_site_staging` on staging) |
| `PAYLOAD_SECRET` | Payload signing secret |
| `APP_ENV` | `production` \| `staging` \| `development`; drives event `env`, staging noindex, `/_showcase` visibility |
| `SITE_URL` | Canonical origin, read at runtime (replaces the old `NEXT_PUBLIC_SITE_URL`) |
| `MEDIA_DIR` | Absolute path of the media directory in the container (bind-mounted; separate for staging/production) |
| `SITE_EVENT_URL` | Internal address of the OpenClaw secretary's site-event endpoint |
| `SITE_EVENT_SECRET` | HMAC key for signing site events |
| `RESEND_API_KEY` | Resend full-access key (email transport + contacts) |
| `RESEND_NEWSLETTER_SEGMENT_ID` | Resend newsletter Segment |
| `RESEND_NEWSLETTER_TOPIC_ID` | Resend newsletter Topic (replaces the retired `RESEND_AUDIENCE_ID`) |
| `FORMS_DEFAULT_TO_EMAIL` | Optional. Notification inbox when a form's "Email to" is empty (form-builder `defaultToEmail`). Unset: falls back to the Resend from-address. Open flag F16 |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (passed to client components as a prop) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret for server-side verification |

Local dev: values live only in the untracked `.env`, created from the committed `.env.example` (names and comments only). Local Postgres via `docker-compose.yml` (major version **TBD**, OPS_REQUESTS #6).

---

## Integrations

Every lead, signup and site error is sent to the OpenClaw secretary as a signed HTTP event, and newsletter signups sync to Resend Contacts. The full contract, signing, retry schedule, re-send procedure and per-event status live in [`INTEGRATIONS.md`](../INTEGRATIONS.md).

The submit-side data model (forms, submissions, delivery fields) is documented in [`form-builder` (P1)](#form-builder-unit-p1). The public submission path (Turnstile verify, validation, store) is built: see [Shared components and form foundation](#shared-components-and-form-foundation-big-step-4) and `INTEGRATIONS.md` "Form submission path". Still open `TODO(integration)` items: the `form-submissions` `afterChange` enqueue and the signed-event delivery job, the newsletter-sync job, the re-send endpoint and the "Failed deliveries" preset (see the [P1 Wiring section](#form-builder-unit-p1)).

---

## Local development

- `docker compose up -d` → Postgres 17 (provisional) on **127.0.0.1:5433** (5432 is taken by another project on the dev laptop).
- `cp .env.example .env`, fill values, then `pnpm dev` → http://localhost:3000, admin at `/admin`.
- Dev DB `duha_site_dev` uses Drizzle push. **Never run `migrate:create` against it** — use a scratch DB (push and migrations must not share a database).
- Schema change: `pnpm payload migrate:create <name>` (scratch DB), review, commit with `pnpm generate:types` output.
- Migration workflow details (from C1):
  - Generate against a scratch DB migrated to HEAD (all committed migrations applied), never the push-managed dev DB.
  - `migrate:create` is interactive on enum/column renames (drizzle create-vs-rename prompts). Run it under a pty and answer each prompt explicitly.
  - Hand-edited data steps (e.g. the C1 admin-preserving `UPDATE`) must be applied to the dev DB by running the migration's SQL before the next push, because push cannot run them.
  - Whenever a migration adds a collection, Payload's generated `down()` emits `DROP TABLE … CASCADE` before the `DROP CONSTRAINT` for the new `payload_locked_documents_rels_*_fk`, so `down` fails (the CASCADE already removed the FK). Hand-reorder `down()` to drop those FKs first (done in C2 and C3–C6).
- Browser-based proofs (anything needing the human's admin session) are run by the PM or `qa-reviewer`, not by the integrator or schema agents.
- Script safety: throwaway users created by scripts or tests must use a unique `test+gate-<purpose>@duhamedia.com` address and be deleted by the returned id only.
- Local image test: `docker build .` then `docker run --network host --env-file .env …`.
- `next.config.ts` sets `agentRules: false`: Next 16.3 otherwise appends an agent-rules block to `CLAUDE.md` on `next dev`.

## Restructure log

Phase 1, 2026-10-17. The old site had no traffic (human, Gate 0), so it was removed wholesale. Everything removed is in git history at commit `de85e93`.

**Removed**
- All old routes in `src/app/`: pages (`/`, `15-minute-audit`, `about`, `contact`, `founding-client` + `/apply`, `free-audit`, `how-it-works`, `insights` + `/blog`, `/blog/[slug]`, `/teardowns`, `methodology`, `privacy`, `results` + `/case-studies`, `services` + `/class-a|b|c`, `terms`), custom `admin/**`, client portal `dashboard/**`, `auth/**`, API routes `audit-request`, `auth/[...path]`, `contact`, `founding-client-apply`, `newsletter`, `pdf-lead`, 14 `opengraph-image.tsx`, old `layout.tsx`, `not-found.tsx`, `globals.css`.
- `src/components/**` (28 files), `src/lib/**` (auth, db, email, og-image, sanitize, schema), `src/proxy.ts`.
- `db/schema.sql`, `SETUP.md`, `_reference/**`, `design/**`, `Background.svg`, `Background_preview.png`, `public/{file,globe,next,vercel,window,Background}.svg`, `public/hero-analytics.png`, stock `README.md`, `package-lock.json` (npm → pnpm).
- Dependencies: `@neondatabase/auth`, `@neondatabase/serverless`, `@vercel/blob`, `recharts`, `validator`, `@types/validator`, `react-markdown`, `resend` (re-add with the newsletter sync).

**Kept**
- `public/logo.svg`, `public/logo-capitalized.svg`, `public/logo-lowercase.svg`; favicon moved to `src/app/(frontend)/icon.svg`.

**Added**
- Payload 3.91.0 in place: `src/payload.config.ts`, `src/app/(payload)/**` (verbatim from `templates/blank` at v3.91.0), `src/app/(frontend)/**` placeholder, boot-scaffolding `users` + `media` collections (revised at Gate S), `src/access/roles.ts`, `src/lib/env.ts`, `src/app/api/health/route.ts`, `src/migrations/`.
- `Dockerfile`, `.dockerignore`, `docker-compose.yml` (local Postgres only), `.env.example`, `.github/workflows/{build,release}.yml`.
