/**
 * DUHA MEDIA — Services Overview
 * Route: /services
 * Stack: Next.js + Tailwind
 * See _brand.txt for full design tokens
 */

import Link from 'next/link'

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

function Nav({ active }: { active?: string }) {
  const links = ['Services', 'How it works', 'Results', 'Insights', 'About']
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/10 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <LogoMark size={24} />
        <span className="font-bold text-brand-ink text-sm">duha media</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {links.map(item => (
          <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`}
            className={`text-xs transition-colors ${item === active
              ? 'text-brand-crimson border-b border-brand-crimson'
              : 'text-brand-ink/60 hover:text-brand-ink'}`}>
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Services</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          Three ways to work together.
        </h1>
        <p className="text-sm text-white/55 leading-relaxed max-w-xl">
          Every engagement is scoped to where you are. Class C builds the foundation.
          Class B optimizes it. Class A connects your entire growth system.
        </p>
      </div>
    </section>
  )
}

function TierBlocks() {
  const tiers = [
    {
      super: 'Foundation',
      name: 'Class C',
      tagline: '"The minimum a self-respecting company needs for online success."',
      who: 'Shopify brands that lack a properly designed website — or have one that doesn\'t reflect the quality of their product.',
      meta: 'One-time · ~3 months',
      includes: ['Conversion-informed UI design', 'Engineered UX', 'CMS + CRM integration', 'Content creation', 'Clarity + GA4 at launch'],
      href: '/services/class-c',
      featured: false,
    },
    {
      super: 'CRO Core',
      name: 'Class B',
      tagline: '"Data-driven CRO — turning your existing traffic into measurable revenue."',
      who: 'Shopify stores with 500+ monthly sessions running or planning paid social ads.',
      meta: 'Setup fee + $1,500/mo retainer',
      includes: ['Full CRO audit', 'A/B testing via Convert.com', 'Landing page redesigns', 'Monthly performance reports', 'Full change log'],
      href: '/services/class-b',
      featured: true,
    },
    {
      super: 'Growth Intensive',
      name: 'Class A',
      tagline: '"A 12-week transformation that builds your growth system from the ground up."',
      who: 'Scaling brands ($500K–$5M) with active paid campaigns across multiple channels.',
      meta: 'Fixed 12-week + $3–5K/mo retainer',
      includes: ['Full marketing audit', 'Conversion funnel map', 'Campaign playbook', '90-day strategic roadmap', 'Full Notion handoff'],
      href: '/services/class-a',
      featured: false,
    },
  ]

  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-10">Choose your tier</p>
        <div className="flex flex-col gap-6">
          {tiers.map(t => (
            <div key={t.name}
              className={`bg-white rounded-sm overflow-hidden ${t.featured
                ? 'border-2 border-brand-crimson'
                : 'border border-black/10'}`}>
              {/* Card head */}
              <div className="px-6 py-5 border-b border-black/10 flex items-start justify-between gap-4">
                <div>
                  {t.featured && (
                    <span className="font-mono text-xs bg-brand-crimson text-white px-2 py-0.5 rounded-sm inline-block mb-2">
                      MOST COMMON
                    </span>
                  )}
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-1">{t.super}</p>
                  <p className="text-xl font-bold text-brand-ink mb-2">{t.name}</p>
                  <p className="text-sm text-brand-ink/60 italic">{t.tagline}</p>
                </div>
                <p className="font-mono text-xs text-brand-ink/40 text-right flex-shrink-0">{t.meta}</p>
              </div>
              {/* Card body */}
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Who it's for</p>
                  <p className="text-sm text-brand-ink/60 leading-relaxed">{t.who}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">What's included</p>
                  <ul className="space-y-1.5">
                    {t.includes.map(i => (
                      <li key={i} className="flex items-start gap-2 text-xs text-brand-ink/60">
                        <span className="text-brand-crimson mt-0.5 flex-shrink-0">→</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Card footer */}
              <div className="px-6 py-3 border-t border-black/10 flex justify-end">
                <Link href={t.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2">
                  See full details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { bar: '#c20e59', title: 'Audit', body: 'Clarity heatmaps, GA4 data, session recordings. We find the drop-offs before we touch anything.' },
    { bar: '#e82561', title: 'Build', body: 'UX and UI designed around conversion architecture — not aesthetics first.' },
    { bar: '#f5c842', title: 'Optimize', body: 'A/B tests via Convert.com. Every variant documented. Every winner shipped.' },
    { bar: '#0F172A', title: 'Report', body: 'Monthly performance reports. Full change log. You always know what changed and why.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How it works</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>
          The methodology behind every engagement.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-6">
          {steps.map(s => (
            <div key={s.title} className="flex gap-3 items-start border border-black/10 rounded-sm p-5">
              <div className="w-0.5 h-8 flex-shrink-0 mt-0.5" style={{ background: s.bar }} />
              <div>
                <p className="font-bold text-brand-ink text-sm mb-1">{s.title}</p>
                <p className="text-xs text-brand-ink/60 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/how-it-works" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
          See how it works in full →
        </Link>
      </div>
    </section>
  )
}

function Progression() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How the tiers connect</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-5" style={{ letterSpacing: '-0.01em' }}>
          "These aren't just options. They're a system."
        </h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8 max-w-2xl">
          A client who starts at Class C and grows into Class B has a compounding advantage — the UX
          is already built for optimization, and Clarity is already collecting data. When Class B begins,
          there's no teardown. Just a layer of optimization on a site that was always built to receive it.
        </p>
        <div className="flex items-center gap-4">
          {['Class C', 'Class B', 'Class A'].map((tier, i) => (
            <div key={tier} className="flex items-center gap-4">
              <div className="bg-black/5 border border-black/10 rounded-sm px-4 py-2">
                <p className="font-bold text-brand-ink text-sm">{tier}</p>
              </div>
              {i < 2 && <span className="text-brand-ink/30 font-mono">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DualCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug" style={{ letterSpacing: '-0.01em' }}>Ready to start?</h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/free-audit" className="bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors">
            Show us your site. We'll find the leak.
          </Link>
          <Link href="/contact" className="border border-white/30 text-white text-sm px-6 py-3 rounded-sm hover:border-white/60 transition-colors">
            Book a call
          </Link>
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

export default function ServicesPage() {
  return (
    <>
      <Nav active="Services" />
      <main>
        <Hero />
        <TierBlocks />
        <HowItWorksSection />
        <Progression />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
