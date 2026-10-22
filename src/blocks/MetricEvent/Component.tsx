import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { CaseStudy } from '@/payload-types'

export type MetricEventData = BlockData<'metricEvent'>

/**
 * Maps `case-studies.resultsTable` to this block's props so the case-study
 * template can render `<MetricEventBlock {...resultsTableToMetricEvent(doc.resultsTable)} />`.
 * The first row's change is accented (the headline result), matching the design.
 */
export function resultsTableToMetricEvent(t: CaseStudy['resultsTable'] | null | undefined): MetricEventData {
  return {
    blockType: 'metricEvent',
    variant: 'table',
    eyebrow: t?.eyebrow,
    columns: t?.columns,
    note: t?.method,
    items: (t?.rows ?? []).map((r, i) => ({
      label: r.measure,
      value: r.after,
      baseline: r.baseline,
      change: r.change,
      accent: i === 0,
      id: r.id,
    })),
  }
}

type Direction = 'up' | 'down' | 'none'

/** Sign semantics from the text itself: + / - (also − and –) lead the string. */
const direction = (change: string): Direction => {
  const c = change.trim()
  if (c.startsWith('+')) return 'up'
  if (/^[-−–]/.test(c)) return 'down'
  return 'none'
}

const TH = 'text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm'

/**
 * MetricEvent, `table` variant (Case Study.dc.html "Results table", desktop +
 * mobile builds). Server component, no interactivity.
 *
 * A real <table>: the desktop build is a 4-column grid; below `md` the rows
 * become stacked cards (label + big figure, a quiet "before → after" line)
 * using CSS only. Explicit ARIA roles keep the table semantics when the
 * elements are re-displayed as grid. The change never relies on colour: it
 * carries its own sign, an arrow glyph (aria-hidden) and a screen-reader word.
 */
export function MetricEventBlock({ eyebrow, eyebrowTick, heading, accentPhrase, columns, items, note }: MetricEventData) {
  const rows = (items ?? []).filter((r) => r?.label?.trim() && r?.value?.trim())
  if (!rows.length) {
    console.warn('[MetricEvent] table variant has no valid rows (label + value required); rendering nothing.')
    return null
  }

  const heads = {
    measure: columns?.measure?.trim() || 'Measure',
    baseline: columns?.baseline?.trim() || 'Before',
    after: columns?.after?.trim() || 'After',
    change: columns?.change?.trim() || 'Change',
  }
  const title = heading?.trim()
  const eyebrowText = eyebrow?.trim()
  const caption = title || eyebrowText || 'Results'
  const methodNote = note?.trim()

  return (
    <Section tone="grey" pad="none" className="border-y-2 border-ink pt-9 pb-8 md:py-14">
      <Container className="md:max-w-205">
        {eyebrowText ? (
          <Eyebrow tick={eyebrowTick === true} muted>
            {eyebrowText}
          </Eyebrow>
        ) : null}
        {title ? (
          <AccentHeadline text={title} accent={accentPhrase} level={3} className="mt-3 md:mt-4" />
        ) : null}
        <table role="table" className="mt-4.5 w-full border-t-2 border-ink md:mt-5">
          <caption className="sr-only">{caption}</caption>
          <thead role="rowgroup" className="max-md:sr-only">
            <tr role="row" className="border-b border-gray-warm/50">
              <th role="columnheader" scope="col" className={cx(TH, 'w-[28%] py-2.5 pr-4 text-left')}>
                {heads.measure}
              </th>
              <th role="columnheader" scope="col" className={cx(TH, 'w-[24%] py-2.5 pr-4 text-left')}>
                {heads.baseline}
              </th>
              <th role="columnheader" scope="col" className={cx(TH, 'w-[24%] py-2.5 pr-4 text-left')}>
                {heads.after}
              </th>
              <th role="columnheader" scope="col" className={cx(TH, 'py-2.5 text-left')}>
                {heads.change}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup" className="max-md:block">
            {rows.map((r, i) => {
              const change = r.change?.trim()
              const baseline = r.baseline?.trim()
              const sub = r.sub?.trim()
              const dir = change ? direction(change) : 'none'
              const last = i === rows.length - 1
              const line = baseline ? (change ? `${baseline} → ${r.value}` : `From ${baseline}`) : change ? r.value : ''
              const mobileLine = [line, sub].filter(Boolean).join(' · ')
              return (
                <tr
                  key={r.id ?? i}
                  role="row"
                  className={cx(
                    'max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:py-3.5',
                    last ? 'border-b-2 border-ink' : 'border-b border-divider',
                  )}
                >
                  <th
                    role="rowheader"
                    scope="row"
                    className="py-3.5 pr-4 text-left align-top text-[0.9375rem] font-normal max-md:block max-md:p-0 max-md:font-bold"
                  >
                    {r.label}
                    {sub ? (
                      <span className="mt-0.5 block text-[0.8125rem] font-normal text-gray-warm max-md:hidden">{sub}</span>
                    ) : null}
                    {mobileLine ? (
                      <span
                        aria-hidden="true"
                        className="mt-1 block text-[0.8125rem] font-normal text-gray-warm md:hidden"
                      >
                        {mobileLine}
                      </span>
                    ) : null}
                  </th>
                  <td
                    role="cell"
                    className="py-3.5 pr-4 align-top text-[0.9375rem] max-md:sr-only max-md:p-0"
                  >
                    {baseline || <span className="text-gray-warm">{'—'}</span>}
                  </td>
                  <td
                    role="cell"
                    className={cx(
                      'py-3.5 pr-4 align-top text-[0.9375rem]',
                      change
                        ? 'max-md:sr-only max-md:p-0'
                        : cx(
                            'max-md:col-start-2 max-md:row-start-1 max-md:justify-self-end max-md:p-0 max-md:text-right max-md:font-display max-md:text-[1.25rem] max-md:leading-none',
                            r.accent && 'max-md:text-ground-accent',
                          ),
                    )}
                  >
                    {r.value}
                  </td>
                  <td
                    role="cell"
                    className={cx(
                      'py-3.5 align-top font-display text-[0.9375rem]',
                      r.accent && 'text-ground-accent',
                      'max-md:col-start-2 max-md:row-start-1 max-md:justify-self-end max-md:p-0 max-md:text-right max-md:text-[1.25rem] max-md:leading-none',
                      !change && 'max-md:sr-only',
                    )}
                  >
                    {change ? (
                      <>
                        {dir !== 'none' ? (
                          <span className="sr-only">{dir === 'up' ? 'Increase: ' : 'Decrease: '}</span>
                        ) : null}
                        {dir !== 'none' ? (
                          <span aria-hidden="true" className="mr-1 inline-block text-[0.6em] align-[0.15em]">
                            {dir === 'up' ? '▲' : '▼'}
                          </span>
                        ) : null}
                        {change}
                      </>
                    ) : (
                      <span className="text-gray-warm">{'—'}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {methodNote ? (
          <p className="mt-3.5 max-w-[80ch] text-[0.8125rem] leading-[1.6] text-gray-warm md:mt-4">{methodNote}</p>
        ) : null}
      </Container>
    </Section>
  )
}
