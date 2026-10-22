import localFont from 'next/font/local'

/**
 * Brand fonts (MERGED.md §3): Archivo Black (display: headings, metrics; one
 * 900 cut exposed as weight 400) and DM Sans (body, 400/500/700; body default
 * 500). Both are SIL OFL and committed as latin-subset woff2 under ./fonts
 * (licences beside them), so `next build` needs no network (the Docker build
 * runs with --network=none; `next/font/google` fetched at build time and broke
 * CI). Sources: fonts.gstatic.com latin files from the Google Fonts CSS API.
 * The CSS variables feed `--font-display` / `--font-body` in styles.css
 * (`@theme inline`). Mono is the system stack, not loaded here.
 */
export const archivoBlack = localFont({
  src: [{ path: './fonts/ArchivoBlack-Regular-latin.woff2', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-archivo-black',
  adjustFontFallback: 'Arial',
})

// Variable font (wght 100-1000 axis): covers 400/500/700 in one file.
export const dmSans = localFont({
  src: [{ path: './fonts/DMSans-Variable-latin.woff2', weight: '100 1000', style: 'normal' }],
  display: 'swap',
  variable: '--font-dm-sans',
  adjustFontFallback: 'Arial',
})
