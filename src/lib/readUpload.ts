import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import type { CollectionSlug, PayloadRequest, TypeWithID } from 'payload'

/**
 * Server-side read of one stored upload's bytes, from whichever storage the
 * collection uses (2026-10-28 Vercel migration):
 *
 * - local disk (dev, no BLOB_READ_WRITE_TOKEN): `<staticDir>/<filename>`, with
 *   the same containment rule as Payload's file route (getFile.js).
 * - cloud storage (`upload.disableLocalStorage`, set by the Vercel Blob plugin,
 *   src/plugins/storage.ts): the collection's own `upload.handlers`, called the
 *   way Payload's GET /api/<slug>/file/<name> calls them (payload@3.91.0
 *   uploads/endpoints/getFile.js), so the adapter resolves the blob key
 *   (prefix + `_objectKey`) from the doc itself. The doc passed in must
 *   therefore be the full upload doc (it carries `prefix` / `_objectKey`).
 *   storage-vercel-blob@3.91.0 getFile.js answers 404 for a missing blob and
 *   204 when the blob fetch fails.
 *
 * The size cap is checked BEFORE the body is buffered whenever the size is
 * known (stat / Content-Length), and again on the bytes.
 * Never throws.
 */
export type ReadUploadResult =
  | { kind: 'ok'; bytes: Buffer }
  | { kind: 'missing' }
  | { kind: 'too-big'; size: number }
  | { kind: 'invalid-name' }
  | { kind: 'error'; reason: string }

export async function readUpload(
  req: PayloadRequest,
  collectionSlug: CollectionSlug,
  doc: TypeWithID & { filename?: string | null },
  maxBytes: number,
): Promise<ReadUploadResult> {
  const filename = doc.filename
  // Never trust a stored name as a path: basename only.
  if (!filename || path.basename(filename) !== filename) return { kind: 'invalid-name' }

  const upload = req.payload.collections[collectionSlug]?.config.upload
  if (!upload || typeof upload !== 'object') return { kind: 'error', reason: 'not an upload collection' }

  if (upload.disableLocalStorage) {
    let res: Response | null = null
    try {
      for (const handler of upload.handlers ?? []) {
        const out = await handler(req, { doc, headers: new Headers(), params: { collection: collectionSlug, filename } })
        if (out instanceof Response) {
          res = out
          break
        }
      }
    } catch (error) {
      return { kind: 'error', reason: `storage read error ${(error as Error)?.name ?? ''}`.trim() }
    }
    if (!res) return { kind: 'error', reason: 'no storage handler answered' }
    if (res.status === 404) return { kind: 'missing' }
    if (res.status !== 200 || !res.body) return { kind: 'error', reason: `storage read HTTP ${res.status}` }
    const declared = Number(res.headers.get('content-length') ?? 'NaN')
    if (Number.isFinite(declared) && declared > maxBytes) {
      await res.body.cancel().catch(() => undefined)
      return { kind: 'too-big', size: declared }
    }
    try {
      const bytes = Buffer.from(await res.arrayBuffer())
      return bytes.length > maxBytes ? { kind: 'too-big', size: bytes.length } : { kind: 'ok', bytes }
    } catch (error) {
      return { kind: 'error', reason: `storage read error ${(error as Error)?.name ?? ''}`.trim() }
    }
  }

  const dir = path.resolve(upload.staticDir || collectionSlug)
  const full = path.join(dir, filename)
  if (path.dirname(full) !== dir) return { kind: 'invalid-name' }
  try {
    const st = await stat(full)
    if (st.size > maxBytes) return { kind: 'too-big', size: st.size }
    return { kind: 'ok', bytes: await readFile(full) }
  } catch (error) {
    const code = (error as { code?: string })?.code
    if (code === 'ENOENT') return { kind: 'missing' }
    return { kind: 'error', reason: `file read error ${code ?? (error as Error)?.name ?? ''}`.trim() }
  }
}
