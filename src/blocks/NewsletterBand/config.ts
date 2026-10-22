import type { Block } from 'payload'

import { headlineFields } from '../../fields'

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
      options: [{ label: 'Band (heading, quiet line, email + Join)', value: 'band' }],
      admin: { description: 'How the newsletter section looks.' },
    },
    ...headlineFields({
      required: false,
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
