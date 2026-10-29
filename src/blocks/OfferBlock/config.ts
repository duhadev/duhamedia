import { BoldFeature, InlineToolbarFeature, ItalicFeature, lexicalEditor, OrderedListFeature, ParagraphFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField, richTextLinkFeature, scarcityRef } from '../../fields'

/** Small editor: paragraphs, bold, italic, lists, links (an offer body has no headings, images or embeds). */
const bodyEditor = lexicalEditor({
  features: [ParagraphFeature(), BoldFeature(), ItalicFeature(), UnorderedListFeature(), OrderedListFeature(), richTextLinkFeature(), InlineToolbarFeature()],
})

/**
 * OfferBlock (SCHEMA §8.1 item 4; p15 Campaign LP "Offer block", the only user). One layout, no
 * variants: eyebrow, headline, body, one button, and the capacity line.
 *
 * Capacity (CLAUDE.md rule 2): the line is a scarcityRef into the `scarcity` global, rendered as a
 * loud statement with its reason quiet beneath. It is never typed here, and there are no countdown
 * timers: capacity is the only true urgency and it carries its reason.
 */
export const OfferBlock: Block = {
  slug: 'offerBlock',
  interfaceName: 'OfferBlockBlock',
  labels: { singular: 'Offer', plural: 'Offers' },
  fields: [
    eyebrowField({ defaultTick: false, description: 'Small uppercase line above the headline, e.g. "The offer".' }),
    ...headlineFields({
      description: 'The promise, stated as scope (what the prospect gets), not hype.',
      accent: false, // rendered in --accent-primary = ink, same as the headline
    }),
    {
      name: 'body',
      type: 'richText',
      editor: bodyEditor,
      admin: {
        description:
          'What the prospect gets, in deliverable terms, with the number first. No countdown timers or fake deadlines. Never put a price here; prices belong in a small inline note elsewhere.',
      },
    },
    linkField({
      name: 'cta',
      label: 'Button',
      required: true,
      description: 'The button text and where it goes, e.g. "Book a Call". The only call to action in this block.',
    }),
    scarcityRef({
      name: 'capacity',
      label: 'Capacity line',
      defaultValue: 'offer-line',
      description:
        'The capacity statement beside the button: a big line with its reason quietly beneath. Numbers and wording are edited once, in "Capacity & scarcity". Choose "None" to hide it.',
    }),
  ],
}
