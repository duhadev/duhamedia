import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { ANCHOR_SCROLL, type TwoTrackProps } from './Compare'

const has = (v: string | null | undefined): v is string => typeof v === 'string' && v.trim() !== ''

/**
 * `bar` (service pages 2026-11-09, Build.dc.html #hours "Where the hours go"). Head like Compare (eyebrow,
 * wine-accent H2, `intro` beside it). Then ONE list of two columns sized by each panel's `share` (flex-weight
 * semantics via fr tracks): a 88px segment on top (the panel with `accentTitle` is the wine segment with
 * cream text, the other gray-light with ink), and the panel's `body` as a muted caption right under it, so
 * caption and segment always share a column. Segment = the first stat's value (Archivo, 40px) + the panel
 * `title` as an uppercase label (rendered once; stats[].label is not used here). On phones the segment stacks
 * value over label and the bar stays horizontal. No stat row, no 2px border. Server component.
 */
export function HoursBar({ eyebrow, eyebrowTick, heading, accentPhrase, intro, anchorId, panels }: TwoTrackProps) {
  const segs = (panels ?? []).filter((p) => p && has(p.title)).slice(0, 2)
  if (segs.length === 0) {
    console.error('[TwoTrackPanels bar] needs at least one track; rendering nothing')
    return null
  }
  const lede = intro?.trim()
  const weights = segs.map((p) => (typeof p.share === 'number' && p.share > 0 ? p.share : 1))

  return (
    <Section id={has(anchorId) ? anchorId : undefined} tone="light" pad="none" className={cx('py-12 md:py-24', has(anchorId) && ANCHOR_SCROLL)}>
      <Container>
        <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-12">
          <div className="flex flex-col gap-4">
            {eyebrow ? <Eyebrow tick={eyebrowTick === true} className="text-ink">{eyebrow}</Eyebrow> : null}
            <AccentHeadline text={heading} accent={accentPhrase} level={2} accentColor="ground" />
          </div>
          {lede ? <p className="m-0 text-body-mobile leading-[1.6] whitespace-pre-line text-ink/80 md:text-body">{lede}</p> : null}
        </div>

        <ul
          className="m-0 mt-8 grid list-none p-0 md:mt-12"
          style={{ gridTemplateColumns: weights.map((w) => `minmax(0, ${w}fr)`).join(' ') }}
        >
          {segs.map((p, i) => {
            const wine = p.accentTitle === true
            const value = (p.stats ?? []).find((s) => has(s?.value))?.value.trim()
            const caption = p.body?.trim()
            return (
              <li key={p.id ?? i} className="min-w-0">
                <div
                  className={cx(
                    'flex min-h-22 flex-col justify-center px-4 py-3 md:flex-row md:items-center md:justify-start md:gap-3.5 md:px-6',
                    wine ? 'bg-ground-accent text-cream' : 'bg-gray-light text-ink',
                  )}
                >
                  {value ? <span className="font-display text-[2rem] leading-none md:text-[2.5rem]">{value}</span> : null}
                  <span className="text-[0.75rem] leading-[1.25] font-bold tracking-[0.06em] uppercase md:text-[0.875rem]">{p.title}</span>
                </div>
                {caption ? (
                  <p
                    className={cx(
                      'm-0 mt-3.5 text-[0.875rem] leading-[1.5] whitespace-pre-line text-gray-warm',
                      i > 0 && 'pl-4 md:pl-6',
                      i === 0 && 'pr-4 md:pr-6',
                    )}
                  >
                    {caption}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
