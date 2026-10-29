'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'

import './accordion.css'

export type TrackStep = { key: string; number: string; title: string; detail: string }
export type TrackGroup = { key: string; label: string; isLast: boolean; steps: TrackStep[] }

/** Grow factors (design paintProcess() 0.8 / 3.6, scaled ×1.25: same ratio). */
const FR_CLOSED = 1
const FR_OPEN = 4.5
const GAP = 8 // px, column gap (gap-2)
const DESKTOP = '(min-width: 64rem)'

/**
 * Client island for PhaseTimeline `accordion` (Homepage.dc.html Process + its
 * page JS, MERGED §2.5 / §6). Why client: the desktop one-open state,
 * click/keyboard, the desktop/mobile semantics switch, the Firefox fallback
 * observer and the scroll-entrance observer.
 *
 * Desktop (lg+), unchanged since the 2026-10-29 motion rework: ONE CSS grid,
 * every step a column; the open/close is a single `grid-template-columns`
 * transition with a fade-out → resize → fade-in regiment (accordion.css).
 * Phase wrappers are `display: contents` there, so labels, bars and cards are
 * still direct grid items.
 *
 * Below lg (rework 2026-10-29, "reading rail"): NOTHING opens or closes, so
 * the document never changes height while the reader scrolls. Every step is
 * open; each phase's label + rail is sticky under the site header while its
 * steps pass, the rail fills with reading progress (ink, ink, then wine), and
 * the card crossing the reading line lights (cream fill, wine frame) and
 * dims as it leaves. The terminal step lights and STAYS lit (independence at
 * full weight; also its static state). Driven by CSS scroll-driven
 * animations (compositor-friendly, no JS on scroll); where unsupported
 * (Firefox), an IntersectionObserver on a reading line toggles `data-lit`.
 * Reduced motion: static, fully open, no sticky, rails full.
 *
 * Server HTML is the readable final state at every width (all steps open on
 * mobile; step 01 open on desktop).
 */
