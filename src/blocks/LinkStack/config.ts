import type { Block, Condition, GroupField, SelectField } from 'payload'

import { linkField, scarcityRef } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/** Icons a link row may show (Phosphor bold, inlined in Component.tsx; no icon dependency). */
export const LINK_STACK_ICONS = [
  { label: 'Chart (results / the work)', value: 'chart-line-up' },
  { label: 'Quote marks (clients / testimonials)', value: 'quotes' },
  { label: 'Envelope (newsletter / email)', value: 'envelope-simple' },
  { label: 'Document (article / case study / resource)', value: 'file-text' },
  { label: 'Arrow (anything else)', value: 'arrow-right' },
] as const

export type LinkStackIcon = (typeof LINK_STACK_ICONS)[number]['value']

const iconField = (defaultValue: LinkStackIcon, condition?: Condition): SelectField => ({
  name: 'icon',
  type: 'select',
  label: 'Icon',
  required: true,
  defaultValue,
  options: LINK_STACK_ICONS.map(({ label, value }) => ({ label, value })),
  admin: { width: '40%', isClearable: false, condition, description: 'The small wine icon at the start of the row.' },
})

const latestOn: Condition = (_d, siblingData) => (siblingData as { latestCaseStudy?: boolean } | undefined)?.latestCaseStudy !== false
const pushOn: Condition = (_d, siblingData) => (siblingData as { show?: boolean } | undefined)?.show === true

/** `linkField` with an extra admin condition (hidden fields are not validated in payload@3.91.0). */
const withCondition = (field: GroupField, condition: Condition): GroupField => ({
  ...field,
  admin: { ...field.admin, condition },
})

/**
 * LinkStack block (SCHEMA §8.5 item 21): p17 Link-in-Bio, the whole page in one
 * section. Design order: identity → Book a call (dominant, slots) → Follow
 * (socials) → On the site (links, latest case study, current push).
 *
 * Nothing here holds a number: the identity metric comes ONLY from the latest
 * PUBLISHED case study (R3), the capacity line from the `scarcity` global, the
 * social profiles from Site settings. One variant.
 */
export const LinkStack: Block = {
  slug: 'linkStack',
  interfaceName: 'LinkStackBlock',
  labels: { singular: 'Link stack (link in bio)', plural: 'Link stacks' },
  fields: [
    {
      name: 'identity',
      type: 'group',
      label: 'Identity strip (top)',
      admin: {
        description:
          'The grey strip with the logo. It shows the headline result of the most recently published case study; while none is published, it shows the fallback line instead.',
      },
      fields: [
        {
          name: 'showStudyMetric',
          type: 'checkbox',
          label: 'Show the latest case study result',
          defaultValue: true,
          admin: {
            description:
              'The big number (e.g. "+212%") is taken from the newest published case study. It is never typed here. Untick to always show the fallback line.',
          },
        },
        {
          name: 'fallbackLine',
          type: 'text',
          label: 'Fallback line',
          required: true,
          maxLength: 90,
          admin: {
            description:
              'Shown instead of the result while no case study is published (or when the box above is unticked). A short positioning line, never a made-up number.',
          },
        },
      ],
    },
    {
      name: 'primary',
      type: 'group',
      label: 'Main button (Book a call)',
      admin: { description: 'The big dark button at the top: the one thing most visitors should do.' },
      fields: [
        linkField({ name: 'link', label: 'Button', required: true }),
        scarcityRef({
          name: 'capacity',
          label: 'Capacity line',
          defaultValue: 'slots-line',
          description:
            'Shown under the button: the statement in large type with its reason quietly beneath. Numbers and wording are edited once, in "Capacity & scarcity". Choose "None" to hide it.',
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showSocials',
          type: 'checkbox',
          label: 'Show social profiles',
          defaultValue: true,
          admin: {
            width: '40%',
            description: 'Profiles come from Site settings > Brand & contact > Social profiles, in that order.',
          },
        },
        {
          name: 'followLabel',
          type: 'text',
          label: 'Social section label',
          defaultValue: 'Follow',
          maxLength: 30,
          admin: { width: '60%', description: 'Small uppercase label above the social profiles.' },
        },
      ],
    },
    {
      name: 'siteLabel',
      type: 'text',
      label: 'Site links section label',
      defaultValue: 'On the site',
      maxLength: 30,
      admin: { description: 'Small uppercase label above the links below.' },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Site links',
      maxRows: 8,
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        components: { RowLabel: rowLabel(['link.label'], 'Link') },
        description: 'e.g. The work, Clients, Newsletter. Drag to reorder.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [iconField('arrow-right')],
        },
        linkField({ name: 'link', label: 'Link', required: true }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'latestCaseStudy',
          type: 'checkbox',
          label: 'Add a link to the latest case study',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Links to the newest published case study, after the links above. Hidden while none is published.',
          },
        },
        {
          name: 'latestCaseStudyLabel',
          type: 'text',
          label: 'Case study link text',
          defaultValue: 'Case study',
          maxLength: 40,
          admin: { width: '50%', condition: latestOn },
        },
      ],
    },
    {
      name: 'currentPush',
      type: 'group',
      label: 'Current push (optional)',
      admin: {
        description: 'One extra link for whatever you are promoting right now (a guide, a campaign). Shown last.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              label: 'Show the current push',
              defaultValue: false,
              admin: { width: '60%' },
            },
            iconField('file-text', pushOn),
          ],
        },
        withCondition(linkField({ name: 'link', label: 'Link', required: true }), pushOn),
      ],
    },
  ],
}
