import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { AccordionSteps } from './AccordionSteps'

type PhaseTimelineProps = BlockData<'phaseTimeline'>

type Step = NonNullable<PhaseTimelineProps['steps']>[number]

// Homepage.dc.html Process: flex/min-width 0.45s, colours 0.3s, mobile height
// 0.4s, all cubic-bezier(.2,.8,.2,1) (MERGED §2.5 "untokenised; keep exact").
// Reduced motion: the global override in styles.css zeroes these.
//
// Breakpoint: the design has a mobile and a desktop build only (no tablet).
// The vertical, scroll-open mobile layout runs below `lg` (1024px) and the
// horizontal accordion from `lg`, as Hero does; below `lg` a 9-column
// horizontal strip cannot fit its closed cards (56px) or phase labels.
//
// Alignment: groups and cards carry `flex-grow: 1` at every width (a no-op in
// the mobile column layout), so while flex animates across the `lg` boundary
// the grow factor never dips below 1 and a phase's cards always fill exactly
// the width of its phase bar.
const CARD_TRANSITION =
  '[transition:height_.4s_cubic-bezier(.2,.8,.2,1),background-color_.3s,border-color_.3s,color_.3s] lg:[transition:flex_.45s_cubic-bezier(.2,.8,.2,1),min-width_.45s_cubic-bezier(.2,.8,.2,1),background-color_.3s,border-color_.3s,color_.3s]'
const GROUP_TRANSITION =
  'lg:[transition:flex_.45s_cubic-bezier(.2,.8,.2,1),min-width_.45s_cubic-bezier(.2,.8,.2,1)]'

/**
 * Desktop flex maths from the design's paintProcess(): card 0.8 / 56px closed,
 * 3.6 / 220px open, 8px gaps. Grow factors are scaled ×1.25 (1 / 4.5, same
 * ratio) so a one-step phase never has a grow sum below 1, which would leave
 * its card narrower than its phase bar.
 *
 * Bar and cards share one box (the group), so they align by construction: the
 * bar is the group's width and the cards flex to fill that same width.
 */
const groupVars = (count: number): React.CSSProperties => {
  const n = Math.max(count, 1)
  return {
    '--pt-flex': String(n),
    '--pt-flex-open': String(n + 3.5),
    // 96px floor so a one-step phase (the terminal one on the homepage) is wide
    // enough for its label's longest word ("INDEPENDENCE") at full weight. Its
    // card fills the floor too, so the bar never outruns the card. Labels wrap
    // (never truncate) and the label row grows to the tallest label, so all
    // three bars stay on one line however many lines a label takes.
    '--pt-min': `max(${n * 56 + (n - 1) * 8}px, 96px)`,
    '--pt-min-open': `max(${n * 56 + (n - 1) * 8 + 164}px, 96px)`,
  } as React.CSSProperties
}

/**
 * PhaseTimeline, `accordion` variant (Homepage.dc.html "Process", desktop +
 * mobile builds). Server component: everything is rendered here as native
 * `<details>`/`<summary>` (keyboard + screen-reader semantics, readable with
 * JS off, first step open). The `AccordionSteps` client island only adds
 * one-open-at-a-time and the mobile scroll-to-open behaviour.
 *
 * The LAST phase always renders at full visual weight (wine label + bar);
 * there is no field to turn that off (CLAUDE.md PhaseTimeline rule).
 */
