import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { guard, patchPage, report, type PatchCtx } from '../lib/contentPatch'
import { p, root } from '../showcase/lexical'

/**
 * Case-study previews and the Abu Oud study page (owner, 2026-11-08: "the
 * preview is confusing, no one knows what it is"). Data only; the fields come
 * from 20261108_120000_casestudy_preview_schema (which sorts before this file).
 *
 * 1. Two screenshots of the live abuoud.net (owner-approved; captured
 *    2026-11-08, committed in ./assets) are uploaded to Media, idempotent by
 *    alt. On Vercel the upload needs BLOB_READ_WRITE_TOKEN; without it (or on
 *    any upload error) the upload is SKIPPED with a warning and nothing that
 *    would point at a missing file is written. Manual fallback: Admin → Media
 *    → upload the two files with the alts below, then Case studies → Abu Oud →
 *    Summary → Store screenshots, pick them, and set Hero media to the
 *    desktop one.
 * 2. The study (guarded: slug `abu-oud-shopify-store`, client "Abu Oud", the
 *    published title) gets the brochure p6 copy, verbatim except "a newsletter
 *    every two weeks" → "a monthly newsletter" (owner: monthly is right):
 *    services, the three facts, the card sentence, Why / How / What / What's
 *    next, the pull line; `heroMedia` and the share image become the desktop
 *    screenshot (the landscape stays the founder's profile picture only).
 * 3. Pages (guarded per index against the 2026-11-08 production layout):
 *    /work `layout[1]` caseStudyCards ledger → `feature` (+ the ledger labels'
 *    old jargon defaults); home `layout[6]` and /services `layout[6]`
 *    testimonialRow heading "Proof, in their words." → "The work, up close."
 *    (no client quote is published yet).
 * 4. site-settings: the Nextcloud booking link, link-out, ONLY when no booking
 *    URL is set yet (PM 2026-11-08; the page sends X-Frame-Options SAMEORIGIN).
 */

const CONTEXT = { disableRevalidate: true, casestudyPreview: true }

const SLUG = 'abu-oud-shopify-store'
const TITLE = 'The community trusts his oud. The store didn’t show it.'
const BOOKING_URL = 'https://office.duhamedia.com/apps/calendar/appointment/bsWjWXp25db4'

const SCREENS = {
  desktop: { file: 'abu-oud-store-desktop.webp', alt: 'The Abu Oud store homepage on a desktop screen' },
  mobile: { file: 'abu-oud-store-phone.webp', alt: 'The Abu Oud store’s Oud collection on a phone' },
} as const

const OLD_HEADING = 'Proof, in their words.'
const NEW_HEADING = 'The work, up close.'

const STUDY = {
  services: ['brand', 'design', 'custom-shopify-build'],
  cardSummary:
    'A new store at abuoud.net, designed and coded from scratch around his logo and colors. Mobile-first, easy to navigate, the full catalog loading now.',
  facts: [
    {
      label: 'Products listed',
      before: '12',
      value: '50+',
      accent: true,
      context: 'The full catalog is loading now. The old store showed about 12 of his blends.',
    },
    {
      label: 'Interface design',
      value: '30h+',
      accent: false,
      context: 'Hours on design alone, before a line of code. Built around his existing logo and colors.',
    },
    {
      label: 'Templates used',
      value: 'Zero',
      accent: false,
      context: 'A custom Shopify theme, built mobile-first. Pages that were buried behind layers of links are now easy to reach.',
    },
  ],
  narrative: {
    before: {
      title: 'Why',
      body: root(
        p(
          'Abu Oud’s founder blends his own fragrances. He has a trained nose and sources raw material directly from Malaysia, Bangladesh, Thailand, Burma and beyond. His community knows him as the person to go to for the real, authentic thing. The online store didn’t show it: about 12 products, pages buried behind layers of links, and imagery that undersold the product. The classic problem of an amazing product but poor execution.',
        ),
      ),
    },
    strategy: {
      title: 'How',
      body: root(
        p(
          'We listened first. We learned how oud is sourced and blended, and watched how he talks to customers. We kept his logo and colors and organized the brand system around them. Then we redesigned the whole interface, over 30 hours on design alone, and built a custom Shopify theme from scratch.',
        ),
      ),
    },
    results: {
      title: 'What',
      body: root(
        p(
          'A new store at abuoud.net, mobile-first and easy to navigate. The full catalog is loading now, from about 12 products to 50 or more. The branding is still being refined with him, because it is his company.',
        ),
      ),
    },
    next: {
      title: 'What’s next',
      body: root(p('Organic content built around his expertise, influencer collaborations, SEO and a monthly newsletter.')),
    },
    aside: {
      quote: 'A website is like a business card. It’s worth nothing until you use it.',
      caption: 'Why the marketing comes next',
    },
  },
}

