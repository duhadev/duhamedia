import React, { useId } from 'react'

import { Container, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { Headline, titledSteps, type PhaseTimelineProps } from './shared'
import { SwipeTrack } from './SwipeTrack'

/**
 * Per-variant classes. The desktop layout starts at `lg` (1024px) for
 * `build-run` and at `xl` (1280px) for `engine-rollout`: six columns of
 * 1.0625rem titles do not fit below ~1180px ("FOUNDATIONS", "INDEPENDENCE"
 * clip at 1024), so the swipe row runs until `xl`. Literal strings so
 * Tailwind sees every class. Hairlines: the design's rgba(250,247,242,.25)
 * on ink, no token.
 */
const CLASSES = {
  'build-run': {
    section: 'lg:py-11',
    header: 'lg:flex lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-8',
    eyebrow: 'lg:gap-2.25 lg:text-[11px]',
    eyebrowDiamond: 'lg:size-2.25',
    headline: 'lg:leading-normal',
    headlineAfterEyebrow: 'lg:mt-0',
    mobileOnly: 'lg:hidden',
    container: 'max-lg:px-0!',
    scroller: 'lg:overflow-visible',
    row: 'lg:mt-8 lg:w-auto lg:min-w-0 lg:grid lg:grid-cols-3 lg:gap-px lg:border-t-2 lg:border-cream lg:bg-[rgba(250,247,242,.25)] lg:px-0',
    cell: 'lg:w-auto lg:min-w-0 lg:border-0 lg:bg-ink lg:px-7 lg:py-8',
    number: 'lg:font-mono lg:text-[13px] lg:leading-normal lg:font-bold lg:opacity-60',
    title: 'lg:mt-2.5 lg:text-[1.75rem] lg:leading-[1.05]',
    tag: 'hidden lg:mt-2.5 lg:block lg:text-body-mobile',
    filler: 'hidden lg:block lg:bg-ink',
    closing: 'lg:mt-6 lg:text-body-mobile',
  },
  'engine-rollout': {
    section: 'xl:py-11',
    header: 'xl:flex xl:flex-wrap xl:items-baseline xl:justify-between xl:gap-8',
    eyebrow: 'xl:gap-2.25 xl:text-[11px]',
    eyebrowDiamond: 'xl:size-2.25',
    headline: 'xl:leading-normal',
    headlineAfterEyebrow: 'xl:mt-0',
    mobileOnly: 'xl:hidden',
    container: 'max-xl:px-0!',
    scroller: 'xl:overflow-visible',
    row: 'xl:mt-6 xl:w-auto xl:min-w-0 xl:gap-0 xl:border-t-2 xl:border-cream xl:px-0',
    cell: 'xl:w-auto xl:min-w-0 xl:flex-1 xl:border-0 xl:border-r xl:border-[rgba(250,247,242,.25)] xl:px-4.5 xl:py-5 xl:last:border-r-0',
    number: 'xl:font-mono xl:text-[11px] xl:leading-normal xl:font-bold xl:opacity-60',
    title: 'xl:mt-1.5 xl:text-[1.0625rem]',
    tag: 'hidden xl:mt-1.5 xl:block xl:text-[0.8125rem]',
    filler: 'hidden',
    closing: 'xl:mt-4 xl:text-small',
  },
} as const

function Diamond({ className }: { className: string }) {
  return <span aria-hidden="true" className={cx('shrink-0 rotate-45 bg-gold-pale', className)} />
}

/**
 * PhaseTimeline `build-run` (Shopify Theme Development.dc.html "Build run")
 * and `engine-rollout` (Marketing.dc.html "Engine rollout"), desktop + mobile
 * builds. One ink band: eyebrow with a yellow diamond, headline, the steps,
 * a quiet closing line. The undetermined "Build Run Mobile Concepts" sheet is
 * not used, per the dispatch.
 *
 * Phones and tablets: a horizontal swipe row of bordered cards (big numeral,
 * title, the step's `detail`; a sign-off step shows its tag with a diamond
 * instead) with progress bars underneath. Desktop: `build-run` (from `lg`) =
 * a 3-column grid of cells split by hairlines; `engine-rollout` (from `xl`)
 * = one row of columns; each cell shows the short `tag`. See CLASSES for why
 * the breakpoints differ.
 *
 * Server component; the `SwipeTrack` island only lights the progress bar for
 * the scroll position and makes the row keyboard-scrollable while it
 * overflows.
 *
 * Every step renders at the same full weight, the last (the independence
 * handover, "06 Independence — Phase 03") included; no field reduces it.
 */
export function StepRun({ variant, eyebrow, eyebrowTick, heading, accentPhrase, steps, closingLine, swipeHint }: PhaseTimelineProps) {
  const isBuild = variant === 'build-run'
  const c = CLASSES[isBuild ? 'build-run' : 'engine-rollout']
  const rows = titledSteps(steps, variant)
  const headingId = useId()
  // build-run: fill the last grid row so the hairline background never shows
  // through an empty cell.
  const fillers = isBuild ? (3 - (rows.length % 3)) % 3 : 0

  return (
    <Section tone="dark" pad="none" className={cx('border-t-2 border-ink pt-7 pb-6.5', c.section)}>
      <Container>
        <div className={c.header}>
          {eyebrow ? (
            <p className={cx('flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase opacity-70', c.eyebrow)}>
              {eyebrowTick ? <Diamond className={cx('size-2', c.eyebrowDiamond)} /> : null}
              {eyebrow}
            </p>
          ) : null}
          <Headline
            id={headingId}
            text={heading}
            accent={accentPhrase}
            className={cx('text-[1.5rem] leading-[1.06]', c.headline, eyebrow && cx('mt-2.5', c.headlineAfterEyebrow))}
          />
        </div>
        {rows.length > 1 ? (
          // UI hint, not content (flagged): hidden from assistive tech.
          <p aria-hidden="true" className={cx('mt-2 text-small opacity-60', c.mobileOnly)}>
            {swipeHint?.trim() || 'Swipe →'}
          </p>
        ) : null}
      </Container>

      {rows.length ? (
        <SwipeTrack count={rows.length} labelledBy={headingId} barsClassName={c.mobileOnly}>
          <Container className={c.container}>
            {/* The scroller (not the list) carries the focusable region role, so the <ol> stays a list. */}
            <div data-swipe-row className={cx('overflow-x-auto [scrollbar-width:none]', c.scroller)}>
            <ol
              className={cx(
                'mt-4.5 flex w-max min-w-full gap-3 px-container-mobile md:px-container',
                c.row,
              )}
            >
              {rows.map((step, i) => {
                const detail = step.detail?.trim()
                const tag = step.tag?.trim()
                const signOff = isBuild && step.isSignOff === true && Boolean(tag)
                return (
                  <li key={step.id ?? i} className={cx('w-min min-w-50 flex-none border-2 border-cream px-4 py-4.5', c.cell)}>
                    {step.number?.trim() ? (
                      <span className={cx('block font-display text-[2.5rem] leading-[.85] opacity-40', c.number)}>
                        {step.number.trim()}
                      </span>
                    ) : null}
                    <h3 className={cx('mt-3 font-display text-[1.25rem] font-normal uppercase', c.title)}>
                      {step.title.trim()}
                    </h3>
                    {/* Phones: the sentence (or the sign-off tag with a diamond). */}
                    {signOff ? (
                      <p className={cx('mt-1.5 flex items-center gap-1.5 text-[0.9375rem] opacity-75', c.mobileOnly)}>
                        <Diamond className="size-2" />
                        {tag}
                      </p>
                    ) : detail || tag ? (
                      <p className={cx('mt-1.5 whitespace-pre-line text-[0.9375rem] opacity-75', c.mobileOnly)}>{detail || tag}</p>
                    ) : null}
                    {/* Desktop: the short tag (falls back to the sentence). */}
                    {tag || detail ? <p className={cx('whitespace-pre-line opacity-65', c.tag)}>{tag || detail}</p> : null}
                  </li>
                )
              })}
              {Array.from({ length: fillers }, (_, i) => (
                <li key={`filler-${i}`} aria-hidden="true" className={c.filler} />
              ))}
            </ol>
            </div>
          </Container>
        </SwipeTrack>
      ) : null}

      {closingLine?.trim() ? (
        <Container>
          <p className={cx('mt-4.5 text-small opacity-60', c.closing)}>{closingLine.trim()}</p>
        </Container>
      ) : null}
    </Section>
  )
}
