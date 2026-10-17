import type {
  CollectionConfig,
  CollectionSlug,
  Condition,
  Field,
  GroupField,
  NumberField,
  RelationshipFieldSingleValidation,
  TextField,
  TextFieldSingleValidation,
} from 'payload'
import { relationship, text } from 'payload/shared'

import { accentPhraseError } from '../lib/accentPhrase'
import { youtubeVideoId } from '../lib/youtube'

/**
 * Shared schema pieces reused across collections (SCHEMA.md §3, §5).
 *
 * §3 factories are added with the first unit that uses them. C7
 * (case-studies) added `metricFields`, `linkField` and `validateAccentPhrase`
 * (the substring rule `headlineFields()` will reuse). C8 (posts) added
 * `pricingNote`. Still to come with their first block: `scarcityRef`,
 * `headlineFields`, `eyebrowField`.
 *
 * Verified against payload@3.91.0 (installed `payload/dist`):
 * - versions options: versions/types.d.ts (`drafts.autosave.interval`,
 *   `schedulePublish`, `validate`, `maxPerDoc`). With `validate: false`, draft
 *   saves skip ALL field validation, built-in and custom
 *   (collections/operations/create.js:234, utilities/update.js:191), so
 *   "required" means "required to publish".
 * - a custom `validate` REPLACES the built-in one (fields/hooks/beforeChange/
 *   promise.js:98), so validators below call `text()` from `payload/shared` first.
 * - a field hidden by `admin.condition` (or inside a hidden group) is not
 *   validated (promise.js:44, `!passesCondition` propagates to children).
 */

/** SCHEMA §5.1: drafts on every content-facing collection. */
export const contentVersions = {
  drafts: {
    // Autosave exists for live preview (SCHEMA §5.1).
    autosave: { interval: 375 },
    // Off: a scheduled job could publish without a human.
    schedulePublish: false,
    // Required fields are enforced on publish only.
    validate: false,
  },
  maxPerDoc: 50,
} satisfies CollectionConfig['versions']

/**
 * Explicit display order (SCHEMA §0: `orderable` is @experimental in 3.91.0,
 * so it is not used). Lower numbers render first; ties fall back to newest.
 */
export const sortOrderField = (description?: string): NumberField => ({
  name: 'sortOrder',
  type: 'number',
  index: true,
  admin: {
    position: 'sidebar',
    step: 1,
    description: description ?? 'Display order. Lower numbers come first.',
  },
})

const isHttpsUrl = (value: string): boolean => {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

/** Text field: empty allowed unless `required`; otherwise a full https:// URL. */
export const validateHttpsUrl: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  return isHttpsUrl(value.trim()) ? true : 'Enter a full https:// address, e.g. https://example.com'
}

/** Text field: an https YouTube video URL (Gate S Q5: YouTube unlisted). */
export const validateYouTubeUrl: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  return youtubeVideoId(value)
    ? true
    : 'Paste the YouTube link of the video (https://youtu.be/… or https://www.youtube.com/watch?v=…). Unlisted videos work.'
}

/* -------------------------------------------------------------------------- */
/* §3 factories (C7)                                                          */
/* -------------------------------------------------------------------------- */

/**
 * SCHEMA §3 `metricFields()`: a typographic metric, structured (never prose).
 * DS `Metric` = value / label / sub / accent (MERGED §4.1). R13: never a price.
 * R5: no defaults; every number is entered (and seeded as placeholder).
 * Spread inside a named group, e.g. `{ name: 'headlineMetric', type: 'group', fields: metricFields() }`.
 */
export const metricFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'value',
        type: 'text',
        required: true,
        admin: { width: '40%', description: 'A result or count, never a price. e.g. "+212%".' },
      },
      {
        name: 'label',
        type: 'text',
        required: true,
        admin: { width: '60%', description: 'What the number measures, e.g. "Revenue, 12 months".' },
      },
    ],
  },
  {
    name: 'sub',
    type: 'text',
    label: 'Sub-line',
    admin: { description: 'Optional quiet line under the metric.' },
  },
  {
    name: 'accent',
    type: 'checkbox',
    label: 'Accent colour',
    defaultValue: false,
    admin: { description: 'Show the number in the accent colour.' },
  },
]

/**
 * `accentPhrase` must be a substring (case-insensitive) of the sibling heading
 * field (SCHEMA §3 `headlineFields()`, DS `AccentHeadline`: one accent phrase
 * per headline). Empty is allowed.
 */
export const validateAccentPhrase =
  (headingField: string): TextFieldSingleValidation =>
  (value, options) => {
    const base = text(value, options)
    if (base !== true) return base
    return accentPhraseError(value, (options.siblingData as Record<string, unknown> | undefined)?.[headingField])
  }

