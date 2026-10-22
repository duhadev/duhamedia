/**
 * Pure accent-phrase rule shared by the server validator (`validateAccentPhrase`
 * in src/fields) and the admin client component (`AccentPhraseField`), so the
 * browser flags it exactly as the server does. No imports: safe in 'use client'.
 */
export const ACCENT_PHRASE_MESSAGE = 'The accent phrase must be copied exactly from the headline (same words, any capitals).'

export const accentPhraseError = (value: unknown, heading: unknown): true | string => {
  if (typeof value !== 'string' || value.trim() === '') return true
  if (typeof heading === 'string' && heading.toLowerCase().includes(value.trim().toLowerCase())) return true
  return ACCENT_PHRASE_MESSAGE
}

/**
 * Split a heading around its accent phrase (same case-insensitive rule as
 * `accentPhraseError`), keeping the heading's own spelling. `null` when there
 * is no (matching) accent. Used by the AccentHeadline primitive.
 */
export const splitAccentPhrase = (
  heading: string,
  accent: string | null | undefined,
): [before: string, accent: string, after: string] | null => {
  const phrase = typeof accent === 'string' ? accent.trim() : ''
  if (!phrase) return null
  const start = heading.toLowerCase().indexOf(phrase.toLowerCase())
  if (start === -1) return null
  const end = start + phrase.length
  return [heading.slice(0, start), heading.slice(start, end), heading.slice(end)]
}
