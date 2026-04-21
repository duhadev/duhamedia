import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import Link from 'next/link';
import { deletePost } from './actions';

export const dynamic = 'force-dynamic';

type Post = { id: string; slug: string; title: string; published: boolean; created_at: string };

export default async function AdminBlogPage() {
  await requireOwner();
  const posts = (await sql`
    SELECT id, slug, title, published, created_at
    FROM public.posts
    ORDER BY created_at DESC
  `) as Post[];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-ink" style={{ letterSpacing: '-0.02em' }}>
          Blog posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5 min-h-[44px] flex items-center hover:bg-brand-crimson transition-colors"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-brand-ink/40 text-sm">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-neutral-200 rounded-sm px-5 py-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-ink truncate">{post.title}</p>
                <p className="font-mono text-xs text-brand-ink/40 mt-0.5">
                  /{post.slug} &middot;{' '}
                  {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                  post.published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-neutral-100 text-brand-ink/40'
                }`}
              >
                {post.published ? 'Published' : 'Draft'}
              </span>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="font-mono text-xs text-brand-crimson underline uppercase tracking-wider"
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await deletePost(post.id);
                  }}
                >
                  <button
                    type="submit"
                    className="font-mono text-xs text-brand-ink/30 underline uppercase tracking-wider hover:text-brand-crimson transition-colors"
                  >
                    Delete
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
