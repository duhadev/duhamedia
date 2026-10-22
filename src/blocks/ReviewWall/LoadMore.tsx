'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/Button'

import { FEED_LIST, FeedItems, toFeedCard, type FeedCardData, type FeedLabels } from './feed'

/**
 * Load More island for the ReviewWall `feed` (CLAUDE.md p7 / SCHEMA §2.2
 * "one Load-More feed"). `'use client'` because appending cards on click
 * needs state and, for the automatic source, a browser fetch; the cards
 * themselves are the same pure markup the server renders (feed.tsx).
 *
 * Same approach as CaseStudyCards/LoadMore.tsx:
 * - The first page is server-rendered; the button only renders after
 *   hydration, so without JavaScript there is never a dead control.
 * - `cards` may already hold more than one page (hand-picked testimonials are
 *   all resolved on the server, in pick order): those are revealed first.
 * - Then, for the automatic source, later pages come from Payload's REST API
 *   `GET /api/testimonials` with `credentials: 'omit'`, so the request is
 *   always PUBLIC: the collection's read access (`publishedOrStaff`,
 *   src/access) returns published docs only, and `query` also carries an
 *   explicit `_status = published` filter. A draft case study is not
 *   populated for the public, so its deep link never renders (R3). Cards
 *   already shown are de-duplicated by id.
 * - The list is `aria-live="polite"`; focus moves to the first new card.
 */

const noopSubscribe = () => () => {}

type RestPage = { docs?: unknown[]; hasNextPage?: boolean }

export function FeedLoadMore({
  initialCards,
  query,
  initialHasNextPage,
  pageSize,
  showStudyLinks,
  labels,
  buttonLabel,
  loadingLabel,
  errorLabel,
}: {
  initialCards: FeedCardData[]
  /** URL-encoded `where` / `sort` params for the automatic source (no `page`/`limit`), or null. */
  query: string | null
  initialHasNextPage: boolean
  pageSize: number
  showStudyLinks: boolean
  labels: FeedLabels
  buttonLabel: string
  loadingLabel: string
  errorLabel: string
}) {
  const [cards, setCards] = useState(initialCards)
  const [visible, setVisible] = useState(Math.min(pageSize, initialCards.length))
  const [page, setPage] = useState(1)
  const [remoteMore, setRemoteMore] = useState(Boolean(query) && initialHasNextPage)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const focusRef = useRef<HTMLLIElement>(null)

  // false during SSR and the hydration pass, true afterwards.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  useEffect(() => {
    if (focusIndex !== null) focusRef.current?.focus()
  }, [focusIndex])

  async function loadNext() {
    if (visible < cards.length) {
      setFocusIndex(visible)
      setVisible(Math.min(cards.length, visible + pageSize))
      return
    }
    if (!query) return
    setStatus('loading')
    try {
      const next = page + 1
      const res = await fetch(`/api/testimonials?${query}&limit=${pageSize}&page=${next}&depth=2`, {
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as RestPage
      const seen = new Set(cards.map((c) => c.id))
      const fresh = (data.docs ?? [])
        .map((d) => toFeedCard(d, showStudyLinks))
        .filter((c): c is FeedCardData => c !== null && !seen.has(c.id))
      setFocusIndex(fresh.length ? cards.length : null)
      setCards((prev) => [...prev, ...fresh])
      setVisible(cards.length + fresh.length)
      setPage(next)
      setRemoteMore(Boolean(data.hasNextPage))
      setStatus('idle')
    } catch (error) {
      console.error('[ReviewWall] Load more failed', error)
      setStatus('error')
    }
  }

  const hasMore = visible < cards.length || remoteMore

  return (
    <>
      <ul className={FEED_LIST} aria-live="polite" aria-busy={status === 'loading'}>
        <FeedItems cards={cards.slice(0, visible)} labels={labels} focusIndex={focusIndex} focusRef={focusRef} />
      </ul>
      {hydrated && hasMore ? (
        <div className="flex flex-col items-center gap-3 pt-5.5 md:pt-10">
          <Button variant="ghost" size="md" onClick={loadNext} disabled={status === 'loading'} aria-disabled={status === 'loading'}>
            {status === 'loading' ? loadingLabel : buttonLabel}
          </Button>
          {status === 'error' ? (
            <p role="alert" className="text-small-mobile text-gray-warm md:text-small">
              {errorLabel}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
