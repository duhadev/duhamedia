import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { cx } from '@/lib/cx'

/**
 * Logo mark + "DUHA MEDIA" wordmark (SiteHeader / SiteFooter / LP header).
 * `size` = the design's per-context sizes: header 28/34 (mobile/desktop),
 * footer 28/30, LP 30. The mark is `public/logo-duha.png` (design asset
 * `logo-duha-01.png`); served unoptimised because next.config `localPatterns`
 * only whitelists `/api/media/file/**`.
 * `href` null → not a link (logo-only header: zero leakage; footer brand).
 * The mark's alt is always empty (the wordmark text already names the brand), so
 * the link carries `label` as its `aria-label` and is announced once (F41).
 */
const SIZES = {
  header: { img: 'size-7 md:size-8.5', text: 'text-base md:text-lg', gap: 'gap-2 md:gap-2.5', px: [28, 34] },
  footer: { img: 'size-7 md:size-7.5', text: 'text-base', gap: 'gap-2.5', px: [28, 30] },
  lp: { img: 'size-7.5', text: 'text-base', gap: 'gap-2.5', px: [30, 30] },
} as const

export function SiteLogo({
  size,
  href = null,
  label,
  className,
}: {
  size: keyof typeof SIZES
  href?: string | null
  /** Accessible name of the link (site name + "home"). Only used when `href` is set. */
  label?: string
  className?: string
}) {
  const s = SIZES[size]
  const inner = (
    <>
      <Image
        src="/logo-duha.png"
        alt=""
        width={s.px[1]}
        height={s.px[1]}
        unoptimized
        className={s.img}
      />
      <span className={cx('font-display font-normal tracking-headline', s.text)}>DUHA MEDIA</span>
    </>
  )
  const cls = cx('flex items-center', s.gap, className)
  return href ? (
    <Link href={href} aria-label={label ?? 'Duha Media home'} className={cx(cls, 'text-ink no-underline')}>
      {inner}
    </Link>
  ) : (
    <span className={cls}>{inner}</span>
  )
}
