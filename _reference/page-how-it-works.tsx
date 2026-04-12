/**
 * DUHA MEDIA — How It Works
 * Route: /how-it-works
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">How it works</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          What it actually feels like to work with us.
        </h1>
        <p className="text-sm text-white/55 leading-relaxed">
          Not a process diagram. A walk through what you never have to ask, what you always receive, and what actually changes.
        </p>
      </div>
    </section>
  )
}

function CROExplainer() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">What is CRO?</p>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-6 leading-snug" style={{ letterSpacing: '-0.01em' }}>
          More traffic isn't the answer.<br />Making the traffic you have work harder is.
        </h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-4 max-w-2xl">
          Conversion Rate Optimisation is the practice of systematically improving what happens after someone lands on your site. Not guessing, not redesigning because it looks dated — testing specific changes against real user behaviour, measuring the outcome, and only shipping what the data supports.
        </p>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-10 max-w-2xl">
          Most Shopify brands invest heavily in driving traffic. Very few invest in what happens after the click. That's the gap CRO fills.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-black/5 border border-black/10 rounded-sm p-5">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-ink/40 mb-4">Not CRO</p>
            <ul className="text-sm text-brand-ink/60 space-y-2">
              {['Redesigning because it looks old', 'Changing copy on instinct', 'Running ads to weak pages', 'Guessing why sales stalled'].map(i => (
                <li key={i} className="flex items-start gap-2"><span className="text-brand-ink/30 mt-0.5">×</span>{i}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border-2 border-brand-crimson rounded-sm p-5">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-crimson mb-4">CRO</p>
            <ul className="text-sm text-brand-ink/60 space-y-2">
              {['Finding where users leave and why', 'Testing one change at a time', 'Measuring the outcome', 'Documenting the result'].map(i => (
                <li key={i} className="flex items-start gap-2"><span className="text-brand-crimson mt-0.5">→</span>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-black/10 pt-8">
          <div className="flex items-start gap-4">
            <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0">1%</p>
            <p className="text-xs text-brand-ink/60 leading-relaxed">CVR lift on $500K revenue = $5K–$15K additional annual revenue from traffic you already have</p>
          </div>
          <div className="flex items-start gap-4">
            <p className="font-mono text-3xl font-bold text-brand-crimson flex-shrink-0">500+</p>
            <p className="text-xs text-brand-ink/60 leading-relaxed">Monthly sessions needed before A/B tests produce statistically meaningful results</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PrincipleBar() {
  return (
    <div className="bg-brand-ink px-6 py-8 flex items-center justify-between gap-6">
      <p className="text-base md:text-lg font-bold text-white leading-snug max-w-2xl">
        "Every change has a rationale. Every test has a record. You always know what's happening and why."
      </p>
      <p className="font-mono text-xs text-white/30 flex-shrink-0 text-right hidden md:block">
        Core<br />principle
      </p>
    </div>
  )
}

function NeverHaveToAsk() {
  const items = [
    {
      q: '"What are you working on right now?"',
      a: 'The client dashboard shows every active test, queued change, and upcoming priority — updated in real time, not on a monthly schedule.',
    },
    {
      q: '"Why did you make that change?"',
      a: 'Every update to the site is logged in the change log with the audit finding that triggered it, the hypothesis, and the expected outcome — before any traffic sees it.',
    },
    {
      q: '"Did the test work?"',
      a: 'Every A/B test has a documented result — win or lose — with the sample size, confidence level, and the decision made. Losing tests are recorded and archived.',
    },
    {
      q: '"What\'s happening with our conversion rate?"',
      a: 'Monthly performance report — CVR vs baseline, scroll depth, form abandonment, Core Web Vitals. Every metric against its starting point, not just the current number.',
    },
    {
      q: '"What\'s coming next?"',
      a: 'The 90-day roadmap is updated every month — prioritised tests, planned changes, and expected outcomes. You know what\'s coming before it happens.',
    },
    {
      q: '"Can you explain this to our marketing team?"',
      a: 'Inter-departmental documentation is produced for every engagement — written so your internal team can understand and act on it without needing to be on every call.',
    },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What working with us feels like</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-10" style={{ letterSpacing: '-0.01em' }}>
          Six things you'll never have to ask.
        </h2>
        <div className="divide-y divide-black/10">
          {items.map((item, i) => (
            <div key={i} className="flex gap-5 py-6">
              <div className="w-4 h-4 rounded-full bg-brand-crimson flex-shrink-0 mt-0.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div>
                <p className="font-bold text-brand-ink text-sm mb-2 leading-snug">{item.q}</p>
                <p className="text-sm text-brand-ink/60 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DocumentationExamples() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How documentation works</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>Every change has a paper trail. Always.</h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-10">Documentation runs from day one — through every audit, every test, every update. Not delivered at the end. Continuous.</p>

        {/* Change log */}
        <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
          <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-brand-crimson" />
            <p className="font-bold text-brand-ink text-sm">Change log entry</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-4">Every site update logged with: what changed, the finding that triggered it, the hypothesis, and the target outcome.</p>
            <div className="bg-black/5 rounded-sm p-4 font-mono text-xs text-brand-ink/60 leading-relaxed">
              <span className="text-brand-ink font-medium">2024-03-14</span> · CTA moved above fold · /products/hero<br />
              <span className="text-brand-ink font-medium">Finding:</span> 67% of mobile users never reached original CTA<br />
              <span className="text-brand-ink font-medium">Hypothesis:</span> Moving CTA above fold → +8–12% mobile CVR<br />
              <span className="text-brand-ink font-medium">Status:</span> Live — monitoring
            </div>
          </div>
        </div>

        {/* A/B test record */}
        <div className="border border-black/10 rounded-sm overflow-hidden mb-5">
          <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-brand-magenta" />
            <p className="font-bold text-brand-ink text-sm">A/B test record</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-4">Every test documented before it runs. Results recorded when it closes — win or lose.</p>
            <div className="bg-black/5 rounded-sm p-4 font-mono text-xs text-brand-ink/60 leading-relaxed">
              <span className="text-brand-ink font-medium">Test #007</span> · "Buy now" vs "Complete order"<br />
              <span className="text-brand-ink font-medium">Target:</span> Checkout CVR · <span className="text-brand-ink font-medium">Sample:</span> 2,400 sessions<br />
              <span className="text-brand-ink font-medium">Result:</span> "Complete order" +14.2% · Significance: 96%<br />
              <span className="text-brand-ink font-medium">Decision:</span> Variant shipped · <span className="text-brand-ink font-medium">Next:</span> Form field reduction
            </div>
          </div>
        </div>

        {/* Monthly report */}
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="bg-black/5 border-b border-black/10 px-4 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-brand-gold" />
            <p className="font-bold text-brand-ink text-sm">Monthly report — sample structure</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-4">Same format every month — track changes over time without translating between structures.</p>
            <div className="border border-black/10 rounded-sm overflow-hidden">
              <div className="bg-brand-ink px-4 py-3 flex items-center justify-between">
                <p className="font-bold text-white text-sm">March 2024 — Performance report</p>
                <p className="font-mono text-xs text-white/40">Class B · Month 3</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ num: '2.4%', label: 'CVR (was 1.8%)' }, { num: '−18%', label: 'Form abandon' }, { num: '94', label: 'Clarity score' }].map(m => (
                    <div key={m.label} className="bg-black/5 rounded-sm p-3 text-center">
                      <p className="font-mono text-sm font-bold text-brand-crimson">{m.num}</p>
                      <p className="font-mono text-xs text-brand-ink/40 mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-brand-ink/60 italic">Sections: CVR vs baseline · Test results · Changes + rationale · Next month priorities · Updated roadmap</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CommunicationCadence() {
  const channels = [
    { name: 'Slack', freq: 'Day-to-day', desc: 'Dedicated channel. Quick questions, test updates, early findings.' },
    { name: 'Loom', freq: 'With every update', desc: 'Short video walkthrough of any significant change or result.' },
    { name: 'Check-in calls', freq: 'Bi-weekly (B/A)', desc: '30 minutes. Focused on decisions — status lives in the dashboard.' },
    { name: 'Monthly report', freq: 'Every month', desc: 'Full performance report. CVR vs baseline, tests, changes, next priorities.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">How we communicate</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>Async-first. Updates when they're ready.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {channels.map(c => (
            <div key={c.name} className="border border-black/10 rounded-sm p-5">
              <p className="font-mono text-sm font-medium text-brand-ink mb-1">{c.name}</p>
              <p className="font-mono text-xs text-brand-crimson mb-3">{c.freq}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TierLinks() {
  const tiers = [
    { name: 'Class C — Foundation', desc: 'Audit + Build. Analytics installed from day one. No active testing yet.', href: '/services/class-c' },
    { name: 'Class B — CRO Core', desc: 'Full methodology. Monthly retainer with continuous optimisation.', href: '/services/class-b' },
    { name: 'Class A — Growth Intensive', desc: 'Full methodology plus campaign attribution and cross-channel analysis.', href: '/services/class-a' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Where this applies</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>
          Every engagement follows this methodology. The depth varies by tier.
        </h2>
        <div className="flex flex-col gap-3">
          {tiers.map(t => (
            <div key={t.name} className="bg-white border border-black/10 rounded-sm p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-ink text-sm mb-1">{t.name}</p>
                <p className="text-xs text-brand-ink/60">{t.desc}</p>
              </div>
              <Link href={t.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0">Details →</Link>
            </div>
          ))}
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

export default function HowItWorksPage() {
  return (
    <>
      <Nav active="How it works" />
      <main>
        <Hero />
        <CROExplainer />
        <PrincipleBar />
        <NeverHaveToAsk />
        <DocumentationExamples />
        <CommunicationCadence />
        <TierLinks />
        <DualCTA heading="See it in action on your site." />
      </main>
      <Footer />
    </>
  )
}
