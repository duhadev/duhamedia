import path from 'path'
import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'
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
 * Verified against payload@3.91.0: upload `staticDir`, `mimeTypes`,
 * `focalPoint`, `crop` in uploads/types.d.ts; `mimeTypes` enforced
 * server-side in uploads/checkFileRestrictions.js.
 */
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
  upload: {
    staticDir: path.join(MEDIA_DIR, 'downloads'),
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
