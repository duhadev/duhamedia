import React from 'react'

import type { NavItem } from '@/lib/chrome'
import { cx } from '@/lib/cx'

import { NavLink, navCurrent } from './NavLink'

export type FooterColumn = { title: string; links: NavItem[] }

// Every link row is 44px on every breakpoint: neighbours in a vertical list are only a line apart, so a hit
// area cannot overhang without overlapping. Inline (wrapped) rows are 44px boxes too, so nothing overhangs.
const COL_LINK = 'flex min-h-target items-center text-cream no-underline opacity-85 md:opacity-75'
export const FOOTER_HEADING =
  'text-[10px] font-bold tracking-[0.1em] uppercase opacity-55 md:mb-1 md:text-label md:tracking-[0.08em] md:opacity-100'

/**
 * Longest label (characters) that still sets on one line in a half-width mobile column. The narrowest
 * supported phone (360px) leaves (360 - 2*20 gutter - 20 gap) / 2 = 150px per column; DM Sans 15/500
 * averages ~7.6px a character, so 18 characters keeps a safe margin. "Shopify Theme Development" (25)
 * goes full width, "Testimonials" (12) stays in its half.
 */
const HALF_WIDTH_CHARS = 18

/**
 * Mobile placement of each column (SiteFooterMobile.dc.html): short-label columns pair up as stacked
 * lists in a 2-up grid; a column with a label too long for half the width, or the odd one out, spans the
 * full width below with its links set inline and wrapping (the design's Services row). The odd one out
 * is the column with the fewest links (the last such in CMS order), so the pair stays balanced.
 */
export function mobileColumnModes(columns: FooterColumn[]): ('stack' | 'inline')[] {
  const modes = columns.map((c) =>
    c.links.some((l) => l.label.length > HALF_WIDTH_CHARS) ? ('inline' as const) : ('stack' as const),
  )
  const stacked = modes.flatMap((m, i) => (m === 'stack' ? [i] : []))
  if (stacked.length % 2 === 1) {
    const odd = stacked.reduce((best, i) => (columns[i].links.length <= columns[best].links.length ? i : best))
    modes[odd] = 'inline'
  }
  return modes
}

/**
 * The standard footer's link columns. Mobile/tablet (< md): a 2-up grid under a hairline, balanced by
 * `mobileColumnModes` (full-width inline rows are moved after the pairs with `order`, the DOM keeps the
 * CMS order). Desktop (md+): `contents`, so each column is a track of the footer's outer grid, unchanged.
 */
export function FooterColumns({ columns, path }: { columns: FooterColumn[]; path?: string }) {
  if (columns.length === 0) return null
  const modes = mobileColumnModes(columns)

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-6 border-t border-on-accent/20 pt-6 md:contents md:border-0 md:pt-0">
      {columns.map((column, index) => {
        const inline = modes[index] === 'inline'
        return (
          <nav
            key={column.title}
            aria-labelledby={`footer-col-${index}`}
            className={cx('flex flex-col text-[15px] md:text-small', inline && 'max-md:order-1 max-md:col-span-2')}
          >
            <p id={`footer-col-${index}`} className={cx(FOOTER_HEADING, 'max-md:mb-1')}>
              {column.title}
            </p>
            <div className={cx('flex md:contents', inline ? 'flex-row flex-wrap gap-x-6' : 'flex-col')}>
              {column.links.map((item) => (
                <NavLink key={item.href + item.label} item={item} draw current={navCurrent(item.href, path)} className={COL_LINK} />
              ))}
            </div>
          </nav>
        )
      })}
    </div>
  )
}
