import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import { markRead, markUnread } from './actions';

export const dynamic = 'force-dynamic';

type Submission = {
  id: string;
  name: string | null;
  email: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
};

export default async function InboxPage() {
  await requireOwner();
  const rows = (await sql`
    SELECT id, name, email, message, read, created_at
    FROM public.form_submissions
    ORDER BY created_at DESC
  `) as Submission[];

  const unread = rows.filter((r) => !r.read).length;

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: '-0.02em' }}>
          Inbox
        </h1>
        {unread > 0 && (
          <span className="bg-brand-magenta text-white font-mono text-xs rounded-sm px-2 py-0.5">
            {unread} unread
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-brand-ink/40 text-sm">No submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`bg-white border rounded-sm px-5 py-4 ${
                row.read ? 'border-neutral-200' : 'border-brand-magenta/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-brand-ink text-sm">{row.name ?? '(no name)'}</p>
                    {!row.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-magenta shrink-0" aria-label="Unread" />
                    )}
                  </div>
                  <p className="font-mono text-xs text-brand-ink/40">
                    {row.email ?? '—'} &middot;{' '}
                    {new Date(row.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  {row.message && (
                    <p className="text-sm text-brand-ink/70 mt-3 whitespace-pre-wrap">{row.message}</p>
                  )}
                </div>
                <form
                  action={async () => {
                    'use server';
                    if (row.read) await markUnread(row.id);
                    else await markRead(row.id);
                  }}
                >
                  <button
                    type="submit"
                    className="font-mono text-xs text-brand-crimson underline uppercase tracking-wider shrink-0 min-h-[44px] px-2"
                  >
                    {row.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