export function AccordionSteps({ header, groups }: { header: React.ReactNode; groups: TrackGroup[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(0)
  const [desktop, setDesktop] = useState(false)
  const uid = useId()

  const hasPhases = groups.some((g) => g.label)
  const steps = groups.flatMap((g) => g.steps.map((s) => ({ ...s, single: g.steps.length === 1 && Boolean(g.label) })))
  const n = steps.length
  const frSum = (n - 1) * FR_CLOSED + FR_OPEN
  const free = `(100cqw - ${(n - 1) * GAP}px)`
  const lastGroup = groups[groups.length - 1]
  const terminal = lastGroup?.isLast ? n - 1 : -1

  const trackStyle = {
    '--pt-cols': steps
      .map((s, i) => `minmax(${s.single ? 96 : 56}px, ${i === open ? FR_OPEN : FR_CLOSED}fr)`)
      .join(' '),
    // Open card's inner width (column minus its 2px borders), at the final size.
    '--pt-open-w': `calc(${free} * ${FR_OPEN / frSum} - 4px)`,
  } as React.CSSProperties

  // Accordion semantics (buttons, aria-expanded, inert closed panels) exist
  // only where the accordion does. Starts false so server HTML = mobile =
  // everything readable; desktop upgrades after hydration with no visual change.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const select = useCallback((i: number) => setOpen(i), [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, i: number) => {
    const buttons = Array.from(trackRef.current?.querySelectorAll<HTMLButtonElement>('button[data-pt-head]') ?? [])
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[event.key]
    if (to === undefined) return
    event.preventDefault()
    buttons[(to + n) % n]?.focus()
  }

  // Mobile fallback where CSS scroll-driven animations are unsupported
  // (Firefox stable, Safari < 26): light the card on the reading line. One
  // observer, no scroll listener, no layout reads.
  useEffect(() => {
    const track = trackRef.current
    if (!track || CSS.supports('animation-timeline: view()') || !('IntersectionObserver' in window)) return
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-pt-step]'))
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.setAttribute('data-lit', '')
          else if (!e.target.hasAttribute('data-pt-terminal')) e.target.removeAttribute('data-lit')
        }),
      { rootMargin: '-51% 0px -47% 0px' }, // the CSS reading line (accordion.css --pt-line)
    )
    cards.forEach((c) => io.observe(c))
    return () => {
      io.disconnect()
      cards.forEach((c) => c.hasAttribute('data-pt-terminal') || c.removeAttribute('data-lit'))
    }
  }, [n])

  // Scroll entrance (site-fx.js armAnim: below 95% of the viewport → hidden,
  // revealed at threshold 0.12). Desktop: header, rails and cards; mobile: the
  // header only (cards and rails are scroll-linked there). site-fx's 4 s
  // safety reveal is not ported: it plays the entrance off-screen for anyone
  // still reading the hero after 4 s, and its only job (no
  // IntersectionObserver) is covered by not arming at all. Driven by a data
  // attribute outside React's render so the server HTML stays the visible
  // final state.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (root.getBoundingClientRect().top < window.innerHeight * 0.95) return
    root.dataset.ptEnter = 'armed'
    let doneTimer = 0
    const reveal = () => {
      if (root.dataset.ptEnter !== 'armed') return
      io.disconnect()
      void root.offsetHeight // commit the hidden state before transitions switch on
      root.dataset.ptEnter = 'in'
      doneTimer = window.setTimeout(() => (root.dataset.ptEnter = 'done'), 1100 + n * 60)
    }
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && reveal(), { threshold: 0.12 })
    io.observe(root)
    return () => {
      io.disconnect()
      window.clearTimeout(doneTimer)
      delete root.dataset.ptEnter
    }
  }, [n])

  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.steps.length, 0) + 1)

  return (
    <div ref={rootRef} data-pt-accordion="">
      <div data-pt-rise="">{header}</div>
      <div
        ref={trackRef}
        data-pt-track=""
        style={trackStyle}
        className="mt-8 flex flex-col lg:mt-12 lg:grid lg:grid-cols-(--pt-cols) lg:gap-x-2 lg:gap-y-2.5"
      >
        {groups.map((group, gi) => {
          const start = starts[gi]
          const span = `${start} / ${start + group.steps.length}`
          const k = group.steps.length
          const labelWidth = `max(calc(${free} * ${(k * FR_CLOSED) / frSum} + ${(k - 1) * GAP}px), ${k === 1 ? 96 : 0}px)`
          const groupVars = { '--pt-g': gi, '--pt-span': span, '--pt-label-w': labelWidth } as React.CSSProperties
          return (
            <div key={group.key} data-pt-group="" className={cx('pt-group flex flex-col lg:contents', gi > 0 && 'mt-7')}>
              {group.label ? (
                <div className="pt-phead flex flex-col gap-2 bg-gray-light lg:contents">
                  <h3
                    title={group.label}
                    style={groupVars}
                    className={cx(
                      'pt-label text-[10px] font-bold uppercase tracking-[0.1em] [overflow-wrap:anywhere] lg:row-start-1 lg:col-(--pt-span) lg:self-end lg:leading-tight',
                      group.isLast ? 'text-ground-accent' : 'text-gray-warm',
                    )}
                  >
                    <span className="block lg:w-(--pt-label-w)">{group.label}</span>
                  </h3>
                  <span
                    aria-hidden="true"
                    style={groupVars}
                    className="pt-bar relative block h-1.5 lg:row-start-2 lg:col-(--pt-span)"
                  >
                    <span className={cx('pt-fill absolute inset-0', group.isLast ? 'bg-ground-accent' : 'bg-ink')} />
                  </span>
                </div>
              ) : null}
              <div className={cx('flex flex-col gap-2 lg:contents', group.label && 'mt-3')}>
                {group.steps.map((step, si) => {
                  const i = start - 1 + si
                  const isOpen = i === open
                  const isTerminal = i === terminal
                  const headId = `${uid}-h${i}`
                  const panelId = `${uid}-p${i}`
                  const headClass = cx(
                    'relative flex min-h-target w-full items-baseline gap-3.5 px-4 pt-3.5 pb-2.5 text-left focus-visible:-outline-offset-4',
                    'lg:absolute lg:inset-0 lg:flex-col lg:items-start lg:gap-0 lg:px-3 lg:pt-4.5 lg:pb-4.5',
                    isOpen ? 'lg:cursor-default' : 'lg:cursor-pointer',
                  )
                  const headInner = (
                    <>
                      {step.number ? (
                        <span className="pt-num font-display text-h3-mobile leading-none lg:text-h3 lg:leading-none">
                          {step.number}
                        </span>
                      ) : null}
                      <span className="font-display text-[1.0625rem] leading-none uppercase lg:sr-only">{step.title}</span>
                      <span
                        aria-hidden="true"
                        className="pt-vtitle hidden font-display text-[1.0625rem] leading-none whitespace-nowrap uppercase lg:mt-6 lg:block lg:[writing-mode:vertical-rl]"
                      >
                        {step.title}
                      </span>
                    </>
                  )
                  return (
                    <div
                      key={step.key}
                      data-pt-step=""
                      data-open={isOpen ? '' : undefined}
                      data-pt-terminal={isTerminal ? '' : undefined}
                      data-lit={isTerminal ? '' : undefined}
                      style={{ '--pt-i': i, gridColumn: i + 1 } as React.CSSProperties}
                      className={cx(
                        'pt-card relative min-w-0 overflow-hidden border-2 border-ink text-ink lg:h-70',
                        hasPhases ? 'lg:row-start-3' : 'lg:row-start-1',
                        isOpen
                          ? 'lg:border-ground-accent lg:bg-cream lg:text-ground-accent'
                          : 'lg:border-ink lg:bg-transparent lg:text-ink lg:hover:bg-cream/50',
                      )}
                    >
                      <span aria-hidden="true" className="pt-lit absolute inset-0 bg-cream lg:hidden" />
                      {desktop ? (
                        <button
                          type="button"
                          id={headId}
                          data-pt-head=""
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => (isOpen ? undefined : select(i))}
                          onKeyDown={(e) => onKeyDown(e, i)}
                          className={headClass}
                        >
                          {headInner}
                        </button>
                      ) : (
                        <div id={headId} data-pt-head="" className={headClass}>
                          {headInner}
                        </div>
                      )}
                      <div
                        id={panelId}
                        data-pt-panel=""
                        inert={desktop && !isOpen}
                        className={cx(
                          'pt-panel relative lg:absolute lg:inset-y-0 lg:left-0 lg:block lg:w-(--pt-open-w)',
                          !isOpen && 'lg:pointer-events-none',
                        )}
                      >
                        <div className={cx('lg:h-full lg:overflow-hidden', isOpen && 'lg:overflow-y-auto')}>
                          <span
                            aria-hidden="true"
                            className="pt-htitle hidden px-5 pt-14.5 font-display text-[1.0625rem] leading-[1.15] uppercase lg:block"
                          >
                            {step.title}
                          </span>
                          {step.detail ? (
                            <p
                              data-pt-detail=""
                              className="pt-detail px-4 pb-3.5 whitespace-pre-line text-small text-gray-warm lg:mt-0 lg:px-5 lg:pt-3 lg:pb-4.5"
                            >
                              {step.detail}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
