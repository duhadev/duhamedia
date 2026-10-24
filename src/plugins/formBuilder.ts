import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field, Plugin, SelectFieldSingleValidation, TextFieldSingleValidation } from 'payload'
import { select, text } from 'payload/shared'

import { adminOnly, adminOnlyField, staffOnly, turnstileVerifiedOrAdmin } from '../access'
import { richTextLinkFeature } from '../fields'
import { blockDeleteIfReferenced, formSubmissionsSentence } from '../hooks/blockDeleteIfReferenced'
import { enqueueSubmissionDelivery, stampSubmissionDelivery } from '../hooks/formSubmissions'
import { resendDeliveryEndpoint } from '../integrations/events/resendEndpoint'
import { newsletterActionEndpoint } from '../integrations/newsletter/actionEndpoint'
import { revalidateLiveCollectionHooks } from '../hooks/revalidateTag'

/**
 * P1: `@payloadcms/plugin-form-builder@3.91.0` with the Gate S overrides
 * (SCHEMA.md §0 row "form-builder options", §4.3, §6.12, §6.13, §10, X13).
 *
 * Verified against the INSTALLED plugin (node_modules/@payloadcms/
 * plugin-form-builder/dist, 3.91.0):
 * - index.js:9-23: `fields` is merged over the plugin defaults
 *   (checkbox/country/email/message/number/select/state/text/textarea on,
 *   payment/upload off; `date` is absent unless enabled), so every key is set
 *   explicitly below.
 * - collections/Forms/index.js:99-124: a block is registered only when its
 *   key is not `false`; `payment: false` means no Payment block exists.
 * - collections/FormSubmissions/index.js:8,85-87: payment submission fields
 *   only when `fields.payment` is truthy. hooks/createCharge.js:4-9: the only
 *   payment code path runs `handlePayment`, which is never passed here. So no
 *   payment code is reachable (CLAUDE.md "Payments exclusion").
 * - collections/Forms/index.js:273-288 and FormSubmissions/index.js:89-119:
 *   overrides spread SHALLOWLY; `access` keys merge over the plugin defaults
 *   (forms `read: () => true`; submissions `create: () => true`,
 *   `read: any users-collection user` (= incl. the pipeline user),
 *   `update: () => false`, and NO delete → Payload's default "any logged-in
 *   user"). All four are set explicitly on both collections.
 * - FormSubmissions/index.js:105-118: the plugin's `sendEmail` afterChange
 *   runs FIRST, then ours; its `createCharge` beforeChange runs first, then
 *   ours. `fields` overrides receive `{ defaultFields }` (types.d.ts FieldsOverride).
 * - hooks/sendEmail.js:23-28,40: the form is read with the request's access
 *   defaults (Local API → overrideAccess true), the recipient falls back
 *   `email.emailTo || defaultToEmail || payload.email.defaultFromAddress`.
 *
 * Localization is permanently off (CLAUDE.md rule 8). The plugin marks several
 * default fields `localized: true`; Payload already drops that when no
 * `localization` config exists (payload@3.91.0 fields/config/sanitize.js:143-151),
 * and `adaptPluginFields` strips it at the source so the config never carries it.
 *
 * Rich text: the plugin's richText fields (confirmationMessage, emails.message,
 * the Message block) would otherwise use the config's default editor, whose
 * Relationship/Upload features can reference any collection (incl. `users`),
 * rendered publicly with the form. They get the same small editor as FAQ
 * answers (src/collections/Faqs.ts): paragraphs, bold, italic, lists, links.
 */

const formsEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    richTextLinkFeature(),
    InlineToolbarFeature(),
  ],
})

/**
 * Copy of the plugin's default fields with every `localized` key removed and
 * every richText field on `formsEditor`. Only structural keys are walked;
 * functions (labels, conditions, validators) stay by reference.
 */
const adaptPluginFields = (fields: Field[]): Field[] => {
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk)
    if (!node || typeof node !== 'object') return node
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node)) {
      if (key === 'localized') continue
      out[key] = key === 'fields' || key === 'blocks' || key === 'tabs' ? walk(value) : value
    }
    if (out.type === 'richText') out.editor = formsEditor
    return out
  }
  return walk(fields) as Field[]
}

