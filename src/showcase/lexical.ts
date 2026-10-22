import type { Faq, Media } from '@/payload-types'

/**
 * Tiny builders for STATIC Lexical fixtures in /_showcase (never DB data).
 * The node shapes are the ones Payload's Lexical editor saves
 * (@payloadcms/richtext-lexical@3.91.0 serialized nodes); the root satisfies
 * the generated rich-text field type, which is the same in every collection.
 */
export type LexicalRoot = Faq['answer']
type Node = LexicalRoot['root']['children'][number]

const base = { direction: 'ltr', format: '', indent: 0, version: 1 } as const

/** A text run; `bold` sets Lexical's format bit 1. */
export const text = (t: string, { bold = false }: { bold?: boolean } = {}): Node => ({
  type: 'text',
  text: t,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const kids = (children: (string | Node)[]): Node[] => children.map((c) => (typeof c === 'string' ? text(c) : c))

export const p = (...children: (string | Node)[]): Node => ({ ...base, type: 'paragraph', textFormat: 0, children: kids(children) })

export const h = (tag: 'h2' | 'h3' | 'h4', t: string): Node => ({ ...base, type: 'heading', tag, children: [text(t)] })

export const quote = (t: string): Node => ({ ...base, type: 'quote', children: [text(t)] })

export const hr = (): Node => ({ type: 'horizontalrule', version: 1 })

export const ul = (...items: string[]): Node => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(t)] })),
})

/** Internal link to a (static, populated) document; `doc: null` = unresolved target (renders as plain text). */
export const internalLink = (
  t: string,
  doc: { relationTo: 'pages' | 'case-studies' | 'posts' | 'lead-magnets'; value: { id: number; slug?: string | null } } | null,
): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { linkType: 'internal', newTab: false, doc },
  children: [text(t)],
})

export const customLink = (t: string, url: string, newTab = false): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { linkType: 'custom', newTab, url },
  children: [text(t)],
})

/** An image upload node with the RichContent caption field. */
export const figure = (media: Media, caption: string): Node => ({
  type: 'upload',
  version: 3,
  format: '',
  id: `fx-upload-${media.id}`,
  relationTo: 'media',
  value: media,
  fields: { caption },
})

export const root = (...children: Node[]): LexicalRoot => ({
  root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children },
})
