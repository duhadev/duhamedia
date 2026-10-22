import React from 'react'

import { SiteFooter, type FooterVariant } from './SiteFooter'
import { SiteHeader, type HeaderVariant } from './SiteHeader'

/**
 * Wraps a page's `<main>` with the site chrome (B1). Rendered by the page route
 * components, NOT by the root layout: the header and footer variants are
 * per-page fields (`pages.headerVariant` / `pages.footerVariant`) and a layout
 * cannot see the page it wraps (it does not re-render on navigation and gets no
 * page data), so the route that loaded the page passes them in.
 *
 * Defaults = standard header + standard footer (home fallback, 404, /_showcase).
 */
export function PageShell({
  header = 'standard',
  footer = 'standard',
  children,
}: {
  header?: HeaderVariant
  footer?: FooterVariant
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader variant={header} />
      {children}
      <SiteFooter variant={footer} />
    </>
  )
}
