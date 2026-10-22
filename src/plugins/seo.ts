import { seoPlugin } from '@payloadcms/plugin-seo'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import type {
  Config,
  Field,
  FieldHook,
  PayloadRequest,
  Plugin,
  TextareaFieldValidation,
} from 'payload'
import { textarea } from 'payload/shared'

import { staffOnlyField } from '../access'
import {
  DEFAULT_DESCRIPTION_MAX,
  DEFAULT_TITLE_TEMPLATE,
  TITLE_PLACEHOLDER,
  validateOgImage,
} from '../globals/SeoDefaults'
import { docPath } from '../lib/docPath'

/**
 * P3: `@payloadcms/plugin-seo@3.91.0` (DECISIONS §I, CLAUDE.md "Approved
 * (locked)"; SCHEMA.md §0 row "plugin-seo options", §6.1 / §6.2 / §6.3 / §6.8
 * `meta` rows "plugin-seo tab", §7.4 `seo-defaults`).
 *
 * Verified against the INSTALLED plugin (node_modules/@payloadcms/plugin-seo/
 * dist, 3.91.0):
 * - types.d.ts: options `collections`, `fields({ defaultFields })`,
 *   `generateTitle` / `generateDescription` / `generateImage` / `generateURL`
 *   (args `{ collectionConfig, doc, req, locale, ...PartialDocumentInfoContext }`,
 *   i.e. also `collectionSlug`, `id`, `title`), `globals`, `interfaceName`,
 *   `tabbedUI`, `uploadsCollection`.
 * - index.js:10-40: one `meta` group (label "SEO") holding `overview` (ui),
 *   `title` (text), `description` (textarea), `image` (upload, ONLY when
 *   `uploadsCollection` is set) and `preview` (ui). `fields()` receives these
 *   and its result becomes the group's fields.
 * - fields/Meta{Title,Description,Image}/index.js: the plugin marks title/description/image
 *   `localized: true`. Localization is permanently off here (CLAUDE.md rule 8);
 *   the flag is reset to false below so it never appears in config.
 * - index.js:137-196 `tabbedUI`: when a collection's FIRST field is a `tabs`
 *   field, the SEO tab is appended to those tabs and every later top-level
 *   field (the sidebar fields) stays top-level (index.js:183). Otherwise ALL
 *   fields are wrapped in a new first tab, which would bury sidebar fields
 *   inside it. posts / case-studies / lead-magnets already start with tabs;
 *   pages was given a "Content" tab in this unit for the same reason. The
 *   plugin rebuilds the tabs field as `{ type: 'tabs', tabs }` only, so the
 *   original tabs field must carry no other props (none do).
 * - index.js:197-303: four endpoints `POST /api/plugin-seo/generate-{title,
 *   description,url,image}`. Each requires a logged-in user with admin-panel
 *   access (index.js:379-386 `canAccessAdmin` → users `access.admin` = staff
 *   only, so the pipeline key cannot call them) and read access to the doc
 *   (index.js:50-134). The admin buttons send the CURRENT form data as `doc`
 *   (fields/MetaTitle/MetaTitleComponent.js:30-41 `getData()`), so values may
 *   be unsaved; uploads arrive as ids.
 * - If a generator throws, the button receives an error body and silently
 *   sets '' (MetaTitleComponent.js:47-48), so every generator here catches
 *   and always returns a usable string.
 * - Length indicator (defaults.js): title 50–60 (matches the seo-auditor
 *   "~60"), description 100–150; a field `maxLength` replaces the max
 *   (MetaTitleComponent.js:12-21), so the description shows 100–155.
 * - No plugin-side access: meta fields inherit each collection's access.
 *
 * Field-level behaviour (payload@3.91.0, repo conventions):
 * - a custom `validate` REPLACES the built-in one
 *   (fields/hooks/beforeChange/promise.js:98), so each calls the
 *   `payload/shared` built-in too;
 * - `drafts.validate: false` (src/fields contentVersions): validation runs on
 *   publish only, so a pipeline/autosave draft is never rejected for length.
 *
 * Plugin order (payload.config.ts): independent of formBuilder / redirects
 * (it only touches our four collections and adds endpoints + translations),
 * registered last.
 */

