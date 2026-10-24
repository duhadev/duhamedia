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
import { migrations } from './migrations'
import { isAdmin, staffOnly } from './access'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// All config comes from env at RUNTIME (one image for staging + production).
export default buildConfig({
  admin: {
    user: Users.slug,
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Run pending committed migrations during Payload init when NODE_ENV=production
    // (DECISIONS.md §E). Dev uses Drizzle push against the local DB only.
    prodMigrations: migrations,
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
  // Jobs queue, in-process (DECISIONS §J; payload@3.91.0 queues/config/types/index.d.ts).
  // The cron starts on the first getPayload({ cron: true }) (any /api/* or admin
  // request, and /api/health, which the deploy script polls on start).
  // Never during `next build` (payload index.js `_initializeCrons`: !isNextBuild()).
  jobs: {
    tasks: [
      deliverSiteEventTask,
      sendNewsletterConfirmationTask,
      syncNewsletterContactTask,
      sendLeadMagnetAssetTask,
      // A4: site_error events (job-only; queue `events`).
      deliverSiteErrorTask,
    ],
    autoRun: [
      { cron: '* * * * *', queue: EVENTS_QUEUE, limit: 10 },
      // A2: double opt-in email + Resend contact sync; A3: lead-magnet asset email (all Resend-bound;
      // Resend limit 10 req/s; ≤ 10 jobs/min).
      { cron: '* * * * *', queue: NEWSLETTER_QUEUE, limit: 10 },
    ],
    // Payload's default is "any logged-in user" (incl. the pipeline) for
    // GET /api/payload-jobs/run etc. Our own code uses the Local API (overrideAccess).
    access: {
      queue: ({ req }) => isAdmin(req.user),
      run: ({ req }) => isAdmin(req.user),
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
  plugins: [formBuilder, redirects, seo],
})
