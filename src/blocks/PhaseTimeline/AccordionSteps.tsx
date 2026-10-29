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

/**
 * Client island for PhaseTimeline `accordion` (Homepage.dc.html Process + its
 * page JS, MERGED §2.5 / §6). Why client: one-open state, click/keyboard,
 * the mobile scroll-to-open listener and the scroll-entrance observer.
 *
 * Motion model (all timings live in accordion.css):
 * - Desktop (lg+): ONE CSS grid. Every step is a column; phase labels and bars
 *   span their steps' columns, so bars and cards align by construction. The
 *   open/close is a single `grid-template-columns` transition (fr values only;
 *   the sum is constant, so the track never changes width). The open card's
 *   content is laid out at its FINAL width (`--pt-open-w`, from container
 *   units) inside the card's overflow-hidden box, so text never re-wraps while
 *   the column widens; labels are laid out at their phase's all-closed width,
 *   so the label row never changes height.
 * - Regiment: outgoing content fades out first (150 ms), then the columns
 *   resize, then the incoming title and detail fade/slide in, staggered. The
 *   step number is persistent (it glides 8 px between the closed and open
 *   paddings instead of blinking). Vertical and horizontal titles crossfade.
 * - Below lg: vertical stack; the detail row opens with a `grid-template-rows`
 *   0fr → 1fr transition (no height measuring, no `interpolate-size`).
 *   Scroll-nearest opening runs off a rAF-throttled listener and measures in
 *   "all-collapsed" coordinates, so a card opening above the reader can never
 *   feed back into the choice (no flip-flop while scrolling).
 * - Entrance: if the block starts below the fold it is armed hidden (never
 *   visible → hidden, so no flash), then on IntersectionObserver 0.12 the
 *   header rises, the phase rails draw left→right in order, and the cards rise
 *   left→right. Server HTML is the final, visible state with step 01 open.
 * - `prefers-reduced-motion: reduce`: no entrance, no delays, no movement;
 *   scroll-to-open is off (content would shift under the reader).
 */
