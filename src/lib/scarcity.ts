/**
 * Scarcity statements (SCHEMA.md §7.2, §3 `scarcityRef()`): the shared, dependency-free
 * pieces of the `scarcity` global. Plain module (no server imports) so the global config,
 * the admin RowLabel (client), the future `scarcityRef()` field factory and the frontend
 * blocks all read the SAME key list and token rules.
 */

/** Statement keys (SCHEMA §7.2). Each key may appear once; blocks pick one via `scarcityRef()`. */
export const SCARCITY_KEYS = [
  { label: 'Projects ongoing (big number)', value: 'ongoing' },
  { label: 'Client cap (big number)', value: 'capacity' },
  { label: 'Builds line (Final CTA)', value: 'builds-line' },
  { label: 'Engines line (Marketing / MKT-SEO Final CTA)', value: 'engines-line' },
  { label: 'Slots line (Link-in-Bio)', value: 'slots-line' },
  { label: 'Offer line (Campaign LP offer)', value: 'offer-line' },
] as const

export type ScarcityKey = (typeof SCARCITY_KEYS)[number]['value']

export const SCARCITY_KEY_LABELS: Record<string, string> = Object.fromEntries(
  SCARCITY_KEYS.map(({ label, value }) => [value, label]),
)

/** The counts a statement's tokens are filled from (the four number fields of the global). */
export type ScarcityCounts = {
  activeClients?: number | null
  buildsInProgress?: number | null
  capacity?: number | null
  enginesRunning?: number | null
}

/** Tokens a `statistic` may contain, and the count each one stands for. `{open}` = capacity − active. */
export const SCARCITY_TOKENS = {
  active: (c: ScarcityCounts) => c.activeClients,
  builds: (c: ScarcityCounts) => c.buildsInProgress,
  capacity: (c: ScarcityCounts) => c.capacity,
  engines: (c: ScarcityCounts) => c.enginesRunning,
  open: (c: ScarcityCounts) =>
    typeof c.capacity === 'number' && typeof c.activeClients === 'number'
      ? Math.max(0, c.capacity - c.activeClients)
      : null,
} as const satisfies Record<string, (c: ScarcityCounts) => number | null | undefined>

const TOKEN_RE = /\{([^{}]*)\}/g

/** Unknown `{tokens}` in a statistic, e.g. `{slots}` → `['slots']`. */
export function unknownScarcityTokens(statistic: string): string[] {
  return [...statistic.matchAll(TOKEN_RE)].map((m) => m[1]).filter((name) => !(name in SCARCITY_TOKENS))
}

/**
 * Replace tokens with the current counts ("{builds} builds in progress" → "3 builds in progress").
 * Returns `null` when a token's count is missing, so a component can skip the statement rather
 * than print a half-filled number. Rendering is the block's job; this keeps the token list in one place.
 */
export function fillScarcityTokens(statistic: string, counts: ScarcityCounts): string | null {
  let missing = false
  const out = statistic.replace(TOKEN_RE, (whole, name: string) => {
    const read = (SCARCITY_TOKENS as Record<string, (c: ScarcityCounts) => number | null | undefined>)[name]
    if (!read) return whole
    const n = read(counts)
    if (typeof n !== 'number') {
      missing = true
      return whole
    }
    return String(n)
  })
  return missing ? null : out
}

/* ---- Validation messages (plain language for the marketing editor) ---- */

export const REASON_REQUIRED_MESSAGE =
  'Every statement needs its reason. A number on its own is never shown on the site.'
export const STATISTIC_REQUIRED_MESSAGE = 'Enter the statement (the big, loud line).'
export const DUPLICATE_KEY_MESSAGE =
  'This statement type is already used in another row. Each type can be used once; edit that row instead.'
export const WHOLE_NUMBER_MESSAGE = 'Enter a whole number, e.g. 3.'

/** "<label> can't be more than the client cap (7)…" — used by every count capped by `capacity`. */
export const overCapacityMessage = (label: string, capacity: number) =>
  `${label} can't be more than the client cap (${capacity}). Raise the cap first, or lower this number.`

export const unknownTokensMessage = (tokens: string[]) =>
  `Unknown placeholder ${tokens.map((t) => `{${t}}`).join(', ')}. Use only {active}, {capacity}, {builds}, {engines} or {open}.`
