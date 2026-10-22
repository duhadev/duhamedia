import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields } from '../../fields'

/**
 * ReviewWall block (SCHEMA §8.2 item 8, §2.2, §6.4). Variant shipped so far:
 * `feed` = p7 §Testimonial feed (Testimonials.dc.html, desktop + mobile):
 * the brand showcase, one testimonial per card. Video testimonials render as
 * a poster tile (headline metric on the poster, client logo when set) beside
 * the quote; written quotes and Google / LinkedIn reviews render as text
 * cards (paired two-up on wide screens). "Read the full case study" appears
 * per card only when the testimonial's case study is PUBLISHED (R3) and the
 * toggle below is on. Load More, no page numbers.
 *
 * `wall` (p19) arrives with the Review Hub page: it will add its own variant
 * option plus `inserts` / `wallNote` (SCHEMA §8.2).
 */

const isAll: Condition = (_d, s) => (s?.source ?? 'all') === 'all'
const isManual: Condition = (_d, s) => s?.source === 'manual'
const linksOn: Condition = (_d, s) => s?.showStudyLinks !== false

export const ReviewWall: Block = {
  slug: 'reviewWall',
  interfaceName: 'ReviewWallBlock',
  labels: { singular: 'Review wall', plural: 'Review walls' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'feed',
      options: [{ label: 'Feed (video tiles, quotes and reviews, with "Load more")', value: 'feed' }],
      admin: { description: 'The layout. More layouts arrive with the pages that need them.' },
    },
    eyebrowField({
      defaultTick: true,
      description: 'Optional small uppercase line above the feed. Leave empty on the Testimonials page (the hero above already says it).',
    }),
    ...headlineFields({
      required: false,
      description: 'Optional headline above the feed. Leave empty on the Testimonials page.',
    }),
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All published testimonials (in their "Order" number)', value: 'all' },
        { label: 'Pick testimonials by hand', value: 'manual' },
      ],
      admin: {
        description:
          'Which testimonials appear. Only PUBLISHED testimonials ever show; a draft is skipped even if picked here.',
      },
    },
    {
      name: 'sourceFilter',
      type: 'select',
      hasMany: true,
      label: 'Only these kinds',
      options: [
        { label: 'Direct client quotes', value: 'direct' },
        { label: 'Google reviews', value: 'google-review' },
        { label: 'LinkedIn', value: 'linkedin' },
      ],
      admin: {
        condition: isAll,
        description: 'Optional. Leave empty to show every kind. Tick one or more to show only those.',
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      maxDepth: 2,
      admin: {
        condition: isManual,
        description: 'Pick testimonials in the order shown. Drag to reorder. Drafts are skipped on the site until they are published.',
      },
    },
    {
      name: 'pageSize',
      type: 'number',
      label: 'Cards per load',
      min: 1,
      max: 24,
      defaultValue: 6,
      admin: {
        step: 1,
        description: 'How many cards show at first, and how many more each "Load more" click adds. The button hides when everything is shown.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showStudyLinks',
          type: 'checkbox',
          label: 'Show "Read the full case study" links',
          defaultValue: true,
          admin: {
            width: '50%',
            description:
              'Each card links to the case study set on its testimonial, only once that study is PUBLISHED. Untick to hide every link.',
          },
        },
        {
          name: 'studyLinkLabel',
          type: 'text',
          label: 'Case study link text',
          defaultValue: 'Read the full case study',
          admin: { width: '50%', condition: linksOn },
        },
      ],
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Card labels',
      admin: { description: 'The small tags on the cards and the play button text read by screen readers.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'video',
              type: 'text',
              defaultValue: 'Video',
              admin: { width: '25%', description: 'Tag on video cards, followed by the metric label, e.g. "Video · Revenue, 12 mo".' },
            },
            {
              name: 'googleReview',
              type: 'text',
              defaultValue: 'Google review',
              admin: { width: '25%', description: 'Tag on Google reviews.' },
            },
            {
              name: 'linkedin',
              type: 'text',
              defaultValue: 'LinkedIn',
              admin: { width: '25%', description: 'Tag on LinkedIn reviews.' },
            },
            {
              name: 'play',
              type: 'text',
              defaultValue: 'Play the video testimonial from',
              admin: { width: '25%', description: 'Screen-reader text for the play button; the person\'s name is added after it.' },
            },
          ],
        },
      ],
    },
    {
      name: 'loadMore',
      type: 'group',
      label: '"Load more" button',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Button text', defaultValue: 'Load more', admin: { width: '34%' } },
            { name: 'loadingLabel', type: 'text', label: 'Button text while loading', defaultValue: 'Loading…', admin: { width: '33%' } },
            {
              name: 'errorLabel',
              type: 'text',
              label: 'Message if loading fails',
              defaultValue: 'Could not load more testimonials. Try again.',
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    {
      name: 'emptyNote',
      type: 'textarea',
      label: 'Note when there is nothing to show',
      admin: {
        description:
          'Optional. Shown as one quiet line when no published testimonial matches. Leave empty to hide the whole section instead.',
      },
    },
  ],
}
