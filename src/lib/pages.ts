import 'server-only'

import config from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { isStaff } from '@/access'
import type { PageLayoutBlock } from '@/blocks/types'
import type { Page, User } from '@/payload-types'

/**
 * Page loader (B0, extended by the router unit B2).
 *
 * Public by default: the PUBLISHED `pages` doc for a slug, or `null`. Public
 * access only (`overrideAccess: false`, no user → the collection's read rule
 * returns published docs only) plus an explicit `_status` filter and
 * `draft: false`, so a draft can never render publicly.
 *
 * Draft preview: ONLY when Next draft mode is on AND the request carries a
 * valid Payload session of a STAFF user (admin / marketing). The draft-mode
 * cookie alone is never trusted (it outlives a logout and could be replayed);
 * the pipeline API user is logged in but not staff, so it never sees drafts
 * here. In preview the query runs as that user (`overrideAccess: false`), so
 * the collection's own access rules still apply.
 *
 * Request-time only (the frontend is force-dynamic; no build-time DB access).
 * `cache` dedupes per request (page + generateMetadata).
 *
 * Depth 2 (B2 decision): the page's own relationships (depth 1) and the docs
 * they point at (depth 2). Deeper levels would be capped anyway by the
 * per-field `maxDepth` of the related collections (payload@3.91.0
 * fields/hooks/afterRead/relationshipPopulationPromise.js:86 caps the ABSOLUTE
 * depth, e.g. testimonials.client maxDepth 1 never populates under a page).
 */
export const PAGE_QUERY_DEPTH = 2

/** The staff user previewing drafts, or `null` (draft mode off, no/invalid session, non-staff). */
export const getPreviewUser = cache(async (): Promise<User | null> => {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers(), canSetHeaders: false })
    return user && user.collection === 'users' && isStaff(user) ? (user as User) : null
  } catch {
    return null
  }
})

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayload({ config })
  const user = await getPreviewUser()
  if (user) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: PAGE_QUERY_DEPTH,
      draft: true,
      user,
      overrideAccess: false,
      pagination: false,
    })
    return docs[0] ?? null
  }
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: PAGE_QUERY_DEPTH,
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
