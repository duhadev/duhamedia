import React from 'react'

import type { BlockData } from '@/blocks/types'
import { Caption, SquareBullet } from '@/components/BrochureParts'
import { InlineBold } from '@/components/InlineBold'
import { AccentHeadline, CMSLink, Container, Eyebrow, Section, resolveLinkHref } from '@/components/ui'
import { cx } from '@/lib/cx'

type Props = BlockData<'pricingPlans'>

const has = (s: string | null | undefined): s is string => Boolean(s && s.trim())

function Statement({ text, accent }: { text: string; accent?: string | null }) {
  const at = has(accent) ? text.indexOf(accent.trim()) : -1
  if (at < 0) return <>{text}</>
  const a = accent!.trim()
  return (
    <>
      {text.slice(0, at)}
      <span className="text-ground-accent">{a}</span>
      {text.slice(at + a.length)}
    </>
  )
}

/**
 * PricingPlans (brochure p5). Server component, no interactivity.
 * Phones: build card, then the plans, stacked. From `lg`: build card left
 * (5/12), plans right (7/12), as the brochure. Terms row: 3 columns from `md`.
 */
export function PricingPlansBlock({ anchorId, eyebrow, eyebrowTick, heading, accentPhrase, intro, build, marketing, statement, statementAccent, terms }: Props) {
  const bullets = (build?.bullets ?? []).filter((b) => has(b?.text))
  const plans = (marketing?.plans ?? []).filter((p) => has(p?.name))
  const termRows = (terms ?? []).filter((t) => has(t?.label) && has(t?.body))
  const firstLabel = marketing?.firstLabel?.trim() || 'First quarter'
  const afterLabel = marketing?.afterLabel?.trim() || 'After that'
  const nextOk = resolveLinkHref(build?.nextLink) && has(build?.nextLink?.label)

  return (
    <Section id={anchorId || undefined} tone="light" pad="none" className="scroll-mt-31 py-12 md:scroll-mt-34 md:py-16">
      <Container>
        {has(eyebrow) || has(heading) ? (
          <div className="border-b-2 border-ink pb-6 md:pb-8">
            {has(eyebrow) ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
            {has(heading) ? <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(has(eyebrow) && 'mt-4')} /> : null}
            {has(intro) ? <p className="mt-3 max-w-[64ch] text-body-mobile text-gray-warm md:text-body">{intro}</p> : null}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-10">
          {has(build?.price) ? (
            <div className="flex flex-col border-2 border-ink p-6 md:p-7 lg:col-span-5">
              {has(build?.label) ? <Caption className="text-ink">{build.label}</Caption> : null}
              {has(build?.lead) ? <p className="mt-5 text-[1rem]">{build.lead}</p> : null}
              <p className="mt-1 font-display text-[3.5rem] leading-none md:text-[4.5rem]">{build.price}</p>
              {bullets.length ? (
                <ul className="mt-6 flex flex-col gap-3 text-[0.9375rem] leading-[1.55] md:text-[1rem]">
                  {bullets.map((b, i) => (
                    <li key={b.id ?? i} className="flex gap-3">
                      <SquareBullet />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {nextOk ? (
                <div className="mt-auto pt-8">
                  <div className="border-t-2 border-ink pt-4">
                    {has(build?.nextLabel) ? <Caption>{build.nextLabel}</Caption> : null}
                    <CMSLink
                      link={build?.nextLink}
                      className="mt-1 inline-flex min-h-target items-center font-display text-[1.125rem] leading-tight text-ink no-underline md:text-[1.25rem]"
                    >
                      <span className="ix-rule">{build?.nextLink?.label}</span>
                    </CMSLink>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {plans.length ? (
            <div className="lg:col-span-7">
              {has(marketing?.label) ? <Caption className="text-ink">{marketing.label}</Caption> : null}
              {has(marketing?.intro) ? <p className="mt-2 text-[1rem]">{marketing.intro}</p> : null}
              <ul className="mt-4 flex flex-col gap-4">
                {plans.map((p, i) => (
                  <li key={p.id ?? i} className="border-2 border-ink">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-ink px-4 py-2.5 text-cream md:px-5">
                      <h3 className="font-display text-[1.125rem] font-normal">{p.name}</h3>
                      {has(p.tag) ? <span className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-cream/80">{p.tag}</span> : null}
                    </div>
                    {has(p.body) ? (
                      <p className="px-4 py-3.5 text-[0.9375rem] leading-[1.55] md:px-5 md:text-[1rem] [&_strong]:font-bold">
                        <InlineBold text={p.body} />
                      </p>
                    ) : null}
                    {has(p.first) || has(p.after) ? (
                      <dl className="grid grid-cols-2 gap-4 bg-gray-light px-4 py-3 md:px-5">
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-gray-warm">{firstLabel}</dt>
                          <dd className="mt-1 text-[0.9375rem] font-bold">{p.first}</dd>
                        </div>
                        <div>
                          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-gray-warm">{afterLabel}</dt>
                          <dd className="mt-1 text-[0.9375rem] font-bold">{p.after}</dd>
                        </div>
                      </dl>
                    ) : null}
                  </li>
                ))}
              </ul>
              {has(marketing?.threshold) ? (
                <p className="mt-4 border-2 border-ink px-4 py-3 text-[0.9375rem] md:px-5 [&_strong]:font-bold">
                  <InlineBold text={marketing.threshold} />
                </p>
              ) : null}
              {has(marketing?.finePrint) ? (
                <p className="mt-3 whitespace-pre-line text-[0.8125rem] leading-[1.55] text-gray-warm">{marketing.finePrint}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        {has(statement) ? (
          <p className="mt-12 max-w-[56rem] font-display text-[1.25rem] leading-[1.3] md:mt-14 md:text-[1.5rem]">
            <Statement text={statement} accent={statementAccent} />
          </p>
        ) : null}

        {termRows.length ? (
          <dl className={cx('grid gap-8 md:grid-cols-3 md:gap-8', has(statement) ? 'mt-6' : 'mt-12')}>
            {termRows.map((t, i) => (
              <div key={t.id ?? i}>
                <dt className="border-b border-ink pb-2">
                  <Caption className="text-ink">{t.label}</Caption>
                </dt>
                <dd className="mt-3 text-[0.9375rem] leading-[1.6] md:text-[1rem]">{t.body}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </Section>
  )
}
