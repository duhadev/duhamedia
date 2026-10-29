import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { AccordionSteps, type TrackGroup } from './AccordionSteps'
import { ArcPhases } from './ArcPhases'
import { StepCards } from './StepCards'
import { StepRun } from './StepRun'

type PhaseTimelineProps = BlockData<'phaseTimeline'>

type Step = NonNullable<PhaseTimelineProps['steps']>[number]

/**
 * PhaseTimeline, `accordion` variant (Homepage.dc.html "Process", desktop +
 * mobile builds). Server component: filters and groups the CMS data, renders
 * the header, and hands plain props to the `AccordionSteps` client island,
 * which owns the open step, the motion and the entrance (see that file and
 * accordion.css). Server HTML = final visible state, step 01 open.
 *
 * The LAST phase always renders at full visual weight (wine label + bar);
 * there is no field to turn that off (CLAUDE.md PhaseTimeline rule).
 */
export function PhaseTimelineBlock(props: PhaseTimelineProps) {
  switch (props.variant) {
    case 'arc':
      return <ArcPhases {...props} />
    case 'steps':
      return <StepCards {...props} />
    case 'build-run':
    case 'engine-rollout':
      return <StepRun {...props} />
    default:
      return <Accordion {...props} />
  }
}

/** The `accordion` variant (B3; motion rework 2026-10-29). */
function Accordion({ eyebrow, eyebrowTick, heading, accentPhrase, intro, phases, steps, closingLine }: PhaseTimelineProps) {
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

  const header = (
    <>
      {eyebrow ? (
        <Eyebrow tick={eyebrowTick === true} muted>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <AccentHeadline text={heading} accent={accentPhrase} level="section" className={cx(eyebrow && 'mt-3.5 md:mt-4')} />
      {intro ? (
        <p className="mt-3.5 text-[0.9375rem] leading-[1.6] whitespace-pre-line text-gray-warm md:mt-4.5 md:max-w-[64ch]">{intro}</p>
      ) : null}
    </>
  )

  // A phase with no steps has no columns to span on the desktop grid; it is
  // skipped (logged), and the last phase that has steps takes the full weight.
  const filled = groups.filter((g) => g.steps.length)
  if (filled.length !== groups.length && stepRows.length) {
    console.error('[PhaseTimeline] a phase has no steps and was skipped.')
  }
  const trackGroups: TrackGroup[] = filled.map(({ phase, steps: groupSteps }, gi) => ({
      key: phase?.id ?? String(gi),
      label: phase ? [phase.number?.trim(), phase.title.trim()].filter(Boolean).join(' — ') : '',
      isLast: phase !== null && gi === filled.length - 1,
      steps: groupSteps.map((step, si) => ({
        key: step.id ?? `${gi}-${si}`,
        number: step.number?.trim() ?? '',
        title: step.title.trim(),
        detail: step.detail?.trim() ?? '',
      })),
    }))

  return (
    <Section tone="grey" className="overflow-clip">
      <Container>
        {stepRows.length ? <AccordionSteps header={header} groups={trackGroups} /> : header}

        {closingLine ? (
          <p className="mt-8 text-small-mobile text-gray-warm md:mt-10 md:text-small">{closingLine}</p>
        ) : null}
      </Container>
    </Section>
  )
}
