# Button

There are three button levels: primary, secondary and ghost. Use one primary per page or section, and never put two primaries side by side.

| Level | Fill / border | Text | Example |
|---|---|---|---|
| Primary | `cta` fill (crimson), hover `cta-hover` (magenta) | `white`, `button` style, 700 | "Get a free site audit" |
| Secondary | transparent, 1.5px `text` border | `text`, 500 | "Book a call" |
| Ghost | none | Plex Mono 12px, uppercase, underline, `link`, arrow suffix | "VIEW CASE STUDY →" |

- Corners: `radius-sm` (3px). Padding: `space-2.5` × `space-5`.
- Labels are specific actions ("Get a free site audit"), never "Let's chat!" or "Learn more".
- On dark sections (Dark section theme) the secondary outline and text turn white, and ghost links turn gold.
- The consumer provides the label, an `href` or handler, and the focus ring (2px `text` outline, 2px offset).
