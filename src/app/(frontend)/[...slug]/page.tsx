import { notFound } from 'next/navigation'

// Phase 1 placeholder: routes every unknown URL to (frontend)/not-found.tsx.
// Replaced by the `pages` collection router in Phase 3/4.
export default function CatchAll() {
  notFound()
}
