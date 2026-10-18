import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { staffContentAccess } from '../access'
import { contentVersions, richTextLinkFeature, sortOrderField } from '../fields'
import { revalidateTagHooks } from '../hooks/revalidateTag'

/** SCHEMA §10: public reads are cached under the `faqs` tag. */
const revalidate = revalidateTagHooks('faqs')

/**
 * `faqs` (SCHEMA.md §2.5, §6.7, §4.3, §5, X10 — Gate S approved 2026-10-17).
 *
 * p11 FAQ page (four category groups; Pricing & Contracts opens with the
 * direct pricing answer, CLAUDE.md rule 5 exception) and the FAQ mini blocks
 * on p4, p5, p6.
 * X10: placement lives on the `AccordionFAQ` block (ordered hasMany → faqs),
 * NOT on this collection; `listOnFaqPage` keeps mini-only questions (e.g. p4
 * "I already have a store. Which door?") off p11.
 * X11: post FAQs (p13/p14) are an inline array on `posts`, not docs here.
 *
 * `answer` uses a deliberately small Lexical editor (paragraphs, bold,
 * italic, lists, links): an accordion answer has no designed headings,
 * images or embedded documents, and the default editor's Relationship /
 * Upload features could reference any collection (incl. `users`).
 * Links: custom URLs or internal links to pages, case studies, posts and
 * lead magnets (`richTextLinkFeature`, C10; src/fields).
 *
 * Drafts on (SCHEMA §5.1). Revalidation (tag `faqs`) is the integrator's.
 */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'listOnFaqPage', 'sortOrder', '_status'],
    description: 'Questions and answers for the FAQ page and the FAQ sections on service pages.',
  },
  defaultSort: ['category', 'sortOrder'],
  access: staffContentAccess,
  versions: contentVersions,
  hooks: {
    afterChange: [revalidate.afterChange],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          richTextLinkFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: { description: 'Keep it direct. Links are allowed, e.g. to Book a Call or Contact.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Pricing & Contracts', value: 'pricing-contracts' },
        { label: 'Builds', value: 'builds' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Process & Trust', value: 'process-trust' },
      ],
      admin: { position: 'sidebar', description: 'The FAQ page group this question sits in.' },
    },
    {
      name: 'listOnFaqPage',
      type: 'checkbox',
      label: 'List on the FAQ page',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Untick for questions that should only appear in a service-page FAQ section.',
      },
    },
    sortOrderField(
      'Order inside its category on the FAQ page. Lower numbers come first; the first Pricing & Contracts question opens by default.',
    ),
  ],
}
