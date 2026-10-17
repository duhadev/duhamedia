import Link from 'next/link'

// Phase 1 placeholder. The designed 404 (page 21, Error404 block) replaces it.
export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>
        <Link href="/">Go to the homepage</Link>
      </p>
    </main>
  )
}
