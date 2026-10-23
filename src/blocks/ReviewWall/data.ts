import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Testimonial } from '@/payload-types'

import type { ReviewWallProps } from './Component'

export const SORT = ['sortOrder', '-createdAt']

/** Same serialiser as CaseStudyCards (qs bracket syntax Payload's REST parser reads). */
export function toQuery(value: unknown, prefix: string, out: URLSearchParams): URLSearchParams {
  if (Array.isArray(value)) value.forEach((v, i) => toQuery(v, `${prefix}[${i}]`, out))
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) toQuery(v, prefix ? `${prefix}[${k}]` : k, out)
  else if (value !== undefined && value !== null) out.append(prefix, String(value))
  return out
}

export function sourceWhere(filter: ReviewWallProps['sourceFilter']): Where {
  const kinds = (filter ?? []).filter(Boolean)
  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (kinds.length) and.push({ source: { in: kinds } })
  return { and }
}

/** True when a populated pick still carries an unpopulated nested relation the card needs. */
function needsHydration(t: Testimonial, showStudyLinks: boolean): boolean {
  if (showStudyLinks && typeof t.caseStudy === 'number') return true
  if (t.format === 'video' && t.client && typeof t.client === 'object' && typeof t.client.logo === 'number') return true
  return false
}

/**
 * Manual picks, in pick order, published only. Picks arriving as bare ids
 * (drafts are not populated for the public) are dropped. A page is read at
 * depth 2, which leaves each pick's `caseStudy` (maxDepth 1) and its client's
 * logo unpopulated; those picks are re-read here in ONE public query
 * (`overrideAccess: false`, `draft: false`) so the deep link and logo can
 * render. Fully populated picks (showcase fixtures, live preview) need no query.
 */
export async function resolvePicks(picks: ReviewWallProps['testimonials'], showStudyLinks: boolean): Promise<Testimonial[]> {
  const docs = (picks ?? []).filter((t): t is Testimonial => Boolean(t) && typeof t === 'object')
  const stale = docs.filter((t) => needsHydration(t, showStudyLinks)).map((t) => t.id)
  if (stale.length === 0) return docs
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'testimonials',
      draft: false,
      overrideAccess: false,
      depth: 2,
      limit: stale.length,
      pagination: false,
      where: { and: [{ id: { in: stale } }, { _status: { equals: 'published' } }] },
    })
    const fresh = new Map(res.docs.map((d) => [d.id, d]))
    return docs.map((t) => fresh.get(t.id) ?? t)
  } catch (error) {
    console.error('[ReviewWall] could not re-read picked testimonials; rendering them without study links/logos', error)
    return docs
  }
}

/* ------------------------------ wall variant ----------------------------- */

/** The wall has no Load More: every published card up to this cap renders. */
export const WALL_LIMIT = 36

/** Published testimonials for the wall (all, or the hand-picked ones). Never throws. */
export async function loadWallTestimonials(props: ReviewWallProps): Promise<Testimonial[]> {
  if (props.source === 'manual') return resolvePicks(props.testimonials, false)
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'testimonials',
      draft: false,
      overrideAccess: false,
      depth: 2,
      limit: WALL_LIMIT,
      pagination: false,
      sort: SORT,
      where: sourceWhere(props.sourceFilter),
    })
    return res.docs
  } catch (error) {
    console.error('[ReviewWall] could not load published testimonials for the wall; rendering the empty state', error)
    return []
  }
}
