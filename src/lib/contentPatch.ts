import { ValidationError, type Payload, type PayloadRequest } from 'payload'

/**
 * Helpers for copy-round data migrations (src/migrations/*_copy_round_*.ts).
 *
 * A page patch names the blockType expected at every touched layout index
 * (taken from a production snapshot). A page that does not match is skipped
 * and logged, never written wrongly. Validation errors are logged and skipped;
 * any other error is rethrown so the migration (and the deploy) fails.
 */

export type Op =
  | ['set', string, unknown]
  | ['remove', string]
  | ['insert', string, number, unknown]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- path walker over untyped migration JSON
  | ['fn', (doc: any) => void]

export type PagePatch = {
  slug: string
  expect: Record<number, string>
  ops: Op[]
  meta?: { title?: string; description?: string }
  noindex?: boolean
  unpublish?: boolean
}

export type PatchCtx = { payload: Payload; req: PayloadRequest; context: Record<string, unknown>; done: string[]; skipped: string[] }

const tokens = (path: string): (string | number)[] =>
  path.split('.').flatMap((seg) => {
    const m = seg.match(/^([^[]+)((?:\[\d+\])*)$/)
    if (!m) throw new Error(`bad path ${path}`)
    return [m[1], ...[...m[2].matchAll(/\[(\d+)\]/g)].map((i) => Number(i[1]))]
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- path walker over untyped migration JSON
const parentOf = (obj: any, path: string): [any, string | number] => {
  const t = tokens(path)
  let cur = obj
  for (const k of t.slice(0, -1)) {
    if (cur[k] === undefined || cur[k] === null) cur[k] = {}
    cur = cur[k]
  }
  return [cur, t[t.length - 1]]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- path walker over untyped migration JSON
export const applyOp = (doc: any, op: Op): void => {
  if (op[0] === 'fn') return op[1](doc)
  const [parent, key] = parentOf(doc, op[1])
  if (op[0] === 'set') {
    parent[key] = op[2]
  } else if (op[0] === 'remove') {
    if (!Array.isArray(parent) || typeof key !== 'number' || key >= parent.length) throw new Error(`remove: no ${op[1]}`)
    parent.splice(key, 1)
  } else {
    const arr = parent[key]
    if (!Array.isArray(arr)) throw new Error(`insert: ${op[1]} is not an array`)
    arr.splice(op[2], 0, op[3])
  }
}

export const guard = async (c: PatchCtx, what: string, run: () => Promise<unknown>): Promise<void> => {
  try {
    await run()
    c.done.push(what)
  } catch (err) {
    if (err instanceof ValidationError) {
      c.skipped.push(`${what}: ${err.message} ${JSON.stringify(err.data?.errors ?? [])}`)
      return
    }
    throw err
  }
}

export async function patchPage(c: PatchCtx, patch: PagePatch): Promise<void> {
  const { payload, req, context } = c
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: patch.slug } }, limit: 1, depth: 0, req, overrideAccess: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- path walker over untyped migration JSON
  const doc = found.docs[0] as any
  if (!doc) return void c.skipped.push(`page ${patch.slug}: not found`)

  for (const [i, type] of Object.entries(patch.expect)) {
    if (doc.layout?.[Number(i)]?.blockType !== type) {
      return void c.skipped.push(`page ${patch.slug}: layout[${i}] is ${doc.layout?.[Number(i)]?.blockType ?? 'missing'}, expected ${type}`)
    }
  }
  if (patch.unpublish) {
    return guard(c, `page ${patch.slug} unpublished`, () =>
      payload.update({ collection: 'pages', id: doc.id, data: { _status: 'draft' }, depth: 0, req, overrideAccess: true, context }),
    )
  }
  try {
    for (const op of patch.ops) applyOp(doc, op)
  } catch (err) {
    return void c.skipped.push(`page ${patch.slug}: ${(err as Error).message}`)
  }
  const data: Record<string, unknown> = { layout: doc.layout, _status: 'published' }
  if (patch.meta) data.meta = { ...(doc.meta ?? {}), ...patch.meta }
  if (patch.noindex !== undefined) data.noindex = patch.noindex
  await guard(c, `page ${patch.slug}`, () => payload.update({ collection: 'pages', id: doc.id, data, depth: 0, req, overrideAccess: true, context }))
}

export const report = (c: PatchCtx, label: string): void => {
  c.payload.logger.info(`${label}: applied ${c.done.length}: ${c.done.join(' | ')}`)
  if (c.skipped.length) c.payload.logger.warn(`${label}: SKIPPED ${c.skipped.length}: ${c.skipped.join(' | ')}`)
}
