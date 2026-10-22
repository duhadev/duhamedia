import { PageShell } from '@/components/chrome'
import { PageFaqJsonLd } from '@/components/PageFaqJsonLd'
import { ReadingProgress } from '@/components/ReadingProgress'
import { RenderBlocks } from '@/components/RenderBlocks'
import { pageLayout } from '@/lib/pages'
import type { Page } from '@/payload-types'

/**
 * One `pages` doc rendered in its chrome (router unit B2): header/footer
 * variants from the doc, the `layout` sections through RenderBlocks, and the
 * reading progress island when the page sets `readingProgress` (SCHEMA X6),
 * and ONE merged FAQPage JSON-LD for all its AccordionFAQ blocks.
 * Shared by `/` and `/[...slug]` so both routes render a page identically.
 */
export function PageView({ page }: { page: Page }) {
  const layout = pageLayout(page)
  return (
    <PageShell header={page.headerVariant} footer={page.footerVariant}>
      {page.readingProgress ? <ReadingProgress /> : null}
      <main>
        <RenderBlocks blocks={layout} pageJsonLd />
        <PageFaqJsonLd layout={layout} />
      </main>
    </PageShell>
  )
}
