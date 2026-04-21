import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import Link from 'next/link';
import { inviteClient } from './actions';

export const dynamic = 'force-dynamic';

type Client = { id: string; name: string; email: string; shop_domain: string | null; created_at: string };

export default async function ClientsPage() {
  await requireOwner();
  const clients = (await sql`
    SELECT id, name, email, shop_domain, created_at
    FROM public.clients
    ORDER BY created_at DESC
  `) as Client[];

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        Clients
      </h1>

      <section className="bg-white border border-neutral-200 rounded-sm p-6 mb-8">
        <h2 className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">
          Invite a client
        </h2>
        <form action={inviteClient} className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
          <div className="flex-1">
            <label htmlFor="name" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-neutral-200 rounded-sm px-4 py-2.5 text-sm text-brand-ink bg-white focus:outline-none focus:border-brand-magenta min-h-[44px]"
              placeholder="Acme Store"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="email" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-neutral-200 rounded-sm px-4 py-2.5 text-sm text-brand-ink bg-white focus:outline-none focus:border-brand-magenta min-h-[44px]"
              placeholder="client@example.com"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="shopDomain" className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest block mb-1">
              Shop domain
            </label>
            <input
              id="shopDomain"
              name="shopDomain"
              type="text"
              className="w-full border border-neutral-200 rounded-sm px-4 py-2.5 text-sm text-brand-ink bg-white focus:outline-none focus:border-brand-magenta min-h-[44px]"
              placeholder="mystore.myshopify.com"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] hover:bg-brand-crimson transition-colors shrink-0"
          >
            Add &amp; invite
          </button>
        </form>
      </section>

      {clients.length === 0 ? (
        <p className="text-brand-ink/40 text-sm">No clients yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="bg-white border border-neutral-200 rounded-sm px-5 py-4 flex items-center gap-4 hover:border-brand-magenta transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-ink group-hover:text-brand-magenta transition-colors">
                  {client.name}
                </p>
                <p className="font-mono text-xs text-brand-ink/40 mt-0.5">
                  {client.email}
                  {client.shop_domain && ` · ${client.shop_domain}`}
                </p>
              </div>
              <span className="font-mono text-xs text-brand-ink/30 uppercase tracking-widest">
                {new Date(client.created_at).toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
