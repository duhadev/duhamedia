'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Client island for PhaseTimeline `accordion` (Homepage.dc.html Process script,
 * MERGED §6 "Page JS (Homepage)"). Why client: click and scroll listeners.
 * The server component renders every step as native `<details>` (readable and
 * operable with JS off); this wrapper only adds:
 *
 * 1. One step open at a time, always one open (the design never shows all
 *    closed): a click on the open step's summary is ignored; opening a step
 *    closes the others.
 * 2. Mobile (< md, 768px): the step whose header is nearest 45% of the
 *    viewport height opens as the visitor scrolls (rAF-throttled scroll
 *    listener, as in the design). It never moves focus. After an explicit
 *    click the scroll behaviour pauses until the visitor has scrolled half a
 *    screen away, so it never fights the click. Off with
 *    `prefers-reduced-motion: reduce` (content would shift under the reader).
 *
 * Not ported: the design's desktop auto-advance (a 2.2 s timer cycling the
 * open step until the first click). MERGED §4.2 specifies "Desktop opens on
 * click", and an endless timer with no pause control fails WCAG 2.2.2.
 */
export function AccordionSteps({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = (): HTMLDetailsElement[] => Array.from(root.querySelectorAll('details'))
    const desktop = window.matchMedia('(min-width: 48rem)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const openOnly = (target: HTMLDetailsElement) => {
      for (const d of items()) if (d !== target && d.open) d.open = false
      if (!target.open) target.open = true
    }

    // JS on: exactly one open. Without JS several may be open, which is fine.
    const initial = items().filter((d) => d.open)
    if (initial.length !== 1) {
      const first = initial[0] ?? items()[0]
      if (first) openOnly(first)
    }

    let pinnedAt: number | null = null

    const onClick = (event: MouseEvent) => {
      const summary = (event.target as Element | null)?.closest('summary')
      const details = summary?.parentElement
      if (!summary || !(details instanceof HTMLDetailsElement) || !root.contains(details)) return
      if (details.open) {
        // Keep one step open: clicking the open step does nothing.
        event.preventDefault()
      } else {
        // The default action opens it; close the others now so two are never open.
        for (const d of items()) if (d !== details && d.open) d.open = false
      }
      pinnedAt = window.scrollY
    }

    // Backstop for opens that bypass the click (e.g. find-in-page auto-expand).
    const onToggle = (event: Event) => {
      const target = event.target
      if (target instanceof HTMLDetailsElement && target.open && root.contains(target)) {
        for (const d of items()) if (d !== target && d.open) d.open = false
      }
    }

    let frame = 0
    const HYSTERESIS = 24 // px: avoids flip-flopping while heights change

    const update = () => {
      frame = 0
      if (desktop.matches || reducedMotion.matches) return
      if (pinnedAt !== null) {
        if (Math.abs(window.scrollY - pinnedAt) < window.innerHeight * 0.5) return
        pinnedAt = null
      }
      const rootRect = root.getBoundingClientRect()
      if (rootRect.bottom < 0 || rootRect.top > window.innerHeight) return

      const mid = window.innerHeight * 0.45
      const list = items()
      let best: HTMLDetailsElement | null = null
      let bestDistance = Infinity
      let currentDistance = Infinity
      for (const d of list) {
        const header = d.querySelector('summary') ?? d
        const r = header.getBoundingClientRect()
        const distance = Math.abs(r.top + r.height / 2 - mid)
        if (d.open) currentDistance = distance
        if (distance < bestDistance) {
          bestDistance = distance
          best = d
        }
      }
      if (best && !best.open && currentDistance - bestDistance > HYSTERESIS) openOnly(best)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    root.addEventListener('click', onClick)
    root.addEventListener('toggle', onToggle, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('toggle', onToggle, true)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
