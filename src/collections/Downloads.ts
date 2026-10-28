import path from 'path'
import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { missingFileHandler } from '../lib/missingFileHandler'
import { MEDIA_DIR } from './Media'

/**
 * `downloads` (SCHEMA.md §6.10 / X9, §4.3 — Gate S approved 2026-10-17).
 *
 * Non-image lead-magnet deliverables (PDF, worksheet, CSV, zip), kept apart
 * from image-only `media` so media can keep a required, meaningful alt.
 * Files sit in `${MEDIA_DIR}/downloads`, a sibling of media's `${MEDIA_DIR}/media`
 * (never nested inside it; see MEDIA_DIR in Media.ts). Read is staff-only
 * (mini Gate S 2026-10-21): files are delivered as email attachments by the
 * lead_magnet integration (server-side, overrideAccess), so neither
 * /api/downloads nor /api/downloads/file/<name> is public (SCHEMA §6.10).
 *
 * Storage (2026-10-28): local disk in dev; Vercel Blob when BLOB_READ_WRITE_TOKEN
 * is set (src/plugins/storage.ts). Under Blob, files are still served ONLY via
 * the access-checked /api/downloads/file/<name> route. Residual exposure: the
 * Blob adapter (3.91.0) supports public stores only, so the bytes also exist at
 * an unauthenticated https://<storeId>.public.blob.vercel-storage.com/<key> URL.
 * Admin uploads use client uploads, whose key is downloads/<random uuid>/<name>
 * (unguessable without the doc's hidden `_objectKey`, which only staff can read);
 * server-side uploads (the seed's placeholder CSV) have the guessable key
 * downloads/<name>, discoverable only by someone who also knows the store id.
 *
 * Verified against payload@3.91.0: upload `staticDir`, `mimeTypes`,
 * `focalPoint`, `crop` in uploads/types.d.ts; `mimeTypes` enforced
 * server-side in uploads/checkFileRestrictions.js.
 */
export const DOWNLOADS_STATIC_DIR = path.join(MEDIA_DIR, 'downloads')

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
  },
  access: {
    // Staff-only read (mini Gate S 2026-10-21). Also governs the static file route.
    read: staffOnly,
    // Humans only. The pipeline API user is logged in but must not upload.
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: {
    // S3-1: refuse to delete a file a live lead magnet still delivers.
    beforeDelete: [blockDeleteIfReferenced({ noun: 'file' })],
  },
  upload: {
    staticDir: DOWNLOADS_STATIC_DIR,
    // S3-3: missing on disk → 404 "File not found." Read access (staff only)
    // is checked BEFORE handlers run, so the public still gets 403.
    handlers: [missingFileHandler(DOWNLOADS_STATIC_DIR)],
    // Staff-only files must never sit in a shared cache (Cloudflare caches .pdf/.csv/.zip
    // by extension; the Blob adapter sends `public, max-age=31536000`,
    // storage-vercel-blob@3.91.0 getFile.js, then calls this hook).
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      return headers
    },
    mimeTypes: [
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
    ],
    // Not images: no sizes, no focal point, no crop.
    focalPoint: false,
    crop: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Shown in the admin. Used as the attachment name/label in the delivery email (no longer link text).',
      },
    },
  ],
}
