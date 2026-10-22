import React from 'react'

import { faqJsonLdItems, loadAccordionFaqs } from '@/blocks/AccordionFAQ/Component'
import type { BlockData, PageLayoutBlock } from '@/blocks/types'
import type { Faq } from '@/payload-types'

const isAccordion = (row: PageLayoutBlock): row is BlockData<'accordionFAQ'> => row.blockType === 'accordionFAQ'

/**
 * ONE FAQPage JSON-LD per page (integrator, big step 5; SEO rule "no duplicate
 * structured data"). Collects the published questions every `accordionFAQ`
 * block on the page renders (`loadAccordionFaqs`: same published-only rules
 * and limit as the render path), de-duplicated by FAQ id in layout order, and
 * emits a single script. Renders nothing when the page has no question.
 * RenderBlocks is called with `pageJsonLd` alongside, so blocks emit none.
 *
 * Note: a `category`-source block reads the DB here and again when it renders
 * (two cheap queries per such block per request; force-dynamic, no cache).
 */
export async function PageFaqJsonLd({ layout }: { layout: readonly PageLayoutBlock[] | null | undefined }) {
  const blocks = (layout ?? []).filter(isAccordion)
  if (blocks.length === 0) return null

  const lists = await Promise.all(blocks.map((b) => loadAccordionFaqs(b)))
  const seen = new Set<Faq['id']>()
  const faqs = lists.flat().filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)))
  if (faqs.length === 0) return null

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJsonLdItems(faqs) }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
}