/* -------------------------------------------------------------------------- */
/* forms (SCHEMA §6.12)                                                        */
/* -------------------------------------------------------------------------- */

export const FORM_EVENT_TYPES = ['none', 'contact', 'newsletter', 'lead_magnet'] as const

const FORM_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const validateFormKey: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value === '') return true
  return FORM_KEY_PATTERN.test(value) ? true : 'Use lowercase letters, numbers and single hyphens, e.g. "precall-homework".'
}

/** `sendEvent` on with no event type would stamp `pending` for an event nobody sends. */
const validateEventType: SelectFieldSingleValidation = (value, options) => {
  const base = select(value, options)
  if (base !== true) return base
  const sendEvent = (options.siblingData as { sendEvent?: boolean } | undefined)?.sendEvent === true
  if (sendEvent && (!value || value === 'none')) return 'Choose an event type, or turn off "Send event".'
  // A2: a newsletter event is sent only after double opt-in, which needs newsletter sync.
  const newsletterSync = (options.siblingData as { newsletterSync?: boolean } | undefined)?.newsletterSync === true
  if (sendEvent && value === 'newsletter' && !newsletterSync) return 'A newsletter event needs "Newsletter sync" on (double opt-in).'
  return true
}

const formIntegrationFields: Field[] = [
  {
    name: 'formKey',
    type: 'text',
    label: 'Form key',
    required: true,
    unique: true,
    index: true,
    validate: validateFormKey,
    admin: {
      position: 'sidebar',
      description:
        'Stable machine id, sent as the event "form" value: contact, precall-homework, newsletter, lead-magnet. Do not rename once live.',
    },
  },
  {
    name: 'eventType',
    type: 'select',
    label: 'Event type',
    required: true,
    defaultValue: 'none',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Contact', value: 'contact' },
      { label: 'Newsletter', value: 'newsletter' },
      { label: 'Lead magnet', value: 'lead_magnet' },
    ],
    validate: validateEventType,
    admin: { position: 'sidebar', description: 'Which secretary event a submission sends (CLAUDE.md events table).' },
  },
  {
    name: 'sendEvent',
    type: 'checkbox',
    label: 'Send event',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description:
        'When on, each submission is sent to the secretary. Off for the pre-call homework form at launch: submissions are still stored here.',
    },
  },
  {
    name: 'newsletterSync',
    type: 'checkbox',
    label: 'Newsletter sync',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Add the submitter to the newsletter (Resend contact, segment and topic, with double opt-in).',
    },
  },
  {
    name: 'newsletterOptInField',
    type: 'text',
    label: 'Opt-in field name',
    admin: {
      position: 'sidebar',
      condition: (_, siblingData) => siblingData?.newsletterSync === true,
      description:
        'Name of the checkbox field that must be ticked for newsletter sync (lead-magnet forms). Leave empty to sync every submission (the newsletter form).',
    },
  },
]

/**
 * S4-7 (delta): `placeholder` on the text / email / textarea field blocks.
 * plugin-form-builder@3.91.0 gives only `select` a placeholder
 * (dist/collections/Forms/fields.js:27-32, 123-168). Passing a block object in
 * the plugin's `fields` option would REPLACE the block's field list
 * (Forms/index.js:104 → deepMergeWithSourceArrays: arrays from the source win),
 * so the field is appended here, to the already-built `fields` blocks field.
 * Additive: one nullable column per block table (forms_blocks_text /
 * _email / _textarea), no data step.
 */
const PLACEHOLDER_BLOCKS = new Set(['text', 'email', 'textarea'])

const inputPlaceholderField: Field = {
  name: 'placeholder',
  type: 'text',
  label: 'Placeholder',
  admin: {
    description: 'Hint shown inside the empty field, e.g. "you@store.com". Optional; the label still shows.',
  },
}

const withInputPlaceholders = (fields: Field[]): Field[] =>
  fields.map((field) =>
    field.type === 'blocks' && field.name === 'fields'
      ? {
          ...field,
          blocks: field.blocks.map((block) =>
            PLACEHOLDER_BLOCKS.has(block.slug) && !block.fields.some((f) => 'name' in f && f.name === 'placeholder')
              ? { ...block, fields: [...block.fields, inputPlaceholderField] }
              : block,
          ),
        }
      : field,
  )

