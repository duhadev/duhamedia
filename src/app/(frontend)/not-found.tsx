import type { Metadata } from 'next'
import Link from 'next/link'

import { PageShell } from '@/components/chrome'

// Title runs through the layout's seo-defaults template ("Page not found — Duha
// Media"). Robots: Next adds its own `noindex` meta to not-found responses and
// the layout sets none (F78 B1), so a 404 has exactly one robots meta tag; on
// staging / dev the proxy's `X-Robots-Tag` header comes on top (a header, not a
// second tag).
export const metadata: Metadata = { title: 'Page not found' }

// Phase 1 placeholder. The designed 404 (page 21, Error404 block) replaces it.
export default function NotFound() {
  return (
    <PageShell>
      <main>
        <h1>Page not found</h1>
        <p>
          <Link href="/">Go to the homepage</Link>
        </p>
      </main>
    </PageShell>
  )
}
