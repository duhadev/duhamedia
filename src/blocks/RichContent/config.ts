import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { eyebrowField, headlineFields, richTextLinkFeature } from '../../fields'

/**
 * Article body editor: every feature the article typography styles.
 * Headings are limited to H2-H4 (the page's only H1 is the Hero; the block
 * heading is the section H2). Images carry a caption ("Fig. 1 - ...").
 */
const articleEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    richTextLinkFeature(),
    UploadFeature({
      enabledCollections: ['media'],
      maxDepth: 1,
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
              admin: { description: 'Shown under the image, e.g. "Fig. 1 — Checkout before the rebuild".' },
            },
          ],
        },
      },
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

/**
 * RichContent (SCHEMA §8.3 item 13). This unit ships ONLY the `article`
 * variant (p2 case-study body, p8 About body, p13/p14 article body);
 * `legal` and `band` (and `lastUpdated`, `facts`, `link`) are appended later.
 */
export const RichContent: Block = {
  slug: 'richContent',
  interfaceName: 'RichContentBlock',
  labels: { singular: 'Rich content', plural: 'Rich content blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [{ label: 'Article (long-form text with numbered sections and figures)', value: 'article' }],
      admin: { description: 'The text layout. Legal-document and grey-band layouts arrive with their pages.' },
    },
    eyebrowField({ description: 'Optional small uppercase line above the heading.' }),
    ...headlineFields({
      required: false,
      description: 'Optional heading above the text. Leave empty when the text starts with its own section headings.',
    }),
    {
      name: 'numberSections',
      type: 'checkbox',
      label: 'Number the section headings',
      defaultValue: true,
      admin: {
        description:
          'Adds 01, 02, 03… above every big (H2) heading in the text, in order. Untick for text where numbers would be wrong.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: articleEditor,
      admin: {
        description:
          'Use "Heading 2" for each section title (they are numbered). Type "/" or use the toolbar to add an image with a caption, a quote or a divider.',
      },
    },
  ],
}