export function PhaseTimelineBlock({ eyebrow, eyebrowTick, heading, accentPhrase, intro, phases, steps, closingLine }: PhaseTimelineProps) {
  const phaseRows = (phases ?? []).filter((p) => p?.title?.trim())
  const stepRows = (steps ?? []).filter((s) => s?.title?.trim())
  if ((phases ?? []).length !== phaseRows.length) {
    console.error('[PhaseTimeline] a phase is missing its title and was skipped.')
  }
  if ((steps ?? []).length !== stepRows.length) {
    console.error('[PhaseTimeline] a step is missing its title and was skipped.')
  }

  // Group steps under their phase. A step pointing at a phase that does not
  // exist joins the last phase (logged), so no step ever disappears.
  const groups: { phase: (typeof phaseRows)[number] | null; steps: Step[] }[] = phaseRows.length
    ? phaseRows.map((phase) => ({ phase, steps: [] }))
    : [{ phase: null, steps: [] }]
  let orphaned = false
  for (const step of stepRows) {
    const index = Number(step.phase) - 1
    if (Number.isInteger(index) && index >= 0 && index < groups.length) {
      groups[index].steps.push(step)
    } else {
      orphaned = true
      groups[groups.length - 1].steps.push(step)
    }
  }
  if (orphaned && phaseRows.length) {
    console.error('[PhaseTimeline] a step points at a phase that does not exist; it is shown under the last phase.')
  }

  const firstStep = stepRows[0]

  return (
    <Section tone="grey" className="overflow-hidden">
      <Container>
        {eyebrow ? (
          <Eyebrow tick={eyebrowTick === true} muted>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <AccentHeadline
          text={heading}
          accent={accentPhrase}
          level="section"
          className={cx(eyebrow && 'mt-3.5 md:mt-4')}
        />
        {intro ? (
          <p className="mt-3.5 text-[0.9375rem] leading-[1.6] text-gray-warm md:mt-4.5 md:max-w-[64ch]">{intro}</p>
        ) : null}

        {stepRows.length ? (
          <AccordionSteps className="mt-8 flex flex-col gap-7 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-2">
            {groups.map(({ phase, steps: groupSteps }, gi) => {
              const isLast = gi === groups.length - 1 && phase !== null
              const label = phase ? [phase.number?.trim(), phase.title.trim()].filter(Boolean).join(' — ') : ''
              return (
                <div
                  key={phase?.id ?? gi}
                  style={groupVars(groupSteps.length)}
                  className={cx(
                    'flex min-w-0 grow flex-col gap-2 lg:flex-(--pt-flex) lg:min-w-(--pt-min) lg:gap-2.5 lg:has-[[open]]:flex-(--pt-flex-open) lg:has-[[open]]:min-w-(--pt-min-open)',
                    GROUP_TRANSITION,
                  )}
                >
                  {phase ? (
                    <>
                      <h3
                        title={label}
                        className={cx(
                          'text-[10px] font-bold uppercase tracking-[0.1em] [overflow-wrap:anywhere] lg:flex lg:grow lg:items-end lg:leading-tight',
                          isLast ? 'text-ground-accent' : 'text-gray-warm',
                        )}
                      >
                        {label}
                      </h3>
                      <span aria-hidden="true" className={cx('block h-1.5', isLast ? 'bg-ground-accent' : 'bg-ink')} />
                    </>
                  ) : null}
                  {groupSteps.length ? (
                    <div className="mt-1 flex flex-col gap-2 lg:mt-0 lg:h-70 lg:flex-row lg:items-stretch">
                      {groupSteps.map((step, si) => (
                        <details
                          key={step.id ?? `${gi}-${si}`}
                          open={step === firstStep}
                          className={cx(
                            'group/step h-13.5 grow overflow-hidden border-2 border-ink bg-transparent text-ink [interpolate-size:allow-keywords]',
                            'open:h-auto open:border-ground-accent open:bg-cream open:text-ground-accent',
                            'lg:h-full lg:min-w-14 lg:flex-1 lg:open:h-full lg:open:min-w-55 lg:open:flex-[4.5] lg:open:overflow-y-auto',
                            CARD_TRANSITION,
                          )}
                        >
                          <summary
                            className={cx(
                              'flex min-h-target cursor-pointer list-none items-baseline gap-3.5 px-4 py-3.5 focus-visible:-outline-offset-4 [&::-webkit-details-marker]:hidden',
                              'lg:h-full lg:flex-col lg:items-start lg:gap-3 lg:px-3 lg:pt-4.5 lg:pb-4.5 lg:group-open/step:h-auto lg:group-open/step:px-5 lg:group-open/step:pb-0',
                            )}
                          >
                            {step.number?.trim() ? (
                              <span className="font-display text-h3-mobile leading-none lg:text-h3 lg:leading-none">
                                {step.number.trim()}
                              </span>
                            ) : null}
                            <span className="font-display text-[1.0625rem] leading-none uppercase lg:hidden lg:leading-[1.15] lg:group-open/step:block">
                              {step.title.trim()}
                            </span>
                            <span
                              className="hidden font-display text-[1.0625rem] leading-none whitespace-nowrap uppercase lg:mt-3 lg:block lg:[writing-mode:vertical-rl] lg:group-open/step:hidden"
                            >
                              {step.title.trim()}
                            </span>
                          </summary>
                          {step.detail?.trim() ? (
                            <p className="-mt-1 px-4 pb-3.5 text-small text-gray-warm lg:mt-0 lg:px-5 lg:pt-3 lg:pb-4.5">
                              {step.detail.trim()}
                            </p>
                          ) : null}
                        </details>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </AccordionSteps>
        ) : null}

        {closingLine ? (
          <p className="mt-8 text-small-mobile text-gray-warm md:mt-10 md:text-small">{closingLine}</p>
        ) : null}
      </Container>
    </Section>
  )
}
