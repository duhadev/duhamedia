import React from 'react'

import { Container, ButtonLink } from '@/components/ui'
import { getChrome, toNavItem, toNavItems } from '@/lib/chrome'

import { MobileNav } from './MobileNav'
import { NavLink } from './NavLink'
import { SiteLogo } from './SiteLogo'

export type HeaderVariant = 'standard' | 'logo-only' | 'none'

/**
 * Site header (B1). Design: SiteHeader.dc.html (desktop 72px) +
 * SiteHeaderMobile.dc.html (60px), one responsive component (mobile below `md`).
 *
 * - `standard`: sticky, cream ground, hairline bottom border, logo + the
 *   `navigation.header.links` + CTA (`navigation.header.cta`). Below `md` the links
 *   and CTA live in the MobileNav panel.
 * - `logo-only` (Campaign LP, Lead Magnet): logo, not a link, nothing else
 *   (LP header design: 820px column, hairline border, not sticky). Zero leakage:
 *   this branch never reads navigation.
 * - `none` (Link-in-Bio): renders nothing.
 *
 * Empty or unreadable navigation → logo only (still a link home), no crash.
 */
export async function SiteHeader({ variant = 'standard' }: { variant?: HeaderVariant }) {
  if (variant === 'none') return null

  if (variant === 'logo-only') {
    return (
      <header className="border-b border-divider">
        <div className="mx-auto flex w-full max-w-[820px] items-center px-container-mobile py-3.5 md:px-container md:py-4">
          <SiteLogo size="lp" />
        </div>
      </header>
    )
  }

  const { navigation } = await getChrome()
  const links = toNavItems(navigation.header?.links)
  const cta = toNavItem(navigation.header?.cta)
  const linkClass = 'inline-flex min-h-target items-center text-[15px] font-medium text-ink no-underline'

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-cream">
      <Container className="flex h-header-mobile items-center justify-between md:h-header">
        <SiteLogo size="header" href="/" />
        {links.length > 0 || cta ? (
          <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {links.map((item) => (
              <NavLink key={item.href + item.label} item={item} className={linkClass} />
            ))}
            {cta ? <ButtonLink link={navigation.header?.cta} variant="primary" size="sm" /> : null}
          </nav>
        ) : null}
        {links.length > 0 || cta ? (
          <MobileNav>
            <nav
              aria-label="Main"
              className="flex flex-col border-t border-divider bg-cream px-container-mobile pt-2 pb-5 shadow-ring"
            >
              {links.map((item) => (
                <NavLink
                  key={item.href + item.label}
                  item={item}
                  className="flex min-h-12 items-center border-b border-divider text-body-mobile text-ink no-underline"
                />
              ))}
              {cta ? (
                <NavLink
                  item={cta}
                  className="mt-4 flex min-h-13 items-center justify-center bg-ink text-small font-bold tracking-[0.06em] text-cream uppercase no-underline"
                />
              ) : null}
            </nav>
          </MobileNav>
        ) : null}
      </Container>
    </header>
  )
}
