'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Client island for PhaseTimeline `build-run` / `engine-rollout` on phones
 * (Shopify Theme Development.dc.html + Marketing.dc.html "Build run" /
 * "Engine rollout" mobile builds). Why client: the design's progress bars
 * under the swipe row follow the scroll position, which needs a scroll
 * listener. The server renders the row and the bars (first bar lit, as in the
 * static design), so with JS off the row still scrolls and nothing is lost.
 *
 * Also: while the row actually overflows, it is made keyboard-focusable
 * (tabIndex 0, role=region, labelled by the section heading; the scroller is a wrapping div, so the <ol> inside keeps its list semantics) so it can be scrolled with
 * the arrow keys; at desktop widths, where it does not scroll, it is not a
 * tab stop.
 *
 * The scrolling wrapper inside `children` carries `data-swipe-row`.
 */
export function SwipeTrack({
  count,
  labelledBy,
  barsClassName,
  children,
}: {
  count: number
  labelledBy?: string
  /** Hides the bars where the row stops scrolling (e.g. `lg:hidden`). */
  barsClassName?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const row = ref.current?.querySelector<HTMLElement>('[data-swipe-row]') ?? null
    if (!row) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = row.scrollWidth - row.clientWidth
      if (max <= 1) {
        row.removeAttribute('tabindex')
        row.removeAttribute('role')
        row.removeAttribute('aria-labelledby')
        setActive(0)
        return
      }
      row.tabIndex = 0
      row.setAttribute('role', 'region')
      if (labelledBy) row.setAttribute('aria-labelledby', labelledBy)
      setActive(Math.round((row.scrollLeft / max) * (count - 1)))
    }
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    row.addEventListener('scroll', onChange, { passive: true })
    window.addEventListener('resize', onChange)
    return () => {
      row.removeEventListener('scroll', onChange)
      window.removeEventListener('resize', onChange)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count, labelledBy])

  return (
    <div ref={ref}>
      {children}
      {count > 1 ? (
        <div aria-hidden="true" className={`mt-4 flex gap-1.5 px-container-mobile md:px-container ${barsClassName ?? ''}`}>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`h-0.75 flex-1 transition-colors duration-180 ${i === active ? 'bg-cream' : 'bg-[rgba(250,247,242,.3)]'}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
