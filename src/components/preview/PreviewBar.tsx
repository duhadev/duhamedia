'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

/**
 * Draft-preview island (F57 A + F58). Mounted by <PreviewMode> ONLY for a
 * verified staff preview request, so public visitors never receive it (not
 * even hidden). Client component because both parts need the browser:
 *
 * - `RefreshRouteOnSave` (official `@payloadcms/live-preview-react@3.91.0`,
 *   packages/live-preview-react/src/RefreshRouteOnSave.tsx at v3.91.0; the
 *   website template's LivePreviewListener pattern): posts the `ready` message
 *   to the admin's Live Preview pane and calls `router.refresh()` on every
 *   `payload-document-event` the admin sends after Save draft / Publish. The
 *   blocks are server components, so the refresh re-renders the latest saved
 *   draft on the server; unsaved keystrokes are not shown (F57: autosave off).
 *   `serverURL` = server-side SITE_URL and `exitRoute` (props, so no server
 *   module or env read ends up in the client bundle; no NEXT_PUBLIC_*): the message
 *   origin must match it exactly.
 * - The "Previewing draft · Exit" banner: fixed bottom-right (clear of the dev-only Next indicator), ink with a cream hairline so it reads on the ink footer too;
 *   tokens, Exit is a plain link (a route handler, not a page) back to this
 *   path via /_preview/exit, 44px target. Placed after the page in the DOM, so
 *   the skip link stays the first focusable element.
 */
export function PreviewBar({ serverURL, exitRoute }: { serverURL: string; exitRoute: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const exitHref = `${exitRoute}?${new URLSearchParams({ path: pathname || '/' }).toString()}`

  return (
    <>
      <RefreshRouteOnSave refresh={router.refresh} serverURL={serverURL} />
      <div
        role="region"
        aria-label="Draft preview"
        data-tone="dark"
        data-preview-bar=""
        className="fixed right-3 bottom-3 z-[100] flex min-h-target items-center gap-2 border border-cream/40 bg-ink pl-4 text-small font-bold text-cream"
      >
        <span>Previewing draft</span>
        <span aria-hidden="true">·</span>
        <a
          href={exitHref}
          className="inline-flex min-h-target min-w-target items-center justify-center px-3 underline underline-offset-4"
        >
          Exit
        </a>
      </div>
    </>
  )
}
