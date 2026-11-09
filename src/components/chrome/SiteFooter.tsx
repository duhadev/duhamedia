import Link from 'next/link'
import React from 'react'

import { CMSForm } from '@/components/forms'
import { buttonClasses } from '@/components/ui'
import { getChrome, getNewsletterFormId, getNewsletterHref, toNavItems, type NavItem } from '@/lib/chrome'
import { cx } from '@/lib/cx'
import { getRequestPath } from '@/lib/requestPath'

import { FooterColumns, FOOTER_HEADING, type FooterColumn } from './FooterColumns'
import { HIT_AREA } from './hit'
import { footerNudgeFormClassNames } from './footerNudgeForm'
import { NavLink, navCurrent } from './NavLink'
import { SiteLogo } from './SiteLogo'

export type FooterVariant = 'standard' | 'reduced-nav' | 'legal-only'

const EDGE = 'mx-auto w-full max-w-site px-container-mobile md:px-container'
// Mobile footer links meet the 44px touch target; on desktop (pointer) the design's tight list spacing is kept.
// Horizontal rows (reduced footer) keep the tight desktop look and get an invisible 44px hit area.
const LIST_LINK = `${HIT_AREA} flex min-h-target items-center text-cream no-underline opacity-85 md:min-h-0 md:opacity-75`

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
  const path = await getRequestPath()

  return (
    <footer data-tone="dark" className="bg-ink font-medium text-cream">
      {variant === 'standard' ? <StandardZones settings={settings} footer={footer} path={path} /> : null}
      {variant === 'reduced-nav' ? <ReducedZone links={toNavItems(footer?.reduced?.links)} path={path} /> : null}
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
                  draw
                  current={navCurrent(item.href, path)}
                  className={`${HIT_AREA} inline-flex min-h-target items-center text-cream no-underline md:min-h-0`}
                />
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

function ReducedZone({ links, path }: { links: NavItem[]; path?: string }) {
  return (
    <div className={cx(EDGE, 'flex flex-col gap-4 py-6.5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-10')}>
      <SiteLogo size="footer" onDark />
      {links.length > 0 ? (
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4.5 text-[15px] md:gap-x-6 md:text-small">
          {links.map((item) => (
            <NavLink key={item.href + item.label} item={item} draw current={navCurrent(item.href, path)} className={LIST_LINK} />
          ))}
        </nav>
      ) : null}
    </div>
  )
}

async function StandardZones({
  settings,
  footer,
  path,
}: {
  settings: Awaited<ReturnType<typeof getChrome>>['settings']
  footer: Awaited<ReturnType<typeof getChrome>>['navigation']['footer']
  path?: string
}) {
  const columns = (footer?.standard?.columns ?? [])
    .map((column) => ({ title: column.title?.trim(), links: toNavItems(column.links) }))
    .filter((column): column is FooterColumn => Boolean(column.title) && column.links.length > 0)
  const nudge = footer?.standard?.newsletterNudge
  const newsletterFormId = await getNewsletterFormId(settings.newsletterForm)
  const newsletterHref = newsletterFormId === null ? await getNewsletterHref() : null
  const tagline = settings.footerTagline?.trim()
  const sourcePath = newsletterFormId !== null ? path : undefined

  // Layout per width: < md the stacked mobile design; md–xl brand | newsletter on one row with the link
  // columns as an equal-track row under them; xl+ the design's single row, brand 2fr, one 1fr track per
  // link column (any count), newsletter 1.5fr. Text tracks are minmax(0, …) so long labels wrap inside
  // their track instead of widening the grid past the viewport (the old auto tracks overflowed 768px by
  // 33px with three columns). The newsletter track keeps an 18.75rem floor: the interaction-only Turnstile
  // slot is a fixed 300px wide, and that floor is what the old auto track resolved to at 1440.
  const style = { '--footer-cols': Math.max(1, columns.length) } as React.CSSProperties

  return (
    <div
      style={style}
      className={cx(
        EDGE,
        'flex flex-col gap-6.5 pt-8 pb-6.5 md:grid md:grid-cols-2 md:gap-10 md:pt-16 md:pb-8',
        'xl:grid-cols-[minmax(0,2fr)_repeat(var(--footer-cols),minmax(0,1fr))_minmax(18.75rem,1.5fr)]',
      )}
    >
      {/* Brand */}
      <div className="flex flex-col gap-3.5 text-small md:gap-2.5">
        <SiteLogo size="footer" onDark />
        {tagline ? <span className="max-w-[28ch] opacity-75">{tagline}</span> : null}
      </div>

      {/* Newsletter nudge: second on mobile (design), last zone on desktop */}
      {nudge && (nudge.heading || nudge.line || nudge.buttonLabel) ? (
        <div className="flex min-w-0 flex-col gap-2.5 text-small md:col-start-2 md:row-start-1 xl:col-start-[-2]">
          {nudge.heading ? <p className={cx(FOOTER_HEADING, 'hidden md:block')}>{nudge.heading}</p> : null}
          {nudge.line ? <span className="text-[13px] opacity-60 md:text-small md:opacity-75">{nudge.line}</span> : null}
          {/* With `site-settings.newsletterForm` the nudge is a real inline form (F42); otherwise a link to the newsletter page. */}
          {newsletterFormId !== null ? (
            <CMSForm
              form={newsletterFormId}
              sourcePath={sourcePath}
              submitLabel={nudge.buttonLabel?.trim() || undefined}
              tone="dark"
              submitVariant="ghost-light"
              submitSize="sm"
              turnstileAppearance="interaction-only"
              classNames={footerNudgeFormClassNames}
            />
          ) : newsletterHref && nudge.buttonLabel ? (
            <Link
              href={newsletterHref}
              className={buttonClasses({ variant: 'ghost-light', size: 'sm', className: 'self-start' })}
            >
              {nudge.buttonLabel}
            </Link>
          ) : null}
        </div>
      ) : null}

      {/* Link columns: balanced 2-up grid on mobile, their own row on tablet, the outer grid's tracks on desktop (FooterColumns) */}
      <FooterColumns columns={columns} path={path} />
    </div>
  )
}
