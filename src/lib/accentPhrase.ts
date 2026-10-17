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