const formsRevalidate = revalidateLiveCollectionHooks('forms')

/* -------------------------------------------------------------------------- */
/* form-submissions (SCHEMA §6.13)                                             */
/* -------------------------------------------------------------------------- */

/** Written only by `stampSubmissionDelivery` (create) and the integration jobs (overrideAccess). */
const systemCreate = { create: adminOnlyField }

const submissionSystemFields: Field[] = [
  {
    name: 'eventId',
    type: 'text',
    label: 'Event ID',
    unique: true,
    index: true,
    disableDuplicate: true,
    admin: { position: 'sidebar', readOnly: true, description: 'Idempotency key, reused on every retry and re-send.' },
  },
  {
    name: 'deliveryStatus',
    type: 'select',
    label: 'Delivery status',
    index: true,
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Delivered', value: 'delivered' },
      { label: 'Failed', value: 'failed' },
    ],
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'Delivery to the secretary. Empty when this form sends no event.',
    },
  },
  {
    name: 'deliveryNote',
    type: 'textarea',
    label: 'Delivery note',
    access: systemCreate,
    admin: { position: 'sidebar', readOnly: true, description: 'Last response or error summary.' },
  },
  {
    name: 'deliveryAttempts',
    type: 'number',
    label: 'Delivery attempts',
    defaultValue: 0,
    min: 0,
    access: systemCreate,
    admin: { position: 'sidebar', readOnly: true, step: 1 },
  },
  {
    name: 'lastAttemptAt',
    type: 'date',
    label: 'Last attempt',
    access: systemCreate,
    admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
  },
  {
    name: 'sourcePath',
    type: 'text',
    label: 'Submitted from',
    admin: { position: 'sidebar', readOnly: true, description: 'Page path the form was submitted on.' },
  },
  {
    name: 'leadMagnet',
    type: 'relationship',
    relationTo: 'lead-magnets',
    maxDepth: 0,
    label: 'Lead magnet',
    admin: { position: 'sidebar', readOnly: true, description: 'The asset requested (lead-magnet forms).' },
  },
  {
    name: 'newsletter',
    type: 'group',
    label: 'Newsletter sync',
    access: systemCreate,
    admin: { readOnly: true, description: 'Resend contact sync, tracked separately from event delivery.' },
    // A2 (src/integrations/newsletter/*): optInStatus → confirmation email
    // (email*) → visitor clicks → contact sync (sync*) → newsletter event (delivery*).
    fields: [
      {
        name: 'optInStatus',
        type: 'select',
        label: 'Opt-in status',
        index: true,
        options: [
          { label: 'Pending confirmation', value: 'pending-confirmation' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Expired', value: 'expired' },
        ],
        admin: { description: 'Double opt-in. Empty when this submission does not join the newsletter.' },
      },
      {
        name: 'emailStatus',
        type: 'select',
        label: 'Confirmation email',
        index: true,
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Sent', value: 'sent' },
          { label: 'Failed', value: 'failed' },
        ],
      },
      { name: 'emailNote', type: 'textarea', label: 'Confirmation email note' },
      { name: 'emailAttempts', type: 'number', label: 'Confirmation email attempts', defaultValue: 0, min: 0, admin: { step: 1 } },
      // Hash of the double opt-in token only; `hidden` = never in API responses or the admin.
      { name: 'confirmTokenHash', type: 'text', hidden: true },
      { name: 'confirmExpiresAt', type: 'date', label: 'Link expires', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      { name: 'confirmedAt', type: 'date', label: 'Confirmed at', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      {
        name: 'syncStatus',
        type: 'select',
        label: 'Resend sync',
        index: true,
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Synced', value: 'synced' },
          { label: 'Failed', value: 'failed' },
        ],
        admin: { description: 'Resend contact + newsletter segment + topic opt-in, after confirmation.' },
      },
      { name: 'syncNote', type: 'textarea', label: 'Resend sync note' },
      { name: 'syncAttempts', type: 'number', label: 'Resend sync attempts', defaultValue: 0, min: 0, admin: { step: 1 } },
      { name: 'contactId', type: 'text', label: 'Resend contact ID' },
      // Admin actions: re-send the confirmation email / re-run the sync
      // (POST /api/form-submissions/:id/newsletter/:action). `ui` = no column.
      {
        name: 'newsletterActions',
        type: 'ui',
        admin: { components: { Field: '/components/admin/NewsletterActions#NewsletterActions' } },
      },
    ],
  },
  // A1: admin "Re-send" button → POST /api/form-submissions/:id/resend
  // (src/integrations/events/resendEndpoint.ts), same eventId. `ui` = no column.
  {
    name: 'resendDelivery',
    type: 'ui',
    label: 'Re-send',
    admin: {
      position: 'sidebar',
      disableListColumn: true,
      components: { Field: '/components/admin/ResendDeliveryButton#ResendDeliveryButton' },
    },
  },
]

