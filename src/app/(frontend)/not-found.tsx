import type { Metadata } from 'next'
import Link from 'next/link'

import { PageShell } from '@/components/chrome'

// Title runs through the layout's seo-defaults template. Next adds its own
// `noindex` robots tag to not-found responses, so the layout's non-production
// robots tag is cleared here (`robots` is a nested field: this value replaces
// the layout's) to keep exactly one.
export const metadata: Metadata = { title: 'Page not found', robots: null }

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
