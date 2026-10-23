import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { RichText } from '@/components/RichText'
import { CMSLink, Eyebrow, Section } from '@/components/ui'
import type { Faq } from '@/payload-types'

type AccordionFAQProps = BlockData<'accordionFAQ'> & {
  /**
   * `mini` only (default true): emit this block's own FAQPage JSON-LD. The
   * `group` variant never emits one; the page router merges all FAQ blocks of
   * a page into ONE FAQPage via `loadAccordionFaqs` + `faqJsonLdItems`.
   */
  emitJsonLd?: boolean
}
type LexicalData = Faq['answer']
/** The minimal question shape the view needs (a `Faq` doc, or a post's inline `faq` item). */
export type FaqItem = { id?: number | string | null; question: string; answer: LexicalData }

const clampLimit = (n: number | null | undefined): number => Math.min(12, Math.max(1, Math.round(n ?? 6)))

/**
 * Published questions only (CLAUDE.md rule 1 / SCHEMA §5). Picks that arrive
 * as bare ids (unpublished or unreadable: population runs through access) or
 * as a non-published object are dropped. The category source queries with
 * `draft: false`, `overrideAccess: false` and an explicit `_status` filter.
 * A failed read is logged and renders nothing.
 */
async function loadFaqs(source: AccordionFAQProps['source'], picks: AccordionFAQProps['faqs'], category: AccordionFAQProps['category'], limit: number | null): Promise<Faq[]> {
  if (source !== 'category') {
    const published = (picks ?? []).filter((f): f is Faq => typeof f === 'object' && f !== null && f._status === 'published')
    return limit === null ? published : published.slice(0, limit)
  }
  if (!category) return []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'faqs',
      draft: false,
      overrideAccess: false,
      depth: 1,
      ...(limit === null ? { pagination: false } : { limit }),
      sort: 'sortOrder',
      where: { and: [{ _status: { equals: 'published' } }, { category: { equals: category } }] },
    })
    return docs.filter((d) => d._status === 'published')
  } catch (error) {
    console.error('[AccordionFAQ] could not load published FAQs; rendering nothing', error)
    return []
  }
}

/**
 * Public loader for the page router: the published questions this block would
 * render. Same rules as the render path (published only, limit clamped).
 */
export const loadAccordionFaqs = (block: Pick<AccordionFAQProps, 'source' | 'faqs' | 'category' | 'limit'> & { variant?: AccordionFAQProps['variant'] }): Promise<Faq[]> =>
  loadFaqs(block.source, block.faqs, block.category, block.variant === 'group' ? null : clampLimit(block.limit))

type Node = { type?: unknown; text?: unknown; children?: unknown }

/** Plain text of a Lexical state for the FAQPage JSON-LD (paragraphs/list items separated by a space). */
function plainText(data: LexicalData | null | undefined): string {
  const out: string[] = []
  const walk = (node: Node | null | undefined) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') out.push(node.text)
    // linebreak/tab nodes carry no text; without a separator the words around them fuse.
    if (node.type === 'linebreak' || node.type === 'tab') out.push(' ')
    if (Array.isArray(node.children)) {
      node.children.forEach((c) => walk(c as Node))
      out.push(' ')
    }
  }
  walk((data as { root?: Node } | null)?.root)
  return out.join('').replace(/\s+/g, ' ').trim()
}

/**
 * FAQPage `mainEntity` entries for a list of rendered questions. Pure. The page
 * router concatenates the result of every FAQ block on a page into one
 * `{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity }`.
 */
export const faqJsonLdItems = (faqs: FaqItem[]) =>
  faqs.map((f) => ({
    '@type': 'Question' as const,
    name: f.question,
    acceptedAnswer: { '@type': 'Answer' as const, text: plainText(f.answer) },
  }))

/** One question row (shared by `mini` and `group`; markup unchanged from `mini`). */
function FaqRow({ f, open }: { f: FaqItem; open: boolean }) {
  return (
    <details open={open ? true : undefined} className="group border-t border-divider">
      <summary className="flex min-h-target cursor-pointer list-none items-center justify-between gap-4 py-4.5 text-left text-[1.125rem] font-bold [&::-webkit-details-marker]:hidden">
        {f.question}
        <span
          aria-hidden="true"
          className="font-display text-[20px] leading-none transition-transform duration-180 ease-out group-open:rotate-45 group-open:text-accent-primary"
        >
          +
        </span>
      </summary>
      <div className="max-w-[62ch] pb-5 text-[1rem] leading-[1.6] font-medium [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <RichText data={f.answer} disableContainer />
      </div>
    </details>
  )
}

