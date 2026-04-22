import Link from 'next/link';
import { sql } from '@/lib/db';
import CaseStudiesComingSoon from '@/components/ui/CaseStudiesComingSoon';

type Post = { slug: string; title: string; excerpt: string | null; content: string; created_at: string };

function autoExcerpt(content: string): string {
  const stripped = content
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > 160 ? stripped.slice(0, 157) + '…' : stripped;
}

export default async function BlogPreviews() {
  const posts = (await sql`
    SELECT slug, title, excerpt, content, created_at
    FROM public.posts
    WHERE published = true
    ORDER BY created_at DESC
    LIMIT 3
  `) as Post[];

  if (posts.length === 0) {
    return (
      <CaseStudiesComingSoon
        heading="Posts in progress."
        description="Articles on CRO, A/B testing, and Shopify-specific guidance will be published here. Enter your email to be notified when the first post goes live."
        confirmationText="We'll let you know when the first post is published."
        ariaLabel="Notify me when blog posts are published"
        id="insights-blog"
        source="notify-blog"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => {
        const preview = post.excerpt || autoExcerpt(post.content);
        return (
          <Link
            key={post.slug}
            href={`/insights/blog/${post.slug}`}
            className="group border border-neutral-200 bg-white rounded-sm px-6 py-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">
              {new Date(post.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h3 className="text-lg font-bold text-brand-ink group-hover:text-brand-magenta transition-colors leading-snug mb-2">
              {post.title}
            </h3>
            {preview && (
              <p className="text-sm text-brand-ink/60 leading-relaxed line-clamp-2">{preview}</p>
            )}
            <p className="font-mono text-xs text-brand-crimson underline underline-offset-2 mt-3">
              Read →
            </p>
          </Link>
        );
      })}
    </div>
  );
}
