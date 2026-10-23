import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import type { Testimonial } from '@/payload-types'

import { SORT, resolvePicks, sourceWhere, toQuery } from './data'
import { FEED_LIST, FeedItems, toFeedCard, type FeedCardData, type FeedLabels } from './feed'
import { FeedLoadMore } from './LoadMore'
import { ReviewWallMasonry } from './wall'

/** Props = the generated `reviewWall` row type (src/payload-types.ts `ReviewWallBlock`). */
export type ReviewWallProps = BlockData<'reviewWall'>

const clampPageSize = (n: number | null | undefined): number => Math.min(24, Math.max(1, Math.round(n ?? 6)))
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
  if (props.variant === 'wall') return <ReviewWallMasonry {...props} />

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
