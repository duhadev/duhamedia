import type {
  Condition,
  DateFieldValidation,
  FieldHook,
  GlobalConfig,
  NumberFieldSingleValidation,
  TextFieldSingleValidation,
} from 'payload'
import { date, number, text } from 'payload/shared'

import { staffOnly, staffOnlyField } from '../access'
import { linkField, validateHttpsUrl } from '../fields'
import { revalidateGlobalHook } from '../hooks/revalidateTag'

/**
 * `site-settings` global (SCHEMA.md §7.1, §4.3, §10 — Gate S approved 2026-10-17).
 *
 * Site-wide facts every page shares: legal line + brand line (all footers),
 * contact email and socials (p12, p17, Organization `sameAs`), location
 * (p12 map + direct line, LocalBusiness JSON-LD, p1 "— Chicago" brand line),
 * GBP link + aggregate rating (p7, p19), booking link (p9 BookingEmbed),
 * postal address (newsletter broadcast footers, CAN-SPAM) and the default
 * closers for the p2/p13/p14 templates and empty NewsletterBand/FinalCTA
 * headings.
 *
 * Real facts only (MERGED §10 R5): the only defaults that are facts are
 * Lombard, IL (location). Legal name, contact email, socials, GBP link,
 * coordinates, postal address and rating start EMPTY; the seed fills
 * placeholders. Copy defaults (newsletter closer lines) are design copy.
 *
 * No drafts (SCHEMA §7): a save is live immediately. Defaults are applied
 * when the global is first saved (admin form / Local API update), NOT on read:
 * payload@3.91.0 globals/operations/findOne.js returns `{}`-shaped data until
 * the first save, so the frontend must treat every field as optional.
 *
 * Access (SCHEMA §4.3 "globals (all 4)"): read public (nothing here is
 * private: every field is rendered or emitted as JSON-LD); update + versions
 * staff only (admin, marketing). The pipeline user is logged in, so nothing
 * relies on Payload's default "any logged-in user".
 * `GlobalConfig.access` = { read, readVersions, update }
 * (payload@3.91.0 globals/config/types.d.ts:210).
 *
 * Revalidation (SCHEMA §10): `afterChange` purges tag `site-settings` and the
 * whole frontend layout (src/hooks/revalidateTag.ts `revalidateGlobalHook`);
 * skipped with `context.disableRevalidate` (seed).
 *
 * Validation follows the repo convention (PROGRESS Decision log): conditional
 * rules are field `validate` functions that call the built-in validator from
 * `payload/shared` first (a custom `validate` replaces the built-in one,
 * fields/hooks/beforeChange/promise.js); nothing throws from a hook.
 */

const SOCIAL_PLATFORMS = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'GitHub', value: 'github' },
]

/** "duhamedia" / " @duhamedia " → "@duhamedia" (CLAUDE.md: full @handle per platform). */
const normaliseHandle: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (trimmed === '') return trimmed
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

const HANDLE_RE = /^@[A-Za-z0-9._-]{1,100}$/

const validateHandle: TextFieldSingleValidation = (value, options) => {
  const base = text(value, options)
  if (base !== true) return base
  if (typeof value !== 'string' || value.trim() === '') return true
  return HANDLE_RE.test(value.trim())
    ? true
    : 'Enter the handle as it appears on the platform, e.g. @duhamedia (letters, numbers, dots, dashes, underscores).'
}

/* Aggregate rating: hidden on the site until real (R5). When "Show" is on, every
 * number and the source link must be filled in. */
const ratingShown: Condition = (_data, siblingData) => siblingData?.show === true

const requiredWhenShown = (siblingData: unknown, value: unknown, message: string): true | string => {
  if ((siblingData as { show?: boolean } | undefined)?.show !== true) return true
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '') ? message : true
}

const validateRatingNumber =
  (message: string): NumberFieldSingleValidation =>
  (value, options) => {
    const base = number(value, options)
    if (base !== true) return base
    return requiredWhenShown(options.siblingData, value, message)
  }

const validateRatingDate: DateFieldValidation = (value, options) => {
  const base = date(value, options)
  if (base !== true) return base
  return requiredWhenShown(options.siblingData, value, 'Required when the rating is shown: the date you read it from Google.')
}

