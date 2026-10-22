import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, CMSLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'
import { splitAccentPhrase } from '@/lib/accentPhrase'
import { resolveLinkHref } from '@/components/ui/CMSLink'

/**
 * TwoTrackPanels, `equal` variant (Homepage.dc.html "What we do", desktop +
 * mobile builds). Server component: no interactivity.
 */
export function TwoTrackPanelsBlock(props: BlockData<'twoTrackPanels'>) {
  if (props.variant === 'contrast') return <Contrast {...props} />
  if (props.variant === 'primary-secondary') return <PrimarySecondary {...props} />
  if (props.variant === 'doors') return <Doors {...props} />
  return <Equal {...props} />
}

type Props = BlockData<'twoTrackPanels'>

function Equal({ eyebrow, eyebrowTick, heading, accentPhrase, panels }: Props) {
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

/**
 * `contrast` (Services Hub.dc.html "Why both together", desktop + mobile
 * builds): desktop = two bordered gray-light cards, mobile = a ruled list.
 * Each panel: small mono label, struck claim (<del>, wine line), reality line
 * (`title`). Then the conclusion under a hairline.
 */
function Contrast({ eyebrow, eyebrowTick, heading, accentPhrase, panels, conclusion }: Props) {
  const rows = (panels ?? []).filter((p) => p && p.title?.trim() && p.claim?.trim())
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a contrast panel is missing its claim or reality line and was skipped.')
  }
  const parts = splitAccentPhrase(heading, accentPhrase)
  return (
    <Section tone="light" pad="none" className="px-0 py-9 md:py-18">
      <Container>
        {eyebrow ? <Eyebrow tick={eyebrowTick === true} muted>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-3.5 font-display text-[1.875rem] font-normal uppercase leading-[1.02] text-balance md:mt-4.5 md:text-[2.25rem] md:leading-[1.05]">
          {parts ? (
            <>
              {parts[0]}
              <span className="text-ground-accent">{parts[1]}</span>
              {parts[2]}
            </>
          ) : (
            heading
          )}
        </h2>
        {rows.length ? (
          <div className="mt-7 border-t-2 border-ink md:mt-10 md:grid md:grid-cols-2 md:gap-6 md:border-t-0">
            {rows.map((p, i) => (
              <div
                key={p.id ?? i}
                className="border-t border-divider py-5.5 first:border-t-0 md:border-2 md:border-ink md:bg-gray-light md:px-8 md:pt-8 md:pb-9 md:first:border-t-2 md:[&:not(:first-child)]:border-t-2"
              >
                {p.label ? (
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm">{p.label}</span>
                ) : null}
                <p className={`${p.label ? 'mt-2.5' : ''} text-[1.0625rem] leading-[1.4] text-gray-warm md:text-lg md:leading-[1.4]`}>
                  <del className="decoration-ground-accent decoration-2">{p.claim}</del>
                </p>
                <h3 className="mt-2.5 font-display text-xl font-normal uppercase leading-[1.12] md:mt-3 md:text-2xl">{p.title}</h3>
              </div>
            ))}
          </div>
        ) : null}
        {conclusion?.trim() ? (
          <p className="mt-6 max-w-[60ch] border-t border-divider pt-5 text-base leading-[1.6] md:mt-9 md:pt-6 md:text-[1.0625rem]">
            {conclusion}
          </p>
        ) : null}
      </Container>
    </Section>
  )
}

/** Keeps the last word with the trailing arrow (or other glyph) so it never wraps alone. */
function KeepArrow({ label }: { label: string }) {
  const at = label.lastIndexOf(' ')
  if (at < 0) return <>{label}</>
  const tail = label.slice(at + 1)
  const beforeTail = label.slice(0, at)
  const at2 = beforeTail.lastIndexOf(' ')
  // "Ask about a scratch build →": nowrap "build →" when the tail is only a glyph.
  const glue = /^[\p{L}\p{N}]/u.test(tail) ? at : at2
  if (glue < 0) return <>{label}</>
  return (
    <>
      {label.slice(0, glue)}{' '}
      <span className="whitespace-nowrap">{label.slice(glue + 1)}</span>
    </>
  )
}

/**
 * `primary-secondary`: DERIVED design (the page designs omit this section;
 * MERGED §7). First panel = lead option at full weight (bordered gray-light
 * card, shadow-card, filled button); second = softer (hairline border, no
 * fill, muted copy, text link). Page grammar: ink 2px border + gray-light as
 * in "Why both together".
 */
function PrimarySecondary({ eyebrow, eyebrowTick, heading, accentPhrase, panels, conclusion }: Props) {
  const rows = (panels ?? []).filter((p) => p && p.title?.trim() && p.body?.trim())
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a track is missing its title or body and was skipped.')
  }
  return (
    <Section tone="light">
      <Container>
        <div className="flex flex-col gap-5 md:gap-6">
          {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
          <AccentHeadline text={heading} accent={accentPhrase} level="section" />
        </div>
        {rows.length ? (
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-[3fr_2fr] md:items-stretch md:gap-6">
            {rows.map((p, i) => {
              const primary = i === 0
              const hasLink = Boolean(resolveLinkHref(p.link) && p.link?.label?.trim())
              return (
                <div
                  key={p.id ?? i}
                  className={
                    primary
                      ? 'flex flex-col gap-4 border-2 border-ink bg-gray-light p-6 shadow-card md:p-8'
                      : 'flex flex-col gap-3 border border-divider p-6 md:p-8'
                  }
                >
                  {p.label ? (
                    <Eyebrow tick={primary} muted={!primary}>
                      {p.label}
                    </Eyebrow>
                  ) : null}
                  <h3
                    className={`font-display font-normal uppercase ${
                      primary ? 'text-h3-mobile md:text-h3' : 'text-xl text-gray-warm'
                    } ${p.accentTitle ? 'text-ground-accent' : ''}`}
                  >
                    {p.title}
                  </h3>
                  <p className={primary ? 'text-body-mobile md:text-body' : 'text-small-mobile text-gray-warm md:text-small'}>
                    {p.body}
                  </p>
                  {p.pricingNote?.trim() ? <p className="text-small-mobile text-gray-warm md:text-small">{p.pricingNote.trim()}</p> : null}
                  {hasLink ? (
                    primary ? (
                      <ButtonLink link={p.link} variant="primary" size="md" className="mt-auto self-start" />
                    ) : (
                      <CMSLink link={p.link} className="mt-auto inline-flex min-h-target items-center self-start font-bold underline underline-offset-4">
                        <KeepArrow label={p.link?.label?.trim() ?? ''} />
                      </CMSLink>
                    )
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}
        {conclusion?.trim() ? <p className="mt-6 max-w-[60ch] text-small-mobile text-gray-warm md:text-small">{conclusion}</p> : null}
      </Container>
    </Section>
  )
}

/**
 * `doors` (Services Hub.dc.html "Two doors"): each panel is one linked card:
 * title, paragraph, filled CTA (ink for the first door, wine when
 * `accentTitle`). The design's big price numeral is NOT rendered (R13); the
 * `pricingNote` sits where it was, at small-note size. Mobile = ruled rows.
 */
function Doors({ heading, accentPhrase, eyebrow, eyebrowTick, panels, conclusion }: Props) {
  const rows = (panels ?? []).filter((p) => p && p.title?.trim() && p.body?.trim())
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a door is missing its title or body and was skipped.')
  }
  return (
    <Section tone="light" pad="none" className="pb-7 md:pb-18">
      <Container>
        {heading?.trim() || eyebrow ? (
          <div className="flex flex-col gap-5 pb-6 md:pb-10">
            {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
            {heading?.trim() ? <AccentHeadline text={heading} accent={accentPhrase} level="section" /> : null}
          </div>
        ) : null}
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-16">
          {rows.map((p, i) => {
            const href = resolveLinkHref(p.link)
            const cta = href ? p.link?.label?.trim() : ''
            const wine = p.accentTitle === true
            const inner = (
              <>
                <span className="flex items-baseline justify-between gap-3 md:flex-col md:items-start md:gap-4">
                  <span className="font-display text-lg leading-[1.05] uppercase md:text-2xl">{p.title}</span>
                  {p.pricingNote?.trim() ? (
                    <span className={`shrink-0 text-small-mobile md:text-small ${wine ? 'text-ground-accent' : 'text-gray-warm'}`}>
                      {p.pricingNote.trim()}
                    </span>
                  ) : null}
                </span>
                <span className={`text-[0.9375rem] leading-[1.55] text-ink/80 md:text-base md:leading-[1.6] ${cta ? 'md:mb-2' : ''}`}>{p.body}</span>
                {cta ? (
                  <span
                    className={`mt-0.5 inline-flex min-h-target items-center self-start text-xs font-bold uppercase tracking-[0.06em] md:mt-auto md:px-6.5 md:text-small ${
                      wine ? 'text-ground-accent md:bg-ground-accent md:text-on-accent' : 'text-ink md:bg-ink md:text-cream'
                    }`}
                  >
                    {cta}
                  </span>
                ) : null}
              </>
            )
            const cls = 'flex flex-col gap-1.5 border-t border-divider py-5 text-ink no-underline md:gap-4 md:border-t-0 md:py-0'
            return href ? (
              <CMSLink key={p.id ?? i} link={p.link} className={cls}>
                {inner}
              </CMSLink>
            ) : (
              <div key={p.id ?? i} className={cls}>
                {inner}
              </div>
            )
          })}
        </div>
        {conclusion?.trim() ? <p className="mt-6 max-w-[60ch] text-small-mobile text-gray-warm md:text-small">{conclusion}</p> : null}
      </Container>
    </Section>
  )
}
