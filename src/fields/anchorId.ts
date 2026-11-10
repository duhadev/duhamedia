import type { Condition, TextField, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { isReservedAnchorId } from '../lib/anchors'

/**
 * Shared `anchorId` field (service pages S9): the in-page link target a block
 * renders as its section `id`, e.g. "pricing" → /services#pricing.
 *
 * Usage, inside a block's `fields`:
 *
 *   anchorIdField()                                       // always shown, empty by default
 *   anchorIdField({ defaultValue: 'pricing' })            // PricingPlans
 *   anchorIdField({ condition: onlyFor('grid', 'detail'), description: '…' })
 *
 * The field is a plain optional `text` named `anchorId`, so swapping a block's
 * hand-written `anchorId` for this helper changes nothing in the database
 * (column `anchor_id`, same type). Only the label, help text and validator differ.
 *
 * Validation (empty is always allowed):
 * 1. lowercase letters, digits and single hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`);
 * 2. not an id the site renders itself (`src/lib/anchors.ts`, incl. `<id>-…`);
 * 3. no clash with any `anchorId` that comes EARLIER in the same top-level
 *    blocks field (`layout`), whatever the blockType and however deep it sits
 *    (block level, or inside a block's array such as SpecLedger items). The
 *    later one is the one flagged, so the editor fixes the row they are on.
 *    `categoryTabs` rows are skipped: their `links[].anchorId` point AT
 *    sections and are expected to repeat them. Do NOT use this helper for such
 *    reference fields.
 *
 * Caveat: an earlier row's value counts even if that row's own `condition`
 * hides it (Payload keeps hidden values). Clear it there if it collides.
 *
 * Config-safe: no React, no `@/` imports (loaded by payload.config.ts).
 * Verified against payload@3.91.0 (installed dist): validate options carry
 * `data` (whole document) and `path` (string segments on the server,
 * fields/hooks/beforeChange/promise.js; numbers may appear in the admin); a
 * custom `validate` replaces the built-in one, so `text()` runs first; a field
 * hidden by `admin.condition` is not validated (promise.js:44).
 */

export type AnchorIdFieldOptions = {
  /** `admin.condition`, e.g. to show the field only for some variants. */
  condition?: Condition
  /** e.g. 'pricing'. Default: none. */
  defaultValue?: string
  /** Admin help text. A generic one is used when omitted. */
  description?: string
  /** Admin label. Default "Section link name". */
  label?: string
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Rows whose `anchorId`s are links TO sections, not section ids. */
const REFERENCE_BLOCKS = new Set(['categoryTabs'])

/**
 * Walks the top-level blocks field in document order and returns the
 * `anchorId` values met before reaching the field at `ownPath`, or null when
 * the field's own position is not found (unknown data shape: skip the check).
 */
const anchorsBefore = (root: unknown, rootKey: string, ownPath: string): string[] | null => {
  const seen: string[] = []
  let found = false
  const walk = (node: unknown, at: string): void => {
    if (found || node === null || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${at}.${i}`))
      return
    }
    const obj = node as Record<string, unknown>
    if (typeof obj.blockType === 'string' && REFERENCE_BLOCKS.has(obj.blockType)) return
    for (const [key, val] of Object.entries(obj)) {
      if (found) return
      if (key === 'anchorId') {
        if (`${at}.${key}` === ownPath) {
          found = true
          return
        }
        if (typeof val === 'string' && val.trim() !== '') seen.push(val.trim())
      } else {
        walk(val, `${at}.${key}`)
      }
    }
  }
  walk(root, rootKey)
  return found ? seen : null
}

const checkAnchorId = (value: string | null | undefined, options: Parameters<TextFieldSingleValidation>[1]): string | true => {
  // The stock text validator reads `req.payload.config`, which does not exist in the browser: guard it.
  let base: string | true = true
  try {
    base = text(value, options) as string | true
  } catch {
    base = true
  }
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  if (!SLUG.test(value)) return 'Use lowercase letters, numbers and single hyphens only, e.g. "pricing".'
  if (isReservedAnchorId(value)) {
    return `"${value}" is used by the site itself. Pick a different name, e.g. "pricing" or "steps".`
  }
  const { path, data } = options ?? {}
  if (!Array.isArray(path) || path.length < 2 || !data) return true
  const rootKey = String(path[0])
  const earlier = anchorsBefore((data as Record<string, unknown>)[rootKey], rootKey, path.map(String).join('.'))
  if (earlier?.includes(value)) {
    return `A section higher up this page already uses "${value}". Each section needs its own link name.`
  }
  return true
}

const validateAnchorId: TextFieldSingleValidation = (value, options) => {
  try {
    return checkAnchorId(value, options)
  } catch {
    // Never throw: in the browser `options` is shaped differently from the server's. Publish-time server run decides.
    return true
  }
}

/** Optional `anchorId` text field with slug, reserved-id and same-page clash checks. */
export const anchorIdField = ({ condition, defaultValue, description, label = 'Section link name' }: AnchorIdFieldOptions = {}): TextField => ({
  name: 'anchorId',
  type: 'text',
  label,
  ...(defaultValue !== undefined ? { defaultValue } : {}),
  validate: validateAnchorId,
  admin: {
    description:
      description ??
      'Lets other pages link straight to this section, e.g. "pricing" → /services#pricing. Lowercase letters, numbers and single hyphens. Must be unique on the page. Optional.',
    ...(condition ? { condition } : {}),
  },
})
