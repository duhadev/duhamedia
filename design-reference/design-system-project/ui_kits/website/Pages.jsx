const DS4 = window.DuhaMediaDesignSystem_a9da48;
const { Button: PButton, Eyebrow: PEyebrow, AccentHeadline: PHeadline, PhaseTimeline: PTimeline, FAQItem: PFAQ, Testimonial: PTest, Input: PInput } = DS4;
function ServicesHub({nav}) {
  const panel = {background:'var(--cream)',border:'2px solid var(--ink)',padding:36,display:'flex',flexDirection:'column',gap:14};
  return <main data-screen-label="Services Hub">
    <Section label="Services hero">
      <PEyebrow muted style={{marginBottom:16}}>Services</PEyebrow>
      <PHeadline as="h1" level={1} text="We build it. We run it. Then it's yours." accent="Then it's yours." style={{maxWidth:'16ch'}}/>
      <div style={{marginTop:48}}><PTimeline/></div>
    </Section>
    <Section label="Track split" tight band>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        <div style={panel}>
          <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',textTransform:'uppercase'}}>Shopify Theme Development</span>
          <p style={{margin:0,fontFamily:'var(--font-body)',fontWeight:500,lineHeight:1.6}}>Revision of a store that isn't working, or a build from scratch. Most clients arrive with the first. Builds from $5K.</p>
          <PButton variant="ghost" style={{alignSelf:'flex-start'}}>Phase 1 — see the build track</PButton>
        </div>
        <div style={panel}>
          <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',textTransform:'uppercase'}}>Marketing</span>
          <p style={{margin:0,fontFamily:'var(--font-body)',fontWeight:500,lineHeight:1.6}}>Email, paid ads, content, SEO, GBP, CRM — the full engine, one team. From $1K/mo, 6-month minimum.</p>
          <PButton variant="ghost" style={{alignSelf:'flex-start'}}>Phase 2 — see the engine</PButton>
        </div>
      </div>
    </Section>
    <Section label="Why both together">
      <PHeadline level={2} text="Two ways this usually goes wrong." accent="wrong."/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,marginTop:36,fontFamily:'var(--font-body)'}}>
        <div><span style={{fontFamily:'var(--font-display)',fontSize:'1.125rem',textTransform:'uppercase'}}>The agency that disappears</span>
          <p style={{margin:'10px 0 0',fontWeight:500,lineHeight:1.6}}>Launch day is their finish line. Yours is month 12. The ongoing engine — and the handover at the end of it — is the structural difference.</p></div>
        <div><span style={{fontFamily:'var(--font-display)',fontSize:'1.125rem',textTransform:'uppercase'}}>The five-vendor coordination tax</span>
          <p style={{margin:'10px 0 0',fontWeight:500,lineHeight:1.6}}>A theme dev, an email person, an ads agency, a content freelancer, an SEO. None of them talk. You're the project manager now.</p></div>
      </div>
    </Section>
    <Section label="Services FAQ" tight band>
      <PHeadline level={3} text="Routing questions"/>
      <div style={{marginTop:20,maxWidth:720}}>
        <PFAQ question="What does this cost?" defaultOpen>Builds start at $5K. Marketing engines start at $1K/mo with a 6-month minimum. Exact numbers on the call, not after it.</PFAQ>
        <PFAQ question="Do you lock clients into retainers?">No — the endgame is your team running it. Phase 3 is a documented handover.</PFAQ>
        <PFAQ question="Can we start with just a build?">Yes. Phase 1 stands alone. Most clients add the engine once the store stops leaking.</PFAQ>
      </div>
    </Section>
    <FinalCTA nav={nav}/>
  </main>;
}
function FAQPage({nav}) {
  return <main data-screen-label="FAQ">
    <Section label="FAQ hero" tight>
      <PEyebrow muted style={{marginBottom:16}}>FAQ</PEyebrow>
      <PHeadline as="h1" level={1} text="Straight answers." accent="Straight"/>
      <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap'}}>
        {['Pricing & Contracts','Builds','Marketing','Process & Trust'].map(c=><span key={c} style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:14,border:'2px solid var(--ink)',padding:'10px 16px'}}>{c}</span>)}
      </div>
    </Section>
    <Section label="FAQ pricing" tight band>
      <PHeadline level={3} text="Pricing & Contracts"/>
      <div style={{marginTop:16,maxWidth:720}}>
        <PFAQ question="What does it cost?" defaultOpen>Builds from $5K. Engines from $1K/mo, 6-month minimum. If those numbers don't work, we're not your team — no hard feelings.</PFAQ>
        <PFAQ question="Do you lock clients into retainers?">No — the endgame is your team running it. We train yours, document everything, and hand over.</PFAQ>
        <PFAQ question="Why the 6-month minimum on marketing?">Engines compound. Anything shorter and we'd be selling you a sprint dressed as a system.</PFAQ>
      </div>
      <div style={{display:'flex',gap:14,marginTop:36,alignItems:'center'}}>
        <PButton variant="primary" onClick={()=>nav('book')}>Book a Call</PButton>
        <span style={{fontFamily:'var(--font-body)',fontWeight:500,fontSize:14,color:'var(--gray-warm)'}}>Quick question instead? Contact us.</span>
      </div>
    </Section>
  </main>;
}
function BookACall() {
  return <main data-screen-label="Book a Call">
    <Section label="Book hero" tight>
      <PEyebrow muted style={{marginBottom:16}}>Book a call</PEyebrow>
      <PHeadline as="h1" level={1} text="30 minutes. Your numbers, not a pitch." accent="Your numbers," style={{maxWidth:'18ch'}}/>
      <p style={{margin:'20px 0 0',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1.125rem',lineHeight:1.6,maxWidth:'52ch'}}>For established stores netting $500K–$5M. We'll look at where revenue is leaking and tell you whether we're the right fix — including when we're not.</p>
    </Section>
    <Section label="Booking" tight band>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}}>
        <div style={{background:'var(--cream)',border:'2px solid var(--ink)',minHeight:320,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-body)',fontWeight:500,fontSize:13,color:'var(--gray-warm)'}}>calendar embed</div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <span style={{fontFamily:'var(--font-display)',fontSize:'1.125rem',textTransform:'uppercase'}}>Pre-call homework</span>
          <PInput label="Store URL" placeholder="https://"/>
          <PInput label="Annual revenue range" placeholder="$500K–$1M"/>
          <PInput label="What's not working?" textarea/>
          <PButton variant="primary" style={{alignSelf:'flex-start'}}>Send it</PButton>
        </div>
      </div>
      <div style={{marginTop:48,maxWidth:560}}>
        <PTest quote="The call was them asking hard questions about my margins. Refreshing." name="D. Kim" role="Online-only, apparel"/>
      </div>
    </Section>
  </main>;
}
Object.assign(window, { ServicesHub, FAQPage, BookACall });
