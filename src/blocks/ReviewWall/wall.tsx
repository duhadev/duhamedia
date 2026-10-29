import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import { AccentHeadline, Container, Eyebrow, Media, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import { fillScarcityTokens } from '@/lib/scarcity'
import type { Client, Scarcity } from '@/payload-types'

import type { ReviewWallProps } from './Component'
import { loadWallTestimonials } from './data'
import { TextCard, toFeedCard, type FeedCardData, type FeedLabels } from './feed'

/**
 * ReviewWall, `wall` variant (Review Hub.dc.html §Review wall, desktop build;
 * mobile derived from the system, one column). Server component, no client code.
 * Masonry = CSS columns (3 / 2 / 1) on `lg` / `md` / base; every tile is
 * `break-inside-avoid`. Review cards are the feed's TextCard (compact), always
 * text (video testimonials show as written cards here, no study link).
 */

type Insert = NonNullable<ReviewWallProps['inserts']>[number]
type Tile =
  | { key: string; kind: 'card'; card: FeedCardData }
  | { key: string; kind: 'metric'; value: string; label: string | null; sub: string | null; accent: boolean }
  | { key: string; kind: 'client'; client: Client }
  | { key: string; kind: 'scarcity'; loud: string; label: string | null; reason: string }

const trim = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null)

async function loadScarcity(): Promise<Scarcity | null> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'scarcity', depth: 0, overrideAccess: false })
  } catch (error) {
    console.error('[ReviewWall] could not read the scarcity global; capacity tiles skipped', error)
    return null
  }
}

/** Client inserts: published only; a bare id is re-read in ONE public query (drafts drop out). */
async function loadClients(inserts: Insert[]): Promise<Map<number, Client>> {
  const out = new Map<number, Client>()
  const ids: number[] = []
  for (const i of inserts) {
    if (i.kind !== 'client' || !i.client) continue
    if (typeof i.client === 'number') ids.push(i.client)
    else if (i.client._status !== 'draft') out.set(i.client.id, i.client)
  }
  if (!ids.length) return out
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'clients',
      draft: false,
      overrideAccess: false,
      depth: 1,
      limit: ids.length,
      pagination: false,
      where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
    })
    for (const c of res.docs) out.set(c.id, c)
  } catch (error) {
    console.error('[ReviewWall] could not load client tiles; skipped', error)
  }
  return out
}

function insertTile(i: Insert, idx: number, scarcity: Scarcity | null, clients: Map<number, Client>): Tile | null {
  const key = `insert-${i.id ?? idx}`
  if (i.kind === 'metric') {
    const value = trim(i.metric?.value)
    if (!value) {
      console.error(`[ReviewWall] metric tile ${idx + 1} has no value; skipped`)
      return null
    }
    return { key, kind: 'metric', value, label: trim(i.metric?.label), sub: trim(i.metric?.sub), accent: i.metric?.accent !== false }
  }
  if (i.kind === 'client') {
    const id = i.client && typeof i.client === 'object' ? i.client.id : i.client
    const client = typeof id === 'number' ? clients.get(id) : undefined
    return client ? { key, kind: 'client', client } : null
  }
  if (i.kind === 'scarcity') {
    const k = i.statement
    if (!k || k === 'none') return null
    const row = scarcity?.statements?.find((s) => s.key === k)
    const loud = row?.statistic && scarcity ? fillScarcityTokens(row.statistic, scarcity) : null
    const reason = trim(row?.reason)
    if (!row || !loud || !reason) {
      // Loud/quiet contract (CLAUDE.md rule 2): no reason, no tile.
      console.error(`[ReviewWall] scarcity statement "${k}" is missing, unfilled or has no reason; tile skipped`)
      return null
    }
    return { key, kind: 'scarcity', loud, label: trim(row.label), reason }
  }
  return null
}

/** Cards with inserts spliced in after `position` cards (0 = first, past the end = last); same position keeps array order. */
function compose(cards: FeedCardData[], inserts: { position: number; tile: Tile }[]): Tile[] {
  const out: Tile[] = []
  const at = (n: number) => inserts.filter((i) => i.position === n).map((i) => i.tile)
  out.push(...at(0))
  cards.forEach((card, i) => {
    out.push({ key: `card-${card.id}`, kind: 'card', card }, ...at(i + 1))
  })
  out.push(...inserts.filter((i) => i.position > cards.length).map((i) => i.tile))
  return out
}

function MetricTile({ tile }: { tile: Extract<Tile, { kind: 'metric' }> }) {
  return (
    <div className="bg-ink p-5.5 text-cream md:p-6">
      <span
        className={cx(
          'block font-display text-[2.25rem] leading-none font-normal md:text-[3rem]',
          tile.accent && 'text-ground-accent',
        )}
      >
        {tile.value}
      </span>
      {tile.label ? (
        <span className="mt-2.5 block text-[0.8125rem] leading-[1.2] font-bold tracking-[0.08em] uppercase">{tile.label}</span>
      ) : null}
      {tile.sub ? <span className="mt-1.5 block text-[0.8125rem] leading-[1.4] opacity-70">{tile.sub}</span> : null}
    </div>
  )
}

