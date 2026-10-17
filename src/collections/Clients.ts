import type { CollectionConfig } from 'payload'

import { staffContentAccess } from '../access'
import { contentVersions, sortOrderField, validateHttpsUrl } from '../fields'
import { revalidateTagHooks } from '../hooks/revalidateTag'

/** SCHEMA §10: public reads are cached under the `clients` tag. */
const revalidate = revalidateTagHooks('clients')

/**
 * `clients` (SCHEMA.md §6.5, §4.3, §5 — Gate S approved 2026-10-17).
 *
 * Brands Duha Media works with: p1 §Proof strip logo row (6 names), p15
 * §Proof strip (2 names), p19 §Review wall name tiles, p8 logo strip (via the
 * CaseStudyCards fallback), and attribution on case studies / testimonials.
 * R5: every client name today is a placeholder; the seed labels them as such.
 *
 * Drafts on (SCHEMA §5.1): public reads return published clients only.
 * Revalidation (tag `clients`) is wired by the integrator (SCHEMA §10).
 */
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Client', plural: 'Clients' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'showInLogoStrip', 'sortOrder', '_status', 'updatedAt'],
    description: 'Client brands shown in logo strips and credited on testimonials and case studies.',
  },
  defaultSort: 'sortOrder',
  access: staffContentAccess,
  versions: contentVersions,
  hooks: {
    afterChange: [revalidate.afterChange],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Brand name. Shown as text in the logo strip when there is no logo.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      admin: {
        description: 'Optional monochrome logo (single colour on transparent). Without one, the name is shown.',
      },
    },
    {
      name: 'website',
      type: 'text',
      validate: validateHttpsUrl,
      admin: {
        description: 'Optional, full https:// address of the client site.',
      },
    },
    {
      name: 'showInLogoStrip',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this client in the logo strips (Homepage, About, campaign pages).',
      },
    },
    sortOrderField('Order in the logo strip. Lower numbers come first.'),
  ],
}
