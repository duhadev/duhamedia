/**
 * What Duha delivered on a case study (brochure 2026-11-07 p6 kicker:
 * "Brand · Design · Custom Shopify build"). One list for the `case-studies`
 * `services` select and for the study previews that print the labels, so the
 * wording cannot drift. Plain module: the collection config imports it.
 */
export const CASE_STUDY_SERVICES = [
  { label: 'Brand', value: 'brand' },
  { label: 'Design', value: 'design' },
  { label: 'Custom Shopify build', value: 'custom-shopify-build' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'SEO', value: 'seo' },
  { label: 'Content', value: 'content' },
] as const

export type CaseStudyService = (typeof CASE_STUDY_SERVICES)[number]['value']

const LABELS = new Map<string, string>(CASE_STUDY_SERVICES.map((s) => [s.value, s.label]))

/** Labels in the editor's order; unknown values are dropped. */
export const serviceLabels = (values: readonly string[] | null | undefined): string[] =>
  (values ?? []).flatMap((v) => {
    const label = LABELS.get(v)
    return label ? [label] : []
  })
