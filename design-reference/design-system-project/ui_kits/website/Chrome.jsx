const DS = window.DuhaMediaDesignSystem_a9da48;
const { Button, Eyebrow } = DS;
function Header({nav, page}) {
  const links = ['Work','Services','Testimonials','About','FAQ'];
  return <header style={{position:'sticky',top:0,zIndex:50,background:'var(--cream)',borderBottom:'1px solid var(--border-divider)'}}>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--container-pad)',display:'flex',alignItems:'center',justifyContent:'space-between',height:72}}>
      <a href="#" onClick={e=>{e.preventDefault();nav('home');}} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',color:'var(--ink)'}}>
        <img src="../../assets/logo.png" alt="" style={{width:34,height:34}}/>
        <span style={{fontFamily:'var(--font-display)',fontSize:18,letterSpacing:'-0.01em'}}>DUHA MEDIA</span>
      </a>
      <nav style={{display:'flex',alignItems:'center',gap:28}}>
        {links.map(l=><a key={l} href="#" onClick={e=>{e.preventDefault();nav(l.toLowerCase());}} style={{fontFamily:'var(--font-body)',fontWeight:page===l.toLowerCase()?700:500,fontSize:15,color:'var(--ink)',textDecoration:'none',borderBottom:page===l.toLowerCase()?'2px solid var(--accent-primary)':'2px solid transparent',paddingBottom:2}}>{l}</a>)}
        <Button variant="primary" size="sm" onClick={()=>nav('book')}>Book a Call</Button>
      </nav>
    </div>
  </header>;
}
function Footer() {
  const col = {display:'flex',flexDirection:'column',gap:10,fontSize:14,fontWeight:500};
  const a = {color:'var(--cream)',textDecoration:'none',opacity:.75};
  const h = {fontWeight:700,fontSize:13,textTransform:'uppercase',letterSpacing:'0.08em',opacity:1,marginBottom:4};
  return <footer style={{background:'var(--ink)',color:'var(--cream)',fontFamily:'var(--font-body)'}}>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'64px var(--container-pad) 32px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1.5fr',gap:40}}>
      <div style={col}>
        <span style={{display:'flex',alignItems:'center',gap:10}}><img src="../../assets/logo.png" alt="" style={{width:30,height:30}}/><span style={{fontFamily:'var(--font-display)',fontSize:16}}>DUHA MEDIA</span></span>
        <span style={{opacity:.75,maxWidth:'28ch'}}>One team. Store, engine, then yours to run. Chicago.</span>
      </div>
      <div style={col}><span style={h}>Pages</span><a style={a} href="#">Work</a><a style={a} href="#">About</a><a style={a} href="#">Testimonials</a><a style={a} href="#">Book a Call</a></div>
      <div style={col}><span style={h}>Services</span><a style={a} href="#">Shopify Theme Development</a><a style={a} href="#">Marketing</a></div>
      <div style={col}><span style={h}>Resources</span><a style={a} href="#">Newsletter</a><a style={a} href="#">Review Hub</a><a style={a} href="#">FAQ</a><a style={a} href="#">Contact</a></div>
      <div style={col}><span style={h}>Newsletter</span><span style={{opacity:.75}}>One useful email a month. Numbers included.</span>
        <div style={{display:'flex',gap:8}}><input placeholder="you@store.com" style={{flex:1,background:'transparent',border:'2px solid var(--cream)',color:'var(--cream)',padding:'10px 12px',fontFamily:'var(--font-body)',fontSize:14,minWidth:0}}/><Button variant="ghost-light" size="sm">Join</Button></div>
      </div>
    </div>
    <div style={{borderTop:'1px solid rgba(250,247,242,.2)'}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'16px var(--container-pad)',display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:500,opacity:.6}}>
        <span>© 2026 Duha Media LLC</span>
        <span style={{display:'flex',gap:20}}><a style={a} href="#">Privacy</a><a style={a} href="#">Terms</a><a style={a} href="#">Cookies</a><a style={a} href="#">GDPR</a></span>
      </div>
    </div>
  </footer>;
}
Object.assign(window, { Header, Footer });
