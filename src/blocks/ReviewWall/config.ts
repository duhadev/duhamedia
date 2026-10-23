import type { Block, Condition, RelationshipFieldManyValidation } from 'payload'

import { eyebrowField, headlineFields, metricFields, scarcityRef } from '../../fields'

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
 * `wall` (p19 §Review wall, Review Hub.dc.html): the same testimonials as a
 * staggered masonry (CSS columns 3 / 2 / 1), written cards only (stars and the
 * source tag are data), with optional `inserts` between cards: a typographic
 * metric tile, a client-name tile, or a scarcity tile (the loud number + its
 * quiet reason, read from "Capacity & scarcity", never typed here). No Load More.
 */

const isAll: Condition = (_d, s) => (s?.source ?? 'all') === 'all'
const isManual: Condition = (_d, s) => s?.source === 'manual'
/** Hand-pick needs at least one testimonial (hidden fields are not validated, so this only fires in hand-pick mode). */
const validatePicked: RelationshipFieldManyValidation = (value, { siblingData }) => {
  try {
    if ((siblingData as { source?: string } | undefined)?.source !== 'manual') return true
    if (Array.isArray(value) && value.length > 0) return true
    return 'Pick at least one testimonial, or switch "Which testimonials appear" to "All published testimonials".'
  } catch {
    return true
  }
}
const isFeed: Condition = (_d, s) => s?.variant !== 'wall'
const isWall: Condition = (_d, s) => s?.variant === 'wall'
const linksOn: Condition = (_d, s) => s?.variant !== 'wall' && s?.showStudyLinks !== false
const kindIs =
  (kind: string): Condition =>
  (_d, s) =>
    s?.kind === kind

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
      options: [
        { label: 'Feed (video tiles, quotes and reviews, with "Load more")', value: 'feed' },
        { label: 'Wall (staggered columns of review cards, with optional metric / client / capacity tiles)', value: 'wall' },
      ],
      admin: { description: 'The layout. Feed is the Testimonials page; Wall is the Review Hub.' },
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
      label: 'Which testimonials appear',
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
      validate: validatePicked,
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
        condition: isFeed,
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
            condition: isFeed,
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
              label: 'Google review',
              type: 'text',
              defaultValue: 'Google review',
              admin: { width: '25%', description: 'Tag on Google reviews.' },
            },
            {
              name: 'linkedin',
              label: 'LinkedIn',
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
      admin: { condition: isFeed },
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
      name: 'inserts',
      type: 'array',
      label: 'Tiles between the cards',
      maxRows: 6,
      admin: {
        condition: isWall,
        description:
          'Optional extra tiles dropped between the review cards: a headline number, a client name, or the capacity statement. Add, remove and drag to reorder.',
      },
      labels: { singular: 'Tile', plural: 'Tiles' },
      fields: [
        {
          name: 'kind',
          label: 'Tile type',
          type: 'select',
          required: true,
          defaultValue: 'metric',
          options: [
            { label: 'Headline number (metric)', value: 'metric' },
            { label: 'Client name / logo', value: 'client' },
            { label: 'Capacity statement (from Capacity & scarcity)', value: 'scarcity' },
          ],
        },
        {
          name: 'metric',
          type: 'group',
          label: 'Number',
          admin: { condition: kindIs('metric'), description: 'A result or count, never a price.' },
          fields: metricFields({ required: false }),
        },
        {
          name: 'client',
          type: 'relationship',
          relationTo: 'clients',
          maxDepth: 1,
          admin: {
            condition: kindIs('client'),
            description: 'Shows the client logo (or its name when there is no logo). Skipped while the client is a draft.',
          },
        },
        scarcityRef({
          name: 'statement',
          label: 'Statement',
          defaultValue: 'capacity',
          description:
            'Which statement from "Capacity & scarcity" to show. The number and its reason are always shown together; edit them there, not here.',
        }),
        {
          name: 'position',
          type: 'number',
          label: 'Place after card number',
          min: 0,
          defaultValue: 2,
          admin: {
            step: 1,
            description: '0 puts the tile first, 2 puts it after the second review card. A number past the last card puts it at the end.',
          },
        },
      ],
    },
    {
      name: 'wallNote',
      type: 'text',
      label: 'Small note under the wall',
      admin: {
        condition: isWall,
        description: 'Optional quiet line under the wall, e.g. where the reviews come from. Leave empty to hide.',
      },
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
