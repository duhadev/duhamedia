import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';

type Post = { id: string; title: string; content: string; created_at: string };

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

const md = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2
      className="text-2xl font-bold text-brand-ink mt-14 mb-5 pb-4 border-b border-neutral-100"
      style={{ letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="font-mono text-xs text-brand-magenta uppercase tracking-widest mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="text-base text-brand-ink/75 leading-relaxed mb-5">{children}</p>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-8 border-l-4 border-brand-gold bg-brand-cream/25 px-6 py-5 rounded-r-sm [&>p]:mb-0 [&>p]:font-mono [&>p]:text-sm [&>p]:text-brand-ink/65">
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-bold text-brand-ink">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href ?? '#'}
      className="inline-block mt-2 bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal pl-6 space-y-1 my-5 text-brand-ink/75">{children}</ol>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc pl-6 space-y-1 my-5 text-brand-ink/75">{children}</ul>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="text-base leading-relaxed">{children}</li>
  ),
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = (await sql`
    SELECT title FROM public.posts WHERE slug = ${slug} AND published = true
  `) as { title: string }[];
  return { title: rows[0]?.title ? `${rows[0].title} — Duha Media` : 'Post not found' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = (await sql`
    SELECT id, title, content, created_at
    FROM public.posts
    WHERE slug = ${slug} AND published = true
  `) as Post[];
  if (!rows.length) notFound();

  const post = rows[0];
  const mins = readingTime(post.content);

  return (
    <>
      <Header activePage="Insights" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-brand-ink px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Blog</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-3">
              <p className="font-mono text-xs text-white/35">
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <span className="text-white/20 font-mono text-xs">·</span>
              <p className="font-mono text-xs text-white/35">{mins} min read</p>
            </div>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-white px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <ReactMarkdown components={md}>{post.content}</ReactMarkdown>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
