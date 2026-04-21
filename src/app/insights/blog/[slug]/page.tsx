import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReactMarkdown from 'react-markdown';

type Post = { id: string; title: string; content: string; created_at: string };

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

  return (
    <>
      <Header activePage="Insights" />
      <main id="main-content">
        <section className="bg-brand-ink px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Blog</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
              style={{ letterSpacing: '-0.02em' }}
            >
              {post.title}
            </h1>
            <p className="font-mono text-xs text-white/35">
              {new Date(post.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="max-w-2xl mx-auto prose prose-base prose-headings:font-bold prose-headings:text-brand-ink prose-p:text-brand-ink/80 prose-p:leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
