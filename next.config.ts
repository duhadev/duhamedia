import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Based on templates/with-postgres/next.config.ts at payload v3.91.0.
// Deployed on Vercel (no `output: 'standalone'`). Media URLs stay same-origin
// (/api/media/file/*, proxied from Vercel Blob by Payload), so no remotePatterns.
const nextConfig: NextConfig = {
  // Stop `next dev` from writing an agent-rules block into CLAUDE.md/AGENTS.md
  // (CLAUDE.md is owned by the PM).
  agentRules: false,
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