/** Page-edge spacing of a group section (FAQ.dc.html: 64/32/32/64 desktop, 44/20/20/48 mobile). */
const GROUP_SPACING = {
  middle: 'py-5 md:py-8',
  first: 'pt-11 pb-5 md:pt-16 md:pb-8',
  last: 'pt-5 pb-12 md:pt-8 md:pb-16',
  only: 'pt-11 pb-12 md:pt-16 md:pb-16',
} as const

/**
 * `group` variant (FAQ.dc.html category sections, desktop + mobile): h2 in
 * display type over the same item list; `anchorId` becomes the section id with
 * a scroll margin clearing the sticky header (72px / 60px) and, from md, the
 * sticky category bar (~56px). Emits no JSON-LD (see `emitJsonLd`).
 */
function GroupFaq({ heading, items, openFirst, allLink, anchorId, spacing, eyebrow, eyebrowTick }: Pick<AccordionFAQProps, 'heading' | 'openFirst' | 'allLink' | 'anchorId' | 'spacing' | 'eyebrow' | 'eyebrowTick'> & { items: Faq[] }) {
  return (
    <Section id={anchorId || undefined} tone="light" pad="none" className={`scroll-mt-31 md:scroll-mt-34 ${GROUP_SPACING[spacing ?? 'middle']}`}>
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        {eyebrow ? (
          <Eyebrow tick={eyebrowTick !== false} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2 className="mb-3.5 font-display text-h3-mobile font-normal uppercase md:mb-4 md:text-h3">{heading}</h2>
        <div>
          {items.map((f, i) => (
            <FaqRow key={f.id} f={f} open={Boolean(openFirst) && i === 0} />
          ))}
        </div>
        <CMSLink link={allLink} className="mt-3 inline-flex min-h-target items-center text-[15px] font-bold no-underline md:mt-4">
          <span className="border-b-2 border-ink">{allLink?.label}</span>
        </CMSLink>
      </div>
    </Section>
  )
}

/**
 * AccordionFAQ, `mini` variant (Services Hub / Shopify / Marketing "FAQ mini",
 * desktop + mobile builds; item grammar from DS FAQItem). Server component:
 * native <details>/<summary> gives keyboard, crawlable answers and the open
 * state with no JS. Renders nothing (quietly; one server-side warn) when no
 * published question is available. Emits FAQPage JSON-LD for exactly the
 * rendered items.
 */
export async function AccordionFAQBlock({ variant, eyebrow, eyebrowTick, heading, source, category, faqs, limit, openFirst, allLink, anchorId, spacing, emitJsonLd = true }: AccordionFAQProps) {
  const items = await loadFaqs(source, faqs, category, variant === 'group' ? null : clampLimit(limit))

  if (items.length === 0) {
    console.warn(`[AccordionFAQ] "${heading}" has no published questions; rendering nothing`)
    return null
  }

  if (variant === 'group') {
    return <GroupFaq {...{ heading, items, openFirst, allLink, anchorId, spacing, eyebrow, eyebrowTick }} />
  }

  return <AccordionFAQItemsView {...{ eyebrow, eyebrowTick, heading, items, openFirst, allLink, emitJsonLd }} />
}

/**
 * Mini-variant markup over an already-resolved item list (no loading, no
 * filtering: the caller passes only items that may be shown). Used by
 * `AccordionFAQBlock` and by templates that carry inline questions
 * (posts' `faq`). `heading` is optional: with only an `eyebrow` the h2 is
 * omitted (post templates). Renders nothing for an empty list.
 */
export function AccordionFAQItemsView({
  eyebrow,
  eyebrowTick,
  heading,
  items,
  openFirst,
  allLink,
  emitJsonLd = true,
}: {
  eyebrow?: string | null
  eyebrowTick?: boolean | null
  heading?: string | null
  items: FaqItem[]
  openFirst?: boolean | null
  allLink?: AccordionFAQProps['allLink']
  emitJsonLd?: boolean
}) {
  if (items.length === 0) return null
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLdItems(items) }

  return (
    <Section tone="light">
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        {eyebrow ? (
          <Eyebrow tick={eyebrowTick !== false} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        {heading ? (
          <h2 className="font-display text-[1.875rem] font-normal uppercase leading-[1.02] md:text-[2.25rem] md:leading-[1.05]">{heading}</h2>
        ) : null}
        <div className={heading ? 'mt-5 md:mt-6' : undefined}>
          {items.map((f, i) => (
            <FaqRow key={f.id ?? i} f={f} open={Boolean(openFirst) && i === 0} />
          ))}
        </div>
        <CMSLink link={allLink} className="mt-3 inline-flex min-h-target items-center text-[15px] font-bold no-underline md:mt-4">
          <span className="border-b-2 border-ink">{allLink?.label}</span>
        </CMSLink>
        {emitJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /> : null}
      </div>
    </Section>
  )
}
