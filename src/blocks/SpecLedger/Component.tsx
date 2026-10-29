import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, Container, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

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

  if (variant !== 'cards' && variant !== 'expandable' && variant !== 'signal-flow' && variant !== 'list') {
    console.error(`[SpecLedger] unknown variant "${String(variant)}"; rendering nothing.`)
    return null
  }
  if (variant === 'list') return items.length === 0 ? null : <ListVariant props={props} items={items} />
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