const validateRatingSource: TextFieldSingleValidation = (value, options) => {
  const base = validateHttpsUrl(value, options)
  if (base !== true) return base
  return requiredWhenShown(options.siblingData, value, 'Required when the rating is shown: the Google page the rating comes from.')
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    description:
      'Details used across the whole site: footer legal line, contact email, social profiles, location, booking link and newsletter defaults. Changes go live as soon as you save.',
  },
  access: {
    read: () => true,
    readVersions: staffOnly,
    update: staffOnly,
  },
  hooks: {
    afterChange: [revalidateGlobalHook('site-settings')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ---------------------------------------------------------------- */
        {
          label: 'Brand & contact',
          admin: { description: 'Shown in every footer and on the Contact and Link-in-Bio pages.' },
          fields: [
            {
              name: 'legalName',
              type: 'text',
              label: 'Legal company name',
              required: true,
              admin: {
                description:
                  'The registered company name for the copyright line at the bottom of every footer ("© 2026 …"). The year updates by itself.',
              },
            },
            {
              name: 'footerTagline',
              type: 'text',
              label: 'Footer brand line',
              maxLength: 120,
              admin: {
                description:
                  'The short line under the logo in the main footer, e.g. "One team. Store, engine, then yours to run. Chicago."',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  label: 'Contact email',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'The public email address shown on the Contact page.',
                  },
                },
                {
                  name: 'responseTimeNote',
                  type: 'text',
                  label: 'Reply-time note',
                  maxLength: 60,
                  admin: {
                    width: '50%',
                    description: 'Optional small line next to the email, e.g. "Reply in 1 business day". Only promise what you keep.',
                  },
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Social profiles',
              labels: { singular: 'Social profile', plural: 'Social profiles' },
              admin: {
                description:
                  'Shown on the Contact and Link-in-Bio pages and told to Google as the company\'s official profiles. Drag to reorder.',
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
                      options: SOCIAL_PLATFORMS,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'handle',
                      type: 'text',
                      required: true,
                      validate: validateHandle,
                      hooks: { beforeValidate: [normaliseHandle] },
                      admin: {
                        width: '30%',
                        description: 'The full handle, e.g. @duhamedia. The @ is added if you leave it out.',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      validate: validateHttpsUrl,
                      admin: { width: '45%', description: 'Full https:// profile address.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        /* ---------------------------------------------------------------- */
        {
          label: 'Location',
          admin: { description: 'Where the business is based. Used on the Contact page map and for Google search results.' },
          fields: [
            {
              name: 'location',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'locality',
                      type: 'text',
                      label: 'Town / city',
                      required: true,
                      defaultValue: 'Lombard',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'region',
                      type: 'text',
                      label: 'State',
                      required: true,
                      defaultValue: 'IL',
                      admin: { width: '30%', description: 'Two-letter code, e.g. IL.' },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: 'Country',
                      defaultValue: 'US',
                      admin: { width: '30%', description: 'Two-letter code, e.g. US.' },
                    },
                  ],
                },
                {
                  name: 'displayLine',
                  type: 'text',
                  label: 'Short location line',
                  defaultValue: 'Lombard, IL',
                  admin: { description: 'How the location reads on the site, e.g. "Lombard, IL".' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'marketArea',
                      type: 'text',
                      label: 'Market area',
                      defaultValue: 'Chicago',
                      admin: {
                        width: '50%',
                        description: 'The metro area named in the brand line, e.g. "Chicago" in "Integrated ecommerce growth partner — Chicago".',
                      },
                    },
                    {
                      name: 'serviceRadiusMiles',
                      type: 'number',
                      label: 'Service radius (miles)',
                      defaultValue: 30,
                      min: 0,
                      max: 500,
                      admin: { width: '50%', step: 1, description: 'Drawn as the ring on the Contact page map.' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      min: -90,
                      max: 90,
                      admin: {
                        width: '50%',
                        description: 'Map pin position. Copy it from Google Maps (right-click the spot → the first number).',
                      },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      min: -180,
                      max: 180,
                      admin: { width: '50%', description: 'The second number from Google Maps.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        /* ---------------------------------------------------------------- */
        {
          label: 'Booking',
          admin: { description: 'The call-booking page used by the Book a Call page.' },
          fields: [
            {
              name: 'bookingUrl',
              type: 'text',
              label: 'Booking page address',
              validate: validateHttpsUrl,
              admin: {
                description:
                  'The full https:// address of the booking calendar. Leave empty and the Book a Call page shows a "get in touch" message instead of a booking button.',
              },
            },
            {
              name: 'bookingMode',
              type: 'select',
              label: 'How the booking page opens',
              required: true,
              defaultValue: 'link-out',
              options: [
                { label: 'Button that opens the booking page in a new tab', value: 'link-out' },
                { label: 'Booking calendar shown inside the page', value: 'embed' },
              ],
              admin: {
                description:
                  'Keep "new tab" unless the booking calendar has been set up to allow showing inside our site (it is not today).',
              },
            },
          ],
        },
        /* ---------------------------------------------------------------- */
        {
          label: 'Reviews',
          admin: { description: 'Google Business Profile link and the average rating shown on the Testimonials and Reviews pages.' },
          fields: [
            {
              name: 'gbpUrl',
              type: 'text',
              label: 'Google Business Profile link',
              validate: validateHttpsUrl,
              admin: { description: 'The full https:// link to the Google Business Profile, so visitors can check the reviews.' },
            },
            {
              name: 'aggregateRating',
              type: 'group',
              label: 'Average rating',
              admin: {
                description: 'Stays hidden on the site until "Show" is ticked. Only enter the real figures from Google.',
              },
              fields: [
                {
                  name: 'show',
                  type: 'checkbox',
                  label: 'Show the rating on the site',
                  defaultValue: false,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ratingValue',
                      type: 'number',
                      label: 'Average stars',
                      min: 1,
                      max: 5,
                      validate: validateRatingNumber('Required when the rating is shown.'),
                      admin: { width: '25%', step: 0.1, condition: ratingShown, description: 'e.g. 4.9' },
                    },
                    {
                      name: 'reviewCount',
                      type: 'number',
                      label: 'Number of reviews',
                      min: 0,
                      validate: validateRatingNumber('Required when the rating is shown.'),
                      admin: { width: '25%', step: 1, condition: ratingShown },
                    },
                    {
                      name: 'asOf',
                      type: 'date',
                      label: 'Checked on',
                      validate: validateRatingDate,
                      admin: {
                        width: '50%',
                        condition: ratingShown,
                        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
                        description: 'The day you read the figures.',
                      },
                    },
                  ],
                },
                {
                  name: 'sourceUrl',
                  type: 'text',
                  label: 'Source link',
                  validate: validateRatingSource,
                  admin: { condition: ratingShown, description: 'The Google page the rating comes from (full https:// address).' },
                },
              ],
            },
          ],
        },
        /* ---------------------------------------------------------------- */
        {
          label: 'Newsletter & closers',
          admin: { description: 'Default newsletter and closing call-to-action text, and the postal address for newsletter emails.' },
          fields: [
            {
              // P1 (SCHEMA §7.1): the one newsletter form behind every NewsletterBand,
              // the footer nudge and the p16 hero. Forms are staff-read; the frontend
              // loads the form server-side.
              name: 'newsletterForm',
              type: 'relationship',
              relationTo: 'forms',
              maxDepth: 1,
              label: 'Newsletter form',
              admin: { description: 'The signup form used by every newsletter section and the footer.' },
            },
            {
              name: 'templateDefaults',
              type: 'group',
              label: 'Default closing sections',
              admin: {
                description:
                  'Used at the end of case studies and articles, and by any newsletter or final call-to-action section whose heading is left empty.',
              },
              fields: [
                {
                  name: 'newsletterHeading',
                  type: 'text',
                  label: 'Newsletter heading',
                  defaultValue: 'One useful email a month.',
                },
                {
                  name: 'newsletterLine',
                  type: 'text',
                  label: 'Newsletter line',
                  defaultValue: 'Numbers included. Unsubscribe anytime.',
                  admin: { description: 'The quiet line under the newsletter heading.' },
                },
                {
                  name: 'finalCtaHeading',
                  type: 'text',
                  label: 'Final call-to-action heading',
                  admin: { description: 'The big closing line before the footer, e.g. "Get the build scoped in writing."' },
                },
                linkField({
                  name: 'finalCtaButton',
                  label: 'Final call-to-action button',
                  description: 'Usually "Book a Call", linking to the Book a Call page.',
                }),
              ],
            },
            {
              name: 'postalAddress',
              type: 'group',
              label: 'Postal address (newsletter emails)',
              // Flag F6 (Gate S delta 2026-10-21): hidden from the public API. The newsletter
              // broadcast job reads it server-side with overrideAccess (default Local API).
              access: { read: staffOnlyField },
              admin: {
                description:
                  'US law requires a postal address at the bottom of every newsletter email. Not shown on the website pages. The first newsletter cannot be sent until this is filled in.',
              },
              fields: [
                { name: 'line1', type: 'text', label: 'Address line 1' },
                { name: 'line2', type: 'text', label: 'Address line 2' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', admin: { width: '40%' } },
                    { name: 'region', type: 'text', label: 'State', admin: { width: '20%' } },
                    { name: 'postalCode', type: 'text', label: 'ZIP code', admin: { width: '20%' } },
                    { name: 'country', type: 'text', admin: { width: '20%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
