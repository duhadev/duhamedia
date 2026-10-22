import Link from 'next/link'
import React from 'react'

import { docPath, type RoutableDoc } from '@/lib/docPath'

/**
 * The stored shape of `linkField()` (src/fields/index.ts, SCHEMA §3). Written
 * structurally so every generated `linkField` group type (one per usage) is
 * assignable to it without casts.
 */
export type CMSLinkData = {
  type?: 'internal' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'case-studies' | 'posts' | 'lead-magnets'
    value: number | string | RoutableDoc
  } | null
  url?: string | null
  label?: string | null
}

/**
 * Public href of a link, or `null` when it cannot be resolved: an internal
 * reference that is empty, unpopulated (id only: unpublished or depth too
 * low) or has no public path; a custom link with no address.
 */
export const resolveLinkHref = (link: CMSLinkData | null | undefined): string | null => {
  if (!link) return null
  if ((link.type ?? 'internal') === 'custom') {
    const url = link.url?.trim()
    return url ? url : null
  }
  const ref = link.reference
  if (!ref || typeof ref.value !== 'object' || ref.value === null) return null
  return docPath(ref.relationTo, ref.value)
}

type AnchorRest = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>

/**
 * Renders a `linkField` value (B0): site-relative destinations as a Next
 * `Link` (client navigation, prefetch), `https://` and `mailto:` as `<a>`.
 * `newTab` adds `target="_blank" rel="noopener noreferrer"`.
 *
 * Renders NOTHING when the destination does not resolve (F10/F23: a deleted
 * or unpublished target never becomes a dead link) or when there is no text
 * (`children` override the stored label).
 */
export function CMSLink({
  link,
  className,
  children,
  ...rest
}: {
  link: CMSLinkData | null | undefined
  className?: string
  children?: React.ReactNode
} & AnchorRest) {
  const href = resolveLinkHref(link)
  const content = children ?? link?.label
  if (!href || content === null || content === undefined || content === '') return null

  const newTab = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} className={className} {...newTab} {...rest}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} className={className} {...newTab} {...rest}>
      {content}
    </a>
  )
}
