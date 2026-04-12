/**
 * DUHA MEDIA — Results Summary
 * Route: /results
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
            className={`text-xs transition-colors ${item === active ? 'text-brand-crimson border-b border-brand-crimson' : 'text-brand-ink/60 hover:text-brand-ink'}`}>
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Results</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          What the data says after the work is done.
        </h1>
        <p className="text-sm text-white/55 leading-relaxed">
          Conversion rate improvements, documented and measured. Every result tied to a specific change and a specific test.
        </p>
      </div>
    </section>
  )
}

function MetricsOverview() {
  const metrics = [
    { abbr: 'CVR', name: 'Conversion rate' },
    { abbr: 'CTR', name: 'Click-through rate' },
    { abbr: 'FAR', name: 'Form abandonment' },
    { abbr: 'CWV', name: 'Core Web Vitals' },
    { abbr: 'MOB', name: 'Mobile vs desktop CVR' },
    { abbr: 'μCV', name: 'Micro-conversions' },
  ]
  const methodology = [
    { title: 'Baseline first', desc: 'Every metric is measured before any change is made — no result without a starting point.' },
    { title: 'Statistical significance', desc: 'No A/B test is called until statistical significance is reached. Sample size is set before each test begins.' },
    { title: 'Documented outcomes', desc: 'Win or lose — every test result is recorded with the decision made and the rationale.' },
    { title: 'Revenue impact', desc: 'CVR improvements are translated into estimated revenue impact at actual traffic and AOV.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we track</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Seven metrics. All tied to revenue.</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {metrics.map(m => (
            <div key={m.abbr} className="bg-white border border-black/10 rounded-sm p-4 text-center">
              <p className="font-mono text-sm font-bold text-brand-crimson mb-1">{m.abbr}</p>
              <p className="font-mono text-xs text-brand-ink/60 uppercase tracking-wide leading-tight">{m.name}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methodology.map(m => (
            <div key={m.title} className="bg-black/5 rounded-sm p-5">
              <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-2">{m.title}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedResult() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Featured result</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>From the most recent completed engagement.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="bg-brand-ink px-6 py-5 flex items-center gap-6">
            <p className="font-mono text-5xl font-bold text-brand-magenta leading-none">+XX%</p>
            <div>
              <p className="font-bold text-white text-base mb-1">Conversion rate lift</p>
              <p className="font-mono text-xs text-white/40">90 days · Class B engagement</p>
            </div>
          </div>
          <div className="p-6">
            <span className="font-mono text-xs bg-black/5 border border-black/10 rounded-sm px-2 py-1 text-brand-ink/60 inline-block mb-4">
              Shopify · Apparel · $800K revenue
            </span>
            <p className="text-sm text-brand-ink/60 italic leading-relaxed mb-3">
              "[Client quote — specific to their numbers and situation.]"
            </p>
            <p className="font-mono text-xs text-brand-ink/40 mb-5">— [Name], [Title]</p>
            <Link href="/results/case-studies/featured" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
              Read the full case study →
            </Link>
            <p className="font-mono text-xs text-brand-ink/30 border-t border-black/10 pt-4 mt-4 italic">
              Placeholder — swap in first completed result. Lead with the metric.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CaseStudyPreview() {
  const studies = [
    { metric: '+XX%', label: 'CVR · Class B', tag: 'Shopify · Homewares', desc: 'Landing page redesign + form optimisation.', slug: 'homewares-cvr' },
    { metric: '−XX%', label: 'Form abandon · Class B', tag: 'Shopify · Supplements', desc: 'Checkout flow and field reduction.', slug: 'supplements-form' },
    { metric: '+XX%', label: 'Mobile CVR · Class C', tag: 'Shopify · Beauty', desc: 'Full site foundation + Clarity install.', slug: 'beauty-mobile' },
    { metric: '+XX%', label: 'CVR · Class A', tag: 'Shopify · Outdoor gear', desc: '12-week intensive + campaign attribution.', slug: 'outdoor-class-a' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">More results</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Every engagement documented.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {studies.map(s => (
            <div key={s.slug} className="border border-black/10 rounded-sm overflow-hidden">
              <div className="bg-brand-ink px-4 py-3">
                <p className="font-mono text-xl font-bold text-brand-magenta">{s.metric}</p>
                <p className="font-mono text-xs text-white/40">{s.label}</p>
              </div>
              <div className="p-4 bg-white">
                <p className="font-mono text-xs text-brand-ink/40 mb-2">{s.tag}</p>
                <p className="text-xs text-brand-ink/60 mb-3">{s.desc}</p>
                <Link href={`/results/case-studies/${s.slug}`} className="font-mono text-xs text-brand-crimson underline underline-offset-2">Read →</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/results/case-studies" className="font-mono text-sm text-brand-crimson underline underline-offset-2">
            Browse all case studies →
          </Link>
        </div>
      </div>
    </section>
  )
}

function DualCTA({ heading }: { heading: string }) {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug" style={{ letterSpacing: '-0.01em' }}>{heading}</h2>
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

export default function ResultsPage() {
  return (
    <>
      <Nav active="Results" />
      <main>
        <Hero />
        <MetricsOverview />
        <FeaturedResult />
        <CaseStudyPreview />
        <DualCTA heading="Get a result like this for your site." />
      </main>
      <Footer />
    </>
  )
}
