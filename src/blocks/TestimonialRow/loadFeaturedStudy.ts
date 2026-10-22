import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

import type { CaseStudy } from '@/payload-types'

/**
 * The newest PUBLISHED case study ticked "Featured", or `null`. Public Local
 * API read (`overrideAccess: false`, no `draft`), so a draft can never come
 * back. A failed read is logged and treated as "none" (the card then falls
 * back to the quiet figure); it must never take the page down.
 */
export async function loadFeaturedStudy(): Promise<CaseStudy | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      where: { featured: { equals: true }, _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
    return docs[0] ?? null
  } catch (error) {
    console.error('[TestimonialRow] could not load the featured case study; using the fallback figure', error)
    return null
  }
}
