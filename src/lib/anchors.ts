/**
 * Ids the site itself renders (skip-link target `#main` in PageShell, Next's
 * root container, the map's SVG patterns `dc-water-*`, the lead-magnet delivered state, PostList's `postlist-*` heading ids). An editor-made anchor
 * (AccordionFAQ group `anchorId`, RichContent legal section ids) equal to one
 * of these, or starting with `<id>-`, would produce a duplicate DOM id.
 *
 * Config-safe: no React, no `@/` imports (loaded by payload.config.ts via
 * src/blocks/AccordionFAQ/config.ts).
 */
export const RESERVED_ANCHOR_IDS = ['main', '__next', 'dc-water', 'lead-magnet-delivered', 'postlist'] as const

/** True when `id` is a reserved id or starts with `<reserved>-`. */
export const isReservedAnchorId = (id: string): boolean =>
  (RESERVED_ANCHOR_IDS as readonly string[]).some((r) => id === r || id.startsWith(`${r}-`))
