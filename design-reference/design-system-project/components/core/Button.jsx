import React from 'react';
export function Button({variant='primary', size='md', href, children, style, ...rest}) {
  const pad = size==='lg' ? '18px 32px' : size==='sm' ? '10px 18px' : '14px 26px';
  const fs = size==='lg' ? 17 : size==='sm' ? 14 : 15;
  const base = {display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'var(--font-body)',fontWeight:700,fontSize:fs,padding:pad,minHeight:'var(--target-min)',border:'2px solid transparent',borderRadius:'var(--radius-none)',cursor:'pointer',textDecoration:'none',lineHeight:1,transition:'all var(--dur-fast) var(--ease-out)',whiteSpace:'nowrap'};
  const variants = {
    primary:{background:'var(--accent-primary)',color:'var(--text-on-accent)',borderColor:'var(--accent-primary)'},
    ghost:{background:'transparent',color:'var(--ink)',borderColor:'var(--ink)'},
    'ghost-light':{background:'transparent',color:'var(--cream)',borderColor:'var(--cream)'},
    dark:{background:'var(--ink)',color:'var(--cream)',borderColor:'var(--ink)'},
  };
  const s = {...base, ...variants[variant], ...style};
  const hover = e => { if (variant==='primary') e.currentTarget.style.filter='brightness(.9)'; else if (variant==='ghost') {e.currentTarget.style.background='var(--ink)'; e.currentTarget.style.color='var(--cream)';} else if (variant==='ghost-light') {e.currentTarget.style.background='var(--cream)'; e.currentTarget.style.color='var(--ink)';} else e.currentTarget.style.filter='brightness(1.15)'; };
  const unhover = e => { e.currentTarget.style.filter=''; e.currentTarget.style.background=s.background; e.currentTarget.style.color=s.color; };
  const Tag = href ? 'a' : 'button';
  return <Tag href={href} style={s} onMouseEnter={hover} onMouseLeave={unhover} onMouseDown={e=>e.currentTarget.style.transform='translateY(1px)'} onMouseUp={e=>e.currentTarget.style.transform=''} {...rest}>{children}</Tag>;
}
