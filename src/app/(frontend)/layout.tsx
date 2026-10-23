import type { Metadata } from 'next'
import React from 'react'

import { PreviewMode } from '@/components/preview/PreviewMode'
import { getSiteUrl } from '@/lib/env'
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
    // No `robots` here (F78 B1): staging / local dev are kept out of search by
    // the runtime `X-Robots-Tag` header (src/proxy.ts), so a 404 never carries
    // Next's own not-found noindex tag PLUS a layout one.
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${dmSans.variable}`}>
      <body>
        {/* Header/footer are per-page (variant fields): rendered by <PageShell> in each route, not here. */}
        {children}
        {/* Staff draft preview only (F57/F58): live-preview refresh + exit banner. */}
        <PreviewMode />
      </body>
    </html>
  )
}
