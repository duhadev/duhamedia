import React from 'react'

import { ButtonLink, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'

import { Headline, titledSteps, type PhaseTimelineProps } from './shared'

/** Phosphor "arrow-right" (bold), the design's `ph-bold ph-arrow-right`. */
function ArrowRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-5">
      <path d="M224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.52a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17.01z" />
    </svg>
  )
}

/**
 * PhaseTimeline `steps` (Services Hub.dc.html "How it starts", desktop +
 * mobile builds; also p9 "What happens next" later). Server component: no
 * interactivity.
 *
 * Numbered cards: "Step 01" + boxed tag, title, sentence, then a grey
 * "You leave with" foot listing the outcomes. Phones and tablets stack the
 * cards; from `lg` (1024px) they sit in one row with arrows between (below
 * `lg` three cards cannot fit their nowrap header). Then the closing line and
 * the button: desktop shows the line first, phones the full-width button
 * first, as in the two builds.
 *
 * Not ported: the design's `stepflow` keyframes (each tag flashes wine in turn,
 * 7.5 s, forever). An endless auto-started animation with no pause control
 * fails WCAG 2.2.2, the reason the accordion's auto-advance was not ported
 * either. Flagged to the PM.
 *
 * Every card renders at the same full weight, the last included (the
 * independence handover is never reduced); no field changes that.
 */
export function StepCards({ heading, accentPhrase, steps, closingLine, cta, outcomesLabel }: PhaseTimelineProps) {
  const rows = titledSteps(steps, 'steps')
  const hasCta = Boolean(resolveLinkHref(cta) && cta?.label?.trim())

  return (
    <Section tone="light" pad="none" className="pt-9 pb-11 md:py-18">
      {/* The design's container is 1400px wide here (not --container-max). */}
      <div className="mx-auto w-full max-w-[1400px] px-container-mobile md:px-container">
        <Headline
          text={heading}
          accent={accentPhrase}
          className="text-[1.875rem] leading-[1.02] md:text-[2.25rem] md:leading-[1.05]"
        />

        {rows.length ? (
          <ol className="mt-6 flex flex-col gap-4 md:mt-10 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-11">
            {rows.map((step, i) => {
              const outcomes = (step.outcomes ?? []).filter((o) => o?.text?.trim())
              const number = step.number?.trim()
              const tag = step.tag?.trim()
              return (
                <li key={step.id ?? i} className="relative flex flex-col border-2 border-ink bg-cream">
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 -left-11.5 hidden w-11 items-center justify-center text-gray-warm lg:flex"
                    >
                      <ArrowRight />
                    </span>
                  ) : null}
                  {number || tag ? (
                    <div className="flex items-center justify-between gap-3 border-b border-divider px-4.5 py-3.5 md:items-baseline md:px-6 md:py-4">
                      {number ? (
                        <span className="flex-none font-mono text-[15px] leading-normal font-bold tracking-[0.08em] whitespace-nowrap text-gray-warm md:text-[17px]">
                          {number}
                        </span>
                      ) : (
                        <span />
                      )}
                      {tag ? (
                        <span className="inline-flex flex-none items-center border-2 border-ink px-2.5 py-1.5 text-[13px] leading-none font-bold whitespace-nowrap text-ink md:px-3 md:py-1.75 md:text-[14px]">
                          {tag}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="flex-1 p-4.5 md:p-6">
                    <h3 className="font-display text-[1.25rem] leading-[1.08] font-normal uppercase md:text-[1.375rem]">
                      {step.title.trim()}
                    </h3>
                    {step.detail?.trim() ? (
                      <p className="mt-2 text-[0.9375rem] leading-[1.6] md:mt-3 md:text-body-mobile">{step.detail.trim()}</p>
                    ) : null}
                  </div>
                  {outcomes.length ? (
                    <div className="flex flex-col gap-1 border-t border-divider bg-gray-light px-4.5 pt-3 pb-4 md:px-6 md:pt-3.5 md:pb-4.5">
                      <span className="text-[10px] font-bold tracking-[0.1em] text-gray-warm uppercase">{outcomesLabel?.trim() || 'You leave with'}</span>
                      <ul className="flex flex-col gap-1">
                        {outcomes.map((o, oi) => (
                          <li key={o.id ?? oi} className="flex gap-2 text-[0.9375rem] leading-[1.45]">
                            <span aria-hidden="true" className="flex-none">
                              •
                            </span>
                            {o.text.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        ) : null}

        {closingLine?.trim() || hasCta ? (
          <div className="flex flex-col">
            {closingLine?.trim() ? (
              <p className="order-2 mt-3.5 text-small text-gray-warm md:order-1 md:mt-5 md:text-[0.9375rem]">
                {closingLine.trim()}
              </p>
            ) : null}
            {hasCta ? (
              <div className="order-1 mt-6 grid md:order-2 md:mt-7 md:block">
                <ButtonLink link={cta} variant="primary" size="md" className="max-md:min-h-13 max-md:w-full" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
