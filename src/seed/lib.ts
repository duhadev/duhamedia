import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, Where } from 'payload'

/**
 * Seed helpers (CLAUDE.md Phase 4 "Seed script rules").
 *
 * CREATE-ONLY. Every document is looked up by a stable key (slug, formKey,
 * filename, a unique text field) and created only when no document with that
 * key exists. Existing documents are never updated or deleted. A global is set
 * only when it has never been saved (no row in its table); a saved global is
 * left exactly as it is, even when some of its fields are empty.
 *
 * Every write runs on the one `req` the runner opened a transaction on, with
 * `context.disableRevalidate` (src/hooks/revalidateTag.ts: the seed runs
 * outside Next, so there is nothing to revalidate).
 */

export type Ref = { id: number }

export type SeedLog = {
  created: { kind: string; key: string; id: number | string }[]
  skipped: { kind: string; key: string; id: number | string }[]
  /** Not created on purpose in this run (e.g. images off), with the reason. */
  omitted: { kind: string; key: string; reason: string }[]
}

export const emptyLog = (): SeedLog => ({ created: [], skipped: [], omitted: [] })

export type SeedCtx = {
  payload: Payload
  req: PayloadRequest
  log: SeedLog
  /** Dry-run "fresh" mode: treat every global as never saved (the write is rolled back anyway). */
  pretendGlobalsEmpty: boolean
  /**
   * false = upload nothing (media + downloads): every upload/relationship that
   * would point at a seeded file is left empty, and a document whose schema
   * REQUIRES such a file (published) is omitted and logged (`omitted`).
   * Used by the deploy-time seed migration (private Blob stores, OPS #20).
   */
  withMedia: boolean
}

export const SEED_CONTEXT = { disableRevalidate: true, seed: true } as const

const line = (verb: string, kind: string, key: string, id: number | string) =>
  console.log(`  ${verb.padEnd(7)} ${kind.padEnd(18)} ${key}  (id ${id})`)

/**
 * Find the first document of `collection` matching `where` (drafts included:
 * a draft-status document lives in the main table too). Access is bypassed:
 * the seed is a trusted server-side script.
 */
export const findId = async (ctx: SeedCtx, collection: CollectionSlug, where: Where): Promise<number | null> => {
  const res = await ctx.payload.find({
    collection,
    where,
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req: ctx.req,
  })
  const id = res.docs[0]?.id
  return typeof id === 'number' ? id : id === undefined ? null : Number(id)
}

/**
 * Create-only: return the existing document's id when `where` matches, else
 * run `create` and return the new id. `kind`/`key` are only for the log.
 */
export const ensure = async (
  ctx: SeedCtx,
  kind: CollectionSlug,
  key: string,
  where: Where,
  create: () => Promise<{ id: number | string }>,
): Promise<number> => {
  const existing = await findId(ctx, kind, where)
  if (existing !== null) {
    ctx.log.skipped.push({ kind, key, id: existing })
    line('skip', kind, key, existing)
    return existing
  }
  const doc = await create()
  const id = typeof doc.id === 'number' ? doc.id : Number(doc.id)
  ctx.log.created.push({ kind, key, id })
  line('create', kind, key, id)
  return id
}

/** Log a document deliberately not created in this run. Returns `null` for the caller's id slot. */
export const omit = (ctx: SeedCtx, kind: string, key: string, reason: string): null => {
  ctx.log.omitted.push({ kind, key, reason })
  console.log(`  ${'omit'.padEnd(7)} ${kind.padEnd(18)} ${key}  (${reason})`)
  return null
}

/** `ensure` for an upload document: omitted (null) when the run has images off. */
export const ensureUpload = async (
  ctx: SeedCtx,
  kind: 'media' | 'downloads',
  key: string,
  where: Where,
  create: () => Promise<{ id: number | string }>,
): Promise<number | null> => (ctx.withMedia ? ensure(ctx, kind, key, where, create) : omit(ctx, kind, key, 'images off: no file uploads'))

/**
 * True when the global has a saved row. payload@3.91.0 globals/operations/findOne.js:61-68:
 * `db.findGlobal` returns `{}` (Postgres) or nothing when the global was never saved.
 */
export const globalIsSaved = async (ctx: SeedCtx, slug: GlobalSlug): Promise<boolean> => {
  if (ctx.pretendGlobalsEmpty) return false
  const row = await ctx.payload.db.findGlobal({ slug, req: ctx.req })
  return Boolean(row && Object.keys(row).length > 0)
}

/** Create-only for globals: write `update()` only when the global was never saved. */
export const ensureGlobal = async (ctx: SeedCtx, slug: GlobalSlug, update: () => Promise<unknown>): Promise<void> => {
  if (await globalIsSaved(ctx, slug)) {
    ctx.log.skipped.push({ kind: `global:${slug}`, key: slug, id: '-' })
    line('skip', `global`, `${slug} (already saved; never overwritten)`, '-')
    return
  }
  await update()
  ctx.log.created.push({ kind: `global:${slug}`, key: slug, id: '-' })
  line('create', 'global', slug, '-')
}

/** A custom link field value (linkField): site path or https URL. */
export const link = (label: string, url: string, newTab = false) => ({ type: 'custom' as const, url, label, newTab })

/** An empty custom link (optional link groups the design leaves out). */
export const noLink = { type: 'custom' as const }

/** The literal label CLAUDE.md content rule 3 requires on hero headlines and subheads. */
export const PH = '[STRATEGIC PLACEHOLDER — final copy TBD]'

/** Headline with the placeholder label in front. */
export const ph = (text: string) => `${PH} ${text}`

/** Subhead with the placeholder label after it. */
export const phSub = (text: string) => `${text} ${PH}`
