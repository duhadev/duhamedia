# Service pages redesign — approved 2026-11-09

The owner reviewed these mockups on the Claude Design canvas "Service Pages Rework"
(artifact `YQMR2zvQRERm7C1E27MEnq`), commented on them, and ordered them built ("I think this is
good. Go ahead and build."). That order also counts as the one-line mini Gate S for any additive
schema change this needs. The two `.dc.html` files here are the visual spec. Read the markup inside
`<x-dc>` and the `<helmet><style>` classes. `/_blob/<id>` image URLs do not resolve outside the
canvas; the logos are the ones already in `public/brand/tools/` and `public/logo.svg`.

- `Build.dc.html` → `/services/shopify-theme-development`
- `Marketing.dc.html` → `/services/marketing`

URLs, the header and the footer stay as they are.

## Why (the owner's brief)

The two service pages strayed from the site: a dark ink hero, and a body that repeated /services
word for word. /services is now the overview. Each service page is the full spec sheet, in the same
white look as /services and the homepage. It answers, in order: is this for me, what happens step by
step, what do I do, what do I get and own, what does it cost, and straight answers.

## Visual rules the owner set in review (binding)

- **White hero**, the same as /services: dot grid, 240/140 px corner disc, 28 px logo disc leading
  the label, breadcrumb micro line. On the right: an **"at a glance" card** (white, 2 px ink border,
  `shadow-lift` 0 6px 0 ink), with a micro title, 4 label/value rows (Archivo 32 px values, one in
  wine) and a grey footer line. It REPLACES the grey proof line. Stacks under the buttons on a phone.
- **Restraint.** The heavy 2 px ink outline appears only on the hero card, the revision table and the
  price box (Build), or the hero card (Marketing). The wine-bordered plans box is the existing
  /services one. No ink chips or tags. The final CTA is the ONLY ink section. No stat row repeats a
  number the hero card already shows.
- **Wine accent on every section H2**, on the phrase that carries the point (the exact phrases are in
  the artboards, `<span class="w">`). Never wine text on ink.
- **"Jump to" index:** a sticky white bar under the hero, with a 1 px hairline above and a 2 px ink
  rule below. A menu icon, a "Jump to" micro label and a divider, then numbered links (01–07, numbers
  grey). The current section gets a 4 px wine underline (scroll-spy). Scrolls sideways on a phone.
- **FAQ and Terms accordions are exclusive.** Opening one closes the others in the same group, and
  the +/– icon follows the open state. This holds SITE-WIDE for AccordionFAQ (memory:
  feedback_faq_one_open).
- **Revision table:** the Revision column, including its header, is on the `gray-light` band; the
  header has a 4 px ink top bar. Scratch build stays white.

## Section order (overrides the locked page 5 and page 6 orders; log it in the Decision log)

### Build (`/services/shopify-theme-development`)
1. Hero + at-a-glance card ($7K · ~5wks · ~55 · ~30 in wine · "No templates. Yours from launch day.")
2. Jump-to index (7 links)
3. Who it's for: copy + a grey card with "Right for you if" (4) / "Not for you if" (3, outlined squares) + "Not sure?" line
4. Revision or scratch: comparison table + the 72-hour line
5. The six steps (grey band): Day 0 / 72 hours / sign-off hairline strip, a schedule line, then 6 rows: numeral (grey, 04 in wine) · title + text (+ bold "Your sign-off: …" on 01 and 05) · "You" / "You get"
6. Where the hours go: a wine 30 / grey 25 bar with captions. No stat row.
7. What you get: 5 → **4** rows (see P1) + a grey "You own it" panel + the Build tools row
8. The work, up close: Abu Oud (the existing StudyPreview), padding 64 top / 40 bottom
9. Price: copy left; the build box right ($7K + 3 rows: Scratch from $7K / Revision priced on the call / Marketing optional → link) + button
10. "Then we grow it" grey band → marketing page
11. Build questions (FAQ, 7)
12. Final CTA (the live FinalCTA)

### Marketing (`/services/marketing`)
1. Hero + at-a-glance card (1hr · 3–4hrs in wine · 3 · 2qtrs · "Ad spend is separate. Accounts in your name.")
2. Jump-to index (7 links)
3. Who it's for: copy + a grey card (4 bullets, "No store yet?" link)
4. How a month runs (grey band): a 4-cell hairline grid, no big numerals
5. Ads first, then the numbers decide: 2 grey panels → an outcomes column + "You pay the same plan either way."
6. The toolkit: 3 grouped hairline grids of tool cards (logo/icon, name, line) + the trademark note
7. Who does what (grey band): You / Us columns with hairline tops
8. Your first two quarters: a 4-cell hairline row
9. Plans and terms: the existing /services PricingPlans plans table + fine print + Terms (exclusive) + the promise statement + a ghost button
10. Proof (grey, 64 px): a TESTIMONIAL fallback, NOT the Abu Oud build study (the existing fallback pattern; no case study until a marketing study exists)
11. Marketing questions (FAQ, 6)
12. "No store yet? First, we build it." grey band → build page
13. Final CTA (the live FinalCTA)

Dropped from both live pages: the dark hero, the ServiceSheet copied from /services, the removed
differentiators ("Built by a developer", "Small on purpose", "Local"), and the "Where people usually
start" cards (now the table).

## PM defaults for the open CONFIRM tags (no invented facts)

- **P1.** Drop the "Mobile-first" row in What you get (the claim is unconfirmed).
- **P2.** Research "You get": "The findings, before design starts." Ship it without the tag.
- **P3.** Marketing "Filming is in person, in Chicago." Ship it without the tag.
- **P4.** Drop the "minimum ad budget" tag. Keep the "No store yet?" line.
- **P5.** The marketing proof slot renders a published testimonial (existing fallback). The dashed annotation box on the artboard is NOT built.
- **P6.** FAQ answers come from the `faqs` collection verbatim (shared with /faq), never from artboard text.
- **P7.** Final CTA = the live FinalCTA block and styling. Only the heading and lines come from the artboard.
