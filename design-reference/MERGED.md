# Duha Media — merged design reference

Written by the PM merge on 2026-10-17 from `design-reference/design-system/` (source 1) and `design-reference/project/` (source 2). Both sources are read-only and were not changed. The tokens are in `merged-tokens.css`. Regenerate that file from this document; never edit it by hand.

Paths in this document are relative to `design-reference/`. `_ds/` is short for `project/_ds/duha-media-design-system-a9da4886-8cd2-4a89-bc2c-d8fe2794aeca/`.

---

## 1. How to use this document, and precedence

- **Block-coders:** port the markup and inline styles from the final `project/<Page>.dc.html` file named in §7, at both breakpoints. Express values through the tokens in §2 and `merged-tokens.css`. If a value in a page has no token, keep the page's exact value and flag it at Gate 1. Don't invent a token.
- **QA:** diff against the final page files, not against `_ds/readme.md` prose. The pages render with the effective token values listed in §2 (see Conflict 1).
- **Precedence (set by the human on 2026-10-17):**
  1. Source 2 wins on everything it defines. Within source 2, a **final page's own override beats the `_ds` default**, because the pages are the designs.
  2. Source 1 fills gaps only, and only where it doesn't contradict source 2.
  3. Source 1's business content (Class A/B/C tiers, "Shopify CRO studio", small-business ICP, "Get a free site audit") is void. Positioning comes from CLAUDE.md and source 2.
  4. When CLAUDE.md and source 2 conflict, nothing is resolved here. Every such case is listed in §9 for the human.
- **How the files are built (source 2 format):** each final `*.dc.html` holds **two complete builds** inside `<x-dc>`:
  - `<sc-if value="{{ isDesktop }}">`: desktop, framed at 1280–1440 with a 1200px container.
  - `<sc-if value="{{ isMobile }}">`: a 390px mobile build.

  The two are switched by the `viewport` prop. There are no CSS media queries, so **breakpoints are undefined in both sources**, and the port must pick them (Decision log).

  Shared chrome comes in through `<dc-import name="SiteHeader|SiteFooter|…" variant="…">`. DS components come in through `<x-import component-from-global-scope="DuhaMediaDesignSystem_a9da48.<Name>" …>`. `data-screen-label="…"` names each section. `data-anim` marks scroll-entrance elements.

---

## 2. Tokens

**Legend:**
- **S2**: `_ds/tokens/*.css` (line numbers given), or a final page where stated.
- **S1**: `design-system/tokens.json` (line numbers given) or `design-system/README.md`.
- **Wins**: the value that goes into `merged-tokens.css`.

### 2.1 Colour

| Token (S2 name) | Merged value | S2 source | S1 equivalent | Wins | Usage |
|---|---|---|---|---|---|
| `--cream` | **#FFFFFF** | `colors.css:3` = #FAF7F2. **Every final page overrides it to #FFFFFF**, via the `:root{/*fade-edge*/…}` helmet, or Homepage `_applyTheme` (`pageBackground` default #FFFFFF) | `offwhite` #F8F8F6 (`:16`), `white` #FFF (`:17`) | S2 page override | Page ground, header ground, light text on ink. Homepage prop options: #FFFFFF / #FCFCFB / #FAFAF7 / #FAF7F2 |
| `--ink` | #111111 | `colors.css:4` | `ink` #0F172A (`:11`) | S2 | Text, borders, inverse sections (Mini CTA, Final CTA, footer) |
| `--accent` | #C20E59 | `colors.css:5` | `crimson` #C20E59 (`:12`): same hex | S2 (agree) | Deep wine. The hex still needs client sign-off (`_ds/readme.md:50`) |
| `--accent-bright` | #E82561 | `colors.css:6` | `magenta` #E82561 (`:13`) | S2 | Logo and brand contexts only, never UI. S1's "CTA hover = magenta" is void |
| `--gold` | #F5C842 | `colors.css:7` | `gold` (`:14`) | S2 | Logo band only |
| `--gold-pale` / `--yellow` | #FCE588 | `colors.css:8`; `--yellow` is aliased in Case Study, Work, Shopify, Marketing and DEV-SEO | `cream` #FCE588 (`:15`). **Same hex, different name** | S2 | Quiet ground details (see Conflict 1) |
| `--gray-warm` | #8A857D | `colors.css:9` | `text-muted` #6F747F (`:22`) | S2 | Secondary text, metadata, dividers. **3.66:1 on #FFFFFF**, which fails AA for small text (Conflict 14) |
| `--gray-light` | **#F5F5F4** | `colors.css:10` = #EDE9E2, **overridden to #F5F5F4 on every final page** (Homepage `bandColor` default) | `offwhite` #F8F8F6 | S2 page override | Alternate bands, cards, newsletter band, results table |
| `--wine` | #C20E59 | Page alias (Case Study, Work, About, DEV-SEO, Link-in-Bio, What Happens Next Cards) | n/a | S2 | Same as `--accent` |
| `--surface-page` / `--surface-card` / `--surface-inverse` | var(--cream) / var(--gray-light) / var(--ink) | `colors.css:12-14` | `bg` / `bg-alt` (`:19-20`) | S2 | n/a |
| `--text-body` / `--text-secondary` / `--text-on-dark` | var(--ink) / var(--gray-warm) / var(--cream) | `colors.css:15-17` | `text` / `text-muted` | S2 | On dark sections the text renders #FFFFFF because of the override |
| `--text-on-accent` | #FAF7F2 | `colors.css:18` (a literal, so the override doesn't touch it) | white | S2 | Label on primary Button fill |
| `--accent-primary` | **#111111** | `colors.css:19` = var(--accent) (#C20E59). **Every final page overrides it to #111111.** Confirmed by render: Homepage "Book a Call" primary = rgb(17,17,17) fill, and the hero accent word renders ink | `cta` = crimson (`:24`) | S2 page override | Primary Button fill, AccentHeadline accent span, active nav underline, FAQ "+" when open, star fill, reading-progress bar |
| `--ground-accent` | **#C20E59** | `colors.css:20` = var(--gold-pale). **Every final page overrides it to #C20E59** (Homepage `geometryColor` default; options #C20E59 / #FCE588 / #111111) | n/a | S2 page override | In the finals this is the wine "figure" colour: logo-mask geometry, eyebrow tick diamonds, loud scarcity number, accent headline words (set inline `color:var(--ground-accent)`), "+212%" metric, process active step |
| `--border-divider` | rgba(138,133,125,.35) | `colors.css:21` | `hairline` rgba(15,23,42,.08) (`:23`) | S2 | Hairlines |
| `--border-strong` | var(--ink) | `colors.css:22` | n/a | S2 | 2px emphasis borders |
| Success set | #1E8E5A, #1B7A4B, #0F5433, #0F4D2F, #EAF4EE | Book a Call mobile (booked badge), Thank You (toast, tints) | n/a | S2 (page-local) | Booking and confirmation success states only. No `_ds` token exists |
| Dot matrix | rgba(17,17,17,.22) (also .3 and .15); on dark rgba(250,247,242,.18) | Every final hero and Final CTA | n/a | S2 | The "fade-edge" ground; see §5 |
| Tweet-card colours | #0F1419, #536471, #CFD9DE, #EFF3F4, #E1E8ED, 16px radius | Homepage and About founder "Latest posts" | n/a | n/a | X/Twitter embed mimicry. **Not tokenised.** Third-party look; replace with a real embed or re-skin (Conflict 12) |
| Mobile canvas | #DED9D0 | Every page wraps its mobile build in it | n/a | n/a | **Scaffolding**: the grey behind the 390px frame. Do not port |

