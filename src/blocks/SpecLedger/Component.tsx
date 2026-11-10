import React from 'react'

import type { BlockData } from '@/blocks/types'
import { Caption, DiamondHeading } from '@/components/BrochureParts'
import { AccentHeadline, Container, Eyebrow, Media, Section } from '@/components/ui'
import { CMSLink, resolveLinkHref } from '@/components/ui/CMSLink'
import { cx } from '@/lib/cx'

import { TOOL_LOGOS, type ToolLogo, type ToolLogoDef } from './toolLogos'

export type SpecLedgerData = BlockData<'specLedger'>

type Item = NonNullable<SpecLedgerData['items']>[number]

const CODE = 'font-mono font-bold text-gray-warm'
const DISPLAY = 'font-display font-normal uppercase'
const DETAIL_LABEL = 'text-[11px] font-bold uppercase tracking-[0.1em] text-gray-warm'

const hasText = (v: string | null | undefined): v is string => Boolean(v && v.trim())

/** A framed picture box that keeps its shape when no image is set. */
function Picture({
  image,
  className,
  sizes,
}: {
  image: Item['image']
  className: string
  sizes: string
}) {
  return (
    <div className={cx('relative bg-gray-light', className)}>
      <Media resource={image} fill sizes={sizes} />
    </div>
  )
}

/* ------------------------------ cards ---------------------------------- */

/** p5 §Template anatomy: title + code, picture, one line. 2 x 2 from md. */
type CardTag = 'h2' | 'h3'

function AnatomyCard({ item, Title }: { item: Item; Title: CardTag }) {
  return (
    <div className="border-2 border-ink bg-cream">
      <div className="flex items-baseline justify-between gap-2.5 border-b-2 border-ink px-4 py-3 md:px-5.5 md:py-4.5">
        <Title className={cx(DISPLAY, 'text-[1.0625rem] md:text-[1.375rem]')}>{item.title}</Title>
        {hasText(item.code) ? <span className={cx(CODE, 'text-[10px]')}>{item.code}</span> : null}
      </div>
      <Picture
        image={item.image}
        className="aspect-16/10 border-b-2 border-ink md:aspect-4/3"
        sizes="(min-width: 1200px) 560px, (min-width: 768px) 45vw, 100vw"
      />
      {hasText(item.line) ? (
        <p className="m-0 px-4 py-3 text-[0.9375rem] leading-normal md:px-5.5 md:py-4.5 md:text-base md:leading-[1.6]">
          {item.line}
        </p>
      ) : null}
    </div>
  )
}

/** p6 §Camera work: title + line on top, large picture fills the rest. */
function FeatureCard({ item, Title }: { item: Item; Title: CardTag }) {
  return (
    <div className="grid w-full grid-rows-[auto_1fr] border-2 border-ink">
      <div className="border-b-2 border-ink px-4 py-4.5 md:px-7 md:py-6">
        <Title className={cx(DISPLAY, 'text-[1.125rem] md:text-[1.25rem]')}>{item.title}</Title>
        {hasText(item.line) ? (
          <p className="mt-1.5 text-[0.9375rem] leading-normal md:mt-2 md:leading-[1.55]">{item.line}</p>
        ) : null}
      </div>
      <Picture
        image={item.image}
        className="aspect-4/3 md:aspect-auto md:min-h-75"
        sizes="(min-width: 1200px) 588px, (min-width: 768px) 45vw, 100vw"
      />
    </div>
  )
}

/* ---------------------------- expandable ------------------------------- */

const SUMMARY =
  'flex min-h-target list-none items-baseline gap-2.5 py-3.5 marker:hidden [&::-webkit-details-marker]:hidden cursor-pointer md:grid md:grid-cols-[64px_1fr_1.1fr_32px] md:gap-5 md:py-4.5'

function PlusMark() {
  // Rotates to an "x" while the row is open; the design's glyph is a static "+".
  return (
    <span
      aria-hidden="true"
      className={cx(
        DISPLAY,
        'inline-block text-[1.0625rem] leading-none text-gray-warm transition-transform duration-180 group-open:rotate-45 md:justify-self-end md:text-[1.125rem]',
      )}
    >
      +
    </span>
  )
}

