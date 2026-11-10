import React, { Fragment } from 'react'

import { deriveCategoryTabs } from '@/blocks/CategoryTabs/Component'
import { blockComponents } from '@/blocks/components'
import { isProduction } from '@/lib/env'

/** The minimum every `pages.layout` row has (generated block types satisfy it). */
export type LayoutRow = { blockType: string; id?: string | null; blockName?: string | null }

type AnyBlockComponent = React.ComponentType<Record<string, unknown>>

/**
 * Renders a page's `layout` rows top to bottom (B0). Server component.
 *
 * Mapping comes from src/blocks/components.ts only. A row whose `blockType`
 * has no component (a config registered without its component, or stale data)
 * is never silently dropped (standing rule: proper error reporting):
 * - production: renders nothing for that row and logs a server-side error
 *   (picked up by the site_error reporter once it exists);
 * - staging / development: renders a visible scaffolding warning in place.
 */
/**
 * Page-level props injected by block type (integrator, big step 5), on top of
 * the row itself:
 * - `categoryTabs` gets `tabs` derived from THIS layout's `accordionFAQ`
 *   `group` blocks (`deriveCategoryTabs`), so the nav can never drift from the
 *   sections. A row that already carries `tabs` (showcase fixtures, which
 *   render one block at a time) keeps its own.
 * - `categoryTabs` (jump variant) also gets `pageAnchors`: every `anchorId` on a
 *   NON-categoryTabs row of this layout (any depth), so a link to a missing section is dropped.
 * - `accordionFAQ` gets `emitJsonLd={false}` when `pageJsonLd` is set: the page
 *   (PageView → PageFaqJsonLd) then emits ONE merged FAQPage for all of them.
 */
function injectedProps(
  block: LayoutRow,
  ctx: { tabs: ReturnType<typeof deriveCategoryTabs>; anchors: string[]; pageJsonLd: boolean },
): Record<string, unknown> {
  if (block.blockType === 'categoryTabs') {
    // `jump` variant: also pass every section anchor in this layout so dead links are dropped. A layout with no
    // section anchors at all (the showcase renders one block at a time) is not filtered.
    const extra = 'pageAnchors' in block || ctx.anchors.length === 0 ? {} : { pageAnchors: ctx.anchors }
    return 'tabs' in block ? extra : { tabs: ctx.tabs, ...extra }
  }
  if (block.blockType === 'accordionFAQ' && ctx.pageJsonLd) return { emitJsonLd: false }
  return {}
}

/** Every string `anchorId` in the layout, at any depth, skipping `categoryTabs` rows (their `links[].anchorId` are references, not targets). */
function collectAnchors(layout: readonly LayoutRow[]): string[] {
  const found = new Set<string>()
  const walk = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(walk)
    if (!value || typeof value !== 'object') return
    for (const [key, v] of Object.entries(value)) {
      if (key === 'anchorId' && typeof v === 'string' && v.trim()) found.add(v.trim())
      else walk(v)
    }
  }
  for (const row of layout) if (row.blockType !== 'categoryTabs') walk(row)
  return [...found]
}

export function RenderBlocks({
  blocks,
  pageJsonLd = false,
}: {
  blocks?: readonly LayoutRow[] | null
  /** The caller emits the page's merged FAQPage JSON-LD; blocks must not emit their own. */
  pageJsonLd?: boolean
}) {
  if (!blocks || blocks.length === 0) return null
  const production = isProduction()
  const ctx = { tabs: deriveCategoryTabs([...blocks]), anchors: collectAnchors(blocks), pageJsonLd }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`
        // Dynamic dispatch by `blockType`: the typed map (BlockComponents) is
        // widened via `unknown` because a per-slug component type is not
        // assignable to a string-indexed one. Props are the row itself.
        const Component = (blockComponents as unknown as Record<string, AnyBlockComponent | undefined>)[block.blockType]

        if (Component) {
          return (
            <Fragment key={key}>
              <Component {...(block as Record<string, unknown>)} {...injectedProps(block, ctx)} />
            </Fragment>
          )
        }

        console.error(
          `[RenderBlocks] No component registered for blockType "${block.blockType}" (row ${index + 1}, id ${block.id ?? 'none'}). Add it to src/blocks/components.ts.`,
        )
        if (production) return null
        return <UnknownBlockWarning key={key} blockType={block.blockType} index={index} />
      })}
    </>
  )
}

/** Dev/staging only. Scaffolding look (system mono, dotted border), never brand styling. */
function UnknownBlockWarning({ blockType, index }: { blockType: string; index: number }) {
  return (
    <div
      role="alert"
      className="mx-auto my-6 max-w-site border-2 border-dotted border-accent px-container-mobile py-4 font-mono text-small-mobile text-ink md:px-container"
    >
      <strong>Missing block component:</strong> &ldquo;{blockType}&rdquo; (section {index + 1}). It is registered in the
      page data but not in <code>src/blocks/components.ts</code>. Hidden in production.
    </div>
  )
}