/**
 * `admin.components.Field` for an accent-phrase field: the same rule runs in the
 * browser (src/components/admin/AccentPhraseField.tsx), which is what makes the
 * error show inline on Publish. Use together with `validate: validateAccentPhrase(h)`.
 */
export const accentPhraseAdminField = (headingField: string) => ({
  path: '/components/admin/AccentPhraseField#AccentPhraseField',
  clientProps: { headingField },
})

/**
 * Collections an internal link may point at. SCHEMA §3 lists `pages`,
 * `case-studies`, `posts`, `lead-magnets`. The relationship is polymorphic
 * from day one so adding the others is additive (new `*_id` columns in the
 * `_rels` tables, same value shape). C8 added 'posts', C9 'lead-magnets'.
 * TODO(C10): add 'pages'.
 */
const LINK_TARGETS = ['case-studies', 'posts', 'lead-magnets'] as const satisfies CollectionSlug[]

const isInternal: Condition = (_data, siblingData) => (siblingData?.type ?? 'internal') === 'internal'
const isCustom: Condition = (_data, siblingData) => siblingData?.type === 'custom'

/** https://…, mailto:… or a site-relative path starting with a single `/`. */
const LINK_URL_OK = (value: string): boolean => {
  if (/^\/(?!\/)/.test(value)) return true
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(value)) return true
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

type LinkSiblings = {
  type?: 'internal' | 'custom' | null
  reference?: unknown
  url?: string | null
  label?: string | null
}

const filled = (v: unknown): boolean =>
  v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '')

/** A link counts as "in use" once any of its parts is filled. */
const linkInUse = (s: LinkSiblings | undefined): boolean =>
  filled(s?.label) || filled(s?.url) || filled(s?.reference)

/**
 * SCHEMA §3 `linkField({ name })`: group `{ type, reference, url, label, newTab }`.
 * `required: true` → the link must be filled in to publish. Optional links
 * (default) may be left completely empty; once any part is filled, the label
 * and the destination are both required (no half-links on the site).
 * Validation runs on publish only (`drafts.validate: false`).
 */
export const linkField = ({
  name,
  label,
  description,
  required = false,
}: {
  name: string
  label?: string
  description?: string
  required?: boolean
}): GroupField => {
  const mustFill = (siblings: unknown): boolean => required || linkInUse(siblings as LinkSiblings)

  const validateLabel: TextFieldSingleValidation = (value, options) => {
    const base = text(value, options)
    if (base !== true) return base
    if (!mustFill(options.siblingData)) return true
    return filled(value) ? true : 'Add the link text.'
  }

  // `relationship()` is async in payload@3.91.0 (fields/validations.js): await it.
  const validateReference: RelationshipFieldSingleValidation = async (value, options) => {
    const base = await relationship(value, options)
    if (base !== true) return base
    if (!mustFill(options.siblingData)) return true
    return filled(value) ? true : 'Choose the page this link goes to.'
  }

  const validateUrl: TextFieldSingleValidation = (value, options) => {
    const base = text(value, options)
    if (base !== true) return base
    if (!filled(value)) return mustFill(options.siblingData) ? 'Add the address this link goes to.' : true
    return LINK_URL_OK((value as string).trim())
      ? true
      : 'Use a full https:// address, a mailto: address, or a site path starting with "/".'
  }

  return {
    name,
    type: 'group',
    label,
    admin: { description },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'select',
            label: 'Link type',
            required: true,
            defaultValue: 'internal',
            options: [
              { label: 'Page on this site', value: 'internal' },
              { label: 'Custom address', value: 'custom' },
            ],
            admin: { width: '50%' },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in a new tab',
            defaultValue: false,
            admin: { width: '50%' },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            type: 'relationship',
            label: 'Page',
            relationTo: [...LINK_TARGETS],
            maxDepth: 1,
            validate: validateReference,
            admin: { condition: isInternal, width: '50%' },
          },
          {
            name: 'url',
            type: 'text',
            label: 'Address',
            validate: validateUrl,
            admin: {
              condition: isCustom,
              width: '50%',
              description: 'https://…, mailto:…, or a site path like /book-a-call.',
            },
          },
          {
            name: 'label',
            type: 'text',
            label: 'Link text',
            validate: validateLabel,
            admin: { width: '50%' },
          },
        ],
      },
    ],
  }
}

/**
 * SCHEMA §3 `pricingNote()`: CLAUDE.md rule 5 + R13 — prices appear only as a
 * small inline note. There is no price field anywhere else and no pricing block.
 */
export const pricingNote = (name = 'pricingNote'): TextField => ({
  name,
  type: 'text',
  label: 'Pricing note',
  maxLength: 80,
  admin: {
    description: "Small inline note only, e.g. 'Builds start at $5K'. Never put a price in a headline or metric.",
  },
})
