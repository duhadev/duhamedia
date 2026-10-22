import type {
  ArrayFieldValidation,
  FieldHook,
  GlobalConfig,
  NumberField,
  NumberFieldSingleValidation,
  SelectFieldSingleValidation,
  TextFieldSingleValidation,
} from 'payload'
import { number, select, text } from 'payload/shared'

import { staffOnly } from '../access'
import { revalidateGlobalHook } from '../hooks/revalidateTag'
import {
  DUPLICATE_KEY_MESSAGE,
  REASON_REQUIRED_MESSAGE,
  SCARCITY_KEYS,
  STATISTIC_REQUIRED_MESSAGE,
  WHOLE_NUMBER_MESSAGE,
  overCapacityMessage,
  unknownScarcityTokens,
  unknownTokensMessage,
} from '../lib/scarcity'

/**
 * `scarcity` global (SCHEMA.md §7.2, §10 — Gate S approved 2026-10-17).
 *
 * The one place capacity is edited (CLAUDE.md rule 2 "Scarcity loud/quiet"). Consumers:
 * p1 ProofStrip (scarcity variant, `statements` max 2), every FinalCTA capacity line
 * (p1–p8, p13, p14, p19; p11 `none`), p15 OfferBlock (`offer-line`), p17 LinkStack
 * (`slots-line`). Blocks hold NO numbers: they store a statement `key` via the future
 * `scarcityRef()` factory (SCHEMA §3), whose options come from `SCARCITY_KEYS`
 * (src/lib/scarcity.ts), and fill tokens with `fillScarcityTokens`.
 *
 * Rules encoded here:
 * - every statement row has a REQUIRED, non-blank `reason`, so a bare number cannot be
 *   saved (the component must also have no reason-less render path; block-coder rule);
 * - `statistic` required and may only use the known tokens;
 * - `key` unique across rows (field validate reads `data.statements`);
 * - `activeClients`, `buildsInProgress` and `enginesRunning` each ≤ `capacity` (F8, mini
 *   Gate S 2026-10-21); all counts are whole numbers ≥ 0 (capacity ≥ 1).
 *
 * Defaults: `capacity` defaults to 7 — the REAL client cap (F7, mini Gate S 2026-10-21,
 * restoring SCHEMA §7.2's "default 7"; DB column default via migration s2_scarcity_seo_delta).
 * The other three counts are required with NO default (they are live numbers, never
 * invented — CLAUDE.md content rule 3), and `statements` starts empty; the seed supplies
 * demonstrative placeholders. In payload@3.91.0 a global has no stored row until its
 * first save (globals/operations/findOne.js), so the frontend must treat every field as
 * optional and render nothing until the global is saved.
 *
 * Validation (repo convention, PROGRESS Decision log): field `validate` functions that
 * call the built-in validator from `payload/shared` first (a custom `validate` replaces
 * the built-in one, payload@3.91.0 fields/hooks/beforeChange/promise.js:98-123, which
 * passes `data: deepMergeWithSourceArrays(doc, data)` and `siblingData`). Nothing throws
 * from a hook. Trimming is a field `beforeValidate` hook. No client validate wrappers are
 * needed: this global has no drafts/autosave, and the admin's server-built form state runs
 * the same custom validators (@payloadcms/ui@3.91.0 forms/fieldSchemasToFormState/
 * addFieldStatePromise.js:109-161), so errors show inline — same as G1 site-settings.
 *
 * No drafts (SCHEMA §7): a save is live immediately.
 * Access (SCHEMA §4.3 "globals (all 4)"): read public; update + readVersions staff only
 * (admin, marketing). The pipeline user is logged in but not staff → denied.
 * `GlobalConfig.access` = { read, readVersions, update } (payload@3.91.0
 * globals/config/types.d.ts:210).
 * Revalidation (SCHEMA §10): tag `scarcity` + the whole frontend layout, skipped with
 * `context.disableRevalidate` (seed) — src/hooks/revalidateTag.ts `revalidateGlobalHook`.
 */

const trim: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === ''

/** Built-in number check (required/min/max), then whole numbers only. */
const validateCount: NumberFieldSingleValidation = (value, options) => {
  const base = number(value, options)
  if (base !== true) return base
  if (typeof value === 'number' && !Number.isInteger(value)) return WHOLE_NUMBER_MESSAGE
  return true
}

/** Whole-number count that may not exceed the sibling `capacity` (F8). Error shows on this field. */
const validateCappedCount =
  (label: string): NumberFieldSingleValidation =>
  (value, options) => {
    const base = validateCount(value, options)
    if (base !== true) return base
    const capacity = (options.siblingData as { capacity?: unknown } | undefined)?.capacity
    if (typeof value === 'number' && typeof capacity === 'number' && value > capacity) {
      return overCapacityMessage(label, capacity)
    }
    return true
  }

