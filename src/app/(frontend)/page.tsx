import type { Metadata } from 'next'

import { PageShell } from '@/components/chrome'
import { PageView } from '@/components/PageView'
import { homeFallbackMetadata, pageMetadata } from '@/lib/metadata'
import { HOME_SLUG } from '@/lib/pagePath'
import { getPage, getPreviewUser } from '@/lib/pages'

/**
 * `/` = the `pages` doc with slug `home` (SCHEMA §6.1): published, or its
 * latest draft in staff preview (src/lib/pages.ts). Until a home doc is
 * published (fresh DB before seeding) a minimal placeholder renders, so `/`
 * is never a 404.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(HOME_SLUG)
  if (!page) return homeFallbackMetadata()
  return pageMetadata(page, { preview: Boolean(await getPreviewUser()) })
}

export default async function HomePage() {
  const page = await getPage(HOME_SLUG)

  if (!page) {
    return (
      <PageShell>
        <main>
          <h1>Duha Media</h1>
          <p>Site rebuild in progress.</p>
        </main>
      </PageShell>
    )
  }

  return <PageView page={page} />
}