function Detail({ label, text, className }: { label?: string | null; text?: string | null; className?: string }) {
  if (!hasText(text)) return null
  return (
    <div className={className}>
      {hasText(label) ? <span className={cx(DETAIL_LABEL, 'block')}>{label}</span> : null}
      <p className={cx('m-0 whitespace-pre-line text-[0.9375rem] leading-[1.55] md:leading-[1.6]', hasText(label) && 'mt-2')}>{text}</p>
    </div>
  )
}

function ExpandRow({ item, open, last }: { item: Item; open: boolean; last: boolean }) {
  const border = last ? 'border-b-2 border-ink' : 'border-b border-divider'
  const hasBody = hasText(item.what) || hasText(item.proof)
  // On phones the one-liner is not drawn inside an openable row (design), but it must stay readable by AT: visually hidden there, not display:none.
  const lineClass = hasBody ? 'max-md:sr-only md:block text-[0.9375rem]' : 'hidden text-[0.9375rem] md:block'

  const head = (
    <>
      {hasText(item.code) ? (
        <span className={cx(CODE, 'text-[10px] md:text-[12px]')}>{item.code}</span>
      ) : (
        <span aria-hidden="true" className="hidden md:block" />
      )}
      <span className={cx(DISPLAY, 'flex-1 text-[1.0625rem] md:text-[1.375rem]')}>{item.title}</span>
      {hasText(item.line) ? (
        <span className={lineClass}>{item.line}</span>
      ) : (
        <span aria-hidden="true" className="hidden md:block" />
      )}
    </>
  )

  if (!hasBody) {
    // Nothing to open: a plain row (no marker, not focusable).
    return (
      <div className={border}>
        <div className={cx(SUMMARY, 'cursor-default')}>
          {head}
          <span aria-hidden="true" className="hidden md:block" />
        </div>
        {hasText(item.line) ? <p className="m-0 pb-4 text-[0.9375rem] leading-[1.55] md:hidden">{item.line}</p> : null}
      </div>
    )
  }

  return (
    <details className={cx('group', border)} open={open || undefined}>
      <summary className={SUMMARY}>
        {head}
        <PlusMark />
      </summary>
      <div className="pb-4 md:grid md:grid-cols-[64px_1fr_1.1fr_32px] md:gap-5 md:pb-5.5">
        <span aria-hidden="true" className="hidden md:block" />
        <Detail label={item.whatLabel} text={item.what} className="md:col-start-2" />
        <Detail
          label={item.proofLabel}
          text={item.proof}
          className="mt-3 md:col-start-3 md:mt-0"
        />
      </div>
    </details>
  )
}

/* ---------------------------- signal flow ------------------------------ */

