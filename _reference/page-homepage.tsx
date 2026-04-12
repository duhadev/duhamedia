/**
 * DUHA MEDIA — Homepage
 * Route: /
 * Stack: Next.js + Tailwind
 *
 * Brand colors (add to tailwind.config.js):
 *   brand-ink:      #0F172A
 *   brand-crimson:  #c20e59
 *   brand-magenta:  #e82561
 *   brand-gold:     #f5c842
 *   brand-cream:    #fce588
 *   brand-offwhite: #F8F8F6
 *
 * Fonts: IBM Plex Sans (sans) + IBM Plex Mono (mono) via next/font/google
 */

import Link from 'next/link'

// ─── Logo mark SVG ───────────────────────────────────────────────────────────
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

// ─── Navigation ──────────────────────────────────────────────────────────────
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
            className="text-xs text-brand-ink/60 hover:text-brand-ink transition-colors">
            {item}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/free-audit" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
          Free audit
        </Link>
        <Link href="/contact"
          className="bg-brand-crimson text-white text-xs font-bold px-3 py-2 rounded-sm hover:bg-brand-magenta transition-colors">
          Book a call
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-brand-ink px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-6">
          duhamedia.com
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
          style={{ letterSpacing: '-0.02em' }}>
          We engineer the foundation.<br />Then we prove it works.
        </h1>
        <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-lg">
          CRO and web design for Shopify brands that have traffic but aren't converting it.
        </p>
        <Link href="/free-audit"
          className="inline-block bg-brand-magenta text-white font-bold text-sm px-6 py-3 rounded-sm hover:bg-brand-crimson transition-colors mb-3">
          Show us your site. We'll find the leak.
        </Link>
        <p className="font-mono text-xs text-white/35">No pitch. No pricing. Just the finding.</p>
      </div>
    </section>
  )
}

