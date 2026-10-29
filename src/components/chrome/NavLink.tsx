import Link from 'next/link'
import React from 'react'

import { ArrowText } from '@/components/ui/ArrowText'
import type { NavItem } from '@/lib/chrome'

/** `aria-current` for a nav item: `page` on an exact match, `true` inside its section (e.g. /work on /work/foo). */
export const navCurrent = (href: string, path: string | undefined): 'page' | 'true' | undefined => {
  if (!path || !href.startsWith('/') || href.startsWith('//')) return undefined
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)
  const h = clean(href.split(/[?#]/)[0])
  const p = clean(path)
  if (h === p) return 'page'
  return h !== '/' && p.startsWith(`${h}/`) ? 'true' : undefined
}

/**
 * A resolved nav item (see `toNavItems`) as a Next `Link` (site paths) or `<a>` (https:, mailto:).
 * `draw`: the label sits in an `ix-draw` span (interaction system: a 2px rule draws in under it on
 * hover, and stays solid while `current` marks this page/section).
 */
export function NavLink({
  item,
  className,
  children,
  draw = false,
  current,
}: {
  item: NavItem
  className?: string
  children?: React.ReactNode
  draw?: boolean
  current?: 'page' | 'true'
}) {
  const newTab = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const label = children ?? <ArrowText text={item.label} />
  const content = draw ? <span className="ix-draw">{label}</span> : label
  // Same "opens in a new tab" cue as CMSLink (F64 A2).
  const cue = item.newTab ? <span className="sr-only"> (opens in a new tab)</span> : null
  if (item.href.startsWith('/') && !item.href.startsWith('//')) {
    return (
      <Link href={item.href} className={className} aria-current={current} {...newTab}>
        {content}
        {cue}
      </Link>
    )
  }
  return (
    <a href={item.href} className={className} {...newTab}>
      {content}
      {cue}
    </a>
  )
}
