import { BoldFeature, InlineToolbarFeature, ItalicFeature, lexicalEditor, OrderedListFeature, ParagraphFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import type { Block, Condition, Field } from 'payload'

import { eyebrowField, headlineFields, linkField, metricFields, richTextLinkFeature } from '../../fields'

const isRow: Condition = (_d, s) => (s?.variant ?? 'row') === 'row'
const isClientVoice: Condition = (_d, s) => s?.variant === 'client-voice'

/** Same small editor as `case-studies.clientVoice.doDifferently` (same Lexical state shape, so the doc group passes straight through). */
const asideEditor = lexicalEditor({
  features: [ParagraphFeature(), BoldFeature(), ItalicFeature(), UnorderedListFeature(), OrderedListFeature(), richTextLinkFeature(), InlineToolbarFeature()],
})

/** Shows a field only for the `row` variant (existing field names/shapes are untouched). */
const rowOnly = (f: Field): Field => ({ ...f, admin: { ...(f as { admin?: object }).admin, condition: isRow } }) as Field

/**
 * TestimonialRow block (SCHEMA §8.2 item 9). `row` = homepage §Testimonials;
 * `client-voice` = p2 §Client voice (S4-10). `leadMetric` (p16 Social proof) and `ctaStyle` (p15) added in S6-7.
 *
 * `fallbackMetric` reuses the `metricFields()` shape with `required: false`:
 * the whole fallback is optional (R3: with nothing set, the row reflows to
 * testimonials only), so its value/label must not block publishing when the
 * editor leaves it empty. Once one is filled the component needs both (it
 * renders nothing for a half metric).
 */

export const TestimonialRow: Block = {
  slug: 'testimonialRow',
  interfaceName: 'TestimonialRowBlock',
  labels: { singular: 'Testimonial row', plural: 'Testimonial rows' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'row',
      options: [
        { label: 'Row (testimonial cards + "A study in full")', value: 'row' },
        { label: 'Client voice (case study: one testimonial + what we\'d do differently)', value: 'client-voice' },
      ],
      admin: { description: 'The layout. More layouts arrive with the pages that need them.' },
    },
    rowOnly(
      eyebrowField({
        defaultTick: false,
        description: 'Small uppercase line above the testimonial cards, e.g. "What clients say".',
      }),
    ),
    ...headlineFields({
      required: false,
      description: 'The section headline, e.g. "Proof, in their words."',
      accent: false, // rendered in --accent-primary = ink, same as the headline
    }).map(rowOnly),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      maxDepth: 2,
      admin: {
        description:
          'Pick 1 to 3 testimonials, in the order shown. Only published testimonials appear on the site; drafts are skipped.',
        condition: isRow,
      },
    },
    {
      name: 'studyCard',
      type: 'group',
      label: '"A study in full" card',
      admin: {
        description:
          'The case-study card beside the testimonials. It only ever shows a PUBLISHED case study. Until one is published, the quiet figure below is shown instead, or nothing.',
        condition: isRow,
      },
      fields: [
        { name: 'show', type: 'checkbox', label: 'Show this card', defaultValue: true },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'A study in full',
          admin: { description: 'Small uppercase line above the card.', condition: (_d, s) => s?.show !== false },
        },
        {
          name: 'source',
          type: 'select',
          required: true,
          defaultValue: 'featured',
          options: [
            { label: 'The featured case study', value: 'featured' },
            { label: 'A case study I choose', value: 'manual' },
          ],
          admin: {
            description: '"Featured" uses the newest published study ticked "Featured".',
            condition: (_d, s) => s?.show !== false,
          },
        },
        {
          name: 'caseStudy',
          type: 'relationship',
          relationTo: 'case-studies',
          // 2 so the study's `client` populates for the kicker (nested population is capped at maxDepth).
          maxDepth: 2,
          admin: {
            description: 'Shown only once this study is published.',
            condition: (_d, s) => s?.show !== false && s?.source === 'manual',
          },
        },
        {
          name: 'readLabel',
          type: 'text',
          label: 'Link text',
          defaultValue: 'Read the study',
          admin: { description: 'Underlined text at the bottom of the card.', condition: (_d, s) => s?.show !== false },
        },
        {
          name: 'fallbackMetric',
          type: 'group',
          label: 'Quiet figure while no study is published',
          admin: {
            description:
              'Optional. Shown in the card slot until a case study is published. Leave empty to show testimonials only. Only enter a real, approved figure.',
            condition: (_d, s) => s?.show !== false,
          },
          // The figure is always wine here; an accent toggle would do nothing.
          fields: metricFields({ required: false, accent: false }),
        },
      ],
    },
    rowOnly(
      linkField({
        name: 'cta',
        label: 'Link under the cards',
        description: 'Optional, e.g. "All studies". Leave empty to hide.',
      }),
    ),
    {
      name: 'ctaStyle',
      type: 'select',
      label: 'Button style',
      defaultValue: 'link',
      options: [
        { label: 'Underlined text link', value: 'link' },
        { label: 'Primary button, below the row (campaign pages)', value: 'button' },
      ],
      admin: { description: 'How the link above is shown. Button = the primary call-to-action under the whole row.', condition: isRow },
    },
    {
      name: 'leadMetric',
      type: 'group',
      label: 'Lead figure beside the quote',
      admin: {
        description:
          'Optional. A big figure tile (e.g. subscriber count) placed beside the testimonial(s). When set, the "A study in full" card is not shown. Needs both a number and a label. Only enter a real, approved figure.',
        condition: isRow,
      },
      // The figure is always wine here; an accent toggle would do nothing.
      fields: metricFields({ required: false, accent: false }),
    },
    // ---- client-voice variant (p2 case-study template). `clientVoice` mirrors `case-studies.clientVoice`
    // field-for-field so the template can pass the study's group straight through.
    {
      name: 'clientVoice',
      type: 'group',
      label: 'Client voice',
      admin: { description: 'On a case-study template this is filled from the study itself. Fill it by hand only for a standalone use.', condition: isClientVoice },
      fields: [
        {
          name: 'testimonial',
          type: 'relationship',
          relationTo: 'testimonials',
          maxDepth: 2,
          admin: { description: "The client's testimonial. A video testimonial plays first; a text one shows as a quote. Only a published testimonial appears; if none, this section is omitted." },
        },
        { name: 'doDifferently', type: 'richText', label: "What we'd do differently", editor: asideEditor },
        { name: 'phaseMapping', type: 'textarea', label: 'How this maps to our phases' },
        linkField({ name: 'link', label: 'Link', description: 'Optional button under the phases box, e.g. "See the two tracks".' }),
      ],
    },
    {
      type: 'row',
      admin: { condition: isClientVoice },
      fields: [
        {
          name: 'differentlyNumber',
          type: 'text',
          label: 'Small number',
          defaultValue: '04',
          admin: { width: '20%', description: 'The small wine number above the heading. Clear it to hide.' },
        },
        {
          name: 'differentlyHeading',
          type: 'text',
          label: 'Heading',
          defaultValue: "What we'd do differently",
          admin: { width: '80%' },
        },
      ],
    },
    {
      name: 'phaseLabel',
      type: 'text',
      label: 'Phases box label',
      defaultValue: 'How this maps to our phases',
      admin: { description: 'Small grey label at the top of the phases box.', condition: isClientVoice },
    },
  ],
}
