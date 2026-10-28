import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { isStaff } from '../access'

/**
 * Upload storage (Vercel migration, owner-approved 2026-10-28): Vercel Blob when
 * `BLOB_READ_WRITE_TOKEN` is set (Vercel injects it once a Blob store is
 * connected to the project), otherwise Payload's local disk under `MEDIA_DIR`
 * (local dev, docker-compose Postgres), exactly as before.
 *
 * Verified against the installed @payloadcms/storage-vercel-blob@3.91.0 dist
 * (index.js, adapter.js, getFile.js, getClientUploadRoute.js) and
 * @payloadcms/plugin-cloud-storage@3.91.0 (plugin.js, fields/getFields.js):
 *
 * - No token => the adapter is skipped and local storage stays on (index.js).
 * - `alwaysInsertFields: true`: when ENABLED, plugin-cloud-storage always adds a
 *   hidden `_objectKey` column (and `prefix` when a prefix is set) to each
 *   collection (getFields.js). Without this flag a token-less local dev DB (and
 *   so every migration generated from it) would lack those columns while Blob
 *   environments query them. With it the schema is identical everywhere
 *   (migration 20261028_*_vercel_blob_fields).
 * - `access` is `'public'` only in this adapter version (index.d.ts: "Currently,
 *   only 'public' is supported"), although @vercel/blob 2.3.1 itself has private
 *   blobs: the adapter reads files with an unauthenticated fetch of the
 *   `<store>.public.blob.vercel-storage.com` URL (getFile.js).
 * - Files are NOT served from those public URLs by Payload: without
 *   `disablePayloadAccessControl` the doc `url` stays `/api/<slug>/file/<name>`,
 *   and that route checks the collection's `read` access, then streams the blob
 *   (plugin.js pushes `adapter.staticHandler` into `upload.handlers`). So
 *   `media` (public read) and `downloads` (staff-only read) keep their access.
 * - `clientUploads`: Vercel limits server uploads to 4.5 MB
 *   (https://payloadcms.com/docs/upload/storage-adapters), so admin uploads go
 *   browser -> Blob directly. Each client upload lands under a random
 *   `_objectKey` folder (plugin-cloud-storage utilities/resolveSignedURLKey.js:
 *   `randomUUID()`), i.e. `downloads/<uuid>/<filename>`: not guessable. The
 *   token route already requires create/update access on the collection
 *   (payload/internal assertClientUploadAccess); `access` below additionally
 *   requires staff, so the authenticated pipeline user can never get an upload
 *   token. Server-side uploads (the seed) have no `_objectKey`, so their blob
 *   path is `<prefix>/<filename>` (see residual exposure in Downloads.ts).
 * - Separate prefixes keep each collection's blobs apart in one store.
 */
export const storage = vercelBlobStorage({
  enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  token: process.env.BLOB_READ_WRITE_TOKEN,
  alwaysInsertFields: true,
  clientUploads: {
    access: ({ req }) => isStaff(req.user),
  },
  collections: {
    media: { prefix: 'media' },
    downloads: { prefix: 'downloads' },
  },
})

/** True when uploads go to Vercel Blob (this process has a Blob token). */
export const blobStorageEnabled = (): boolean => Boolean(process.env.BLOB_READ_WRITE_TOKEN)
