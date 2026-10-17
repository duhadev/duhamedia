# Duha Media Design System

**Duha Media** — Integrated Ecommerce Growth Partner, Chicago. One accountable team that builds the store (Shopify Theme Development, from $5K), operates the growth engine (Marketing, from $1K/mo), and trains the client toward independence (Build Foundation → Operate Engine → Build Independence). ICP: established businesses netting $500K–$5M — physical, online, or hybrid — under-scaled online, agency-burned. The site's job is to make the integrated-partner claim *checkable*: numbers over adjectives.

**Sources provided:** Design Brief v3 (2026-07-23, pasted into chat — reconciliation record, palette, type, tone, full page-by-page locked wireframes) and `uploads/logo.png` (313×313 circle mark, four horizontal bands). No Figma, no codebase, no font binaries — components and UI kit are authored from the brief, not recreated from an existing product.

## CONTENT FUNDAMENTALS
Voice: **direct, evidenced, operator-confident, unsentimental, occasionally dry.**
- Short sentences. One idea each. Front-load the number when there is one.
- Second person for the reader; first person plural for Duha. Sentence case everywhere except eyebrows/labels (UPPERCASE, +0.08em tracking) and display headlines (often all-caps).
- Banned words: "leverage", "solutions", "holistic", corporate hedging generally. No exclamation marks. No emoji, ever.
- Humor only as dryness. Urgency only where structurally true (capacity), and every urgency claim carries its quiet reason as micro-copy ("We cap at 7 — capacity is our quality gate.").
- The independence claim is stated as fact, never as flourish: "The goal is your team running this without us."
- Name the ICP's scar tissue plainly — vocabulary bank: "wasting another $10k", "agency disappeared after launch", "managing five different freelancers".
- On-brand: "Your store already has the demand. It's leaking it." / "3 builds in progress. We cap at 7."
- Off-brand: "We craft bespoke digital experiences that elevate your brand." / "Unlock your limitless growth potential today!"
- No fake proof, ever: no "coming soon" case studies, no demonstrative studies presented as real. Proof slots fall back to testimonials/metric strips.

