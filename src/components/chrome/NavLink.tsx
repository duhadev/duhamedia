import Link from 'next/link'
import React from 'react'

import type { NavItem } from '@/lib/chrome'

/** A resolved nav item (see `toNavItems`) as a Next `Link` (site paths) or `<a>` (https:, mailto:). */
export function NavLink({ item, className, children }: { item: NavItem; className?: string; children?: React.ReactNode }) {
  const newTab = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const content = children ?? item.label
  // Same "opens in a new tab" cue as CMSLink (F64 A2).
  const cue = item.newTab ? <span className="sr-only"> (opens in a new tab)</span> : null
  if (item.href.startsWith('/') && !item.href.startsWith('//')) {
    return (
      <Link href={item.href} className={className} {...newTab}>
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
