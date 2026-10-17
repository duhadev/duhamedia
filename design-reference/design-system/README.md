# duha media

Sharp. Calculated. Evidence-based. Direct. Technical. Duha Media is a Shopify development and CRO studio, and its brand works like the work: let the evidence speak. No enthusiasm, no exclamation marks.

**Tagline:** We engineer the foundation. Then we prove it works.

This system is the brand guide from Arch's Duha Media chats, moved here as one reference. Build every Duha Media surface from it: the site, decks, proposals, cards, and social posts.

---

## Brand character

| Is | Is not |
|---|---|
| Sharp, calculated | Playful, casual |
| Evidence-based, direct | Warm/friendly, humble |
| Technical, structured | Decorative |

Reference brands: **Oracle** (authority and brevity), **Orbit Media** (methodical clarity), **IBM** (structured precision), **Linear** (sharp, minimal, technical). What they share is that they let the work speak.

The mark and lowercase wordmark read friendly on their own. Typography, layout and voice carry the precision: tight tracking, mono labels, ink grounds, sharp corners, and data-first copy.

## Voice: write this, not that

| Context | Write this | Not this |
|---|---|---|
| Hero headline | "We engineer the foundation. Then we prove it works." | "Transform your business with data-driven growth." |
| CTA | "Get a free site audit" | "Let's chat!" / "Book a discovery call" |
| Service description | "500 monthly sessions minimum. Below that, A/B tests produce noise, not signal." | "We help growing brands unlock their potential." |
| Results | "Conversion rate up 22% in 90 days. Here's exactly what changed." | "Amazing results for our clients!" |
| About | "Documentation-driven. Every change has a rationale. Every test has a record." | "We're passionate about helping businesses succeed online." |

- Lead with data in headers: "22% lift" before "better conversions".
- No adjective without a number behind it. No exclamation marks.
- Tiers are named Class A / B / C and set in the `label` mono style.

## Logo

The mark is a disc cut into four horizontal bands. From bottom to top they are `crimson`, `magenta`, `gold` and `cream`. It reads as a stacked bar chart, a nod to CRO and data. The file is in **Assets → Logos** (`duha-mark.svg`).

- Primary wordmark: **duha media** in lowercase, IBM Plex Sans 700, in `ink` (or `white` on dark sections).
- Formal contexts: **DUHA MEDIA** in uppercase.
- Lockup: mark at roughly the cap height ×1.6, `space-2` gap, wordmark to the right.
- Never stretch, recolor, outline, or add effects to the mark.
- You can repeat the four-band motif in UI: tier comparison cards, progress indicators, section dividers. Draw it as flat bands with `radius-none`.

## Color

Use flat color only. **Never use gradients.**

| Token | Hex | Role |
|---|---|---|
| `ink` | #0F172A | Text, nav, dark backgrounds |
| `crimson` | #C20E59 | Primary accent, hover, CTA fill |
| `magenta` | #E82561 | CTAs, links, active states |
| `gold` | #F5C842 | Callouts, badges, used sparingly |
| `cream` | #FCE588 | Subtle section tints only |
| `offwhite` | #F8F8F6 | Page background, cards |

- **One primary CTA per page or section.** Its fill is `cta` (crimson) with white text, and `cta-hover` is magenta.
- `gold` and `cream` are accents only, never the dominant color, because they soften the page. Put `ink` text on them, never white.
- Dark sections use an `ink` ground with `white` text. Switch to the **Dark section** theme for them, which re-maps `bg`, `text`, `text-muted`, `link` and `hairline`.
- Section rhythm, top to bottom: dark hero (`ink`) → `offwhite` → `white` → … → dark CTA band (`ink`).

**Contrast notes**
- White on `magenta` is 4.31:1, just under AA for body-size text. The primary fill is therefore `crimson` (6.0:1). Use magenta as a fill only for text that is 18.66px bold, or 24px and up.
- `crimson` on `ink` is 2.98:1. Never set crimson text on a dark section. Links there use `gold` through the `link` token.
- The old metadata color (ink at 40%, 2.55:1) is retired. Use `text-muted` (ink at 60%, 4.69:1).

## Typography: IBM Plex Sans + IBM Plex Mono

Both families are served from Google Fonts at weights 400, 500 and 700. Plex Sans is technical and structured, precise without being cold. Use tight negative tracking on headlines and generous leading on body text. Plex Mono is for every label, metadata line, tier identifier, hex value, and data callout.

| Style | Size / weight | Tracking | Use |
|---|---|---|---|
| `display` | 56 / 700 | −0.02em | Hero headlines only |
| `h1` | 36 / 700 | −0.015em | Page titles |
| `h2` | 24 / 700 | −0.01em | Section headers |
| `h3` | 18 / 500 | 0 | Sub-sections |
| `body` | 16 / 400, leading 1.7 | 0 | Body copy |
| `label` | 11 / 500 mono | +0.1em, ALL CAPS | Labels, tiers, tags |
| `metadata` | 12 / 400 mono | 0 | Dates, values, in `text-muted` |

- Don't use more than two type sizes in one section, or the hierarchy collapses.
- Don't use loose or default tracking on headlines. It reads as careless.

## Buttons

1. **Primary:** `cta` fill, white `button` text, `radius-sm`, padding `space-2.5` × `space-5`. Example: "Get a free site audit".
2. **Secondary:** 1.5px `ink` outline, `ink` text at weight 500, transparent fill. Example: "Book a call".
3. **Ghost:** Plex Mono, uppercase, underlined, `link` color, with an arrow suffix. Example: "VIEW CASE STUDY →". Use it only for in-content navigation.

Never put two primary buttons side by side.

## Layout and shape

- **Corners:** `radius-sm` (3px) is the maximum on buttons, cards and tags. Sharp corners signal precision.
- **Whitespace:** `space-24` between sections and `space-12` between blocks. Let the content breathe.
- **Conversion-aware:** put the primary CTA above the fold on every page, with one clear action per section.
- **Mobile-first:** the ICP is small-business owners checking on the go.

## Imagery

- **Use:** UI mockups, heatmap screenshots, data visualizations, and abstract geometry drawn from the four-band mark.
- **Don't use:** stock photography of people, such as smiling-at-laptop or handshake shots.
- Don't add decoration that has no function.

## History

- **March 2026:** an early proposal deck ran on a blue/cyan spec (`#1E40AF`, `#06B6D4`, `#0F172A`). The deck was then re-themed to a "daybreak" palette (`#C30E59`, `#E82561`, `#F2AE66`, `#E8E7AB`).
- **April 2026:** the logo-derived palette and this guide replaced both of those. This system follows the April guide.

## Still open

- **Logo:** `duha-mark.svg` is the vector drawing of the mark used in the website code. Replace it with the original logo export, and add a wordmark lockup file, when you have them.
- **Display size:** the brand guide sets Display at 56px. The Tailwind token sheet's `text-5xl` renders 48px. This system uses 56px.
- **H3 size:** the brand guide sets H3 at 18px. The sheet's `text-xl` renders 20px. This system uses 18px.
- **Line heights:** heading line heights and the spacing steps beyond button padding are Tailwind defaults, not choices made in the guide.
