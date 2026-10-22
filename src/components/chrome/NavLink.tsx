import Link from 'next/link'
import React from 'react'

import type { NavItem } from '@/lib/chrome'

/** A resolved nav item (see `toNavItems`) as a Next `Link` (site paths) or `<a>` (https:, mailto:). */
export function NavLink({ item, className, children }: { item: NavItem; className?: string; children?: React.ReactNode }) {
  const newTab = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const content = children ?? item.label
  if (item.href.startsWith('/') && !item.href.startsWith('//')) {
    return (
      <Link href={item.href} className={className} {...newTab}>
        {content}
      </Link>
    )
  }
  return (
    <a href={item.href} className={className} {...newTab}>
      {content}
    </a>
  )
}
