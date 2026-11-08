import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ArrowText, ButtonLink, CMSLink, Container, DotMatrix, Eyebrow, Section } from '@/components/ui'
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
type Panel = NonNullable<Props['panels']>[number]

/**
 * `**phrase**` -> <strong>. Splits on the literal `**`; odd segments are bold.
 * An unmatched trailing `**` is put back as text. Output is React text nodes
 * only (escaped), so editor input can never inject markup.
 */
function InlineBold({ text }: { text: string }) {
  const parts = text.split('**')
  // An even part count means an odd number of markers: the last one is unmatched.
  if (parts.length % 2 === 0) parts.splice(-2, 2, `${parts[parts.length - 2]}**${parts[parts.length - 1]}`)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? part ? <strong key={i}>{part}</strong> : null : part))}
    </>
  )
}

/**
 * First money token in a pricing note: `$`, digits (with `.`/`,` groups), an
 * optional K/M suffix and an optional `/unit` ("$5K", "$7k", "$1K/mo",
 * "$1,500"). A trailing sentence period is not part of it.
 */
const MONEY = /\$\d+(?:[.,]\d+)*[kKmM]?(?:\/[a-zA-Z]+)?/

function PriceTag({ note, accent }: { note: string; accent: boolean }) {
  const m = MONEY.exec(note)
  return (
    // No filled box (human 2026-10-29: "remove the black box"): plain note, amount enlarged;
    // the accent track's amount is wine.
    <span className="inline-flex items-baseline text-small-mobile text-ink md:text-small">
      {m ? (
        <span>
          {note.slice(0, m.index)}
          <strong className={`text-body-mobile leading-none font-bold md:text-body md:leading-none ${accent ? 'text-ground-accent' : ''}`}>{m[0]}</strong>
          {note.slice(m.index + m[0].length)}
        </span>
      ) : (
        note
      )}
    </span>
  )
}

/**
 * `equal` (homepage "Two jobs. One team."). Text-led since 2026-11-08 (owner:
 * "not cardy, more text-based"), after the brochure p1 pair ("Made by hand. /
 * BUILD" - "Then made known. / GROW": two text columns under thin rules) and
 * the /services label-rows. Each track: a 2px ink rule, number tag 01/02 from
 * position, optional label, title, body paragraphs (blank line = new
 * paragraph, `**bold**`), optional service chips, then a hairline footer row
 * with the price note and the text link. No box, fill or shadow. The accent
 * track (`accentTitle`) gets a wine rule, wine title and wine price amount.
 * Two columns from `lg` (at `md` a column would hold ~35ch of body); stacked
 * below.
 *
 * PRICING: the price note's amount is enlarged + bold, which overrides the
 * locked "pricing only as small inline notes" rule (CLAUDE.md rule 5 / R13)
 * FOR THIS VARIANT ONLY. Human-approved 2026-10-29. Do not copy it to other blocks.
 */
function Equal({ eyebrow, eyebrowTick, heading, accentPhrase, panels }: Props) {
  const rows = (panels ?? []).filter((p): p is Panel => Boolean(p && p.title?.trim() && p.body?.trim()))
  if ((panels ?? []).length !== rows.length) {
    console.error('[TwoTrackPanels] a track is missing its title or body and was skipped.')
  }

  return (
    <Section tone="light" pad="none" className="relative overflow-hidden py-12 md:py-16">
      <DotMatrix fade="edges" />
      <Container className="relative z-10">
        <div className="flex flex-col gap-5 md:gap-6">
          {eyebrow ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
          <AccentHeadline text={heading} accent={accentPhrase} level="section" />
        </div>
        {rows.length ? (
          <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            {rows.map((p, i) => {
              const accent = p.accentTitle === true
              const linkText = resolveLinkHref(p.link) ? p.link?.label?.trim() : ''
              const note = p.pricingNote?.trim()
              const paragraphs = (p.body ?? '')
                .split(/\n[ \t]*\n/)
                .map((t) => t.trim())
                .filter(Boolean)
              const chips = (p.services ?? []).filter((c) => c?.label?.trim())
              return (
                <div key={p.id ?? i} className={`flex flex-col border-t-2 pt-5 md:pt-6 ${accent ? 'border-ground-accent' : 'border-ink'}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[15px] leading-normal font-bold tracking-[0.08em] text-gray-warm md:text-[17px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {p.label ? (
                      <Eyebrow muted as="span">
                        {p.label}
                      </Eyebrow>
                    ) : null}
                  </div>
                  <h3
                    className={`mt-3 font-display text-xl leading-[1.12] font-normal uppercase md:text-2xl ${accent ? 'text-ground-accent' : ''}`}
                  >
                    {p.title}
                  </h3>
                  <div className="mt-4 max-w-[60ch] text-body-mobile leading-[1.6] md:text-body md:leading-[1.6]">
                    {paragraphs.map((para, pi) => (
                      <p key={pi} className={`whitespace-pre-line ${pi > 0 ? 'mt-3' : ''}`}>
                        <InlineBold text={para} />
                      </p>
                    ))}
                  </div>
                  {chips.length ? (
                    // Text list, not chips-as-boxes: middot-separated, bold.
                    <ul className="mt-4 flex flex-wrap gap-x-2 text-small-mobile font-bold md:text-small">
                      {chips.map((c, ci) => (
                        <li key={c.id ?? ci} className="flex gap-2">
                          {ci > 0 ? <span aria-hidden="true" className="text-gray-warm">·</span> : null}
                          {c.label.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {note || linkText ? (
                    <div className="mt-auto pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-divider pt-3">
                        {note ? <PriceTag note={note} accent={accent} /> : <span />}
                        {linkText ? (
                          // Site text-link grammar: bold, 2px ix-rule hugging the text, 44px tap area.
                          <CMSLink link={p.link} className="inline-flex min-h-target items-center font-bold text-ink no-underline">
                            <span className="ix-rule">
                              <KeepArrow label={linkText} />
                            </span>
                          </CMSLink>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
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
