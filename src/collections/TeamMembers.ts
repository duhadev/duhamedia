import type { CollectionConfig } from 'payload'

import { staffContentAccess } from '../access'
import { contentVersions, validateHttpsUrl } from '../fields'
import { blockDeleteIfReferenced } from '../hooks/blockDeleteIfReferenced'
import { revalidateTagHooks } from '../hooks/revalidateTag'

/** SCHEMA §10: public reads are cached under the `team-members` tag. */
const revalidate = revalidateTagHooks('team-members')

/**
 * `team-members` (SCHEMA.md §2.3, §6.6, §4.3, §5 — Gate S approved 2026-10-17).
 *
 * A collection, not a global (Gate S decision §2.3): p13/p14 post bylines
 * need a PUBLIC relationship target (users are private auth docs; a global
 * cannot be a relationship target), and p1 §Founder + p8 §Founder reuse the
 * same doc via `TeamIntro.member`.
 * R5/R17: one founder today, "Abdur-Rahman Ch" is the only real name. The bio
 * stays a placeholder until he writes it; never invent founder facts (rule 3).
 * R12: "Latest posts" is dropped, so there is no field for it.
 *
 * Drafts on (SCHEMA §5.1). Revalidation (tag `team-members`) is the integrator's.
 */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', '_status', 'updatedAt'],
    description: 'People shown in the founder/team sections and as article authors.',
  },
  access: staffContentAccess,
  versions: contentVersions,
  hooks: {
    afterChange: [revalidate.afterChange],
    // S3-1: refuse to delete while still used somewhere live (named message).
    beforeDelete: [blockDeleteIfReferenced()],
    afterDelete: [revalidate.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Full name as it should appear on the site and in bylines.' },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'Short title line, e.g. "Founder · Chicago".' },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 400,
      admin: {
        description: 'One or two sentences, written by the person. Max 400 characters.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      admin: { description: 'Portrait for the founder/team card.' },
    },
    {
      name: 'socials',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      admin: {
        description: 'Icons on the founder card. Drag to reorder.',
        components: { RowLabel: '/components/admin/SocialRowLabel#SocialRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Facebook', value: 'facebook' },
              ],
              admin: { width: '35%' },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
              validate: validateHttpsUrl,
              admin: { width: '65%', description: 'Full https:// profile address.' },
            },
          ],
        },
      ],
    },
  ],
}
