'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading progress bar (SCHEMA X6: a page flag, `pages.readingProgress`; router
 * unit B2). Port of design-reference site-fx.js `readingProgress()`: a fixed
 * vertical bar on the LEFT edge, `--reading-progress-width` (4px) wide, in
 * `accent-primary`, whose height follows the scroll position (MERGED.md
 * Conflict 10 answer: vertical left-edge bar).
 *
 * Client island because it reads scroll position. Decorative: `aria-hidden`,
 * no pointer events. Reduced motion: the bar has no transition or animation at
 * all, it only mirrors where the reader is, so nothing moves on its own.
 * Updates are rAF-throttled and write `transform` only (no layout).
 */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const d = document.documentElement
      const max = d.scrollHeight - d.clientHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, d.scrollTop / max)) : 0
      if (bar.current) bar.current.style.transform = `scaleY(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      data-reading-progress=""
      className="pointer-events-none fixed inset-y-0 left-0 z-[99] origin-top bg-accent-primary"
      style={{ width: 'var(--reading-progress-width)', transform: 'scaleY(0)' }}
    />
  )
}
