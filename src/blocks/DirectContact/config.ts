import type { Block } from 'payload'

/**
 * DirectContact block (SCHEMA §8.4 item 18, R9; replaces MapEmbed, X5).
 * Contact page "Direct info + map" (desktop) / "Direct line" (mobile): one
 * section at both breakpoints. The email, socials and location VALUES are not
 * block fields: they come from the `site-settings` global at render, so they
 * are edited in one place. This block only chooses which rows to show and the
 * wording around them. The map is fixed monochrome, Lombard IL (R9): no
 * treatment select. One variant.
 */
export const DirectContact: Block = {
  slug: 'directContact',
  interfaceName: 'DirectContactBlock',
  labels: { singular: 'Direct contact (info + map)', plural: 'Direct contact blocks' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Show email',
          defaultValue: true,
          admin: { width: '33%', description: 'Email address from Site settings > Brand & contact.' },
        },
        {
          name: 'showSocials',
          type: 'checkbox',
          label: 'Show social profiles',
          defaultValue: true,
          admin: { width: '33%', description: 'Profiles from Site settings > Brand & contact.' },
        },
        {
          name: 'showLocation',
          type: 'checkbox',
          label: 'Show location',
          defaultValue: true,
          admin: { width: '34%', description: 'Town from Site settings > Location.' },
        },
      ],
    },
    {
      name: 'skipFormLine',
      type: 'text',
      label: 'Small line above the details',
      defaultValue: 'Skip the form',
      maxLength: 40,
      admin: { description: 'The small label above the email on phones, e.g. "Skip the form". Leave empty to hide it.' },
    },
    {
      name: 'rowLabels',
      type: 'group',
      label: 'Row labels',
      admin: { description: 'The small labels in front of each detail (shown on larger screens, and for location and reply time on phones).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'text', defaultValue: 'Email', maxLength: 30, admin: { width: '25%' } },
            { name: 'socials', type: 'text', defaultValue: 'Socials', maxLength: 30, admin: { width: '25%' } },
            { name: 'location', type: 'text', defaultValue: 'Location', maxLength: 30, admin: { width: '25%' } },
            {
              name: 'replyTime',
              type: 'text',
              label: 'Reply time',
              defaultValue: 'Reply time',
              maxLength: 30,
              admin: { width: '25%', description: 'Label for the reply-time note set in Site settings. Shown with the contact details.' },
            },
          ],
        },
      ],
    },
    {
      name: 'map',
      type: 'group',
      label: 'Service-area map',
      admin: {
        description:
          'A simple black-and-white map of the area around the office, drawn by the site (no outside map service). It centres on the coordinates in Site settings > Location and draws the service-radius ring from there.',
      },
      fields: [
        { name: 'show', type: 'checkbox', label: 'Show the map', defaultValue: true },
        {
          name: 'caption',
          type: 'textarea',
          defaultValue:
            'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.',
          admin: { description: 'The sentence under the map. Also read out to screen-reader users as the map description.' },
        },
        {
          name: 'zoom',
          type: 'number',
          defaultValue: 1,
          min: 0.5,
          max: 2,
          admin: {
            step: 0.25,
            description: '1 shows the whole service ring with room around it. Higher zooms in (fewer towns visible), lower zooms out.',
          },
        },
      ],
    },
  ],
}
