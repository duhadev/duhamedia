/**
 * Plain-text word count of Lexical rich-text JSON (`{ root: { children } }`),
 * used by the `readTime` fill (SCHEMA §10: case-studies, posts). Walks every
 * node and counts the words of `text` nodes; uploads/links contribute only
 * their visible text. Never throws on malformed input.
 */
type LexicalNode = { text?: unknown; children?: unknown }

export const lexicalWordCount = (value: unknown): number => {
  const root = (value as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return 0
  let words = 0
  const stack: unknown[] = [root]
  while (stack.length) {
    const node = stack.pop() as LexicalNode | null
    if (!node || typeof node !== 'object') continue
    if (typeof node.text === 'string') words += node.text.split(/\s+/).filter(Boolean).length
    if (Array.isArray(node.children)) stack.push(...node.children)
  }
  return words
}

/** Words per minute for "N min read" (common long-form reading speed). */
export const WORDS_PER_MINUTE = 225

export const readTimeMinutes = (words: number): number | null =>
  words > 0 ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : null
