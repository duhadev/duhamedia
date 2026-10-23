import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { Container, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import { fillScarcityTokens, type ScarcityKey } from '@/lib/scarcity'
import type { Client, Scarcity } from '@/payload-types'

const MD_COLS = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-3']

type Statement = NonNullable<Scarcity['statements']>[number]
type Resolved = { loud: string; label?: string; reason: string; big: boolean }

/**
 * ProofStrip, `scarcity` variant (Homepage.dc.html "Proof strip", desktop + mobile builds).
 * Server component: reads the `scarcity` global and the clients through the Local API.
 *
 * Loud/quiet contract (CLAUDE.md rule 2): a statement is rendered ONLY when it has a filled
 * statistic AND a non-blank reason. There is no render path for a reason-less number.
 */
export async function ProofStripBlock({ statements, pricingNote, logos }: BlockData<'proofStrip'>) {
  const picked = (statements ?? []).map((s) => s.key).filter((k): k is ScarcityKey => !!k && k !== 'none').slice(0, 2)
  const resolved = picked.length ? await resolveStatements(picked) : []
  const clients = logos?.show !== false ? await resolveClients(logos) : []
  const note = pricingNote?.trim()

  if (!resolved.length && !clients.length) return null

  return (
    <Section tone="grey" pad="none" divider="both">
      {resolved.length ? (
        <Container className="max-md:px-0">
          <div className={cx('grid', resolved.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
            {resolved.map((s, i) => (
              <StatGroup
                key={i}
                s={s}
                first={i === 0}
                className={cx(
                  'px-4.5 py-7 text-center md:px-8 md:py-11',
                  i === 0 && resolved.length > 1 && 'border-r border-divider',
                )}
              />
            ))}
          </div>
        </Container>
      ) : null}
      {note ? (
        <p className="px-container-mobile pb-6 text-center text-small-mobile text-gray-warm md:px-container md:text-small">
          {note}
        </p>
      ) : null}
      {clients.length ? (
        <div className={cx(resolved.length || note ? 'border-t border-divider' : '')}>
          <Container className="pt-8 pb-10 text-center md:pt-10 md:pb-12">
            {logos?.eyebrow?.trim() ? <Eyebrow muted>{logos.eyebrow.trim()}</Eyebrow> : null}
            <ul aria-label={logos?.eyebrow?.trim() || 'Clients'} className={cx('mt-5 grid list-none grid-cols-2 items-start justify-items-center gap-x-4 gap-y-5 p-0 opacity-55 md:mt-6 md:items-center md:gap-x-10 md:gap-y-6 lg:flex lg:flex-wrap lg:justify-center lg:gap-14',
                MD_COLS[Math.min(clients.length, 6)],
              )}>
              {clients.map((c) => (
                <li key={c.id} className="flex min-h-7 items-center">
                  {c.logo && typeof c.logo === 'object' ? (
                    <Media resource={c.logo} alt={c.name} className="h-7 w-auto max-w-36 object-contain grayscale md:h-8" />
                  ) : (
                    <span className="whitespace-nowrap font-display text-[0.9375rem] uppercase tracking-[0.01em] md:text-[1.25rem] md:tracking-[0.02em]">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}
    </Section>
  )
}

/**
 * One loud/quiet statement. `role=group` named by the loud number (+ its label) and described by
 * the quiet reason, so assistive tech announces them as one unit (F55). Own component for `useId`.
 */
function StatGroup({ s, className, first }: { s: Resolved; className: string; first: boolean }) {
  const uid = useId()
  return (
    <div
      role="group"
      aria-labelledby={`${uid}-n${s.big && s.label ? ` ${uid}-l` : ''}`}
      aria-describedby={`${uid}-r`}
      className={className}
    >
      {s.big ? (
        <>
          <span
            id={`${uid}-n`}
            className={cx(
              'block font-display text-[3.25rem] leading-[.9] font-normal md:text-[5rem]',
              first && 'text-ground-accent',
            )}
          >
            {s.loud}
          </span>
          {s.label ? (
            <span id={`${uid}-l`} className="mt-2.5 block font-display text-[0.9375rem] font-normal uppercase tracking-[0.02em] md:mt-3.5 md:text-[1.125rem]">
              {s.label}
            </span>
          ) : null}
        </>
      ) : (
        <span
          id={`${uid}-n`}
          className={cx(
            'block text-balance font-display text-h3-mobile font-normal uppercase tracking-[0.02em] md:text-h3',
            first && 'text-ground-accent',
          )}
        >
          {s.loud.replace(/ (\S+)$/, '\u00A0$1')}
        </span>
      )}
      <span id={`${uid}-r`} className="mt-2 block text-[0.75rem] leading-[1.4] text-gray-warm md:text-[0.8125rem]">
        {s.reason}
      </span>
    </div>
  )
}

async function resolveStatements(keys: string[]): Promise<Resolved[]> {
  let global: Scarcity
  try {
    const payload = await getPayload({ config })
    global = await payload.findGlobal({ slug: 'scarcity', depth: 0, overrideAccess: false })
  } catch (error) {
    console.error('[ProofStrip] could not read the scarcity global; statements skipped', error)
    return []
  }
  const out: Resolved[] = []
  for (const key of keys) {
    const row: Statement | undefined = global.statements?.find((s) => s.key === key)
    if (!row) {
      console.error(`[ProofStrip] key "${key}" has no statement in the scarcity global; skipped`)
      continue
    }
    const reason = row.reason?.trim()
    if (!reason) {
      console.error(`[ProofStrip] scarcity statement "${key}" has no reason; skipped (a number never renders alone)`)
      continue
    }
    const loud = row.statistic ? fillScarcityTokens(row.statistic, global) : null
    if (!loud) {
      console.error(`[ProofStrip] scarcity statement "${key}" has no usable statistic; skipped`)
      continue
    }
    out.push({ loud, label: row.label?.trim() || undefined, reason, big: /^\d+$/.test(loud) })
  }
  return out
}

async function resolveClients(logos: BlockData<'proofStrip'>['logos']): Promise<Client[]> {
  const published = (c: Client) => c._status !== 'draft'
  try {
    if (logos?.source === 'manual') {
      const items = logos.clients ?? []
      const ids = items.filter((c): c is number => typeof c === 'number')
      let fetched: Client[] = []
      if (ids.length) {
        const payload = await getPayload({ config })
        fetched = (
          await payload.find({
            collection: 'clients',
            where: { id: { in: ids }, _status: { equals: 'published' } },
            depth: 1,
            limit: ids.length,
            pagination: false,
            overrideAccess: false,
          })
        ).docs
      }
      return items
        .map((c) => (typeof c === 'number' ? fetched.find((f) => f.id === c) : c))
        .filter((c): c is Client => !!c && published(c))
    }
    const payload = await getPayload({ config })
    return (
      await payload.find({
        collection: 'clients',
        where: { showInLogoStrip: { equals: true }, _status: { equals: 'published' } },
        sort: 'sortOrder',
        depth: 1,
        limit: 12,
        pagination: false,
        overrideAccess: false,
      })
    ).docs
  } catch (error) {
    console.error('[ProofStrip] could not load clients for the logo row; row hidden', error)
    return []
  }
}
