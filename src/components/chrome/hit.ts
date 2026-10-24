/**
 * Invisible >=44x44 touch hit area for a slim link (CLAUDE.md rule 7) without
 * changing its visual box: a centred `::after` that is at least as big as the
 * element and at least 44px both ways. Same idiom as the hero breadcrumbs.
 * Callers must keep neighbours >= the overhang apart (no overlapping hit areas).
 */
export const HIT_AREA =
  "relative after:absolute after:top-1/2 after:left-1/2 after:size-full after:min-h-11 after:min-w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"
