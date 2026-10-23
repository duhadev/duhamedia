import { isReservedAnchorId } from '@/lib/anchors'

/** Minimal Lexical node shape the walker needs (text runs, links and headings all fit). */
type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }

export type LegalAnchor = { id: string; label: string; node: object }

/** Plain text of a node and its descendants (text runs inside links, bold, etc.). */
const plainText = (node: LexNode): string =>
  typeof node.text === 'string' ? node.text : (node.children ?? []).map(plainText).join('')

/** "4. Sharing & processors" → "4-sharing-processors", "How it's used" → "how-its-used": lowercase a-z/0-9, single hyphens. */
export const anchorSlug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\u2019]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * The legal document's section anchors: one per top-level H2 (an H1 in the
 * content is rendered as H2, so it counts too), in document order.
 * - id = slug of the heading text; empty → `section`; a site-reserved id
 *   (`main`, `__next`, `dc-water-*`, the AccordionFAQ guard list) gets a
 *   `section-` prefix, so it can never duplicate a DOM id the site renders.
 * - duplicates get `-2`, `-3`… (first one keeps the bare slug).
 * - `node` is the Lexical node object itself: the heading converter looks its
 *   id up by identity, so list and headings can never drift apart.
 * Headings with no text are skipped (nothing to link to).
 */
export function legalAnchors(children: readonly unknown[] | undefined): LegalAnchor[] {
  const used = new Set<string>()
  const out: LegalAnchor[] = []
  for (const raw of children ?? []) {
    const node = raw as LexNode
    if (node?.type !== 'heading' || (node.tag !== 'h2' && node.tag !== 'h1')) continue
    const label = plainText(node).replace(/\s+/g, ' ').trim()
    if (!label) continue
    let base = anchorSlug(label) || 'section'
    if (isReservedAnchorId(base)) base = `section-${base}`
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    out.push({ id, label, node: raw as object })
  }
  return out
}
