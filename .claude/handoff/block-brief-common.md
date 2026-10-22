# Common brief — block-coder dispatches, big step 5 (pages 7–12)

Repo: /home/abdurrahman/Documents/Repositories/DuhaMedia. Payload 3.91.0, Next 16.3.8, React 19.2.6, Tailwind 4.1.18 (CSS-first). pnpm is NOT on PATH: use `npx -y pnpm@11.28.3 <script>`.

## Scope
Write ONLY `src/blocks/<Name>/config.ts` + `src/blocks/<Name>/Component.tsx` (+ a small client island file inside the same folder only when interactivity demands it, reason stated). Do NOT edit src/blocks/index.ts, src/blocks/components.ts, src/showcase/registry.ts, src/fields/*, collections, chrome, CLAUDE.md, PROGRESS.md, docs/, design-reference/. The integrator registers the block afterwards. Do not commit. Other block-coders are working in parallel in their own src/blocks/<Name>/ folders — never touch theirs.

## Read first
- CLAUDE.md (repo root): block-coder role; Site structure & content rules (1 launch state/fallbacks, 2 scarcity loud/quiet, 3 placeholders — no invented facts, 5 pricing only inline, 6 component reuse, 7 mobile-first + 44px); Payload conventions.
- SCHEMA.md §3 (factories), your block's §8 entry, and the §9 rows for the pages in your dispatch.
- docs/dev.md "Frontend foundation (unit B0)" (primitives, registry steps).
- design-reference/MERGED.md §2–§5 (tokens, patterns, imagery). Gold standard: the page design file(s) named in your dispatch under `design-reference/project/` — find your section by `data-screen-label`; port BOTH the `isDesktop` and `isMobile` builds. Mobile build applies below `md` (768px), desktop from `md`; write mobile-first classes.
- Verification-first: check Payload 3.91 docs for any field/admin option you use for the first time.
- Reference implementation already integrated: src/blocks/Hero/ (config + component). Match its idiom.

## Build rules
- Config: `slug` camelCase, `interfaceName: '<Name>Block'`. `variant` select gains ONLY the new variant(s) named in your dispatch (later pages add more). Use admin descriptions a marketer understands.
- Shared field factories — import RELATIVELY from `'../../fields'`: `eyebrowField({ description? })` (a row: use directly in `fields`, do not spread), `...headlineFields({ required?, description? })` (heading + accentPhrase, spread), `linkField(...)`, `pricingNote()`, `metricFields()` — read src/fields/index.ts for exact signatures. Never redefine them locally. If a factory SCHEMA §3 names is missing (e.g. `scarcityRef()`), define it locally in your config in the exact SCHEMA §3 shape, export it, and say so — the integrator will promote it.
- Component: server component by default; props typed as `BlockData<'<slug>'>` from `@/blocks/types` — this only resolves after registration, so until then type against a local interface that matches the config exactly and say so.
- Compose primitives from `@/components/ui`, never restyle/fork: Container, Section (tone light|grey|dark, pad default|tight|none, divider none|top|bottom|both), Eyebrow (tick, muted), AccentHeadline (text, accent, level 1|2|3, as, accentColor primary|ground), Button/ButtonLink/buttonClasses (primary|ghost|ghost-light|dark; sm|md|lg; 44px min), CMSLink/resolveLinkHref (hides unresolved links), Media (next/image, alt from doc), DotMatrix (fade corner|edges, onDark, intensity). Heading level: sections are h2 (only Hero is h1).
- Tokens only from `src/app/(frontend)/styles.css` @theme (read its header mapping comment). Arbitrary values only where no token exists, using the exact design value.
- Every user-facing string, image, link is a field. Repeatables are arrays (add/remove/reorder). Relationships declare maxDepth. Nothing crashes on missing optional data; empty optional parts render nothing; unresolved links render nothing. Standing rule: proper error reporting — log server-side problems with console.error, never a blank/crashing page.
- Placeholder copy in fixtures: brand voice, demonstrative, clearly non-final, no lorem ipsum, no invented business facts or client names/numbers presented as real (use bracketed placeholders like `[Client A]`, `[N]`).
- No new dependencies. Icons: use what the repo already has, else inline SVG.

## Visual verification (required)
Do NOT use the Playwright MCP (QA agents own that browser; parallel use collides). Instead:
1. Create a throwaway preview route with a NON-underscore name unique to you, e.g. `src/app/(frontend)/tmp-<slug>-preview/page.tsx`, rendering your component with fixture data (and every fallback/empty state).
2. Screenshot with headless chromium against the already-running dev server (do NOT start another):
   `chromium --headless=new --disable-gpu --hide-scrollbars --window-size=390,2400 --screenshot=<out>.png http://localhost:3000/tmp-<slug>-preview` — repeat for 768 and 1440 widths (adjust height to fit). First request may compile slowly; retry once if blank.
3. Read every screenshot, compare against the design markup/classes, fix, re-shoot.
4. DELETE the temp route before reporting.
Save screenshots in <session scratchpad>/<slug>/.
`npx tsc --noEmit` and `npx eslint src/blocks/<Name>` clean.

## Report back
(Paste every showcase fixture object IN FULL in your report — the temp route is deleted, so the report is the only copy.)
Files touched; every field + what it controls; **explicit editability confirmation** (report rejected without it); client/server split + reasons; fallback/empty states; showcase fixture objects ready to paste (`{ block, variant, viewport?, label, data }`, one per variant AND per fallback state); screenshot paths; remaining design discrepancies; flag candidates, each with the safe default you applied.

## Big step 4–5 additions (binding)
- **Existing blocks are REGISTERED and their homepage variants passed Gate 1.** If your dispatch extends an existing block: the existing variant(s) must render byte-for-byte the same (CLAUDE.md rule 6: no restyling a cleared block). Add new variants as new branches/components inside the folder; never change existing field names/shapes (adding new optional fields is fine; changing defaults of existing fields is not). Re-shoot the existing variant's showcase entries before/after to prove no regression.
- Because existing blocks are registered, verify on http://localhost:3000/_showcase for the existing variants, and use a temp preview route for NEW variants/blocks (unique non-underscore name, delete before reporting). Components are typed `BlockData<'<slug>'>` — after you add fields the generated type is stale until the integrator runs generate:types; in your temp route cast fixtures as needed and say so. If you add fields to an existing block, run `npx -y pnpm@11.28.3 generate:types` yourself so the component compiles (the dev DB is push mode and will auto-add columns; that is fine — the integrator generates the migration). Do NOT run migrate:create.
- QA's browser has a 15px scrollbar: a 768 window is 753px of content. Test 753 and 1009 as well as 768/1024. Below lg (1024) the design has no tablet build; existing blocks use the mobile treatment until lg where the desktop layout would not fit (see Hero, PhaseTimeline). Check whole-page scrollWidth === clientWidth.
- CDP measuring/screenshot scripts from earlier units are in <session scratchpad>/ (shot.mjs, m.mjs, rs.mjs) — reuse them.
- Design-vs-CLAUDE.md conflicts: MERGED.md §9 lists known conflicts and SCHEMA.md §9 marks reinserted (R) and extra (+) sections — follow SCHEMA; report anything new as a flag, don't resolve silently.
- Shared pieces now available (read before writing): `src/components/RichText.tsx` (rich text + safe links), `src/components/forms` (`CMSForm` server component: props form, sourcePath, submitLabel, confirmation, tone, submitVariant/Size, turnstileAppearance 'always'|'interaction-only', classNames slots — layout slots form/fields/footer/submit/turnstile REPLACE defaults; posts to POST /api/form-submit with Turnstile), `src/lib/docPath.ts`, `resolveLinkHref`. Populated relationships carry only each collection's `defaultPopulate` fields (see docs/dev.md "Shared components") — if you need more fields from a related doc, say so rather than re-querying silently.
- Pricing: never a display number (CLAUDE.md rule 5) — even if the design shows one; use pricingNote.
