import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { RichText } from '@/components/RichText'
import { CMSLink, Eyebrow, Section } from '@/components/ui'
import type { Faq } from '@/payload-types'

type AccordionFAQProps = BlockData<'accordionFAQ'>
type LexicalData = Faq['answer']

const clampLimit = (n: number | null | undefined): number => Math.min(12, Math.max(1, Math.round(n ?? 6)))

/**
 * Published questions only (CLAUDE.md rule 1 / SCHEMA §5). Picks that arrive
 * as bare ids (unpublished or unreadable: population runs through access) or
 * as a non-published object are dropped. The category source queries with
 * `draft: false`, `overrideAccess: false` and an explicit `_status` filter.
 * A failed read is logged and renders nothing.
 */
async function loadFaqs(source: AccordionFAQProps['source'], picks: AccordionFAQProps['faqs'], category: AccordionFAQProps['category'], limit: number): Promise<Faq[]> {
  if (source !== 'category') {
    return (picks ?? []).filter((f): f is Faq => typeof f === 'object' && f !== null && f._status === 'published').slice(0, limit)
  }
  if (!category) return []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'faqs',
      draft: false,
      overrideAccess: false,
      depth: 1,
      limit,
      sort: 'sortOrder',
      where: { and: [{ _status: { equals: 'published' } }, { category: { equals: category } }] },
    })
    return docs.filter((d) => d._status === 'published')
  } catch (error) {
    console.error('[AccordionFAQ] could not load published FAQs; rendering nothing', error)
    return []
  }
}

type Node = { text?: unknown; children?: unknown }

/** Plain text of a Lexical state for the FAQPage JSON-LD (paragraphs/list items separated by a space). */
function plainText(data: LexicalData | null | undefined): string {
  const out: string[] = []
  const walk = (node: Node | null | undefined) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') out.push(node.text)
    if (Array.isArray(node.children)) {
      node.children.forEach((c) => walk(c as Node))
      out.push(' ')
    }
  }
  walk((data as { root?: Node } | null)?.root)
  return out.join('').replace(/\s+/g, ' ').trim()
}

/**
 * AccordionFAQ, `mini` variant (Services Hub / Shopify / Marketing "FAQ mini",
 * desktop + mobile builds; item grammar from DS FAQItem). Server component:
 * native <details>/<summary> gives keyboard, crawlable answers and the open
 * state with no JS. Renders nothing (quietly; one server-side warn) when no
 * published question is available. Emits FAQPage JSON-LD for exactly the
 * rendered items.
 */
export async function AccordionFAQBlock({ eyebrow, eyebrowTick, heading, source, category, faqs, limit, openFirst, allLink }: AccordionFAQProps) {
  const items = await loadFaqs(source, faqs, category, clampLimit(limit))

  if (items.length === 0) {
    console.warn(`[AccordionFAQ] "${heading}" has no published questions; rendering nothing`)
    return null
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(f.answer) },
    })),
  }

  return (
    <Section tone="light">
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        {eyebrow ? (
          <Eyebrow tick={eyebrowTick !== false} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2 className="font-display text-[1.875rem] font-normal uppercase leading-[1.02] md:text-[2.25rem] md:leading-[1.05]">{heading}</h2>
        <div className="mt-5 md:mt-6">
          {items.map((f, i) => (
            <details key={f.id} open={openFirst && i === 0 ? true : undefined} className="group border-t border-divider">
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
          ))}
        </div>
        <CMSLink link={allLink} className="mt-3 inline-flex min-h-target items-center text-[15px] font-bold no-underline md:mt-4">
          <span className="border-b-2 border-ink">{allLink?.label}</span>
        </CMSLink>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </div>
    </Section>
  )
}
