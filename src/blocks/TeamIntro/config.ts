import type { Block } from 'payload'

import { eyebrowField, headlineFields, linkField } from '../../fields'

/**
 * TeamIntro block (SCHEMA §8.3 item 12). Homepage ships two variants:
 * - `intro`        p1 §Founder #1 "Who you'd work with": heading, body, photo, link.
 * - `founder-card` p1 §Founder #2 "One founder, no layers.": heading, body,
 *   optional pull quote, link as a button, then the team member's card
 *   (photo, name, role, bio, socials). R12: no
 *   "Latest posts". R17: copy is single-founder.
 * Later pages (About) reuse these variants or append new options.
 */

const isIntro = (_data: unknown, siblingData: { variant?: string } | undefined): boolean =>
  (siblingData?.variant ?? 'intro') === 'intro'
const isFounderCard = (_data: unknown, siblingData: { variant?: string } | undefined): boolean =>
  siblingData?.variant === 'founder-card'

export const TeamIntro: Block = {
  slug: 'teamIntro',
  interfaceName: 'TeamIntroBlock',
  labels: { singular: 'Team intro', plural: 'Team intros' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'intro',
      options: [
        { label: 'Intro (text beside a large photo)', value: 'intro' },
        { label: 'Founder card (headline, text and a person card with social links)', value: 'founder-card' },
      ],
      admin: { description: 'Which layout to use.' },
    },
    eyebrowField({
      defaultTick: false,
      description: 'Small grey uppercase line above the headline, e.g. "Who you\'d work with". Optional.',
    }),
    ...headlineFields({ description: 'The section headline.' }),
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'The paragraph under the headline.' },
    },
    {
      name: 'pullQuote',
      type: 'textarea',
      admin: {
        condition: isFounderCard,
        description: 'Optional. One line from your story, shown large in the accent colour.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      admin: {
        condition: isIntro,
        description: 'Portrait shown beside (desktop) or under (mobile) the text. Portrait 4:5 works best. Leave empty to show the text only.',
      },
    },
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'team-members',
      maxDepth: 2,
      required: true,
      admin: {
        condition: isFounderCard,
        description:
          'The person shown on the card (photo, name, role, social links come from their Team members entry). They must be published, otherwise the card does not appear.',
      },
    },
    linkField({
      name: 'link',
      label: 'Link',
      description:
        'Optional link under the text, e.g. "More about us →". On the founder card it shows as a button, e.g. "Book a call with me →". Leave empty for none.',
    }),
  ],
}
