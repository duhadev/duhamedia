import type { LibraryIds } from './library'
import { SEED_CONTEXT, ensureGlobal, link, type SeedCtx } from './lib'

/**
 * The four globals, each written ONLY when it has never been saved
 * (lib.ts `ensureGlobal`). A saved global is never touched, even when one of
 * its arrays is empty — the human's edits always win.
 *
 * Values: approved facts from the Decision log (F1 legal name, F2 contact
 * email, F4 Lombard map point, F5 copy), SCHEMA §7 defaults, and the design's
 * nav labels (MERGED §4.2). Booking URL stays empty (no Nextcloud URL yet →
 * BookingEmbed's designed no-URL state). Socials stay empty (unknown fact).
 * Postal address = the LLC's mailing address (human 2026-10-27). `localBusiness.type` stays unset (F103: plain Organization).
 */
export async function seedGlobals(ctx: SeedCtx, ids: LibraryIds) {
  const { payload, req } = ctx
  const opts = { context: SEED_CONTEXT, overrideAccess: true, req } as const

  await ensureGlobal(ctx, 'site-settings', () =>
    payload.updateGlobal({
      slug: 'site-settings',
      data: {
        legalName: 'Al-Amanah LLC',
        footerTagline: 'First we build. Then we scale.',
        contactEmail: 'hello@duhamedia.com',
        responseTimeNote: 'We reply within 1 business day',
        socials: [],
        location: {
          locality: 'Lombard',
          region: 'IL',
          country: 'US',
          displayLine: 'Lombard, IL',
          marketArea: 'Chicago',
          serviceRadiusMiles: 30,
          latitude: 41.88,
          longitude: -88.008,
        },
        bookingUrl: '',
        bookingMode: 'link-out',
        aggregateRating: { show: false },
        postalAddress: {
          line1: '30 N Gould St',
          line2: 'Ste R',
          city: 'Sheridan',
          region: 'WY',
          postalCode: '82801',
          country: 'USA',
        },
        newsletterForm: ids.forms.newsletter,
        templateDefaults: {
          newsletterHeading: 'One useful email a month.',
          newsletterLine: 'Numbers included. Unsubscribe anytime.',
          finalCtaHeading: '[STRATEGIC PLACEHOLDER — final copy TBD] Get a free consultation on your ecommerce business.',
          finalCtaButton: link('Book a Call', '/book-a-call'),
        },
      },
      ...opts,
    }),
  )

  // SCHEMA §7.2 seed rows (F52, F120: slots-line uses {open}). Counts are the design's demonstrative
  // values were the design's; real counts + reasons confirmed by the human 2026-10-27 (3 active, each runs build + engine).
  await ensureGlobal(ctx, 'scarcity', () =>
    payload.updateGlobal({
      slug: 'scarcity',
      data: {
        capacity: 7,
        activeClients: 3,
        buildsInProgress: 3,
        enginesRunning: 3,
        statements: [
          { key: 'ongoing', statistic: '{active}', label: 'Projects ongoing', reason: 'Current load, shown transparently.' },
          { key: 'capacity', statistic: '{capacity}', label: 'Max client capacity', reason: 'Each build gets about 55 hands-on hours: design, build, revision. No templates.' },
          {
            key: 'builds-line',
            statistic: '{builds} builds in progress. We cap at {capacity}.',
            reason: 'Each build gets about 55 hands-on hours: design, build, revision. No templates.',
          },
          {
            key: 'engines-line',
            statistic: '{engines} engines running. We cap at {capacity}.',
            reason: 'Every client runs a build and an engine together, under the same cap.',
          },
          { key: 'slots-line', statistic: 'Slots open {open}/{capacity}', reason: 'Each build gets about 55 hands-on hours: design, build, revision. No templates.' },
          { key: 'offer-line', statistic: '{active} of {capacity} slots filled', reason: 'Each build gets about 55 hands-on hours: design, build, revision. No templates.' },
        ],
      },
      ...opts,
    }),
  )

  await ensureGlobal(ctx, 'navigation', () =>
    payload.updateGlobal({
      slug: 'navigation',
      data: {
        header: {
          links: [
            { link: link('Work', '/work') },
            { link: link('Services', '/services') },
            { link: link('Testimonials', '/testimonials') },
            { link: link('About', '/about') },
            { link: link('FAQ', '/faq') },
          ],
          cta: link('Book a Call', '/book-a-call'),
        },
        footer: {
          standard: {
            columns: [
              {
                title: 'Pages',
                links: [
                  { link: link('Work', '/work') },
                  { link: link('About', '/about') },
                  { link: link('Testimonials', '/testimonials') },
                  { link: link('Book a Call', '/book-a-call') },
                ],
              },
              {
                title: 'Services',
                links: [
                  { link: link('Shopify Theme Development', '/services/shopify-theme-development') },
                  { link: link('Marketing', '/services/marketing') },
                ],
              },
              {
                title: 'Resources',
                links: [
                  { link: link('Newsletter', '/newsletter') },
                  { link: link('Review Hub', '/reviews') },
                  { link: link('FAQ', '/faq') },
                  { link: link('Contact', '/contact') },
                ],
              },
            ],
            newsletterNudge: { heading: 'Newsletter', line: 'One useful email a month. Numbers included.', buttonLabel: 'Join' },
          },
          reduced: {
            links: [
              { link: link('Home', '/') },
              { link: link('Work', '/work') },
              { link: link('FAQ', '/faq') },
              { link: link('Contact', '/contact') },
            ],
          },
          legalLinks: [
            { link: link('Privacy', '/privacy') },
            { link: link('Terms', '/terms') },
            { link: link('Cookies', '/cookies') },
            { link: link('GDPR', '/gdpr') },
          ],
        },
      },
      ...opts,
    }),
  )

  await ensureGlobal(ctx, 'seo-defaults', () =>
    payload.updateGlobal({
      slug: 'seo-defaults',
      data: {
        titleTemplate: '%s — Duha Media',
        defaultDescription:
          '[Placeholder] One team builds your Shopify store, runs the growth engine, then trains your team to take over. Chicago.',
        defaultOgImage: ids.media.og,
        organization: { name: 'Duha Media' },
        localBusiness: { areaServed: 'Chicago metropolitan area' },
      },
      ...opts,
    }),
  )
}
