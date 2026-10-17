import React from 'react';
export function Metric({value, label, sub, accent=false, size='md', style}) {
  const fs = size==='lg' ? 'var(--text-metric)' : size==='sm' ? '2rem' : '3rem';
  return <div style={{fontFamily:'var(--font-body)',...style}}>
    <span style={{display:'block',fontFamily:'var(--font-display)',fontSize:fs,lineHeight:1,color:accent?'var(--accent-primary)':'var(--ink)'}}>{value}</span>
    {label && <span style={{display:'block',marginTop:8,fontWeight:700,fontSize:'0.8125rem',textTransform:'uppercase',letterSpacing:'var(--tracking-eyebrow)',color:'var(--ink)'}}>{label}</span>}
    {sub && <span style={{display:'block',marginTop:4,fontWeight:500,fontSize:'0.8125rem',color:'var(--gray-warm)'}}>{sub}</span>}
  </div>;
}
export function MetricStrip({items, dark=false, style}) {
  return <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-7)',padding:'var(--space-6)',background:dark?'var(--ink)':'var(--gray-light)',...style}}>
    {items.map((m,i)=><Metric key={i} {...m} style={dark?{'--ink':'var(--cream)','--gray-warm':'rgba(250,247,242,.6)'}:undefined}/>)}
  </div>;
}
