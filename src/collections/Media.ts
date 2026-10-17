import path from 'path'
import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/roles'

/**
 * BOOT SCAFFOLDING (Phase 1). Revised at Gate S (Phase 2).
 * Files live on local disk at MEDIA_DIR (absolute path; a bind mount on the
 * server). Default for local dev: ./media under the working directory.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // public: files are served at /api/media/file/<filename>
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'wide', width: 1600, height: undefined, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers and search engines.' },
    },
  ],
}
