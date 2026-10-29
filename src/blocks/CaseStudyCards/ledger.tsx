import Link from 'next/link'
import React from 'react'

import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import type { CaseStudy } from '@/payload-types'

/**
 * CaseStudyCards `ledger` row (Work.dc.html "Study ledger", desktop + mobile
 * builds). Shared by the server list and the Load More client island
 * (LoadMore.tsx), so this file holds no server-only code and no directive:
 * it is imported as a server component by Component.tsx and as client code
 * by LoadMore.tsx. One row element carries both builds: the phone build
 * (stacked tag / title / inline metric / "Read the study →") below `lg`, the
 * five-column desktop grid from `lg` (1024px; the 52px + 200px + 40px fixed
 * columns leave too little for the client and summary columns below that).
 */

/** Plain, serialisable row (it crosses the server → client boundary). */
export type LedgerRowData = {
  id: number | string
  href: string | null
  number: string | null
  client: string | null
  engagement: string | null
  title: string
  summary: string | null
  value: string | null
  label: string | null
  accent: boolean
}

/** The study fields a row needs (a full doc, or the REST `select` subset LoadMore asks for). */
export type LedgerSource = Pick<CaseStudy, 'id' | 'title'> &
  Partial<Pick<CaseStudy, 'slug' | 'client' | 'studyNumber' | 'engagementLine' | 'headlineMetric' | 'cardSummary'>>

export const toLedgerRow = (study: LedgerSource): LedgerRowData => {
  const client = typeof study.client === 'object' && study.client !== null ? study.client.name?.trim() || null : null
  const n = study.studyNumber
  return {
    id: study.id,
    href: docPath('case-studies', study),
    number: typeof n === 'number' && Number.isFinite(n) ? String(n).padStart(2, '0') : null,
    client,
    engagement: study.engagementLine?.trim() || null,
    title: study.title,
    summary: study.cardSummary?.trim() || null,
    value: study.headlineMetric?.value?.trim() || null,
    label: study.headlineMetric?.label?.trim() || null,
    accent: study.headlineMetric?.accent === true,
  }
}

/** Desktop columns: № · client · summary · result · arrow (design `52px 1.1fr 1.5fr 200px 40px`, gap 24). */
export const LEDGER_COLS = 'lg:grid-cols-[52px_1.1fr_1.5fr_200px_40px] lg:gap-6'

/** Phosphor "arrow-right" (bold), the design's `ph-bold ph-arrow-right` at 20px. */
function ArrowRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-5">
      <path d="M224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.52a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17.01z" />
    </svg>
  )
}

export type LedgerRowLabels = { kind: string; readLabel: string }

/** One `<li>`. The list's last row closes with the design's 2px ink rule. */
export function LedgerRow({
  row,
  labels,
  linkRef,
}: {
  row: LedgerRowData
  labels: LedgerRowLabels
  linkRef?: React.Ref<HTMLAnchorElement>
}) {
  const tag = [row.client, labels.kind].filter(Boolean).join(' · ')
  const cls = cx(
    'flex min-h-target flex-col gap-2 px-container-mobile py-5.5 text-ink no-underline transition-colors duration-180 ease-out hover:bg-gray-light md:px-container',
    'lg:grid lg:items-center lg:px-0 lg:py-6.5',
    LEDGER_COLS,
  )
  const body = (
    <>
      <span className="hidden font-mono text-[12px] font-bold text-gray-warm lg:block">{row.number}</span>
      {tag ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm lg:hidden">{tag}</span>
      ) : null}
      <span className="hidden lg:block">
        {row.client ? <span className="block font-display text-[1.375rem] uppercase">{row.client}</span> : null}
        {row.engagement ? <span className="mt-1 block text-[12px] text-gray-warm">{row.engagement}</span> : null}
      </span>
      <span className="font-display text-[1.25rem] leading-[1.15] uppercase lg:hidden">{row.title}</span>
      <span className="hidden whitespace-pre-line text-[0.9375rem] leading-normal lg:block">{row.summary}</span>
      {row.value ? (
        <span className="flex items-baseline gap-2 text-small-mobile text-gray-warm lg:block">
          <span
            className={cx(
              'font-display text-[1.0625rem] leading-none lg:block lg:text-[2.25rem]',
              row.accent ? 'text-ground-accent' : 'text-ink',
            )}
          >
            {row.value}
          </span>
          {row.label ? (
            <span className="lg:mt-0.5 lg:block lg:text-[11px] lg:font-bold lg:uppercase lg:tracking-[0.08em]">
              {row.label}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="hidden lg:block" />
      )}
      {row.href && labels.readLabel ? (
        <span className="text-small-mobile font-bold lg:hidden">{labels.readLabel}</span>
      ) : null}
      <span className="hidden justify-self-end lg:block">{row.href ? <ArrowRight /> : null}</span>
    </>
  )
  return (
    <li className="border-b border-divider last:border-b-2 last:border-ink">
      {row.href ? (
        <Link href={row.href} ref={linkRef} className={cls}>
          {body}
        </Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  )
}

/** The `<ul>` both the server list and the client island render (identical markup). */
export const LEDGER_LIST = 'm-0 -mx-container-mobile list-none p-0 md:-mx-container lg:mx-0'
