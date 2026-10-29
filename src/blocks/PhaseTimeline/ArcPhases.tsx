import React from 'react'

import { CMSLink, Container, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'
import { cx } from '@/lib/cx'

import { Headline, type PhaseTimelineProps } from './shared'

/**
 * PhaseTimeline `arc` (Services Hub.dc.html "The arc", desktop + mobile
 * builds; the undetermined "Arc Section Concepts (Mobile)" sheet is not used,
 * per the dispatch). Server component: no interactivity.
 *
 * One ruled row per phase: mono number + display title, then the description
 * and an optional link. Desktop (md+) puts the label in a 200px column (wider
 * only if one word of a title is longer, e.g. "INDEPENDENCE", never clipped; one subgrid, so every row
 * keeps the same column) beside
 * the text; phones stack everything.
 *
 * The LAST phase (the independence handover) always renders at full weight,
 * its title in --ground-accent as in the design; no field turns that off.
 */
export function ArcPhases({ heading, accentPhrase, phases }: PhaseTimelineProps) {
  const rows = (phases ?? []).filter((p) => p?.title?.trim())
  if ((phases ?? []).length !== rows.length) {
    console.error('[PhaseTimeline:arc] a phase is missing its title and was skipped.')
  }

  return (
    <Section tone="light" pad="none" className="pt-9 pb-10 md:pt-18 md:pb-19">
      <Container>
        <Headline
          text={heading}
          accent={accentPhrase}
          className="mb-4.5 text-[1.875rem] leading-[1.02] md:mb-6 md:text-[2.25rem] md:leading-[1.05]"
        />
        {rows.length ? (
          <ol className="flex flex-col md:grid md:grid-cols-[minmax(200px,min-content)_1fr] md:gap-x-10">
            {rows.map((phase, i) => {
              const isLast = i === rows.length - 1
              const linkText = resolveLinkHref(phase.link) ? phase.link?.label?.trim() : ''
              return (
                <li
                  key={phase.id ?? i}
                  className="flex flex-col gap-2.5 border-t border-divider py-5.5 md:col-span-2 md:grid md:grid-cols-subgrid md:py-7"
                >
                  <div className="flex flex-col gap-2.5 md:gap-2">
                    {phase.number?.trim() ? (
                      <span className="font-mono text-[12px] leading-normal font-bold tracking-[0.1em] text-gray-warm uppercase md:text-[13px]">
                        {phase.number.trim()}
                      </span>
                    ) : null}
                    <h3
                      className={cx(
                        'font-display text-[1.25rem] leading-[1.06] font-normal uppercase md:text-[1.5rem]',
                        isLast && 'text-ground-accent',
                      )}
                    >
                      {phase.title.trim()}
                    </h3>
                  </div>
                  {phase.body?.trim() || linkText ? (
                    <div className="flex flex-col items-start gap-2.5 md:gap-3.5">
                      {phase.body?.trim() ? (
                        <p className="whitespace-pre-line text-[0.9375rem] leading-[1.65] md:max-w-[76ch] md:text-[1.0625rem] md:leading-[1.7]">
                          {phase.body.trim()}
                        </p>
                      ) : null}
                      {linkText ? (
                        // 44px hit area without moving the text: min-height
                        // target, cancelled by a negative block margin.
                        <CMSLink
                          link={phase.link}
                          className="-my-3 inline-flex min-h-target items-center text-[0.875rem] font-bold tracking-[0.06em] text-ink uppercase underline md:text-[0.9375rem]"
                        >
                          {linkText}
                        </CMSLink>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        ) : null}
      </Container>
    </Section>
  )
}
