import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { InlineBold } from '@/components/InlineBold'
import { cx } from '@/lib/cx'

export type TwoTrackProps = BlockData<'twoTrackPanels'>

/** Scroll offset under the sticky header + jump bar (same as the other service-page sections). */
export const ANCHOR_SCROLL = 'scroll-mt-31 md:scroll-mt-34'

const has = (v: string | null | undefined): v is string => typeof v === 'string' && v.trim() !== ''

const MICRO = 'text-[0.6875rem] leading-[1.3] font-bold tracking-[0.12em] text-gray-warm uppercase'

/** `data-label` text becomes a small caption above each cell on phones (PricingPlans precedent). */
const CELL_LABEL =
  'max-md:before:mb-1.5 max-md:before:block max-md:before:text-[0.6875rem] max-md:before:leading-[1.3] max-md:before:font-bold max-md:before:tracking-[0.12em] max-md:before:text-gray-warm max-md:before:uppercase max-md:before:content-[attr(data-label)]'

/**
 * `compare` (service pages 2026-11-09, Build.dc.html #start "Revision or scratch"). Head: eyebrow + wine-accent
 * H2 left, `intro` right. Then ONE semantic <table> in a 2px ink outer border (the only 2px border this
 * unit introduces): corner label, then one column per track. The FIRST track's column, header included, sits
 * on gray-light and its header carries a 4px ink top bar; the second stays white behind a hairline.
 * Below `md` the same table is restyled as stacked rows (S6, no sideways scroll): the column headers are
 * hidden, each row heading becomes a title and every cell is captioned from `data-label` (the track title).
 * `**bold**` in a cell goes through InlineBold. `conclusion` sits under the table. Server component.
 */
export function Compare({ eyebrow, eyebrowTick, heading, accentPhrase, intro, anchorId, panels, rows, rowsLabel, conclusion }: TwoTrackProps) {
  const cols = (panels ?? []).filter((p) => p && has(p.title)).slice(0, 2)
  const body = (rows ?? []).filter((r) => r && has(r.label))
  if (cols.length !== 2 || body.length === 0) {
    console.error('[TwoTrackPanels compare] needs two tracks and at least one table row; rendering nothing')
    return null
  }
  const [a, b] = cols
  const lede = intro?.trim()
  const note = conclusion?.trim()

  return (
    <Section
      id={has(anchorId) ? anchorId : undefined}
      tone="light"
      pad="none"
      divider="top"
      className={cx('py-12 md:py-24', has(anchorId) && ANCHOR_SCROLL)}
    >
      <Container>
        <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-12">
          <div className="flex flex-col gap-4">
            {eyebrow ? <Eyebrow tick={eyebrowTick === true} className="text-ink">{eyebrow}</Eyebrow> : null}
            <AccentHeadline text={heading} accent={accentPhrase} level={2} accentColor="ground" />
          </div>
          {lede ? <p className="m-0 text-body-mobile leading-[1.6] whitespace-pre-line text-ink/80 md:text-body">{lede}</p> : null}
        </div>

        <div className="mt-8 border-2 border-ink md:mt-12">
          <table role="table" className="w-full border-collapse text-left text-body-mobile leading-[1.5] max-md:block md:text-base">
            <thead role="rowgroup" className="max-md:sr-only">
              <tr role="row">
                <th role="columnheader" scope="col" className="w-[22%] px-6 py-5 align-top font-normal">
                  <span className={MICRO}>{has(rowsLabel) ? rowsLabel : 'Compare'}</span>
                </th>
                <th
                  role="columnheader"
                  scope="col"
                  className="bg-gray-light px-6 py-5 align-top font-normal shadow-[inset_0_4px_0_0_var(--color-ink)]"
                >
                  <span className="block font-display text-[1.375rem] leading-[1.1] uppercase">{a.title}</span>
                  {has(a.label) ? <span className={cx('mt-1.5 block text-ink', MICRO)}>{a.label}</span> : null}
                </th>
                <th role="columnheader" scope="col" className="border-l border-divider px-6 py-5 align-top font-normal">
                  <span className="block font-display text-[1.375rem] leading-[1.1] uppercase">{b.title}</span>
                  {has(b.label) ? <span className={cx('mt-1.5 block', MICRO)}>{b.label}</span> : null}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="max-md:block">
              {body.map((r, i) => (
                <tr
                  role="row"
                  key={r.id ?? i}
                  className="border-t border-divider max-md:block max-md:px-5 max-md:py-5"
                >
                  <th role="rowheader" scope="row" className={cx('px-6 py-4.5 align-top max-md:block max-md:p-0', MICRO)}>
                    {r.label}
                  </th>
                  <td
                    role="cell"
                    data-label={a.title}
                    className={cx('bg-gray-light px-6 py-4.5 align-top max-md:mt-3.5 max-md:block max-md:px-3.5 max-md:py-3', CELL_LABEL)}
                  >
                    <InlineBold text={r.first} />
                  </td>
                  <td
                    role="cell"
                    data-label={b.title}
                    className={cx('border-l border-divider px-6 py-4.5 align-top max-md:mt-2 max-md:block max-md:border-l-0 max-md:px-3.5 max-md:py-3', CELL_LABEL)}
                  >
                    <InlineBold text={r.second} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {note ? <p className="mt-5 max-w-[60ch] text-[0.9375rem] leading-[1.6] whitespace-pre-line text-gray-warm">{note}</p> : null}
      </Container>
    </Section>
  )
}
