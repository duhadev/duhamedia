import React, { Fragment } from 'react'

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
export function RenderBlocks({ blocks }: { blocks?: readonly LayoutRow[] | null }) {
  if (!blocks || blocks.length === 0) return null
  const production = isProduction()

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`
        const Component = (blockComponents as Record<string, AnyBlockComponent | undefined>)[block.blockType]

        if (Component) {
          return (
            <Fragment key={key}>
              <Component {...(block as Record<string, unknown>)} />
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