const validateKey: SelectFieldSingleValidation = (value, options) => {
  const base = select(value, options)
  if (base !== true) return base
  const rows = (options.data as { statements?: unknown } | undefined)?.statements
  if (typeof value !== 'string' || !Array.isArray(rows)) return true
  const uses = rows.filter((row) => (row as { key?: unknown } | null)?.key === value).length
  return uses > 1 ? DUPLICATE_KEY_MESSAGE : true
}

const validateStatistic: TextFieldSingleValidation = (value, options) => {
  if (isBlank(value)) return STATISTIC_REQUIRED_MESSAGE
  const base = text(value, options)
  if (base !== true) return base
  const unknown = unknownScarcityTokens(value as string)
  return unknown.length > 0 ? unknownTokensMessage(unknown) : true
}

const validateReason: TextFieldSingleValidation = (value, options) => {
  if (isBlank(value)) return REASON_REQUIRED_MESSAGE
  return text(value, options)
}

/* The built-in array validator words this as "1 Rows" (it ignores `labels`); restate it. */
const validateStatements: ArrayFieldValidation = (value, { req: { t } }) =>
  (Array.isArray(value) && value.length >= 1) || t('validation:requiresAtLeast', { count: 1, label: 'Statement' })

const countField = (
  name: string,
  label: string,
  description: string,
  { min = 0, capped = true, defaultValue }: { min?: number; capped?: boolean; defaultValue?: number } = {},
): NumberField => ({
  name,
  label,
  type: 'number',
  required: true,
  min,
  ...(defaultValue === undefined ? {} : { defaultValue }),
  validate: capped ? validateCappedCount(label) : validateCount,
  admin: { step: 1, width: '25%', description },
})

export const Scarcity: GlobalConfig = {
  slug: 'scarcity',
  label: 'Capacity & scarcity',
  admin: {
    description:
      'The one place to update how busy we are. Each statement has a LOUD part (the big number or line, e.g. "3 builds in progress") and a QUIET part underneath (the one-line reason, e.g. "The cap keeps every build senior-staffed"). The site never shows a number without its reason. Changes go live as soon as you save.',
  },
  access: {
    read: () => true,
    readVersions: staffOnly,
    update: staffOnly,
  },
  hooks: {
    afterChange: [revalidateGlobalHook('scarcity')],
  },
  fields: [
    {
      type: 'row',
      fields: [
        countField(
          'capacity',
          'Client cap',
          'The most clients we take at once. Our real cap is 7 ("We cap at 7"); change it only if the cap changes.',
          { min: 1, capped: false, defaultValue: 7 },
        ),
        countField(
          'activeClients',
          'Active clients',
          'Clients we are working with now. Can\'t be more than the cap ("Slots open 3/7").',
        ),
        countField(
          'buildsInProgress',
          'Builds in progress',
          'Store builds running now ("3 builds in progress"). Can\'t be more than the cap.',
        ),
        countField(
          'enginesRunning',
          'Engines running',
          'Growth engines running now ("3 engines running"). Can\'t be more than the cap.',
        ),
      ],
    },
    {
      name: 'statements',
      label: 'Statements',
      labels: { singular: 'Statement', plural: 'Statements' },
      type: 'array',
      required: true,
      minRows: 1,
      validate: validateStatements,
      admin: {
        isSortable: true,
        initCollapsed: true,
        description:
          'Each row is one statement the site can show. Pages pick a statement by its type, so each type is used once. In the statement you can write {active}, {capacity}, {builds}, {engines} or {open} (cap minus active) and the site fills in the numbers above, so you only update numbers in one place. Drag to reorder.',
        components: { RowLabel: '/components/admin/ScarcityRowLabel#ScarcityRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              label: 'Type',
              type: 'select',
              required: true,
              options: SCARCITY_KEYS.map(({ label, value }) => ({ label, value })),
              validate: validateKey,
              admin: { width: '40%', description: 'Where this statement is used. Each type once.' },
            },
            {
              name: 'label',
              label: 'Caption',
              type: 'text',
              hooks: { beforeValidate: [trim] },
              admin: {
                width: '60%',
                description: 'Optional small caption next to a big number, e.g. "Projects ongoing".',
              },
            },
          ],
        },
        {
          name: 'statistic',
          label: 'Statement (loud)',
          type: 'text',
          required: true,
          validate: validateStatistic,
          hooks: { beforeValidate: [trim] },
          admin: {
            description:
              'The big line, e.g. "{builds} builds in progress. We cap at {capacity}." Use the placeholders so the numbers stay in sync.',
          },
        },
        {
          name: 'reason',
          label: 'Reason (quiet)',
          type: 'text',
          required: true,
          validate: validateReason,
          hooks: { beforeValidate: [trim] },
          admin: {
            description:
              'Required. The one-line reason shown quietly underneath, e.g. "The cap keeps every build senior-staffed." Keep the reason out of the statement itself.',
          },
        },
      ],
    },
  ],
}
