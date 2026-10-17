import React from 'react';
const PHASES = [
  {n:'01', name:'Build Foundation', desc:'Store built or rebuilt. Shopify theme, conversion-ready.'},
  {n:'02', name:'Operate Engine', desc:'Email, ads, content, SEO, GBP — one team runs it all.'},
  {n:'03', name:'Build Independence', desc:'Your team trained to run it without us. The endgame.'},
];
export function PhaseTimeline({phases=PHASES, active, compact=false, style}) {
  return <ol style={{display:'flex',flexDirection:compact?'column':'row',flexWrap:compact?undefined:'wrap',gap:compact?'var(--space-4)':'var(--space-5)',listStyle:'none',margin:0,padding:0,fontFamily:'var(--font-body)',...style}}>
    {phases.map((p,i)=>{
      const isActive = active===i, isLast = i===phases.length-1;
      const showHandover = isLast && !/independence handover/i.test(p.name);
      return <li key={i} style={{flex:1,minWidth:compact?undefined:140,borderTop:`4px solid ${isActive?'var(--accent-primary)':isLast?'var(--ink)':'var(--border-divider)'}`,paddingTop:'var(--space-4)'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'1.75rem',color:isActive?'var(--accent-primary)':'var(--ink)',display:'block'}}>{p.n}</span>
        <span style={{display:'block',marginTop:6,fontWeight:700,fontSize:'1rem',textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--ink)'}}>{p.name}{isLast && <span aria-hidden="true"> →</span>}</span>
        {!compact && p.desc && <span style={{display:'block',marginTop:6,fontWeight:500,fontSize:'0.875rem',lineHeight:1.5,color:'var(--gray-warm)'}}>{p.desc}</span>}
        {showHandover && <span style={{display:'inline-block',marginTop:8,fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--ink)',borderBottom:'2px solid var(--ink)'}}>independence handover</span>}
      </li>;
    })}
  </ol>;
}
