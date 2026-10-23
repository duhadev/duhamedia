import type { Block } from 'payload'

import { eyebrowField, linkField } from '../../fields'

/**
 * PostList block (SCHEMA §8.5 item 22, X8): p16 §Sample content. Lists the
 * newest PUBLISHED posts of one track: the latest as a featured card, the
 * rest as "Previously" rows, plus an optional archive link. Server-side
 * query, published only; nothing here holds an issue (all text comes from
 * the posts themselves). One variant.
 */
export const PostList: Block = {
  slug: 'postList',
  interfaceName: 'PostListBlock',
  labels: { singular: 'Post list (recent issues)', plural: 'Post lists' },
  fields: [
    eyebrowField({ description: 'Small line above the list, e.g. "Recent issues".' }),
    {
      name: 'track',
      type: 'select',
      required: true,
      defaultValue: 'newsletter-issue',
      options: [
        { label: 'Newsletter issues', value: 'newsletter-issue' },
        { label: 'Dev SEO articles', value: 'dev-seo' },
        { label: 'Marketing SEO articles', value: 'mkt-seo' },
      ],
      admin: { description: 'Which kind of post to list. Only published posts ever appear.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featureLatest',
          type: 'checkbox',
          label: 'Feature the latest',
          defaultValue: true,
          admin: {
            width: '40%',
            description: 'Show the newest post as a large card with the "New" badge; the rest go under "Previously".',
          },
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '30%', step: 1, description: 'Most posts shown, including the featured one (1 to 12).' },
        },
      ],
    },
    linkField({
      name: 'archiveLink',
      label: 'Archive link',
      description: 'Optional, e.g. "Full archive →". Leave empty to hide it.',
    }),
    {
      name: 'labels',
      type: 'group',
      label: 'Wording',
      admin: { description: 'The small fixed words in the list. Defaults match the design.' },
      fields: [
        { name: 'latestLabel', type: 'text', defaultValue: 'Latest —', admin: { description: 'Before the issue number on the featured card, e.g. "Latest — Issue 012".' } },
        { name: 'newBadge', type: 'text', defaultValue: 'New', admin: { description: 'The badge on the featured card.' } },
        { name: 'previouslyLabel', type: 'text', defaultValue: 'Previously' },
        { name: 'countSuffix', type: 'text', defaultValue: 'issues', admin: { description: 'After the count, e.g. "11 issues".' } },
        { name: 'readLabel', type: 'text', defaultValue: 'Read issue', admin: { description: 'Button on the featured card (the issue number is added: "Read issue 012").' } },
        { name: 'issueWord', type: 'text', defaultValue: 'Issue', admin: { description: 'Printed with the number: "Issue 012" / "ISSUE 011".' } },
      ],
    },
    {
      name: 'emptyHeading',
      type: 'text',
      required: true,
      defaultValue: 'The first issue is on its way.',
      admin: { description: 'Shown while no post of this kind is published. State what readers get, never "coming soon".' },
    },
    {
      name: 'emptyBody',
      type: 'textarea',
      defaultValue: 'Each issue is one store problem, the number it moved and what we would do differently. Join above and the first one lands in your inbox.',
      admin: { description: 'The line under the empty-state heading.' },
    },
  ],
}
