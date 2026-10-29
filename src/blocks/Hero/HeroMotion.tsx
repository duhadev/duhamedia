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
 *    hero is out of view, which pauses the infinite float/fan loops.
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

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            el.toggleAttribute('data-offscreen', !entry.isIntersecting)
          })
    io?.observe(el)
    return () => {
      io?.disconnect()
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
