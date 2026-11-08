'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const noSubscribe = () => () => {}

import { cx } from '@/lib/cx'

/** Bubbled by BookingLaunchLink when the visitor opens the booking calendar. */
export const BOOKING_OPENED_EVENT = 'booking:opened'
/** Bubbled by PayloadForm on its <form> after a successful submit (src/components/forms/PayloadForm.tsx). */
const CMSFORM_SUBMITTED_EVENT = 'cmsform:submitted'

export type FlowStep = {
  /** `book`: advances with the "booked" button; `form`: advances when `formId` is sent; `end`: terminal. */
  kind: 'book' | 'form' | 'end'
  label: string
  node: React.ReactNode
  /** Rendered after the step's own controls (step 1: the quick-question line under the "booked" button). */
  after?: React.ReactNode
  formId?: number
}

/**
 * Client island for BookingEmbed's stepped flow (p9 owner brief 2026-11-08).
 * Why client: the widget swaps steps on the visitor's actions (opening the
 * calendar, sending the homework), which the server never sees.
 *
 * - Server HTML (and no-JS): step 1 only, fully working (the booking link is a
 *   plain new-tab anchor). The "booked" and "back" buttons render only after
 *   hydration, so a no-JS visitor never meets a dead button.
 * - Step 1 → 2: the "booked" button. It appears once the calendar has been
 *   opened from this tab (`booking:opened`), or at once beside an embedded
 *   calendar (`embedded`). Nothing claims the booking is confirmed: the site
 *   has no callback from the booking page.
 * - Step 2 → 3: the homework form's own success signal (`cmsform:submitted`).
 * - Back: step 2 has a Back button to step 1; after sending, no way back (the
 *   form is done). A step stays mounted once visited, so going back and forth
 *   keeps what was typed.
 * - On every change focus moves to the new step's first heading and a polite
 *   live region announces "Step n of m: label".
 */
export function BookingFlow({
  steps,
  embedded,
  bookedLabel,
  backLabel,
  stepBarLabel,
}: {
  steps: FlowStep[]
  embedded: boolean
  bookedLabel: string
  backLabel: string
  stepBarLabel: string
}) {
  const [current, setCurrent] = useState(0)
  const [visited, setVisited] = useState<number[]>([0])
  // false in server HTML and during hydration, true after: buttons that need JS render only then.
  const ready = useSyncExternalStore(noSubscribe, () => true, () => false)
  const [opened, setOpened] = useState(false)
  const [announce, setAnnounce] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const moved = useRef(false)

  const goTo = (index: number) => {
    moved.current = true
    setCurrent(index)
    setVisited((v) => (v.includes(index) ? v : [...v, index]))
    setAnnounce(`Step ${index + 1} of ${steps.length}: ${steps[index]?.label ?? ''}`)
  }

  // Listen for the calendar being opened and the homework being sent.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onOpened = () => setOpened(true)
    const onSubmitted = (event: Event) => {
      const formId = (event as CustomEvent<{ formId?: unknown }>).detail?.formId
      const index = steps.findIndex((s) => s.kind === 'form' && s.formId === formId)
      if (index >= 0 && index < steps.length - 1) goTo(index + 1)
    }
    root.addEventListener(BOOKING_OPENED_EVENT, onOpened)
    root.addEventListener(CMSFORM_SUBMITTED_EVENT, onSubmitted)
    return () => {
      root.removeEventListener(BOOKING_OPENED_EVENT, onOpened)
      root.removeEventListener(CMSFORM_SUBMITTED_EVENT, onSubmitted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo only uses setters and `steps`
  }, [steps])

  // Focus the new step's heading (never on first render).
  useEffect(() => {
    if (!moved.current) return
    const step = stepRefs.current[current]
    const heading = step?.querySelector<HTMLElement>('h2, h3') ?? step
    if (!heading) return
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
    rootRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [current])

  const first = steps[0]
  const showBooked = ready && first?.kind === 'book' && steps.length > 1 && (opened || embedded)

  return (
    <div ref={rootRef} className="scroll-mt-24">
      {steps.length > 1 ? (
        <ol aria-label={stepBarLabel} className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 md:mb-8 md:justify-center">
          {steps.map((s, i) => {
            const done = i < current
            const now = i === current
            return (
              <li
                key={i}
                aria-current={now ? 'step' : undefined}
                className={cx(
                  'flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] md:text-xs',
                  now ? 'text-ink' : 'text-gray-warm',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'inline-flex size-6 items-center justify-center border-2 text-[11px] leading-none',
                    now ? 'border-ink bg-ink text-cream' : done ? 'border-ink text-ink' : 'border-divider',
                  )}
                >
                  {done ? (
                    <svg viewBox="0 0 256 256" fill="currentColor" className="size-3.5">
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={now ? 'font-bold' : undefined}>
                  {s.label}
                  {done ? <span className="sr-only"> (done)</span> : null}
                </span>
              </li>
            )
          })}
        </ol>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      {steps.map((s, i) =>
        visited.includes(i) ? (
          <div
            key={i}
            ref={(el) => {
              stepRefs.current[i] = el
            }}
            hidden={i !== current}
          >
            {i > 0 && s.kind !== 'end' && ready ? (
              <button
                type="button"
                onClick={() => goTo(i - 1)}
                className="ix-rule mb-3 inline-flex min-h-target cursor-pointer items-center gap-1.5 text-small font-bold"
              >
                <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="size-[1.1em] shrink-0">
                  <path d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z" />
                </svg>
                {backLabel}
              </button>
            ) : null}
            {s.node}
            {i === 0 && showBooked ? (
              <div className="mt-6 flex md:justify-center">
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="ix-wipe-ink inline-flex min-h-target w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-transparent px-6.5 py-3.5 font-body text-[15px] font-bold leading-none text-ink md:w-auto"
                >
                  {bookedLabel}
                  <svg aria-hidden="true" viewBox="0 0 256 256" fill="currentColor" className="ix-arrow size-[1.1em] shrink-0">
                    <path d="M224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.51a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17Z" />
                  </svg>
                </button>
              </div>
            ) : null}
            {s.after}
          </div>
        ) : null,
      )}
    </div>
  )
}