/** Loud number, quiet reason. Own component for `useId`; role=group named by the number, described by the reason. */
function ScarcityTile({ tile }: { tile: Extract<Tile, { kind: 'scarcity' }> }) {
  const uid = useId()
  const big = /^\d+$/.test(tile.loud)
  return (
    <div
      role="group"
      aria-labelledby={`${uid}-n${big && tile.label ? ` ${uid}-l` : ''}`}
      aria-describedby={`${uid}-r`}
      className="bg-ink p-5.5 text-cream md:p-6"
    >
      {big ? (
        <>
          <span id={`${uid}-n`} className="block font-display text-[2.25rem] leading-none font-normal text-ground-accent md:text-[3rem]">
            {tile.loud}
          </span>
          {tile.label ? (
            <span id={`${uid}-l`} className="mt-2.5 block text-[0.8125rem] leading-[1.2] font-bold tracking-[0.08em] uppercase">
              {tile.label}
            </span>
          ) : null}
        </>
      ) : (
        <span id={`${uid}-n`} className="block font-display text-h3-mobile font-normal text-ground-accent uppercase md:text-h3">
          {tile.loud}
        </span>
      )}
      <span id={`${uid}-r`} className="mt-1.5 block text-[0.8125rem] leading-[1.4] opacity-70">
        {tile.reason}
      </span>
    </div>
  )
}

function ClientTile({ client }: { client: Client }) {
  const logo = client.logo && typeof client.logo === 'object' ? client.logo : null
  return (
    <div className="flex min-h-22 items-center justify-center border border-divider bg-cream p-5.5 md:p-6">
      {logo ? (
        <Media resource={logo} alt={client.name} sizes="200px" className="h-7 w-auto max-w-40 object-contain opacity-55 grayscale md:h-8" />
      ) : (
        <span className="text-center font-display text-[1.125rem] uppercase opacity-55">{client.name}</span>
      )}
    </div>
  )
}

export async function ReviewWallMasonry(props: ReviewWallProps) {
  const docs = await loadWallTestimonials(props)
  const cards = docs.map((d) => toFeedCard(d, false)).filter((c): c is FeedCardData => c !== null)
  // The wall shows written cards only; the stars/source tag come from the testimonial's own data.
  const wallCards = cards.map((c) => ({ ...c, videoId: null, studyHref: null, logo: null }))

  const labels: FeedLabels = {
    video: props.labels?.video ?? 'Video',
    googleReview: props.labels?.googleReview ?? 'Google review',
    linkedin: props.labels?.linkedin ?? 'LinkedIn',
    play: props.labels?.play ?? 'Play the video testimonial from',
    studyLink: '',
  }

  const header =
    props.eyebrow?.trim() || props.heading?.trim() ? (
      <div className="mb-7 md:mb-10">
        {props.eyebrow?.trim() ? (
          <Eyebrow tick={props.eyebrowTick !== false} className="mb-4.5">
            {props.eyebrow}
          </Eyebrow>
        ) : null}
        {props.heading?.trim() ? <AccentHeadline text={props.heading} accent={props.accentPhrase} level="section" /> : null}
      </div>
    ) : null

  if (wallCards.length === 0) {
    const note = props.emptyNote?.trim()
    if (!note) {
      console.warn('[ReviewWall] wall: no published testimonials to show; rendering nothing')
      return null
    }
    return (
      <Section tone="grey" pad="none" className="py-12 md:py-16">
        <Container>
          {header}
          <p className="m-0 max-w-[62ch] whitespace-pre-line border-t border-divider pt-5 text-small-mobile text-gray-warm md:text-small">{note}</p>
        </Container>
      </Section>
    )
  }

  const rows = props.inserts ?? []
  const scarcity = rows.some((r) => r.kind === 'scarcity') ? await loadScarcity() : null
  const clients = await loadClients(rows)
  const placed = rows
    .map((r, i) => ({ position: Math.max(0, Math.round(r.position ?? 0)), tile: insertTile(r, i, scarcity, clients) }))
    .filter((r): r is { position: number; tile: Tile } => r.tile !== null)
  const tiles = compose(wallCards, placed)
  const note = props.wallNote?.trim()

  return (
    <Section tone="grey" pad="none" className="py-12 md:py-16">
      <Container>
        {header}
        <ul className="m-0 list-none columns-1 gap-5 p-0 md:columns-2 lg:columns-3">
          {tiles.map((t) => (
            <li key={t.key} className="mb-5 break-inside-avoid">
              {t.kind === 'card' ? (
                <div className="bg-cream">
                  <TextCard card={t.card} labels={labels} compact />
                </div>
              ) : t.kind === 'metric' ? (
                <MetricTile tile={t} />
              ) : t.kind === 'scarcity' ? (
                <ScarcityTile tile={t} />
              ) : (
                <ClientTile client={t.client} />
              )}
            </li>
          ))}
        </ul>
        {note ? <p className="m-0 mt-2 text-[0.75rem] text-gray-warm">{note}</p> : null}
      </Container>
    </Section>
  )
}
