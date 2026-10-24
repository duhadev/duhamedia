import sharp from 'sharp'

/**
 * Seed assets, generated at run time (no binaries committed): simple
 * brand-coloured PNGs rendered from SVG with `sharp` (already a dependency for
 * Payload's image sizes) and a placeholder CSV for the lead-magnet download.
 * Colours are the Tailwind theme tokens (src/app/(frontend)/styles.css @theme:
 * ink #111111, wine #c20e59, cream #ffffff, gray-light #f5f5f4, gray-warm #747069).
 * Every asset says it is a placeholder, in the image itself and in its alt text.
 */

const INK = '#111111'
const WINE = '#c20e59'
const CREAM = '#ffffff'
const GREY = '#f5f5f4'
const WARM = '#747069'

type Upload = { data: Buffer; mimetype: string; name: string; size: number }

const png = async (svg: string, name: string): Promise<Upload> => {
  const data = await sharp(Buffer.from(svg)).png().toBuffer()
  return { data, mimetype: 'image/png', name, size: data.length }
}

/** 1200×630 share image (seo-defaults default OG; plugin-seo needs ≥ 1200×630). */
export const ogImage = () =>
  png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <polygon points="980,0 1200,0 1200,630 760,630" fill="${WINE}"/>
  <rect x="80" y="250" width="14" height="14" fill="${WINE}" transform="rotate(45 87 257)"/>
  <text x="112" y="268" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3" fill="${CREAM}">INTEGRATED ECOMMERCE GROWTH PARTNER — CHICAGO</text>
  <text x="80" y="360" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="96" font-weight="900" fill="${CREAM}">DUHA MEDIA</text>
  <text x="80" y="430" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${GREY}">[Placeholder share image — replace before launch]</text>
</svg>`,
    'seed-og-default.png',
  )

/** 1600×1000 neutral placeholder (posters, spec cards, case-study hero, figures). */
export const placeholderImage = () =>
  png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="${GREY}"/>
  <rect x="740" y="380" width="120" height="120" fill="${WINE}" transform="rotate(45 800 440)"/>
  <text x="800" y="640" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" letter-spacing="4" fill="${INK}">[PLACEHOLDER IMAGE]</text>
  <text x="800" y="700" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="${WARM}">Replace with a real photo or screenshot before launch</text>
</svg>`,
    'seed-placeholder.png',
  )

/** The lead-magnet asset stand-in (downloads accept text/csv). */
export const placeholderWorksheet = (): Upload => {
  const data = Buffer.from(
    [
      'section,item,notes',
      '"[Placeholder]","Worksheet row 1","Replace this file with the real asset before the lead magnet is published"',
      '"[Placeholder]","Worksheet row 2",""',
      '',
    ].join('\n'),
    'utf8',
  )
  return { data, mimetype: 'text/csv', name: 'seed-placeholder-worksheet.csv', size: data.length }
}