const assetPath = (file: string): string => path.resolve(process.cwd(), 'src/migrations/assets', file)

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  const o = { depth: 0, req, overrideAccess: true, context: CONTEXT } as const

  /* 1. screenshots */
  const canUpload = !process.env.VERCEL || Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const ids: { desktop: number | null; mobile: number | null } = { desktop: null, mobile: null }
  for (const key of ['desktop', 'mobile'] as const) {
    const { file, alt } = SCREENS[key]
    try {
      const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1, ...o })
      if (found.docs[0]) {
        ids[key] = found.docs[0].id as number
        c.done.push(`media "${alt}" (already there)`)
        continue
      }
      if (!canUpload) {
        c.skipped.push(`media "${alt}": no BLOB_READ_WRITE_TOKEN on Vercel, upload skipped (upload it in the admin)`)
        continue
      }
      const data = await readFile(assetPath(file))
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data, mimetype: 'image/webp', name: file, size: data.length },
        ...o,
      })
      ids[key] = doc.id as number
      c.done.push(`media "${alt}" uploaded`)
    } catch (err) {
      c.skipped.push(`media "${alt}": upload failed (${(err as Error).message}); upload it in the admin`)
    }
  }

  /* 2. the study */
  const found = await payload.find({ collection: 'case-studies', where: { slug: { equals: SLUG } }, limit: 1, depth: 1, req, overrideAccess: true })
  const study = found.docs[0]
  const clientName = study && typeof study.client === 'object' && study.client ? study.client.name : null
  if (!study) {
    c.skipped.push(`case study ${SLUG}: not found`)
  } else if (clientName !== 'Abu Oud' || study.title !== TITLE) {
    c.skipped.push(`case study ${SLUG}: client "${clientName}" / title "${study.title}" do not match the production snapshot`)
  } else {
    const screens = { desktop: ids.desktop ?? undefined, mobile: ids.mobile ?? undefined }
    const data: Record<string, unknown> = {
      services: STUDY.services,
      cardSummary: STUDY.cardSummary,
      facts: STUDY.facts,
      narrative: STUDY.narrative,
      screens,
      _status: 'published',
    }
    // The landscape is the founder's profile picture: it must not stand in for the store.
    if (ids.desktop) {
      data.heroMedia = ids.desktop
      data.meta = { ...(study.meta ?? {}), image: ids.desktop }
    } else {
      c.skipped.push(`case study ${SLUG}: no desktop screenshot, so heroMedia / share image are unchanged (still the profile picture)`)
    }
    await guard(c, `case study ${SLUG}`, () => payload.update({ collection: 'case-studies', id: study.id, data, ...o }))
  }

  /* 3. pages */
  await patchPage(c, {
    slug: 'work',
    expect: { 1: 'caseStudyCards' },
    ops: [
      [
        'fn',
        (doc) => {
          const block = doc.layout[1]
          if (block.layout !== 'ledger' && block.layout !== 'feature') throw new Error(`layout[1].layout is ${block.layout}, expected ledger`)
          block.layout = 'feature'
          block.ledgerLabels = block.ledgerLabels ?? {}
          if (block.ledgerLabels.summary === 'What was leaking / what we changed') block.ledgerLabels.summary = 'What we did'
          if (block.ledgerLabels.metric === 'Returned') block.ledgerLabels.metric = 'Result'
        },
      ],
    ],
  })
  for (const slug of ['home', 'services']) {
    await patchPage(c, {
      slug,
      expect: { 6: 'testimonialRow' },
      ops: [
        [
          'fn',
          (doc) => {
            const block = doc.layout[6]
            if (block.heading === NEW_HEADING) return
            if (block.heading !== OLD_HEADING) throw new Error(`layout[6].heading is "${block.heading}", expected "${OLD_HEADING}"`)
            block.heading = NEW_HEADING
          },
        ],
      ],
    })
  }

  /* 4. booking link (only when none is set) */
  const settings = (await payload.findGlobal({ slug: 'site-settings', ...o })) as { bookingUrl?: string | null }
  if (settings.bookingUrl?.trim()) {
    c.skipped.push(`site-settings booking link: already set (${settings.bookingUrl}), left untouched`)
  } else {
    await guard(c, 'site-settings booking link set (link-out)', () =>
      payload.updateGlobal({ slug: 'site-settings', data: { bookingUrl: BOOKING_URL, bookingMode: 'link-out' }, ...o }),
    )
  }

  report(c, 'case-study preview')
}

// Never delete or roll back content; version history holds every previous version.
export async function down(_args: MigrateDownArgs): Promise<void> {}