export function AccordionSteps({ header, groups }: { header: React.ReactNode; groups: TrackGroup[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pinnedAt = useRef<number | null>(null)
  const [open, setOpen] = useState(0)
  const uid = useId()

  const hasPhases = groups.some((g) => g.label)
  const steps = groups.flatMap((g) => g.steps.map((s) => ({ ...s, single: g.steps.length === 1 && Boolean(g.label) })))
  const n = steps.length
  const frSum = (n - 1) * FR_CLOSED + FR_OPEN
  const free = `(100cqw - ${(n - 1) * GAP}px)`

  const trackStyle = {
    '--pt-cols': steps
      .map((s, i) => `minmax(${s.single ? 96 : 56}px, ${i === open ? FR_OPEN : FR_CLOSED}fr)`)
      .join(' '),
    // Open card's inner width (column minus its 2px borders), at the final size.
    '--pt-open-w': `calc(${free} * ${FR_OPEN / frSum} - 4px)`,
  } as React.CSSProperties

  const select = useCallback((i: number) => {
    pinnedAt.current = window.scrollY
    setOpen(i)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const buttons = Array.from(trackRef.current?.querySelectorAll<HTMLButtonElement>('[data-pt-head]') ?? [])
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[event.key]
    if (to === undefined) return
    event.preventDefault()
    buttons[(to + n) % n]?.focus()
  }

  // Mobile scroll-nearest (design onScroll: nearest header to 45% of the viewport).
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const desktop = window.matchMedia('(min-width: 64rem)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (desktop.matches || reduced.matches) return
      if (pinnedAt.current !== null) {
        if (Math.abs(window.scrollY - pinnedAt.current) < window.innerHeight * 0.5) return
        pinnedAt.current = null
      }
      const box = track.getBoundingClientRect()
      if (box.bottom < 0 || box.top > window.innerHeight) return
      const mid = window.innerHeight * 0.45
      let extraAbove = 0
      let best = -1
      let bestDistance = Infinity
      track.querySelectorAll<HTMLElement>('[data-pt-step]').forEach((card, i) => {
        const head = card.querySelector('[data-pt-head]')!.getBoundingClientRect()
        const distance = Math.abs(head.top - extraAbove + head.height / 2 - mid)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
        extraAbove += card.querySelector('[data-pt-panel]')!.getBoundingClientRect().height
      })
      if (best >= 0) setOpen((current) => (current === best ? current : best))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Scroll entrance (site-fx.js armAnim: below 95% of the viewport → hidden,
  // revealed at threshold 0.12). site-fx's 4 s safety reveal is not ported: it
  // plays the entrance off-screen for anyone still reading the hero after 4 s,
  // and its only job (no IntersectionObserver) is covered by not arming at all. Driven by a data attribute
  // outside React's render so the server HTML stays the visible final state.
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
        className="mt-8 flex flex-col gap-2 lg:mt-12 lg:grid lg:grid-cols-(--pt-cols) lg:gap-x-2 lg:gap-y-2.5"
      >
        {groups.map((group, gi) => {
          const start = starts[gi]
          const span = `${start} / ${start + group.steps.length}`
          const k = group.steps.length
          const labelWidth = `max(calc(${free} * ${(k * FR_CLOSED) / frSum} + ${(k - 1) * GAP}px), ${k === 1 ? 96 : 0}px)`
          const groupVars = { '--pt-g': gi, '--pt-span': span, '--pt-label-w': labelWidth } as React.CSSProperties
          return (
            <React.Fragment key={group.key}>
              {group.label ? (
                <>
                  <h3
                    title={group.label}
                    style={groupVars}
                    className={cx(
                      'pt-label text-[10px] font-bold uppercase tracking-[0.1em] [overflow-wrap:anywhere] lg:row-start-1 lg:col-(--pt-span) lg:self-end lg:leading-tight',
                      gi > 0 && 'mt-5 lg:mt-0',
                      group.isLast ? 'text-ground-accent' : 'text-gray-warm',
                    )}
                  >
                    <span className="block lg:w-(--pt-label-w)">{group.label}</span>
                  </h3>
                  <span
                    aria-hidden="true"
                    style={groupVars}
                    className={cx(
                      'pt-bar block h-1.5 lg:row-start-2 lg:col-(--pt-span)',
                      group.isLast ? 'bg-ground-accent' : 'bg-ink',
                    )}
                  />
                </>
              ) : null}
              {group.steps.map((step, si) => {
                const i = start - 1 + si
                const isOpen = i === open
                const headId = `${uid}-h${i}`
                const panelId = `${uid}-p${i}`
                return (
                  <div
                    key={step.key}
                    data-pt-step=""
                    data-open={isOpen ? '' : undefined}
                    style={{ '--pt-i': i, gridColumn: i + 1 } as React.CSSProperties}
                    className={cx(
                      'pt-card relative min-w-0 overflow-hidden border-2 lg:h-70',
                      hasPhases ? 'lg:row-start-3' : 'lg:row-start-1',
                      si === 0 && group.label && 'mt-1 lg:mt-0',
                      isOpen
                        ? 'border-ground-accent bg-cream text-ground-accent'
                        : 'border-ink bg-transparent text-ink hover:bg-cream/50',
                    )}
                  >
                    <button
                      type="button"
                      id={headId}
                      data-pt-head=""
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => (isOpen ? undefined : select(i))}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className={cx(
                        'flex min-h-target w-full items-baseline gap-3.5 px-4 py-3.5 text-left focus-visible:-outline-offset-4',
                        'lg:absolute lg:inset-0 lg:flex-col lg:items-start lg:gap-0 lg:px-3 lg:pt-4.5 lg:pb-4.5',
                        isOpen ? 'cursor-default' : 'cursor-pointer',
                      )}
                    >
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
                    </button>
                    <div
                      id={panelId}
                      data-pt-panel=""
                      inert={!isOpen}
                      className={cx(
                        'pt-panel grid lg:absolute lg:inset-y-0 lg:left-0 lg:block lg:w-(--pt-open-w)',
                        !isOpen && 'lg:pointer-events-none',
                      )}
                    >
                      <div className={cx('min-h-0 overflow-hidden lg:h-full', isOpen && 'lg:overflow-y-auto')}>
                        <span
                          aria-hidden="true"
                          className="pt-htitle hidden px-5 pt-14.5 font-display text-[1.0625rem] leading-[1.15] uppercase lg:block"
                        >
                          {step.title}
                        </span>
                        {step.detail ? (
                          <p
                            data-pt-detail=""
                            className="pt-detail -mt-1 px-4 pb-3.5 whitespace-pre-line text-small text-gray-warm lg:mt-0 lg:px-5 lg:pt-3 lg:pb-4.5"
                          >
                            {step.detail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
