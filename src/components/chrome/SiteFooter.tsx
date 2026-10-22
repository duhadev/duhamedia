import Link from 'next/link'
import React from 'react'

import { buttonClasses } from '@/components/ui'
import { getChrome, getNewsletterHref, toNavItems, type NavItem } from '@/lib/chrome'
import { cx } from '@/lib/cx'

import { NavLink } from './NavLink'
import { SiteLogo } from './SiteLogo'

export type FooterVariant = 'standard' | 'reduced-nav' | 'legal-only'

const EDGE = 'mx-auto w-full max-w-site px-container-mobile md:px-container'
// Mobile footer links meet the 44px touch target; on desktop (pointer) the design's tight list spacing is kept.
const LIST_LINK = 'flex min-h-target items-center text-cream no-underline opacity-85 md:min-h-0 md:opacity-75'
const HEADING =
  'text-[10px] font-bold tracking-[0.1em] uppercase opacity-55 md:mb-1 md:text-label md:tracking-[0.08em] md:opacity-100'

/**
 * Site footer (B1). Design: SiteFooter.dc.html + SiteFooterMobile.dc.html, one
 * responsive component. Ink ground, cream text. Variant = `pages.footerVariant`:
 *
 * - `standard`: brand (logo + `site-settings.footerTagline`), the link columns
 *   (`navigation.footer.standard.columns`, up to 3) and the quiet newsletter nudge
 *   (`navigation.footer.standard.newsletterNudge`), then the bottom bar.
 * - `reduced-nav`: logo + `navigation.footer.reduced.links`, then the bottom bar.
 * - `legal-only`: the bottom bar alone (`navigation.footer.legalLinks` +
 *   "© <year> <site-settings.legalName>"). Campaign LP: nothing but those legal
 *   links, no nav and no newsletter.
 *
 * Empty globals → the zone is simply omitted (a bare © bar remains); never throws.
 */
export async function SiteFooter({ variant = 'standard' }: { variant?: FooterVariant }) {
  const { navigation, settings } = await getChrome()
  const footer = navigation.footer
  const legalLinks = toNavItems(footer?.legalLinks)
  const year = new Date().getFullYear()
  const legalName = settings.legalName?.trim() || 'Duha Media'

  return (
    <footer className="bg-ink font-medium text-cream">
      {variant === 'standard' ? <StandardZones settings={settings} footer={footer} /> : null}
      {variant === 'reduced-nav' ? <ReducedZone links={toNavItems(footer?.reduced?.links)} /> : null}
      <div className="border-t border-on-accent/20">
        <div
          className={cx(
            EDGE,
            'flex flex-wrap items-center justify-between gap-2.5 py-3.5 text-[12px] opacity-55 md:gap-3 md:py-4 md:text-[13px] md:opacity-60',
          )}
        >
          <span>
            © {year} {legalName}
          </span>
          {legalLinks.length > 0 ? (
            <nav aria-label="Legal" className="order-first flex flex-wrap gap-x-3.5 md:order-last md:gap-x-5">
              {legalLinks.map((item) => (
                <NavLink
                  key={item.href + item.label}
                  item={item}
                  className="inline-flex min-h-target items-center text-cream no-underline md:min-h-0"
                />
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

function ReducedZone({ links }: { links: NavItem[] }) {
  return (
    <div className={cx(EDGE, 'flex flex-col gap-4 py-6.5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-10')}>
      <SiteLogo size="footer" decorative />
      {links.length > 0 ? (
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4.5 text-[15px] md:gap-x-6 md:text-small">
          {links.map((item) => (
            <NavLink key={item.href + item.label} item={item} className={LIST_LINK} />
          ))}
        </nav>
      ) : null}
    </div>
  )
}

async function StandardZones({
  settings,
  footer,
}: {
  settings: Awaited<ReturnType<typeof getChrome>>['settings']
  footer: Awaited<ReturnType<typeof getChrome>>['navigation']['footer']
}) {
  const columns = (footer?.standard?.columns ?? [])
    .map((column) => ({ title: column.title?.trim(), links: toNavItems(column.links) }))
    .filter((column) => column.title && column.links.length > 0)
  const nudge = footer?.standard?.newsletterNudge
  const newsletterHref = await getNewsletterHref()
  const tagline = settings.footerTagline?.trim()

  return (
    <div
      className={cx(
        EDGE,
        'flex flex-col gap-6.5 pt-8 pb-6.5 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] md:gap-10 md:pt-16 md:pb-8',
      )}
    >
      {/* Brand */}
      <div className="flex flex-col gap-3.5 text-small md:gap-2.5">
        <SiteLogo size="footer" decorative />
        {tagline ? <span className="hidden max-w-[28ch] opacity-75 md:block">{tagline}</span> : null}
      </div>

      {/* Newsletter nudge: second on mobile (design), last zone on desktop */}
      {nudge && (nudge.heading || nudge.line || nudge.buttonLabel) ? (
        <div className="flex flex-col gap-2.5 text-small md:col-start-5 md:row-start-1">
          {nudge.heading ? <span className={cx(HEADING, 'hidden md:block')}>{nudge.heading}</span> : null}
          {nudge.line ? <span className="text-[13px] opacity-60 md:text-small md:opacity-75">{nudge.line}</span> : null}
          {/* The form-rendering block (NewsletterBand/FormEmbed) is not built yet: the nudge links to the newsletter page. */}
          {newsletterHref && nudge.buttonLabel ? (
            <Link
              href={newsletterHref}
              className={buttonClasses({ variant: 'ghost-light', size: 'sm', className: 'self-start' })}
            >
              {nudge.buttonLabel}
            </Link>
          ) : null}
        </div>
      ) : null}

      {/* Link columns: 2-up grid on mobile (an odd last column spans), the outer grid's tracks on desktop */}
      {columns.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-5.5 border-t border-on-accent/20 pt-6 md:contents md:border-0 md:pt-0 max-md:[&>:last-child:nth-child(odd)]:col-span-2">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col text-[15px] md:gap-2.5 md:text-small">
              <span className={HEADING}>{column.title}</span>
              {column.links.map((item) => (
                <NavLink key={item.href + item.label} item={item} className={LIST_LINK} />
              ))}
            </nav>
          ))}
        </div>
      ) : null}
    </div>
  )
}
