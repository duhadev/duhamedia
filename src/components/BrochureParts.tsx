import React from 'react'

import { cx } from '@/lib/cx'

/*
 * Small typographic parts shared by the brochure-derived blocks
 * (ServiceSheet, PricingPlans, SpecLedger `tools`, the case-study story):
 * the tracked grey caption, the diamond section title and the wine square
 * bullet of the 2026-11-07 brochure.
 */

/** Small uppercase caption (the brochure's tracked grey labels). */
export function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cx('text-[0.75rem] font-bold uppercase tracking-[0.12em] text-gray-warm', className)}>{children}</p>
}

/** Section title with the wine diamond (brochure "◆ WHY IT MATTERS"). */
export function DiamondHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cx('flex items-center gap-3 font-display text-[1.25rem] leading-tight font-normal uppercase md:text-[1.5rem]', className)}>
      <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 bg-ground-accent" />
      {children}
    </h2>
  )
}

/** Wine square bullet (brochure lists). */
export function SquareBullet() {
  return <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-ground-accent" />
}

