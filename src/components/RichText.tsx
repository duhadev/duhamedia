import type { SerializedAutoLinkNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  RichText as LexicalRichText,
  type JSXConverter,
  type JSXConverters,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import React from 'react'

import { docPath } from '@/lib/docPath'
import type { Faq } from '@/payload-types'

/**
 * Shared Lexical → JSX rendering for every block that shows a `richText` field
 * (cross-unit, owned by the integrator). Server-safe, no client JS.
 *
 * - Internal links resolve through `docPath` (one rule for every routable
 *   collection); an unresolved target (unpopulated / no public path, or a
 *   populated doc whose `_status` is not `published`) renders as plain text,
 *   never a dead link or `#`.
 * - Custom URLs pass `safeHref`: only http(s), mailto, tel, `#…` and
 *   site-relative paths become links; anything else (javascript:, data:, …)
 *   renders as plain text. Autolinks get the same check.
 * - Site-relative links that open in the same tab render through `next/link`.
 *
 * Block-specific typography (e.g. RichContent's numbered H2s and figures) is
 * layered on top via `converters`; the link rules stay here.
 */

/** Any Lexical editor state saved by a `richText` field (the generated shape is the same in every collection). */
export type RichTextData = Faq['answer']

/** Only http(s), mailto, tel, in-page anchors and site-relative paths become links. */
export const safeHref = (href: string | null | undefined): string | null => {
  const h = href?.trim()
  if (!h) return null
  if (/^\/(?!\/)/.test(h) || /^#/.test(h) || /^(https?:|mailto:|tel:)/i.test(h)) return h
  return null
}

type LinkNodeFields = {
  linkType?: string
  url?: string | null
  newTab?: boolean | null
  doc?: { relationTo: string; value: unknown } | null
}

/** Public href of a Lexical link node's fields, or null when it must render as plain text. */
export const richTextLinkHref = (fields: LinkNodeFields | null | undefined): string | null => {
  if (!fields) return null
  if (fields.linkType === 'internal') {
    const value = fields.doc?.value as { slug?: string | null; track?: string | null; _status?: string | null } | undefined
    // A target populated by a trusted (overrideAccess) read can be a draft: never link to it.
    // `_status` is in every routable collection's defaultPopulate; absent = not versioned → published.
    return value && typeof value === 'object' && fields.doc && (value._status ?? 'published') === 'published'
      ? docPath(fields.doc.relationTo, value)
      : null
  }
  return safeHref(fields.url)
}

type LinkConverter = JSXConverter<SerializedLinkNode | SerializedAutoLinkNode>

/** The `link` / `autolink` converters; `className` styles the anchor (omit to inherit from the container). */
export const linkConverters = (className?: string): Pick<JSXConverters, 'link' | 'autolink'> => {
  const convert: LinkConverter = ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const href = richTextLinkHref(node.fields)
    if (!href) return <>{children}</>
    const newTab = Boolean(node.fields?.newTab)
    if (href.startsWith('/') && !newTab) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} className={className} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
        {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    )
  }
  return { link: convert, autolink: convert }
}

type RichTextProps = {
  data: RichTextData | null | undefined
  /** Extra / overriding converters, applied over the defaults and the shared link converters. */
  converters?: JSXConvertersFunction
  /** Class for every rendered link (default: none, so the container's `[&_a]` styles apply). */
  linkClassName?: string
  className?: string
  disableContainer?: boolean
}

/**
 * Thin wrapper over `@payloadcms/richtext-lexical/react`'s `RichText` with the
 * shared link rules. Renders nothing for an empty value.
 *
 * `converters` must return ONLY the node types it overrides (do not spread
 * `defaultConverters` back in, or the shared link converters are replaced).
 */
export function RichText({ data, converters, linkClassName, className, disableContainer }: RichTextProps) {
  if (!data?.root) return null
  const merged: JSXConvertersFunction = (args) => ({
    ...args.defaultConverters,
    ...linkConverters(linkClassName),
    ...(converters ? converters(args) : {}),
  })
  return <LexicalRichText data={data} converters={merged} className={className} disableContainer={disableContainer} />
}
