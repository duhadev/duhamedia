import React from 'react'

import type { BlockData } from '@/blocks/types'
import { CMSLink, resolveLinkHref, Section } from '@/components/ui'

const STRIP =
  'mx-auto flex w-full max-w-site items-center justify-between gap-4 px-container-mobile py-4.5 md:gap-8 md:px-container md:py-6'
const TEXT = 'font-display text-[1rem] font-normal uppercase leading-[1.15] md:text-[1.5rem]'

/**
 * MiniCTAStrip, `band` variant (Homepage.dc.html "Mini CTA", desktop + mobile).
 * Server component. The whole strip is one link; the pill is its visual
 * button. With an unresolved link the strip renders the text alone.
 */
export function MiniCTAStripBlock(props: BlockData<'miniCTAStrip'>) {
  if (props.variant === 'inline') return <MiniCTAInline {...props} />
  const { text, link } = props
  const label = link?.label?.trim()
  const linked = Boolean(resolveLinkHref(link) && label)

  return (
    <Section tone="dark" pad="none">
      {linked ? (
        <CMSLink link={link} className={`${STRIP} min-h-target no-underline text-cream`}>
          <span className={TEXT}>{text}</span>
          <span className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-badge border-[1.5px] border-cream px-4.5 py-2.5 text-[14px] font-bold md:gap-2.5 md:px-6 md:py-3 md:text-[15px]">
            {label}
            <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-4 shrink-0">
              <path d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32z" />
            </svg>
          </span>
        </CMSLink>
      ) : (
        <div className={STRIP}>
          <span className={TEXT}>{text}</span>
        </div>
      )}
    </Section>
  )
}

/**
 * `inline` variant (Book a Call.dc.html, foot of "Social proof": "Have a quick
 * question first? Contact us", desktop + mobile). Quiet one-line escape, never
 * a button. The link keeps a 44px hit area via an expanded pseudo-element so
 * the underline stays tight to the text. An unresolved link renders the
 * sentence alone.
 */
function MiniCTAInline({ text, link }: BlockData<'miniCTAStrip'>) {
  const label = link?.label?.trim()
  const linked = Boolean(resolveLinkHref(link) && label)

  return (
    <Section tone="light" pad="none">
      <div className="mx-auto w-full max-w-site px-container-mobile pt-5.5 pb-11 md:px-container md:pt-8 md:pb-16">
        <p className="m-0 text-[0.9375rem] text-gray-warm">
          {text}
          {linked ? (
            <>
              {' '}
              <CMSLink
                link={link}
                className="relative font-bold text-ink no-underline border-b-2 border-ink after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
              >
                {label}
              </CMSLink>
            </>
          ) : null}
        </p>
      </div>
    </Section>
  )
}
