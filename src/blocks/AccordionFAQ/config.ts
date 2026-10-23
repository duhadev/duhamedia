import type { Block, Field, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { Faqs } from '../../collections/Faqs'
import { eyebrowField, linkField } from '../../fields'
import { isReservedAnchorId, RESERVED_ANCHOR_IDS } from '../../lib/anchors'

/**
 * The four category options come from the `faqs` collection itself, so the
 * block can never drift from the values a FAQ can be saved with.
 */
const categoryField = Faqs.fields.find((f): f is Extract<Field, { type: 'select' }> => 'name' in f && f.name === 'category')
const categoryOptions = categoryField?.options ?? []

/** Re-exported from its new home (src/lib/anchors.ts) so existing imports keep working. */
export { RESERVED_ANCHOR_IDS }

/**
 * Lowercase slug (a-z, 0-9, single hyphens), not reserved, and unique among the
 * `group` FAQ blocks of the same layout. Empty is allowed.
 */
const validateAnchorId: TextFieldSingleValidation = (value, options) => {
  try {
    return checkAnchorId(value, options)
  } catch {
    // Never throw: in the browser `options` is shaped differently from the server's. Publish-time server run decides.
    return true
  }
}

const checkAnchorId = (value: string | null | undefined, options: Parameters<TextFieldSingleValidation>[1]): string | true => {
  // The stock text validator reads `req.payload.config`, which does not exist in the browser: guard it.
  let base: string | true = true
  try {
    base = text(value, options) as string | true
  } catch {
    base = true
  }
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers and single hyphens only, e.g. "pricing".'
  if (isReservedAnchorId(value)) {
    return `"${value}" is used by the site itself. Pick a different anchor, e.g. "pricing" or "builds".`
  }
  // path is ['layout', 2, 'anchorId'] in the admin and ['layout', '2', 'anchorId'] on the server.
  const { path, data } = options ?? {}
  const idx = Array.isArray(path) && path.length >= 3 ? Number(path[path.length - 2]) : NaN
  const rows = Number.isInteger(idx) && data ? (data as Record<string, unknown>)[String(path[0])] : undefined
  if (Array.isArray(rows)) {
    const clash = rows.slice(0, idx).some((r) => {
      const b = r as { blockType?: unknown; variant?: unknown; anchorId?: unknown } | null
      return b?.blockType === 'accordionFAQ' && b.variant === 'group' && typeof b.anchorId === 'string' && b.anchorId.trim() === value
    })
    if (clash) return `Another FAQ group on this page already uses the anchor "${value}". Each group needs its own.`
  }
  return true
}

const isGroup = (_data: unknown, siblingData: { variant?: string } | undefined) => siblingData?.variant === 'group'

/**
 * AccordionFAQ (SCHEMA §8.5 item 19). `mini` (p4, p5, p6 FAQ section) and
 * `group` (p11, one block per category; `anchorId` + `spacing` belong to it).
 */
export const AccordionFAQ: Block = {
  slug: 'accordionFAQ',
  interfaceName: 'AccordionFAQBlock',
  labels: { singular: 'FAQ accordion', plural: 'FAQ accordions' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'mini',
      options: [
        { label: 'Mini (short list of questions on a service page)', value: 'mini' },
        { label: 'Group (one category section of the FAQ page)', value: 'group' },
      ],
      admin: { description: 'Mini is the compact boxed list; Group is one category section on the full FAQ page (add one block per category).' },
    },
    {
      name: 'anchorId',
      type: 'text',
      label: 'Anchor ID',
      validate: validateAnchorId,
      admin: {
        description:
          'Group only. The jump-link target for the category tabs, lowercase, e.g. "pricing", "builds", "marketing", "process". Must match what the tabs link to.',
        condition: isGroup,
      },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'middle',
      options: [
        { label: 'Middle (between other groups)', value: 'middle' },
        { label: 'First group (extra space above)', value: 'first' },
        { label: 'Last group (extra space below)', value: 'last' },
        { label: 'Only group (extra space above and below)', value: 'only' },
      ],
      admin: {
        description: 'Group only. Where this section sits in the stack of groups, so the first and last get the page-edge spacing.',
        condition: isGroup,
      },
    },
    eyebrowField({ description: 'Optional small uppercase line above the heading.' }),
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Section heading, e.g. "Routing questions". Shown in capitals.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'selected',
      options: [
        { label: 'Pick the questions myself (in order)', value: 'selected' },
        { label: 'All questions from one category', value: 'category' },
      ],
      admin: { description: 'Only published questions are ever shown.' },
    },
    {
      name: 'category',
      type: 'select',
      options: categoryOptions,
      admin: {
        description: 'Show the published questions of this FAQ category.',
        condition: (_data, siblingData) => siblingData?.source === 'category',
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      maxDepth: 1,
      label: 'Questions',
      admin: {
        description: 'Drag to set the order. Unpublished questions are skipped on the live site.',
        condition: (_data, siblingData) => (siblingData?.source ?? 'selected') === 'selected',
      },
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 12,
      defaultValue: 6,
      admin: {
        step: 1,
        description: 'Mini list only: most questions to show (1–12). A group always shows every published question in its category.',
        condition: (_data, siblingData) => siblingData?.variant !== 'group',
      },
    },
    {
      name: 'openFirst',
      type: 'checkbox',
      label: 'Open the first question by default',
      defaultValue: false,
    },
    linkField({
      name: 'allLink',
      label: 'Link to all questions',
      description: 'Optional underlined link under the list, e.g. "All questions, answered straight →".',
    }),
  ],
}
