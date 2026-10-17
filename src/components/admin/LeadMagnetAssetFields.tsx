'use client'

// Client components: the lead-magnet asset fields ALSO validate in the browser.
// Payload strips custom `validate` functions from the client config, so a server-only
// error on a custom-validated field can be lost when autosave merges form state (same
// reason as AccentPhraseField). Passing `validate` to <UploadField>/<TextField> registers
// it with useField (@payloadcms/ui@3.91.0 fields/Upload, fields/Text), so the
// "file or link, exactly one" error shows inline after a failed Publish. Errors only
// display once the form has been submitted (useField `showError`), never while drafting.
import { TextField, UploadField } from '@payloadcms/ui'
import type { TextFieldClientProps, UploadFieldClientProps } from 'payload'
import { useCallback } from 'react'

import { assetFileError, assetUrlError } from '../../lib/leadMagnetAsset'

type Opts = { siblingData?: unknown }

export function LeadMagnetAssetFileField(props: UploadFieldClientProps) {
  const validate = useCallback((value: unknown, options: Opts) => assetFileError(value, options.siblingData), [])
  return <UploadField {...props} validate={validate as never} />
}

export function LeadMagnetAssetUrlField(props: TextFieldClientProps) {
  const validate = useCallback((value: unknown, options: Opts) => assetUrlError(value, options.siblingData), [])
  return <TextField {...props} validate={validate as never} />
}
