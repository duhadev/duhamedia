import React from 'react';
export function Badge({tone='outline', icon, children, style}) {
  const tones = {
    outline:{background:'transparent',color:'var(--ink)',border:'2px solid var(--ink)'},
    fill:{background:'var(--ink)',color:'var(--cream)',border:'2px solid var(--ink)'},
    accent:{background:'var(--accent-primary)',color:'var(--text-on-accent)',border:'2px solid var(--accent-primary)'},
  };
  return <span style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.8125rem',textTransform:'uppercase',letterSpacing:'var(--tracking-eyebrow)',padding:'8px 16px',borderRadius:'var(--radius-badge)',lineHeight:1.2,...tones[tone],...style}}>{icon}{children}</span>;
}
