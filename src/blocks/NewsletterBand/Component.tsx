import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import { AccentHeadline, Container, ButtonLink, Section } from '@/components/ui'
import type { BlockData } from '@/blocks/types'
import { CMSForm } from '@/components/forms'
import { docPath } from '@/lib/docPath'
import { getRequestPath } from '@/lib/requestPath'
import type { Form, SiteSetting } from '@/payload-types'

import { bandFormClassNames } from './formClassNames'

export type NewsletterBandData = BlockData<'newsletterBand'>

type Loaded = {
  form: number | Form | null
  defaults: SiteSetting['templateDefaults'] | null
  newsletterHref: string | null
}

let warned = false
function warnOnce() {
  if (warned) return
  warned = true
  console.warn('[NewsletterBand] no newsletter form chosen in Site settings > Newsletter & closers; showing a link to /newsletter or nothing')
}

/** Public reads; failure is logged and the band degrades to its text only. */
async function load(): Promise<Loaded> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
    const form = settings.newsletterForm ?? null
    let newsletterHref: string | null = null
    if (!form) {
      warnOnce()
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'newsletter' } },
        limit: 1,
        depth: 0,
        overrideAccess: false,
        draft: false,
      })
      newsletterHref = docPath('pages', docs[0])
    }
    return { form, defaults: settings.templateDefaults ?? null, newsletterHref }
  } catch (error) {
    console.error('[NewsletterBand] could not read site-settings / pages', error)
    return { form: null, defaults: null, newsletterHref: null }
  }
}

/**
 * NewsletterBand, `band` variant (Case Study / Work / Services Hub "Newsletter
 * CTA", desktop + mobile builds). Server component; the form is the shared
 * CMSForm (client island + Turnstile inside it).
 *
 * Empty state: with no `site-settings.newsletterForm` the band keeps its text
 * and shows the Join button as a link to the published `newsletter` page; if
 * that page is not published either, the whole band renders nothing (a heading
 * promising a signup with no way to sign up is worse than no band). Logged once.
 */
export async function NewsletterBandBlock({
  heading,
  accentPhrase,
  line,
  buttonLabel,
  tone,
  spacing,
}: NewsletterBandData) {
  const { form, defaults, newsletterHref } = await load()
  const sourcePath = form ? await getRequestPath() : undefined

  const ownHeading = heading?.trim()
  const title = ownHeading || defaults?.newsletterHeading?.trim() || ''
  const accent = ownHeading ? accentPhrase : null
  const quiet = line?.trim() || (ownHeading ? '' : defaults?.newsletterLine?.trim() || '')
  const label = buttonLabel?.trim() || 'Join'
  if (!title) console.error('[NewsletterBand] no heading set and no default in Site settings > Newsletter & closers')

  if (!form && !newsletterHref) return null

  return (
    <Band
      title={title}
      accent={accent}
      quiet={quiet}
      label={label}
      tone={tone}
      spacing={spacing}
      form={form}
      newsletterHref={newsletterHref}
      sourcePath={sourcePath}
    />
  )
}

/** The band markup. Own sync component so `useId` can name the section by its heading (accessible name for the signup region). */
function Band({
  title,
  accent,
  quiet,
  label,
  tone,
  spacing,
  form,
  newsletterHref,
  sourcePath,
}: {
  title: string
  accent: string | null | undefined
  quiet: string
  label: string
  tone: NewsletterBandData['tone']
  spacing: NewsletterBandData['spacing']
  form: Loaded['form']
  newsletterHref: string | null
  sourcePath?: string
}) {
  const headingId = useId()
  const light = tone === 'light'
  const pad = spacing === 'roomy' ? 'py-12 md:py-16' : 'py-9 md:py-14'

  return (
    <Section aria-labelledby={title ? headingId : undefined} tone={light ? 'light' : 'grey'} pad="none" divider={light ? 'bottom' : 'none'} className={pad}>
      <Container className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-8">
        <div>
          {title ? <AccentHeadline id={headingId} text={title} accent={accent} level={3} /> : null}
          {quiet ? <p className="mt-2 text-small text-gray-warm">{quiet}</p> : null}
        </div>
        {form ? (
          <CMSForm
            form={form}
            sourcePath={sourcePath}
            submitLabel={label}
            tone="light"
            submitVariant="dark"
            submitSize="md"
            turnstileAppearance="interaction-only"
            className="w-full md:w-auto"
            classNames={bandFormClassNames}
          />
        ) : (
          <ButtonLink link={{ type: 'custom', url: newsletterHref!, label }} variant="dark" size="md" className="self-start" />
        )}
      </Container>
    </Section>
  )
}