**Colours dropped from source 1:** `ink` #0F172A, `offwhite`, `text-muted` #6F747F, the S1 hairline, the "Dark section" theme with gold links (`:19-26`), and `cta-hover` magenta. Source 2 defines every one of these roles itself.

### 2.2 Typography

| Style | Family | Desktop / mobile size | Weight | Line-height | Tracking | Case | Source | S1 equivalent (overridden) |
|---|---|---|---|---|---|---|---|---|
| H1 / display | `--font-display` Archivo Black | `--text-h1` 4.5rem / `--text-h1-mobile` 2.5rem | 400 in CSS (single 900 cut) | `--leading-h1` 1.0 | −0.01em | UPPERCASE | `typography.css:5`; AccentHeadline (`_ds_bundle.js:290-338`) | display 56/700/1.05/−0.02em (`:40`), h1 36/700 (`:41`) |
| H2 | Archivo Black | 3rem / 2rem | 400 | 1.05 | −0.01em | UPPERCASE | `typography.css:6` | h2 24/700/1.25 (`:42`) |
| H3 | Archivo Black | 1.75rem / 1.375rem | 400 | 1.15 | n/a | UPPERCASE | `typography.css:7` | h3 18/500/1.4 (`:43`) |
| Metric ("typographic event") | Archivo Black | `--text-metric` 4.5rem / 2.75rem. Metric sizes: lg = 4.5rem, md = 3rem, sm = 2rem. Pages also use 5rem (scarcity), 3.5rem (study card) and 2.25rem (fallback ledger) | 400 | 1 (0.9 on scarcity) | n/a | n/a | `typography.css:14`; Metric.jsx | n/a |
| Body | `--font-body` DM Sans | `--text-body-size` 1.125rem / 1rem | **500** (`--weight-body`) | 1.6 | 0 | Sentence | `typography.css:8,10` | body 16/400/1.7 (`:50`) |
| Small | DM Sans | 0.875rem / 0.8125rem | 500 | 1.5 | n/a | n/a | `typography.css:9` | metadata 12 mono (`:59`) |
| Eyebrow | DM Sans | `--text-small` 0.875rem | 700 | n/a | `--tracking-eyebrow` 0.08em | UPPERCASE; optional 9px rotated tick square in `--ground-accent` | Eyebrow.jsx (`_ds_bundle.js:142-176`) | label 11/500 mono +0.1em (`:58`) |
| Label (Badge, Input, Metric label) | DM Sans | 0.8125rem | 700 | 1.2 | 0.08em | UPPERCASE | Badge, Input, Metric | n/a |
| Micro-label (pages) | DM Sans | 10–11px | 700 | n/a | 0.1–0.2em | UPPERCASE, `--gray-warm` | Inline across final pages ("A study in full", "What clients say", rotated "Build · Operate · Hand over" 11px/0.2em) | n/a |
| Mono tag | `ui-monospace,'SF Mono',Menlo,monospace` | 10–12px | 400–700 | n/a | 0.1–0.14em | UPPERCASE | Testimonial "Google review" tag, `maps/*.html` stamps, Sitemap indices | IBM Plex Mono (see §3) |
| Button | DM Sans | sm 14px / md 15px / lg 17px | 700 | 1 | n/a | Sentence | Button.jsx (`_ds_bundle.js:57-141`) | button 14/700/+0.02em (`:51`) |
| Nav link | DM Sans | 15px | 500 (700 when active) | n/a | n/a | n/a | SiteHeader.dc.html | n/a |
| FAQ question | DM Sans | 1.125rem | 700 | n/a | n/a | n/a | FAQItem.jsx | n/a |

**Type rules:**
- Headlines are uppercase and `text-wrap: balance`. Only one accent word or phrase per headline.
- Mobile values apply in the 390px build. There is no fluid scale.

### 2.3 Spacing, layout, targets

| Token | Value | Source | S1 equivalent | Note |
|---|---|---|---|---|
| `--space-1`…`--space-10` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px | `spacing.css:2` | S1 `space-1/2/2.5/4/5/6/12/24` = 4/8/10/16/20/24/48/96 (`:66-73`) | **Name clash:** S1 `space-5` is 20px, S2 `--space-5` is 24px. S2 wins; S1 names are void |
| `--section-pad` | 96px | `spacing.css:3` | S1 `space-24` 96px (agree) | Desktop section rhythm. Mobile builds use 36–64px inline |
| `--section-pad-tight` | 64px | `spacing.css:4` | n/a | Proof sections |
| `--container-max` | 1200px | `spacing.css:5` | n/a | Article pages use an 820px column (Case Study header) |
| `--container-pad` | 24px | `spacing.css:6` | `space-4` 16px mobile gutter | Mobile builds use 20px inline |
| `--target-min` | 44px | `spacing.css:7` | n/a | Matches the CLAUDE.md 44px rule |
| Header height | 72px desktop / 60px mobile | SiteHeader / SiteHeaderMobile | n/a | Sticky, with a hairline bottom border |
| Breakpoints | **undefined in both** | n/a | n/a | Mobile frame is 390px; desktop preview is 1280. Pick in the Decision log |

### 2.4 Radius, borders, shadows

| Token | Value | Source | S1 equivalent | Note |
|---|---|---|---|---|
| `--radius-none` | 0 | `effects.css:2` | `radius-none` | Default everywhere, including buttons (Button uses `--radius-none`) |
| `--radius-sm` | 2px | `effects.css:2` | `radius-sm` 3px (`:79`) | S2 wins. Inputs only |
| `--radius-badge` | 999px | `effects.css:2` | `radius-full` 9999px (logo only) | Badges. **Also used on the Mini CTA pill button** (Homepage, `border-radius:999px`); see Conflict 13 |
| `--border-hairline` | 1px solid var(--border-divider) | `effects.css:3` | n/a | n/a |
| `--border-heavy` | 2px solid var(--ink) | `effects.css:4` | S1 secondary button 1.5px | Pages also use 1.5px cream borders on the Mini CTA pill |
| `--shadow-card` | 0 2px 0 0 var(--ink) | `effects.css:5` | n/a | Pages also write `0 2px 0 #111` literally (35 uses) |
| `--shadow-lift` | 0 6px 0 0 var(--ink) | `effects.css:6` | n/a | Hover on CaseStudyCard, with `translateY(-4px)` |
| `--shadow-ring` | 0 0 0 1px rgba(17,17,17,.15) | Final pages (28 uses), not `_ds` | n/a | Frame ring |
| Other observed | `6px 6px 0 #111`; `0 6px 0 var(--accent)` | Final pages | n/a | Untokenised; keep exact |
| `--focus-ring` | 2px solid ink, 2px offset | **S1 gap-fill** (`components/Button/README.md:14`) | n/a | Undefined in S2. The Input focus state is border → `--accent-primary` |