// ─── Pain Points ──────────────────────────────────────────────────────────────
function PainPoints() {
  const pains = [
    { num: '01', title: 'Traffic not converting', body: 'Sessions go up. Revenue doesn\'t follow. Something is breaking after the click.' },
    { num: '02', title: 'Blind experimentation', body: 'Changes made on instinct. No baseline. No way to know what actually worked.' },
    { num: '03', title: 'Leaky sales funnels', body: 'Money spent on ads landing on pages that lose people at the same point every time.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-8">The problem</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pains.map(p => (
            <div key={p.num} className="bg-white border border-black/10 rounded-sm p-5">
              <p className="font-mono text-xs text-brand-ink/40 mb-3">{p.num}</p>
              <h3 className="font-bold text-brand-ink text-sm mb-2">{p.title}</h3>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CRO Bridge ───────────────────────────────────────────────────────────────
function CROBridge() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">What is CRO?</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-5"
          style={{ letterSpacing: '-0.01em' }}>
          More traffic isn't the answer.<br />Making the traffic you have work harder is.
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          Conversion Rate Optimisation is the practice of systematically improving what happens
          after someone lands on your site. Not guessing, not redesigning because it looks outdated —
          testing specific changes against real user behaviour, measuring the outcome, and only
          shipping what works.
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          For a Shopify brand doing $500K a year, a 1% improvement in conversion rate isn't a
          rounding error. It's tens of thousands in additional revenue from traffic you're already
          paying for.
        </p>
        <div className="flex items-start gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="font-mono text-3xl font-bold text-brand-magenta">1%</p>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            CVR improvement on $500K revenue = $5,000–$15,000 in additional annual revenue —
            from traffic you're already paying for.
          </p>
        </div>
        <Link href="/how-it-works"
          className="inline-block font-mono text-xs text-brand-gold underline underline-offset-2 mt-6">
          See exactly how we do it →
        </Link>
      </div>
    </section>
  )
}

// ─── Methodology ──────────────────────────────────────────────────────────────
function Methodology() {
  const steps = [
    { bar: '#c20e59', title: 'Audit', body: 'Clarity heatmaps, GA4 data, session recordings.' },
    { bar: '#e82561', title: 'Build', body: 'UX designed around conversion architecture.' },
    { bar: '#f5c842', title: 'Optimize', body: 'A/B tests via Convert.com. Every winner shipped.' },
    { bar: '#0F172A', title: 'Report', body: 'Monthly reports. Full change log.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">How we work</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>
          "Most agencies work in a black box. We don't."
        </h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8 max-w-xl">
          Every change is documented. Every test has a rationale. Every result is measured and reported.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {steps.map(s => (
            <div key={s.title} className="flex gap-3 items-start border border-black/10 rounded-sm p-4">
              <div className="w-0.5 h-8 flex-shrink-0 mt-0.5" style={{ background: s.bar }} />
              <div>
                <p className="font-bold text-brand-ink text-sm mb-1">{s.title}</p>
                <p className="text-xs text-brand-ink/60">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/how-it-works"
          className="font-mono text-xs text-brand-crimson underline underline-offset-2">
          See how it works in full →
        </Link>
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
function Services() {
  const tiers = [
    { name: 'Class C — Foundation', desc: 'Conversion-ready website.', meta: 'One-time · ~3 months', href: '/services/class-c', featured: false },
    { name: 'Class B — CRO Core', desc: 'Active CRO + monthly retainer.', meta: 'Setup + retainer', href: '/services/class-b', featured: true },
    { name: 'Class A — Growth Intensive', desc: '12-week system build + retainer.', meta: 'Fixed 12-week + retainer', href: '/services/class-a', featured: false },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">Services</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>
          Three ways to work together.
        </h2>
        <div className="flex flex-col gap-3">
          {tiers.map(t => (
            <div key={t.name}
              className={`bg-white rounded-sm p-4 flex items-center justify-between
                ${t.featured ? 'border-2 border-brand-crimson' : 'border border-black/10'}`}>
              <div>
                {t.featured && (
                  <span className="font-mono text-xs bg-brand-crimson text-white px-2 py-0.5 rounded-sm mb-2 inline-block">
                    MOST COMMON
                  </span>
                )}
                <p className="font-bold text-brand-ink text-sm">{t.name}</p>
                <p className="text-xs text-brand-ink/60">{t.desc} <span className="font-mono">{t.meta}</span></p>
              </div>
              <Link href={t.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0 ml-4">
                Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Results placeholder ─────────────────────────────────────────────────────
function ResultsPlaceholder() {
  const metrics = [
    { name: 'CVR', desc: 'Primary goal. Every engagement benchmarked here.' },
    { name: 'Scroll depth', desc: 'Where users disengage before the CTA.' },
    { name: 'CTR', desc: 'CTA visibility and copy effectiveness.' },
    { name: 'Form abandonment', desc: 'Last drop-off before the sale.' },
    { name: 'Core Web Vitals', desc: 'Speed and stability affect conversion.' },
    { name: 'Mobile CVR', desc: 'Most paid traffic is mobile.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-2">Results</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>
          What we track and why it matters.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metrics.map(m => (
            <div key={m.name} className="bg-brand-offwhite rounded-sm p-4">
              <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-1">{m.name}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Free Audit CTA ──────────────────────────────────────────────────────────
function AuditCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4 leading-snug" style={{ letterSpacing: '-0.01em' }}>
          See exactly what's costing you conversions — for free.
        </h2>
        <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-md">
          Submit your URL. We'll record a short video walking through your site and showing you
          the specific friction points. No pitch. No pricing. Just the finding.
        </p>
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="yoursite.com"
            className="bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 font-mono text-xs text-white/40 placeholder:text-white/30 min-w-48 focus:outline-none focus:border-white/40"
          />
          <button className="bg-brand-magenta text-white font-bold text-xs px-5 py-2.5 rounded-sm hover:bg-brand-crimson transition-colors">
            Get my free audit
          </button>
        </div>
        <p className="font-mono text-xs text-white/30 mt-3">We'll follow up within 2 business days.</p>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-brand-ink border-t border-white/10 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={20} />
              <span className="font-bold text-white text-sm">duha media</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Web design, development & CRO for Shopify brands.
            </p>
          </div>
          <div>
            <p className="font-bold text-white text-xs mb-3">Navigation</p>
            {['Services', 'How it works', 'Results', 'Insights', 'About'].map(item => (
              <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className="block text-xs text-white/40 hover:text-white/70 transition-colors mb-1.5">
                {item}
              </Link>
            ))}
          </div>
          <div>
            <p className="font-bold text-white text-xs mb-3">Legal</p>
            <Link href="/privacy" className="block text-xs text-white/40 hover:text-white/70 mb-1.5">Privacy policy</Link>
            <Link href="/terms" className="block text-xs text-white/40 hover:text-white/70">Terms of service</Link>
          </div>
          <div className="bg-brand-cream/10 border border-brand-cream/20 rounded-sm p-4">
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              CRO tips and teardowns — straight to your inbox.
            </p>
            <Link href="/insights" className="font-mono text-xs text-brand-gold underline underline-offset-2">
              Subscribe →
            </Link>
          </div>
        </div>
        <p className="font-mono text-xs text-white/20 border-t border-white/10 pt-6">
          © Duha Media · duhamedia.com
        </p>
      </div>
    </footer>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PainPoints />
        <CROBridge />
        <Methodology />
        <Services />
        <ResultsPlaceholder />
        <AuditCTA />
      </main>
      <Footer />
    </>
  )
}
