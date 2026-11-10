import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { MICRO, SECTION_PAD, STEP_H3, titledSteps, type PhaseTimelineProps } from './shared'

/**
 * PhaseTimeline `cells` and `ruled` (service pages, Marketing.dc.html #month and
 * "Your first two quarters"). Server component.
 * - cells: grey band, intro beside the head, a hairline grid of cream cells;
 *   each cell = micro label (`number · tag`, wine when `accent`), h3, detail.
 * - ruled: white band, intro under the head, one ruled row; each step = micro
 *   tag, bold title, muted detail, left hairline dividers from lg.
 */
export function PhaseCells(props: PhaseTimelineProps) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, intro, steps, closingLine, anchorId, variant } = props
  const cells = variant === 'cells'
  const rows = titledSteps(steps, variant)

  const head = (
    <div>
      {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
      <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(eyebrow && 'mt-4')} />
    </div>
  )
  const introEl = intro ? (
    <p className={cx('whitespace-pre-line', cells ? 'text-body-mobile text-gray-warm md:text-body' : 'mt-5 max-w-[62ch] text-body-mobile md:mt-6 md:text-body')}>
      {intro}
    </p>
  ) : null

  return (
    <Section id={anchorId || undefined} tone={cells ? 'grey' : 'light'} pad="none" className={SECTION_PAD}>
      <Container>
        {cells ? (
          <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-12">
            {head}
            {introEl}
          </div>
        ) : (
          <>
            {head}
            {introEl}
          </>
        )}

        {rows.length && cells ? (
          <div className="mt-8 overflow-hidden md:mt-12">
            <ol className="-mt-px -ml-px grid list-none p-0 sm:grid-cols-2 lg:grid-cols-4">
              {rows.map((step, i) => {
                const label = [step.number?.trim(), step.tag?.trim()].filter(Boolean).join(' · ')
                return (
                  <li key={step.id ?? i} className="flex flex-col gap-2.5 border-t border-l border-divider bg-cream p-6 md:p-7">
                    {label ? <span className={cx(MICRO, step.accent === true && 'text-ground-accent')}>{label}</span> : null}
                    <h3 className={STEP_H3}>{step.title.trim()}</h3>
                    {step.detail?.trim() ? <p className="text-body-mobile md:text-body">{step.detail.trim()}</p> : null}
                  </li>
                )
              })}
            </ol>
          </div>
        ) : null}

        {rows.length && !cells ? (
          <ol className="mt-8 grid list-none border-y border-divider p-0 md:mt-12 lg:grid-cols-4">
            {rows.map((step, i) => (
              <li
                key={step.id ?? i}
                className={cx(
                  'border-divider py-5 lg:px-6 lg:py-6',
                  i > 0 && 'border-t lg:border-t-0 lg:border-l',
                  i === 0 && 'lg:pl-0',
                )}
              >
                {step.tag?.trim() ? <p className={cx(MICRO, 'mb-2')}>{step.tag.trim()}</p> : null}
                <h3 className="text-body-mobile font-bold md:text-body">{step.title.trim()}</h3>
                {step.detail?.trim() ? <p className="mt-1.5 text-[0.9375rem] leading-[1.5] text-gray-warm">{step.detail.trim()}</p> : null}
              </li>
            ))}
          </ol>
        ) : null}

        {closingLine?.trim() ? <p className="mt-5 text-[0.9375rem] leading-[1.5] text-gray-warm">{closingLine.trim()}</p> : null}
      </Container>
    </Section>
  )
}
