'use client' // Error boundaries must be Client Components (next@16.3.8 docs 03-file-conventions/error.md).

import { ErrorMessage } from '@/components/errors/ErrorMessage'

/**
 * S3-4: last-resort boundary when a ROOT layout fails. Next 16.3.8 resolves
 * `global-error` once, at the app directory root (`src/app/global-error`),
 * and uses it for every root layout, i.e. both `(frontend)` and `(payload)`
 * (build/webpack/loaders/next-app-loader/index.js:237-257). It replaces the
 * root layout, so it renders its own <html>/<body>, gets no global CSS, and
 * cannot export `metadata` (React <title> instead; error.md "Global Error").
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <title>Something went wrong | Duha Media</title>
        <meta name="robots" content="noindex" />
        <ErrorMessage digest={error.digest} retry={retry} />
      </body>
    </html>
  )
}
