import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ArrowText, ButtonLink, CMSLink, Container, Eyebrow, Section } from '@/components/ui'
import { splitAccentPhrase } from '@/lib/accentPhrase'
import { resolveLinkHref } from '@/components/ui/CMSLink'

/**
 * TwoTrackPanels. Server component: no interactivity in any variant.
 */
export function TwoTrackPanelsBlock(props: BlockData<'twoTrackPanels'>) {
  if (props.variant === 'contrast') return <Contrast {...props} />
  if (props.variant === 'primary-secondary') return <PrimarySecondary {...props} />
  if (props.variant === 'doors') return <Doors {...props} />
  return <Equal {...props} />
}

type Props = BlockData<'twoTrackPanels'>

/**
 * `equal` (homepage "Two jobs. One team."), Home B redesign 2026-11-09
 * (design-reference/home-b-2026-11-09/TwoJobs.dc.html + Mobile.dc.html).
 * Header: eyebrow, headline (accent phrase in wine) and a right-aligned lede
 * (`intro`). Then a 2px ink rule and two columns split by a 1px hairline, no
 * cards. Each panel: micro label, title (optional wine accent phrase), a big
 * numeral from position ("01"/"02"; wine when the panel's `accentTitle` is
 * ticked), a one-line lede (`body`), a 3-stat row between hairlines, bullets
 * (8px wine squares, bold lead), then the link (bold, 2px ink underline, 44px
 * target) and the pricing note as a small grey inline note (never a price
 * block). Stacks below `lg`; stats stay three across at every width.
 */
