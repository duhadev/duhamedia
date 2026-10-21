import type { ArrayField, ArrayFieldValidation, FieldHook, GlobalConfig, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { staffOnly } from '../access'
import { linkField } from '../fields'
import { revalidateGlobalHook } from '../hooks/revalidateTag'

/**
 * `navigation` global (SCHEMA.md §7.3, §4.3, §10 — Gate S approved 2026-10-17).
 *
 * The site chrome's links, edited in one place:
 * - `header.links` + `header.cta`: SiteHeader / SiteHeaderMobile ("Work · Services ·
 *   Testimonials · About · FAQ" + "Book a Call"; the mobile panel lists the same data).
 *   Rendered on every page whose `pages.headerVariant` is `standard`; `logo-only` (p15
 *   Campaign LP, p18 Lead Magnet) and `none` (p17 Link-in-Bio) render none of these links,
 *   which is what keeps p15 zero-leakage (CLAUDE.md rule 4).
 * - `footer.standard.columns` (Pages / Services / Resources) + `footer.standard.newsletterNudge`:
 *   the standard 4-zone footer (brand zone text = `site-settings.footerTagline`; the nudge's
 *   form = `site-settings.newsletterForm`, P1). All pages except the five below.
 * - `footer.reduced.links`: reduced-nav footer (Home / Work / FAQ / Contact) on p9 Book a
 *   Call and p10 Thank You.
 * - `footer.legalLinks`: the bottom bar of all three variants (Privacy / Terms / Cookies /
 *   GDPR); the legal-only footer (p15, p17, p18) is this bar alone. "© <year> <legalName>"
 *   comes from `site-settings.legalName`, never from here.
 * Footer variant per page = `pages.footerVariant` (CLAUDE.md rule 4, MERGED §7 footer table).
 *
 * Data shape: named tabs `header` / `footer` store like groups (payload@3.91.0
 * fields/hooks/beforeChange/promise.js:423-441, `tabHasName` = 'name' in tab,
 * fields/config/types.js:46), so the paths are exactly SCHEMA's `header.links`,
 * `header.cta`, `footer.standard.columns`, `footer.standard.newsletterNudge`,
 * `footer.reduced.links`, `footer.legalLinks`. Every link is the shared `linkField`
 * (src/fields/index.ts): internal reference to pages / case-studies / posts / lead-magnets
 * (polymorphic, maxDepth 1; population runs through the reader's access, so a link to a
 * draft stays an unpopulated ID for the public) or a custom https/mailto/site-path URL.
 * Array rows are `{ link: linkField({ required: true }) }`, so a row can never be saved
 * half-filled or empty; the optional `header.cta` may be left fully empty (no button).
 *
 * Defaults: NO link defaults. A link label without a target fails `linkField`'s validation,
 * and the target pages do not exist yet, so default rows would make the first save
 * impossible. Arrays (incl. the standard column titles) start empty; the seed fills them
 * once pages exist. The only defaults are the newsletter nudge's design copy (SCHEMA §7.3). In payload@3.91.0 a global has no stored row until its first
 * save (globals/operations/findOne.js), so the frontend must treat every field as optional
 * and render an empty header/footer zone gracefully.
 *
 * Row limits (SCHEMA §7.3): header links max 6, standard columns max 3, via `maxRows`
 * (built-in array validator, fields/validations.js:259-284; the admin also stops offering
 * "Add" at the limit).
 *
 * Validation follows the repo convention (PROGRESS Decision log): field `validate`
 * functions that call the built-in validator from `payload/shared` first; nothing throws
 * from a hook. No drafts on globals (SCHEMA §7), so validation runs on every save and the
 * admin's server-built form state shows errors inline (same as G1/G2).
 *
 * Access (SCHEMA §4.3 "globals (all 4)"): read public (every field is rendered in the site
 * chrome); update + readVersions staff only (admin, marketing). The pipeline user is
 * logged in but not staff → denied. `GlobalConfig.access` = { read, readVersions, update }
 * (payload@3.91.0 globals/config/types.d.ts:210).
 *
 * Revalidation (SCHEMA §10): tag `navigation` + the whole frontend layout, skipped with
 * `context.disableRevalidate` (seed) — src/hooks/revalidateTag.ts `revalidateGlobalHook`.
 */

const trim: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)

const validateColumnTitle: TextFieldSingleValidation = (value, options) => {
  if (typeof value !== 'string' || value.trim() === '') return 'Add the column heading, e.g. "Pages".'
  return text(value, options)
}

/**
 * The built-in array validator words the limit as "no more than 6 Rows" (it ignores
 * `labels`, fields/validations.js:271-275); restate it with the row noun. `maxRows` stays
 * on the field so the admin still stops offering "Add" at the limit.
 */
const maxRowsValidate =
  (max: number, plural: string): ArrayFieldValidation =>
  (value, { req: { t } }) =>
    !Array.isArray(value) || value.length <= max || t('validation:requiresNoMoreThan', { count: max, label: plural })

