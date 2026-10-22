'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/Button'

import { LEDGER_LIST, LedgerRow, toLedgerRow, type LedgerRowData, type LedgerRowLabels, type LedgerSource } from './ledger'

/**
 * Load More island for the `ledger` layout (CLAUDE.md p3 "Load More, no
 * pagination"). `'use client'` because appending rows on click needs state
 * and a browser fetch; everything else in the block stays a server component.
 *
 * The first page arrives as props and is server-rendered with the rest of the
 * page, so without JavaScript the visitor gets that page and no button (the
 * button only renders after hydration, so it is never a dead control).
 *
 * Later pages come from Payload's REST API, `GET /api/case-studies`, with
 * `credentials: 'omit'` so the request is always PUBLIC: the collection's read
 * access (`publishedOrStaff`, src/access) then returns published docs only,
 * and `query` (built on the server from the block's source) also carries an
 * explicit `_status = published` filter. Rows already shown are de-duplicated
 * by id (a study published between clicks shifts the pages by one).
 */

const noopSubscribe = () => () => {}

type RestPage = { docs?: LedgerSource[]; hasNextPage?: boolean }

export function LedgerLoadMore({
  initialRows,
  query,
  pageSize,
  labels,
  buttonLabel,
  loadingLabel,
  errorLabel,
}: {
  initialRows: LedgerRowData[]
  /** URL-encoded `where` / `sort` / `select` / `populate` params (no `page`/`limit`). */
  query: string
  pageSize: number
  labels: LedgerRowLabels
  buttonLabel: string
  loadingLabel: string
  errorLabel: string
}) {
  const [rows, setRows] = useState(initialRows)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const focusRef = useRef<HTMLAnchorElement>(null)

  // false during SSR and the hydration pass, true afterwards (no setState-in-effect).
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  useEffect(() => {
    if (focusIndex !== null) focusRef.current?.focus()
  }, [focusIndex])

  async function loadNext() {
    setStatus('loading')
    try {
      const next = page + 1
      const res = await fetch(`/api/case-studies?${query}&limit=${pageSize}&page=${next}&depth=1`, {
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as RestPage
      const seen = new Set(rows.map((r) => r.id))
      const fresh = (data.docs ?? []).map(toLedgerRow).filter((r) => !seen.has(r.id))
      setFocusIndex(fresh.length ? rows.length : null)
      setRows((prev) => [...prev, ...fresh])
      setPage(next)
      setHasMore(Boolean(data.hasNextPage))
      setStatus('idle')
    } catch (error) {
      console.error('[CaseStudyCards] Load more failed', error)
      setStatus('error')
    }
  }

  return (
    <>
      <ul className={LEDGER_LIST} aria-live="polite" aria-busy={status === 'loading'}>
        {rows.map((row, i) => (
          <LedgerRow key={row.id} row={row} labels={labels} linkRef={i === focusIndex ? focusRef : undefined} />
        ))}
      </ul>
      {hydrated && hasMore ? (
        <div className="mt-8 flex flex-col items-center gap-3 lg:mt-10">
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
