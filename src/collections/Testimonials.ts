import type {
  CheckboxFieldValidation,
  CollectionConfig,
  Condition,
  NumberFieldSingleValidation,
  TextFieldSingleValidation,
  UploadFieldSingleValidation,
} from 'payload'
import { number, upload } from 'payload/shared'

import { staffContentAccess } from '../access'
import { contentVersions, sortOrderField, validateHttpsUrl, validateYouTubeUrl } from '../fields'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { revalidateTagHooks } from '../hooks/revalidateTag'

/**
 * `testimonials` (SCHEMA.md §2.2, §6.4, §4.3, §5, §10, X14 — Gate S approved
 * 2026-10-17).
 *
 * Every client quote, video testimonial and public review: p1 §Testimonials,
 * p2 §Client voice, p3 §Proof pull, p4 §Featured proof, p5 §Proof fallback,
 * p7 §Testimonial feed, p9 §Social proof, p15 §Testimonial, p16 §Social proof,
 * p19 §Review wall. Gate S §2.2: Google-Business-Profile-style reviews MERGE
 * here via `source` (+ `sourceUrl`, `verbatim`, `rating`), so p7's and p19's
 * mixed feeds are one ordered, paginated query.
 * R6: the source label and stars are data, never hard-coded; no rating means
 * no stars (never defaulted to 5). R5: every reviewer, quote and metric today
 * is a placeholder and is seeded as such.
 * X14: the video/text switch is `format` (not `type`).
 * Video (Gate S Q5, Decision log 2026-10-17): YouTube unlisted, poster image
 * stored locally in `media`.
 *
 * Conditional requirements are custom `validate` functions rather than
 * `required: true`, so the generated types stay optional for fields that are
 * legitimately empty (e.g. `sourceUrl` on a direct quote). Validation runs on
 * publish only (`drafts.validate: false`), and fields hidden by their
 * `admin.condition` are not validated (payload@3.91.0
 * fields/hooks/beforeChange/promise.js:44).
 *
 * Drafts on (SCHEMA §5.1). Revalidation (tag `testimonials`) is the integrator's.
 */

const SOURCE_OPTIONS = [
  { label: 'Direct (client quote)', value: 'direct' },
  { label: 'Google review', value: 'google-review' },
  { label: 'LinkedIn', value: 'linkedin' },
] as const

const notDirect: Condition = (_data, siblingData) => (siblingData?.source ?? 'direct') !== 'direct'
const isGoogle: Condition = (_data, siblingData) => siblingData?.source === 'google-review'
const isVideo: Condition = (_data, siblingData) => siblingData?.format === 'video'

/** Required whenever the field is shown (source is Google or LinkedIn). */
const validateSourceUrl: TextFieldSingleValidation = (value, options) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return 'Add the public link to this review (required for Google and LinkedIn reviews).'
  }
  return validateHttpsUrl(value, options)
}

/** p7/p19: Google reviews are "pulled verbatim from Google, never paraphrased". */
const validateVerbatim: CheckboxFieldValidation = (value) =>
  value === true ? true : 'Google reviews must be copied word for word. Tick this to confirm.'

const validateRating: NumberFieldSingleValidation = (value, options) => {
  const base = number(value, options)
  if (base !== true) return base
  if (value === null || value === undefined) return true
  return Number.isInteger(value) ? true : 'Use a whole number of stars from 1 to 5.'
}

const validateVideoUrl: TextFieldSingleValidation = (value, options) => {
  if (typeof value !== 'string' || value.trim() === '') return 'Add the YouTube link for this video testimonial.'
  return validateYouTubeUrl(value, options)
}

const validatePoster: UploadFieldSingleValidation = (value, options) => {
  if (value === null || value === undefined || value === '') {
    return 'Add a poster image (shown before the video plays).'
  }
  return upload(value, options)
}

/** SCHEMA §10: public reads are cached under the `testimonials` tag. */
const revalidate = revalidateTagHooks('testimonials')

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'source', 'format', 'client', 'sortOrder', '_status'],
    description: 'Client quotes, video testimonials and public reviews (Google, LinkedIn).',
  },
  defaultSort: 'sortOrder',
  access: staffContentAccess,
  versions: contentVersions,
  hooks: {
    afterChange: [revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced()],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'The words of the testimonial or review.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'authorName',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. "J. Alvarez".' },
        },
        {
          name: 'authorRole',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "3-location retailer, Chicago".' },
        },
      ],
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      maxDepth: 1,
      admin: { description: 'Optional brand pairing. Its logo shows on video cards.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'direct',
      options: [...SOURCE_OPTIONS],
      admin: {
        position: 'sidebar',
        description: 'Where this lives. Sets the source label shown on the card.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source URL',
      validate: validateSourceUrl,
      admin: {
        condition: notDirect,
        description: 'Public link where a visitor can verify this review. Required for Google and LinkedIn.',
      },
    },
    {
      name: 'verbatim',
      type: 'checkbox',
      label: 'Copied word for word from Google',
      defaultValue: false,
      validate: validateVerbatim,
      admin: {
        condition: isGoogle,
        description: 'Required for Google reviews: never paraphrase them.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      validate: validateRating,
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Stars, 1 to 5. Leave empty for no stars.',
      },
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Video', value: 'video' },
      ],
      admin: { position: 'sidebar', description: 'Video shows a playable tile with the quote beneath.' },
    },
    {
      name: 'video',
      type: 'group',
      admin: { condition: isVideo },
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'YouTube URL',
          validate: validateVideoUrl,
          admin: { description: 'The (unlisted) YouTube link. Required for video testimonials.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              maxDepth: 1,
              validate: validatePoster,
              admin: { width: '50%', description: 'Still image shown before play. Required for video.' },
            },
            {
              name: 'durationLabel',
              type: 'text',
              admin: { width: '50%', description: 'Optional, e.g. "1:42".' },
            },
          ],
        },
      ],
    },
    {
      name: 'metric',
      type: 'group',
      admin: { description: 'Optional headline result shown on the card, e.g. "+212%" / "Revenue, 12 mo".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', admin: { width: '40%', description: 'A result, never a price.' } },
            { name: 'label', type: 'text', admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      // SCHEMA §6.4: p7 "Read the full case study" deep link. Rendered only
      // when the study is published (R3): for public reads a draft study is
      // not populated (read access), so components treat a non-object as absent.
      name: 'caseStudy',
      type: 'relationship',
      relationTo: 'case-studies',
      maxDepth: 1,
      admin: { description: 'Optional. Links "Read the full case study" once that study is published.' },
    },
    {
      name: 'reviewDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'When the review or quote was given.',
      },
    },
    sortOrderField('Order in the feed and review wall. Lower numbers come first.'),
  ],
}