### 2.5 Motion

| Token | Value | Source | Note |
|---|---|---|---|
| `--ease-out` | cubic-bezier(.16,1,.3,1) | `effects.css:8` | Also hard-coded in `site-fx.js:14` |
| `--dur-fast` | 180ms | `effects.css:9` | Hover transitions |
| `--dur-enter` | 450ms | `effects.css:9` | Scroll entrance: opacity 0 → 1 and translateY(24px) → 0, at threshold 0.12 (`site-fx.js:2-19`) |
| Process accordion | flex / min-width 0.45s cubic-bezier(.2,.8,.2,1); background/border/colour 0.3s | Homepage Process | Untokenised; keep exact |
| Intro sequence | keyframes `ignite` 620ms, staggered 480/660/840/1020ms per logo band; `introMark`, `introRise`, `introRule`, `introWipe`, `introLift` | `Intro Animation.dc.html` | First-visit only, session-flagged (`_ds/readme.md:27`) |
| Reduced motion | One `@media (prefers-reduced-motion:reduce)` exists (Intro Animation) | n/a | The port must honour it everywhere |
| Press | translateY(1px) | Button.jsx | n/a |
| Hover | primary `brightness(.9)`; ghost fills ink with cream text; ghost-light fills cream with ink text; dark `brightness(1.15)` | Button.jsx | n/a |

---

## 3. Typography and fonts

- **Families (S2, binding):**
  - **Archivo Black**: one cut (900), used for every heading, metric and display numeral. Set `font-weight:400` in CSS, because that is how the cut is exposed.
  - **DM Sans** at 400, 500 and 700. Body text defaults to **500**.
- **Loading:** Google Fonts, `@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;700&display=swap')` (`_ds/tokens/fonts.css:2`). `_ds/readme.md:51` says self-hosted files are welcome. In Next.js, use `next/font/google` with `Archivo_Black` and `DM_Sans` so the files are self-hosted and nothing is fetched from Google at runtime. That is a port decision; log it.
- **Fallbacks:** `"Arial Black", sans-serif` for display; `"Helvetica Neue", Arial, sans-serif` for body.
- **Mono:** `_ds` has no mono token. Its adherence lint (`_adherence.oxlintrc.json`) allows only Archivo Black and DM Sans. Even so, the final pages and the DS Testimonial use a system mono stack (`ui-monospace,'SF Mono',Menlo,monospace`) for small source tags.
  - Merged choice: `--font-mono` = that system stack (S2 inline usage).
  - S1's **IBM Plex Sans / IBM Plex Mono are not adopted**. S2 defines the sans fully, and the mono gap is already filled by S2's own usage. Flagged as Conflict 16.
- **Icons:** Phosphor Icons **Bold** v2.1.1. The DS loads it from the unpkg CDN (`https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css`, used as `<i class="ph-bold ph-…">`).
  - Most-used glyphs: star-fill, arrow-right, star, x-logo, check, repeat, heart, chat-circle, play, arrow-up-right, linkedin-logo, google-logo, arrow-left, video-camera, calendar-blank, phone-call, note-pencil, github-logo, youtube-logo, instagram-logo, chart-line-up, quotes, file-text, envelope-simple, check-circle, arrow-counter-clockwise, warning, target, map-pin.
  - Port with the `@phosphor-icons/react` package (bold weight) rather than the CDN. This needs dependency approval per CLAUDE.md.

---

## 4. Components and patterns

### 4.1 DS components (`_ds_manifest.json`; source in `_ds_bundle.js`)

Port each one as a shared React primitive, used by the blocks. Prop names come from `_adherence.oxlintrc.json`.

| Component | Props | Key styling | Port note |
|---|---|---|---|
| **Button** | `variant` primary \| ghost \| ghost-light \| dark; `size` sm \| md \| lg; `href` | Padding sm 10×18, md 14×26, lg 18×32; font 14/15/17px, DM Sans 700; 2px border; radius 0; min-height 44; `whiteSpace:nowrap`; 180ms transition | Renders `<a>` when given `href`. Primary = `--accent-primary` fill (renders **ink** in the finals) with `--text-on-accent` text |
| **Badge** | `tone` outline \| fill \| accent; `icon` | Pill (`--radius-badge`); 8×16 padding; 0.8125rem/700 uppercase, 0.08em; 2px border | Hero authority badge = `tone="fill"` ("$X.XM client revenue tracked") |
| **Eyebrow** | `muted`, `tick` | 0.875rem/700 uppercase, 0.08em; tick = 9×9 square rotated 45° in `--ground-accent`, gap 10 | Used on nearly every section |
| **FAQItem** | `question`, `defaultOpen` | Hairline top border; button padding 18px 0; 1.125rem/700; "+" in Archivo 20px that rotates 45° and turns `--accent-primary` when open; answer max 62ch | Client component (`useState`) |
| **Input** | `label`, `type`, `textarea` (4 rows), `dark`, `placeholder` | Label 0.8125rem/700 uppercase; field 12×14 padding, 2px solid border in fg colour, `--radius-sm`, min-height 44; focus border → `--accent-primary` | Base for every form field |
| **AccentHeadline** | `text`, `accent` (substring), `level` 1–3, `as` | Archivo, uppercase, −0.01em, balance; accent span = `--accent-primary` | In the finals many accent words are recoloured inline to `--ground-accent` (wine) instead |
| **Metric** | `value`, `label`, `sub`, `accent`, `size` sm \| md \| lg | value Archivo 2 / 3 / 4.5rem; label 0.8125rem/700 uppercase; sub 0.8125rem `--gray-warm` | The "typographic event" |
| **MetricStrip** | `items[]`, `dark` | flex-wrap, gap 48, padding 32, `--gray-light` or ink ground | Fallback proof strip (Campaign LP Case pull) |
| **PhaseTimeline** | `phases[]`, `active`, `compact` | 4px top rule: accent when active, ink for the last phase, divider otherwise; numeral Archivo 1.75rem; last phase gets an "→" and an "independence handover" underline tag | The terminal beat always has full weight, which matches the CLAUDE.md rule |
| **CaseStudyCard** | `client`, `metric`, `metricLabel`, `summary`, `href`, `image`, `tall` | `--gray-light` card; media 16:9 (4:3 if tall) on ink; metric Archivo 2.5rem in accent; "Read the case study" link with 2px underline; hover = lift shadow + −4px | Only inside `csLive` branches |
| **Testimonial** | `quote`, `name`, `role`, `dark` | `<figure>`; padding 24; 1px divider border; 5 stars (15px, accent fill); mono "GOOGLE REVIEW" tag; quote 1.0625rem/1.5; figcaption 0.8125rem/700 with role muted | Every card is hard-labelled "Google review" (Conflict 6) |

`_ds/ui_kits/website/*` (App, Chrome, Hero, HomeSections, Pages in the bundle) is an **early recreation**, superseded by the final pages. Use it only as a reading aid.

### 4.2 Recurring page patterns (final pages)

Keep this structure in the port. The labels are the `data-screen-label` names.

