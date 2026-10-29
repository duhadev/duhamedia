'use client'

import React, { useEffect, useRef } from 'react'

import './heroMotion.css'

/** Mirrors IntroAnimation's overlay id (src/components/IntroAnimation). */
const INTRO_ID = 'intro-overlay'

/**
 * Motion wrapper of the typographic Hero (Hero Load-in.dc.html). The hero
 * itself stays a server component passed in as `children`; all motion is CSS
 * (heroMotion.css) and plays without JS.
 *
 * Client only because two things need the DOM after hydration:
 * 1. Intro hand-off latch. Before paint, CSS sees the intro overlay
 *    (`:root:has(#intro-overlay)`) and sets `--t0: 2160ms`. IntroAnimation
 *    unmounts the overlay ~2.9s later, which would flip `--t0` back to 0 and
 *    re-time running animations, so on mount we copy that fact onto this
 *    element as `data-intro` (never removed).
 * 2. Ambient pause. An IntersectionObserver sets `data-offscreen` while the
 *    hero is out of view, which pauses the infinite float/fan/pulse loops.
 * 3. Pulse origin. A ResizeObserver keeps the pulse ring centred on the
 *    silhouette (`--hm-cx/--hm-cy`) at every breakpoint and layout.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const intro = document.getElementById(INTRO_ID) !== null
    if (intro) el.setAttribute('data-intro', '')

    // Intro skipped (click / key, IntroAnimation fades the panel in 220ms):
    // start the load-in now instead of waiting for 2160ms. Only while every
    // hero animation is still in its delay, so nothing already moving jumps.
    const skip = () => {
      const started = el.getAnimations({ subtree: true }).map((a) => Number(a.startTime ?? NaN))
      const now = Number(document.timeline.currentTime ?? NaN)
      const elapsed = now - Math.min(...started)
      if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 2160) el.style.setProperty('--t0', `${Math.round(elapsed)}ms`)
    }
    if (intro) {
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
    }

    // Pulse origin = silhouette centre, in the pulse layer's own px (both are
    // absolutely positioned in the same section). Layout values only
    // (offset* + the `translate` property), so the running sunrise / float
    // transforms never skew it.
    const sun = el.querySelector<HTMLElement>('.hm-sun')
    const pulse = el.querySelector<HTMLElement>('.hm-pulse')
    const place = () => {
      if (!sun || !pulse) return
      const [tx = '0px', ty = '0px'] = getComputedStyle(sun).translate.split(' ')
      const px = (v: string, size: number) => (v.endsWith('%') ? (parseFloat(v) / 100) * size : parseFloat(v) || 0)
      const cx = sun.offsetLeft + sun.offsetWidth / 2 + px(tx, sun.offsetWidth)
      const cy = sun.offsetTop + sun.offsetHeight / 2 + px(ty === 'none' ? '0px' : ty, sun.offsetHeight)
      pulse.style.setProperty('--hm-cx', `${Math.round(cx)}px`)
      pulse.style.setProperty('--hm-cy', `${Math.round(cy)}px`)
    }
    place()
    const ro = typeof ResizeObserver === 'undefined' || !sun || !pulse ? null : new ResizeObserver(place)
    ro?.observe(el)
    if (sun) ro?.observe(sun)

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            el.toggleAttribute('data-offscreen', !entry.isIntersecting)
          })
    io?.observe(el)
    return () => {
      io?.disconnect()
      ro?.disconnect()
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  return (
    <div ref={ref} className="hm-hero">
      {children}
    </div>
  )
}
