const DS2 = window.DuhaMediaDesignSystem_a9da48;
const { Button: HButton, Badge: HBadge, Eyebrow: HEyebrow, MetricStrip: HMetricStrip } = DS2;
function Hero({nav}) {
  return <section data-screen-label="Hero" style={{position:'relative',overflow:'hidden',background:'var(--cream)'}}>
    <div aria-hidden="true" style={{position:'absolute',right:'-8%',top:'50%',width:520,height:520,transform:'translateY(-50%) rotate(45deg)',background:'var(--ground-accent)',zIndex:0}}></div>
    <div aria-hidden="true" style={{position:'absolute',right:'24%',top:'8%',width:120,height:120,transform:'rotate(45deg)',border:'2px solid var(--ground-accent)',zIndex:0}}></div>
    <span aria-hidden="true" style={{position:'absolute',left:28,top:'50%',transform:'rotate(-90deg) translateX(50%)',transformOrigin:'left',fontFamily:'var(--font-body)',fontWeight:700,fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gray-warm)',whiteSpace:'nowrap'}}>Build · Operate · Hand over</span>
    <div style={{position:'relative',zIndex:1,maxWidth:'var(--container-max)',margin:'0 auto',padding:'96px var(--container-pad) 88px'}}>
      <HEyebrow tick style={{color:'var(--ink)'}}>Integrated ecommerce growth partner — Chicago</HEyebrow>
      <div style={{display:'flex',alignItems:'flex-start',gap:24,marginTop:20}}>
        <h1 style={{margin:0,fontFamily:'var(--font-display)',fontWeight:400,fontSize:'var(--text-h1)',lineHeight:'var(--leading-h1)',textTransform:'uppercase',letterSpacing:'-0.01em',color:'var(--ink)',maxWidth:'14ch'}}>Your ecommerce growth team, <span style={{color:'var(--accent-primary)'}}>until you don't need one.</span></h1>
        <HBadge tone="fill" style={{marginTop:8,flexShrink:0}}>$X.XM client revenue tracked</HBadge>
      </div>
      <p style={{margin:'28px 0 0',fontFamily:'var(--font-body)',fontWeight:500,fontSize:'var(--text-body-size)',lineHeight:'var(--leading-body)',color:'var(--ink)',maxWidth:'52ch'}}>One team builds your store, runs your marketing, and trains yours to take over. Builds from $5K. Engines from $1K/mo.</p>
      <p style={{margin:'6px 0 0',fontSize:12,fontWeight:500,color:'var(--gray-warm)',fontFamily:'var(--font-body)'}}>[STRATEGIC PLACEHOLDER — hero copy client-authored]</p>
      <div style={{display:'flex',gap:14,marginTop:32}}>
        <HButton variant="primary" size="lg" onClick={()=>nav('book')}>Book a Call</HButton>
        <HButton variant="ghost" size="lg" onClick={()=>nav('work')}>See the Work</HButton>
      </div>
    </div>
  </section>;
}
function ScarcityStrip() {
  return <section data-screen-label="Scarcity strip" style={{borderTop:'var(--border-hairline)',borderBottom:'var(--border-hairline)'}}>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'28px var(--container-pad)',display:'flex',gap:96,fontFamily:'var(--font-body)'}}>
      {[['3 projects ongoing','Current load, shown transparently.'],['Max 7 client capacity','The cap is our quality gate, not a countdown.']].map(([big,quiet])=>
        <div key={big} style={{display:'flex',gap:14}}><span aria-hidden="true" style={{width:9,height:9,background:'var(--ground-accent)',transform:'rotate(45deg)',flexShrink:0,marginTop:11}}></span><div><span style={{fontFamily:'var(--font-display)',fontSize:'1.75rem',textTransform:'uppercase',color:'var(--ink)'}}>{big}</span>
        <span style={{display:'block',marginTop:4,fontSize:'0.8125rem',fontWeight:500,color:'var(--gray-warm)'}}>{quiet}</span></div></div>)}
    </div>
  </section>;
}
Object.assign(window, { Hero, ScarcityStrip });
