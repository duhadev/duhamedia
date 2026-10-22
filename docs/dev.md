# Developer documentation — duhamedia.com

**How to use this doc:** find the page you are working on in the table of contents, then the unit (block, collection, global or integration) under it; each entry lists its files, fields, wiring and notes. Site-wide units, deployment, integrations and the restructure log have their own sections at the end.

Maintained by the `dev-docs` subagent after each unit lands. Facts only. Env vars are named, never valued.

Entry format for every unit: **Files** / **Fields & schema** / **Wiring** (registration, pages using it, revalidation, migration) / **Notes**. A unit used on several pages is documented once, under the first page (in site order) that uses it; later pages link to that entry.

## Table of contents

- [Frontend foundation (B0)](#frontend-foundation-unit-b0)
- [Site chrome (B1)](#site-chrome-unit-b1)
- [Page router (B2)](#page-router-unit-b2)
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
3. [Work hub](#3-work-hub)
4. [Services Hub](#4-services-hub)
5. [Shopify Theme Development](#5-shopify-theme-development)
6. [Marketing](#6-marketing)
7. [Testimonials](#7-testimonials)
8. [About](#8-about)
9. [Book a Call](#9-book-a-call)
10. [Thank You](#10-thank-you)
11. [FAQ](#11-faq)
12. [Contact](#12-contact)
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
- `src/blocks/index.ts`: `pageBlocks` (block configs only; 9 blocks registered by B3, in this order: `Hero`, `MiniCTAStrip`, `FinalCTA`, `ProofStrip`, `CaseStudyCards`, `TestimonialRow`, `TwoTrackPanels`, `PhaseTimeline`, `TeamIntro`; the order is the admin "Add section" picker order). Must not import React or CSS because `payload.config.ts` loads it.
- `src/blocks/components.ts`: `blockComponents` (`blockType` to component), typed `{ [K in PageBlockType]: ComponentType<BlockData<K>> }`; a missing entry is a type error. Keys: `hero`, `miniCTAStrip`, `finalCTA`, `proofStrip`, `caseStudyCards`, `testimonialRow`, `twoTrackPanels`, `phaseTimeline`, `teamIntro`.
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
- `src/components/chrome/SiteLogo.tsx`, `NavLink.tsx`, `PageShell.tsx`, `index.ts` (barrel).
- `src/lib/chrome.ts`: `getChrome()` (React `cache`, `server-only`; Local API `findGlobal` on `navigation` and `site-settings`, `depth: 1`, `overrideAccess: false`), plus `toNavItems` / `toNavItem` (drop links with no text or unresolved destination) and `getNewsletterHref()` (published `newsletter` page lookup).
- `public/logo-duha.png`: logo mark, rendered unoptimised.

**Fields & schema**
- None changed. Reads existing fields only:
  - Header links: `navigation.header.links`. Header CTA: `navigation.header.cta`.
  - Footer brand line: `site-settings.footerTagline`.
  - Footer columns: `navigation.footer.standard.columns[]`.
  - Newsletter nudge: `navigation.footer.standard.newsletterNudge.{heading,line,buttonLabel}`.
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
- The nudge button links to the published `newsletter` page; the button is hidden while that page is unpublished or missing.
- Fallbacks:
  - A global read failure logs `console.error` and renders minimal chrome (logo, no links, bare ©).
  - Unresolved links and empty columns are dropped.
  - The menu toggle renders only when there are links or a CTA.
- Revalidation: unchanged. The globals already revalidate on save and the frontend is `force-dynamic`.
- Migration: none.

**Notes**
- No inline newsletter form in the footer yet; the nudge is link-only (flag F42, pending the form-rendering block).
- Gate 2 accessibility findings are pending a human decision (F41): skip link, logo double accessible name, footer column title semantics, duplicate `Main` nav label (desktop and mobile navs both use `aria-label="Main"`).

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
- Sitemap (`/sitemap.xml`): `find` on `pages` with `_status: published`, slug not `404`, `depth: 0`, `draft: false`, `overrideAccess: false`, `limit: 0`, sorted by `slug`. Documents with `noindex === true` or `zeroLeakage === true` are dropped in code (an SQL `<> true` would also drop NULL rows). `home` appears once, as `<SITE_URL>/`. `lastModified` is `updatedAt`. `/_showcase` and `/_preview` never appear. A DB failure is a 500, not an empty sitemap. Only `pages` are listed; case-studies, posts and lead-magnets are added when their routes land. Same sitemap in every environment (not filtered by `APP_ENV`).
- Robots (`/robots.txt`): `Sitemap: <SITE_URL>/sitemap.xml` always. Not production: `User-agent: *`, `Disallow: /`. Production: `Allow: /` and `/api/media/file/`; `Disallow: /admin`, `/api/`, `/_showcase`, `/_preview`.
- `readingProgress`: `PageView` renders `<ReadingProgress />` before `<main>` when `page.readingProgress` is true (flag set per page; About and FAQ per `Pages.ts`). The component is a `'use client'` island because it reads scroll position: a fixed 4px bar (`--reading-progress-width`) on the left edge in `accent-primary`, `aria-hidden`, `pointer-events-none`, height driven by `transform: scaleY(0..1)`, rAF-throttled scroll and resize listeners, no transition.
- Revalidation: unchanged. Everything is `force-dynamic` and read per request; the `pages` hooks (tag `pages` plus the page path) still run on publish.

**Notes**
- Live preview: autosave is off (S3/F21), so the live pane shows the last **saved** draft and does not auto-refresh on Save draft. Open decision, tracked as F57.
- Organization / LocalBusiness JSON-LD is not built. There is no JSON-LD in the page output yet.
- Open SEO findings, F65 (Gate 2, none applied): `getSiteUrl()` falls back to `http://localhost:3000` when `SITE_URL` is unset, so a production container without it would emit localhost canonicals and sitemap URLs silently (and `getSiteUrl` and `siteOrigin` are two separate helpers); home canonical vs sitemap trailing-slash consistency; the `/` placeholder (no home doc) is indexable in production and absent from the sitemap; the seo-defaults placeholder description and OG alt are live until seeded; seed must set `noindex` on Thank You and gated templates; Organization/LocalBusiness JSON-LD (page scope); `not-found` has no description.
- QA of the authenticated preview and the redirect create/verify/delete test were pending when this entry was written.
- Case-study cards link to `/work/<slug>`; that route is not built yet (case-studies, posts and lead-magnets have no frontend route).

---

## 1. Homepage

Locked section order: Hero → Scarcity strip → Client logo strip → Featured case studies → Mini CTA strip → What we do → Process timeline → Founder/team + about → Testimonials → Final CTA → Footer (standard).

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

Data source: the [`case-studies` collection (C7)](#case-studies-unit-c7) (site-wide section). No blocks documented yet.

## 3. Work hub

*No units documented yet.*

## 4. Services Hub

*No units documented yet.*

## 5. Shopify Theme Development

*No units documented yet.*

## 6. Marketing

*No units documented yet.*

## 7. Testimonials

*No units documented yet.*

## 8. About

*No units documented yet.*

## 9. Book a Call

*No units documented yet.*

## 10. Thank You

*No units documented yet.*

## 11. FAQ

*No units documented yet.*

## 12. Contact

*No units documented yet.*

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
- Entries (B3, in order): `hero` x2, `proofStrip` x4, `caseStudyCards` x4, `miniCTAStrip` x2, `twoTrackPanels` x2, `phaseTimeline` x2, `teamIntro` (intro) x2, `testimonialRow` x4, `teamIntro` (founder-card) x2, `finalCTA` x3. Fixtures are static objects typed to the generated block rows, so fallback and empty states render without database content (except `caseStudyCards` / `cards — featured (DB)`, which reads published studies).

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

The submit-side data model (forms, submissions, delivery fields) is documented in [`form-builder` (P1)](#form-builder-unit-p1). None of the integration code is built yet: the open `TODO(integration)` items (form handler with Turnstile, delivery and newsletter-sync jobs, re-send endpoint, "Failed deliveries" preset) are listed in the [P1 Wiring section](#form-builder-unit-p1).

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
