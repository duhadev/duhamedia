import type { SiteSetting } from '@/payload-types'

/**
 * Article and newsletter-issue template labels (S6-S, F76 precedent): the
 * fixed wording on every `/insights/<slug>` and `/newsletter/<slug>` page,
 * editable in Site settings > Template labels.
 *
 * ONE source for both sides: `site-settings` uses these as `defaultValue`
 * and the posts template falls back to them field by field, so a global
 * that was never saved (`{}`), an existing row whose new columns are NULL,
 * or a field the editor cleared all render the current design copy. Plain
 * module (no server-only) because the global config imports it.
 *
 * Composition (renderer's job, S6-T1): byline = `${bylinePrefix} ${author},
 * ${bylineOrganisation}`; date line = `${publishedPrefix} <date> · ${updatedPrefix}
 * <date> · <n> ${readTimeSuffix}`; FAQ eyebrow fallback (post `faqHeading`
 * empty) = `${targetKeyword} ${faqEyebrowSuffix}`; "How Duha does it" eyebrow
 * fallback (post `howWeDoIt.eyebrow` empty) = `howWeDoItEyebrow`; issue
 * eyebrow = `${issueWord} 011`.
 */
export const POST_LABEL_DEFAULTS = {
  bylinePrefix: 'By',
  bylineOrganisation: 'Duha Media',
  publishedPrefix: 'Published',
  updatedPrefix: 'Updated',
  readTimeSuffix: 'min read',
  faqEyebrowSuffix: '— common questions',
  howWeDoItEyebrow: 'How we do it',
  issueWord: 'Issue',
} as const

export type PostLabels = { -readonly [K in keyof typeof POST_LABEL_DEFAULTS]: string }

/** Stored value when it has text, else the default (per field). */
export const resolvePostLabels = (stored: SiteSetting['postLabels'] | null | undefined): PostLabels => {
  const out = { ...POST_LABEL_DEFAULTS } as PostLabels
  for (const key of Object.keys(out) as (keyof PostLabels)[]) {
    const value = stored?.[key]
    if (typeof value === 'string' && value.trim() !== '') out[key] = value.trim()
  }
  return out
}
