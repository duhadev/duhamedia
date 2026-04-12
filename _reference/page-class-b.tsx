/**
 * DUHA MEDIA — Class B Sub-page
 * Route: /services/class-b
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
            className={`text-xs transition-colors ${item === 'Services' ? 'text-brand-crimson border-b border-brand-crimson' : 'text-brand-ink/60 hover:text-brand-ink'}`}>
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Class B · CRO Core</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          "Data-driven conversion rate optimisation — turning your existing traffic into measurable revenue."
        </h1>
        <p className="text-sm text-white/55 leading-relaxed mb-5 max-w-xl">
          For Shopify stores with existing traffic and paid campaigns. We systematically improve what happens after the click.
        </p>
        <p className="font-mono text-xs text-white/35">Setup fee + $1,500/mo retainer · Min. 500 monthly sessions to qualify</p>
      </div>
    </section>
  )
}

function Prerequisites() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Prerequisites</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>Class B requires a qualifying site.</h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">
          We won't take on an engagement that can't produce statistically meaningful results. These aren't arbitrary thresholds — they're the conditions under which CRO actually works.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {[
            { num: '500+', title: 'Monthly sessions', why: 'Below this, A/B tests produce noise, not signal. You need enough traffic to reach statistical significance within a reasonable test window.' },
            { num: 'Paid', title: 'Active or planned ads', why: 'Ad spend signals you\'re already invested in driving traffic. CRO compounds that investment — improving what happens after the click, not just before it.' },
          ].map(p => (
            <div key={p.title} className="bg-white border border-black/10 rounded-sm p-5">
              <p className="font-mono text-3xl font-bold text-brand-crimson mb-2">{p.num}</p>
              <p className="font-bold text-brand-ink text-sm mb-3">{p.title}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed border-t border-black/10 pt-3 italic">{p.why}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 leading-relaxed">
          Don't qualify yet? Class C builds the foundation and installs Clarity + GA4 from day one. Most Class C clients hit the Class B threshold within 6–12 months.{' '}
          <Link href="/services/class-c" className="text-brand-crimson underline underline-offset-2 not-italic">See Class C →</Link>
        </p>
      </div>
    </section>
  )
}

function SetupDeliverables() {
  const deliverables = [
    { num: '01', title: 'GA4 conversion tracking configuration', body: 'Goals, events, and funnels set up from scratch or rebuilt on your existing install. No optimisation is possible without a reliable baseline — this is the first thing we fix.' },
    { num: '02', title: 'Full site CRO audit', body: 'A complete review of where your traffic drops off — using Clarity heatmaps, session recordings, and GA4 funnel data. Every finding is documented with a hypothesis before a single change is made.' },
    { num: '03', title: 'UX/UI refinements', body: 'CTA placement, form structure, page hierarchy, and mobile experience updated to reflect what the data says, not what looks good.' },
    { num: '04', title: 'Convert.com A/B testing framework', body: 'Platform configured, integrated with Clarity, and first test launched. Every test has a documented hypothesis, a target metric, and a minimum sample size before it\'s called.' },
    { num: '05', title: 'Landing page redesigns', body: 'Key pages rebuilt around conversion architecture — especially those receiving paid traffic where the cost of leaking visitors is highest.' },
    { num: '06', title: 'Heatmap + session recording analysis', body: 'Baseline established from Clarity data. Behavioural patterns identified and ranked into a hypothesis backlog — the fuel for every A/B test that follows.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Setup phase — one-time</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>What happens before the retainer begins.</h2>
        <div className="flex flex-col gap-3">
          {deliverables.map(d => (
            <div key={d.num} className="border border-black/10 rounded-sm overflow-hidden">
              <div className="bg-black/5 border-b border-black/10 px-5 py-3 flex items-center gap-3">
                <span className="font-mono text-xs text-brand-crimson">{d.num}</span>
                <p className="font-bold text-brand-ink text-sm">{d.title}</p>
              </div>
              <p className="px-5 py-4 text-sm text-brand-ink/60 leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RetainerCadence() {
  const items = [
    { title: 'Continuous UX updates', desc: 'Changes informed by live traffic data, not scheduled sprints.' },
    { title: 'Monthly performance report', desc: 'CVR, CTR, scroll depth, form abandonment, Core Web Vitals vs. baseline.' },
    { title: 'A/B test results + next-test recommendations', desc: 'Winners documented, losers analysed, next hypothesis queued.' },
    { title: 'Full change log', desc: 'Every update logged with its rationale and measured outcome.' },
    { title: 'Bi-weekly check-in calls', desc: 'Async Slack + Loom updates between calls.' },
    { title: 'Inter-departmental docs', desc: 'Documentation your marketing and product teams can actually use.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Retainer — $1,500/mo ongoing</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>What you get every month.</h2>
        <div className="divide-y divide-black/10">
          {items.map(i => (
            <div key={i.title} className="flex gap-4 py-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0 mt-2" />
              <div>
                <span className="font-bold text-brand-ink text-sm">{i.title}</span>
                <span className="text-sm text-brand-ink/60"> — {i.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolStack() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Tool stack</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Enterprise-grade insight at SMB pricing.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { name: 'Microsoft Clarity', cost: 'Free', desc: 'Session recording, heatmaps, UTM campaign filtering. Installed at Class C — data collecting before Class B begins.', why: 'Free, privacy-compliant, integrates directly with Convert.com for combined experiment + session analysis.' },
            { name: 'Convert.com', cost: '~$349/mo (client-billed)', desc: 'Dedicated A/B testing platform. SMB-priced, privacy-focused, purpose-built for conversion testing.', why: 'VWO and AB Tasty merged into enterprise-tier platforms at $10K+/yr. Convert is the right fit for brands under $5M.' },
          ].map(t => (
            <div key={t.name} className="border border-black/10 rounded-sm p-5">
              <p className="font-mono text-sm font-medium text-brand-ink mb-1">{t.name}</p>
              <p className="font-mono text-xs text-brand-ink/40 mb-3">{t.cost}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed mb-3">{t.desc}</p>
              <p className="text-xs text-brand-ink/40 italic leading-relaxed border-t border-black/10 pt-3">{t.why}</p>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-brand-ink/40 border-t border-black/10 pt-4">
          Convert.com is billed directly to the client — separate from the Duha Media retainer. No markup.
        </p>
      </div>
    </section>
  )
}

function KeyMetrics() {
  const metrics = [
    { name: 'CVR', desc: 'Primary goal. Every engagement benchmarked here from day one.' },
    { name: 'Scroll depth', desc: 'Where users disengage before reaching the CTA.' },
    { name: 'CTR', desc: 'CTA visibility and copy effectiveness on key elements.' },
    { name: 'Form abandonment', desc: 'Last drop-off before the sale. Often the most fixable.' },
    { name: 'Core Web Vitals', desc: 'LCP, FID, CLS — speed and stability affect conversion directly.' },
    { name: 'Mobile vs desktop', desc: 'Most paid traffic is mobile. Most sites are built for desktop.' },
    { name: 'Micro-conversions', desc: 'Add-to-cart, wishlist — leading indicators before the final sale.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What we track</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Seven metrics. All tied to revenue.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {metrics.map(m => (
            <div key={m.name} className="bg-black/5 rounded-sm p-4">
              <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide mb-1">{m.name}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProof() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Results</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>What Class B actually produces.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="bg-brand-ink px-6 py-5 text-center">
            <p className="font-mono text-5xl font-bold text-brand-magenta leading-none">+XX%</p>
            <p className="font-mono text-xs text-white/40 mt-2">Conversion rate lift · 90 days</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-brand-ink/60 italic leading-relaxed mb-3">
              "[Client quote — specific to their numbers and situation.]"
            </p>
            <p className="font-mono text-xs text-brand-ink/40 mb-4">— [Name], [Title] · Shopify brand, apparel</p>
            <p className="font-mono text-xs text-brand-ink/30 border-t border-black/10 pt-4 italic">
              Placeholder — swap in first client result. Lead with metric, follow with quote.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function NotIncluded() {
  return (
    <section className="bg-brand-offwhite px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">Not included</p>
        <div className="bg-black/5 border border-black/10 rounded-sm p-5 space-y-3">
          {[
            { text: 'Paid advertising management or campaign strategy', link: { label: 'Class A →', href: '/services/class-a' } },
            { text: 'Cross-channel campaign correlation + attribution', link: { label: 'Class A →', href: '/services/class-a' } },
            { text: 'CRM development or custom CRM builds', link: null },
          ].map(item => (
            <div key={item.text} className="flex items-center justify-between gap-4">
              <p className="text-sm text-brand-ink/50 line-through">{item.text}</p>
              {item.link && (
                <Link href={item.link.href} className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0">
                  {item.link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: 'How long before we see results?', a: 'The setup phase typically takes 4–6 weeks. First A/B test results come in 3–6 weeks after that, depending on traffic volume. Meaningful CVR movement is usually visible within 90 days — though the change log starts from day one, so you\'re never waiting to see what\'s happening.' },
    { q: 'How do we know the changes you make actually caused the improvement?', a: 'Everything runs through Convert.com — a dedicated A/B testing platform that isolates variables and measures statistical significance before a test is called. Every result is documented with the test parameters, sample size, and confidence level. You see the methodology, not just the number.' },
    { q: 'What if our traffic drops mid-engagement?', a: 'If traffic drops below the 500-session threshold, A/B testing pauses — running tests on insufficient data produces misleading results and we won\'t do it. The retainer shifts to audit, analysis, and preparation work until traffic recovers. You\'re not paying for noise.' },
    { q: 'Who owns the work when the retainer ends?', a: 'You do. All design files, documentation, and change logs are yours. The Convert.com account is client-billed and stays with you. There\'s no lock-in on assets or data.' },
    { q: 'How much of our team\'s time does this require?', a: 'Minimal. We work in a dedicated Slack channel and deliver async Loom updates. Bi-weekly check-ins are 30 minutes. Monthly report reviews are optional. Most clients spend under 2 hours a month on active involvement.' },
    { q: 'What does the first 30 days actually look like?', a: 'Week 1: GA4 audit and tracking fix. Week 2: Clarity and heatmap baseline review. Weeks 3–4: CRO audit delivered with prioritised hypothesis backlog. By day 30 you have a complete picture of what\'s broken and a ranked list of what to fix first.' },
    { q: 'Can we pause the retainer?', a: 'Pauses can be arranged with 30 days written notice for circumstances outside your control. Standard retainers don\'t include pause terms by default. This is discussed and agreed during onboarding.' },
    { q: 'How is this different from hiring a CRO consultant?', a: 'A consultant gives you a report. We give you a documented, running system — tested changes, a live change log, and a hypothesis backlog that keeps producing results after the initial work is done. The retainer is designed to compound, not repeat itself each month.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Common questions</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>
          What comes up before teams sign off.
        </h2>
        <div className="divide-y divide-black/10">
          {faqs.map(f => (
            <div key={f.q} className="py-6">
              <p className="font-bold text-brand-ink text-sm mb-3">{f.q}</p>
              <p className="text-sm text-brand-ink/60 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PDFDownload() {
  return (
    <section className="bg-brand-offwhite px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">Share internally</p>
        <div className="bg-black/5 border border-black/10 rounded-sm p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-10 bg-white border border-black/10 rounded-sm flex flex-col items-center justify-end pb-1.5 flex-shrink-0">
              <div className="space-y-0.5 w-5">
                {[true, false, true, false].map((_, i) => (
                  <div key={i} className={`h-px bg-black/15 ${i % 2 !== 0 ? 'w-3' : 'w-full'}`} />
                ))}
              </div>
              <p className="font-mono font-bold text-brand-crimson mt-1" style={{ fontSize: '7px' }}>PDF</p>
            </div>
            <div>
              <p className="font-bold text-brand-ink text-sm mb-1">Class B — Full engagement brief</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">Setup deliverables, retainer cadence, tool stack, FAQ, and pricing — ready to forward to your team.</p>
            </div>
          </div>
          <div className="space-y-3">
            <input type="email" placeholder="Work email" className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30" />
            <input type="text" placeholder="Your website URL" className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30" />
            <button className="w-full bg-brand-ink text-white font-bold text-sm py-2.5 rounded-sm hover:bg-brand-ink/90 transition-colors">Download the brief</button>
          </div>
          <p className="font-mono text-xs text-brand-ink/40 mt-3 leading-relaxed">
            We'll send the PDF to your inbox. Your URL helps us personalise any follow-up — no pitch, just context.
          </p>
        </div>
      </div>
    </section>
  )
}

function UpgradeBlock() {
  return (
    <section className="px-6 py-16" style={{ background: 'rgba(252,229,136,0.15)' }}>
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">Ready to go further?</p>
        <div className="border-l-4 border-brand-crimson pl-6">
          <h2 className="text-xl font-bold text-brand-ink mb-4">Class B clients can graduate to Class A.</h2>
          <p className="text-sm text-brand-ink/60 leading-relaxed mb-5">
            When you're running multi-channel campaigns and want to connect every marketing dollar to on-site behaviour,
            Class A bridges that gap. Class B graduates skip portions of Phase 1 — baseline and tracking are already in place.
          </p>
          <Link href="/services/class-a" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
            See what Class A includes →
          </Link>
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
          Ready to turn traffic into revenue?
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

export default function ClassBPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Prerequisites />
        <SetupDeliverables />
        <RetainerCadence />
        <ToolStack />
        <KeyMetrics />
        <SocialProof />
        <NotIncluded />
        <FAQ />
        <PDFDownload />
        <UpgradeBlock />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
