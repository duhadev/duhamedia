import React from 'react';
export function CaseStudyCard({client, metric, metricLabel, summary, href='#', image, tall=false, style}) {
  return <a href={href} style={{display:'flex',flexDirection:'column',background:'var(--gray-light)',textDecoration:'none',color:'var(--ink)',fontFamily:'var(--font-body)',transition:'box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',...style}}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-lift)';e.currentTarget.style.transform='translateY(-4px)';}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow='';e.currentTarget.style.transform='';}}>
    <div style={{aspectRatio:tall?'4/3':'16/9',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      {image ? <img src={image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> :
      <span style={{color:'var(--cream)',fontWeight:500,fontSize:'0.8125rem',opacity:.6}}>dashboard screenshot</span>}
    </div>
    <div style={{padding:'var(--space-5)'}}>
      <span style={{fontWeight:700,fontSize:'0.8125rem',textTransform:'uppercase',letterSpacing:'var(--tracking-eyebrow)',color:'var(--gray-warm)'}}>{client}</span>
      <span style={{display:'block',fontFamily:'var(--font-display)',fontSize:'2.5rem',lineHeight:1.05,marginTop:8,color:'var(--accent-primary)'}}>{metric}</span>
      <span style={{display:'block',fontWeight:700,fontSize:'0.875rem',textTransform:'uppercase',letterSpacing:'0.04em',marginTop:4}}>{metricLabel}</span>
      {summary && <p style={{margin:'10px 0 0',fontWeight:500,fontSize:'0.9375rem',lineHeight:1.5}}>{summary}</p>}
      <span style={{display:'inline-block',marginTop:14,fontWeight:700,fontSize:'0.875rem',borderBottom:'2px solid var(--ink)'}}>Read the case study</span>
    </div>
  </a>;
}