- **SiteHeader:**
  - Desktop: sticky; `--cream` ground; hairline bottom border; 72px tall.
  - Logo: `logo-duha-01.png` at 34px plus "DUHA MEDIA" in Archivo 18px.
  - Nav: Work · Services · Testimonials · About · FAQ (DM Sans 15/500, gap 28) and a Button primary sm "Book a Call".
  - **SiteHeaderMobile:** 60px tall, logo plus a toggle; the open panel lists the same links and the CTA.
- **SiteFooter** (`variant` = standard | reduced | legal). Ink ground, cream text.
  - **standard:** grid `2fr 1fr 1fr 1fr 1.5fr`, gap 40, padding 64/24/32. Zones are:
    - Brand: logo plus "One team. Store, engine, then yours to run. Chicago."
    - Pages: Work, About, Testimonials, Book a Call.
    - Services: Shopify Theme Development, Marketing.
    - Resources: Newsletter, Review Hub, FAQ, Contact.
    - Newsletter nudge: "One useful email a month. Numbers included." plus an input and a ghost-light "Join".
    - Bottom bar: "© 2026 Duha Media LLC" plus Privacy, Terms, Cookies, GDPR.
  - **reduced:** logo, Home / Work / FAQ / Contact, and the bottom bar.
  - **legal:** the bottom bar only.
  - **SiteFooterMobile** stacks the same content. **`SiteFooterMobile v2.dc.html` is byte-identical to `SiteFooterMobile.dc.html`** (same md5), so it is a duplicate, not a variant.
- **Hero:**
  - Content: Eyebrow with tick, then an uppercase H1 with one accent phrase, then an optional Badge (fill), body text at max 52ch, then the CTAs (primary + ghost).
  - Ground: the dot matrix (§5) plus a logo-mask geometry block in `--ground-accent`, cropped by the section edge.
  - Optional rotated vertical micro-copy ("Build · Operate · Hand over").
- **Scarcity loud/quiet** (Homepage "Proof strip"; Final CTA lines; Campaign LP Offer):
  - Loud: number in Archivo 5rem (ongoing count in `--ground-accent`).
  - Then a label in Archivo 1.125rem uppercase.
  - Quiet: reason at 0.8125rem `--gray-warm`, e.g. "The cap is our quality gate, not a countdown."
  - The reason is always present, which matches CLAUDE.md rule 2. The value is a prop: `ongoingProjects` 0–7, default 3.
- **Client logo strip:** muted Eyebrow "Stores we've run numbers for", then 6 names in Archivo 20px, opacity .55, gap 56. These are **text placeholders, not logo files** (Conflict 5).
- **Case-study launch-state toggle:** `caseStudiesLive` prop → `csLive` / `csFallback` branches.
  - Fallback = Eyebrow "No studies live yet — the numbers we can show", H2 "Numbers anyway.", and the line "No demo studies, no 'coming soon.'".
  - Beside it, a 2px-ink-bordered ledger: Builds start $5K, Engines start $1K/mo, Client cap 7.
  - Present on Homepage, Services Hub, Shopify, Marketing (JS only), Testimonials, DEV-SEO, MKT-SEO, Campaign LP, Link-in-Bio, Review Hub.
  - **Absent on Work and Case Study** (Conflict 3).
- **"A study in full" card:**
  - 2px ink frame; client line, a big metric in `--ground-accent` 3.5rem, a label, a summary, and "Read the study →"; plus an "All studies →" link.
  - Appears **unconditionally** on Homepage, Work, Services Hub, Shopify, Book a Call, Campaign LP (Conflict 3).
- **Mini CTA:** a single ink band with Archivo 1.5rem text left and a cream-outlined pill "Book a Call →" right.
- **Final CTA:**
  - Ink band, 96px padding (desktop), centred, max 760px.
  - Dot matrix masked top and bottom; logo-mask geometry in the bottom-left corner.
  - Content: H2, then the capacity line ("{n} builds in progress. We cap at 7." plus "The cap keeps every build senior-staffed — that's the whole reason."), then a Button ghost-light, min-width 220.
- **Newsletter CTA band:**
  - `--gray-light` band.
  - H2 at `--text-h3` size, "One useful email a month.", with the quiet line "Numbers included. Unsubscribe anytime.".
  - Inline 2px-ink email input (240px) and a Button `dark` "Join".
- **Process / PhaseTimeline:**
  - Homepage "Process" is an 8-step accordion across 3 phases. Steps: Intake, Research, Branding, Design, Development, Onboarding, Engine launch, Handover.
  - The open step gets flex 3.6 and a `--ground-accent` border and text.
  - Desktop opens on click. Mobile opens the step nearest 45% of viewport height on scroll.
  - Variants:
    - Shopify "Build run": 6 steps with two sign-offs.
    - Marketing "Engine rollout": 6 steps ending at "06 Independence — Phase 03".
    - Services Hub "The arc".
- **Spec ledgers:**
  - Expandable "D-01…D-07" rows on Shopify and "E-01…E-06" rows on Marketing, each with a code, title, line, "+", "What we build/run" and "How you'll know it worked".
  - "T-01…T-04" template anatomy cards on Shopify.
- **Breadcrumb bar** (Shopify, Marketing): "Services / … / Phase 0X — …".
- **Article grammar:**
  - Applies to Case Study, About, DEV-SEO, MKT-SEO and Legal.
  - Parts: breadcrumb; dated meta rule; an "In short" grey box; numbered H2 sections (01, 02, …); figures as `image-slot`s with "Fig. n —" captions; a results table framed by 2px ink top and bottom rules; reading progress.
- **Forms:**
  - Inputs follow the Input component.
  - Selects are rendered as option chips/rows (Book a Call revenue range: Under $500K, $500K–$1M, $1M–$5M, Over $5M; Contact reason: Partnership, Press, Existing client, Other).
  - No Turnstile is shown anywhere; the port must add it.
- **Founder block:**
  - Image slot plus "One founder, no layers.", a bio placeholder, the name line, social icons (LinkedIn, Twitter, GitHub), and a "Latest posts @handle →" column of 3 X/Twitter-style post cards.
  - Appears on Homepage and About.

---

## 5. Imagery, logo, geometry

- **Logo files:**
  - `project/assets/logo.png` and `project/assets/logo-duha-01.png` are **byte-identical**. Both are a 313×313 RGBA PNG: a disc of four horizontal bands, top to bottom pale yellow #FCE588, gold #F5C842, pink #E82561 and wine #C20E59, with transparent gaps between the bands.
  - Pages use `logo-duha-01.png` for the visible mark, at 24, 28, 30, 34 or 40px, and `logo.png` as a CSS mask.
  - `design-system/assets/Logos/duha-mark.svg` is S1's vector redraw: 100×100 viewBox, a clip circle at r=45, and four rects with uneven band heights (20/20/21/22).
  - **Merged:** the S2 PNG is the reference mark. The SVG is a usable vector source at small sizes, but its proportions differ slightly, so check it against the PNG (Conflict 15).
  - The wordmark is "DUHA MEDIA" in Archivo Black, which S2 says is a temporary stand-in while a redesign is in flight. S1's lowercase IBM Plex "duha media" is void.
- **Logo rules:**
  - S1 says never recolour or animate the mark.
  - S2 does both: it uses the mark's silhouette as a single-colour mask in `--ground-accent`, and the Intro Animation "ignites" the bands.
  - S2 wins. The mark itself, at the header and footer, keeps its four colours.
