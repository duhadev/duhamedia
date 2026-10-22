'use client'

import Link from 'next/link'

/**
 * S3-4: the visitor-facing "something went wrong" message shared by
 * `src/app/(frontend)/error.tsx` and `src/app/global-error.tsx`.
 *
 * Placeholder until the error state is designed (real design later, with the
 * page-21 Error404 block family). Unstyled-but-clean on purpose: no brand
 * fonts or tokens, so it renders even when the site's CSS failed to load
 * (`global-error` replaces the root layout and gets no global styles, Next
 * 16.3.8 docs 03-file-conventions/error.md "Global Error").
 *
 * Never shows `error.message`: in production a Server Component error reaches
 * the client as a generic message plus `digest`, the hash that matches the
 * server-side log line (error.md "error.digest"); the digest is the only
 * detail shown, as a support reference. Client-side errors carry no digest.
 *
 * `retry` (next@16.3.8 client/components/error-boundary.js:43-47, passed at
 * :113-114) re-fetches and re-renders the failed segment.
 */
export function ErrorMessage({ digest, retry }: { digest?: string; retry: () => void }) {
  return (
    <main
      style={{
        maxWidth: '36rem',
        margin: '0 auto',
        padding: '4rem 1.25rem',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.75rem' }}>Something went wrong on our side.</h1>
      <p style={{ margin: '0 0 1.5rem' }}>
        This page didn&apos;t load. It&apos;s not something you did. Try again, or head back to the homepage.
      </p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '0 0 2rem' }}>
        <button
          type="button"
          onClick={() => retry()}
          style={{ minHeight: '44px', padding: '0 1.25rem', font: 'inherit', cursor: 'pointer' }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', padding: '0 0.25rem', color: 'inherit' }}
        >
          Go to the homepage
        </Link>
      </p>
      {digest ? (
        <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>
          If this keeps happening, contact us and mention this reference: <code>{digest}</code>
        </p>
      ) : null}
    </main>
  )
}
