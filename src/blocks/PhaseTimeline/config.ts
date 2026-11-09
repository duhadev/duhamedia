import type { Block, Condition, TextFieldSingleValidation } from 'payload'

import { eyebrowField, headlineFields, linkField } from '../../fields'
import { rowLabel } from '../../components/admin/rowLabel'

/**
 * PhaseTimeline block (SCHEMA.md §8.3 item 11). Variants:
 * - `accordion` (B3, homepage §Process, Homepage.dc.html "Process"): steps
 *   grouped under up to three phase bars, one step open at a time.
 * - `arc` (S4, p4 Services Hub "The arc"): up to three phases, each with a
 *   body and a link. Uses `phases` only.
 * - `steps` (S4, p4 "How it starts"; p9 "What happens next" later): numbered
 *   step cards with a tag, "You leave with" outcomes, a closing line and a CTA.
 * - `build-run` (S4, p5 Shopify "Build run"): ink band of numbered steps with
 *   a short tag; sign-off steps carry a diamond on phones.
 * - `engine-rollout` (S4, p6 Marketing "Engine rollout"): ink band, one row of
 *   numbered steps with timing tags.
 * Each variant shows only its own fields (`admin.condition`).
 *
 * Binding rule (CLAUDE.md, SCHEMA §8.3): the LAST phase/step (the independence
 * handover) always renders at full visual weight. There is deliberately no
 * field to turn that off.
 */

type Variant = 'accordion' | 'arc' | 'steps' | 'build-run' | 'engine-rollout' | 'grid'

