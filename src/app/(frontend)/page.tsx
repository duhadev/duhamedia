import { PageShell } from '@/components/chrome'
import { RenderBlocks } from '@/components/RenderBlocks'
import { HOME_SLUG } from '@/lib/pagePath'
import { getPublishedPage, pageLayout } from '@/lib/pages'

/**
 * `/` = the published `pages` doc with slug `home` (SCHEMA §6.1). Its sections
 * (hero first, X2) render through RenderBlocks. Until a home doc is published
 * (fresh DB before seeding) the old placeholder stays, so `/` is never a 404.
 */
export default async function HomePage() {
  const page = await getPublishedPage(HOME_SLUG)

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

  return (
    <PageShell header={page.headerVariant} footer={page.footerVariant}>
      <main>
        <RenderBlocks blocks={pageLayout(page)} />
      </main>
    </PageShell>
  )
}
