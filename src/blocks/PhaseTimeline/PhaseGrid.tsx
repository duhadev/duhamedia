import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { titledSteps, type PhaseTimelineProps, type Step } from './shared'

// Static class strings (Tailwind must see them whole). Hairline top borders sit
// on every cell that is not in the first row of its breakpoint's column count.
const COLS_FIRST = 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
const ROWS_FIRST = 'max-lg:[&>li:nth-child(n+3)]:border-t lg:max-xl:[&>li:nth-child(n+4)]:border-t'
const COLS_REST = 'grid-cols-2'
const ROWS_REST = '[&>li:nth-child(n+3)]:border-t'

/**
 * PhaseTimeline `grid` (services redesign A, 2026-11-09). Server component.
 *
 * Grey band, white cells. Steps with `phase: '0'` form a strip above the
 * phases (2px ink border), each with its `tag` as a small grey caps label.
 * Then one bar per phase: the first phase = ink bar, steps in 6 columns at xl /
 * 3 at lg / 2 below; every later phase = 2 columns. The LAST phase (bar +
 * numbers) is wine, per the standing PhaseTimeline rule; no field turns that
 * off. `continuedLabel` is no longer used (the bar is never split).
 */
export function PhaseGrid({ eyebrow, eyebrowTick, heading, accentPhrase, intro, phases, steps, closingLine }: PhaseTimelineProps) {
  const phaseRows = (phases ?? []).filter((p) => p?.title?.trim())
  const rows = titledSteps(steps, 'grid')

  const strip: Step[] = []
  const groups = (phaseRows.length ? phaseRows : [null]).map((phase) => ({ phase, steps: [] as Step[] }))
  for (const step of rows) {
    if (step.phase === '0') {
      strip.push(step)
      continue
    }
    const i = Number(step.phase) - 1
    groups[Number.isInteger(i) && i >= 0 && i < groups.length ? i : groups.length - 1].steps.push(step)
  }
  const filled = groups.filter((g) => g.steps.length)

  return (
    <Section tone="grey" pad="none" className="py-12 md:py-24">
      <Container>
        {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(eyebrow && 'mt-4')} />
        {intro ? <p className="mt-3 max-w-[64ch] text-body-mobile text-gray-warm md:text-body">{intro}</p> : null}

        {strip.length ? (
          <ol className="mt-8 grid list-none grid-cols-1 border-2 border-ink bg-cream p-0 md:mt-10 md:grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {strip.map((step, i) => (
              <li
                key={step.id ?? i}
                className="border-b border-divider px-4.5 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-5 md:last:border-r-0"
              >
                {step.tag?.trim() ? (
                  <p className="text-[0.6875rem] leading-[1.3] font-bold uppercase tracking-[0.14em] text-gray-warm">{step.tag.trim()}</p>
                ) : null}
                <h3 className="mt-1.5 text-[1rem] font-bold">{step.title.trim()}</h3>
                {step.detail?.trim() ? <p className="mt-1 text-[0.9375rem] leading-[1.5]">{step.detail.trim()}</p> : null}
              </li>
            ))}
          </ol>
        ) : null}

        {filled.map((g, gi) => {
          const last = gi === filled.length - 1 && g.phase !== null
          const first = gi === 0
          const name = g.phase ? [g.phase.number?.trim(), g.phase.title.trim()].filter(Boolean).join(' · ') : ''
          return (
            <div key={g.phase?.id ?? gi} className={cx(gi === 0 ? (strip.length ? 'mt-8' : 'mt-8 md:mt-10') : 'mt-4')}>
              {name ? (
                <p
                  className={cx(
                    'px-4.5 py-3 text-[0.75rem] leading-none font-bold uppercase tracking-[0.16em] text-cream',
                    last ? 'bg-ground-accent' : 'bg-ink',
                  )}
                >
                  {name}
                </p>
              ) : null}
              <ol className={cx('grid list-none bg-cream p-0', first ? COLS_FIRST : COLS_REST, first ? ROWS_FIRST : ROWS_REST, '[&>li]:border-divider')}>
                {g.steps.map((step, si) => (
                  <li key={step.id ?? si} className="border-l border-divider p-5">
                    {step.number?.trim() ? (
                      <span className={cx('block font-display text-[1.75rem] leading-none', last && 'text-ground-accent')}>{step.number.trim()}</span>
                    ) : null}
                    <h3 className="mt-3 mb-1 text-[1rem] font-bold">{step.title.trim()}</h3>
                    {step.detail?.trim() ? <p className="text-[0.875rem] leading-[1.45] md:text-[0.9375rem] md:leading-[1.5]">{step.detail.trim()}</p> : null}
                  </li>
                ))}
              </ol>
            </div>
          )
        })}

        {closingLine ? <p className="mt-6 text-small-mobile text-gray-warm md:text-small">{closingLine}</p> : null}
      </Container>
    </Section>
  )
}
