import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, CMSLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'

/**
 * TwoTrackPanels, `equal` variant (Homepage.dc.html "What we do", desktop +
 * mobile builds). Server component: no interactivity.
 */
export function TwoTrackPanelsBlock({ eyebrow, eyebrowTick, heading, accentPhrase, panels }: BlockData<'twoTrackPanels'>) {
  const rows = (panels ?? []).filter((p) => p && p.title?.trim() && p.body?.trim())
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a track is missing its title or body and was skipped.')
  }

  return (
    <Section tone="light" className="relative overflow-hidden">
      <DotMatrix fade="edges" />
      <Container className="relative z-10">
        <div className="flex flex-col gap-5 md:gap-6">
          {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
          <AccentHeadline text={heading} accent={accentPhrase} level="section" />
          {rows.map((p, i) => {
            const linkText = resolveLinkHref(p.link) ? p.link?.label?.trim() : ''
            return (
              <div key={p.id ?? i}>
                {p.label ? (
                  <Eyebrow muted className="mb-2">
                    {p.label}
                  </Eyebrow>
                ) : null}
                <p className="text-body-mobile leading-[1.7] md:text-body md:leading-[1.7]">
                  <span className={`font-display font-normal uppercase ${p.accentTitle ? 'text-ground-accent' : ''}`}>
                    {p.title}
                  </span>{' '}
                  {p.body}
                  {p.pricingNote?.trim() ? <> {p.pricingNote.trim()}</> : null}
                  {linkText ? (
                    <>
                      {' '}
                      <CMSLink link={p.link} className="py-3 font-bold">
                        {linkText}
                      </CMSLink>
                    </>
                  ) : null}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
