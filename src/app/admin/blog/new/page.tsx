import { requireOwner } from '@/lib/auth/helpers';
import { createPost } from '../actions';
import PostEditor from '../PostEditor';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  await requireOwner();
  return (
    <>
      <h1 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.02em' }}>
        New post
      </h1>
      <PostEditor action={createPost} submitLabel="Create post" />
    </>
  );
}
