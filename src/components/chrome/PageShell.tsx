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
 * Also owns the skip-to-content link (first focusable element on every page) and
 * the focus target it points at: the routes' `<main>` elements live in several
 * files, so `#main` is a focusable wrapper around `children` instead (F41).
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:inline-flex focus:min-h-target focus:items-center focus:bg-ink focus:px-5 focus:text-small focus:font-bold focus:text-cream focus:no-underline focus:outline-2 focus:outline-offset-2 focus:outline-cream"
      >
        Skip to content
      </a>
      <SiteHeader variant={header} />
      <div id="main" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <SiteFooter variant={footer} />
    </>
  )
}
