'use client'

// Client component: a text field that ALSO validates in the browser.
// Payload strips custom `validate` functions from the client config, so a field with a
// server-only validator never gets an inline error in the admin form state (the toast and
// the server list it, the input stays plain). Passing `validate` to <TextField> registers
// it with useField, so the error shows inline on Publish and re-asserts after autosave merges.
import { TextField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { useCallback } from 'react'

import { accentPhraseError } from '../../lib/accentPhrase'

type Props = TextFieldClientProps & { headingField: string }

export function AccentPhraseField({ headingField, ...props }: Props) {
  const validate = useCallback(
    (value: string | null | undefined, options: { siblingData?: unknown }) =>
      accentPhraseError(value, (options.siblingData as Record<string, unknown> | undefined)?.[headingField]),
    [headingField],
  )
  return <TextField {...props} validate={validate as never} />
}
