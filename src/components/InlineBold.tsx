import React from 'react'

/**
 * `**phrase**` -> <strong>, the same editor convention as TwoTrackPanels'
 * card bodies. Splits on the literal `**`; odd segments are bold; an
 * unmatched trailing `**` is put back as text. Output is React text nodes
 * only (escaped), so editor input can never inject markup.
 */
export function InlineBold({ text }: { text: string }) {
  const parts = text.split('**')
  if (parts.length % 2 === 0) parts.splice(-2, 2, `${parts[parts.length - 2]}**${parts[parts.length - 1]}`)
  return <>{parts.map((part, i) => (i % 2 === 1 ? (part ? <strong key={i}>{part}</strong> : null) : part))}</>
}

/** Paragraphs from a textarea: a blank line starts a new paragraph. */
export const paragraphsOf = (text: string | null | undefined): string[] =>
  (text ?? '')
    .split(/\n[ \t]*\n/)
    .map((t) => t.trim())
    .filter(Boolean)