/** One sortable array of complete links; rows read as their link text when collapsed. */
const linkArray = ({
  name,
  label,
  description,
  maxRows,
}: {
  name: string
  label: string
  description: string
  maxRows?: number
}): ArrayField => ({
  name,
  label,
  labels: { singular: 'Link', plural: 'Links' },
  type: 'array',
  maxRows,
  ...(maxRows ? { validate: maxRowsValidate(maxRows, 'links') } : {}),
  admin: {
    isSortable: true,
    initCollapsed: true,
    description,
    components: { RowLabel: '/components/admin/NavRowLabels#NavLinkRowLabel' },
  },
  fields: [linkField({ name: 'link', label: 'Link', required: true })],
})

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    description:
      'The menu at the top of the site and the links in the footers. Which header and footer a page shows is chosen on the page itself (Pages → a page → "Header" and "Footer" in the sidebar). Changes go live as soon as you save.',
  },
  access: {
    read: () => true,
    readVersions: staffOnly,
    update: staffOnly,
  },
  hooks: {
    afterChange: [revalidateGlobalHook('navigation')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ---------------------------------------------------------------- */
        {
          name: 'header',
          label: 'Header',
          admin: {
            description:
              'The menu bar at the top of every page (on phones it opens from the menu button and shows the same links). Pages set to a "Logo only" header — campaign landing pages and lead magnets — and the Link-in-Bio page (no header) show none of these links.',
          },
          fields: [
            linkArray({
              name: 'links',
              label: 'Menu links',
              maxRows: 6,
              description:
                'Up to 6 links, shown left to right in this order, e.g. Work, Services, Testimonials, About, FAQ. Drag to reorder.',
            }),
            linkField({
              name: 'cta',
              label: 'Button',
              description:
                'The highlighted button at the right of the menu, usually "Book a Call" linking to the Book a Call page. Leave empty to show no button.',
            }),
          ],
        },
        /* ---------------------------------------------------------------- */
        {
          name: 'footer',
          label: 'Footers',
          admin: {
            description:
              'There are three footers. Standard: on almost every page. Reduced: only on Book a Call and Thank You, so visitors stay focused. Legal only: on campaign landing pages, Link-in-Bio and lead magnets — just the small legal links. The company name and the brand line in the footers come from Site settings.',
          },
          fields: [
            {
              name: 'standard',
              type: 'group',
              label: 'Standard footer',
              admin: {
                description:
                  'Used on every page except Book a Call, Thank You, campaign landing pages, Link-in-Bio and lead magnets.',
              },
              fields: [
                {
                  name: 'columns',
                  label: 'Link columns',
                  labels: { singular: 'Column', plural: 'Columns' },
                  type: 'array',
                  maxRows: 3,
                  validate: maxRowsValidate(3, 'columns'),
                  admin: {
                    isSortable: true,
                    initCollapsed: true,
                    description:
                      'Up to 3 columns of links next to the logo, e.g. Pages, Services, Resources. Drag to reorder columns; open a column to add, remove or reorder its links.',
                    components: { RowLabel: '/components/admin/NavRowLabels#FooterColumnRowLabel' },
                  },
                  fields: [
                    {
                      name: 'title',
                      label: 'Column heading',
                      type: 'text',
                      required: true,
                      validate: validateColumnTitle,
                      hooks: { beforeValidate: [trim] },
                    },
                    linkArray({
                      name: 'links',
                      label: 'Links',
                      description: 'Shown top to bottom in this order. Drag to reorder.',
                    }),
                  ],
                },
                {
                  name: 'newsletterNudge',
                  type: 'group',
                  label: 'Newsletter sign-up',
                  admin: {
                    description:
                      'The small sign-up box in the last column of the standard footer. It uses the newsletter form chosen in Site settings.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'heading',
                          type: 'text',
                          label: 'Heading',
                          defaultValue: 'Newsletter',
                          hooks: { beforeValidate: [trim] },
                          admin: { width: '30%' },
                        },
                        {
                          name: 'line',
                          type: 'text',
                          label: 'Line',
                          defaultValue: 'One useful email a month. Numbers included.',
                          hooks: { beforeValidate: [trim] },
                          admin: { width: '50%' },
                        },
                        {
                          name: 'buttonLabel',
                          type: 'text',
                          label: 'Button text',
                          defaultValue: 'Join',
                          hooks: { beforeValidate: [trim] },
                          admin: { width: '20%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'reduced',
              type: 'group',
              label: 'Reduced footer',
              admin: {
                description: 'Used only on Book a Call and Thank You: the logo, these few links and the legal links.',
              },
              fields: [
                linkArray({
                  name: 'links',
                  label: 'Links',
                  description: 'e.g. Home, Work, FAQ, Contact. Shown left to right in this order. Drag to reorder.',
                }),
              ],
            },
            linkArray({
              name: 'legalLinks',
              label: 'Legal links',
              description:
                'The small links in the bottom bar of every footer, e.g. Privacy, Terms, Cookies, GDPR. Campaign landing pages, Link-in-Bio and lead magnets show only this bar.',
            }),
          ],
        },
      ],
    },
  ],
}
