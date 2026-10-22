import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { PageLayoutBlock } from '@/blocks/types'
import type { Page } from '@/payload-types'

/**
 * Public page loader (B0, minimal): the PUBLISHED `pages` doc for a slug, or
 * `null`. Public access only (`overrideAccess: false`, no user → the
 * collection's read rule returns published docs only) plus an explicit
 * `_status` filter and `draft: false`, so a draft can never render here.
 * Request-time only (the frontend is force-dynamic; no build-time DB access).
 * `cache` dedupes the lookup within one request (page + metadata).
 *
 * Draft mode / live preview, per-page metadata and redirect fallback belong to
 * the router unit, not here.
 */
export const getPublishedPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })
  return docs[0] ?? null
})

/** The page's `layout` rows; `null` while no block is registered (no `layout` field yet). */
export const pageLayout = (page: Page): PageLayoutBlock[] | null => {
  const withLayout: Page & { layout?: PageLayoutBlock[] | null } = page
  return withLayout.layout ?? null
}
