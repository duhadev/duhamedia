import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { ArticleHero } from './ArticleHero'
import { LOGO_MASK } from './logoMask'
import { ServiceHero } from './ServiceHero'

/**
 * Hero (SCHEMA §8.1 item 1). Picks the layout by `variant`; every variant
 * renders exactly one h1. Server component: no interactivity.
 */
export function HeroBlock(props: BlockData<'hero'>) {
  if (props.variant === 'service') return <ServiceHero {...props} />
  if (props.variant === 'article') return <ArticleHero {...props} />
  return <TypographicHero {...props} />
}

/**
 * Hero, `typographic` variant (Homepage.dc.html "Hero", desktop + mobile
 * builds; Work.dc.html "Work hero" + "Aggregates" for `stats`). The only h1
 * of the page. `stats` and `phaseStrip` are optional: with both empty the
 * markup is exactly the homepage hero.
 */
function TypographicHero({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  badge,
  body,
  pricingNote,
  ctas,
  subNote,
  verticalMicrocopy,
  geometry,
  stats,
  phaseStrip,
}: BlockData<'hero'>) {
  const badgeText = badge?.show !== false ? badge?.text?.trim() : ''
  const paragraph = [body?.trim(), pricingNote?.trim()].filter(Boolean).join(' ')
  const buttons = (ctas ?? []).slice(0, 2)
  const figures = stats ?? []
  const phases = (phaseStrip ?? []).slice(0, 3)

  const copy = (
    <>
        {eyebrow ? <Eyebrow tick={eyebrowTick !== false}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline
          text={heading}
          accent={accentPhrase}
          level={1}
          as="h1"
          className="mt-4.5 md:mt-5.5 md:max-w-[20ch] md:max-lg:!text-h1-mobile"
        />
        {badgeText ? (
          <div className="mt-4.5 md:mt-5.5">
            <span className="inline-flex items-center gap-2 rounded-badge border-2 border-ink bg-ink px-4 py-2 text-label uppercase tracking-eyebrow text-cream">
              {badgeText}
            </span>
          </div>
        ) : null}
        {paragraph ? (
          <p className="mt-4.5 max-w-[34ch] text-body-mobile md:mt-6 md:max-w-[52ch] md:text-body">{paragraph}</p>
        ) : null}
        {verticalMicrocopy ? (
          <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-warm lg:hidden">
            {verticalMicrocopy}
          </span>
        ) : null}
        {buttons.length ? (
          <div className="mt-7 flex gap-3 md:mt-8 md:flex-wrap md:gap-3.5">
            {buttons.map((cta, i) => (
              <ButtonLink
                key={cta.id ?? i}
                link={cta.link}
                variant={i === 0 ? 'primary' : 'ghost'}
                size="md"
                className="flex-1 md:flex-none"
              />
            ))}
          </div>
        ) : null}
        {subNote ? <p className="mt-4 text-small-mobile text-gray-warm md:text-small">{subNote}</p> : null}
      {phases.length ? (
        <ol className="mt-8 grid grid-cols-3 gap-3 md:mt-10 md:gap-6 lg:max-w-190">
          {phases.map((phase, i) => {
            const last = i === phases.length - 1
            return (
              <li key={phase.id ?? i} className={cx('border-t-4 pt-3 md:pt-4', last ? 'border-ink' : 'border-divider')}>
                <span className={cx('block font-display text-[1.75rem] leading-none', last ? 'text-ground-accent' : 'text-ink')}>
                  {phase.number}
                </span>
                <span className="mt-1.5 block text-[12px] font-bold uppercase leading-snug md:text-small">
                  {phase.label}
                  {last ? <span aria-hidden="true"> →</span> : null}
                </span>
              </li>
            )
          })}
        </ol>
      ) : null}
    </>
  )

  const section = (
    <Section tone="light" pad="none" className="relative overflow-hidden">
      <DotMatrix fade="corner" intensity="strong" />
      {geometry !== false ? (
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className={
            figures.length
              ? // stats sit in the right column on desktop: park the shape in the corner (Work.dc.html: 300px, right -140, top -60)
                'pointer-events-none absolute -right-20 top-22.5 z-0 size-70 bg-ground-accent lg:-right-35 lg:-top-15 lg:size-75'
              : 'pointer-events-none absolute -right-20 top-22.5 z-0 size-70 bg-ground-accent lg:right-[8%] lg:top-[46%] lg:size-115 lg:-translate-y-1/2'
          }
        />
      ) : null}
      {verticalMicrocopy ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] left-6 z-0 hidden origin-top-left whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-gray-warm lg:block lg:[transform:rotate(-90deg)_translateX(-50%)_translateY(-100%)]"
        >
          {verticalMicrocopy}
        </span>
      ) : null}
      <Container className="relative z-10 pt-14 pb-12 md:pt-26 md:pb-24">
        {figures.length ? (
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:items-end lg:gap-14">
            <div>{copy}</div>
            <ul className="hidden border-l-2 border-ink pl-6 lg:flex lg:flex-col lg:gap-5">
              {figures.map((fig, i) => (
                <li key={fig.id ?? i}>
                  <span className="block font-display text-h1-mobile">{fig.value}</span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-warm">{fig.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          copy
        )}
      </Container>
    </Section>
  )

  if (!figures.length) return section

  // Mobile "Aggregates" strip (Work.dc.html): under the hero, below lg.
  const cols = figures.length <= 3 ? figures.length : 2
  return (
    <>
      {section}
      <div className="border-b-2 border-ink lg:hidden">
        <ul className={cx('grid gap-px bg-divider', cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
          {figures.map((fig, i) => (
            <li
              key={fig.id ?? i}
              className={cx(
                'bg-cream px-container-mobile py-4 md:px-container',
                cols === 2 && figures.length % 2 === 1 && i === figures.length - 1 && 'col-span-2',
              )}
            >
              <span className="block font-display text-[1.75rem] leading-none">{fig.value}</span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-gray-warm">{fig.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
