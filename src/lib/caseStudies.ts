import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getPreviewUser } from '@/lib/pages'
import type { CaseStudy } from '@/payload-types'

/**
 * Case-study loader for the p2 template `/work/<slug>` (S4-12). Same rules as
 * `getPage` (src/lib/pages.ts):
 *
 * - Public: the PUBLISHED study only (public access via `overrideAccess: false`
 *   → `publishedOrStaff`, plus an explicit `_status` filter and `draft: false`).
 * - Draft preview: only when Next draft mode is on AND `getPreviewUser()`
 *   returns a staff user (admin / marketing); then the latest draft, queried
 *   as that user so collection access still applies.
 *
 * Depth 2: the study's own relations (client, heroMedia, meta.image,
 * clientVoice.testimonial, narrative upload nodes) at depth 1 and what they
 * point at (testimonial client + video poster) at depth 2, within each
 * field's `maxDepth`. Request-time only; `cache` dedupes page + metadata.
 */
export const CASE_STUDY_QUERY_DEPTH = 2

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  const payload = await getPayload({ config })
  const user = await getPreviewUser()
  if (user) {
    const { docs } = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: CASE_STUDY_QUERY_DEPTH,
      draft: true,
      user,
      overrideAccess: false,
      pagination: false,
    })
    return docs[0] ?? null
  }
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: CASE_STUDY_QUERY_DEPTH,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })
  return docs[0] ?? null
})