/** SCHEMA: `meta` on exactly these (§6.1 pages, §6.2 case-studies, §6.3 posts, §6.8 lead-magnets). */
export const SEO_COLLECTIONS = ['pages', 'case-studies', 'posts', 'lead-magnets'] as const
type SeoCollection = (typeof SEO_COLLECTIONS)[number]

/** seo-auditor page scope: title ≤ ~60 (soft, indicator only). */
export const META_TITLE_TARGET = 60

/** The doc fields the generators read (current admin form data). All optional. */
type SeoDoc = {
  title?: string | null
  slug?: string | null
  track?: string | null
  targetKeyword?: string | null
  dek?: string | null
  cardSummary?: string | null
  inShort?: string | null
  pitch?: string | null
  heroMedia?: unknown
  heroImage?: unknown
}

type GenArgs = { collectionConfig?: { slug: string }; collectionSlug?: string; req: PayloadRequest }

const slugOf = ({ collectionConfig, collectionSlug }: GenArgs): SeoCollection | null => {
  const slug = collectionConfig?.slug ?? collectionSlug
  return (SEO_COLLECTIONS as readonly string[]).includes(slug ?? '') ? (slug as SeoCollection) : null
}

const clean = (value: unknown): string =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''

type SeoDefaultsDoc = { titleTemplate?: string | null; defaultDescription?: string | null; defaultOgImage?: unknown }

/** seo-defaults, or `{}` when unsaved/unreadable (no stored row until first save). */
const readDefaults = async (req: PayloadRequest): Promise<SeoDefaultsDoc> => {
  try {
    return ((await req.payload.findGlobal({ slug: 'seo-defaults', depth: 0, req })) ?? {}) as SeoDefaultsDoc
  } catch (err) {
    req.payload.logger.warn({ err, msg: 'plugin-seo: could not read seo-defaults; using built-in fallbacks' })
    return {}
  }
}

const idOf = (value: unknown): number | string | null => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value !== '') return value
  if (value && typeof value === 'object' && 'id' in value) return idOf((value as { id: unknown }).id)
  return null
}

