'use client' // Error boundaries must be Client Components (next@16.3.8 docs 03-file-conventions/error.md).

import { ErrorMessage } from '@/components/errors/ErrorMessage'

/**
 * S3-4: error boundary for every public page. Wraps the `(frontend)` pages
 * and nested layouts but NOT `(frontend)/layout.tsx` itself (error.md
 * "component hierarchy"); a failure in that layout falls through to
 * `src/app/global-error.tsx`. Renders inside the frontend layout's
 * <html>/<body>. Server-side reporting of the underlying error is the
 * site_error integration unit (not here).
 */
export default function FrontendError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return <ErrorMessage digest={error.digest} retry={retry} />
}
