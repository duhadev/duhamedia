'use client'

// Client component: the "Re-send" action on a form submission (sidebar ui field).
// Calls POST /api/form-submissions/:id/resend (staff only, same eventId) and
// reloads the document so the new status shows. Enabled for failed/delivered only.
import { Button, toast, useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ResendDeliveryButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.deliveryStatus?.value) as string | null | undefined
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  if (!id || !status) return null

  const canResend = status === 'failed' || status === 'delivered'

  const onClick = async () => {
    setBusy(true)
    try {
      const res = await fetch(`${serverURL}${api}/form-submissions/${id}/resend`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) {
        toast.success(body.message ?? 'Re-send queued.')
        router.refresh()
      } else {
        toast.error(body.message ?? `Re-send failed (HTTP ${res.status}).`)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <Button buttonStyle="secondary" size="small" disabled={!canResend || busy} onClick={onClick}>
        {busy ? 'Queuing…' : 'Re-send to secretary'}
      </Button>
      <p className="field-description">
        {canResend
          ? 'Sends this submission again with the same event ID; the secretary ignores repeats.'
          : 'Queued: wait for the current attempt to finish.'}
      </p>
    </div>
  )
}
