import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [posts, unread, clients, experiments] = await Promise.all([
    sql`SELECT COUNT(*) AS n FROM public.posts`,
    sql`SELECT COUNT(*) AS n FROM public.form_submissions WHERE read = false`,
    sql`SELECT COUNT(*) AS n FROM public.clients`,
    sql`SELECT COUNT(*) AS n FROM public.experiments WHERE status = 'running'`,
  ]);
  return {
    posts: Number(posts[0].n),
    unread: Number(unread[0].n),
    clients: Number(clients[0].n),
    running: Number(experiments[0].n),
  };
}

const STATS_CONFIG = [
  { key: 'posts' as const, label: 'Blog posts', href: '/admin/blog' },
  { key: 'unread' as const, label: 'Unread messages', href: '/admin/inbox' },
  { key: 'clients' as const, label: 'Active clients', href: '/admin/clients' },
  { key: 'running' as const, label: 'Running experiments', href: '/admin/clients' },
];

export default async function AdminPage() {
  await requireOwner();
  const stats = await getStats();

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        Overview
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS_CONFIG.map(({ key, label, href }) => (
          <Link
            key={key}
            href={href}
            className="bg-white border border-neutral-200 rounded-sm p-5 hover:border-brand-magenta transition-colors group"
          >
            <p className="text-3xl font-bold text-brand-ink group-hover:text-brand-magenta transition-colors">
              {stats[key]}
            </p>
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mt-1">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickLink href="/admin/blog/new" label="New blog post" />
        <QuickLink href="/admin/inbox" label="View inbox" />
        <QuickLink href="/admin/clients" label="Manage clients" />
      </div>
    </>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-3 flex items-center justify-center min-h-[44px] hover:bg-brand-crimson transition-colors"
    >
      {label}
    </Link>
  );
}
