import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { Clients } from './collections/Clients'
import { Downloads } from './collections/Downloads'
import { Faqs } from './collections/Faqs'
import { LeadMagnets } from './collections/LeadMagnets'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { Scarcity } from './globals/Scarcity'
import { SeoDefaults } from './globals/SeoDefaults'
import { SiteSettings } from './globals/SiteSettings'
import { isAdmin, staffOnly } from './access'
import { isCronRequest } from './lib/cronAuth'
import { databaseUrl } from './lib/databaseUrl'
import { getAppEnv } from './lib/siteUrl'
import { EVENTS_QUEUE, deliverSiteEventTask } from './integrations/events/deliveryTask'
import { sendLeadMagnetAssetTask } from './integrations/leadMagnet/tasks'
import {
  NEWSLETTER_QUEUE,
  sendNewsletterConfirmationTask,
  syncNewsletterContactTask,
} from './integrations/newsletter/tasks'
import { registerSiteErrorPayload, reportPayloadError } from './integrations/siteError/report'
import { deliverSiteErrorTask } from './integrations/siteError/task'
import { formBuilder } from './plugins/formBuilder'
import { redirects } from './plugins/redirects'
import { seo } from './plugins/seo'
import { storage } from './plugins/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// All config comes from env at RUNTIME (Vercel Production / Preview, and local dev).
const onVercel = Boolean(process.env.VERCEL)

export default buildConfig({
  admin: {
    user: Users.slug,
    // On-brand admin chrome: logo/icon components + stylesheet src/app/(payload)/custom.scss.
    components: {
      graphics: {
        Logo: '/components/admin/Logo#default',
        Icon: '/components/admin/Icon#default',
      },
    },
    meta: {
      titleSuffix: ' — Duha Media',
      // No static OG asset exists and admin is noindex; turn off Payload's dynamic /api/og image.
      defaultOGImageType: 'off',
      icons: [{ rel: 'icon', type: 'image/png', url: '/logo-512.png' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: process.env.SITE_URL || '',
  collections: [Users, Pages, Media, Downloads, Clients, TeamMembers, Testimonials, Faqs, CaseStudies, Posts, LeadMagnets],
  globals: [SiteSettings, Scarcity, Navigation, SeoDefaults],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Neon (Vercel) or local docker-compose Postgres, through node-postgres
  // (src/lib/databaseUrl.ts: pooled at runtime, direct for `payload migrate`/seed).
  // Migrations are NOT run on boot any more (no `prodMigrations`): the Vercel
  // build runs `payload migrate` before `next build` (package.json `vercel-build`),
  // so a failed migration fails the deploy and the old deployment keeps serving.
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl(),
      // Fluid compute shares one pool per instance; PgBouncer (Neon `-pooler`) does
      // the real pooling, so keep few, short-lived client connections
      // (https://vercel.com/kb/guide/connection-pooling-with-functions: short idle timeout).
      ...(onVercel ? { max: 5, idleTimeoutMillis: 5_000 } : {}),
    },
    // Drizzle dev push ONLY against a development database, never when a laptop
    // has a pulled Vercel env (APP_ENV staging/production) loaded.
    push: getAppEnv() === 'development' && !onVercel,
  }),
  // Resend only when a key is configured; otherwise Payload's default
  // console transport (logs emails, never crashes).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: 'no-reply@duhamedia.com',
        defaultFromName: 'Duha Media',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  // Query presets (enabled on form-submissions, SCHEMA §4.3): staff only.
  // Payload's default is "any logged-in user", which includes the pipeline
  // (payload@3.91.0 query-presets/access.js:9-19).
  queryPresets: {
    access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
    // Built-in constraints only (Only me / Everyone / Specific users).
    constraints: {},
  },
  // Jobs queue (DECISIONS §J; payload@3.91.0 queues/config/types/index.d.ts).
  // - Vercel: no in-process cron (autoRun "should not be used on serverless
  //   platforms like Vercel", same file). Each immediate job runs right after
  //   the response that queued it (src/integrations/jobs/runAfterResponse.ts,
  //   Next `after()`). Vercel Cron is the backstop and the retry driver:
  //   Hobby plan (2026-10-28) = one daily call to
  //   /api/payload-jobs/run?allQueues=true&limit=50 (vercel.json); on Pro it
  //   returns to `* * * * *` per queue. Authorised by
  //   `Authorization: Bearer $CRON_SECRET` (access.run below); Production only.
  // - Local dev: in-process autoRun as before, started by the first
  //   getPayload({ cron: true }) (never during `next build`: index.js `!isNextBuild()`).
  jobs: {
    tasks: [
      deliverSiteEventTask,
      sendNewsletterConfirmationTask,
      syncNewsletterContactTask,
      sendLeadMagnetAssetTask,
      // A4: site_error events (job-only; queue `events`).
      deliverSiteErrorTask,
    ],
    autoRun: onVercel
      ? undefined
      : [
          { cron: '* * * * *', queue: EVENTS_QUEUE, limit: 10 },
          // A2: double opt-in email + Resend contact sync; A3: lead-magnet asset email (all Resend-bound;
          // Resend limit 10 req/s; ≤ 10 jobs/min).
          { cron: '* * * * *', queue: NEWSLETTER_QUEUE, limit: 10 },
        ],
    // Payload's default is "any logged-in user" (incl. the pipeline) for
    // GET /api/payload-jobs/run etc. Our own code uses the Local API (overrideAccess).
    // `run` also accepts the Vercel Cron bearer (src/lib/cronAuth.ts).
    access: {
      queue: ({ req }) => isAdmin(req.user),
      run: ({ req }) => isAdmin(req.user) || isCronRequest(req.headers),
      cancel: ({ req }) => isAdmin(req.user),
    },
  },
  // A4 site_error: REST/GraphQL/endpoint errors with status >= 500 (payload@3.91.0
  // utilities/routeError.js calls config.hooks.afterError after collection hooks).
  // Next-side errors are reported from src/instrumentation.ts.
  hooks: {
    afterError: [reportPayloadError],
  },
  // A4: hands the instance to the site_error reporter (shared with instrumentation).
  onInit: (payload) => registerSiteErrorPayload(payload),
  sharp,
  telemetry: false,
  // seo is order-independent (touches only pages/case-studies/posts/lead-magnets).
  // storage (Vercel Blob for media + downloads, local disk without a token) last.
  plugins: [formBuilder, redirects, seo, storage],
})
