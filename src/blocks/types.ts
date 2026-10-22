import type { Page } from '@/payload-types'

/**
 * Types derived from the GENERATED `Page` type (never hand-written duplicates).
 *
 * `PageLayoutBlock` is the union of every block row `pages.layout` can hold.
 * While no block is registered the generated `Page` has no `layout` key and
 * this resolves to `never`, so the component map and the showcase registry
 * are empty by type too. After a block lands and `generate:types` runs, the
 * union picks it up automatically.
 */
type LayoutRowsOf<T> = T extends { layout?: infer L } ? (NonNullable<L> extends (infer B)[] ? B : never) : never

export type PageLayoutBlock = LayoutRowsOf<Page>

/** A block slug (`blockType`) registered in `pages.layout`. */
export type PageBlockType = PageLayoutBlock extends { blockType: infer K extends string } ? K : never

/** The generated row type of one block, by slug: `BlockData<'hero'>`. */
export type BlockData<K extends PageBlockType> = Extract<PageLayoutBlock, { blockType: K }>
