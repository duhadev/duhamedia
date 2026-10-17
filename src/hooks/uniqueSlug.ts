import { randomUUID } from 'node:crypto'

import type {
  CollectionBeforeValidateHook,
  CollectionSlug,
  FieldHook,
  PayloadRequest,
  RowField,
  Where,
} from 'payload'
import { slugify } from 'payload/shared'

/**
 * Server-side slug generation for collections written over REST (C8 posts:
 * the content pipeline creates drafts with a title and usually no slug).
 *
 * Why `slugField()` alone is not enough (payload@3.91.0,
 * fields/baseFields/slug/generateSlug.js + fields/hooks/beforeChange/promise.js):
 * - its generator is a FIELD beforeChange hook on the hidden `generateSlug`
 *   checkbox. Sibling fields of a row are processed in parallel
 *   (traverseFields.js `Promise.all`), and the generator awaits before it
 *   writes `data.slug`, so on a validated save (a create without
 *   `?draft=true`) the slug's `required` check reads it while still empty:
 *   "Slug required" although the generator would have filled it.
 * - it never de-duplicates: a second post with the same title hits the
 *   unique index ("Value must be unique").
 * - on an autosave-enabled collection it re-derives the slug from the title
 *   on later saves of an unpublished doc (and at publish) unless the slug was
 *   edited, which would drop a `-2` suffix and collide again.
 *
 * So, without fighting the field:
 * 1. `beforeValidate` (collection) runs before any field hook. When the save
 *    would leave the slug empty and a title exists, it fills a unique slug
 *    (`title-slug`, then `-2`, `-3`, … on collision). An explicitly supplied
 *    slug is left to the field (normalised by slugify; a collision is reported
 *    by the unique index, never silently renamed).
 * 2. `slugFieldOverrides` wraps the field's own generator: after it runs, a
 *    slug it re-derived from the title is de-duplicated against other docs,
 *    and a partial update that omitted `title` cannot wipe the slug.
 * Uniqueness is checked against the main collection table, which is what the
 * unique index covers (`count` reads the main table, overrideAccess, same
 * transaction via `req`). Two concurrent creates with the same title can still
 * race; the loser gets the unique-index error and can retry.
 */

const filled = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''

const MAX_SUFFIX = 50

export const uniqueSlug = async ({
  base,
  collection,
  excludeId,
  req,
}: {
  base: string
  collection: CollectionSlug
  excludeId?: number | string | null
  req: PayloadRequest
}): Promise<string> => {
  for (let n = 1; n <= MAX_SUFFIX; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`
    const bySlug: Where = { slug: { equals: candidate } }
    const where: Where =
      excludeId !== null && excludeId !== undefined
        ? { and: [bySlug, { id: { not_equals: excludeId } }] }
        : bySlug
    const { totalDocs } = await req.payload.count({ collection, where, overrideAccess: true, req })
    if (totalDocs === 0) return candidate
  }
  return `${base}-${randomUUID().slice(0, 8)}`
}

export const uniqueSlugHooks = (
  collection: CollectionSlug,
): { beforeValidate: CollectionBeforeValidateHook; slugFieldOverrides: (field: RowField) => RowField } => {
  const beforeValidate: CollectionBeforeValidateHook = async ({ data, operation, originalDoc, req }) => {
    if (!data) return data
    const current = data.slug !== undefined ? data.slug : originalDoc?.slug
    if (filled(current)) return data
    const title = data.title !== undefined ? data.title : originalDoc?.title
    if (!filled(title)) return data
    const base = slugify(title)
    if (!filled(base)) return data
    const excludeId = operation === 'update' ? originalDoc?.id : undefined
    return { ...data, slug: await uniqueSlug({ base, collection, excludeId, req }) }
  }

  const slugFieldOverrides = (field: RowField): RowField => {
    const fields = field.fields.map((f) => {
      if (!('name' in f) || f.name !== 'generateSlug' || !('hooks' in f)) return f
      const original = f.hooks?.beforeChange ?? []
      const wrapped: FieldHook = async (args) => {
        const { data, operation, originalDoc, req } = args
        const before = data?.slug
        let result: unknown = args.value
        for (const hook of original) {
          const next = await hook({ ...args, value: result })
          if (next !== undefined) result = next
        }
        if (operation === 'update' && data) {
          const after = data.slug
          if (!filled(after) && filled(before) && data.title === undefined) {
            // Partial update without `title`: the generator nulls the slug; keep it.
            data.slug = before
          } else if (filled(after) && after !== before) {
            // The generator re-derived the slug from the title: keep it unique.
            data.slug = await uniqueSlug({ base: after, collection, excludeId: originalDoc?.id, req })
          }
        }
        return result
      }
      return { ...f, hooks: { ...f.hooks, beforeChange: [wrapped] } }
    })
    return { ...field, fields }
  }

  return { beforeValidate, slugFieldOverrides }
}
