import type { BlockData, PageBlockType } from '@/blocks/types'

/**
 * /_showcase registry (B0; CLAUDE.md "Block showcase sandbox"): every block and
 * every variant/state of every block, rendered back to back in this order.
 * A block or variant in the schema but missing here is a Gate K finding.
 *
 * Fixtures are STATIC objects typed to the generated block row types (not DB
 * documents), so the sandbox also proves fallback/empty states. Relationship
 * and upload fields may hold populated objects shaped like the generated
 * collection types (e.g. a `Media` with `url`, `width`, `height`, `alt`).
 *
 * `viewport` is the code-level viewport-scope annotation for anything that is
 * intentionally single-viewport; the label shows it. The block component
 * itself does the hiding (`md:hidden` for mobile-only, `max-md:hidden` for
 * desktop-only).
 */
export type ShowcaseViewport = 'mobile-only' | 'desktop-only'

type ShowcaseEntryFor<K extends PageBlockType> = {
  /** Block slug (`blockType`). */
  block: K
  /** Variant value, or the state name for single-variant blocks (e.g. 'default', 'no-url'). */
  variant: string
  viewport?: ShowcaseViewport
  /** Short scaffolding note, e.g. "fallback: no published case studies". */
  label: string
  /** The block row without `blockType` (taken from `block`). */
  data: Omit<BlockData<K>, 'blockType'>
}

export type ShowcaseEntry = { [K in PageBlockType]: ShowcaseEntryFor<K> }[PageBlockType]

export const showcaseEntries: ShowcaseEntry[] = []
