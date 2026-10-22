import type { Metadata } from 'next'
import React from 'react'

import { getSiteUrl, isProduction } from '@/lib/env'
import { getSeoDefaults, siteName, titleTemplate } from '@/lib/metadata'

import { archivoBlack, dmSans } from './fonts'
import './styles.css'

// Every frontend route renders at request time, so `next build` never needs a
// database (DECISIONS.md §F).
export const dynamic = 'force-dynamic'

/**
 * Site-wide defaults (B2). Pages set their own full metadata (src/lib/metadata.ts,
 * `title.absolute`); these apply to every route that does not (not-found,
 * /_showcase): the seo-defaults title template + default description, and the
 * brand name as the default title.
 */
export async function generateMetadata(): Promise<Metadata> {
  const defaults = await getSeoDefaults()
  const name = siteName(defaults)
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: name, template: titleTemplate(defaults) },
    description: defaults.defaultDescription?.trim() || undefined,
    // Anything that is not production (staging, local dev) is never indexed.
    // A route that sets `robots` replaces this (nested field): one tag only.
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
