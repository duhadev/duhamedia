import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { CaseStudyView } from '@/components/CaseStudyView'
import { getCaseStudy } from '@/lib/caseStudies'
import { caseStudyJsonLd, caseStudyMetadata } from '@/lib/metadata'
import { getPreviewUser } from '@/lib/pages'
import { findRedirect } from '@/lib/redirects'

type Props = { params: Promise<{ slug: string }> }

/**
 * p2 Case Study template at `/work/<slug>` (S4-12; `docPath('case-studies')`).
 *
 * - The PUBLISHED study, or (staff draft preview only) its latest draft
 *   (src/lib/caseStudies.ts, same rules as pages).
 * - No study → the redirects collection (F22: only when nothing lives at the
 *   path) → else (frontend)/not-found.tsx (404).
 * - `/work` itself is the `work` pages doc, served by `[...slug]`: this
 *   segment only matches `/work/<one segment>`, and `pageSlugError` forbids
 *   pages under `work/`, so the two can never collide.
 * - force-dynamic via the (frontend) layout; no generateStaticParams (no DB
 *   at build time).
 */
const slugOf = async (params: Props['params']): Promise<string> => (await params).slug

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudy(await slugOf(params))
  if (!study) return {}
  return caseStudyMetadata(study, { preview: Boolean(await getPreviewUser()) })
}

export default async function CaseStudyPage({ params }: Props) {
  const slug = await slugOf(params)
  const study = await getCaseStudy(slug)
  if (study) {
    const jsonLd = await caseStudyJsonLd(study)
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <CaseStudyView study={study} />
      </>
    )
  }

  const target = await findRedirect(`/work/${slug}`)
  if (target) {
    if (target.permanent) permanentRedirect(target.location)
    redirect(target.location)
  }
  notFound()
}
