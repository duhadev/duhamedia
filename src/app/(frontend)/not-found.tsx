import Link from 'next/link'

import { PageShell } from '@/components/chrome'

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
