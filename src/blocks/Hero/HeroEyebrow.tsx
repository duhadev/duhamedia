import React from 'react'

import { Eyebrow } from '@/components/ui'
import { cx } from '@/lib/cx'

import { LOGO_MASK } from './logoMask'

/**
 * Subpage logo standard (owner, 2026-11-09): every subpage hero leads its
 * page label with the 28px logo disc (the same masked mark as SiteLogo).
 * Wine on light grounds, cream on ink. The label itself stays the grey-caps
 * `<Eyebrow muted>`; the disc replaces nothing. `disc={false}` is the
 * homepage (featureShape) exclusion.
 *
 * `motion` is the typographic hero's load-in hook (heroMotion.css): the disc
 * pops like the old tick, the text wipes in.
 */
export function HeroEyebrow({
  children,
  disc = true,
  tone = 'light',
  motion = false,
  className,
}: {
  children: React.ReactNode
  disc?: boolean
  tone?: 'light' | 'dark'
  motion?: boolean
  className?: string
}) {
  const label = (
    <Eyebrow muted={tone === 'light'} className={tone === 'dark' ? 'text-gray-light/65' : undefined}>
      {motion ? <span className="hm-eyebrow-t">{children}</span> : children}
    </Eyebrow>
  )
  if (!disc) {
    return motion ? <div className={cx('hm-eyebrow', className)}>{label}</div> : <div className={className}>{label}</div>
  }
  return (
    <div className={cx('flex items-center gap-3', motion && 'hm-eyebrow', className)}>
      <span
        aria-hidden="true"
        style={LOGO_MASK}
        className={cx('inline-block size-7 shrink-0', tone === 'dark' ? 'bg-cream' : 'bg-ground-accent')}
      />
      {label}
    </div>
  )
}
