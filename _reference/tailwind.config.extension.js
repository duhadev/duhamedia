/**
 * DUHA MEDIA — Tailwind config extension
 * Merge this into your existing tailwind.config.js / tailwind.config.ts
 * 
 * Usage in tailwind.config.ts:
 *   import { duhaExtension } from './tailwind.config.extension'
 *   export default { content: [...], theme: { extend: duhaExtension } }
 */

export const duhaExtension = {
  colors: {
    brand: {
      ink:      '#0F172A',
      crimson:  '#c20e59',
      magenta:  '#e82561',
      gold:     '#f5c842',
      cream:    '#fce588',
      offwhite: '#F8F8F6',
    },
  },
  fontFamily: {
    sans: ['IBM Plex Sans', 'sans-serif'],
    mono: ['IBM Plex Mono', 'monospace'],
  },
  borderRadius: {
    sm: '3px',   // sharp — use for buttons, cards, badges
    DEFAULT: '4px',
  },
  letterSpacing: {
    tightest: '-0.02em',  // display headlines
    tighter:  '-0.015em', // H1
    tight:    '-0.01em',  // H2
    widest:   '0.1em',    // mono labels
  },
}

/**
 * FONT LOADING — add to app/layout.tsx:
 *
 * import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
 *
 * const plex = IBM_Plex_Sans({
 *   subsets: ['latin'],
 *   weight: ['400', '500', '700'],
 *   variable: '--font-sans',
 * })
 *
 * const plexMono = IBM_Plex_Mono({
 *   subsets: ['latin'],
 *   weight: ['400', '500'],
 *   variable: '--font-mono',
 * })
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" className={`${plex.variable} ${plexMono.variable}`}>
 *       <body className="font-sans">{children}</body>
 *     </html>
 *   )
 * }
 *
 * Then update tailwind.config fontFamily to:
 *   fontFamily: {
 *     sans: ['var(--font-sans)', 'sans-serif'],
 *     mono: ['var(--font-mono)', 'monospace'],
 *   }
 */
