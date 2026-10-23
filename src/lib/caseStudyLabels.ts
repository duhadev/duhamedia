import type { SiteSetting } from '@/payload-types'

/**
 * Case-study template labels (F76, human 2026-10-23): the fixed wording on
 * every `/work/<slug>` page, editable in Site settings > Template labels.
 *
 * ONE source for both sides: `site-settings` uses these as `defaultValue`
 * and the template falls back to them field by field, so a global that was
 * never saved (`{}`), an existing row whose new columns are NULL, or a field
 * the editor cleared all render the current copy. Plain module (no
 * server-only) because the global config imports it.
 */
export const CASE_STUDY_LABEL_DEFAULTS = {
  breadcrumbWork: 'Work',
  studyWord: 'Study',
  publishedPrefix: 'Published',
  figuresApproved: 'Client-approved figures',
  readTimeSuffix: 'min read',
  inShort: 'In short',
  nextStudy: 'Next study',
  nextStudyRead: 'Read it →',
  clientVoiceNumber: '04',
  clientVoiceDifferently: "What we'd do differently",
  clientVoicePhases: 'How this maps to our phases',
} as const

export type CaseStudyLabels = { -readonly [K in keyof typeof CASE_STUDY_LABEL_DEFAULTS]: string }

/** Stored value when it has text, else the default (per field). */
export const resolveCaseStudyLabels = (stored: SiteSetting['caseStudyLabels'] | null | undefined): CaseStudyLabels => {
  const out = { ...CASE_STUDY_LABEL_DEFAULTS } as CaseStudyLabels
  for (const key of Object.keys(out) as (keyof CaseStudyLabels)[]) {
    const value = stored?.[key]
    if (typeof value === 'string' && value.trim() !== '') out[key] = value.trim()
  }
  return out
}
