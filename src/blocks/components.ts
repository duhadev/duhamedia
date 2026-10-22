import type React from 'react'

import type { BlockData, PageBlockType } from './types'

/**
 * Block COMPONENT registry (B0): `blockType` → React component, used by
 * src/components/RenderBlocks.tsx (pages) and /_showcase.
 *
 * Typed against the generated `Page['layout']` union: once a block's config is
 * in src/blocks/index.ts and `generate:types` has run, TypeScript REQUIRES its
 * entry here (missing key = type error), and each component's props are that
 * block's generated row type.
 *
 * Add: `import { HeroBlock } from './Hero/Component'` and `hero: HeroBlock,`.
 */
export type BlockComponents = {
  [K in PageBlockType]: React.ComponentType<BlockData<K>>
}

export const blockComponents: BlockComponents = {}
