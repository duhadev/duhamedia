# Homepage sections redesign ("home B"), approved 2026-11-09

The owner reviewed these mockups on the Claude Design canvas "Homepage Redesign"
(artifact `1qGHzsc8ToNs5NnvM5r6S7`), commented on them, and ordered them built
("Yes, start building"). That order also counts as the one-line mini Gate S for any
additive schema change this needs. The files here are the visual spec.

- `*.dc.html` are Design-canvas artboards. Read the markup inside `<x-dc>`. `{{used}}`/`{{cap}}`
  are 3 / 7 (from the `scarcity` global on the real site). `<sc-for>` loops are expanded by the
  `renderVals()` script at the bottom of each file. `/_blob/<id>` image URLs do not resolve
  outside the canvas. The matching logo files are in `public/brand/tools/` (Toolkit uses the same
  logos as /services).
- `renders/desktop-1440.png` — all five desktop sections, top to bottom.
- `renders/phone-390.png` — `Mobile.dc.html`, all five sections at 390 px.
- Links render ink with a 2px ink underline. Blue links in a render are a render artifact.

Tokens are the site's existing ones: ink `#111`, wine `ground-accent`, `gray-light` bands,
hairline `border-divider`, Archivo Black display, DM Sans body. The mockups use `#5F5A53`
for small grey text because `gray-warm` fails contrast at 11–14 px. Use the site's existing
text-muted token if one exists. Otherwise raise it at Gate 1 rather than adding a token.

## New homepage order (overrides the locked page-1 order; log it in the Decision log)

1. Hero (unchanged)
2. **Capacity strip, compact** (`Main.dc.html`)
3. **Two jobs. One team.** (`TwoJobs.dc.html`)
4. Mini CTA strip (unchanged)
5. **Your project, start to finish.** (`Process.dc.html`)
6. **The toolkit** (NEW, `Toolkit.dc.html`)
7. Case study feature "The work, up close." (unchanged)
8. **One founder, no layers.** (`Founder.dc.html`). It ABSORBS the "Who you'd work with /
   Chicago operators, not account managers" intro section, which is REMOVED from the homepage.
9. Final CTA (unchanged)

## Per section

### 2 · Capacity strip
- About 140 px tall, down from about 367 px. `gray-light` band, hairlines top and bottom.
- Two equal halves split by ONE vertical hairline on the page's exact centre line
  (`grid 1fr 1fr`; the left half is right-aligned with 48 px to the line, the right half has 48 px after it).
- Left: loud "**3** / 7" (the used number in wine, "/ 7" in ink, Archivo 56 px), beside
  "CLIENT SPOTS IN USE" (Archivo 16 px caps) and, quiet beneath it, "We cap at 7, so every store gets
  our full attention." The scarcity loud/quiet rule still holds.
- Right: micro label "STORES WE'VE BUILT" with client names in Archivo 24 px at 60 % ink.
- NO slot meter, NO "spots open" label (owner removed them).
- Phone: number + text on one row; hairline; "STORES WE'VE BUILT" and the names on one row, spread to both edges.

### 3 · Two jobs. One team.
- Eyebrow "What we do", H2 "TWO JOBS. **ONE TEAM.**" (accent on "One team."), lede on the right:
  "Start with the store, or start with the marketing. Same people either way."
- 2px ink rule, then two columns split by a hairline. No cards.
- Each column: micro label ("Service 01 · Build your store" / "Service 02 · Grow your store"),
  H3 ("First, we build it." / "Then we **grow it.**"), and a big 88 px numeral on the right
  ("01" ink / "02" wine), then a one-line lede and a 3-stat row between hairlines:
  - Build: **$7K** "Builds start at" · **55hrs** "Hands-on, per build" · **30hrs** (wine) "Of those on design"
  - Grow: **1hr** "Planning call, monthly" · **3–4hrs** "Filming with you, in person" · **3** (wine) "Plans, settled quarterly"
  - Unit style is the owner's: no space, "hr"/"hrs".
- Four bullets each, with 8 px wine squares and a bold lead-in (copy in `TwoJobs.dc.html`).
- Links: "How the build works →" / "What we run →". The Grow column carries the inline note
  "Marketing: three plans, settled quarterly. Ad spend is separate."
- The long paragraphs on the live homepage are gone; that detail lives on /services.
- Phone: the columns stack, the numerals shrink to 56 px, and the stats stay three across.

### 5 · Your project, start to finish.
- Replaces the live auto-advancing accordion. `gray-light` section.
- Eyebrow "How it runs", H2 with accent "start to finish.", sub "A free call, a written plan, then eight steps in two phases. Marketing is optional."
- Pre-strip: a 3-cell white row with a 2px ink border: Day 0 / Within 72 hours / After you sign off
  (the same copy as /services).
- Then ONE 8-column row: an ink bar "PHASE 1 · BUILD YOUR STORE" over cols 1–6, a wine bar
  "PHASE 2 · GROW (OPTIONAL)" over cols 7–8; cells numbered 01–08 (07–08 in wine) with a title and one line.
- Footer: "Build only? Steps 7 and 8 are optional." and "The full process →" (→ /services process anchor).
- Phone: the pre-strip stacks; each phase keeps its bar, with steps two per row under it.
- This is the same content as /services' process section. REUSE that block/variant if one exists.
  Do not fork it.

### 6 · The toolkit (NEW section)
- Eyebrow "The toolkit", H2 "TOOLS YOU KNOW. **ACCOUNTS IN YOUR NAME.**", lede "Every plan includes the full toolkit. The store, the ads and the audience stay yours."
- A 4×3 hairline grid (1 px gaps on the hairline colour; tiles are not cards). Tile = 28 px logo,
  bold name, grey sub-label, and a right-aligned micro tag BUILD (grey) / GROW (wine).
  Order: Shopify, Claude Design, Meta Ads, Instagram (Posts, Reels, Shop), Facebook, TikTok,
  Google Business Profile, Search Console, GEO (stroke icon, no logo), Microsoft Clarity,
  Shopify Email; the 12th tile is an ink link tile "SEE EVERY TOOL ON SERVICES" with a square
  outlined arrow ICON (Phosphor Bold style, square caps, not a typed "→"; the owner asked for this) → /services.
- Trademark line underneath, as on /services.
- Phone: two columns, no BUILD/GROW tags, link tile reads "EVERY TOOL" + arrow icon.
- The tool data already exists for /services. Reuse it if it can be shared; do not duplicate the list in a second place without saying why.

### 8 · One founder, no layers.
- Left column: eyebrow "Who you'd work with", H2 "ONE FOUNDER, **NO LAYERS.**", and three paragraphs
  (owner-approved trims in `Founder.dc.html`). NO pull quote (owner removed it). Buttons: Book a
  Call (solid ink) + "More about us →".
- Right column, 380 px: the LIVE founder profile card exactly as it is today (2px ink border, hard
  shadow, square photo, name, role, socials with icons), but with **no bio paragraph on the
  homepage** (owner). Socials stay on ONE line (13 px, 16 px icons, spread across the card).
- Phone: as live: text, buttons, then the card with the round 80 px avatar beside the name.

## Out of scope
Hero, mini CTA, case-study feature, final CTA, footer: unchanged.
