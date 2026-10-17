const DS3 = window.DuhaMediaDesignSystem_a9da48;
const { Button: SButton, Eyebrow: SEyebrow, AccentHeadline: SHeadline, Metric: SMetric, MetricStrip: SMetricStrip, PhaseTimeline: STimeline, Testimonial: STest, CaseStudyCard: SCase } = DS3;
const wrap = {maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--container-pad)'};
function Section({label, tight, band, dark, children}) {
  const bg = dark?'var(--ink)':band?'var(--gray-light)':'var(--cream)';
  return <section data-screen-label={label} style={{background:bg,color:dark?'var(--cream)':'var(--ink)',padding:`${tight?'64px':'96px'} 0`,position:'relative',overflow:'hidden'}}><div style={wrap}>{children}</div></section>;
}
function LogoStrip() {
  return <Section label="Client logos" tight>
    <SEyebrow muted style={{marginBottom:24}}>Stores we've run numbers for</SEyebrow>
    <div style={{display:'flex',gap:56,alignItems:'center',flexWrap:'wrap',opacity:.55}}>
      {['NORTHSIDE GOODS','KEDZIE & CO','LAKE SUPPLY','MARROW','FIELDHOUSE'].map(n=><span key={n} style={{fontFamily:'var(--font-display)',fontSize:20,color:'var(--ink)',letterSpacing:'0.02em'}}>{n}</span>)}
    </div>
    <p style={{margin:'14px 0 0',fontSize:12,fontWeight:500,color:'var(--gray-warm)',fontFamily:'var(--font-body)'}}>[Demonstrative names — replace with real client marks]</p>
  </Section>;
}
function ProofSection({nav}) {
  return <Section label="Proof (launch fallback)" tight band>
    <SHeadline level={2} text="No case studies yet. Numbers anyway." accent="Numbers anyway."/>
    <p style={{margin:'16px 0 32px',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1rem',color:'var(--gray-warm)',maxWidth:'56ch'}}>Case studies publish here as clients sign off. Until then: what clients say, and how we cap our load. No demo studies, no "coming soon."</p>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20,alignItems:'start'}}>
      <STest quote="They rebuilt the store, ran the ads, then taught my manager to run it. We stopped paying them in month nine — on their schedule." name="J. Alvarez" role="3-location retailer, Chicago"/>
      <STest quote="Third agency we tried. First one that showed us the dashboard instead of a deck." name="M. Okafor" role="Online-only, home goods"/>
      <STest quote="I'd spent $10k with nothing to show. Duha started with what that money should have bought." name="R. Patel" role="Hybrid retail, 2 locations"/>
    </div>
    <div style={{display:'flex',gap:14,alignItems:'center',marginTop:36}}>
      <SButton variant="primary" onClick={()=>nav('book')}>Book a Call</SButton>
      <span style={{fontFamily:'var(--font-body)',fontWeight:500,fontSize:14,color:'var(--gray-warm)'}}>3 of 7 slots filled — capacity is the quality gate.</span>
    </div>
  </Section>;
}
function WhatWeDo({nav}) {
  const panel = {background:'var(--cream)',border:'2px solid var(--ink)',padding:32,cursor:'pointer',display:'flex',flexDirection:'column',gap:12};
  return <Section label="What we do" band>
    <SEyebrow muted style={{marginBottom:16}}>What we do</SEyebrow>
    <SHeadline level={2} text="We build it. Then we grow it." accent="Then we grow it."/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:40}}>
      <div style={panel} onClick={()=>nav('services')}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',textTransform:'uppercase'}}>01 — Shopify Theme Development</span>
        <p style={{margin:0,fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1rem',lineHeight:1.6}}>Store built or rebuilt to convert. Half-built and not working? That's where most clients start. Builds from $5K.</p>
        <span style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:14,borderBottom:'2px solid var(--ink)',alignSelf:'flex-start'}}>Phase 1 — Build Foundation</span>
      </div>
      <div style={panel} onClick={()=>nav('services')}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',textTransform:'uppercase'}}>02 — Marketing</span>
        <p style={{margin:0,fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1rem',lineHeight:1.6}}>Email, ads, content, SEO, GBP, CRM — one team runs the whole engine. From $1K/mo.</p>
        <span style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:14,borderBottom:'2px solid var(--ink)',alignSelf:'flex-start'}}>Phase 2 — Operate Engine</span>
      </div>
    </div>
  </Section>;
}
function Process() {
  const steps=[{n:'01',name:'Intake'},{n:'02',name:'Research'},{n:'03',name:'Branding'},{n:'04',name:'Design'},{n:'05',name:'Development'},{n:'06',name:'Onboarding'},{n:'07',name:'Engine launch'},{n:'08',name:'Independence handover'}];
  return <Section label="Process">
    <div aria-hidden="true" style={{position:'absolute',right:-170,bottom:40,width:340,height:340,transform:'rotate(45deg)',background:'var(--ground-accent)'}}></div>
    <div style={{position:'relative'}}>
    <SEyebrow muted style={{marginBottom:16}}>How it runs</SEyebrow>
    <SHeadline level={2} text="Eight steps. The last one is the point." accent="the point."/>
    <div style={{marginTop:40}}><STimeline phases={steps} active={7} compact={false}/></div>
    </div>
  </Section>;
}
function Founder() {
  return <Section label="Founder" tight band>
    <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:48,alignItems:'center'}}>
      <div style={{aspectRatio:'4/5',background:'var(--gray-warm)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--cream)',fontFamily:'var(--font-body)',fontWeight:500,fontSize:13}}>founder photo — camera-work slot</div>
      <div>
        <SEyebrow muted style={{marginBottom:16}}>Who you'd work with</SEyebrow>
        <SHeadline level={2} text="Chicago operators, not account managers."/>
        <p style={{margin:'20px 0 0',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1.125rem',lineHeight:1.6,maxWidth:'52ch'}}>You've managed five freelancers who never talked to each other. You've had an agency disappear after launch. We built Duha to be the opposite: one team, one dashboard, and a handover date.</p>
      </div>
    </div>
  </Section>;
}
function FinalCTA({nav}) {
  return <Section label="Final CTA" dark>
    <div style={{textAlign:'center',maxWidth:760,margin:'0 auto'}}>
      <h2 style={{margin:0,fontFamily:'var(--font-display)',fontWeight:400,fontSize:'var(--text-h2)',lineHeight:1.05,textTransform:'uppercase'}}>Your store already has the demand. It's leaking it.</h2>
      <p style={{margin:'20px 0 0',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1.125rem',opacity:.85}}>3 builds in progress. We cap at 7.</p>
      <p style={{margin:'4px 0 0',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'0.8125rem',opacity:.5}}>The cap keeps every build senior-staffed — that's the whole reason.</p>
      <div style={{marginTop:32,display:'flex',justifyContent:'center'}}><SButton variant="primary" size="lg" onClick={()=>nav('book')}>Book a Call</SButton></div>
    </div>
  </Section>;
}
Object.assign(window, { Section, LogoStrip, ProofSection, WhatWeDo, Process, Founder, FinalCTA });