/** Admin condition: show the field only for the listed variants. */
const onlyFor =
  (...variants: Variant[]): Condition =>
  (_data, siblingData, { blockData }) => {
    // `blockData` is the nearest block row (payload@3.91.0 fields/hooks/
    // beforeChange/promise.js:246), for top-level block fields too; the
    // sibling fallback covers a top-level field if it is ever undefined.
    const variant =
      (blockData as { variant?: string } | undefined)?.variant ??
      (siblingData as { variant?: string } | undefined)?.variant
    return variants.includes((variant ?? 'accordion') as Variant)
  }

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
      options: [
        { label: 'Accordion (steps grouped by phase, one open at a time)', value: 'accordion' },
        { label: 'Arc (up to three phases, each with a description and a link)', value: 'arc' },
        { label: 'Step cards (numbered cards with "You leave with" outcomes and a button)', value: 'steps' },
        { label: 'Build run (dark band of numbered steps, sign-offs marked)', value: 'build-run' },
        { label: 'Engine rollout (dark band, one row of steps with timings)', value: 'engine-rollout' },
        { label: 'Grid (numbered cells in rows of four under phase bars, as the brochure)', value: 'grid' },
      ],
      admin: {
        isClearable: false,
        description: 'The timeline layout. Each layout shows only the fields it uses.',
      },
    },
    {
      name: 'gridLayout',
      type: 'select',
      label: 'Grid layout',
      defaultValue: 'stacked',
      options: [
        { label: 'Stacked (each phase bar over its own block of cells, as on Services)', value: 'stacked' },
        { label: 'One row (all steps in one row under the phase bars on wide screens, stacked below)', value: 'row' },
      ],
      admin: {
        condition: onlyFor('grid'),
        isClearable: false,
        description: 'One row: from 1280px wide the steps sit side by side, each phase bar spanning its steps. Narrower screens use the stacked layout. One row also shows the closing line and link below.',
      },
    },
    {
      name: 'anchorId',
      type: 'text',
      label: 'Section link name',
      admin: {
        condition: onlyFor('grid'),
        description: 'Lets other pages link straight to this section, e.g. "process" → /services#process. Letters, numbers and dashes only. Optional.',
      },
      validate: ((v) => !v || /^[a-z0-9-]+$/.test(String(v)) || 'Use lowercase letters, numbers and dashes only.') as TextFieldSingleValidation,
    },
    {
      ...eyebrowField({
        defaultTick: false,
        description: 'Small uppercase line above the headline, e.g. "How it runs".',
      }),
      admin: { condition: onlyFor('accordion', 'build-run', 'engine-rollout', 'grid') },
    },
    // Accent shows in wine on every layout except Accordion (ink on ink there).
    ...headlineFields({
      description: 'The section headline, e.g. "Three phases. The last one is the point."',
      accent: onlyFor('arc', 'steps', 'build-run', 'engine-rollout', 'grid'),
    }),
    {
      name: 'intro',
      type: 'textarea',
      admin: { condition: onlyFor('accordion', 'grid'), description: 'Optional short paragraph under the headline.' },
    },
    {
      name: 'phases',
      type: 'array',
      label: 'Phases',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Phase', plural: 'Phases' },
      admin: {
        components: { RowLabel: rowLabel(['number', 'title'], 'Phase') },
        initCollapsed: false,
        condition: onlyFor('accordion', 'arc', 'grid'),
        description:
          'Up to three, in order. Accordion: each phase is a labelled bar its steps sit under. Arc: each phase is a row with its description and link. The LAST phase is always shown in the accent colour (the independence handover); that cannot be switched off.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              admin: { width: '30%', description: 'Shown before (accordion) or above (arc) the title, e.g. "Phase 01".' },
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
          name: 'continuedLabel',
          type: 'text',
          label: 'Bar text when the phase continues',
          admin: {
            condition: onlyFor('grid'),
            description:
              'Grid only: the bar over a phase\'s second row on wide screens, e.g. "Phase 1 · Build, continued". Leave empty to repeat the phase name.',
          },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            condition: onlyFor('arc'),
            description: 'What happens in this phase, in two to four sentences.',
          },
        },
        {
          ...linkField({
            name: 'link',
            label: 'Link',
            description:
              'Optional link under the description, e.g. "See Phase 01 →" to the service page. Leave the text empty for no link.',
          }),
          admin: {
            condition: onlyFor('arc'),
            description:
              'Optional link under the description, e.g. "See Phase 01 →" to the service page. Leave the text empty for no link.',
          },
        },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      maxRows: 12,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        components: { RowLabel: rowLabel(['number', 'title'], 'Step') },
        initCollapsed: true,
        condition: onlyFor('accordion', 'steps', 'build-run', 'engine-rollout', 'grid'),
        description:
          'In order. Grid: four per row on wide screens, each under its phase bar. Accordion: each step sits under the phase you pick; the first starts open. Step cards: three or four fit side by side. Build run: three per row. Engine rollout: one row (six fit). The LAST step is the handover and always shows at full weight.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              admin: { width: '20%', description: 'e.g. "01" (step cards: "Step 01").' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                description: 'e.g. "Intake". Keep it to about 14 characters: in the accordion it runs vertically on desktop when closed.',
              },
            },
            {
              name: 'phase',
              type: 'select',
              required: true,
              defaultValue: '1',
              options: [
                { label: '0 — before the phases (grid only)', value: '0' },
                { label: 'Phase 1 (first phase)', value: '1' },
                { label: 'Phase 2 (second phase)', value: '2' },
                { label: 'Phase 3 (third phase)', value: '3' },
              ],
              admin: {
                width: '30%',
                isClearable: false,
                condition: onlyFor('accordion', 'grid'),
                description: 'Which phase bar this step sits under. "0" (grid only) puts the step in the strip above the first phase bar.',
              },
            },
          ],
        },
        {
          name: 'detail',
          type: 'textarea',
          admin: {
            description:
              'Accordion: shown when the step is open (about 160 characters). Step cards: the sentence under the title. Build run / Engine rollout: the line under the title on phones (computers show the tag instead).',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'tag',
              type: 'text',
              admin: {
                width: '70%',
                condition: onlyFor('steps', 'build-run', 'engine-rollout', 'grid'),
                description:
                  'Short label, e.g. a timing ("Week one") or "Your sign-off". Grid: the small grey label over a phase-0 step ("Day 0"). Step cards: the boxed tag. Build run / Engine rollout: the line under the title on computers.',
              },
            },
            {
              name: 'isSignOff',
              type: 'checkbox',
              label: 'Client sign-off step',
              defaultValue: false,
              admin: {
                width: '30%',
                condition: onlyFor('build-run'),
                description: 'Marks a step the client approves: on phones it shows the tag with a diamond.',
              },
            },
          ],
        },
        {
          name: 'outcomes',
          type: 'array',
          label: 'You leave with',
          maxRows: 4,
          labels: { singular: 'Outcome', plural: 'Outcomes' },
          admin: {
            components: { RowLabel: rowLabel(['text'], 'Outcome') },
            condition: onlyFor('steps'),
            description: 'Bullets under "You leave with" at the foot of the card. One short line each.',
          },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'closingLine',
      type: 'text',
      label: 'Closing line',
      admin: {
        condition: onlyFor('accordion', 'steps', 'build-run', 'engine-rollout', 'grid'),
        description: 'Optional quiet line under the timeline, e.g. "Then Phase 02, if the numbers say it fits."',
      },
    },
    {
      name: 'outcomesLabel',
      type: 'text',
      label: 'Outcomes label',
      defaultValue: 'You leave with',
      admin: {
        condition: onlyFor('steps'),
        description: 'Small uppercase label above the bullets at the foot of each card. Leave empty to use "You leave with".',
      },
    },
    {
      name: 'swipeHint',
      type: 'text',
      label: 'Swipe hint',
      defaultValue: 'Swipe →',
      admin: {
        condition: onlyFor('build-run', 'engine-rollout'),
        description: 'Small hint above the swipe row on phones. Leave empty to use "Swipe →".',
      },
    },
    {
      ...linkField({
        name: 'cta',
        label: 'Button',
        description: 'Optional button under the cards, e.g. "Book a Call". Leave the text empty for no button.',
      }),
      admin: {
        condition: onlyFor('steps', 'grid'),
        description: 'Optional button under the cards, e.g. "Book a Call". Grid (one row only): a bold underlined text link at the right of the closing line, e.g. "The full process →". Leave the text empty for none.',
      },
    },
  ],
}
