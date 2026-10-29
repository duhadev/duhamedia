import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { Container, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import { fillScarcityTokens } from '@/lib/scarcity'
import type { Client, Scarcity } from '@/payload-types'

const MD_COLS = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-3']

type Statement = NonNullable<Scarcity['statements']>[number]
type Resolved = { loud: string; label?: string; reason: string; big: boolean }

/**
 * ProofStrip, `scarcity` variant (admin label "Numbers"; Homepage.dc.html "Proof strip", desktop +
 * mobile builds). Server component: reads the clients through the Local API.
 *
 * Each item is a big number + big text typed on the block. Human decision 2026-10-29: this strip
 * renders NO reason line (an explicit override of the loud/quiet rule for THIS strip only; every
 * other scarcity consumer, incl. the `metrics` variant's capacity tile below, keeps its reason).
 */
export async function ProofStripBlock(props: BlockData<'proofStrip'>) {
  if (props.variant === 'metrics') return <ProofMetrics {...props} />
  const { statements, pricingNote, logos } = props
  const items = (statements ?? [])
    .map((s) => ({ id: s.id, number: s.number?.trim() ?? '', label: s.label?.trim() ?? '' }))
    .filter((s) => s.number && s.label)
    .slice(0, 4)
  const clients = logos?.show !== false ? await resolveClients(logos) : []
  const note = pricingNote?.trim()
  const n = items.length

  if (!n && !clients.length) return null

  return (
    <Section tone="grey" pad="none" divider="both">
      {n ? (
        <Container className="max-md:px-0">
          <div className={cx('grid', n > 1 ? 'grid-cols-2' : 'grid-cols-1', n === 3 && 'md:grid-cols-3', n === 4 && 'md:grid-cols-4')}>
            {items.map((s, i) => (
              <NumberItem
                key={s.id ?? i}
                number={s.number}
                label={s.label}
                first={i === 0}
                className={cx(
                  'border-divider px-4.5 py-7 text-center md:px-8 md:py-11',
                  // Hairline between neighbours: mobile is a 2-up grid, desktop one row.
                  i < n - 1 && (i % 2 === 0 ? 'border-r' : 'md:border-r'),
                  i >= 2 && 'border-t md:border-t-0',
                  n === 3 && i === 2 && 'col-span-2 md:col-span-1',
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
        <div className={cx(n || note ? 'border-t border-divider' : '')}>
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
 * ProofStrip, `metrics` variant (Campaign LP.dc.html "Proof strip", desktop + mobile builds): cream
 * ground, hairline below, left-aligned in the 820 column. Up to three typographic metrics (DS Metric
 * size sm), the optional capacity statement (loud line, quiet reason; from the scarcity global, never
 * typed), then the logo names at 55% opacity. The pricing note is a small line beneath (rule 5: the
 * design's "$5K" / "$1K/MO" tiles are never metrics). Renders nothing when nothing is set.
 */
async function ProofMetrics({ metrics, capacityStatement, pricingNote, logos }: BlockData<'proofStrip'>) {
  const shown = (metrics ?? [])
    .filter((m) => m.value?.trim() && m.label?.trim())
    .slice(0, 3)
  const capKey = capacityStatement && capacityStatement !== 'none' ? capacityStatement : null
  const [capacity] = capKey ? await resolveStatements([capKey]) : []
  const clients = logos?.show !== false ? await resolveClients(logos) : []
  const note = pricingNote?.trim()

  if (!shown.length && !capacity && !clients.length && !note) return null

  return (
    <Section tone="light" pad="none" divider="bottom">
      <Container className="flex flex-col gap-5 py-6 md:max-w-205 md:gap-4 md:py-8">
        {shown.length || capacity || clients.length ? (
          <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-center md:gap-x-14 md:gap-y-6">
            {shown.length || capacity ? (
              <div className="flex flex-wrap gap-x-7 gap-y-5 md:gap-x-14 md:gap-y-6">
                {shown.map((m, i) => (
                  <div key={m.id ?? i}>
                    <span className={cx('block font-display text-[2rem] leading-none font-normal', m.accent ? 'text-accent-primary' : 'text-ink')}>
                      {m.value}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] font-bold uppercase tracking-eyebrow">{m.label}</span>
                    {m.sub?.trim() ? <span className="mt-1 block text-[0.8125rem] font-medium text-gray-warm">{m.sub}</span> : null}
                  </div>
                ))}
                {capacity ? <CapacityTile s={capacity} /> : null}
              </div>
            ) : null}
            {clients.length ? (
              <ul
                aria-label={logos?.eyebrow?.trim() || 'Clients'}
                className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0 opacity-55 md:gap-x-8"
              >
                {clients.map((c) => (
                  <li key={c.id} className="flex min-h-7 items-center">
                    {c.logo && typeof c.logo === 'object' ? (
                      <Media resource={c.logo} alt={c.name} className="h-7 w-auto max-w-36 object-contain grayscale" />
                    ) : (
                      <span className="whitespace-nowrap font-display text-[0.9375rem] uppercase md:text-[1rem]">{c.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        {note ? <p className="m-0 text-small-mobile text-gray-warm md:text-small">{note}</p> : null}
      </Container>
    </Section>
  )
}

/** The capacity tile: loud line (+ label for a bare count), quiet reason always beneath (rule 2). */
function CapacityTile({ s }: { s: Resolved }) {
  const uid = useId()
  return (
    <div role="group" aria-labelledby={`${uid}-n${s.big && s.label ? ` ${uid}-l` : ''}`} aria-describedby={`${uid}-r`} className="max-w-64">
      {s.big ? (
        <>
          <span id={`${uid}-n`} className="block font-display text-[2rem] leading-none font-normal text-ink">{s.loud}</span>
          {s.label ? (
            <span id={`${uid}-l`} className="mt-2 block text-[0.8125rem] font-bold uppercase tracking-eyebrow">{s.label}</span>
          ) : null}
        </>
      ) : (
        <span id={`${uid}-n`} className="block text-balance font-display text-h3-mobile font-normal uppercase tracking-[0.02em] md:text-h3">
          {s.loud.replace(/ (\S+)$/, '\u00A0$1')}
        </span>
      )}
      <span id={`${uid}-r`} className="mt-1 block text-[0.8125rem] leading-[1.4] text-gray-warm">{s.reason}</span>
    </div>
  )
}

/**
 * One number item: big number (first one accent-coloured) + big text. `role=group` named by both,
 * so assistive tech announces them as one unit. Own component for `useId`.
 */
function NumberItem({ number, label, className, first }: { number: string; label: string; className: string; first: boolean }) {
  const uid = useId()
  return (
    <div role="group" aria-labelledby={`${uid}-n ${uid}-l`} className={className}>
      <span
        id={`${uid}-n`}
        className={cx('block font-display text-[3.25rem] leading-[.9] font-normal md:text-[5rem]', first && 'text-ground-accent')}
      >
        {number}
      </span>
      <span id={`${uid}-l`} className="mt-2.5 block font-display text-[0.9375rem] font-normal uppercase tracking-[0.02em] md:mt-3.5 md:text-[1.125rem]">
        {label}
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
