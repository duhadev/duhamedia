import type { Metadata } from 'next'
import React from 'react'

import { getSiteUrl, isProduction } from '@/lib/env'

import { archivoBlack, dmSans } from './fonts'
import './styles.css'

// Every frontend route renders at request time, so `next build` never needs a
// database (DECISIONS.md §F).
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: 'Duha Media',
    // Anything that is not production (staging, local dev) is never indexed.
    robots: isProduction() ? undefined : { index: false, follow: false },
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${dmSans.variable}`}>
      <body>
        {/* Header/footer are per-page (variant fields): rendered by <PageShell> in each route, not here. */}
        {children}
      </body>
    </html>
  )
}
