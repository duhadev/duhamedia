import type { RequiredDataFromCollectionSlug } from 'payload'

import { h, p, quote, root, ul } from '@/showcase/lexical'

import { founderAvatar, ogImage, placeholderImage, placeholderWorksheet } from './assets'
import { SEED_CONTEXT, ensure, link, ph, phSub, type SeedCtx } from './lib'

/**
 * Library documents the pages point at: media, downloads, forms, the "Failed
 * deliveries" query preset, clients, team members, testimonials, FAQs, case
 * studies, posts and the lead magnet. Create-only by stable key (lib.ts).
 *
 * Content rules (CLAUDE.md "Site structure & content rules"):
 * - placeholder copy only, bracketed where it stands in for a real fact
 *   (F61: brackets are allowed in the seed; Gate 3 blocks them on public pages);
 * - no invented clients, people, numbers, ratings or policy terms;
 * - prices only as the two approved facts ("Builds start at $5K",
 *   "Engines start at $1K/mo"), inline;
 * - case studies, posts and the lead magnet are DRAFTS (Launch-state rule, F149).
 */

export type LibraryIds = Awaited<ReturnType<typeof seedLibrary>>

const write = { context: SEED_CONTEXT, overrideAccess: true } as const

export async function seedLibrary(ctx: SeedCtx) {
  const { payload, req } = ctx
  const opts = { ...write, req }

  /* ---------------- media + downloads (keyed by alt / title) ---------------- */

  const OG_ALT = 'Duha Media placeholder share image (replace before launch)'
  const ogMedia = await ensure(ctx, 'media', OG_ALT, { alt: { equals: OG_ALT } }, async () =>
    payload.create({ collection: 'media', data: { alt: OG_ALT }, file: await ogImage(), ...opts }),
  )

  const PLACEHOLDER_ALT = 'Placeholder image (replace with a real photo before launch)'
  const image = await ensure(ctx, 'media', PLACEHOLDER_ALT, { alt: { equals: PLACEHOLDER_ALT } }, async () =>
    payload.create({ collection: 'media', data: { alt: PLACEHOLDER_ALT }, file: await placeholderImage(), ...opts }),
  )

  const WORKSHEET_TITLE = '[Placeholder worksheet]'
  const worksheet = await ensure(ctx, 'downloads', WORKSHEET_TITLE, { title: { equals: WORKSHEET_TITLE } }, async () =>
    payload.create({ collection: 'downloads', data: { title: WORKSHEET_TITLE }, file: placeholderWorksheet(), ...opts }),
  )

  /* ---------------- forms (keyed by formKey; INTEGRATIONS.md form contracts) ---------------- */

  const contactForm = await ensure(ctx, 'forms', 'contact', { formKey: { equals: 'contact' } }, () =>
    payload.create({
      collection: 'forms',
      data: {
        title: 'Contact',
        formKey: 'contact',
        eventType: 'contact',
        sendEvent: true,
        newsletterSync: false,
        submitButtonLabel: 'Send message',
        confirmationType: 'message',
        confirmationMessage: root(p("Thanks — it's with us. We reply within one business day.")),
        fields: [
          { blockType: 'text', name: 'name', label: 'Name', width: 50, required: true, placeholder: 'Your name' },
          { blockType: 'email', name: 'email', label: 'Email', width: 50, required: true, placeholder: 'you@store.com' },
          { blockType: 'text', name: 'company', label: 'Company', width: 50, required: false, placeholder: 'Business name (optional)' },
          {
            blockType: 'select',
            name: 'reason',
            label: 'Reason',
            width: 50,
            required: true,
            placeholder: 'Choose one',
            options: [
              { label: 'Partnership', value: 'partnership' },
              { label: 'Press', value: 'press' },
              { label: 'Existing client', value: 'existing-client' },
              { label: 'Other', value: 'other' },
            ],
          },
          { blockType: 'textarea', name: 'message', label: 'Message', width: 100, required: true, placeholder: 'The short version' },
        ],
        // Staff notification (CLAUDE.md lead flow step 6). Empty "Email to" → env FORMS_DEFAULT_TO_EMAIL → from-address.
        emails: [{ subject: 'New contact form message', replyTo: '{{email}}', message: root(p('A new contact form message arrived. Open Form Submissions in the admin to read it.')) }],
      },
      ...opts,
    }),
  )

  const homeworkForm = await ensure(ctx, 'forms', 'precall-homework', { formKey: { equals: 'precall-homework' } }, () =>
    payload.create({
      collection: 'forms',
      data: {
        title: 'Pre-call homework',
        formKey: 'precall-homework',
        // Gate 0 Q1: stored, event OFF at launch (INTEGRATIONS.md).
        eventType: 'contact',
        sendEvent: false,
        newsletterSync: false,
        submitButtonLabel: 'Submit homework',
        confirmationType: 'message',
        confirmationMessage: root(p("Homework received. We'll have read it before the call.")),
        // Fields from Book a Call.dc.html §Pre-call homework (+ email to match the booking); R17 says TBD.
        fields: [
          { blockType: 'text', name: 'name', label: 'Name', width: 50, required: true, placeholder: 'Your name' },
          { blockType: 'email', name: 'email', label: 'Email', width: 50, required: true, placeholder: 'you@store.com' },
          { blockType: 'text', name: 'company', label: 'Business', width: 50, required: true, placeholder: 'Business name' },
          { blockType: 'text', name: 'website', label: 'Website URL', width: 50, required: false, placeholder: 'https://' },
          {
            blockType: 'select',
            name: 'revenue',
            label: 'Annual revenue range',
            width: 100,
            required: true,
            placeholder: 'Choose a range',
            options: [
              { label: 'Under $500K', value: 'under-500k' },
              { label: '$500K – $1M', value: '500k-1m' },
              { label: '$1M – $5M', value: '1m-5m' },
              { label: 'Over $5M', value: 'over-5m' },
            ],
          },
          {
            blockType: 'textarea',
            name: 'marketingSetup',
            label: 'Current marketing setup',
            width: 100,
            required: true,
            placeholder: 'Who runs what today — agencies, freelancers, in-house, nobody',
          },
          {
            blockType: 'textarea',
            name: 'bottleneck',
            label: 'Biggest bottleneck',
            width: 100,
            required: true,
            placeholder: 'The one thing that, fixed, would move revenue most',
          },
        ],
        emails: [{ subject: 'Pre-call homework submitted', replyTo: '{{email}}', message: root(p('Pre-call homework arrived. Open Form Submissions in the admin to read it before the call.')) }],
      },
      ...opts,
    }),
  )

  const newsletterForm = await ensure(ctx, 'forms', 'newsletter', { formKey: { equals: 'newsletter' } }, () =>
    payload.create({
      collection: 'forms',
      data: {
        title: 'Newsletter',
        formKey: 'newsletter',
        eventType: 'newsletter',
        sendEvent: true,
        newsletterSync: true,
        submitButtonLabel: 'Join',
        confirmationType: 'message',
        confirmationMessage: root(p('Check your inbox — confirm your email to join the list.')),
        fields: [{ blockType: 'email', name: 'email', label: 'Email', width: 100, required: true, placeholder: 'you@store.com' }],
      },
      ...opts,
    }),
  )

  const leadMagnetForm = await ensure(ctx, 'forms', 'lead-magnet', { formKey: { equals: 'lead-magnet' } }, () =>
    payload.create({
      collection: 'forms',
      data: {
        title: 'Lead magnet capture',
        formKey: 'lead-magnet',
        eventType: 'lead_magnet',
        sendEvent: true,
        newsletterSync: true,
        newsletterOptInField: 'newsletter',
        submitButtonLabel: 'Get the download',
        confirmationType: 'message',
        confirmationMessage: root(p("Check your inbox. It's on the way.")),
        fields: [
          { blockType: 'email', name: 'email', label: 'Email', width: 100, required: true, placeholder: 'you@store.com' },
          { blockType: 'checkbox', name: 'newsletter', label: 'Also send me the monthly newsletter', width: 100, required: false, defaultValue: false },
        ],
      },
      ...opts,
    }),
  )

  /* ---------------- shared "Failed deliveries" preset (INTEGRATIONS.md re-send procedure) ---------------- */

  const PRESET = 'Failed deliveries'
  await ensure(
    ctx,
    'payload-query-presets',
    PRESET,
    { and: [{ title: { equals: PRESET } }, { relatedCollection: { equals: 'form-submissions' } }] },
    () =>
      payload.create({
        collection: 'payload-query-presets',
        data: {
          title: PRESET,
          relatedCollection: 'form-submissions',
          isShared: true,
          // Visible to all staff (queryPresets.access is staff-only, so "everyone" = admin + marketing).
          access: { read: { constraint: 'everyone' }, update: { constraint: 'everyone' }, delete: { constraint: 'everyone' } },
          where: { or: [{ and: [{ deliveryStatus: { equals: 'failed' } }] }] },
          columns: [
            { accessor: 'form', active: true },
            { accessor: 'deliveryStatus', active: true },
            { accessor: 'deliveryAttempts', active: true },
            { accessor: 'deliveryNote', active: true },
            { accessor: 'createdAt', active: true },
          ],
        },
        ...opts,
      }),
  )

  /* ---------------- clients (placeholders; never shown in logo strips by default) ---------------- */

  const clientIds: number[] = []
  for (const [i, letter] of ['A', 'B', 'C', 'D', 'E', 'F'].entries()) {
    const name = `[Client ${letter}]`
    clientIds.push(
      await ensure(ctx, 'clients', name, { name: { equals: name } }, () =>
        payload.create({
          collection: 'clients',
          data: { name, showInLogoStrip: false, sortOrder: i + 1, _status: 'published' },
          ...opts,
        }),
      ),
    )
  }

  /* ---------------- team member (SCHEMA §6.6: real name; bio stays a placeholder until he writes it) ---------------- */

  const FOUNDER = 'Abdur-Rahman Ch'
  const AVATAR_ALT = "Founder's avatar: a low-poly desert river at sunset"
  const avatar = await ensure(ctx, 'media', AVATAR_ALT, { alt: { equals: AVATAR_ALT } }, async () =>
    payload.create({
      collection: 'media',
      data: { alt: AVATAR_ALT, focalX: 72, focalY: 30 },
      file: await founderAvatar(),
      ...opts,
    }),
  )
  const founder = await ensure(ctx, 'team-members', FOUNDER, { name: { equals: FOUNDER } }, () =>
    payload.create({
      collection: 'team-members',
      data: { name: FOUNDER, role: 'Founder', photo: avatar, bio: '[One-sentence bio, founder-authored — final copy TBD]', _status: 'published' },
      ...opts,
    }),
  )

  /* ---------------- testimonials (published placeholders; NO ratings — a seeded star average would be an invented fact) ---------------- */

  const testimonial = (key: string, data: RequiredDataFromCollectionSlug<'testimonials'>) =>
    ensure(ctx, 'testimonials', key, { quote: { equals: data.quote } }, () =>
      payload.create({ collection: 'testimonials', data: { ...data, _status: 'published' }, ...opts }),
    )

  const tQuote = await testimonial('t1 direct', {
    quote: '[Placeholder quote — a client in their own words, one or two sentences.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    client: clientIds[0],
    source: 'direct',
    format: 'text',
    sortOrder: 1,
  })
  const tHandover = await testimonial('t2 direct + metric', {
    quote: '[Placeholder quote about the handover, not the agency.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    client: clientIds[1],
    source: 'direct',
    format: 'text',
    metric: { value: '[N]%', label: '[Metric label]' },
    sortOrder: 2,
  })
  const tVideo = await testimonial('t3 video', {
    quote: '[Placeholder pull quote from the video — what changed, in the client’s words.]',
    authorName: '[Client name]',
    authorRole: '[Business type, Chicago]',
    client: clientIds[2],
    source: 'direct',
    format: 'video',
    // Placeholder id (11 chars, accepted by src/lib/youtube.ts); the real video replaces it.
    video: { url: 'https://www.youtube.com/watch?v=PLACEHOLDER', poster: image, durationLabel: '[0:00]' },
    metric: { value: '[+N%]', label: 'Revenue, [N] mo' },
    sortOrder: 3,
  })
  const tGoogle = await testimonial('t4 google review', {
    quote: '[GBP review placeholder — pulled verbatim from Google at launch, never paraphrased.]',
    authorName: '[Reviewer]',
    source: 'google-review',
    sourceUrl: 'https://www.google.com/maps',
    verbatim: true,
    format: 'text',
    sortOrder: 4,
  })
  const tLinkedIn = await testimonial('t5 linkedin', {
    quote: '[Placeholder LinkedIn recommendation, quoted as posted.]',
    authorName: '[Client name]',
    authorRole: '[Role, Company]',
    source: 'linkedin',
    sourceUrl: 'https://www.linkedin.com/',
    format: 'text',
    sortOrder: 5,
  })
  const tShort = await testimonial('t6 direct short', {
    quote: '[Placeholder quote, short.]',
    authorName: '[Client name]',
    authorRole: '[Online-only, category]',
    source: 'direct',
    format: 'text',
    sortOrder: 6,
  })
  const tReader = await testimonial('t7 reader quote', {
    quote: '[Reader quote slot — demonstrative placeholder, non-final.]',
    authorName: '[Reader name]',
    authorRole: '[Store type]',
    source: 'direct',
    format: 'text',
    sortOrder: 7,
  })

  /* ---------------- FAQs (published; pricing answer opens Pricing & Contracts, rule 5 exception) ---------------- */

  const faq = (question: string, category: 'pricing-contracts' | 'builds' | 'marketing' | 'process-trust', sortOrder: number, ...paras: string[]) =>
    ensure(ctx, 'faqs', question, { question: { equals: question } }, () =>
      payload.create({
        collection: 'faqs',
        data: { question, category, sortOrder, listOnFaqPage: true, answer: root(...paras.map((t) => p(t))), _status: 'published' },
        ...opts,
      }),
    )

  const fPrice = await faq(
    'What does it cost?',
    'pricing-contracts',
    1,
    'Builds start at $5K. Engines start at $1K/mo. Exact scope is priced on the call, in writing, before anything is signed. [Placeholder copy.]',
  )
  const fRetainer = await faq(
    'Do you lock clients into retainers?',
    'pricing-contracts',
    2,
    'No. The endgame is your team running it: Phase 3 is a scheduled handover, not a renewal conversation. [Placeholder copy.]',
  )
  const fTerm = await faq('How long are contracts?', 'pricing-contracts', 3, '[Placeholder — contract length and terms, final copy TBD with counsel.]')
  const fStartOver = await faq(
    'I already have a store. Do I have to start over?',
    'builds',
    1,
    'Usually not. Most builds start as a revision: keep what converts, fix what leaks. [Placeholder copy.]',
  )
  const fBuildOnly = await faq(
    'Can I do the build without the engine?',
    'builds',
    2,
    "Yes. Phase 1 is fixed-scope and stands alone. We'll tell you on the call whether an engine makes sense for your numbers. [Placeholder copy.]",
  )
  const fBuildTime = await faq('How long does a build take?', 'builds', 3, '[Placeholder — typical build length, final copy TBD.]')
  const fMinTerm = await faq('Is there a minimum term for the engine?', 'marketing', 1, '[Placeholder — the minimum term and the reason for it, final copy TBD.]')
  const fAdsOnly = await faq(
    'Can I just get ads?',
    'marketing',
    2,
    'The engine runs as one system — email, ads, content, SEO, GBP and CRM — so the mix is priced on the call. [Placeholder copy.]',
  )
  const fFit = await faq(
    'Will this work for my business?',
    'process-trust',
    1,
    'It is built for established businesses netting $500K to $5M a year that do well offline and are under-scaled online. The call is where we say whether it fits. [Placeholder copy.]',
  )
  const fDifferent = await faq(
    'What makes you different?',
    'process-trust',
    2,
    'One accountable team builds the store, runs the growth engine, then trains your team to take over. Leaving is the deliverable. [Placeholder copy.]',
  )

  /* ---------------- case studies (DRAFTS ONLY — Launch-state rule) ---------------- */

  const study = (n: number, slug: string, clientId: number, track: 'build' | 'growth' | 'build-and-growth', featured: boolean) =>
    ensure(ctx, 'case-studies', slug, { slug: { equals: slug } }, () =>
      payload.create({
        collection: 'case-studies',
        draft: true,
        data: {
          _status: 'draft',
          title: `[Demonstrative study ${n}] The demand was already there. The store was leaking it.`,
          accentPhrase: 'The store was leaking it.',
          slug,
          client: clientId,
          track,
          studyNumber: n,
          engagementLine: '[Engagement scope] · [Sector, N locations]',
          headlineMetric: { value: '[+N%]', label: '[Metric label, N months]' },
          cardSummary: '[Placeholder summary: what was leaking, what we changed.]',
          inShort: '[Placeholder summary of the situation, the order of work and the outcome, in two or three sentences.]',
          heroMedia: image,
          narrative: {
            before: { title: 'What we found', body: root(p('[Placeholder] What the audit found, in two or three sentences.'), ul('[Placeholder finding]', '[Placeholder finding]')) },
            strategy: { title: 'The order of work, and why', body: root(p('[Placeholder] Tracking first, then the store, then acquisition — and why that order.'), quote('[Placeholder pull quote.]')) },
            results: { title: 'What changed, month by month', body: root(p('[Placeholder] What changed, in order, with figures only from client-approved records.')) },
          },
          resultsTable: {
            eyebrow: 'Results — [N months], client-reported',
            columns: { measure: 'Measure', baseline: 'Before', after: 'After', change: 'Change' },
            rows: [
              { measure: '[Measure]', baseline: '[N]', after: '[N]', change: '[+N%]' },
              { measure: '[Measure]', baseline: '[N]', after: '[N]', change: '[+N%]' },
            ],
            method: '[Method: how baseline and after were measured, who supplied the figures — client-approved records only.]',
          },
          clientVoice: {
            testimonial: tVideo,
            doDifferently: root(p("[Placeholder] What we would change with hindsight, in the client's terms.")),
            phaseMapping: '[Placeholder] Phase 1 built the foundation. Phase 2 ran the engine. Phase 3 handed it over.',
            link: link('See the two tracks', '/services'),
          },
          featured,
          figuresApproved: false,
        },
        ...opts,
      }),
    )

  const study1 = await study(1, 'demonstrative-study-1', clientIds[0], 'build-and-growth', true)
  const study2 = await study(2, 'demonstrative-study-2', clientIds[1], 'growth', false)

  /* ---------------- posts (DRAFTS — one per track) ---------------- */

  const post = (slug: string, data: Omit<RequiredDataFromCollectionSlug<'posts'>, 'slug' | '_status'>) =>
    ensure(ctx, 'posts', slug, { slug: { equals: slug } }, () =>
      payload.create({ collection: 'posts', draft: true, data: { ...data, slug, _status: 'draft' }, ...opts }),
    )

  const devPost = await post('shopify-development-chicago', {
    track: 'dev-seo',
    title: ph('Shopify development in Chicago, scoped in writing.'),
    targetKeyword: 'Shopify development Chicago',
    eyebrow: 'Shopify Theme Development — Chicago',
    dek: phSub("Most stores we see don't need a rebuild — they need the leak found first."),
    author: founder,
    body: root(
      h('h2', "Why you're searching this"),
      p('[Placeholder] The pattern behind this page, in two sentences. You want the store to convert and one name accountable when it does not.'),
      h('h2', 'Revision before rebuild'),
      p('[Placeholder] Our default is the Revision, not the scratch build. We keep what converts and replace what leaks.'),
    ),
    howWeDoIt: {
      eyebrow: 'How we do it',
      body: '[Placeholder] Scoped after the audit, by the team that also runs the growth engine afterwards. The build ends with training, not a support retainer.',
      link: link('Full build scope', '/services/shopify-theme-development'),
    },
    diyBridge: {
      eyebrow: 'Hiring a freelancer vs. hiring a team',
      heading: 'Some stores should just hire a freelancer.',
      body: root(p('[Placeholder] When a freelancer is the right call, and when the build and the marketing become the same decisions.')),
      facts: [
        { value: '[N–N]', label: 'Weeks', sub: '[Placeholder] Signed scope to launch.', accent: true },
        { value: '1', label: 'Team, one dashboard', sub: 'One owner of the revenue number.' },
      ],
    },
    pricingNote: 'Builds start at $5K',
    educational: {
      eyebrow: '[Placeholder] Before you brief anyone',
      heading: '[Placeholder] Three questions to ask any developer.',
      body: root(p('[Placeholder] A short teaching note in brand voice. What to ask, and what a straight answer sounds like.')),
    },
    proof: { source: 'track', fallbackMode: 'testimonials', fallbackTestimonials: [tQuote, tHandover] },
    faqHeading: '[Placeholder] Shopify development — common questions',
    faq: [
      { question: '[Placeholder question]', answer: root(p('[Placeholder answer.]')) },
      { question: '[Placeholder question]', answer: root(p('[Placeholder answer.]')) },
    ],
  })

  const mktPost = await post('integrated-ecommerce-marketing', {
    track: 'mkt-seo',
    title: ph('One team for email, ads, content, SEO, GBP and CRM.'),
    targetKeyword: 'integrated ecommerce marketing',
    eyebrow: 'Education — integrated growth',
    dek: phSub('Five vendors, five reports, nobody owning the number. What changes when one team runs the whole engine.'),
    author: founder,
    body: root(
      h('h2', '[Placeholder] The teach'),
      p('[Placeholder] The useful part first: the worksheet, the order of work, what to measure.'),
      quote('[Placeholder pull quote.]'),
    ),
    diyBridge: {
      eyebrow: 'Doing this yourself vs. having it done',
      heading: 'Some businesses should run this in-house.',
      body: root(p('[Placeholder] When an in-house hire is enough, and when the owner’s time is worth more running the business.')),
      facts: [],
    },
    howWeDoIt: {
      eyebrow: 'How Duha does it',
      body: '[Placeholder] Email, ads, content, SEO, GBP and CRM run as one engine — one owner of the revenue number, ending in a handover.',
      link: link('See the engine', '/services/marketing'),
    },
    pricingNote: 'Engines start at $1K/mo',
    proof: {
      source: 'track',
      fallbackMode: 'metricStrip',
      fallbackMetrics: [
        { value: '6', label: 'Channels, one team', sub: 'Email, ads, content, SEO, GBP, CRM', accent: true },
        { value: '1', label: 'Dashboard', sub: 'You see what we see' },
      ],
    },
    faqHeading: '[Placeholder] On consolidating your marketing',
    faq: [{ question: '[Placeholder question]', answer: root(p('[Placeholder answer.]')) }],
  })

  const issue = await post('sample-issue-1', {
    track: 'newsletter-issue',
    title: '[Sample issue title — one store problem and the number it moved]',
    issueNumber: 1,
    issueMetric: '[metric]',
    dek: '[One-line summary placeholder. The setup, the number it moved, and what we would do differently.]',
    body: root(p('[Placeholder issue body — demonstrative, non-final.]')),
  })

  /* ---------------- lead magnet (DRAFT until the lead_magnet Gate A clears staging, F149) ---------------- */

  const LM_SLUG = 'sample-worksheet'
  const leadMagnet = await ensure(ctx, 'lead-magnets', LM_SLUG, { slug: { equals: LM_SLUG } }, () =>
    payload.create({
      collection: 'lead-magnets',
      draft: true,
      data: {
        _status: 'draft',
        slug: LM_SLUG,
        eyebrow: 'Free download',
        title: ph('[Asset name placeholder — the checklist/worksheet pitch.]'),
        accentPhrase: 'the checklist/worksheet pitch.',
        pitch: phSub("[Placeholder — one paragraph: what the asset is, who it's for, the specific problem it solves. Number first.]"),
        form: leadMagnetForm,
        formNote: 'Email delivery. No drip sequence ambush — one send, plus the monthly newsletter if you opt in.',
        whatsInsideHeading: "What's inside",
        valueBullets: [
          { text: '[Value bullet placeholder — concrete deliverable inside the asset]' },
          { text: '[Value bullet placeholder — the number/benchmark it gives them]' },
          { text: '[Value bullet placeholder — the mistake it prevents]' },
          { text: '[Value bullet placeholder — time to apply it]' },
        ],
        asset: { file: worksheet },
        deliveryEmail: { subject: '[Placeholder] Your worksheet', intro: '[Placeholder] Here is the worksheet you asked for. One send — that is it.' },
        deliveredState: {
          eyebrow: 'Sent',
          heading: "Check your inbox. It's on the way.",
          accentPhrase: "It's on the way.",
          body: "If it's not there in five minutes, check spam, then email us.",
          crossSellLine: "While you're here:",
        },
      },
      ...opts,
    }),
  )

  return {
    media: { og: ogMedia, image },
    downloads: { worksheet },
    forms: { contact: contactForm, homework: homeworkForm, newsletter: newsletterForm, leadMagnet: leadMagnetForm },
    clients: clientIds,
    founder,
    testimonials: { quote: tQuote, handover: tHandover, video: tVideo, google: tGoogle, linkedin: tLinkedIn, short: tShort, reader: tReader },
    faqs: { price: fPrice, retainer: fRetainer, term: fTerm, startOver: fStartOver, buildOnly: fBuildOnly, buildTime: fBuildTime, minTerm: fMinTerm, adsOnly: fAdsOnly, fit: fFit, different: fDifferent },
    studies: [study1, study2],
    posts: { dev: devPost, mkt: mktPost, issue },
    leadMagnet,
  }
}