function SignalFlow({ items, hub }: { items: Item[]; hub: SpecLedgerData['hub'] }) {
  const n = Math.max(items.length, 1)
  const hubHasText = hub && (hasText(hub.kicker) || hasText(hub.heading) || hasText(hub.body) || hasText(hub.note))
  const showHub = Boolean(hub && (hubHasText || hub.image))

  return (
    <>
      <ul
        className="m-0 mt-4 grid list-none grid-cols-3 gap-2 p-0 md:mt-6 md:gap-3 lg:grid-cols-(--cols)"
        style={{ '--cols': `repeat(${n}, minmax(0, 1fr))` } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <li key={item.id ?? i} className="border-2 border-ink bg-cream px-2.5 py-3 md:px-3.5 md:py-4">
            {hasText(item.code) ? <span className={cx(CODE, 'block text-[10px] md:text-[11px]')}>{item.code}</span> : null}
            <span className={cx(DISPLAY, 'mt-1 block text-[0.9375rem] md:mt-1.5 md:text-[1.0625rem]')}>{item.title}</span>
          </li>
        ))}
      </ul>

      {showHub ? (
        <>
          {/* Connectors: one stub per tile on desktop, a single drop on mobile. */}
          <div aria-hidden="true" className="mx-auto h-5.5 w-0.5 bg-ink lg:hidden" />
          <div
            aria-hidden="true"
            className="hidden h-8 gap-3 lg:grid lg:grid-cols-(--cols)"
            style={{ '--cols': `repeat(${n}, minmax(0, 1fr))` } as React.CSSProperties}
          >
            {items.map((item, i) => (
              <span key={item.id ?? i} className="mx-auto h-full border-l-2 border-ink" />
            ))}
          </div>
          <div aria-hidden="true" className="h-0.5 bg-ink" />
          <div aria-hidden="true" className="mx-auto h-5.5 w-0.5 bg-ink lg:h-7" />

          <div className="border-2 border-ink bg-cream shadow-card lg:grid lg:grid-cols-[1fr_420px]">
            {hubHasText ? (
              <div className="px-4 py-4.5 lg:px-8 lg:py-7">
                {hasText(hub?.kicker) ? (
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm md:text-[11px]">
                    {hub?.kicker}
                  </p>
                ) : null}
                {hasText(hub?.heading) ? (
                  <h2
                    className={cx(
                      DISPLAY,
                      'm-0 mt-2 text-[1.375rem] leading-[1.04] lg:mt-3 lg:text-[2rem] lg:leading-[1.02]',
                    )}
                  >
                    {hub?.heading}
                  </h2>
                ) : null}
                {hasText(hub?.body) ? (
                  <p className="m-0 mt-2.5 whitespace-pre-line text-[0.9375rem] leading-[1.55] lg:mt-3.5 lg:max-w-[44ch] lg:text-base lg:leading-[1.6]">
                    {hub?.body}
                  </p>
                ) : null}
                {hasText(hub?.note) ? (
                  <p className="m-0 mt-3 hidden text-small text-gray-warm lg:block">{hub?.note}</p>
                ) : null}
              </div>
            ) : null}
            <Picture
              image={hub?.image}
              className="aspect-16/11 border-t-2 border-ink lg:aspect-auto lg:min-h-70 lg:border-t-0 lg:border-l-2"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
          </div>
        </>
      ) : null}
    </>
  )
}

/* ------------------------------- list ---------------------------------- */

/** Phosphor "check" (bold), inline; the design uses `ph-bold ph-check`. */
function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-4 shrink-0 translate-y-[0.1em]">
      <path d="M232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183 215.51 63.51a12 12 0 0 1 17 17z" />
    </svg>
  )
}

/**
 * p18 §What's inside (Lead Magnet.dc.html): 820 column on light grey, muted
 * eyebrow, then check bullets (gap 14, 17px desktop / 16px mobile, leading 1.6).
 * Zero items renders nothing at all (a caption over an empty list is noise).
 */
