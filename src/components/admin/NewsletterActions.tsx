'use client'

// Client component: newsletter admin actions on a form submission (A2), inside
// the read-only "Newsletter sync" group. Calls
// POST /api/form-submissions/:id/newsletter/:action (staff only) and refreshes.
// Rendered only for submissions that join the newsletter.
import { Button, toast, useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function NewsletterActions() {
  const { id } = useDocumentInfo()
  const optIn = useFormFields(([f]) => f['newsletter.optInStatus']?.value) as string | null | undefined
  const email = useFormFields(([f]) => f['newsletter.emailStatus']?.value) as string | null | undefined
  const sync = useFormFields(([f]) => f['newsletter.syncStatus']?.value) as string | null | undefined
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  if (!id || !optIn) return null

  const canResendEmail = optIn !== 'confirmed' && email !== 'pending'
  const canResync = optIn === 'confirmed' && (sync === 'failed' || sync === 'synced')

  const run = async (action: 'resend-confirmation' | 'resync') => {
    setBusy(action)
    try {
      const res = await fetch(`${serverURL}${api}/form-submissions/${id}/newsletter/${action}`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) {
        toast.success(body.message ?? 'Queued.')
        router.refresh()
      } else {
        toast.error(body.message ?? `Failed (HTTP ${res.status}).`)
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="field-type" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--base)', marginBottom: 'var(--base)' }}>
      <div>
        <Button buttonStyle="secondary" size="small" disabled={!canResendEmail || !!busy} onClick={() => run('resend-confirmation')}>
          {busy === 'resend-confirmation' ? 'Queuing…' : 'Re-send confirmation email'}
        </Button>
        <p className="field-description">Sends a new confirm link; the old one stops working.</p>
      </div>
      <div>
        <Button buttonStyle="secondary" size="small" disabled={!canResync || !!busy} onClick={() => run('resync')}>
          {busy === 'resync' ? 'Queuing…' : 'Re-run Resend sync'}
        </Button>
        <p className="field-description">Adds the contact to the newsletter segment and topic again. Safe to repeat.</p>
      </div>
    </div>
  )
}
