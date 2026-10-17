# design-reference — Claude Design handoff (read-only input)

Binding source of truth for all visual decisions (CLAUDE.md, "Design source"). Nothing here is
edited by the build; blocks port its markup and tokens into Payload blocks + React components in
Phase 3. Never edit files here except to re-import from source.

## Sources

| # | Source | Link | Local copy | Imported |
|---|---|---|---|---|
| 1 | Design System artifact "duha media" (v3 files layout, last change 2026-10-06 by Arch) | https://claude.ai/artifact/KSz4saFvMmJ78NC3M6cgwT (version `1792260275-e3e9`) | `design-system/` | 2026-10-17 |
| 3 | Claude Design project "Duha Media Design System" (outdated; UI kit `ui_kits/website/index.html`, components, guidelines) | https://claude.ai/design/p/a9da4886-8cd2-4a89-bc2c-d8fe2794aeca | `design-system-project/` | 2026-10-17 — 70 files, reference only |
| 2 | Claude Design project (page designs + its own `_ds/` design system) | https://claude.ai/design/p/d7adf2c6-3dd2-4734-90fd-33d51130563b | `project/` | 2026-10-17 — all 87 files, raw source (`?raw=1`), byte sizes verified against the project listing |

### 1. `design-system/` (imported)
- `README.md` — brand book: character, voice, logo, colour, type, buttons, layout, imagery, history, open items.
- `tokens.json` — colour (Light + "Dark section" themes), type (IBM Plex Sans / Mono, 8 styles), spacing (8 steps), radius (3).
- `components/Button`, `components/Logo`, `components/Cover` — README guidelines + static previews (previews expect the artifact's generated `tokens.css`; open them for reference, not standalone).
- `assets/Logos/duha-mark.svg` — four-band disc mark (vector redraw; the README notes the original export is still wanted).
- `design-system.json` — the artifact's index, kept for provenance.

### 2. `project/` (imported 2026-10-17)
Files the human selected (2026-10-17). Whole project is readable; these are the focus:

- **Design system (project copy):** `_ds/duha-media-design-system-a9da4886-8cd2-4a89-bc2c-d8fe2794aeca/` — `readme.md`, `styles.css`, `tokens/{colors,effects,fonts,spacing,typography}.css`, `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`.
- **Pages (final):** `Homepage`, `Case Study`, `Work`, `Services Hub`, `Shopify Theme Development`, `Marketing`, `Testimonials`, `About`, `Book a Call`, `Thank You`, `FAQ`, `Contact`, `DEV-SEO Article`, `MKT-SEO Article`, `Campaign LP`, `Newsletter`, `Link-in-Bio`, `Lead Magnet`, `Review Hub`, `Legal`, `404` (all `.dc.html`).
- **Shared chrome:** `SiteHeader`, `SiteHeaderMobile`, `SiteFooter`, `SiteFooterMobile`, `SiteFooterMobile v2`, `Sitemap`.
- **Variants / mobile:** `Homepage Fade Edge`, `Homepage (Mobile) {Fade Edge, Full Logo, White, Wine Geometry}`, `GeoHome`, `Intro Animation`, `What Happens Next Cards`.
- **Concept sheets (exploration, not final unless the human says so):** `Article Template Concepts`, `About Article {A,B,C,Concepts}`, `Arc Section Concepts (Mobile)`, `Build Run Mobile Concepts`, `Case Study Concepts`, `Contact Form Concepts`, `Dev Hero Mobile Concepts`, `DEV-SEO Article Concepts`, `Development Page Concepts`, `Founders Section Concepts`, `Link-in-Bio Concepts`, `Marketing Body Concepts`, `Marketing Engine Concepts`, `MKT-SEO Article Concepts`, `MKT-SEO Hero Concepts`, `Newsletter Issues Concepts`, `Services Hub Concepts`, `Testimonial Concepts`, `Testimonials Page Concepts`, `Why Both Together Concepts{, v2}`, `Wine Geometry Explorations`, `Work Page Concepts`.
- **Scripts:** `image-slot.js`, `site-fx.js`, `support.js`.
- **Maps:** `maps/map-live.html`, `maps/map-locator.html`, `maps/map-mono.html`.
- **Images:** `assets/logo-duha-01.png`, `assets/logo.png`, `scraps/{bookcall-proof,home-testi,svchub-testi}.png`, `uploads/pasted-*.png` (4).

**Re-import:** via the `claude_design` MCP — `render_preview` gives a browser-only preview link; the Playwright browser fetches each file with `?raw=1` and saves to disk. Never persist the preview link (it carries a token).

## Precedence (human decision, 2026-10-17)

**Clarified 2026-10-17 (human): whatever has the solid red / wine banded disc is the newest work and the gold standard** — i.e. the page designs in `project/*.dc.html` (Duha Media project). The design-system copies that still show the multicolour yellow/pink disc and yellow geometry are **outdated**: `project/_ds/…`, `design-system-project/` (the separate "Duha Media Design System" project, incl. its `ui_kits/website/index.html`) and `design-system/` (April artifact). Use them only to fill gaps the pages leave, never against the pages. `project/Sitemap.dc.html` is the index of the page designs.


**Merge the two, with the Claude Design project (source 2) as the gold standard.**
1. **Source 2 (design project, incl. its `_ds/`) wins** on everything it defines: page designs, components, tokens, copy patterns.
2. **Source 1 (design-system artifact) fills gaps only** — brand fundamentals the project doesn't define (fonts, brand colours, type scale, logo rules), where they don't contradict source 2.
3. **Source 1's business content is overridden**: Class A/B/C tiers, "Shopify CRO studio" positioning, small-business ICP, "Get a free site audit" CTA examples → replaced by source 2 + CLAUDE.md (Integrated Ecommerce Growth Partner, Build / Operate / Independence, Book a Call).
4. CLAUDE.md still governs architecture, section order and content rules; a true conflict between CLAUDE.md and source 2 is still a stop-and-ask.

The merged result is written to `design-reference/MERGED.md` (+ merged tokens) once source 2 is imported; the raw sources stay untouched for provenance.

## Known conflicts (resolved by the precedence rule above unless noted)

Source 1 (the artifact) is the **April 2026 brand guide**; CLAUDE.md (2026-10-17) and, likely,
source 2 are newer. Where they disagree, ask the human — do not pick.

1. **Positioning:** artifact says "Shopify development and CRO studio", tiers "Class A / B / C", ICP "small-business owners". CLAUDE.md: "Integrated Ecommerce Growth Partner", Build / Operate / Independence, ICP $500K–$5M/yr.
2. **CTA copy:** artifact's primary example is "Get a free site audit"; CLAUDE.md's primary CTA is Book a Call.
3. **Two design systems:** artifact (`design-system/`) vs the project's own `_ds/duha-media-design-system-…`. Which is binding once both are here — presumably the project copy, as the one the page designs were built against.
4. Artifact open items: no original logo export or wordmark file; Display 56px vs Tailwind 48px; H3 18px vs 20px; heading line-heights are Tailwind defaults.
