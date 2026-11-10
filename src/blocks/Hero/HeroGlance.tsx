import React from 'react'

import type { BlockData } from '@/blocks/types'
import { cx } from '@/lib/cx'

export type HeroGlanceData = NonNullable<BlockData<'hero'>['glance']>

/** True when the card has something to show (at least one complete row). */
export function glanceRows(glance: HeroGlanceData | null | undefined) {
  return (glance?.rows ?? []).filter((r) => r?.label?.trim() && r?.value?.trim()).slice(0, 5)
}

/**
 * Hero "at a glance" card (service-pages-2026-11-09 Build/Marketing.dc.html
 * `<aside>`): cream, 2px ink border, shadow-lift, a micro title, label/value
 * rows in a `<dl>` (Archivo 32px values, one may be wine) and a grey footer
 * band. Server component. The caller decides where it sits (a grid column on
 * desktop, after the buttons on a phone).
 */
export function HeroGlance({ glance, className, style }: { glance: HeroGlanceData | null | undefined; className?: string; style?: React.CSSProperties }) {
  const rows = glanceRows(glance)
  if (!rows.length) return null
  const title = glance?.title?.trim()
  const footer = glance?.footer?.trim()
  return (
    <aside aria-label={title || 'At a glance'} style={style} className={cx('border-2 border-ink bg-cream shadow-lift', className)}>
      {title ? (
        <p className="border-b border-divider px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-warm">{title}</p>
      ) : null}
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.id ?? i}
            className={cx('flex items-baseline justify-between gap-4 px-6 py-4.5', (i < rows.length - 1 || footer) && 'border-b border-divider')}
          >
            <dt className="min-w-0 font-bold">{row.label}</dt>
            <dd className={cx('shrink-0 whitespace-nowrap font-display text-[2rem] leading-none', row.accent ? 'text-ground-accent' : 'text-ink')}>{row.value}</dd>
          </div>
        ))}
      </dl>
      {footer ? <p className="bg-gray-light px-6 py-3.5 text-small text-gray-warm">{footer}</p> : null}
    </aside>
  )
}
