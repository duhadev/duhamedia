import { requireClient } from '@/lib/auth/helpers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/experiments', label: 'Experiments' },
  { href: '/dashboard/reports', label: 'Reports' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClient();

  return (
    <div className="min-h-screen bg-brand-offwhite">
      <header className="bg-brand-ink text-white px-6 py-3 flex items-center gap-8">
        <span className="font-mono text-xs tracking-widest uppercase text-white/40">
          Dashboard
        </span>
        <nav className="flex gap-6" aria-label="Dashboard navigation">
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
        <div className="ml-auto flex items-center gap-4">
          <span className="font-mono text-xs text-white/30">{user.email}</span>
        </div>
      </header>
      <main className="px-6 py-10 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
