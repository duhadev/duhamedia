import { requireOwner } from '@/lib/auth/helpers';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { updatePost } from '../actions';
import PostEditor from '../PostEditor';

export const dynamic = 'force-dynamic';

type Post = { id: string; title: string; content: string; excerpt: string | null; published: boolean };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;

  const rows = (await sql`
    SELECT id, title, content, excerpt, published FROM public.posts WHERE id = ${id}
  `) as Post[];
  if (!rows.length) notFound();

  const post = rows[0];
  const action = updatePost.bind(null, id);

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        Edit post
      </h1>
      <PostEditor
        action={action}
        defaultTitle={post.title}
        defaultContent={post.content}
        defaultExcerpt={post.excerpt ?? ''}
        defaultPublished={post.published}
        submitLabel="Save changes"
      />
    </>
  );
}
