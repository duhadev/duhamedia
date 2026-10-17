import React from 'react';
export function Testimonial({quote, name, role, dark=false, style}) {
  const fg = dark ? 'var(--cream)' : 'var(--ink)';
  return <figure style={{margin:0,padding:'var(--space-5)',background:dark?'var(--ink)':'var(--gray-light)',color:fg,fontFamily:'var(--font-body)',borderLeft:'4px solid var(--ground-accent)',...style}}>
    <blockquote style={{margin:0,fontWeight:500,fontSize:'1.0625rem',lineHeight:1.55}}>&ldquo;{quote}&rdquo;</blockquote>
    <figcaption style={{marginTop:'var(--space-4)'}}>
      <span style={{display:'block',fontWeight:700,fontSize:'0.875rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>{name}</span>
      {role && <span style={{display:'block',marginTop:2,fontWeight:500,fontSize:'0.8125rem',color:dark?'rgba(250,247,242,.6)':'var(--gray-warm)'}}>{role}</span>}
    </figcaption>
  </figure>;
}
