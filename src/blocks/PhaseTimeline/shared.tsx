import React from 'react'

import type { BlockData } from '@/blocks/types'
import { splitAccentPhrase } from '@/lib/accentPhrase'
import { cx } from '@/lib/cx'

export type PhaseTimelineProps = BlockData<'phaseTimeline'>
export type Step = NonNullable<PhaseTimelineProps['steps']>[number]

/** Steps with a title, in order. Untitled rows are skipped and logged. */
export const titledSteps = (steps: PhaseTimelineProps['steps'], variant: string): Step[] => {
  const rows = (steps ?? []).filter((s) => s?.title?.trim())
  if ((steps ?? []).length !== rows.length) {
    console.error(`[PhaseTimeline:${variant}] a step is missing its title and was skipped.`)
  }
  return rows
}

/**
 * Heading with the optional accent phrase in --ground-accent (the finals'
 * inline recolour), at a size the caller passes. Used where the page design's
 * section headline has no AccentHeadline level (Services Hub 1.875/2.25rem,
 * the ink bands' 1.5rem), as TwoTrackPanels `contrast` does.
 */
export function Headline({
  text,
  accent,
  className,
  id,
}: {
  text: string
  accent?: string | null
  className: string
  id?: string
}) {
  const parts = splitAccentPhrase(text, accent)
  return (
    <h2 id={id} className={cx('font-display font-normal uppercase text-balance', className)}>
      {parts ? (
        <>
          {parts[0]}
          <span className="text-ground-accent">{parts[1]}</span>
          {parts[2]}
        </>
      ) : (
        text
      )}
    </h2>
  )
}