/** Plugin `form` relationship: declare maxDepth (field convention); the job reads the form itself. */
const withFormMaxDepth = (fields: Field[]): Field[] =>
  fields.map((field) =>
    'name' in field && field.name === 'form' && field.type === 'relationship' ? { ...field, maxDepth: 0 } : field,
  )

/* -------------------------------------------------------------------------- */

export const formBuilder: Plugin = formBuilderPlugin({
  fields: {
    text: true,
    email: true,
    textarea: true,
    select: true,
    checkbox: true,
    message: true,
    number: true,
    date: true,
    payment: false, // CLAUDE.md "Payments exclusion": never enable.
    country: false,
    state: false,
    upload: false,
  },
  // p9 homework → /thank-you?homework=done (SCHEMA §6.12). The plugin declares maxDepth 2 on it.
  redirectRelationships: ['pages'],
  // Empty per-form "Email to" falls back here, then to the from-address (sendEmail.js:40).
  defaultToEmail: process.env.FORMS_DEFAULT_TO_EMAIL || undefined,
  formOverrides: {
    // read: staff. The frontend reads form definitions server-side with
    // overrideAccess (definitions hold notification addresses). Writes: admin.
    access: { read: staffOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
    admin: { defaultColumns: ['title', 'formKey', 'eventType', 'sendEvent', 'updatedAt'] },
    hooks: {
      // S3-1/S3-2 (F18): a form with submissions (NOT NULL FK) or still used by a
      // live lead magnet / site settings cannot be deleted; named message.
      // The plugin has no forms hooks of its own; `formOverrides` is spread
      // into the collection (plugin-form-builder@3.91.0 collections/Forms/index.js:273-274).
      beforeDelete: [blockDeleteIfReferenced({ counted: { 'form-submissions': formSubmissionsSentence } })],
      afterChange: [formsRevalidate.afterChange],
      afterDelete: [formsRevalidate.afterDelete],
    },
    fields: ({ defaultFields }) => [...withInputPlaceholders(adaptPluginFields(defaultFields)), ...formIntegrationFields],
  },
  formSubmissionOverrides: {
    access: {
      read: staffOnly,
      // Only the server-side form handler (after Turnstile siteverify) sets
      // req.context.turnstileVerified; REST callers cannot. Admin may enter one.
      create: turnstileVerifiedOrAdmin,
      update: adminOnly,
      delete: adminOnly,
    },
    // "Failed deliveries" is a SHARED preset (a document in payload-query-presets),
    // not config: it is created by the seed script / an admin (P1 report).
    // TODO(seed): create it (where deliveryStatus equals 'failed', shared with staff).
    enableQueryPresets: true,
    admin: {
      defaultColumns: ['form', 'deliveryStatus', 'deliveryAttempts', 'createdAt'],
    },
    hooks: {
      beforeChange: [stampSubmissionDelivery],
      // A1: enqueue the delivery job on create (never inline). The plugin's
      // sendEmail runs first. A2: also queues the double opt-in email.
      afterChange: [enqueueSubmissionDelivery],
    },
    endpoints: [resendDeliveryEndpoint, newsletterActionEndpoint],
    fields: ({ defaultFields }) => [...withFormMaxDepth(adaptPluginFields(defaultFields)), ...submissionSystemFields],
  },
})
