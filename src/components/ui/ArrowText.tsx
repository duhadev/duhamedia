import React from 'react'

const TRAILING_ARROW = /^(.*?)(\s*)([→↗])$/su

/**
 * A label whose trailing arrow glyph ("Read the case study →", editor text)
 * gets the interaction system's arrow advance (styles.css `ix-arrow`; ↗ uses
 * `ix-arrow-ne`). Text without a trailing arrow is returned unchanged.
 */
export function ArrowText({ text }: { text: string }) {
  const m = TRAILING_ARROW.exec(text)
  if (!m) return <>{text}</>
  return (
    <>
      {m[1]}
      {m[2]}
      <span aria-hidden="true" className={m[3] === '↗' ? 'ix-arrow-ne' : 'ix-arrow'}>
        {m[3]}
      </span>
    </>
  )
}
