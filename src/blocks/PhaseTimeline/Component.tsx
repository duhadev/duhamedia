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
const CARD_TRANSITION =
  '[transition:height_.4s_cubic-bezier(.2,.8,.2,1),background-color_.3s,border-color_.3s,color_.3s] md:[transition:flex_.45s_cubic-bezier(.2,.8,.2,1),min-width_.45s_cubic-bezier(.2,.8,.2,1),background-color_.3s,border-color_.3s,color_.3s]'
const GROUP_TRANSITION =
  'md:[transition:flex_.45s_cubic-bezier(.2,.8,.2,1),min-width_.45s_cubic-bezier(.2,.8,.2,1)]'

/**
 * Desktop flex maths from the design's paintProcess(): card 0.8 / 56px closed,
 * 3.6 / 220px open, 8px gaps. Grow factors are scaled ×1.25 (1 / 4.5, same
 * ratio) so a one-step phase never has a grow sum below 1, which would leave
 * its card narrower than its phase bar.
 */
const groupVars = (count: number): React.CSSProperties => {
  const n = Math.max(count, 1)
  return {
    '--pt-flex': String(n),
    '--pt-flex-open': String(n + 3.5),
    // 96px floor: the longest label word ("INDEPENDENCE") must never be clipped,
    // least of all on the terminal phase.
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
          <AccordionSteps className="mt-8 flex flex-col gap-7 md:mt-12 md:flex-row md:items-stretch md:gap-2">
            {groups.map(({ phase, steps: groupSteps }, gi) => {
              const isLast = gi === groups.length - 1 && phase !== null
              const label = phase ? [phase.number?.trim(), phase.title.trim()].filter(Boolean).join(' — ') : ''
              return (
                <div
                  key={phase?.id ?? gi}
                  style={groupVars(groupSteps.length)}
                  className={cx(
                    'flex min-w-0 flex-col gap-2 md:flex-(--pt-flex) md:min-w-(--pt-min) md:gap-2.5 md:has-[[open]]:flex-(--pt-flex-open) md:has-[[open]]:min-w-(--pt-min-open)',
                    GROUP_TRANSITION,
                  )}
                >
                  {phase ? (
                    <>
                      <h3
                        title={label}
                        className={cx(
                          'text-[10px] font-bold uppercase tracking-[0.1em] md:flex md:min-h-[3.75em] xl:min-h-[2.5em] md:items-end md:leading-tight',
                          isLast ? 'text-ground-accent' : 'text-gray-warm',
                        )}
                      >
                        {label}
                      </h3>
                      <span aria-hidden="true" className={cx('block h-1.5', isLast ? 'bg-ground-accent' : 'bg-ink')} />
                    </>
                  ) : null}
                  {groupSteps.length ? (
                    <div className="mt-1 flex flex-col gap-2 md:mt-0 md:h-70 md:flex-row md:items-stretch">
                      {groupSteps.map((step, si) => (
                        <details
                          key={step.id ?? `${gi}-${si}`}
                          open={step === firstStep}
                          className={cx(
                            'group/step h-13.5 overflow-hidden border-2 border-ink bg-transparent text-ink [interpolate-size:allow-keywords]',
                            'open:h-auto open:border-ground-accent open:bg-cream open:text-ground-accent',
                            'md:h-full md:min-w-14 md:flex-1 md:open:h-full md:open:min-w-55 md:open:flex-[4.5] md:open:overflow-y-auto',
                            CARD_TRANSITION,
                          )}
                        >
                          <summary
                            className={cx(
                              'flex min-h-target cursor-pointer list-none items-baseline gap-3.5 px-4 py-3.5 focus-visible:-outline-offset-4 [&::-webkit-details-marker]:hidden',
                              'md:h-full md:flex-col md:items-start md:gap-3 md:px-3 md:pt-4.5 md:pb-4.5 md:group-open/step:h-auto md:group-open/step:px-5 md:group-open/step:pb-0',
                            )}
                          >
                            {step.number?.trim() ? (
                              <span className="font-display text-h3-mobile leading-none md:text-h3 md:leading-none">
                                {step.number.trim()}
                              </span>
                            ) : null}
                            <span className="font-display text-[1.0625rem] leading-none uppercase md:hidden md:leading-[1.15] md:group-open/step:block">
                              {step.title.trim()}
                            </span>
                            <span
                              className="hidden font-display text-[1.0625rem] leading-none whitespace-nowrap uppercase md:mt-3 md:block md:[writing-mode:vertical-rl] md:group-open/step:hidden"
                            >
                              {step.title.trim()}
                            </span>
                          </summary>
                          {step.detail?.trim() ? (
                            <p className="-mt-1 px-4 pb-3.5 text-small text-gray-warm md:mt-0 md:px-5 md:pt-3 md:pb-4.5">
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
