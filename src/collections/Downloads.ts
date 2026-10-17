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
 * (never nested inside it; see MEDIA_DIR in Media.ts), and are served only at
 * /api/downloads/file/<filename>. Read is public: the link is emailed and the
 * files are not secret (SCHEMA §6.10).
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
    read: () => true,
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
        description: 'Shown in the admin and used as the link text in the delivery email.',
      },
    },
  ],
}