function Equal(props: Props) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, intro } = props
  const { panels } = props
  const rows = (panels ?? []).filter((p) => Boolean(p && p.title?.trim() && p.body?.trim()))
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a track is missing its title or body and was skipped.')
  }
  const lede = intro?.trim()

  return (
    <Section tone="light" pad="none" className="py-14 md:py-24">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4 md:gap-4">
            {eyebrow ? <Eyebrow tick={eyebrowTick === true} muted>{eyebrow}</Eyebrow> : null}
            <AccentHeadline text={heading} accent={accentPhrase} level={2} accentColor="ground" />
          </div>
          {lede ? <p className="max-w-[40ch] text-body-mobile leading-[1.6] whitespace-pre-line text-ink/80 md:text-body">{lede}</p> : null}
        </div>
        {rows.length ? (
          <div className="mt-8 grid gap-y-4 border-ink md:mt-12 lg:grid-cols-2 lg:border-t-2">
            {rows.map((p, i) => {
              const wine = p.accentTitle === true
              const linkText = resolveLinkHref(p.link) ? p.link?.label?.trim() : ''
              const note = p.pricingNote?.trim()
              const stats = (p.stats ?? []).filter((s) => s?.value?.trim() && s?.label?.trim()).slice(0, 3)
              const points = (p.points ?? []).filter((pt) => pt?.lead?.trim())
              const parts = splitAccentPhrase(p.title, p.accentPhrase)
              return (
                <article
                  key={p.id ?? i}
                  className={`flex min-w-0 flex-col gap-4.5 border-t-2 border-ink pt-6 lg:gap-6 lg:border-t-0 lg:pt-8 ${
                    i === 0 ? 'lg:border-r lg:border-divider lg:pr-12' : 'lg:pl-12'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {p.label ? (
                        <p className="mb-2 text-[0.6875rem] leading-normal font-bold tracking-eyebrow text-gray-warm uppercase lg:mb-2.5">{p.label}</p>
                      ) : null}
                      <h3 className="font-display text-[1.5rem] leading-[1.1] font-normal uppercase lg:text-[2rem]">
                        {parts ? (
                          <>
                            {parts[0]}
                            <span className="text-ground-accent">{parts[1]}</span>
                            {parts[2]}
                          </>
                        ) : (
                          p.title
                        )}
                      </h3>
                    </div>
                    <p
                      aria-hidden="true"
                      className={`font-display text-[3.5rem] leading-[0.85] lg:text-[5.5rem] ${wine ? 'text-ground-accent' : 'text-ink'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <p className="text-body-mobile leading-[1.6] whitespace-pre-line text-ink/80 md:text-body">{p.body?.trim()}</p>
                  {stats.length ? (
                    <dl
                      className="grid border-y border-divider"
                      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
                    >
                      {stats.map((st, si) => (
                        <div
                          key={st.id ?? si}
                          className={`flex min-w-0 flex-col-reverse py-3.5 lg:py-4.5 ${si > 0 ? 'border-l border-divider pl-3 lg:pl-5' : ''}`}
                        >
                          <dt className="mt-1.5 text-[0.75rem] leading-[1.35] text-gray-warm lg:text-[0.75rem] lg:leading-[1.4]">{st.label.trim()}</dt>
                          <dd
                            className={`m-0 font-display text-[1.5rem] leading-none whitespace-nowrap lg:text-[2.25rem] ${st.accent ? 'text-ground-accent' : ''}`}
                          >
                            {st.value.trim()}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {points.length ? (
                    <ul className="flex flex-col gap-2.5 text-[0.9375rem] leading-[1.5] lg:gap-3">
                      {points.map((pt, pi) => (
                        <li key={pt.id ?? pi} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[7px] size-2 shrink-0 bg-ground-accent" />
                          <span>
                            <strong className="font-bold">{pt.lead.trim()}</strong>
                            {pt.text?.trim() ? ` ${pt.text.trim()}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {note || linkText ? (
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                      {linkText ? (
                        <CMSLink link={p.link} className="inline-flex min-h-target items-center font-bold text-ink no-underline">
                          <span className="ix-rule">
                            <KeepArrow label={linkText} />
                          </span>
                        </CMSLink>
                      ) : (
                        <span />
                      )}
                      {note ? <p className="text-[0.8125rem] leading-[1.4] text-gray-warm lg:text-right">{note}</p> : null}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}
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
                  <span className="sr-only">Common claim: </span>
                  <s className="decoration-ground-accent decoration-2">{p.claim}</s>
                </p>
                <h3 className="mt-2.5 font-display text-xl font-normal uppercase leading-[1.12] md:mt-3 md:text-2xl">{p.title}</h3>
              </div>
            ))}
          </div>
        ) : null}
        {conclusion?.trim() ? (
          <p className="mt-6 max-w-[60ch] border-t border-divider pt-5 text-base whitespace-pre-line leading-[1.6] md:mt-9 md:pt-6 md:text-[1.0625rem]">
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
  if (at < 0) return <ArrowText text={label} />
  const tail = label.slice(at + 1)
  const beforeTail = label.slice(0, at)
  const at2 = beforeTail.lastIndexOf(' ')
  // "Ask about a scratch build →": nowrap "build →" when the tail is only a glyph.
  const glue = /^[\p{L}\p{N}]/u.test(tail) ? at : at2
  if (glue < 0) return <ArrowText text={label} />
  return (
    <>
      {label.slice(0, glue)}{' '}
      <span className="whitespace-nowrap">
        <ArrowText text={label.slice(glue + 1)} />
      </span>
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
                  <p className={primary ? 'whitespace-pre-line text-body-mobile md:text-body' : 'whitespace-pre-line text-small-mobile text-gray-warm md:text-small'}>
                    {p.body}
                  </p>
                  {p.pricingNote?.trim() ? <p className="text-small-mobile text-gray-warm md:text-small">{p.pricingNote.trim()}</p> : null}
                  {hasLink ? (
                    primary ? (
                      <ButtonLink link={p.link} variant="primary" size="md" className="mt-auto self-start" />
                    ) : (
                      <CMSLink link={p.link} className="mt-auto inline-flex min-h-target items-center self-start font-bold no-underline">
                        <span className="ix-rule">
                          <KeepArrow label={p.link?.label?.trim() ?? ''} />
                        </span>
                      </CMSLink>
                    )
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}
        {conclusion?.trim() ? <p className="mt-6 max-w-[60ch] text-small-mobile whitespace-pre-line text-gray-warm md:text-small">{conclusion}</p> : null}
      </Container>
    </Section>
  )
}

/**
 * `doors` (/services "Two doors."). Article-style since 2026-11-08 (owner: "a
 * normal article kind of thing, not card-based"; two side-by-side columns
 * read unbalanced): ONE reading column, each door a subheading, its paragraph
 * with the price note run in as a bold closing sentence, then a text link.
 * Doors are separated by a hairline. No boxes, no buttons, no side-by-side
 * columns. `accentTitle` makes the price note and link wine. The design's big
 * price numeral is NOT rendered (R13).
 */
function Doors({ heading, accentPhrase, eyebrow, eyebrowTick, panels, conclusion }: Props) {
  const rows = (panels ?? []).filter((p) => p && p.title?.trim() && p.body?.trim())
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a door is missing its title or body and was skipped.')
  }
  // Door titles are h3 under the section headline; without one they are the section's h2.
  const TitleTag = heading?.trim() ? 'h3' : 'h2'
  return (
    <Section tone="light" pad="none" className="pb-10 md:pb-18">
      <Container>
        <div className="max-w-[44rem]">
          {heading?.trim() || eyebrow ? (
            <div className="flex flex-col gap-5 pb-2 md:pb-4">
              {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
              {heading?.trim() ? <AccentHeadline text={heading} accent={accentPhrase} level="section" /> : null}
            </div>
          ) : null}
          {rows.map((p, i) => {
            const cta = resolveLinkHref(p.link) ? p.link?.label?.trim() : ''
            const wine = p.accentTitle === true
            const note = p.pricingNote?.trim()
            return (
              <div key={p.id ?? i} className={`py-6 md:py-8 ${i > 0 ? 'border-t border-divider' : ''}`}>
                <TitleTag className="font-display text-lg leading-[1.1] font-normal uppercase md:text-2xl">{p.title}</TitleTag>
                <p className="mt-3 text-body-mobile leading-[1.6] whitespace-pre-line md:mt-4 md:text-body md:leading-[1.6]">
                  {p.body?.trim()}
                  {note ? (
                    <>
                      {' '}
                      <strong className={`font-bold ${wine ? 'text-ground-accent' : ''}`}>{note}</strong>
                    </>
                  ) : null}
                </p>
                {cta ? (
                  // Site text-link grammar: bold, 2px ix-rule hugging the text, 44px tap area.
                  <CMSLink
                    link={p.link}
                    className={`mt-2 inline-flex min-h-target items-center font-bold no-underline ${wine ? 'text-ground-accent' : 'text-ink'}`}
                  >
                    <span className="ix-rule">
                      <KeepArrow label={cta} />
                    </span>
                  </CMSLink>
                ) : null}
              </div>
            )
          })}
          {conclusion?.trim() ? <p className="mt-2 text-small-mobile whitespace-pre-line text-gray-warm md:text-small">{conclusion}</p> : null}
        </div>
      </Container>
    </Section>
  )
}
