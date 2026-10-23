import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getPreviewUser } from '@/lib/pages'
import type { Post } from '@/payload-types'

/**
 * Post loader for the p13 / p14 article template (`/insights/<slug>`) and the
 * newsletter-issue template (`/newsletter/<slug>`) (S6-T1). Same rules as
 * `getCaseStudy` (src/lib/caseStudies.ts) and `getPage`:
 *
 * - Public: the PUBLISHED post only (public access via `overrideAccess: false`
 *   → `postsRead` = published, plus an explicit `_status` filter and
 *   `draft: false`).
 * - Draft preview: only when Next draft mode is on AND `getPreviewUser()`
 *   returns a staff user (admin / marketing); then the latest draft, queried
 *   as that user so collection access still applies. The pipeline user is
 *   never a preview user (getPreviewUser is staff-only).
 *
 * Looked up by slug ONLY: post slugs are unique across all three tracks
 * (src/hooks/uniqueSlug.ts), so one slug is one post. The route compares
 * `track` with the tracks it serves (`POST_ROUTE_TRACKS`) and sends a
 * wrong-track URL to the canonical one (308), plan open question 20.
 *
 * Depth 2: the post's own relations (author, heroImage, meta.image,
 * proof.caseStudies, proof.fallbackTestimonials, link references, body upload
 * nodes) at depth 1 and what they point at (a testimonial's client / poster,
 * a study's client / hero) at depth 2, within each field's `maxDepth`.
 * Request-time only; `cache` dedupes page + metadata.
 */
export const POST_QUERY_DEPTH = 2

export type PostTrack = Post['track']

/** The tracks each template route serves. */
export const POST_ROUTE_TRACKS = {
  insights: ['dev-seo', 'mkt-seo'],
  newsletter: ['newsletter-issue'],
} as const satisfies Record<string, readonly PostTrack[]>

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config })
  const user = await getPreviewUser()
  if (user) {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: POST_QUERY_DEPTH,
      draft: true,
      user,
      overrideAccess: false,
      pagination: false,
    })
    return docs[0] ?? null
  }
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: POST_QUERY_DEPTH,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })
  return docs[0] ?? null
})

/** True when `post` belongs on a route serving `tracks`. */
export const servesTrack = (post: Pick<Post, 'track'>, tracks: readonly PostTrack[]): boolean =>
  tracks.includes(post.track)