/** Cut at a word boundary to `max` characters (ellipsis included). */
export const truncate = (value: string, max: number): string => {
  if (value.length <= max) return value
  const cut = value.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.–—-]+$/, '')}…`
}

/** Fill a template's `%s` (falls back to the SCHEMA default when the template is unusable). */
const applyTemplate = (template: string, value: string): string => {
  const usable = template.split(TITLE_PLACEHOLDER).length - 1 === 1 ? template : DEFAULT_TITLE_TEMPLATE
  return usable.replace(TITLE_PLACEHOLDER, value)
}

/**
 * `seo-defaults.titleTemplate` with `%s` = the doc title. Posts (SCHEMA §6.3:
 * `targetKeyword` "feeds generateTitle"): when the templated title is longer
 * than ~60 characters and a target keyword is set, the keyword becomes the
 * `%s` instead, so the search title stays keyword-led and short.
 */
export const generateTitle: GenerateTitle<SeoDoc> = async (args) => {
  try {
    const title = clean(args.doc?.title)
    if (!title) return ''
    const defaults = await readDefaults(args.req)
    const template = clean(defaults.titleTemplate) || DEFAULT_TITLE_TEMPLATE
    const full = applyTemplate(template, title)
    const keyword = clean(args.doc?.targetKeyword)
    if (slugOf(args) === 'posts' && keyword && full.length > META_TITLE_TARGET) {
      return applyTemplate(template, keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
    return full
  } catch (err) {
    args.req.payload.logger.warn({ err, msg: 'plugin-seo generateTitle failed' })
    return ''
  }
}

/** The doc's own summary (SCHEMA): posts `dek`, case-studies `cardSummary` → `inShort`, lead-magnets `pitch`. */
const summaryOf = (collection: SeoCollection | null, doc: SeoDoc | undefined): string => {
  switch (collection) {
    case 'posts':
      return clean(doc?.dek)
    case 'case-studies':
      return clean(doc?.cardSummary) || clean(doc?.inShort)
    case 'lead-magnets':
      return clean(doc?.pitch)
    default:
      return '' // pages have no summary field; their sections are blocks
  }
}

/** The doc's summary (cut to 155), else `seo-defaults.defaultDescription`, else ''. */
export const generateDescription: GenerateDescription<SeoDoc> = async (args) => {
  try {
    const own = summaryOf(slugOf(args), args.doc)
    if (own) return truncate(own, DEFAULT_DESCRIPTION_MAX)
    const defaults = await readDefaults(args.req)
    return truncate(clean(defaults.defaultDescription), DEFAULT_DESCRIPTION_MAX)
  } catch (err) {
    args.req.payload.logger.warn({ err, msg: 'plugin-seo generateDescription failed' })
    return ''
  }
}

/** True when the media doc exists and Payload produced its 1200×630 `og` size. */
const hasOgSize = async (req: PayloadRequest, id: number | string): Promise<boolean> => {
  try {
    const media = await req.payload.findByID({ collection: 'media', id, depth: 0, disableErrors: true, req })
    return Boolean(media?.sizes?.og?.url)
  } catch {
    return false
  }
}

/**
 * The doc's own hero image (case-studies `heroMedia`, posts `heroImage`) when
 * it is big enough for a share card, else `seo-defaults.defaultOgImage`, else ''.
 */
export const generateImage: GenerateImage<SeoDoc> = async (args) => {
  try {
    const collection = slugOf(args)
    const own =
      collection === 'case-studies' ? idOf(args.doc?.heroMedia) : collection === 'posts' ? idOf(args.doc?.heroImage) : null
    if (own !== null && (await hasOgSize(args.req, own))) return own
    const fallback = idOf((await readDefaults(args.req)).defaultOgImage)
    return fallback ?? ''
  } catch (err) {
    args.req.payload.logger.warn({ err, msg: 'plugin-seo generateImage failed' })
    return ''
  }
}

/** `SITE_URL` (server-side env, DECISIONS: no NEXT_PUBLIC_*) without a trailing slash, or '' if unset/invalid. */
export const siteOrigin = (): string => {
  const raw = (process.env.SITE_URL ?? '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return /^https?:$/.test(url.protocol) ? url.origin : ''
  } catch {
    return ''
  }
}

/** `SITE_URL` + `docPath()`; a relative path when SITE_URL is missing; '' when the doc has no public path. */
export const generateURL: GenerateURL<SeoDoc> = (args) => {
  try {
    const collection = slugOf(args)
    const path = collection ? docPath(collection, args.doc) : null
    if (!path) return ''
    return `${siteOrigin()}${path}`
  } catch (err) {
    args.req.payload.logger.warn({ err, msg: 'plugin-seo generateURL failed' })
    return ''
  }
}

const trim: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)

const validateMetaDescription: TextareaFieldValidation = (value, options) => {
  if (typeof value === 'string' && value.length > DEFAULT_DESCRIPTION_MAX) {
    return `Keep the description to ${DEFAULT_DESCRIPTION_MAX} characters or fewer so Google does not cut it off (it is ${value.length} now).`
  }
  return textarea(value, options)
}

/** Labels, help text, length rule and access on the plugin's own field defs (index.js:10-27), by name. */
const shapeFields = ({ defaultFields }: { defaultFields: Field[] }): Field[] =>
  defaultFields.map((field) => {
    if (!('name' in field)) return field
    if (field.name === 'title' && field.type === 'text') {
      return {
        ...field,
        localized: false,
        label: 'Search title',
        hooks: { ...field.hooks, beforeValidate: [...(field.hooks?.beforeValidate ?? []), trim] },
        admin: {
          ...field.admin,
          description:
            'The title shown in Google results, the browser tab and social share cards. Aim for 50–60 characters. "Auto-generate" fills it from the title and the SEO defaults template; if left empty, the site builds it the same way.',
        },
      } as Field
    }
    if (field.name === 'description' && field.type === 'textarea') {
      return {
        ...field,
        localized: false,
        label: 'Search description',
        maxLength: DEFAULT_DESCRIPTION_MAX,
        validate: validateMetaDescription,
        hooks: { ...field.hooks, beforeValidate: [...(field.hooks?.beforeValidate ?? []), trim] },
        admin: {
          ...field.admin,
          description: `The grey text under the title in Google results and share cards. Aim for 100–${DEFAULT_DESCRIPTION_MAX} characters (${DEFAULT_DESCRIPTION_MAX} at most). Leave empty to use the SEO defaults description.`,
        },
      } as Field
    }
    if (field.name === 'image' && field.type === 'upload') {
      return {
        ...field,
        localized: false,
        label: 'Share image',
        maxDepth: 1,
        validate: validateOgImage,
        // SCHEMA §6.3: the pipeline cannot upload or pick media (same as `heroImage`);
        // a pipeline value is dropped silently, never an error.
        access: { create: staffOnlyField, update: staffOnlyField },
        admin: {
          ...field.admin,
          description:
            'The picture shown when this page is shared on LinkedIn, Facebook, X or in a message. Landscape, at least 1200 × 630 pixels. Leave empty to use the SEO defaults image.',
        },
      } as Field
    }
    return field
  })

const plugin: Plugin = seoPlugin({
  collections: [...SEO_COLLECTIONS],
  uploadsCollection: 'media',
  tabbedUI: true,
  interfaceName: 'SeoMeta',
  fields: shapeFields,
  generateTitle,
  generateDescription,
  generateImage,
  generateURL,
})

/**
 * The plugin labels its `meta` group "SEO" (index.js:38, not overridable) and
 * puts it inside a tab also labelled "SEO", so the admin showed a second "SEO"
 * heading and errors read "SEO > SEO > Search description". The group label is
 * hidden here (`label: false`; the tab still names it). Admin-only: no schema
 * or type change.
 */
const hideMetaGroupLabel = (field: Field): Field => {
  if (field.type !== 'tabs') return field
  return {
    ...field,
    tabs: field.tabs.map((tab) =>
      tab.label === 'SEO'
        ? {
            ...tab,
            fields: tab.fields.map((f) => ('name' in f && f.name === 'meta' && f.type === 'group' ? { ...f, label: false } : f)),
          }
        : tab,
    ),
  }
}

/**
 * Help text under the three meta fields (P3 Gate 1 rework).
 *
 * The plugin's field components do NOT render `admin.description`: they print
 * fixed i18n strings instead (plugin-seo@3.91.0
 * dist/fields/MetaTitle/MetaTitleComponent.js:113-126 `lengthTipTitle` + a
 * "best practices" link + "."; MetaDescriptionComponent.js:112-127
 * `lengthTipDescription`, same link; MetaImageComponent.js:121-126
 * `imageAutoGenerationTip`, shown when a generateImage fn is set). The
 * supported override is the config's own `i18n.translations`: the plugin
 * merges its strings UNDER them (dist/index.js:348-351 `deepMergeSimple(
 * translations, config.i18n?.translations)`), and this wrapper applies ours
 * after the plugin ran, so they win. Same strings on all four collections, so
 * the copy says "this page". `{{minLength}}` / `{{maxLength}}` are filled by
 * the component (title 50–60, description 100–155). The `admin.description`s
 * above stay only as the generated-type doc comments.
 */
const HELP_TEXT = {
  lengthTipTitle:
    'The title shown in Google results, the browser tab and social share cards. Aim for {{minLength}}–{{maxLength}} characters. "Auto-generate" builds it from the page title and the SEO defaults template; if left empty, the site builds it the same way. See Google\'s ',
  lengthTipDescription:
    'The grey text under the title in Google results and share cards. Aim for {{minLength}}–{{maxLength}} characters ({{maxLength}} at most). "Auto-generate" uses this page\'s own summary, or the SEO defaults description if it has none. Leave empty to use the SEO defaults description. See Google\'s ',
  imageAutoGenerationTip:
    'The picture shown when this page is shared on LinkedIn, Facebook, X or in a message. Landscape, at least 1200 × 630 pixels. "Auto-generate" picks this page\'s own main image if it has one that size or larger, otherwise the SEO defaults image. Leave empty to use the SEO defaults image.',
} as const

type Translations = NonNullable<NonNullable<Config['i18n']>['translations']>

const withHelpText = (translations: Translations | undefined): Translations => {
  const all = (translations ?? {}) as Record<string, Record<string, Record<string, string>> | undefined>
  const en = all.en ?? {}
  return {
    ...all,
    en: { ...en, 'plugin-seo': { ...(en['plugin-seo'] ?? {}), ...HELP_TEXT } },
  } as Translations
}

export const seo: Plugin = async (incoming) => {
  const config = await plugin(incoming)
  return {
    ...config,
    i18n: { ...config.i18n, translations: withHelpText(config.i18n?.translations) },
    collections: config.collections?.map((collection) =>
      (SEO_COLLECTIONS as readonly string[]).includes(collection.slug)
        ? { ...collection, fields: collection.fields.map(hideMetaGroupLabel) }
        : collection,
    ),
  }
}
