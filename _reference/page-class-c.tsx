/**
 * DUHA MEDIA — Class C Sub-page
 * Route: /services/class-c
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Class C · Foundation</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          "The minimum a self-respecting company needs for online success."
        </h1>
        <p className="text-sm text-white/55 leading-relaxed mb-5 max-w-xl">
          A conversion-informed website for Shopify brands whose digital presence doesn't reflect the quality of their product.
        </p>
        <p className="font-mono text-xs text-white/35">One-time project · ~3 months · Starting at $5,000</p>
      </div>
    </section>
  )
}

function WhoItsFor() {
  const qualifiers = [
    'Your website doesn\'t reflect the quality of your product',
    'You\'re on Shopify but the site was never properly designed',
    'Content changes require a developer — no CMS',
    'Your CRM isn\'t connected to your website',
    'You\'ve never had Clarity or GA4 installed',
    'You want a foundation built to support future CRO',
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Who it's for</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>You need Class C if...</h2>
        <div className="flex flex-col gap-3 mb-8">
          {qualifiers.map(q => (
            <div key={q} className="flex gap-3 items-start">
              <div className="w-0.5 bg-brand-crimson flex-shrink-0 mt-1.5" style={{ height: '1.1rem' }} />
              <p className="text-sm text-brand-ink/60">{q}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 pt-6">
          <p className="text-xs text-brand-ink/40 italic leading-relaxed">
            Not sure? Class C is not required before Class B. If your existing site is solid, you may qualify to enter at Class B directly.{' '}
            <Link href="/services/class-b" className="text-brand-crimson underline underline-offset-2 not-italic">See Class B →</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function WhatsIncluded() {
  const groups = [
    {
      color: '#c20e59',
      label: 'Design',
      items: ['Colors and typography update', 'Conversion-informed UI — CTA placement, form structure, primary actions', 'Engineered UX — flows built to support future optimization'],
    },
    {
      color: '#e82561',
      label: 'Integration',
      items: ['CMS integration — manage content independently after handoff', 'CRM integration — connected to your existing system'],
    },
    {
      color: '#f5c842',
      label: 'Content',
      items: ['Copywriting handled by Duha Media', 'Images sourced or produced by Duha Media'],
    },
    {
      color: '#0F172A',
      label: 'Analytics',
      items: ['Microsoft Clarity — session recording + heatmaps from day one', 'GA4 — baseline traffic and conversion data from launch'],
    },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What's included</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Everything in one engagement.</h2>
        <div className="flex flex-col gap-4">
          {groups.map(g => (
            <div key={g.label} className="border border-black/10 rounded-sm overflow-hidden">
              <div className="bg-black/5 border-b border-black/10 px-5 py-3 flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: g.color }} />
                <p className="font-mono text-xs font-medium text-brand-ink uppercase tracking-wide">{g.label}</p>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-2">
                  {g.items.map(i => (
                    <li key={i} className="text-sm text-brand-ink/60 flex gap-2">
                      <span className="text-brand-ink/30 flex-shrink-0">·</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
          {['CRM development or custom CRM builds', 'A/B testing or active CRO — that\'s Class B'].map(item => (
            <p key={item} className="text-sm text-brand-ink/50 line-through">{item}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

function PDFDownload() {
  return (
    <section className="bg-white px-6 py-12">
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
              <p className="font-mono text-xs text-brand-crimson font-bold mt-1" style={{ fontSize: '8px' }}>PDF</p>
            </div>
            <div>
              <p className="font-bold text-brand-ink text-sm mb-1">Class C — Full engagement brief</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">Scope, deliverables, timeline, and pricing — ready to forward to your team.</p>
            </div>
          </div>
          <div className="space-y-3">
            <input type="email" placeholder="Work email" className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30" />
            <input type="text" placeholder="Your website URL" className="w-full bg-white border border-black/10 rounded-sm px-4 py-2.5 font-mono text-xs text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-ink/30" />
            <button className="w-full bg-brand-ink text-white font-bold text-sm py-2.5 rounded-sm hover:bg-brand-ink/90 transition-colors">
              Download the brief
            </button>
          </div>
          <p className="font-mono text-xs text-brand-ink/40 mt-3 leading-relaxed">
            We'll send the PDF to your inbox. Your URL helps us personalise any follow-up — no pitch, just context.
          </p>
        </div>
      </div>
    </section>
  )
}

function CBConnection() {
  return (
    <section className="px-6 py-16" style={{ background: 'rgba(252,229,136,0.15)' }}>
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-5">What this builds toward</p>
        <div className="border-l-4 border-brand-gold pl-6">
          <h2 className="text-xl font-bold text-brand-ink mb-4">Class C is the foundation Class B is built on.</h2>
          <p className="text-sm text-brand-ink/60 leading-relaxed mb-4">
            Every design decision is made with conversion architecture in mind. Clarity collects behavioral data from day one.
            GA4 has a baseline before we touch anything. When you're ready for Class B — there's no teardown, no rebuild,
            and no wasted runway. Just a layer of optimization added to a site that was always built to receive it.
          </p>
          <Link href="/services/class-b" className="font-mono text-xs text-brand-crimson underline underline-offset-2">
            See what Class B includes →
          </Link>
        </div>
      </div>
    </section>
  )
}

function OptionalRetainer() {
  const items = [
    { title: 'Monthly Slack + Loom update', desc: 'Check-in on site performance and any quick wins.' },
    { title: 'Clarity data review', desc: 'Monthly heatmap review — flagging early behavioral insights.' },
    { title: 'Content guidance', desc: 'Advice on copy updates and site maintenance.' },
    { title: 'Upgrade trigger monitoring', desc: 'We tell you when the data says you\'re ready for Class B.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Optional add-on</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>
          Stay connected after launch. $500/mo.
        </h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">
          Not ready for Class B yet? The retainer keeps the relationship active and the upgrade conversation on your terms.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(i => (
            <div key={i.title} className="border border-black/10 rounded-sm p-5">
              <p className="font-bold text-brand-ink text-sm mb-2">{i.title}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: 'How long does Class C take?', a: 'Approximately 3 months from kickoff to launch. Timeline depends on content approvals and feedback cycles — the more responsive your team, the faster we move.' },
    { q: 'Do I need Class C before Class B?', a: 'No. If your existing site is already solid, you may qualify to enter Class B directly. Eligibility is assessed case by case based on site quality and whether Clarity and GA4 are already installed.' },
    { q: 'Can I skip straight to Class B?', a: 'Possibly. Book a call and we\'ll assess your site. If it\'s conversion-ready and already has behavioral data collecting, you may not need Class C at all.' },
    { q: 'What does onboarding look like?', a: 'Week 1: brand, audience, and goals session. Weeks 2–4: design direction and first round of mockups. Weeks 5–10: build, content, and CMS setup. Weeks 11–12: review, revisions, and launch.' },
    { q: 'Who owns the deliverables?', a: 'You do. All design files, content, and CMS access are yours. There\'s no lock-in — if the engagement ends, you have a fully operational site you control independently.' },
    { q: 'How much of our team\'s time is needed?', a: 'Plan for 1–2 hours per week during the build phase for reviews and approvals. Content reviews require more attention — the more prepared your brand materials are upfront, the smoother this goes.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
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

function DualCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug" style={{ letterSpacing: '-0.01em' }}>
          Ready to build the foundation?
        </h2>
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

export default function ClassCPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhoItsFor />
        <WhatsIncluded />
        <NotIncluded />
        <PDFDownload />
        <CBConnection />
        <OptionalRetainer />
        <FAQ />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
