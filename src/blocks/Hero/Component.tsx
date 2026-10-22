import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'

const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

/**
 * Hero, `typographic` variant (Homepage.dc.html "Hero", desktop + mobile
 * builds). Server component: no interactivity. The only h1 of the page.
 */
export function HeroBlock({
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
}: BlockData<'hero'>) {
  const badgeText = badge?.show !== false ? badge?.text?.trim() : ''
  const paragraph = [body?.trim(), pricingNote?.trim()].filter(Boolean).join(' ')
  const buttons = (ctas ?? []).slice(0, 2)

  return (
    <Section tone="light" pad="none" className="relative overflow-hidden">
      <DotMatrix fade="corner" intensity="strong" />
      {geometry !== false ? (
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className="pointer-events-none absolute -right-20 top-22.5 z-0 size-70 bg-ground-accent md:right-[8%] md:top-[46%] md:size-115 md:-translate-y-1/2"
        />
      ) : null}
      {verticalMicrocopy ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] left-6 z-0 hidden origin-top-left whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-gray-warm md:block md:[transform:rotate(-90deg)_translateX(-50%)_translateY(-100%)]"
        >
          {verticalMicrocopy}
        </span>
      ) : null}
      <Container className="relative z-10 pt-14 pb-12 md:pt-26 md:pb-24">
        {eyebrow ? <Eyebrow tick={eyebrowTick !== false}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline
          text={heading}
          accent={accentPhrase}
          level={1}
          as="h1"
          className="mt-4.5 md:mt-5.5 md:max-w-[20ch]"
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
          <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-warm md:hidden">
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
      </Container>
    </Section>
  )
}
