import React from 'react'

import type { BlockData, PageLayoutBlock } from '@/blocks/types'
import { resolveLinkHref } from '@/components/ui'
import { breadcrumbJsonLd, type Crumb } from '@/lib/metadata'

type HeroCrumb = NonNullable<BlockData<'hero'>['breadcrumb']>[number]

const isHero = (row: PageLayoutBlock): row is BlockData<'hero'> => row.blockType === 'hero'

/** Same destination rule as the visible trail (src/blocks/Hero/Breadcrumb.tsx `linkOf`). */
const hrefOf = (crumb: HeroCrumb): string | null => {
  if (crumb.page) return resolveLinkHref({ type: 'internal', reference: crumb.page })
  return resolveLinkHref({ type: 'custom', url: crumb.url })
}

/** The trail of the FIRST Hero block that shows one (service / article variants), or `null`. */
export const heroCrumbs = (layout: readonly PageLayoutBlock[] | null | undefined): Crumb[] | null => {
  const hero = (layout ?? []).filter(isHero).find((h) => (h.variant === 'service' || h.variant === 'article') && h.breadcrumb?.length)
  return hero?.breadcrumb ? hero.breadcrumb.map((c) => ({ label: c.label ?? '', href: hrefOf(c) })) : null
}

/**
 * ONE BreadcrumbList JSON-LD for a page whose Hero shows a breadcrumb (F78
 * INFO recipe, router level: the Hero block itself emits no structured data).
 * `currentUrl` = the page's canonical URL. Renders nothing without a trail.
 */
export function BreadcrumbJsonLd({ crumbs, currentUrl }: { crumbs: Crumb[] | null; currentUrl: string | undefined }) {
  const list = crumbs ? breadcrumbJsonLd(crumbs, currentUrl) : null
  if (!list) return null
  const jsonLd = { '@context': 'https://schema.org', ...list }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
  )
}
