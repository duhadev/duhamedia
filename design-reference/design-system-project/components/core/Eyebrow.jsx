import React from 'react';
export function Eyebrow({muted, tick=false, children, style}) {
  return <span style={{display:tick?'flex':'block',alignItems:tick?'center':undefined,gap:tick?10:undefined,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'var(--text-small)',textTransform:'uppercase',letterSpacing:'var(--tracking-eyebrow)',color:muted?'var(--gray-warm)':'currentColor',...style}}>{tick && <span aria-hidden="true" style={{width:9,height:9,background:'var(--ground-accent)',transform:'rotate(45deg)',flexShrink:0}}></span>}{children}</span>;
}
