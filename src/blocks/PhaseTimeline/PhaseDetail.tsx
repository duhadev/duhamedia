import React from 'react'

import { AccentHeadline, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { MICRO, SECTION_PAD, STEP_H3, titledSteps, type PhaseTimelineProps } from './shared'

/**
 * PhaseTimeline `detail` (service pages, Build.dc.html #steps). Server component.
 * Grey band: steps with `phase: '0'` form a hairline strip, `closingLine` is
 * the schedule line under it, every other step is a row: numeral (grey, wine
 * when `accent`), title + text (+ bold sign-off line when `isSignOff`) and a
 * `<dl>` of You / You get. Hairline cells, no ink borders.
 */
export function PhaseDetail({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  intro,
  steps,
  closingLine,
  youLabel,
  youGetLabel,
  anchorId,
}: PhaseTimelineProps) {
  const all = titledSteps(steps, 'detail')
  const strip = all.filter((s) => s.phase === '0')
  const rows = all.filter((s) => s.phase !== '0')
  const you = youLabel?.trim() || 'You'
  const youGet = youGetLabel?.trim() || 'You get'
  const line = closingLine?.trim() ? (
    <p className="mt-3.5 text-[0.9375rem] leading-[1.5] text-gray-warm">{closingLine.trim()}</p>
  ) : null

  return (
    <Section id={anchorId || undefined} tone="grey" pad="none" className={SECTION_PAD}>
      <Container>
        {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(eyebrow && 'mt-4')} />
        {intro ? <p className="mt-5 max-w-[60ch] text-body-mobile whitespace-pre-line md:mt-6 md:text-body">{intro}</p> : null}

        {strip.length ? (
          <ol className="mt-8 grid list-none gap-px bg-divider p-0 md:mt-10 md:auto-cols-fr md:grid-flow-col">
            {strip.map((step, i) => (
              <li key={step.id ?? i} className="bg-cream px-6 py-5">
                {step.tag?.trim() ? <p className={MICRO}>{step.tag.trim()}</p> : null}
                <p className="mt-1.5 font-bold">{step.title.trim()}</p>
              </li>
            ))}
          </ol>
        ) : null}
        {strip.length ? line : null}

        {rows.length ? (
          <ol className="mt-10 list-none p-0 md:mt-12">
            {rows.map((step, i) => {
              const signOff = step.isSignOff === true && step.tag?.trim()
              const yourPart = step.you?.trim()
              const gotPart = step.youGet?.trim()
              return (
                <li
                  key={step.id ?? i}
                  className="grid gap-x-8 gap-y-4 border-b border-divider py-8 md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)] md:py-9"
                >
                  <span
                    className={cx(
                      'font-display text-[2.5rem] leading-none md:text-[3.5rem]',
                      step.accent === true ? 'text-ground-accent' : 'text-gray-warm',
                    )}
                  >
                    {step.number?.trim()}
                  </span>
                  <div>
                    <h3 className={STEP_H3}>{step.title.trim()}</h3>
                    {step.detail?.trim() ? <p className="mt-2.5 text-body-mobile md:text-body">{step.detail.trim()}</p> : null}
                    {signOff ? <p className="mt-3.5 font-bold">{step.tag?.trim()}</p> : null}
                  </div>
                  {yourPart || gotPart ? (
                    <dl className="m-0 grid content-start gap-3">
                      {yourPart ? (
                        <div>
                          <dt className={MICRO}>{you}</dt>
                          <dd className="m-0 mt-0.5">{yourPart}</dd>
                        </div>
                      ) : null}
                      {gotPart ? (
                        <div>
                          <dt className={MICRO}>{youGet}</dt>
                          <dd className="m-0 mt-0.5">{gotPart}</dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : null}
                </li>
              )
            })}
          </ol>
        ) : null}
        {!strip.length ? line : null}
      </Container>
    </Section>
  )
}
