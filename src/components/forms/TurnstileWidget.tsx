'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import React from 'react'

import { TURNSTILE_RESPONSE_KEY } from '@/integrations/forms/shared'

/**
 * Cloudflare Turnstile widget (DECISIONS §L, Gate 0 Q4: `@marsidev/react-turnstile@1.6.2`).
 *
 * Client component because Cloudflare's script renders into the DOM.
 * `siteKey` is a PROP read on the server from `TURNSTILE_SITE_KEY` at runtime
 * (no NEXT_PUBLIC_*). The library injects Cloudflare's script itself (no CSP
 * is configured on this site, so nothing to allow-list) and adds the hidden
 * `cf-turnstile-response` input inside the enclosing <form>, which the server
 * action reads. Expiry and timeout refresh automatically (`refreshExpired` /
 * `refreshTimeout: 'auto'`); tokens are single-use, so the form calls
 * `reset()` after every submission attempt.
 *
 * `size: 'flexible'` = full width (min 300px) so it fits a 390px viewport.
 */
export type TurnstileWidgetProps = {
  siteKey: string
  /** Fires with a fresh token, and with `null` when it expires or errors. */
  onTokenChange?: (token: string | null) => void
  theme?: 'auto' | 'light' | 'dark'
  className?: string
}

export const TurnstileWidget = React.forwardRef<TurnstileInstance | undefined, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onTokenChange, theme = 'light', className }, ref) {
    return (
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        className={className}
        options={{
          theme,
          size: 'flexible',
          language: 'en',
          responseFieldName: TURNSTILE_RESPONSE_KEY,
          refreshExpired: 'auto',
          refreshTimeout: 'auto',
        }}
        onSuccess={(token) => onTokenChange?.(token)}
        onExpire={() => onTokenChange?.(null)}
        onError={() => onTokenChange?.(null)}
      />
    )
  },
)
