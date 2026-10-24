import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { Error404View, type Error404Data } from '@/blocks/Error404/Component'
import { PageShell } from '@/components/chrome'
import { confirmNewsletterSignup, type ConfirmResult } from '@/integrations/newsletter/confirm'

/**
 * Newsletter double opt-in landing (A2): `/newsletter/confirm?token=…`, the
 * link in the confirmation email. Rendering it performs the confirmation
 * (src/integrations/newsletter/confirm.ts); the Resend sync and the
 * `newsletter` event run later in jobs, so this page never waits on them.
 *
 * - A static segment, so Next resolves it before `newsletter/[slug]`: a
 *   newsletter issue (posts) with the slug `confirm` would be shadowed
 *   (flagged: reserve the slug).
 * - Reuses the Error404 block's view (no numeral) inside the standard chrome as
 *   a minimal branded state; a designed state is flagged for the PM.
 * - noindex; force-dynamic via the (frontend) layout.
 * - `cron: true`: like /api/form-submit, a confirm click also starts the
 *   in-process job crons if nothing else has yet.
 */
export const metadata: Metadata = {
  title: 'Newsletter confirmation',
  robots: { index: false, follow: false },
}

const link = (url: string, label: string) => ({ link: { type: 'custom' as const, url, label, newTab: false } })

const STATES: Record<ConfirmResult, Error404Data> = {
  confirmed: {
    heading: "You're on the list.",
    body: 'Subscription confirmed. The next issue lands in your inbox.',
    links: [link('/work', 'See the Work'), link('/', 'Home')],
  },
  already: {
    heading: 'Already confirmed.',
    body: 'This address is on the list. Nothing else to do.',
    links: [link('/work', 'See the Work'), link('/', 'Home')],
  },
  expired: {
    heading: 'This link has expired.',
    body: "Confirm links last 72 hours and only the newest one works. Sign up again and we'll send a fresh one.",
    links: [link('/newsletter', 'Sign up again'), link('/', 'Home')],
  },
  invalid: {
    heading: "This link doesn't work.",
    body: 'It may be incomplete or mistyped. Sign up again to get a new one.',
    links: [link('/newsletter', 'Sign up again'), link('/', 'Home')],
  },
  error: {
    heading: 'Something went wrong on our side.',
    body: 'Nothing was changed. Try the link again in a minute.',
    links: [link('/', 'Home')],
  },
}

type Props = { searchParams: Promise<{ token?: string | string[] }> }

export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams
  const payload = await getPayload({ config, cron: true })
  const result = await confirmNewsletterSignup(payload, typeof token === 'string' ? token : undefined)
  return (
    <PageShell>
      <main data-newsletter-confirm={result}>
        <Error404View code="" {...STATES[result]} />
      </main>
    </PageShell>
  )
}
