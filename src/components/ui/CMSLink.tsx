import Link from 'next/link'
import React from 'react'

import { docPath, type RoutableDoc } from '@/lib/docPath'

import { ArrowText } from './ArrowText'

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
  const raw = children ?? link?.label
  if (!href || raw === null || raw === undefined || raw === '') return null
  // A text label's trailing arrow advances on hover (interaction system).
  const content = typeof raw === 'string' ? <ArrowText text={raw} /> : raw

  const newTab = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  // SEO/a11y F64 A2: AT users get the same "opens in a new tab" cue sighted users infer.
  const cue = link?.newTab ? <span className="sr-only"> (opens in a new tab)</span> : null

  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} className={className} {...newTab} {...rest}>
        {content}
        {cue}
      </Link>
    )
  }
  return (
    <a href={href} className={className} {...newTab} {...rest}>
      {content}
      {cue}
    </a>
  )
}
