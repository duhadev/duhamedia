'use server';
import { sql } from '@/lib/db';
import { requireOwner } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  const existing = (await sql`
    SELECT slug FROM public.posts WHERE slug LIKE ${base + '%'} ORDER BY slug
  `) as { slug: string }[];
  if (!existing.find((r) => r.slug === base)) return base;
  let n = 2;
  while (existing.find((r) => r.slug === `${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function createPost(formData: FormData) {
  await requireOwner();
  const title = (formData.get('title') as string).trim();
  const content = (formData.get('content') as string).trim();
  const published = formData.get('published') === 'true';
  const excerptRaw = (formData.get('excerpt') as string | null)?.trim() ?? '';
  const excerpt = excerptRaw || null;
  const slug = await uniqueSlug(slugify(title));

  const rows = await sql`
    INSERT INTO public.posts (slug, title, content, excerpt, published)
    VALUES (${slug}, ${title}, ${content}, ${excerpt}, ${published})
    RETURNING id
  `;
  redirect(`/admin/blog/${rows[0].id}`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireOwner();
  const title = (formData.get('title') as string).trim();
  const content = (formData.get('content') as string).trim();
  const published = formData.get('published') === 'true';
  const excerptRaw = (formData.get('excerpt') as string | null)?.trim() ?? '';
  const excerpt = excerptRaw || null;

  await sql`
    UPDATE public.posts
    SET title = ${title}, content = ${content}, excerpt = ${excerpt}, published = ${published}, updated_at = now()
    WHERE id = ${id}
  `;
  redirect('/admin/blog');
}

export async function deletePost(id: string) {
  await requireOwner();
  await sql`DELETE FROM public.posts WHERE id = ${id}`;
  redirect('/admin/blog');
}
