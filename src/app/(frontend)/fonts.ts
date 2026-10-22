import { Archivo_Black, DM_Sans } from 'next/font/google'

/**
 * Brand fonts (MERGED.md §3): Archivo Black (display: headings, metrics; one
 * 900 cut exposed as weight 400) and DM Sans (body, 400/500/700; body default
 * 500). `next/font/google` downloads the files at build time and self-hosts
 * them; the browser never requests Google (next@16 docs, api-reference/
 * components/font). The CSS variables feed `--font-display` / `--font-body`
 * in styles.css (`@theme inline`). Mono is the system stack, not loaded here.
 */
export const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo-black',
})

// Variable font: covers 400/500/700 in one file.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})
