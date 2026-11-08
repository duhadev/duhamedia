import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { titledSteps, type PhaseTimelineProps, type Step } from './shared'

const COLS = 4

type Bar = { kind: 'bar'; key: string; label: string; last: boolean; continued: boolean; row: number; col: number; span: number }
type Cell = { kind: 'cell'; key: string; step: Step; last: boolean; row: number; col: number }

/**
 * PhaseTimeline `grid` (brochure 2026-11-07 p4 "The process"): numbered cells
 * under phase bars. Server component, no interactivity.
 *
 * One CSS grid, DOM in reading order (bar, its steps, next bar, …):
 * - below `sm` one column, from `sm` (640px) two: every phase bar spans the full
 *   row above its steps; "continued" bars are hidden.
 * - from `lg` four columns: steps flow in rows of four; each row gets its own
 *   bar segments above it (a phase that wraps shows its "continued" bar), so
 *   items are placed explicitly with `--r` / `--c` / `--s` custom properties.
 * The LAST phase (bar + numbers) is wine, as in the brochure and the
 * standing PhaseTimeline rule; no field turns that off.
 */
export function PhaseGrid({ eyebrow, eyebrowTick, heading, accentPhrase, intro, phases, steps, closingLine }: PhaseTimelineProps) {
  const phaseRows = (phases ?? []).filter((p) => p?.title?.trim())
  const rows = titledSteps(steps, 'grid')

  const groups = (phaseRows.length ? phaseRows : [null]).map((phase) => ({ phase, steps: [] as Step[] }))
  for (const step of rows) {
    const i = Number(step.phase) - 1
    groups[Number.isInteger(i) && i >= 0 && i < groups.length ? i : groups.length - 1].steps.push(step)
  }
  const filled = groups.filter((g) => g.steps.length)

  const items: (Bar | Cell)[] = []
  let slot = 0
  filled.forEach((g, gi) => {
    const last = gi === filled.length - 1 && g.phase !== null
    const name = g.phase ? [g.phase.number?.trim(), g.phase.title.trim()].filter(Boolean).join(' · ') : ''
    g.steps.forEach((step, si) => {
      const row = Math.floor(slot / COLS)
      const col = slot % COLS
      if (name && (si === 0 || col === 0)) {
        const span = Math.min(COLS - col, g.steps.length - si)
        const continued = si > 0
        items.push({
          kind: 'bar',
          key: `bar-${gi}-${si}`,
          label: continued ? g.phase?.continuedLabel?.trim() || name : name,
          last,
          continued,
          row,
          col,
          span,
        })
      }
      items.push({ kind: 'cell', key: step.id ?? `${gi}-${si}`, step, last, row, col })
      slot++
    })
  })

  return (
    <Section tone="light" pad="none" className="py-12 md:py-16">
      <Container>
        {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(eyebrow && 'mt-4')} />
        {intro ? <p className="mt-3 max-w-[64ch] text-body-mobile text-gray-warm md:text-body">{intro}</p> : null}

        {items.length ? (
          <ol className="mt-8 grid list-none grid-cols-1 gap-x-0 p-0 md:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) =>
              it.kind === 'bar' ? (
                <li
                  key={it.key}
                  aria-hidden={it.continued ? true : undefined}
                  style={{ '--r': it.row * 2 + 1, '--c': it.col + 1, '--s': it.span } as React.CSSProperties}
                  className={cx(
                    'px-3.5 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-cream max-lg:col-span-full md:text-[0.75rem]',
                    'lg:[grid-column:var(--c)/span_var(--s)] lg:[grid-row:var(--r)]',
                    it.row === 0 && it.col === 0 ? 'mt-0' : 'mt-6',
                    it.row === 0 && 'lg:mt-0',
                    it.last ? 'bg-ground-accent' : 'bg-ink',
                    it.continued && 'hidden lg:block',
                  )}
                >
                  {it.label}
                </li>
              ) : (
                <li
                  key={it.key}
                  style={{ '--r': it.row * 2 + 2, '--c': it.col + 1 } as React.CSSProperties}
                  className="border-l border-divider px-3.5 pt-5 pb-6 lg:[grid-column:var(--c)] lg:[grid-row:var(--r)]"
                >
                  {it.step.number?.trim() ? (
                    <span className={cx('block font-display text-[1.75rem] leading-none md:text-[2rem]', it.last && 'text-ground-accent')}>
                      {it.step.number.trim()}
                    </span>
                  ) : null}
                  <h3 className="mt-3 text-[1rem] font-bold">{it.step.title.trim()}</h3>
                  {it.step.detail?.trim() ? (
                    <p className="mt-1.5 text-[0.9375rem] leading-[1.55] text-ink/85">{it.step.detail.trim()}</p>
                  ) : null}
                </li>
              ),
            )}
          </ol>
        ) : null}

        {closingLine ? <p className="mt-6 text-small-mobile text-gray-warm md:text-small">{closingLine}</p> : null}
      </Container>
    </Section>
  )
}
