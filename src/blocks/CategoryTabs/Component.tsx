import React from 'react'

import { loadAccordionFaqs } from '@/blocks/AccordionFAQ/Component'
import type { BlockData } from '@/blocks/types'

import { CategoryTabsNav } from './CategoryTabsNav'

/** The source fields of the group block a tab was derived from (for the published-questions check). */
export interface CategoryTabSource {
  source?: 'selected' | 'category' | null
  faqs?: unknown[] | null
  category?: string | null
  limit?: number | null
}

export interface CategoryTab {
  label: string
  anchorId: string
  /** Present on derived tabs; absent on hand-written ones (fixtures), which are never filtered. */
  from?: CategoryTabSource
}

/** The generated `categoryTabs` row type (src/payload-types.ts `CategoryTabsBlock`). */
type CategoryTabsData = BlockData<'categoryTabs'>

/**
 * Derive the tabs from the page layout: every `accordionFAQ` block with
 * variant `group` and an `anchorId` contributes `{ label: heading, anchorId }`
 * in layout order. First row wins per anchorId (a duplicate is warned about
 * and skipped). Each tab keeps its group's source fields so the block can drop
 * groups with no published questions. Pure; called with `page.layout`.
 */
export function deriveCategoryTabs(layout: unknown[]): CategoryTab[] {
  if (!Array.isArray(layout)) return []
  const tabs: CategoryTab[] = []
  const seen = new Set<string>()
  for (const row of layout) {
    if (!row || typeof row !== 'object') continue
    const b = row as { blockType?: unknown; variant?: unknown; anchorId?: unknown; heading?: unknown } & CategoryTabSource
    if (b.blockType !== 'accordionFAQ' || b.variant !== 'group') continue
    const anchorId = typeof b.anchorId === 'string' ? b.anchorId.trim() : ''
    if (!anchorId) continue
    const label = typeof b.heading === 'string' && b.heading.trim() ? b.heading.trim() : anchorId
    if (seen.has(anchorId)) {
      console.warn(`[CategoryTabs] duplicate anchorId "${anchorId}" among FAQ groups; keeping the first, skipping "${label}".`)
      continue
    }
    seen.add(anchorId)
    tabs.push({ label, anchorId, from: { source: b.source, faqs: b.faqs, category: b.category, limit: b.limit } })
  }
  return tabs
}

/**
 * CategoryTabs (p11 §Category nav). Server component: validates and renders
 * the links; only the scroll-spy lives in the client island. Without JS the
 * links are plain in-page anchors.
 */
export async function CategoryTabsBlock({ ariaLabel, tabs }: CategoryTabsData & { tabs?: CategoryTab[] }) {
  const candidates = (tabs ?? []).filter((t) => t && t.label && t.anchorId)
  // A group with no published questions renders nothing, so its tab would be dead.
  const live = await Promise.all(
    candidates.map(async (t) => (t.from ? (await loadAccordionFaqs({ source: t.from.source ?? 'selected', faqs: t.from.faqs as never, category: t.from.category as never, limit: t.from.limit })).length > 0 : true)),
  )
  const valid = candidates.filter((_, i) => live[i]).map(({ label, anchorId }) => ({ label, anchorId }))
  if (valid.length === 0) {
    console.warn('[CategoryTabs] no tabs: the page has no AccordionFAQ "group" blocks with an anchorId; rendering nothing.')
    return null
  }
  return <CategoryTabsNav ariaLabel={ariaLabel || 'Categories'} tabs={valid} />
}
