import React from 'react'

import { cx } from '@/lib/cx'

/**
 * DS Eyebrow (_ds_bundle.js Eyebrow.jsx; MERGED §4.1): 0.875rem/700 uppercase,
 * 0.08em tracking; `tick` = 9×9 square rotated 45° in --ground-accent, gap
 * 10px; `muted` = --gray-warm, otherwise inherits the section's text colour.
 */
export function Eyebrow({
  tick = false,
  muted = false,
  as: Tag = 'p',
  className,
  children,
}: {
  tick?: boolean
  muted?: boolean
  as?: 'p' | 'span' | 'div'
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag
      className={cx(
        'text-small font-bold uppercase tracking-eyebrow',
        tick ? 'flex items-center gap-2.5' : 'block',
        muted && 'text-gray-warm',
        className,
      )}
    >
      {tick ? <span aria-hidden="true" className="size-2.25 shrink-0 rotate-45 bg-ground-accent" /> : null}
      {children}
    </Tag>
  )
}
