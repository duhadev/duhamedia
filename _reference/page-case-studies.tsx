/**
 * DUHA MEDIA — Case Studies Index
 * Route: /results/case-studies
 * Stack: Next.js + Tailwind
 * See _brand.txt for full design tokens
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size}>
      <defs><clipPath id="lm"><circle cx="50" cy="50" r="45" /></clipPath></defs>
      <g clipPath="url(#lm)">
        <rect x="5" y="73" width="90" height="22" fill="#c20e59" />
        <rect x="5" y="49" width="90" height="21" fill="#e82561" />
        <rect x="5" y="26" width="90" height="20" fill="#f5c842" />
        <rect x="5" y="3"  width="90" height="20" fill="#fce588" />
      </g>
    </svg>
  )
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/10 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <LogoMark size={24} />
        <span className="font-bold text-brand-ink text-sm">duha media</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {['Services', 'How it works', 'Results', 'Insights', 'About'].map(item => (
          <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`}
            className={`text-xs transition-colors ${item === 'Results' ? 'text-brand-crimson border-b border-brand-crimson' : 'text-brand-ink/60 hover:text-brand-ink'}`}>
            {item}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/free-audit" className="font-mono text-xs text-brand-crimson underline underline-offset-2">Free audit</Link>
        <Link href="/contact" className="bg-brand-crimson text-white text-xs font-bold px-3 py-2 rounded-sm hover:bg-brand-magenta transition-colors">Book a call</Link>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="bg-brand-ink px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Case studies</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          Every engagement. Every result. Documented.
        </h1>
        <p className="text-sm text-white/55 leading-relaxed">
          Filtered by tier or industry. Each result tied to a specific test, a specific change, and a specific outcome.
        </p>
      </div>
    </section>
  )
}

// Case study data — replace with real data / CMS when available
const ALL_STUDIES = [
  {
    slug: 'apparel-landing-page',
    metric: '+XX%',
    metricLabel: 'CVR lift',
    tier: 'Class B',
    industry: 'Apparel',
    revenueContext: '$800K revenue',
    named: false,
    title: 'Landing page redesign + checkout optimisation',
    desc: 'CTA repositioned above fold. Checkout form reduced from 9 fields to 5. A/B tested over 3,200 sessions.',
  },
  {
    slug: 'supplements-form',
    metric: '−XX%',
    metricLabel: 'Form abandonment',
    tier: 'Class B',
    industry: 'Supplements',
    revenueContext: null,
    named: true,
    title: 'Form field reduction and progress indicator test',
    desc: 'Clarity revealed 58% of users abandoned at the billing step. Form restructured and progress bar added.',
  },
  {
    slug: 'beauty-foundation',
    metric: '+XX%',
    metricLabel: 'Mobile CVR',
    tier: 'Class C',
    industry: 'Beauty',
    revenueContext: '$450K revenue',
    named: false,
    title: 'Full site foundation — conversion-informed build',
    desc: 'Site rebuilt with CRO architecture from day one. Clarity and GA4 installed at launch. Baseline established for future Class B.',
  },
  {
    slug: 'outdoor-class-a',
    metric: '+XX%',
    metricLabel: 'CVR · 90 days',
    tier: 'Class A',
    industry: 'Outdoor',
    revenueContext: '$1.4M revenue',
    named: false,
    title: '12-week intensive — full system build + campaign attribution',
    desc: 'Marketing audit, UTM taxonomy rebuild, CRO overhaul, and campaign playbook. All channels connected to on-site CVR data.',
  },
]

const TIERS = ['All', 'Class C', 'Class B', 'Class A']
const INDUSTRIES = ['All industries', 'Apparel', 'Supplements', 'Beauty', 'Outdoor']

function CaseStudiesList() {
  const [activeTier, setActiveTier] = useState('All')
  const [activeIndustry, setActiveIndustry] = useState('All industries')

  const filtered = ALL_STUDIES.filter(s => {
    const tierMatch = activeTier === 'All' || s.tier === activeTier
    const industryMatch = activeIndustry === 'All industries' || s.industry === activeIndustry
    return tierMatch && industryMatch
  })

  return (
    <section className="bg-white">
      {/* Filter bar */}
      <div className="sticky top-[57px] z-40 bg-white border-b border-black/10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Filter by</p>
          <div className="flex gap-2 flex-wrap mb-2">
            {TIERS.map(t => (
              <button key={t} onClick={() => setActiveTier(t)}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  activeTier === t ? 'bg-brand-ink text-white border-brand-ink' : 'border-black/15 text-brand-ink/60 hover:border-black/30'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {INDUSTRIES.map(i => (
              <button key={i} onClick={() => setActiveIndustry(i)}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  activeIndustry === i ? 'bg-brand-ink text-white border-brand-ink' : 'border-black/15 text-brand-ink/60 hover:border-black/30'}`}>
                {i}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-brand-ink/40 mt-3">Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="divide-y divide-black/10">
          {filtered.map(s => (
            <div key={s.slug} className="flex gap-5 py-8">
              <div className="min-w-[56px] text-center flex-shrink-0">
                <p className="font-mono text-xl font-bold text-brand-crimson leading-none">{s.metric}</p>
                <p className="font-mono text-xs text-brand-ink/40 uppercase mt-1 leading-tight">{s.metricLabel}</p>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-sm border ${
                    s.tier === 'Class B' ? 'border-brand-crimson text-brand-crimson' : 'border-black/15 text-brand-ink/60'}`}>
                    {s.tier}
                  </span>
                  <span className="font-mono text-xs bg-black/5 border border-black/10 rounded-sm px-2 py-0.5 text-brand-ink/60">
                    {s.industry}
                  </span>
                  {s.named && (
                    <span className="font-mono text-xs bg-brand-gold/15 border border-brand-gold/30 rounded-sm px-2 py-0.5 text-brand-ink/60">
                      Named client
                    </span>
                  )}
                  {s.revenueContext && (
                    <span className="font-mono text-xs text-brand-ink/40">{s.revenueContext}</span>
                  )}
                </div>
                <p className="font-bold text-brand-ink text-sm mb-1.5 leading-snug">{s.title}</p>
                <p className="text-xs text-brand-ink/60 leading-relaxed mb-3">{s.desc}</p>
                <Link href={`/results/case-studies/${s.slug}`}
                  className="font-mono text-xs text-brand-crimson underline underline-offset-2">
                  Read full case study →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder note */}
        <div className="border border-dashed border-black/15 rounded-sm p-6 text-center mt-4 mb-8">
          <p className="font-mono text-xs text-brand-ink/40 leading-relaxed">
            More results added as engagements complete.<br />
            Each case study is published only after the client result is verified and documented.
          </p>
        </div>
      </div>
    </section>
  )
}

function DualCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug" style={{ letterSpacing: '-0.01em' }}>
          Your site could be next.
        </h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/free-audit" className="bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors">
            Show us your site. We'll find the leak.
          </Link>
          <Link href="/contact" className="border border-white/30 text-white text-sm px-6 py-3 rounded-sm hover:border-white/60 transition-colors">Book a call</Link>
        </div>
        <p className="font-mono text-xs text-white/30 mt-4">No pitch. No pricing. Just the finding.</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-ink border-t border-white/10 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3"><LogoMark size={20} /><span className="font-bold text-white text-sm">duha media</span></div>
            <p className="text-xs text-white/40 leading-relaxed">Web design, development & CRO for Shopify brands.</p>
          </div>
          <div>
            <p className="font-bold text-white text-xs mb-3">Navigation</p>
            {['Services', 'How it works', 'Results', 'Insights', 'About'].map(item => (
              <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="block text-xs text-white/40 hover:text-white/70 mb-1.5">{item}</Link>
            ))}
          </div>
          <div>
            <p className="font-bold text-white text-xs mb-3">Legal</p>
            <Link href="/privacy" className="block text-xs text-white/40 hover:text-white/70 mb-1.5">Privacy policy</Link>
            <Link href="/terms" className="block text-xs text-white/40 hover:text-white/70">Terms of service</Link>
          </div>
          <div className="bg-brand-cream/10 border border-brand-cream/20 rounded-sm p-4">
            <p className="text-xs text-white/60 leading-relaxed mb-3">CRO tips and teardowns — straight to your inbox.</p>
            <Link href="/insights" className="font-mono text-xs text-brand-gold underline underline-offset-2">Subscribe →</Link>
          </div>
        </div>
        <p className="font-mono text-xs text-white/20 border-t border-white/10 pt-6">© Duha Media · duhamedia.com</p>
      </div>
    </footer>
  )
}

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CaseStudiesList />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
