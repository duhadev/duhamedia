import type { Block, Condition } from 'payload'

import { eyebrowField, headlineFields } from '../../fields'

/**
 * PhaseTimeline block (SCHEMA.md §8.3 item 11). This unit ships ONLY the
 * `accordion` variant (homepage §Process, Homepage.dc.html "Process": steps
 * grouped under up to three phase bars, one step open at a time). Later units
 * append `arc` / `build-run` / `engine-rollout` / `steps` to `variant.options`
 * together with their own fields (`phases.link`, `steps.tag`, `isSignOff`,
 * `outcomes`, `cta`).
 *
 * Binding rule (CLAUDE.md, SCHEMA §8.3): the LAST phase (the independence
 * handover) always renders at full visual weight. There is deliberately no
 * field to turn that off.
 */

/** Fields only some layouts show. `accordion` renders no phase body. */
const notAccordion: Condition = (_data, _siblingData, { blockData }) =>
  (blockData as { variant?: string } | undefined)?.variant !== 'accordion'

export const PhaseTimeline: Block = {
  slug: 'phaseTimeline',
  interfaceName: 'PhaseTimelineBlock',
  labels: { singular: 'Phase timeline', plural: 'Phase timelines' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'accordion',
      options: [{ label: 'Accordion (steps grouped by phase, one open at a time)', value: 'accordion' }],
      admin: {
        isClearable: false,
        description: 'The timeline layout. More layouts arrive with the pages that need them.',
      },
    },
    eyebrowField({
      defaultTick: false,
      description: 'Small uppercase line above the headline, e.g. "How it runs".',
    }),
    ...headlineFields({ description: 'The section headline, e.g. "Three phases. The last one is the point."' }),
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Optional short paragraph under the headline.' },
    },
    {
      name: 'phases',
      type: 'array',
      label: 'Phases',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Phase', plural: 'Phases' },
      admin: {
        initCollapsed: false,
        description:
          'Up to three, in order. Each phase is a labelled bar its steps sit under. The LAST phase is always shown in the accent colour (the independence handover); that cannot be switched off.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              admin: { width: '30%', description: 'Shown before the title, e.g. "Phase 1".' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '70%', description: 'e.g. "Build foundation". Keep it short: it is cut off with "…" when the column is narrow.' },
            },
          ],
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            condition: notAccordion,
            description: 'Short description of the phase (not shown in the accordion layout).',
          },
        },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      maxRows: 10,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        initCollapsed: true,
        description:
          'In order. Each step sits under the phase you pick. The first step starts open; on phones the step in the middle of the screen opens as visitors scroll.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              admin: { width: '20%', description: 'e.g. "01".' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                description: 'e.g. "Intake". Keep it to about 14 characters: on desktop it runs vertically when closed.',
              },
            },
            {
              name: 'phase',
              type: 'select',
              required: true,
              defaultValue: '1',
              options: [
                { label: 'Phase 1 (first phase)', value: '1' },
                { label: 'Phase 2 (second phase)', value: '2' },
                { label: 'Phase 3 (third phase)', value: '3' },
              ],
              admin: { width: '30%', isClearable: false, description: 'Which phase bar this step sits under.' },
            },
          ],
        },
        {
          name: 'detail',
          type: 'textarea',
          admin: {
            description: 'Shown when the step is open. One or two sentences (about 160 characters fits best).',
          },
        },
      ],
    },
    {
      name: 'closingLine',
      type: 'text',
      label: 'Closing line',
      admin: { description: 'Optional quiet line under the timeline.' },
    },
  ],
}
