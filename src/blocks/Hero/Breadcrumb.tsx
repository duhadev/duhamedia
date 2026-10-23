import React from 'react'

import type { BlockData } from '@/blocks/types'
import { CMSLink, type CMSLinkData, resolveLinkHref } from '@/components/ui'
import { cx } from '@/lib/cx'

type Crumb = NonNullable<BlockData<'hero'>['breadcrumb']>[number]

const linkOf = (crumb: Crumb): CMSLinkData | null => {
  if (crumb.page) return { type: 'internal', reference: crumb.page }
  const url = crumb.url?.trim()
  return url ? { type: 'custom', url } : null
}

const TONES = {
  // Shopify / Marketing breadcrumb bar: mono 10/11px, 0.1em, on the ink band.
  dark: { list: 'font-mono text-[10px] tracking-[0.1em] md:text-[11px]', link: 'text-cream/55', current: 'text-cream' },
  // Case Study article header: body font 10/11px, 0.12em, gray-warm.
  light: { list: 'text-[10px] tracking-[0.12em] md:text-[11px]', link: 'text-gray-warm', current: 'text-gray-warm' },
} as const

/**
 * Hero breadcrumb trail: `<nav aria-label>` + ordered list, one `<li>` per
 * crumb, the last marked `aria-current="page"` and never a link. The markup is
 * a plain nav/ol/li (visible text = crumb label) so a page-scope BreadcrumbList
 * JSON-LD can be generated from the same field with no markup change. Links
 * get a 44px hit area through an invisible pseudo-element (the bar stays slim).
 */
export function Breadcrumb({ items, tone }: { items: Crumb[]; tone: keyof typeof TONES }) {
  const crumbs = items.filter((c) => c.label?.trim())
  if (!crumbs.length) return null
  const t = TONES[tone]
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cx('flex flex-wrap items-center gap-x-2.5 gap-y-1 font-bold uppercase md:gap-x-3', t.list)}>
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1
          const link = last ? null : linkOf(crumb)
          const href = resolveLinkHref(link)
          return (
            <li
              key={crumb.id ?? i}
              className={cx(
                'flex items-center gap-x-2.5 md:gap-x-3',
                !last && "after:opacity-40 after:content-['/']",
              )}
            >
              {href ? (
                <CMSLink
                  link={link}
                  className={cx(
                    "relative no-underline after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] hover:underline",
                    t.link,
                  )}
                >
                  {crumb.label}
                </CMSLink>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cx(last ? t.current : t.link)}>
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
