import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { migrations } from './migrations'

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
  collections: [Users, Media],
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
  sharp,
  telemetry: false,
  plugins: [],
})