- **"Wine geometry" motif.** On the final pages it is two layers:
  1. A **dot matrix**: `radial-gradient(<dot> 1.2px, transparent 1.2px)` at a 22px pitch. On light grounds the mask is `linear-gradient(215deg,#000 15%,transparent 60–65%)`; on Final CTA bands the mask fades top and bottom.
  2. A **logo-silhouette block**, 240–460px, in `--ground-accent` (wine), positioned so the section edge crops it.

  The `:root` comment `/*fade-edge*/` and `Wine Geometry Explorations.dc.html` (treatments rendered through `GeoHome.dc.html`) show that "fade-edge" was the chosen treatment. **This replaces `_ds/readme.md`'s rotated pale-yellow diamond** (still present in the ui_kit Hero). It also uses CSS gradients as masks, while both S1 and `_ds` say "no gradients" (Conflict 1).
- **Image slots** (`image-slot.js`, `.image-slots.state.json`):
  - These are Claude Design scaffolding: a `<image-slot id=… placeholder=…>` web component that lets the designer drop or reframe an image, with the result persisted in the sidecar JSON.
  - The sidecar holds 5 filled slots as base64 WebP data URIs: `fc-1b-founder`, `fc-2a-founder`, `fc-2b-founder`, `fc-2b-tweet-avatar` and `founder-home-d`. These are founder photos and an avatar used by the Founders concepts and the Homepage founder block.
  - **Do not port the component.** Each slot becomes a Payload `upload` (media) field rendered with `next/image`. Its placeholder text is the editor hint.
  - Slots seen in the finals: `team-founder-01`, `founder-home-d`, `cs-fig-01/02`, `csm-fig-01/02`, plus slots on Shopify, Marketing, Testimonials, About, Campaign LP, DEV-SEO and Lead Magnet.
- **Maps** (`project/maps/`, standalone iframes):
  - `map-live.html`: Leaflet 1.9.4 with OSM tiles at Chicago 41.8827, −87.6233; wine diamond pin with an ink border.
  - `map-mono.html`: the same, with a grayscale/sepia tile filter and an ink stamp reading "Chicago, IL · 41.88°N 87.62°W".
  - `map-locator.html`: a D3 7.9.0 service-area disc around **Lombard, IL** (~30 mi) with town labels.
  - The **Contact mobile** build embeds the locator. The **Contact desktop** build shows a "map placeholder — Chicago" (Conflict 9).
  - The Contact Form Concepts sheet offers 4A live, 4B mono and 4C locator.
- **Other images:**
  - `scraps/*.png` are JPEG screenshots of testimonial sections, 924×540: home, services hub, book-call proof.
  - `uploads/pasted-*.png` are reference screenshots from the design chat (a DD.NYC "creative agency" hero showing the diamond pattern; an old wine primary "Book a Call" button next to an outlined "See the Work"; and two more).
  - Neither set is site content. Don't ship them.
- **Imagery policy (S2):** UI-mockup and dashboard screenshots. Camera work only in Marketing "Camera work" and About/Team. No lifestyle stock. S1 agrees (no stock people).

---

## 6. Runtime scripts

| File | What it is | Port |
|---|---|---|
| `support.js` | Generated `dc-runtime`: parses `<x-dc>`, `sc-if`/`sc-for`, `x-import`/`dc-import`, props/Tweaks | **Scaffolding. Do not port.** |
| `image-slot.js` | Claude Design "omelette" starter: the fillable image placeholder web component | **Scaffolding.** Replace with Payload media fields and `next/image` |
| `site-fx.js` | `armAnim`: an IntersectionObserver (threshold 0.12) fades and lifts elements marked `[data-anim]` that start below 95% of the viewport (opacity 0, translateY 24px, 450ms, `--ease-out`), with a 4s safety reveal. `readingProgress`: a fixed **4px vertical** bar on the left edge in `--accent-primary`, whose height = scroll percentage | **Real site behaviour. Reproduce in React** as one small client component. Respect `prefers-reduced-motion`. Reading progress loads on About, Case Study, DEV-SEO, MKT-SEO and FAQ (CLAUDE.md lists pages 2, 11, 13, 14; About is extra, see Conflict 10) |
| Page JS (Homepage) | Process accordion (click on desktop, scroll-nearest on mobile), `_applyTheme`, `ongoingCount` binding | Process interaction = a real client component. Theme = tokens |
| Book a Call mobile JS | A 4-step booking flow: pick a day and time, about you, the situation, then done | **Conflicts with the locked BookingEmbed** (Conflict 8) |
| Intro Animation | First-visit logo load-in (mark → wordmark → settles), session-flagged | Real behaviour per `_ds/readme.md:27`, but not in CLAUDE.md (Conflict 11) |
| `maps/*.html` | Leaflet/D3 iframes from unpkg | A MapEmbed block decision (static locator vs live tiles). CDN scripts need approval |

---

## 7. Page → design file map

Each final file holds desktop and mobile, as `isDesktop` and `isMobile`. "Order" compares the design's `data-screen-label` sequence with CLAUDE.md's locked order.

