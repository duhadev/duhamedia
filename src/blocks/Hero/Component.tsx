import config from '@payload-config'
import { getPayload } from 'payload'
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
export async function HeroBlock(props: BlockData<'hero'>) {
  if (props.variant === 'service') return <ServiceHero {...props} />
  if (props.variant === 'article') return <ArticleHero {...props} />
  const rating = props.showAggregateRating ? await loadAggregateRating() : null
  return <TypographicHero {...props} rating={rating} />
}

type AggregateRating = { average: string; count: number }

/**
 * Average star rating over PUBLISHED testimonials that carry a rating
 * (Testimonials.rating, 1-5). Computed at render, never stored. Nothing rated
 * (or a failed read) -> null, so no number is ever invented. No Review /
 * AggregateRating JSON-LD on purpose (self-serving reviews, F64/F78).
 */
async function loadAggregateRating(): Promise<AggregateRating | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { _status: { equals: 'published' }, rating: { exists: true } },
      select: { rating: true },
      depth: 0,
      pagination: false,
      overrideAccess: false,
    })
    const ratings = docs.map((d) => d.rating).filter((r): r is number => typeof r === 'number' && r >= 1 && r <= 5)
    if (!ratings.length) return null
    const average = (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    return { average, count: ratings.length }
  } catch (error) {
    console.error('[Hero] could not compute the aggregate rating; rating line hidden', error)
    return null
  }
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
  size,
  width,
  callouts,
  rating,
  showAggregateRating,
}: BlockData<'hero'> & { rating?: AggregateRating | null }) {
  const compact = size === 'compact'
  const badgeText = badge?.show !== false ? badge?.text?.trim() : ''
  const paragraph = [body?.trim(), pricingNote?.trim()].filter(Boolean).join(' ')
  const buttons = (ctas ?? []).slice(0, 2)
  const figures = stats ?? []
  const phases = (phaseStrip ?? []).slice(0, 3)
  const pairs = (callouts ?? []).filter((c) => c.label?.trim() && c.text?.trim()).slice(0, 2)
  const ratingText = rating ? `${rating.average} avg · ${rating.count} ${rating.count === 1 ? 'rating' : 'ratings'}` : ''
  const eyebrowText = [eyebrow?.trim(), ratingText].filter(Boolean).join(' · ')

  const copy = (
    <>
        {eyebrowText ? <Eyebrow tick={eyebrowTick !== false}>{ratingText ? eyebrowText : eyebrow}</Eyebrow> : null}
        <AccentHeadline
          text={heading}
          accent={accentPhrase}
          level={1}
          as="h1"
          className={
            compact
              ? // Testimonials/Book/Thank You/FAQ/Contact.dc.html: 2.25rem on mobile, no width cap
                'mt-4 md:mt-5 max-md:!text-[2.25rem]'
              : 'mt-4.5 md:mt-5.5 md:max-w-[20ch] md:max-lg:!text-h1-mobile'
          }
        />
        {badgeText ? (
          <div className="mt-4.5 md:mt-5.5">
            <span className="inline-flex items-center gap-2 rounded-badge border-2 border-ink bg-ink px-4 py-2 text-label uppercase tracking-eyebrow text-cream">
              {badgeText}
            </span>
          </div>
        ) : null}
        {paragraph ? (
          <p
            className={
              compact
                ? 'mt-4 max-w-[52ch] text-body-mobile md:mt-6 md:text-body'
                : 'mt-4.5 max-w-[34ch] text-body-mobile md:mt-6 md:max-w-[52ch] md:text-body'
            }
          >
            {paragraph}
          </p>
        ) : null}
        {pairs.length ? (
          <div className="mt-6 flex flex-col gap-4.5 text-body-mobile md:mt-8 md:grid md:grid-cols-2 md:gap-6">
            {pairs.map((c, i) => (
              <div key={c.id ?? i} className="border-t-2 border-ink pt-3 md:pt-3.5">
                <span className="font-bold">{c.label}</span> {c.text}
              </div>
            ))}
          </div>
        ) : null}
        {verticalMicrocopy ? (
          <span aria-hidden="true" className="mt-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-warm lg:hidden">
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
            compact
              ? // Testimonials.dc.html: 340px, right -160 top -80 (mobile 220px, -110 / -50)
                'pointer-events-none absolute -right-27.5 -top-12.5 z-0 size-55 bg-ground-accent md:-right-40 md:-top-20 md:size-85'
              : figures.length
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
      {/* p7 Testimonials.dc.html: hero shares the feed's full container (1200px). It is the only compact hero with the rating flag; p9-p12 stay on the 820px column. */}
      <Wrap compact={compact} narrow={compact && (width ? width === 'narrow' : !figures.length && !showAggregateRating)}>
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
      </Wrap>
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

/** Hero content column. Default = the site Container; compact (80/56 desktop, 48/36 mobile) is the 820px column of the sub-page heroes. */
function Wrap({ compact, narrow, children }: { compact: boolean; narrow: boolean; children: React.ReactNode }) {
  if (!compact) return <Container className="relative z-10 pt-14 pb-12 md:pt-26 md:pb-24">{children}</Container>
  return (
    <div
      className={cx(
        'relative z-10 mx-auto w-full px-container-mobile pt-12 pb-9 md:px-container md:pt-20 md:pb-14',
        narrow ? 'max-w-205' : 'max-w-site',
      )}
    >
      {children}
    </div>
  )
}
