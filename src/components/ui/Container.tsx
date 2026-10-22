import React from 'react'

import { cx } from '@/lib/cx'

/**
 * Site container (MERGED §2.3): max 1200px centred, gutter 20px below `md`
 * (mobile builds) and 24px from `md` (--container-pad). Pages:
 * `max-width:var(--container-max);margin:0 auto;padding:0 var(--container-pad)`.
 */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'header' | 'footer' | 'nav'
  className?: string
  children: React.ReactNode
}) {
  return <Tag className={cx('mx-auto w-full max-w-site px-container-mobile md:px-container', className)}>{children}</Tag>
}
