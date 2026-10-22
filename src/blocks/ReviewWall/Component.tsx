import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import type { Testimonial } from '@/payload-types'

import { FEED_LIST, FeedItems, toFeedCard, type FeedCardData, type FeedLabels } from './feed'
import { FeedLoadMore } from './LoadMore'

/**
 * Props = the block row as configured in ./config.ts. Typed locally until the
 * integrator registers the block and runs generate:types; then this becomes
 * `BlockData<'reviewWall'>` (the shapes match field for field).
 */
type SourceKind = Testimonial['source']
export type ReviewWallProps = {
  blockType?: 'reviewWall'
  id?: string | null
  blockName?: string | null
  variant: 'feed'
  eyebrow?: string | null
  eyebrowTick?: boolean | null
  heading?: string | null
  accentPhrase?: string | null
  source: 'all' | 'manual'
  sourceFilter?: SourceKind[] | null
  testimonials?: (number | Testimonial)[] | null
  pageSize?: number | null
  showStudyLinks?: boolean | null
  studyLinkLabel?: string | null
  labels?: {
    video?: string | null
    googleReview?: string | null
    linkedin?: string | null
    play?: string | null
  } | null
  loadMore?: {
    label?: string | null
    loadingLabel?: string | null
    errorLabel?: string | null
  } | null
  emptyNote?: string | null
}

const clampPageSize = (n: number | null | undefined): number => Math.min(24, Math.max(1, Math.round(n ?? 6)))
const SORT = ['sortOrder', '-createdAt']

/** Same serialiser as CaseStudyCards (qs bracket syntax Payload's REST parser reads). */
function toQuery(value: unknown, prefix: string, out: URLSearchParams): URLSearchParams {
  if (Array.isArray(value)) value.forEach((v, i) => toQuery(v, `${prefix}[${i}]`, out))
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) toQuery(v, prefix ? `${prefix}[${k}]` : k, out)
  else if (value !== undefined && value !== null) out.append(prefix, String(value))
  return out
}

function sourceWhere(filter: ReviewWallProps['sourceFilter']): Where {
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
async function resolvePicks(picks: ReviewWallProps['testimonials'], showStudyLinks: boolean): Promise<Testimonial[]> {
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

/**
 * ReviewWall, `feed` variant (Testimonials.dc.html §Testimonial feed,
 * desktop + mobile builds). Server component; the only client code is the
 * Load More island (LoadMore.tsx), mounted only when there is more to show.
 *
 * Empty state (decided): with no published testimonial to show, the section
 * renders nothing (the hero and Final CTA still read whole), unless the
 * editor set `emptyNote`, which renders as one quiet line. Never "coming soon".
 */
export async function ReviewWallBlock(props: ReviewWallProps) {
  const pageSize = clampPageSize(props.pageSize)
  const showStudyLinks = props.showStudyLinks !== false
  let docs: Testimonial[] = []
  let query: string | null = null
  let hasNextPage = false

  if (props.source === 'manual') {
    docs = await resolvePicks(props.testimonials, showStudyLinks)
  } else {
    const where = sourceWhere(props.sourceFilter)
    try {
      const payload = await getPayload({ config })
      const res = await payload.find({
        collection: 'testimonials',
        draft: false,
        overrideAccess: false,
        depth: 2,
        limit: pageSize,
        sort: SORT,
        where,
      })
      docs = res.docs
      hasNextPage = res.hasNextPage
      query = toQuery({ where, sort: SORT.join(',') }, '', new URLSearchParams()).toString()
    } catch (error) {
      console.error('[ReviewWall] could not load published testimonials; rendering the empty state', error)
    }
  }

  const cards = docs.map((d) => toFeedCard(d, showStudyLinks)).filter((c): c is FeedCardData => c !== null)

  const labels: FeedLabels = {
    video: props.labels?.video ?? 'Video',
    googleReview: props.labels?.googleReview ?? 'Google review',
    linkedin: props.labels?.linkedin ?? 'LinkedIn',
    play: props.labels?.play ?? 'Play the video testimonial from',
    studyLink: props.studyLinkLabel ?? 'Read the full case study',
  }

  const header =
    props.eyebrow?.trim() || props.heading?.trim() ? (
      <div className="mb-7 md:mb-10">
        {props.eyebrow?.trim() ? (
          <Eyebrow tick={props.eyebrowTick !== false} className="mb-4.5">
            {props.eyebrow}
          </Eyebrow>
        ) : null}
        {props.heading?.trim() ? <AccentHeadline text={props.heading} accent={props.accentPhrase} level="section" /> : null}
      </div>
    ) : null

  if (cards.length === 0) {
    const note = props.emptyNote?.trim()
    if (!note) {
      console.warn('[ReviewWall] no published testimonials to show; rendering nothing')
      return null
    }
    return (
      <Section tone="light" pad="none" className="pt-2 pb-8 md:pt-6 md:pb-section">
        <Container>
          {header}
          <p className="m-0 max-w-[62ch] border-t border-divider pt-5 text-small-mobile text-gray-warm md:text-small">{note}</p>
        </Container>
      </Section>
    )
  }

  const more = cards.length > pageSize || (Boolean(query) && hasNextPage)

  return (
    <Section tone="light" pad="none" className="pt-2 pb-8 md:pt-6 md:pb-section">
      <Container>
        {header}
        {more ? (
          <FeedLoadMore
            initialCards={cards}
            query={query}
            initialHasNextPage={hasNextPage}
            pageSize={pageSize}
            showStudyLinks={showStudyLinks}
            labels={labels}
            buttonLabel={props.loadMore?.label?.trim() || 'Load more'}
            loadingLabel={props.loadMore?.loadingLabel?.trim() || 'Loading…'}
            errorLabel={props.loadMore?.errorLabel?.trim() || 'Could not load more testimonials. Try again.'}
          />
        ) : (
          <ul className={FEED_LIST}>
            <FeedItems cards={cards} labels={labels} />
          </ul>
        )}
      </Container>
    </Section>
  )
}
