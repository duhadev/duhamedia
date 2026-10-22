import fsPromises from 'fs/promises'
import path from 'path'
import type { CollectionConfig, PayloadRequest } from 'payload'
import { headersWithCors } from 'payload'

/**
 * S3-3: a file that is missing on disk answers `404 File not found.` instead
 * of Payload's `500 Something went wrong.` (payload@3.91.0
 * uploads/endpoints/getFile.js:61-79 returns 500 on ENOENT).
 *
 * Contract (uploads/types.d.ts:226-244, `upload.handlers`): a handler that
 * returns a Response ends the request; `null`/`undefined` falls through to
 * the next handler and then to Payload's own disk read. The file route checks
 * read access BEFORE any handler runs (getFile.js:20-29 → checkFileAccess.js),
 * so a staff-only `downloads` file still answers 403 to the public, and this
 * handler can never confirm or deny a file's existence to someone without
 * read access.
 *
 * GET/HEAD only: `upload.handlers` is ALSO called for "client uploads"
 * (uploads/getFileFromClientUpload.js:83, reached from a multipart POST/PATCH
 * whose `file` field is a JSON string, utilities/addDataAndFileToRequest.js:60-89,
 * before the operation's access check). For any other method this returns
 * `null`, so that path keeps failing exactly as before (no handler response →
 * "Expected response from the upload handler.", a 500 with Payload's generic
 * message).
 *
 * Paths are resolved exactly like getFile.js:55-60; a path outside
 * `staticDir` is left to Payload, which rejects it with 400 "Invalid filename.".
 */
type UploadHandler = NonNullable<Exclude<CollectionConfig['upload'], boolean | undefined>['handlers']>[number]

const respondIfMissing = async (
  staticDir: string,
  req: PayloadRequest,
  params: { collection: string; filename: string },
): Promise<Response | undefined> => {
  const method = (req.method ?? 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') return undefined
  const filename = params.filename
  if (typeof filename !== 'string' || !filename) return undefined

  const resolvedDir = path.resolve(staticDir)
  const filePath = path.resolve(resolvedDir, filename)
  if (!filePath.startsWith(resolvedDir + path.sep)) return undefined

  try {
    await fsPromises.stat(filePath)
    return undefined
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') return undefined
    req.payload.logger.warn(`File ${filename} for collection ${params.collection} is missing on disk (${filePath}).`)
    // Same CORS headers as Payload's own file responses (getFile.js:69-72; payload index.d.ts:656).
    return Response.json(
      { errors: [{ message: 'File not found.' }] },
      { headers: headersWithCors({ headers: new Headers(), req }), status: 404 },
    )
  }
}

/** `upload.handlers` entry for a local-disk collection whose files live in `staticDir`. */
export const missingFileHandler =
  (staticDir: string): UploadHandler =>
  (req, { params }) =>
    // The handler type is `Promise<Response> | Promise<void>`; this promise resolves to one or the other.
    respondIfMissing(staticDir, req, params) as Promise<Response> | Promise<void>