| # | CLAUDE.md page | Final file (desktop + mobile) | Concept files | Footer used | Order vs CLAUDE.md |
|---|---|---|---|---|---|
| 1 | Homepage | `Homepage.dc.html` (both). Alternates: `Homepage Fade Edge.dc.html` (desktop variant), `Homepage (Mobile) {Fade Edge, Full Logo, White, Wine Geometry}.dc.html`, `GeoHome.dc.html`, `Intro Animation.dc.html` | Founders Section Concepts, Wine Geometry Explorations | standard (default) | **differs**: Scarcity and Logo strip are merged in one "Proof strip" section (order kept). An extra second "Founder" section ("One founder, no layers" + posts) sits after Testimonials; CLAUDE.md has one founder/team section before Testimonials. The Testimonials section embeds an unconditional "A study in full — Client A +212%" card |
| 2 | Case Study | `Case Study.dc.html` | Case Study Concepts | standard | **differs**: the hero has no oversized result metric and no browser-framed visual (it is a text article header with "In short"). Before / Strategy / Results are numbered H2s inside "Article body" plus a "Results table". Client voice also holds "What we'd do differently" and "How this maps to our phases". There is an **extra "Next study"** section. Newsletter → Final CTA matches |
| 3 | Work | `Work.dc.html` | Work Page Concepts | standard | **differs**: Intro strip ✓. The grid is a numbered "Study ledger" of six named studies, not a staggered grid, with **no Load More**. **No fallback state.** There is an extra "Proof pull" (desktop) and "Aggregates" (mobile) |
| 4 | Services Hub | `Services Hub.dc.html` | Services Hub Concepts, Why Both Together Concepts (+v2), Arc Section Concepts (Mobile) | standard | **differs**: Hero (no phase-timeline visual in the hero) → Two doors ✓ → Why both together ✓ → **Newsletter CTA moved up here** → **extra "The arc"** → **extra "How it starts"** → Featured proof ✓ → FAQ mini ✓ → Final CTA |
| 5 | Shopify Theme Development | `Shopify Theme Development.dc.html` | Development Page Concepts, Dev Hero Mobile Concepts, Build Run Mobile Concepts | standard | **differs**: extra Breadcrumb. The hero isn't Revision-forward and shows "$5K" as a display stat. **"Where people usually start" (Revision / Scratch) is missing as a section**; Revision is D-07 inside Specification. Extra "Template anatomy". Specification = What's included; Build run = Process ✓; Proof ✓; FAQ ✓; Final CTA ✓ |
| 6 | Marketing | `Marketing.dc.html` | Marketing Engine Concepts, Marketing Body Concepts | standard | **differs**: Breadcrumb (extra) → Hero (shows "$1K/mo" as a 3rem display stat) → Signal flow (= Engine overview) → Channel specification (= components) → Engine rollout (= Process, Phase 3 visible ✓) → Camera work (camera + GBP as a separate section) → FAQ → Final CTA. **The Proof section is missing** (a `fallbackStrip` exists in JS but is never rendered) |
| 7 | Testimonials | `Testimonials.dc.html` | Testimonials Page Concepts, Testimonial Concepts | standard | **differs (minor)**: Hero → "Testimonial feed" (video cards with metric + quote, a case-study deep link toggled by `csLive`, GBP review placeholders, Load more) → Final CTA. The per-client "brand showcase" with a client logo isn't a distinct block; it is a mixed feed |
| 8 | About | `About.dc.html` | About Article Concepts, About Article A/B/C, Founders Section Concepts | standard | **differs**: Hero → Body (01 Why this company exists = Story; 02 How an engagement actually runs = How we work; 03 How we decide things = Values) → **extra "Company facts"** → Founder → Final CTA. Values come before Team (swapped). **Logo strip at launch is missing** |
| 9 | Book a Call | `Book a Call.dc.html` | What Happens Next Cards | reduced | **differs on mobile only**. Desktop matches: Hero → Booking widget (embed placeholder) → Homework form → What happens next → Social proof (with "Have a quick question first? Contact us") → reduced footer. Mobile: Hero → a single "Booking flow" (a custom 4-step slot picker + homework + what-next) → Social proof |
| 10 | Thank You | `Thank You.dc.html` | n/a | reduced | **match**: Confirmation → Homework reminder (conditional, `homeworkDone`) → Newsletter CTA → reduced footer |
| 11 | FAQ | `FAQ.dc.html` | n/a | standard | **match**: Hero → Category nav → Pricing & Contracts (opens with the direct price) / Builds / Marketing / Process & Trust → Still have questions (Book a Call + Contact) |
| 12 | Contact | `Contact.dc.html` | Contact Form Concepts | standard | **match** (Direct info and Map share one section). Form = name, email, reason (4 options), message ✓ |
| 13 | DEV-SEO | `DEV-SEO Article.dc.html` | DEV-SEO Article Concepts, Article Template Concepts | standard | **differs**: Hero → Body (Why you're searching = Problem; Revision before rebuild = How Duha solves; The order of work) → **"DIY vs done" (CLAUDE.md has no DIY bridge on DEV-SEO)** → Proof (pricing metric strip) → Proof (fallback) → FAQ → Newsletter → Final CTA. **The "Educational block" is missing or replaced**, and Proof sits after it rather than before |
| 14 | MKT-SEO | `MKT-SEO Article.dc.html` | MKT-SEO Article Concepts, MKT-SEO Hero Concepts, Article Template Concepts | standard | **differs**: Hero → Body (The teach) → DIY vs done ✓ → **"How Duha does it" is missing as a section** → Proof (fallback) → FAQ → Newsletter → Final CTA |
| 15 | Campaign LP | `Campaign LP.dc.html` | n/a | legal (no header) | **differs (minor)**: LP header (logo only) → Hero A (VSL) / Hero B (static) ✓ → Proof strip → Offer → Case pull (fallback MetricStrip) → Testimonial → legal footer. The single CTA repeats after hero, offer and testimonial, **but not after Proof strip or Case pull** |
| 16 | Newsletter | `Newsletter.dc.html` | Newsletter Issues Concepts | standard | **match**: the signup form sits inside the hero, above the fold → Sample content (Recent issues) → Social proof |
| 17 | Link-in-Bio | `Link-in-Bio.dc.html` (desktop shows the 390px column) | Link-in-Bio Concepts | inline legal | **differs**: Identity (with an unconditional "+212% Revenue · 12 months") → **Book a call + "Slots open 3/7" before Socials** → Follow (socials) → On the site (The work, Clients, Newsletter, Case study if `csLive`). **No "current push" link**. Inline © + Privacy/Terms |
| 18 | Lead Magnet | `Lead Magnet.dc.html` | n/a | inline legal | **match**: Hero + capture → What's inside → Delivered state + newsletter cross-sell (`delivered` toggle) → legal-only footer (inline, not SiteFooter) |
| 19 | Review Hub | `Review Hub.dc.html` | n/a | standard | **match** on order (Hero → Review wall → Case cross-links with fallback → Final CTA). **Desktop only; no mobile build.** The Sitemap files it under "Exploration boards — not shipping pages" (Conflict 7) |
| 20 | Legal | `Legal.dc.html` | n/a | standard | **match**: a single column with an "On this page" desktop jump-link sidebar; counsel placeholders only. Mobile adds a head and a section nav |
| 21 | 404 | `404.dc.html` | n/a | standard | **match**: "This page leaked." with Book a Call, Home and Work |

**Totals:** **8 match** (10, 11, 12, 16, 18, 19, 20, 21), **13 differ** (1–9, 13, 14, 15, 17), **0 missing**. Review Hub's mobile build is missing, and Book a Call differs on mobile only.

**Shared chrome → footer variants:**

| CLAUDE.md variant | Desktop | Mobile | Used by (design) | CLAUDE.md wants |
|---|---|---|---|---|
| standard (4-zone + newsletter nudge) | `SiteFooter.dc.html` `variant="standard"` (5 grid columns: brand, Pages, Services, Resources, Newsletter) | `SiteFooterMobile.dc.html` (`SiteFooterMobile v2` is an identical duplicate) | Home, CS, Work, SvcHub, Shopify, Mkt, Testimonials, About, FAQ, Contact, DEV-SEO, MKT-SEO, Newsletter, Review Hub, Legal, 404 | ✓ |
| reduced-nav | `SiteFooter` `variant="reduced"` | `SiteFooterMobile` `variant="reduced"` | Book a Call, Thank You | ✓ |
| legal-only | `SiteFooter` `variant="legal"` (bottom bar only) | same | Campaign LP; **Link-in-Bio and Lead Magnet inline their own © + Privacy/Terms bar instead of the component** | ✓ (one component in the port) |

Header: `SiteHeader.dc.html` / `SiteHeaderMobile.dc.html` on every page except Campaign LP, Link-in-Bio and Lead Magnet, which use a logo-only header. That matches zero leakage.

`Sitemap.dc.html` is the designer's index. It lists 23 entries:
- 01–09 primary pages.
- 10–14 conversion pages.
- 15–18 templates.
- 19 Intro Animation, 20 Legal, 21 404, 22 SiteHeader, 23 SiteFooter.
- "05 — Exploration boards & variants (not shipping pages)": Marketing Body Concepts, Wine Geometry Explorations, Contact Form Concepts, Testimonial Concepts, Testimonials Page Concepts, MKT-SEO Article Concepts, Homepage Fade Edge, Homepage (Mobile) White, **Review Hub**.

The Sitemap's own background uses the same override, with `--ground-accent:#C20E59`.

---

## 8. Concept sheets (exploration; not final unless the human says so)

| File | Explores | Adopted by a final page? |
|---|---|---|
| About Article Concepts (+ About Article A/B/C) | About as an article: 1a dispatch, 1b field notes, 1c on the record (Q&A) | **A appears adopted.** About.dc.html shares A's "Article header / Article body / Company facts / Final CTA" labels and its copy ("One team. One dashboard. A handover date.", "Based Chicago… Capacity 3 of 7") |
| Arc Section Concepts (Mobile) | Services Hub "Where both doors end" on mobile: 8a ledger, 8b track, 8c breadcrumb | Undetermined. The "The arc" section exists; which option it uses wasn't verified |
| Article Template Concepts | 3 article structures (1a sticky rail…) | Partially. The finals use the left-aligned article grammar |
| Build Run Mobile Concepts | Shopify "how a build runs" on mobile: 6a spine, 6b swipe rail, 6c progress ruler, 6d two-column | Undetermined |
| Case Study Concepts | 1a single column, 1b sticky data rail, 1c findings-first memo | **1a-like.** The final is a single 820px column with "In short" |
| Contact Form Concepts | Form patterns; Turn 4 map 4A live / 4B mono / 4C locator | **4C adopted on mobile** (`Contact.dc.html:263` iframes `maps/map-locator.html`). Desktop is still a placeholder |
| Development Page Concepts | Shopify page: 3a ink hero + facts rail, T-01…T-04 anatomy, D-01…D-06 ledger (4a/4b/4c) | **Adopted in substance.** The final has Template anatomy (T-01–T-04) and a Specification D-01–D-07 ledger. The exact turn wasn't verified |
| Dev Hero Mobile Concepts | Shopify mobile price/CTA block 5a–5d | Undetermined |
| DEV-SEO Article Concepts | 1a, 1b, and the 2a mobile pair of 1a | Likely 1a/2a ("Article header / body / Proof + FAQ / Final CTA"). The final adds DIY vs done |
| Founders Section Concepts | Founder "signed note" section, 2a desktop… | **Adopted.** The "One founder, no layers." block on Homepage and About matches it; slot ids `fc-*` are in the sidecar |
| Link-in-Bio Concepts | 1a ledger, 1b ink, 1c proof-first | **1c-like (proof-first).** The final leads with "+212%". Not verified exactly |
| Marketing Body Concepts | Engine ledger directions (readout, roles, index, ledger, claims; rollout bar, spine, rail, arc) | Partially. The final "Channel specification" is an E-01…E-06 ledger and "Engine rollout" is a numbered rail |
| Marketing Engine Concepts | Signal-flow directions 2a–2c (six channels converge to the dashboard) | **Adopted.** The final has a "Signal flow" section (E-01…E-06 → "Everything reports here") |
| MKT-SEO Article Concepts | 1a/1b layouts; 2a–2c readability riffs | Probably 1a with a 2x riff. Undetermined |
| MKT-SEO Hero Concepts | Hero title scale 3a–3c, 4a–4c (H3-scale title) | Undetermined. The final h1 is at article scale |
| Newsletter Issues Concepts | "Recent issues": 1a ledger rows, 1b, 1c, 1d | **1a-like.** The final shows "Latest — Issue 012" plus "Previously" rows with ISSUE / DATE / metric |
| Services Hub Concepts | Hero + two doors: A ledger, B, C | **"Two doors" adopted** (the final label is "Two doors") |
| Testimonial Concepts | Quote treatments; Turn 3: 3A client-brand pairing, 3B, 3C | **3C-like.** The DS Testimonial is a rated review card with stars and "Google review" (Testimonials Page Concepts refers to "the written 3c rated-reviews") |
| Testimonials Page Concepts | 1A on camera / in writing, 1B, 1C | Undetermined. The final is one mixed feed |
| What Happens Next Cards | Book a Call "what happens next": 1a hairline cards, 1b, 1c | **Adopted** (STEP 01–03 cards on Book a Call). The variant wasn't verified |
| Why Both Together Concepts (+ v2) | 1a struck out, 1b coordination ledger, 1c side-by-side; v2 7a receipts, 7b claim/reality, 7c smaller strike-through | **Strike-through family adopted.** The final copy reads 'Sold to you as "…"' twice, then "One team…". The exact option wasn't verified |
| Wine Geometry Explorations (+ GeoHome) | ~25 geometry treatments (matrix, fade, grid, bands…) | **"fade-edge" adopted site-wide** (`/*fade-edge*/` :root on every final page) |
| Work Page Concepts | 1a numbers ledger, 1b featured, 1c by outcome. "Case studies are live in all three — no launch-state copy anywhere" | **1a adopted** (Study ledger). It carries the "no launch-state copy" assumption (Conflict 3) |
| Homepage Fade Edge / Homepage (Mobile) × 4 / GeoHome / Intro Animation | Earlier homepage variants. The mobile variants link to `* (Mobile).dc.html` files that **don't exist in the project** | Superseded by `Homepage.dc.html`, which carries both breakpoints. Fade Edge is still the only file with the `[STRATEGIC PLACEHOLDER — final copy TBD]` label (Conflict 4) |

---

## 9. Conflicts for the human

Numbered so they can be answered by number. Nothing here has been resolved.

1. **Colour roles in the final pages invert the `_ds` system.**
   - Every final page overrides four tokens: `--cream` #FAF7F2→#FFFFFF, `--gray-light` #EDE9E2→#F5F5F4, `--accent-primary` #C20E59→#111111, `--ground-accent` #FCE588→#C20E59.
   - Effect:
     - Primary CTAs and AccentHeadline accents render **ink**, not wine.
     - Wine moves to geometry, eyebrow ticks, loud metrics and inline accent words.
     - The page is white, not warm cream.
     - Yellow (#FCE588) is now almost unused.
   - This contradicts `_ds/readme.md`: "wine is figure, yellow is ground", "accent on exactly one element", "warm cream page field".
   - The geometry also uses CSS gradients as masks (dot-matrix fade), where S1 and `_ds` say "no gradients".
   - `merged-tokens.css` uses the **effective (page) values**. Confirm, or choose the `_ds` values.
2. **Section order differs from CLAUDE.md's locked order on 13 pages** (§7):
   - 1 Home: an extra second Founder section after Testimonials.
   - 2 Case Study: an extra "Next study"; the hero lacks the metric and the browser frame.
   - 3 Work: a ledger with no staggered grid and no Load More; an extra proof pull.
   - 4 Services Hub: Newsletter moved up; extra "The arc" and "How it starts".
   - 5 Shopify: no "Where people usually start" section; extra Breadcrumb and Template anatomy.
   - 6 Marketing: **no Proof section**; extra Breadcrumb.
   - 7 Testimonials: a mixed feed rather than per-client brand showcases.
   - 8 About: extra "Company facts"; Values before Team; no Logo strip.
   - 9 Book a Call mobile: a custom booking flow.
   - 13 DEV-SEO: "DIY vs done" instead of the Educational block; Proof order.
   - 14 MKT-SEO: no "How Duha does it" section.
   - 15 Campaign LP: the CTA doesn't repeat after every block.
   - 17 Link-in-Bio: Book a Call before Socials; no "current push" link.

   CLAUDE.md says to add, remove or merge nothing. Which order wins, page by page?
3. **Launch-state rule violated (no live case studies; never a demo study styled as real).**
   - `Work.dc.html` presents six named studies "signed off" (Northside Goods, Halsted Supply, Rowan & Field, Lakeview…) with metrics and aggregates ("$3.1M client revenue added", "4 teams now running it themselves"). It has **no fallback state**.
   - `Case Study.dc.html` is written as a published, "client-approved" study for "Northside Goods" (+212%, a $780K→$2.43M table).
   - An **unconditional** "A study in full — Client A +212%" card appears on Homepage, Work, Services Hub, Shopify, Book a Call and Campaign LP.
   - Link-in-Bio shows "+212% Revenue · 12 months" unconditionally.
4. **Placeholder labelling.** CLAUDE.md requires `[STRATEGIC PLACEHOLDER — final copy TBD]` on hero headlines and subheads. Only the superseded `Homepage Fade Edge.dc.html` (and the `_ds` ui_kit) carries it. The final pages present hero copy unlabeled (Book a Call has "[Demonstrative CTA variant — final copy TBD]").
5. **Invented facts and names presented as real** (CLAUDE.md: never invent business facts, client names or numbers):
   - Client logo strip: NORTHSIDE GOODS, KEDZIE & CO, LAKE SUPPLY, MARROW, FIELDHOUSE, WICKER & PINE.
   - Named testimonials: J. Alvarez, M. Okafor, R. Patel, D. Kowalski, presented as "Google review".
   - "Testimonials · 5.0 avg".
   - Location "**Lombard, IL**, ~30 mi radius" (Contact mobile; `maps/map-locator.html`), where CLAUDE.md says Chicago.
   - Founder name "Abdur-Rahman Ch".
   - Commercial terms not in CLAUDE.md:
     - "Six-month minimum" on engines (Marketing hero, FAQ).
     - "Scratch builds from $12K", "4–6 weeks", "3 checkpoints", "freelancer at $2–4K" (DEV-SEO).
     - "Typical handover Month 9" (About Company facts).
     - "Two-week audit, fixed price after it" (DEV-SEO).
   - Confirm each, or replace each with a labelled placeholder.
6. **Testimonial component hard-codes "Google review" + 5 stars** on every quote, including quotes that are video or direct testimonials. CLAUDE.md has `testimonials.type` (video / text) and leaves the GBP-review merge open for Gate S. The label must become data-driven.
7. **Review Hub status.** CLAUDE.md page 19 is a launch page. The Sitemap files it under "Exploration boards — not shipping pages", and it has **no mobile build**.
8. **Booking on mobile.** The `Book a Call` mobile build designs a native 4-step slot picker (day/time → about you → situation → booked). CLAUDE.md locks launch booking to the Nextcloud BookingEmbed (iframe or link-out), with the on-brand widget **queued post-launch**. Desktop shows only an "embed placeholder". The design has no linked-out "Book your call" panel state and no "no URL" fallback state.
9. **Contact map is inconsistent.** Desktop shows a "Chicago — map placeholder" with the line "Chicago, IL — [neighborhood/address placeholder]". Mobile embeds the D3 Lombard service-area locator. Which treatment (live / mono / locator), and which location?
10. **Reading progress scope.** The design loads it on About and FAQ as well as Case Study, DEV-SEO and MKT-SEO. CLAUDE.md lists pages 2, 11, 13, 14 (FAQ is page 11, so About is the only extra). The design's bar is a 4px **vertical** left-edge bar, which CLAUDE.md doesn't specify.
11. **Intro Animation** (first-visit logo load-in, session-flagged) is designed (`Intro Animation.dc.html`, Sitemap #19, `_ds/readme.md:27`) but isn't among CLAUDE.md's 21 pages or blocks. Build it or drop it?
12. **Founder "Latest posts"** imitates X/Twitter post cards with X's colours (#0F1419, #536471, 16px radius) and system fonts. That is third-party look-alike UI, and the posts are placeholders. Embed real posts (a third-party script), re-skin in brand, or drop?
13. **Pricing shown as display numbers, not small inline notes** (CLAUDE.md rule 5):
    - Services Hub "Two doors": $5K / $1K at 3.5rem.
    - Shopify hero: "$5K" stat.
    - Marketing hero: "$1K/mo" at 3rem.
    - Homepage fallback ledger: $5K / $1K/mo at 2.25rem.
    - DEV-SEO proof strip: "$5K Build floor".
    - Campaign LP Proof strip: Metric "$5K / $1K/MO".

    Separately, the Mini CTA uses a pill button (`--radius-badge`), where `_ds` reserves pills for badges.
14. **Contrast.** `--gray-warm` #8A857D on #FFFFFF is **3.66:1**, below WCAG AA 4.5:1. It is used for many small labels (10–13px) and secondary text. Darken it (S1's #6F747F is 4.69:1), or accept? The text on the primary button is #FAF7F2 on ink, which is fine.
15. **Logo source.** The S2 PNG (313px, the reference) and the S1 SVG differ slightly in band proportions. The SVG has 3-unit gaps between bands on a 90-unit disc; whether they match the PNG's gaps hasn't been verified. There is no vector export of the S2 mark and no wordmark file; the wordmark is "redesign in flight". Which file ships, and should an original vector be supplied?
16. **Source-1 gap-fills I wasn't sure about:**
    - (a) **Focus ring**: S1's 2px ink outline with 2px offset, adopted because S2 has none.
    - (b) **Mono font**: S1's IBM Plex Mono **not** adopted. The system mono stack from S2's inline usage is used instead.
    - (c) **Breakpoints**: undefined in both. Nothing was filled; this needs a Decision-log entry.
    - (d) **S1 contrast notes** (white on magenta, crimson on ink) are moot, because S2 never uses those pairs.
17. **Ambiguities:**
    - Which homepage is final. `Homepage.dc.html` is assumed: the Sitemap links it, and it carries both breakpoints. Fade Edge and the four Mobile variants are older and link to missing `(Mobile)` files.
    - `SiteFooterMobile` vs `v2`: identical files, so either is fine.
    - Homepage's first Founder section is headed "Chicago operators, not account managers" (plural) while the second says "One founder, no layers". The human should pick one story.
    - Book a Call: the homework form has **six** fields (Name, Business, Website URL, Revenue range, Marketing setup, Biggest bottleneck) but says "Five fields". Thank You's homework reminder lists a **different** five (Store URL, Annual revenue, Who runs the store, Monthly ad spend, The one number).
18. **Not found in source 2 (OK, no conflict):** no payment, checkout or Stripe UI; no Proton references; no "coming soon" placeholders (the phrase appears only inside "No demo studies, no 'coming soon.'"); no Turnstile shown on forms (to be added in the port); no public account or login UI.
