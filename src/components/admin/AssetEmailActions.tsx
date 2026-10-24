'use client'

// Client component: "Re-send asset email" on a lead-magnet form submission (A3),
// inside the read-only "Asset email" group. Calls
// POST /api/form-submissions/:id/asset-email/resend (staff only) and refreshes.
// Rendered only for submissions that requested a lead magnet.
import { Button, toast, useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AssetEmailActions() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([f]) => f['assetEmail.status']?.value) as string | null | undefined
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  if (!id || !status) return null

  const run = async () => {
    setBusy(true)
    try {
      const res = await fetch(`${serverURL}${api}/form-submissions/${id}/asset-email/resend`, {
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
      setBusy(false)
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <Button buttonStyle="secondary" size="small" disabled={status === 'pending' || busy} onClick={run}>
        {busy ? 'Queuing…' : 'Re-send asset email'}
      </Button>
      <p className="field-description">Emails the file or link to this person again (a new email).</p>
    </div>
  )
}