function ListVariant({ props, items }: { props: SpecLedgerData; items: Item[] }) {
  const { eyebrow, heading, accentPhrase, pricingNote } = props
  const grey = !props.tone || props.tone === 'auto' || props.tone === 'grey'
  const Caption = hasText(heading) ? 'p' : 'h2'
  return (
    <Section tone={grey ? 'grey' : 'light'} pad="none" className="py-12 md:py-16">
      <div className="mx-auto max-w-205 px-container-mobile md:px-container">
        {hasText(heading) ? <AccentHeadline text={heading} accent={accentPhrase} level="section" className="mb-5 md:mb-6" /> : null}
        {hasText(eyebrow) ? (
          <Caption className="m-0">
            <Eyebrow muted as="span" tick={Boolean(props.eyebrowTick)}>
              {eyebrow}
            </Eyebrow>
          </Caption>
        ) : null}
        <ul
          className={cx(
            'm-0 flex list-none flex-col gap-3.5 p-0 text-[1rem] leading-[1.6] md:text-[1.0625rem]',
            hasText(eyebrow) && 'mt-5 md:mt-6',
          )}
        >
          {items.map((item, i) => (
            <li key={item.id ?? i} className="flex items-baseline gap-3">
              <CheckIcon />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
        {hasText(pricingNote) ? <p className="m-0 mt-3.5 text-small text-gray-warm">{pricingNote}</p> : null}
      </div>
    </Section>
  )
}

/** The item's logo: an uploaded one wins, else the built-in pick, else none. */
function ToolLogoMark({ item }: { item: Item }) {
  const box = 'relative mx-auto mb-3 block size-10 md:size-12'
  // Decorative: the tool's name is printed right under it.
  if (item.logoImage && typeof item.logoImage === 'object') {
    return (
      <span className={box}>
        <Media resource={item.logoImage} fill sizes="48px" alt="" className="!object-contain" />
      </span>
    )
  }
  const builtIn: ToolLogoDef | undefined = item.logo ? TOOL_LOGOS[item.logo as ToolLogo] : undefined
  if (!builtIn) return null
  if (builtIn.icon) {
    return (
      <span className={cx(box, 'text-ink')}>
        <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="size-full">
          <path d={builtIn.icon} />
        </svg>
      </span>
    )
  }
  return (
    <span className={box}>
      {/* A static file from /public: next/image adds nothing for an SVG this size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={builtIn.src} alt="" width={48} height={48} loading="lazy" className="size-full object-contain" />
    </span>
  )
}

/** Tiles layout mark: a built-in file, a built-in inline icon (ink), or an upload. */
function TileMark({ item, size = 'size-7 md:size-8' }: { item: Item; size?: string }) {
  const box = cx('relative block shrink-0', size)
  if (item.logoImage && typeof item.logoImage === 'object') {
    return (
      <span className={box}>
        <Media resource={item.logoImage} fill sizes="32px" alt="" className="!object-contain" />
      </span>
    )
  }
  const builtIn: ToolLogoDef | undefined = item.logo ? TOOL_LOGOS[item.logo as ToolLogo] : undefined
  if (!builtIn) return null
  if (builtIn.icon) {
    return (
      <span className={cx(box, 'text-ink')}>
        <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="size-full">
          <path d={builtIn.icon} />
        </svg>
      </span>
    )
  }
  return (
    <span className={box}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={builtIn.src} alt="" width={32} height={32} loading="lazy" className="size-full object-contain" />
    </span>
  )
}

function ToolsTiles({ props, items }: { props: SpecLedgerData; items: Item[] }) {
  const { heading, note, footnote } = props
  return (
    <Section tone={props.tone === 'grey' ? 'grey' : 'light'} pad="none" className="pb-16 md:pb-24">
      <Container>
        <div className="border-t border-divider pt-6">
          {hasText(heading) ? <Caption className="mb-4">{heading}</Caption> : null}
          {hasText(note) ? <p className="-mt-2 mb-4 text-small text-gray-warm">{note}</p> : null}
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] md:gap-3">
            {items.map((item, i) => (
              <li
                key={item.id ?? i}
                className="flex min-h-target flex-col items-start gap-2.5 border border-divider bg-cream p-3.5 md:min-h-16 md:flex-row md:items-center md:gap-3.5 md:px-4 md:py-3"
              >
                <TileMark item={item} />
                <div>
                  <div className="text-[0.9375rem] font-bold leading-tight">{item.title}</div>
                  {hasText(item.line) ? <div className="mt-0.5 text-[0.8125rem] leading-[1.35] text-gray-warm">{item.line}</div> : null}
                </div>
              </li>
            ))}
          </ul>
          {hasText(footnote) ? <p className="m-0 mt-4 text-[0.8125rem] leading-[1.5] text-gray-warm">{footnote}</p> : null}
        </div>
      </Container>
    </Section>
  )
}

/** Phosphor Bold "arrow-right" (256 viewBox, square caps), drawn inside a 2px white square outline. */
function ArrowIcon() {
  return (
    <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center border-2 border-cream">
      <svg width="22" height="22" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M40 128h168M144 64l64 64-64 64" />
      </svg>
    </span>
  )
}

/**
 * `tools` layout `grid` (home B 2026-11-09 "The toolkit"): eyebrow + big
 * headline (accent wine) with the note as lede, a hairline grid (1px gaps on
 * the divider colour; tiles are not cards): 2 columns on phones with no tags,
 * 4 from md. The last cell is an ink link tile.
 */
function ToolsGrid({ props, items }: { props: SpecLedgerData; items: Item[] }) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, note, footnote, linkTile } = props
  const tileHref = resolveLinkHref(linkTile?.link)
  const tileLabel = linkTile?.link?.label?.trim()
  const short = linkTile?.shortLabel?.trim()
  return (
    <Section tone={props.tone === 'grey' ? 'grey' : 'light'} pad="none" className="border-t border-divider py-14 md:py-18">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="md:min-w-0 md:flex-1">
            {hasText(eyebrow) ? (
              <Eyebrow tick={eyebrowTick === true} muted>
                {eyebrow}
              </Eyebrow>
            ) : null}
            {hasText(heading) ? (
              <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(hasText(eyebrow) && 'mt-4')} />
            ) : null}
          </div>
          {hasText(note) ? <p className="m-0 text-body-mobile text-gray-warm md:w-88 md:shrink-0 md:text-body">{note}</p> : null}
        </div>
        <ul className="m-0 mt-6 grid list-none grid-cols-2 gap-px border border-divider bg-divider p-0 md:mt-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.id ?? i} className="flex min-h-12 items-center gap-2.5 bg-cream p-3.5 md:gap-3.5 md:px-5 md:py-4.5">
              <TileMark item={item} size="size-6 md:size-7" />
              <span className="min-w-0 flex-1">
                <strong className="block text-[0.875rem] leading-tight md:text-[0.9375rem]">{item.title}</strong>
                {hasText(item.line) ? <span className="block text-[0.75rem] leading-[1.35] text-gray-warm md:text-[0.8125rem]">{item.line}</span> : null}
              </span>
              {item.tag === 'build' || item.tag === 'grow' ? (
                <span
                  className={cx(
                    'max-lg:hidden text-[0.625rem] font-bold uppercase tracking-[0.12em]',
                    item.tag === 'grow' ? 'text-ground-accent' : 'text-gray-warm',
                  )}
                >
                  {item.tag}
                </span>
              ) : null}
            </li>
          ))}
          {tileHref && tileLabel ? (
            <li className="flex min-h-12 bg-ink text-cream">
              <CMSLink
                link={linkTile?.link}
                aria-label={tileLabel}
                className="flex h-full min-h-12 w-full items-center justify-between gap-3 p-3.5 text-cream no-underline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream md:px-5 md:py-4.5"
              >
                <span className="font-display text-[0.8125rem] uppercase leading-[1.2] md:text-[0.9375rem]">
                  {short ? (
                    <>
                      <span className="md:hidden">{short}</span>
                      <span className="max-md:hidden">{tileLabel}</span>
                    </>
                  ) : (
                    tileLabel
                  )}
                </span>
                <ArrowIcon />
              </CMSLink>
            </li>
          ) : null}
        </ul>
        {hasText(footnote) ? <p className="m-0 mt-4 text-[0.75rem] leading-[1.5] text-gray-warm md:mt-6">{footnote}</p> : null}
      </Container>
    </Section>
  )
}

