import type { CollectionConfig, NumberField, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { youtubeVideoId } from '../lib/youtube'

/**
 * Shared schema pieces reused across collections (SCHEMA.md §3, §5).
 *
 * Only what C3–C6 need lives here today. The §3 block-facing factories
 * (`linkField`, `pricingNote`, `metricFields`, `scarcityRef`, `headlineFields`,
 * `eyebrowField`) are added with the first unit that uses them: none of
 * clients / team-members / testimonials / faqs does (SCHEMA §6.4–6.7).
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
