import React from 'react'

import { CategoryTabsNav } from './CategoryTabsNav'

export interface CategoryTab {
  label: string
  anchorId: string
}

/** Matches the config exactly (until the block is registered and types are generated). */
interface CategoryTabsData {
  blockType?: 'categoryTabs'
  ariaLabel?: string | null
}

/**
 * Derive the tabs from the page layout: every `accordionFAQ` block with
 * variant `group` and an `anchorId` contributes `{ label: heading, anchorId }`
 * in layout order. Pure; the integrator calls it with `page.layout`.
 */
export function deriveCategoryTabs(layout: unknown[]): CategoryTab[] {
  if (!Array.isArray(layout)) return []
  const tabs: CategoryTab[] = []
  for (const row of layout) {
    if (!row || typeof row !== 'object') continue
    const b = row as { blockType?: unknown; variant?: unknown; anchorId?: unknown; heading?: unknown }
    if (b.blockType !== 'accordionFAQ' || b.variant !== 'group') continue
    const anchorId = typeof b.anchorId === 'string' ? b.anchorId.trim() : ''
    if (!anchorId) continue
    const label = typeof b.heading === 'string' && b.heading.trim() ? b.heading.trim() : anchorId
    tabs.push({ label, anchorId })
  }
  return tabs
}

/**
 * CategoryTabs (p11 §Category nav). Server component: validates and renders
 * the links; only the scroll-spy lives in the client island. Without JS the
 * links are plain in-page anchors.
 */
export function CategoryTabsBlock({ ariaLabel, tabs }: CategoryTabsData & { tabs?: CategoryTab[] }) {
  const valid = (tabs ?? []).filter((t) => t && t.label && t.anchorId)
  if (valid.length === 0) {
    console.warn('[CategoryTabs] no tabs: the page has no AccordionFAQ "group" blocks with an anchorId; rendering nothing.')
    return null
  }
  return <CategoryTabsNav ariaLabel={ariaLabel || 'Categories'} tabs={valid} />
}
