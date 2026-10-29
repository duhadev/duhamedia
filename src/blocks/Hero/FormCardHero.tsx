import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'

import { HeroFormCard, type HeroFormSlot } from './HeroForm'
import { LOGO_MASK } from './logoMask'

/**
 * Hero, `typographic` + form slot in `card` style (Newsletter.dc.html
 * "Newsletter hero", desktop + mobile builds). The signup sits inside the
 * hero, above the fold (SCHEMA §9 p16).
 *
 * - From lg: two columns 1.25fr / 1fr (gap 56). Left: eyebrow, h1, paragraph,
 *   buttons (if any) and the key figures as a ruled inline strip; right: the
 *   grey signup card, pushed down 312px (design) so it sits beside the paragraph.
 * - Below lg (phones and the 768-1023 band, no tablet build): one column in
 *   the mobile order: copy, card, figures.
 * The badge, callouts, phase strip, side microcopy and `size` belong to the
 * other typographic layouts and are not shown here. Server component.
 */
export function FormCardHero({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  body,
  pricingNote,
  ctas,
  subNote,
  geometry,
  stats,
  submitLabel,
  formHeading,
  formBody,
  formNote,
  slot,
  ratingText,
}: BlockData<'hero'> & { slot: HeroFormSlot; ratingText: string }) {
  const paragraph = [body?.trim(), pricingNote?.trim()].filter(Boolean).join(' ')
  const buttons = (ctas ?? []).slice(0, 2)
  const figures = stats ?? []
  const eyebrowText = [eyebrow?.trim(), ratingText].filter(Boolean).join(' · ')

  return (
    <Section tone="light" pad="none" className="relative overflow-hidden">
      <DotMatrix fade="corner" />
      {geometry !== false ? (
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className="pointer-events-none absolute -right-30 -top-37.5 z-0 size-60 bg-ground-accent md:-top-12.5 lg:-right-45 lg:-top-22.5 lg:size-105"
        />
      ) : null}
      <Container className="relative z-10 pt-12 pb-11 md:pt-24 md:pb-20">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14">
          <div className="lg:col-start-1 lg:row-start-1">
            {eyebrowText ? <Eyebrow tick={eyebrowTick !== false}>{eyebrowText}</Eyebrow> : null}
            <AccentHeadline
              text={heading}
              accent={accentPhrase}
              level={1}
              as="h1"
              className="mt-4 max-md:!text-[2.25rem] max-md:!leading-[1.02] md:mt-5 lg:max-xl:!text-h2"
            />
            {paragraph ? (
              <p className="mt-4.5 max-w-[52ch] whitespace-pre-line text-[1.0625rem] leading-[1.6] md:mt-6 md:text-body">{paragraph}</p>
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
          </div>
          <HeroFormCard
            slot={slot}
            submitLabel={submitLabel}
            formHeading={formHeading}
            formBody={formBody}
            formNote={formNote}
            className="mt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-78"
          />
          {figures.length ? (
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t-2 border-ink pt-4 md:gap-x-12 md:gap-y-6 md:pt-5 lg:col-start-1 lg:row-start-2 lg:mt-8 lg:self-start">
              {figures.map((fig, i) => (
                <div key={fig.id ?? i}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm">{fig.label}</dt>
                  <dd className="mt-1 font-display text-base uppercase md:mt-1.5 md:text-lg">{fig.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
