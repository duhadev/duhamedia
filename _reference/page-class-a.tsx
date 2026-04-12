/**
 * DUHA MEDIA — Class A Sub-page
 * Route: /services/class-a
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
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Class A · Growth Intensive</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
          "A 12-week transformation that builds your growth system from the ground up — then we run it with you."
        </h1>
        <p className="text-sm text-white/55 leading-relaxed mb-5 max-w-xl">
          For scaling Shopify brands with active paid campaigns who want to stop running CRO and marketing in separate silos.
        </p>
        <p className="font-mono text-xs text-white/35">$25,000 intensive (12 weeks) + $3,000–$5,000/mo retainer · Begins week 13</p>
      </div>
    </section>
  )
}

function WhoItsFor() {
  const qualifiers = [
    'Revenue in the $500K–$5M range',
    'Active paid ad spend across Facebook, Instagram, or Google',
    'Campaigns not connected to conversion data on-site',
    'A team that needs a documented playbook — not just monthly reports',
    'Ready for a committed 12-week engagement',
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Who it's for</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-5" style={{ letterSpacing: '-0.01em' }}>
          Class A is for brands ready to connect every marketing dollar to on-site behaviour.
        </h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">
          Most businesses run paid campaigns and CRO in separate silos. Class A bridges that gap — every ad dollar gets connected to what actually happens after the click.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {qualifiers.map(q => (
            <div key={q} className="flex gap-3 items-start">
              <div className="w-0.5 bg-brand-crimson flex-shrink-0 mt-1.5" style={{ height: '1.1rem' }} />
              <p className="text-sm text-brand-ink/60">{q}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-ink/40 italic border-t border-black/10 pt-5 leading-relaxed">
          Graduating from Class B? You skip or reduce Phase 1 scope — baseline and tracking are already in place. Retainer credit applied. Discussed at onboarding.
        </p>
      </div>
    </section>
  )
}

function Phase({ phase, title, weeks, desc, deliverables, handoff, borderColor, bgColor, monoColor }: {
  phase: string; title: string; weeks: string; desc: string
  deliverables: { title: string; body: string }[]
  handoff: string[]; borderColor: string; bgColor: string; monoColor: string
}) {
  return (
    <section className="px-6 py-16" style={{ background: bgColor, borderTop: `3px solid ${borderColor}` }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <p className="font-mono text-xs font-medium uppercase tracking-widest" style={{ color: monoColor }}>{phase}</p>
          <p className="font-mono text-xs text-brand-ink/40">{weeks}</p>
        </div>
        <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: '-0.01em' }}>{title}</h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">{desc}</p>
        <div className="flex flex-col gap-3 mb-8">
          {deliverables.map(d => (
            <div key={d.title} className="border border-black/10 rounded-sm overflow-hidden bg-white">
              <div className="bg-black/5 border-b border-black/10 px-5 py-3">
                <p className="font-bold text-brand-ink text-sm">{d.title}</p>
              </div>
              <p className="px-5 py-4 text-sm text-brand-ink/60 leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-black/15 pt-6">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-wide mb-3">Handoff at end of {weeks.split('–')[1] ? weeks : weeks}</p>
          <ul className="space-y-2">
            {handoff.map(h => (
              <li key={h} className="flex gap-2 text-xs text-brand-ink/60">
                <span style={{ color: borderColor }} className="flex-shrink-0">→</span>{h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const rows = [
    { before: 'Campaigns running', after: 'Campaigns connected to CVR' },
    { before: 'No CVR baseline', after: 'Full funnel baseline tracked' },
    { before: 'Ad spend tracked by channel', after: 'Ad spend tied to on-site outcomes' },
    { before: 'CRO done separately', after: 'CRO runs continuously' },
    { before: 'No attribution model', after: 'UTM attribution verified' },
    { before: 'Monthly report from agency', after: 'Live client dashboard — always on' },
    { before: 'No documented system', after: 'Playbook your team can run' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What Class A changes</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Before and after the engagement.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="grid grid-cols-2 border-b border-black/10">
            <div className="px-5 py-3 bg-black/5 border-r border-black/10">
              <p className="font-mono text-xs font-medium text-brand-ink/40 uppercase tracking-wide">Before</p>
            </div>
            <div className="px-5 py-3">
              <p className="font-mono text-xs font-medium text-brand-crimson uppercase tracking-wide">After</p>
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className={`grid grid-cols-2 ${i < rows.length - 1 ? 'border-b border-black/10' : ''}`}>
              <div className="px-5 py-4 bg-black/5 border-r border-black/10">
                <p className="text-sm text-brand-ink/50">{r.before}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-brand-ink/70">{r.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CampaignPlaybook() {
  const components = [
    { title: 'UTM naming rules', body: 'A standardised taxonomy for every campaign, ad set, and creative — consistent attribution across channels and over time.' },
    { title: 'Attribution model', body: 'How credit is assigned across touchpoints — documented and agreed so reporting is consistent regardless of who runs it.' },
    { title: 'Channel guidelines', body: 'Facebook, Instagram, Google — optimisation rules based on what Phase 1 revealed about your audience.' },
    { title: 'Creative alignment standards', body: 'What ad creative should do, how it connects to landing page messaging, and how to test creative variables systematically.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The campaign playbook</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: '-0.01em' }}>A system your team can run independently.</h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">
          The playbook is one of the most distinctive Class A deliverables. It's not a report — it's operational documentation that makes your marketing team more effective whether or not the retainer continues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map(c => (
            <div key={c.title} className="bg-white border border-black/10 rounded-sm p-5">
              <p className="font-bold text-brand-ink text-sm mb-2">{c.title}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClientDashboard() {
  const modules = [
    { title: 'Audit findings', desc: 'Phase 1 report + baseline' },
    { title: 'Change log', desc: 'Every update + rationale' },
    { title: 'A/B test results', desc: 'Winners, losers, next tests' },
    { title: '90-day roadmap', desc: 'Live + updated each quarter' },
    { title: 'Campaign playbook', desc: 'UTM rules + attribution' },
    { title: 'Monthly reports', desc: 'Performance vs baseline' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Client dashboard</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Everything in one place — always live.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="bg-brand-ink px-5 py-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-magenta" />
            <p className="font-bold text-white text-sm">Duha Media Client Dashboard</p>
            <span className="ml-auto font-mono text-xs bg-brand-magenta text-white px-2 py-0.5 rounded-sm">Coming soon</span>
          </div>
          <div className="p-5">
            <p className="text-sm text-brand-ink/60 leading-relaxed mb-5">
              Every client gets a live dashboard with full access to their documentation, reports, change log, and roadmap — viewable at any time, not just when a report lands in your inbox.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {modules.map(m => (
                <div key={m.title} className="bg-black/5 rounded-sm p-3">
                  <p className="font-bold text-brand-ink text-xs mb-1">{m.title}</p>
                  <p className="text-xs text-brand-ink/60">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Retainer() {
  const cards = [
    { title: 'Campaign-to-CVR correlation report', body: 'Monthly — how each channel drives behaviour and outcomes on-site.', unique: true },
    { title: 'Cross-channel funnel analysis', body: 'Segmented by UTM/source — paid vs organic vs social visitor behaviour.', unique: true },
    { title: 'Continuous CRO optimisation', body: 'Live traffic data drives all changes — no scheduled sprints.', unique: false },
    { title: 'Strategic marketing recommendations', body: 'Budget allocation, creative direction, targeting decisions — monthly.', unique: false },
    { title: 'Weekly calls + async updates', body: 'Slack + Loom between calls. Quarterly strategic review + refreshed roadmap.', unique: false },
    { title: 'Full documentation updates', body: 'Every change logged with rationale — dashboard stays live and current.', unique: false },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Retainer — begins week 13</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-3" style={{ letterSpacing: '-0.01em' }}>$3,000–$5,000/mo. Continuous optimisation built on the intensive.</h2>
        <p className="text-sm text-brand-ink/60 leading-relaxed mb-8">
          The intensive feeds directly into the retainer. By week 13 the system is live, the first 90 days are planned, and the retainer starts with a full queue — not a blank slate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map(c => (
            <div key={c.title}
              className={`bg-white border rounded-sm p-5 ${c.unique ? 'border-l-4 border-brand-crimson' : 'border-black/10'}`}>
              <p className="font-bold text-brand-ink text-sm mb-2">{c.title}</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">{c.body}</p>
              {c.unique && <p className="font-mono text-xs text-brand-crimson mt-3">Unique to Class A</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingTerms() {
  const rows = [
    { label: 'Intensive', value: '$25,000 fixed scope. The three phases as defined. Any changes are quoted separately and agreed in writing before work begins.' },
    { label: 'Retainer start', value: 'Begins automatically at week 13 unless the client opts out in writing by week 10. This structure ensures continuity — the intensive is designed to feed the retainer, not stand alone.' },
    { label: 'Retainer rate', value: '$3,000–$5,000/mo. Final rate agreed at the end of Phase 1 when channel complexity, ad spend, and team size are fully known. Never exceeds the quoted range without written agreement.' },
    { label: 'Opt-out window', value: 'Written opt-out required by week 10. Opt-out keeps all deliverables — dashboard, playbook, funnel map, change log. No clawback on completed work.' },
  ]
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Pricing + terms</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>Fixed scope. No surprises.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          {rows.map((r, i) => (
            <div key={r.label}
              className={`flex gap-5 p-5 ${i < rows.length - 1 ? 'border-b border-black/10' : ''}`}>
              <p className="font-mono text-xs font-medium text-brand-ink min-w-28 flex-shrink-0 mt-0.5">{r.label}</p>
              <p className="text-sm text-brand-ink/60 leading-relaxed">{r.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatClassAIsNot() {
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">What Class A is not</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-4" style={{ letterSpacing: '-0.01em' }}>Advisory, not execution.</h2>
        <div className="bg-black/5 border border-black/10 rounded-sm p-6">
          <p className="text-sm text-brand-ink/60 italic leading-relaxed mb-5">
            Duha Media advises on strategy. Execution of the following stays with your team or existing agency partners.
          </p>
          <div className="space-y-3">
            {[
              'Paid media buying or direct ad campaign management',
              'SEO content production or organic content strategy',
              'CRM development or custom CRM builds',
              'Creative production — ad copy, video, photography',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <span className="font-mono text-sm text-brand-ink/30">×</span>
                <p className="text-sm text-brand-ink/50 line-through">{item}</p>
              </div>
            ))}
          </div>
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
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>What Class A actually produces.</h2>
        <div className="border border-black/10 rounded-sm overflow-hidden">
          <div className="bg-brand-ink px-6 py-5 text-center">
            <p className="font-mono text-5xl font-bold text-brand-magenta leading-none">+XX%</p>
            <p className="font-mono text-xs text-white/40 mt-2">CVR lift · 90 days post-intensive</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-brand-ink/60 italic leading-relaxed mb-3">
              "[Client quote — specific to their channels, spend, and team situation.]"
            </p>
            <p className="font-mono text-xs text-brand-ink/40 mb-4">— [Name], [Title] · Shopify brand · $1.2M revenue · 3 active channels</p>
            <p className="font-mono text-xs text-brand-ink/30 border-t border-black/10 pt-4 italic">
              Placeholder — swap in first client result. Lead with metric, revenue context, and channel complexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: 'What\'s the difference between the intensive and the retainer?', a: 'The intensive builds the system — 12 weeks of audits, site rebuild, tracking infrastructure, and documented playbook. The retainer runs and optimises it continuously. You can\'t do the retainer without the intensive, and the intensive is designed to make the retainer immediately productive from week 13.' },
    { q: 'We already have a media buyer running our ads. How does that work?', a: 'That\'s the typical Class A setup. Duha Media doesn\'t run ads — we connect the campaigns your media buyer is running to on-site behaviour and conversion data. Your media buyer gets cleaner attribution data. You get a clearer picture of which spend is actually producing revenue.' },
    { q: 'How is the retainer rate finalised?', a: 'The range is $3,000–$5,000/mo. The final rate is agreed at the end of Phase 1 when channel complexity, ad spend volume, and team size are fully understood. It never exceeds the quoted range without written agreement before the retainer begins.' },
    { q: 'What happens if our priorities shift mid-engagement?', a: 'Phase 1 is the alignment point. If major business priorities shift before Phase 2 begins, scope can be adjusted with written agreement. Once Phase 2 is underway, changes outside the defined scope are quoted separately — the fixed-scope structure protects both sides from scope creep.' },
    { q: 'How much internal time does this require from our team?', a: 'During the intensive — 2–3 hours per week for reviews and approvals, plus the Phase 3 strategy session which requires decision-makers present. During the retainer — under 2 hours per month. Weekly calls are 30 minutes. Reports are delivered async.' },
    { q: 'What if we opt out of the retainer after the intensive?', a: 'Written opt-out by week 10. You keep everything — the dashboard, playbook, funnel map, audit findings, change log, and 90-day roadmap. The Convert.com account is client-billed and stays with you. No clawback on completed work.' },
    { q: 'What does "fixed scope" actually mean when things come up?', a: 'The $25,000 covers the three phases as defined. If new channels need to be added, the rebuild scope expands, or additional deliverables are requested mid-engagement, those are quoted separately and agreed in writing. Nothing is added to scope without your sign-off.' },
    { q: 'Who owns the work when the engagement ends?', a: 'You own everything. Dashboard access, the campaign playbook, funnel map, all design files, and the change log. The Convert.com account is client-billed in your name. If the retainer ends, you have a fully operational system your team can run — or hand to any other partner.' },
  ]
  return (
    <section className="bg-brand-offwhite px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Common questions</p>
        <h2 className="text-2xl font-bold text-brand-ink mb-8" style={{ letterSpacing: '-0.01em' }}>
          What comes up before leadership signs off.
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
              <p className="font-mono font-bold text-brand-crimson mt-1" style={{ fontSize: '7px' }}>PDF</p>
            </div>
            <div>
              <p className="font-bold text-brand-ink text-sm mb-1">Class A — Full engagement brief</p>
              <p className="text-xs text-brand-ink/60 leading-relaxed">All three phases, retainer scope, playbook breakdown, pricing terms, and FAQ — ready to share with your leadership team.</p>
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

function DualCTA() {
  return (
    <section className="bg-brand-ink px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug" style={{ letterSpacing: '-0.01em' }}>Ready to build the system?</h2>
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

export default function ClassAPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhoItsFor />
        <Phase
          phase="Phase 01 — Discovery & Foundation"
          title="Audit everything before touching anything."
          weeks="Weeks 1–4"
          desc="No changes are made in Phase 1. The entire four weeks is diagnostic — building a complete, documented picture of where you are before a single pixel moves. Everything discovered here becomes the blueprint for Phase 2."
          deliverables={[
            { title: 'Full marketing audit', body: 'Every active channel reviewed — campaign history, spend breakdown, performance to date, creative direction, and attribution gaps. The audit surfaces what\'s being spent, what\'s working, and where money is leaking.' },
            { title: 'CRO baseline report', body: 'Current conversion rates, funnel drop-offs, Core Web Vitals, and a ranked list of prioritised quick wins — each with a documented hypothesis before any test begins.' },
            { title: 'UTM taxonomy + tracking setup', body: 'Clarity, GA4, and campaign attribution configured and verified across every active source. Without a clean UTM structure, you can\'t connect ad spend to on-site outcomes — this is the infrastructure everything else runs on.' },
          ]}
          handoff={['Marketing audit report', 'CRO baseline + prioritised hypothesis backlog', 'Tracking verified across all sources']}
          borderColor="#c20e59"
          bgColor="#fff5f8"
          monoColor="#c20e59"
        />
        <Phase
          phase="Phase 02 — Build"
          title="Rebuild the site and the system around what the data shows."
          weeks="Weeks 5–10"
          desc="Phase 1 findings drive every Phase 2 decision. The site is rebuilt around conversion architecture, the A/B testing framework goes live, and the campaign playbook is documented for your internal team to follow independently."
          deliverables={[
            { title: 'Full site CRO overhaul', body: 'UX/UI redesign, landing page rebuilds, and Convert.com A/B testing framework — all live and running by the end of Phase 2. Every design decision tied to a specific audit finding.' },
            { title: 'Conversion funnel map', body: 'The complete journey from ad impression to closed sale — fully documented. Every step, every drop-off point, every variable that affects the outcome. Your team can use this map independently of Duha Media.' },
            { title: 'Campaign playbook', body: 'UTM naming rules, attribution model, channel-specific optimisation guidelines, and creative alignment standards — written for your team to follow without needing to interpret.' },
          ]}
          handoff={['Rebuilt site live — CRO architecture in place', 'A/B testing framework live — first test running', 'Conversion funnel map — complete and documented', 'Campaign playbook — ready for your team']}
          borderColor="#e82561"
          bgColor="#fff0f5"
          monoColor="#e82561"
        />
        <Phase
          phase="Phase 03 — Launch & Handoff"
          title="Hand off the system. Start the retainer ready on day one."
          weeks="Weeks 11–12"
          desc="The intensive doesn't end with delivery — it ends with alignment. Your team walks away knowing exactly what was built, why every decision was made, and what happens next. The 90-day roadmap means the retainer starts with a full queue, not a blank slate."
          deliverables={[
            { title: '90-day strategic roadmap', body: 'A prioritised list of A/B tests, campaign actions, and CRO initiatives — ready to execute from day one of the retainer. Not a wish list. A sequenced, data-backed plan with rationale for every item.' },
            { title: 'Full documentation package', body: 'Everything from the intensive — audit findings, change log, playbook, funnel map, and roadmap — delivered via your client dashboard. Every decision documented with its rationale.' },
            { title: 'Live strategy session', body: 'A dedicated session with your team — walkthrough of the full system, Q&A, and alignment on retainer priorities. Decision-makers need to be in the room.' },
          ]}
          handoff={['90-day roadmap — prioritised and ready', 'Client dashboard — live with full documentation', 'Strategy session complete — team aligned']}
          borderColor="#f5c842"
          bgColor="#fffbeb"
          monoColor="#a07800"
        />
        <BeforeAfter />
        <CampaignPlaybook />
        <ClientDashboard />
        <Retainer />
        <PricingTerms />
        <WhatClassAIsNot />
        <SocialProof />
        <FAQ />
        <PDFDownload />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
