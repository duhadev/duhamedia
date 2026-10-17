import path from 'path'
import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { staffOnly } from '../access'

/**
 * `media` (SCHEMA.md §6.9, §4.3, §10 — Gate S approved 2026-10-17; DECISIONS §G).
 *
 * Image-only uploads on local disk. Non-image assets (lead-magnet PDFs etc.)
 * live in `downloads` (§6.10), so every media doc is an image with a real alt.
 * No drafts: uploads have no publish lifecycle.
 *
 * Verified against payload@3.91.0 (installed `payload/dist`):
 * - upload options `staticDir`, `mimeTypes`, `focalPoint`, `imageSizes`,
 *   `adminThumbnail`: uploads/types.d.ts. `mimeTypes` is enforced server-side
 *   by content sniffing (`file-type`), not just in the file picker:
 *   uploads/checkFileRestrictions.js.
 * - a custom `validate` REPLACES the built-in one (fields/hooks/beforeChange/
 *   promise.js), so `alt` calls the default `text` validator from
 *   `payload/shared` first to keep `required` enforced.
 */

/**
 * Absolute root of all uploads. `MEDIA_DIR` on the server; `./media` in local dev.
 * Each upload collection gets its own SIBLING subdirectory (`media/`, `downloads/`)
 * so no collection's `staticDir` contains another's: Payload's file route serves
 * any path under a collection's `staticDir`, so nesting would let
 * /api/media/file/downloads%2F<name> serve a download (C2 rework, 2026-10-17).
 */
export const MEDIA_DIR = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

// Every image extension an editor could plausibly paste as an alt (Gate 1 C2 rework).
const FILE_NAME_LIKE = /\.(jpe?g|png|webp|gif|svg|avif|heic|heif|tiff?|bmp|ico)\s*$/i

/** Alt is required, not whitespace-only, and not a file name ("IMG_0042.jpg"). */
const validateAlt: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (!trimmed) return 'Alt text is required. Describe what the image shows.'
  if (FILE_NAME_LIKE.test(trimmed)) {
    return 'Alt text looks like a file name. Describe what the image shows instead.'
  }
  return true
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    // Public: files are served at /api/media/file/<filename>.
    read: () => true,
    // Humans only. The pipeline API user is logged in but must not upload.
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  upload: {
    staticDir: path.join(MEDIA_DIR, 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      // p2 browser-framed case-study hero.
      { name: 'browser', width: 1440, height: undefined, position: 'centre' },
      { name: 'wide', width: 1600, height: undefined, position: 'centre' },
      // seo-defaults / plugin-seo Open Graph image.
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      validate: validateAlt,
      admin: {
        description:
          'Describe the image for screen readers and search engines, e.g. "Founder at a whiteboard mapping a store launch". Not a file name.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional default caption when this image is used as a figure in an article.',
      },
    },
  ],
}
