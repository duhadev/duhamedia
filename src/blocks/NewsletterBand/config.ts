import type { Block } from 'payload'

import { headlineFields, linkField, neverShown } from '../../fields'

/**
 * NewsletterBand block (SCHEMA §8.4 item 15), `band` variant only: the grey
 * newsletter band on case studies, Work and Services (heading, quiet line,
 * inline email + dark "Join"). The `cross-sell` variant (p18) is added by the
 * lead-magnet unit. The signup form itself is NOT a block field: it is the one
 * form chosen in Site settings > Newsletter & closers. Zero-leakage pages
 * cannot hold this block (rejected by the Pages `zeroLeakage` hook).
 */
export const NewsletterBand: Block = {
  slug: 'newsletterBand',
  interfaceName: 'NewsletterBandBlock',
  labels: { singular: 'Newsletter band', plural: 'Newsletter bands' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'band',
      options: [
        { label: 'Band (heading, quiet line, email + Join)', value: 'band' },
        { label: 'Cross-sell (delivered message + newsletter box, lead magnet page)', value: 'cross-sell' },
      ],
      admin: { description: 'How the newsletter section looks.' },
    },
    ...headlineFields({
      required: false,
      accent: false, // rendered in --accent-primary = ink, same as the heading
      description:
        'The short heading. Leave empty to use the default from Site settings > Newsletter & closers (and its default line).',
    }),
    {
      name: 'line',
      type: 'text',
      admin: {
        description:
          'The quiet line under the heading. If the heading is left empty, the default line from Site settings is used instead.',
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Join',
      admin: { description: 'Text on the dark sign-up button. Defaults to "Join".' },
    },
    {
      name: 'delivered',
      type: 'group',
      label: 'Delivered message (cross-sell only)',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'cross-sell',
        description: 'The confirmation shown above the newsletter box. On the lead magnet page this is filled from the lead magnet itself.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Sent', admin: { description: 'Small line above the heading.' } },
        { name: 'heading', type: 'text', admin: { description: 'e.g. "Check your inbox. It\'s on the way."' } },
        // Hidden: CrossSell renders it in --accent-primary = ink, same as the heading.
        { name: 'accentPhrase', type: 'text', label: 'Accent phrase', admin: { condition: neverShown, description: 'Optional: one word or phrase from the heading to show in the accent colour.' } },
        { name: 'body', type: 'textarea', admin: { description: 'e.g. "If it\'s not there in five minutes, check spam, then email us."' } },
        { name: 'crossSellLine', type: 'text', label: 'Lead-in to the newsletter box', admin: { description: 'e.g. "While you\'re here:". Optional.' } },
      ],
    },
    {
      ...linkField({
        name: 'crossSellLink',
        label: 'Newsletter link (cross-sell only)',
        description: 'Where the dark button goes. Leave empty to use the published Newsletter page. Button text: the link text here, else the "Button label" above, else "Join the newsletter".',
      }),
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'cross-sell',
        description: 'Where the dark button goes. Leave empty to use the published Newsletter page.',
      },
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'grey',
      options: [
        { label: 'Grey band', value: 'grey' },
        { label: 'White, with a thin line underneath', value: 'light' },
      ],
      admin: { description: 'Background of the band. The Work page uses white; the others use grey.' },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Roomier', value: 'roomy' },
      ],
      admin: { description: 'Space above and below. The Services page uses Roomier.' },
    },
  ],
}
