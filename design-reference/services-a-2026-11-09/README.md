# /services redesign — direction A ("brochure spine"), approved 2026-11-09

The owner reviewed these mockups on the Claude Design canvas (artifact
`E3xGhrf2gZgMvE1TKyvtnh`, "Duha Media Home") and approved them, then asked for them to be built
into the site. The files here are the visual spec. The `.html` files are Design-canvas artboards:
read the markup inside `<x-dc>` and the `<helmet><style>` classes. `/_blob/<id>` image URLs do
not resolve outside the canvas; the matching files are in `public/brand/tools/`, plus three new
ones in `logos/` here.

- `desktop-1440.html` — the whole page at 1440 px.
- `mobile-390-part1.html` — 390 px, header → Grow section.
- `mobile-390-part2.html` — 390 px, process → footer. The page is split in two only because the canvas caps a board at 8000 px.

All copy comes from the brochure or the live page. Copy changes the owner made are listed below.
Nothing is invented.

## Section order (overrides the locked page-4 order; log it in the Decision log)

1. **Hero.**
   - Label "Services", led by a 28 px logo disc (the new subpage standard, see below).
   - H1: "We build it." then, on its own line at every width, "Then we grow it." in wine.
   - Lede, then two buttons: Book a Call (solid) and See pricing (ghost, `#pricing`).
   - One plain proof line under a hairline: "Builds start at **$7K**. About **55 hands-on hours** per build. **7 clients** at most, at once." Figures in ink, the rest grey. NOT big metric numbers.
   - Background: dot grid, plus a cropped corner disc (240 px desktop, 140 px mobile).
2. **Build (Service 01 · Build your store).**
   - "First, we build it." with a two-column body.
   - **Left column:**
     - Why-it-matters paragraphs.
     - "The build, in numbers" grey panel: $7K "Starting price / for a build." · ~55 "Hours / per build." · ~30 "Of those on / design alone.", each caption breaking where the slash is.
     - "You own it" box.
   - **Right column:**
     - Three h3 groups of bullets.
     - One differentiator only: "No templates". "Built by a developer" was REMOVED by the owner.
     - "See the build →".
   - **Preferred tools · Build** row (see Tools).
3. **Grow (Service 02 · Grow your store).**
   - "Then we grow it.", with a wine rule under the heading.
   - **Left column:** paragraphs, the "Every month" panel (1 hr / 3–4 hr) and the "How it's paid" box.
   - **Right column:**
     - Three h3 groups: Paid ads / Organic social and creators / Search, email and print.
     - One differentiator only: "One person accountable". "Small on purpose" and "Local" were REMOVED by the owner.
     - "See the marketing →".
   - **Preferred tools · Grow · accounts in your name** row, with the trademark footnote once under it.
   - The big "01"/"02" numerals show on desktop only (hidden on mobile).
4. **How we work (grey band).**
   - Step 0 strip: Day 0 free 45-minute call / Within 72 hours a dated plan / After you sign off, work starts.
   - Then the Phase 1 bar with steps 1–6 and the wine Phase 2 bar with steps 7–8.
   - Mobile: the step-0 strip stacks, and the steps sit 2 per row with hairline gaps.
5. **Pricing (`#pricing`).**
   - **$7K build box:** 2 px ink border, a short list, and a "Book a call about a build" button.
   - **"Grow your store" plans box:** 2 px WINE border.
     - Desktop keeps a table (Plan / First quarter / After that).
     - Mobile uses one card per plan: grey card with a 4 px ink top bar, 16 px apart.
     - Every first-quarter figure is a big Archivo number with its unit.
     - Standard shows **20%** "of online revenue" · "or" · **30%** "of online profit" as two equal figures.
     - Prepaid **$1,000** flat, then **$1,500** a quarter. Ramp-up **10%** of online revenue, then the Standard rate.
     - "After that" is bold.
     - Then a ghost "Book a call about marketing" button and the fine print.
   - The old bold "At $100K a year, every plan moves to a fixed rate." line under the plans is REMOVED (it duplicated the first term).
   - Promise line, full width, Archivo: "We build and grow your store for one reason: we want your business to succeed." + wine "Everything we charge is set up to help you grow, not hold you back."
   - **Terms**, FAQ-style `<details>`, closed by default, plain text (desktop max 760 px):
     - "At $100,000 a year"
     - "Switching early"
     - "The agreement"
6. **The work, up close.**
   - The Abu Oud study preview: the existing `StudyPreview`, real screenshots.
   - The three facts are CENTRED (labels and numbers).
7. **FAQ "Straight answers."**
   - Heading on the left, 4 questions as `<details>`.
   - On mobile, "All questions →" sits BELOW the last question.
8. **Final CTA (ink band).**
   - Headline: "Start with a call, leave with a plan." (owner's copy; replaces "…written plan in 72 hours.").
   - Capacity line, then Book a Call.
9. **Footer.** Standard, unchanged.

Dropped from the old page: the newsletter band (footer field stays), the separate "Either door starts the same way" section (folded into step 0), and the standalone Preferred tools section (now one row per stage).

## Tools rows

Each tile is a logo (brand colour) + name + a grey "what for" line. Desktop: auto-fill grid. Mobile: 2 per row, logo above name.

**Build:**

| Tool | What for |
|---|---|
| Claude Design | Store design |
| Shopify | Custom theme |
| Instagram Shop | Sales channel |
| Facebook Shop | Sales channel |
| TikTok Shop | Sales channel |

**Grow:**

| Tool | What for |
|---|---|
| Meta Ads | Paid ads |
| Instagram | Posts, Reels, Shop |
| Facebook | Posts, Shop |
| TikTok | Posts, Shop |
| **Collaborations** | Through Instagram DMs |
| Google Business Profile (Google "G") | Search and Maps |
| Google Search Console | SEO |
| **GEO** | Answers in AI tools |
| Shopify Email (Shopify mark) | Newsletter |
| Claude Design | Flyers |
| Microsoft Clarity | What visitors do |

**Collaborations** and **GEO** have no product, so they get an ink icon tile instead of a logo: Phosphor Bold `handshake` and `sparkle`, inline SVG, `currentColor`.

The owner confirmed the tools: Shopify tools, Google Search Console, flyers made in Claude Design, collaborations done by hand through Instagram DMs, store design in Claude Design.

New logo files: `logos/google.svg` (Simple Icons 16.37.0, hex #4285F4), `logos/googlesearchconsole.svg` (#458CF5) and `logos/claude.svg` (#D97757), all CC0 with the fill set. Add them to `public/brand/tools/` and its README in the same format as the existing rows.

## Subpage logo standard (owner-approved 2026-11-09)

- **Every subpage hero:** the page label is led by a 28 px logo disc (the 4-band silhouette) instead of no mark. This supersedes the 2026-11-08 decision "hero eyebrows = grey caps, no diamond" for the label's leading mark.
- **Pages with a big hero (Services, About):** also carry a cropped corner disc, 240 px on desktop and 140 px on mobile, over the dot grid.
- **Full-size disc:** only the homepage hero and the final CTA.
