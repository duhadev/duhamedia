import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DualCTA from "@/components/sections/DualCTA";
import NewsletterFloat from "@/components/ui/NewsletterFloat";
import CaseStudiesComingSoon from "@/components/ui/CaseStudiesComingSoon";
import PageHero from "@/components/sections/PageHero";
import { sql } from "@/lib/db";
import Link from "next/link";

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

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = (await sql`
    SELECT slug, title, excerpt, content, created_at
    FROM public.posts
    WHERE published = true
    ORDER BY created_at DESC
  `) as Post[];

  return (
    <>
      <Header activePage="Insights" />
      <NewsletterFloat copy="CRO tips and teardowns straight to your inbox. One per month." />
      <main id="main-content">
        <PageHero
          label="Blog"
          heading="CRO thinking, written plainly."
          subhead="Concepts, frameworks, and Shopify-specific guidance. Written for people running or commissioning optimisation work."
        />

        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <CaseStudiesComingSoon
                heading="Posts in progress."
                description="Articles on CRO, A/B testing, and Shopify-specific guidance will be published here. Enter your email to be notified when the first post goes live."
                confirmationText="We'll let you know when the first post is published."
                ariaLabel="Notify me when blog posts are published"
                id="blog"
              />
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post) => {
                  const preview = post.excerpt || autoExcerpt(post.content);
                  return (
                    <Link
                      key={post.slug}
                      href={`/insights/blog/${post.slug}`}
                      className="group border-b border-neutral-100 pb-6 last:border-none last:pb-0"
                    >
                      <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">
                        {new Date(post.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <h2 className="text-xl font-bold text-brand-ink group-hover:text-brand-magenta transition-colors leading-snug mb-1.5">
                        {post.title}
                      </h2>
                      {preview && (
                        <p className="text-sm text-brand-ink/55 leading-relaxed line-clamp-2">{preview}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <DualCTA heading="Ready to stop guessing and start optimising?" />
      </main>
      <Footer />
    </>
  );
}
