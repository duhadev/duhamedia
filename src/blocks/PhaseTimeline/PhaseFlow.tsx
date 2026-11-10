import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { MICRO, SECTION_PAD, STEP_H3, titledSteps, type PhaseTimelineProps } from './shared'

/**
 * PhaseTimeline `flow` (service pages, Marketing.dc.html #start). Server
 * component. Steps with phase '1' are grey panels joined by decorative arrows
 * (hidden on phones), steps with phase '2' are the outcomes column to the
 * right; `closingLine` is the bold line under both.
 */
export function PhaseFlow({ eyebrow, eyebrowTick, heading, accentPhrase, intro, steps, closingLine, anchorId, variant }: PhaseTimelineProps) {
  const all = titledSteps(steps, variant)
  const panels = all.filter((s) => s.phase !== '2')
  const outcomes = all.filter((s) => s.phase === '2')

  return (
    <Section id={anchorId || undefined} tone="light" pad="none" className={SECTION_PAD}>
      <Container>
        {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(eyebrow && 'mt-4')} />
        {intro ? <p className="mt-5 max-w-[60ch] text-body-mobile whitespace-pre-line md:mt-6 md:text-body">{intro}</p> : null}

        <div className="mt-8 flex flex-col gap-4 md:mt-12 lg:flex-row lg:gap-0">
          {panels.length ? (
            <ol
              style={{ flexGrow: panels.length }}
              className="flex list-none flex-col gap-4 p-0 lg:basis-0 lg:flex-row lg:gap-12"
            >
              {panels.map((step, i) => (
                <li key={step.id ?? i} className="relative bg-gray-light p-6 md:p-7 lg:flex-1">
                  {step.tag?.trim() ? <p className={cx(MICRO, 'mb-2.5')}>{step.tag.trim()}</p> : null}
                  <h3 className={STEP_H3}>{step.title.trim()}</h3>
                  {step.detail?.trim() ? <p className="mt-2.5 text-body-mobile md:text-body">{step.detail.trim()}</p> : null}
                  {i < panels.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-full hidden h-full w-12 items-center justify-center text-[1.75rem] font-bold lg:flex"
                    >
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
          {panels.length && outcomes.length ? (
            <span aria-hidden="true" className="hidden w-12 shrink-0 items-center justify-center text-[1.75rem] font-bold lg:flex">
              →
            </span>
          ) : null}
          {outcomes.length ? (
            <ol className="flex list-none flex-col border-t border-divider p-0 lg:flex-1 lg:basis-0">
              {outcomes.map((step, i) => (
                <li key={step.id ?? i} className="flex-1 border-b border-divider py-5">
                  {step.tag?.trim() ? <p className={cx(MICRO, 'mb-1.5')}>{step.tag.trim()}</p> : null}
                  <p className="font-bold">{step.title.trim()}</p>
                  {step.detail?.trim() ? <p className="mt-1 text-[0.9375rem] leading-[1.5] text-gray-warm">{step.detail.trim()}</p> : null}
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        {closingLine?.trim() ? <p className="mt-8 font-bold">{closingLine.trim()}</p> : null}
      </Container>
    </Section>
  )
}
