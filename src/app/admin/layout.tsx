import { requireOwner } from '@/lib/auth/helpers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/inbox', label: 'Inbox' },
  { href: '/admin/clients', label: 'Clients' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireOwner();

  return (
    <div className="min-h-screen bg-brand-offwhite">
      <header className="bg-brand-ink text-white px-6 py-3 flex items-center gap-8">
        <span className="font-mono text-xs tracking-widest uppercase text-white/40">
          Admin
        </span>
        <nav className="flex gap-6" aria-label="Admin navigation">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <Link
            href="/"
            className="font-mono text-xs text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
          >
            ← Site
          </Link>
        </div>
      </header>
      <main className="px-6 py-10 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