## VISUAL FOUNDATIONS
Bold + Technical. A confident operator showing you the dashboard, not a creative studio showing its taste.
- **Color:** warm cream `#FAF7F2` page field; near-black `#111` ink; ONE accent — deep wine `#C20E59` (sampled from the logo's bottom band; brief estimated `#B01458` — client sign-off pending). Accent appears on exactly one highest-priority element per view: the accent headline word, the primary CTA, or the active metric. Never decorative. **Pale yellow `#FCE588` (`--ground-accent`) is the system's second color, governed by the figure/ground rule — "wine is figure, yellow is ground":** wine marks importance (words, numbers, buttons — things you read); yellow marks *place* — geometry content sits on. Yellow appears only as (a) large low-contrast diamond geometry cropped by a section edge, max one moment per section, and (b) quiet structural details: 9px diamond ticks on eyebrows/scarcity facts, 4px testimonial left edges. Never on text, never on interactive elements, never as a semantic marker pointing at content. Gold `#F5C842` and bright pink `#E82561` remain brand-mark-only. Neutrals: `#8A857D` secondary text/dividers, `#EDE9E2` cards & alternate bands. Dark sections invert to `#111` bg with cream text (footer).
- **Type:** Archivo Black (single 900 display cut) for all headings and metrics; DM Sans for body — default weight 500, 700 for labels/emphasis. H1 2.5→4.5rem, H2 2→3rem, H3 1.375→1.75rem, body 1→1.125rem/1.6, small 0.8125→0.875rem. **Metrics are typographic events**: H1–H2 scale Archivo Black numerals, accent color permitted.
- **Backgrounds:** flat solids only — cream, light-gray bands, ink inversions. No gradients, no photography backdrops, no textures. The one geometric motif: a pale-yellow diamond form bleeding behind hero text (DD.NYC pattern, filled + small outline echo), reusable as ground geometry in other sections (e.g. behind the process timeline's terminal step), plus diagonal letter-spaced micro-copy lines flanking.
- **Imagery:** house style is UI-mockup / dashboard-screenshot / floating UI cards. Camera-work (photo/video) only in two slots: Marketing "engine components" section and About/Team. No lifestyle stock, no illustration, no drawn SVG art.
- **Corners & borders:** square. Radius 0 (2px max on inputs); pill radius reserved for badges. Hairline dividers at `rgba(138,133,125,.35)`; heavy 2px ink borders for emphasized outlines.
- **Shadows:** hard offset only (`0 2px 0 #111`, lift `0 6px 0`), no blur, no soft elevation. Cards are flat `#EDE9E2` panels or 2px-ink-bordered blocks.
- **Motion:** static heroes (no ambient motion, no video). Fast scroll-triggered entrances: 450ms translate-up + fade, `cubic-bezier(.16,1,.3,1)`. First-visit logo load-in sequence (mark → wordmark → settles into header), session-flagged. Hard no on scroll-hijacking. Reading progress: vertical accent bar on long-form pages.
- **Hover:** links/ghost buttons fill or underline in ink; primary CTA darkens accent ~8%. Press: translateY(1px), shadow collapses. Transitions 180ms.
- **Layout:** 1200px container, 24px gutters, generous 96px section rhythm (64px tight variant so proof arrives fast). Proof placement beats proof volume: case pulls/testimonials sit immediately before CTAs. 44px minimum hit targets.

## ICONOGRAPHY
- **Library:** [Phosphor Icons](https://phosphoricons.com), **Bold** weight — filled-leaning geometric strokes matching Archivo Black's mass. Loaded from CDN: `<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">`, used as `<i class="ph-bold ph-arrow-right"></i>`. No icon binaries were provided; CDN linkage is the system's canonical method (substitution flagged).
- No emoji, no unicode-glyph icons, no hand-drawn SVG. Icons are functional (list markers, UI affordances), never decorative filler.
- **Logo:** `assets/logo.png` — circular mark of four horizontal bands (pale yellow / gold / pink / wine) with transparent gaps. Wordmark redesign is in flight (brief §9); render "DUHA MEDIA" in Archivo Black next to the mark until it lands. Header is sized to fit either.

## Index
- `styles.css` → `tokens/` (fonts, colors, typography, spacing, effects)
- `assets/logo.png` — brand mark
- `guidelines/` — specimen cards (Design System tab)
- `components/core/` — Button, Badge, Eyebrow, Input, FAQItem
- `components/display/` — AccentHeadline, Metric, MetricStrip, CaseStudyCard, Testimonial, PhaseTimeline
- `ui_kits/website/` — homepage recreation of the locked §8.1 wireframe
- `templates/` — reusable page templates (as added)
- `SKILL.md` — agent-skill entry point

## Intentional additions
No component source existed, so the set is authored from the brief's own named elements: Metric/MetricStrip (brief §3 "metric display style"), AccentHeadline (one accent word), PhaseTimeline (three-phase arc as designed object), CaseStudyCard + Testimonial (proof units with launch-state fallback), plus a standard Button/Badge/Eyebrow/Input/FAQItem core.

## Open flags (carried from brief §9 + build)
- Accent hex: token uses logo-sampled `#C20E59`, superseding the brief's `#B01458` estimate. **Client sign-off required** — a shift cascades through the whole accent system.
- Fonts: no binaries provided; Archivo Black + DM Sans loaded from Google Fonts (exact families, not substitutes — but self-hosted files welcome).
- Icons: Phosphor Bold via CDN, no local copies.
- Accent-on-cream is borderline for small text: CTAs use light text on accent fill; small accent type avoided.
- Hero copy is `[STRATEGIC PLACEHOLDER]` throughout — final copy client-authored.
- No case studies live at launch: CaseStudyCard exists in the system; live surfaces use testimonial/metric-strip fallbacks. Never fake proof.