/** Runs of items under one `groupLabel`; an empty label continues the group above. */
function groupCatalog(items: Item[]): { label: string; items: Item[] }[] {
  const groups: { label: string; items: Item[] }[] = []
  for (const item of items) {
    const label = item.groupLabel?.trim() ?? ''
    const last = groups[groups.length - 1]
    if (last && (!label || label === last.label)) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

/**
 * `tools` layout `catalog` (service pages 2026-11-09 "The toolkit"): the grid's head (eyebrow, wine
 * accent headline, note beside it), then one hairline grid of tool cards per `groupLabel`. Cards are
 * cream with a 1px divider border; neighbours overlap by 1px so each shared edge is one hairline and
 * a short last row leaves no grey track behind it.
 */
function ToolsCatalog({ props, items }: { props: SpecLedgerData; items: Item[] }) {
  const { eyebrow, eyebrowTick, heading, accentPhrase, note, footnote, anchorId } = props
  const groups = groupCatalog(items)
  return (
    <Section
      tone={props.tone === 'grey' ? 'grey' : 'light'}
      pad="none"
      id={hasText(anchorId) ? anchorId : undefined}
      className={cx('border-t border-divider py-14 md:py-24', hasText(anchorId) && 'scroll-mt-31 md:scroll-mt-34')}
    >
      <Container>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
          <div className="min-w-0">
            {hasText(eyebrow) ? (
              <Eyebrow tick={eyebrowTick === true} className="text-ink">
                {eyebrow}
              </Eyebrow>
            ) : null}
            {hasText(heading) ? (
              <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level={2} as="h2" className={cx(hasText(eyebrow) && 'mt-4')} />
            ) : null}
          </div>
          {hasText(note) ? <p className="m-0 text-body-mobile text-gray-warm md:text-body">{note}</p> : null}
        </div>
        {groups.map((g, gi) => (
          <div key={gi} className={gi === 0 ? 'mt-10 md:mt-14' : 'mt-10'}>
            {hasText(g.label) ? <h3 className="m-0 mb-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-gray-warm">{g.label}</h3> : null}
            <ul className="m-0 grid list-none grid-cols-1 p-0 pb-px pr-px sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
              {g.items.map((item, i) => (
                <li key={item.id ?? i} className="-mb-px -mr-px flex flex-col items-start gap-2.5 border border-divider bg-cream p-5 md:p-6">
                  <TileMark item={item} size="size-7" />
                  <strong className="text-[0.9375rem] font-bold leading-tight md:text-[1rem]">{item.title}</strong>
                  {hasText(item.line) ? <span className="text-[0.875rem] leading-[1.5] text-gray-warm">{item.line}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {hasText(footnote) ? <p className="m-0 mt-4 text-[0.8125rem] leading-[1.5] text-gray-warm">{footnote}</p> : null}
      </Container>
    </Section>
  )
}

/**
 * `tools` (brochure 2026-11-07 p4 "Preferred tools"): diamond heading, one
 * line under it, then a ruled row of tools, each a logo (built-in pick or an
 * upload, in brand colours) over its name, then the trademark footnote.
 * `line` is an optional second line of the name, e.g. "Shop".
 */
function ToolsVariant({ props, items }: { props: SpecLedgerData; items: Item[] }) {
  const { heading, note, footnote } = props
  return (
    // Bottom pad trimmed (owner QA 2026-11-08): the ruled tools row, not the quiet footnote, reads as the
    // section end, so rule -> next section content lands on one section boundary (64 + 64 at md+).
    <Section tone={props.tone === 'grey' ? 'grey' : 'light'} pad="none" className="pb-3 md:pb-8">
      <Container>
        {hasText(heading) ? <DiamondHeading>{heading}</DiamondHeading> : null}
        {hasText(note) ? <p className="mt-2 text-body-mobile text-gray-warm md:text-body">{note}</p> : null}
        <ul className="mt-5 grid list-none grid-cols-2 gap-x-4 gap-y-6 border-y border-divider p-0 py-6 text-center sm:grid-cols-4 md:py-7 lg:grid-cols-7">
          {items.map((item, i) => (
            <li key={item.id ?? i} className="font-display text-[1rem] leading-tight md:text-[1.0625rem]">
              <ToolLogoMark item={item} />
              {item.title}
              {hasText(item.line) ? <span className="block">{item.line}</span> : null}
            </li>
          ))}
        </ul>
        {hasText(footnote) ? <p className="m-0 mt-3 text-[0.8125rem] leading-[1.5] text-gray-warm">{footnote}</p> : null}
      </Container>
    </Section>
  )
}

/* ------------------------------ block ---------------------------------- */

/**
 * SpecLedger (SCHEMA §8.3 item 14; p5 + p6). Server component: the expandable
 * rows are native <details>/<summary> (server-rendered so the copy is
 * crawlable, keyboard operable, several rows may be open at once), so no
 * client JS is needed.
 */
export function SpecLedgerBlock(props: SpecLedgerData) {
  const { variant, eyebrow, eyebrowTick, heading, accentPhrase, note, firstOpen, hub, pricingNote } = props
  const layout = props.cardLayout ?? 'anatomy'
  const items = (props.items ?? []).filter((it) => hasText(it?.title))

  if (variant !== 'cards' && variant !== 'expandable' && variant !== 'signal-flow' && variant !== 'list' && variant !== 'tools') {
    console.error(`[SpecLedger] unknown variant "${String(variant)}"; rendering nothing.`)
    return null
  }
  if (variant === 'list') return items.length === 0 ? null : <ListVariant props={props} items={items} />
  if (variant === 'tools' && props.toolsLayout === 'catalog') return items.length === 0 ? null : <ToolsCatalog props={props} items={items} />
  if (variant === 'tools') return items.length === 0 ? null : props.toolsLayout === 'grid' ? <ToolsGrid props={props} items={items} /> : props.toolsLayout === 'tiles' ? <ToolsTiles props={props} items={items} /> : <ToolsVariant props={props} items={items} />
  if (items.length === 0 && !hasText(heading) && !hasText(eyebrow)) return null

  const defaultTone = variant === 'expandable' || (variant === 'cards' && layout === 'feature') ? 'light' : 'grey'
  const tone = props.tone && props.tone !== 'auto' ? props.tone : defaultTone
  const grey = tone === 'grey'
  const isAnatomy = variant === 'cards' && layout === 'anatomy'
  const hubHeading = variant === 'signal-flow' && hasText(hub?.heading)

  // The caption is the section's h2 unless a headline (or the hub headline) already is.
  const CaptionTag = hasText(heading) || hubHeading ? 'p' : 'h2'
  // Card titles are h3 only when an h2 (headline or caption) precedes them; otherwise they are the section's h2.
  const cardTitleTag: CardTag = hasText(heading) || hasText(eyebrow) ? 'h3' : 'h2'
  const caption = hasText(eyebrow) ? (
    <CaptionTag
      className={cx(
        'm-0 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-warm md:gap-2.25 md:text-[11px]',
      )}
    >
      {eyebrowTick ? <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-gold-pale md:size-2.25" /> : null}
      {eyebrow}
    </CaptionTag>
  ) : null

  const pad = variant === 'signal-flow' ? 'py-7 md:pt-12 md:pb-11' : 'py-6.5 md:py-11'
  const sectionClass = cx(
    pad,
    grey && 'border-b-2 border-ink',
    isAnatomy && grey && 'border-t-2 md:border-t-0',
  )

  const openFirst = firstOpen !== false

  return (
    <Section tone={grey ? 'grey' : 'light'} pad="none" className={sectionClass}>
      <Container>
        {hasText(heading) ? (
          <AccentHeadline text={heading} accent={accentPhrase} level="section" className="mb-5 md:mb-6" />
        ) : null}

        {variant === 'cards' && layout === 'anatomy' ? (
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            {caption}
            {hasText(note) ? <p className="m-0 hidden text-[0.9375rem] text-gray-warm md:block">{note}</p> : null}
          </div>
        ) : (
          caption
        )}

        {variant === 'cards' ? (
          items.length > 0 ? (
            <ul
              className={cx(
                'm-0 grid list-none grid-cols-1 p-0',
                caption && 'mt-4 md:mt-8',
                layout === 'anatomy' ? 'gap-3.5 md:grid-cols-2 md:gap-6' : 'gap-4 md:grid-cols-2 md:gap-5',
              )}
            >
              {items.map((item, i) => (
                <li key={item.id ?? i} className={cx('m-0 min-w-0', layout !== 'anatomy' && 'flex')}>
                  {layout === 'anatomy' ? <AnatomyCard item={item} Title={cardTitleTag} /> : <FeatureCard item={item} Title={cardTitleTag} />}
                </li>
              ))}
            </ul>
          ) : null
        ) : null}

        {variant === 'expandable' ? (
          <div className={cx('flex flex-col border-t-2 border-ink', caption ? 'mt-3.5 md:mt-4.5' : '')}>
            {items.map((item, i) => (
              <ExpandRow key={item.id ?? i} item={item} open={openFirst && i === 0} last={i === items.length - 1} />
            ))}
          </div>
        ) : null}

        {variant === 'signal-flow' ? (
          <div className={caption ? 'mt-0' : ''}>
            <SignalFlow items={items} hub={hub} />
          </div>
        ) : null}

        {variant === 'cards' && layout === 'anatomy' && hasText(note) ? (
          <p className="m-0 mt-3.5 text-small text-gray-warm md:hidden">{note}</p>
        ) : null}
        {hasText(pricingNote) ? <p className="m-0 mt-3.5 text-small text-gray-warm">{pricingNote}</p> : null}
      </Container>
    </Section>
  )
}
