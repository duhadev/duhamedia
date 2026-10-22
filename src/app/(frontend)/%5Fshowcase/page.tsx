import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/RenderBlocks'
import { showcaseEnabled } from '@/showcase/enabled'
import { showcaseEntries, type ShowcaseEntry } from '@/showcase/registry'

/**
 * /_showcase — the block sandbox (CLAUDE.md "Block showcase sandbox", Gate K).
 *
 * The folder is `%5Fshowcase` because a `_folder` is a private folder that
 * Next excludes from routing; `%5F` (URL-encoded `_`) creates a segment that
 * starts with an underscore (next@16 docs, getting-started/project-structure
 * "Private folders").
 *
 * - 404 when APP_ENV=production (`showcaseEnabled`); local dev + staging only.
 * - Always noindex, never in the sitemap or navigation (no pages doc can have
 *   this path: `_` segments are reserved, src/lib/pagePath.ts).
 * - Scaffolding (labels, dividers) uses the system mono stack only.
 */
export const metadata: Metadata = {
  title: 'Block showcase (sandbox)',
  robots: { index: false, follow: false },
}

const VIEWPORT_NOTE: Record<NonNullable<ShowcaseEntry['viewport']>, string> = {
  'mobile-only': 'renders below 768px only, by design',
  'desktop-only': 'renders from 768px only, by design',
}

function EntryLabel({ entry, index }: { entry: ShowcaseEntry; index: number }) {
  return (
    <div className="px-container-mobile py-8 font-mono text-small-mobile text-ink md:px-container">
      <p>
        <span className="text-gray-warm">{String(index + 1).padStart(2, '0')}</span>{' '}
        <strong>{entry.block}</strong> · {entry.variant}
        {entry.viewport ? (
          <>
            {' '}
            <span className="border border-ink px-1.5 py-0.5 uppercase">{entry.viewport}</span>{' '}
            <span className="text-gray-warm">({VIEWPORT_NOTE[entry.viewport]})</span>
          </>
        ) : null}
      </p>
      <p className="mt-1 text-gray-warm">{entry.label}</p>
    </div>
  )
}

export default function ShowcasePage() {
  if (!showcaseEnabled()) notFound()

  return (
    <main className="pb-24">
      <header className="border-b-2 border-dotted border-ink px-container-mobile py-10 font-mono text-small-mobile md:px-container">
        <p>
          <strong>/_showcase</strong> — block sandbox. Not a site page; hidden in production, noindex.
        </p>
        <p className="mt-1 text-gray-warm">
          {showcaseEntries.length} {showcaseEntries.length === 1 ? 'entry' : 'entries'}. Each block, variant and state,
          back to back. Resize the window to check mobile (&lt;768px) and desktop.
        </p>
      </header>

      {showcaseEntries.length === 0 ? (
        <div className="px-container-mobile py-24 font-mono text-small-mobile md:px-container">
          <p>
            <strong>No blocks yet.</strong> Each block is appended to <code>src/showcase/registry.ts</code> as it clears
            Gate 1.
          </p>
        </div>
      ) : (
        showcaseEntries.map((entry, index) => (
          <section
            key={`${entry.block}-${entry.variant}-${index}`}
            aria-label={`${entry.block} · ${entry.variant}`}
            data-viewport={entry.viewport}
            className="mt-16 border-t-2 border-dotted border-ink pb-16"
          >
            <EntryLabel entry={entry} index={index} />
            <RenderBlocks blocks={[{ ...entry.data, blockType: entry.block }]} />
          </section>
        ))
      )}
    </main>
  )
}
