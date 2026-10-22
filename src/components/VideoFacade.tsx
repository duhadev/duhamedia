'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { cx } from '@/lib/cx'

/**
 * Click-to-load YouTube facade (lite-youtube-embed pattern, implemented inline).
 * Client island: the click swaps the poster for the iframe. No request to
 * YouTube is made until the visitor clicks; the player is youtube-nocookie.com.
 *
 * `children` is the poster + overlays (server-rendered by the caller). The
 * container supplies `group relative`, so callers keep their own sizing and
 * `group-hover` styling. Before hydration the control is a plain link to the
 * YouTube watch page (no-JS fallback); once hydrated it is a real button.
 */
export function VideoFacade({
  videoId,
  label,
  title,
  className,
  children,
}: {
  videoId: string
  /** Accessible name of the play control, e.g. "Play video: Jane Doe, [Client A]". */
  label: string
  /** Title of the iframe once loaded. */
  title: string
  className?: string
  children?: React.ReactNode
}) {
  // false on the server and during hydration, true afterwards (no mismatch, no setState-in-effect).
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [playing, setPlaying] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (playing) frame.current?.focus()
  }, [playing])

  const hit = 'absolute inset-0 z-10 block cursor-pointer'

  return (
    <div className={cx('group relative', className)}>
      {children}
      {playing ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 z-20 size-full border-0 bg-ink"
        />
      ) : hydrated ? (
        <button type="button" aria-label={label} onClick={() => setPlaying(true)} className={cx(hit, 'cursor-pointer')} />
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={hit}
        >
          <span className="sr-only">{label} (opens YouTube in a new tab)</span>
        </a>
      )}
    </div>
  )
}
