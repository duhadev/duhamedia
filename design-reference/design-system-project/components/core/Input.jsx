import React from 'react';
export function Input({label, type='text', textarea, dark, style, ...rest}) {
  const fg = dark ? 'var(--cream)' : 'var(--ink)';
  const field = {fontFamily:'var(--font-body)',fontWeight:500,fontSize:'1rem',padding:'12px 14px',minHeight:'var(--target-min)',background:dark?'transparent':'var(--cream)',color:fg,border:`2px solid ${fg}`,borderRadius:'var(--radius-sm)',outline:'none',width:'100%',boxSizing:'border-box',...style};
  const El = textarea ? 'textarea' : 'input';
  return <label style={{display:'flex',flexDirection:'column',gap:6,fontFamily:'var(--font-body)',color:fg}}>
    {label && <span style={{fontWeight:700,fontSize:'0.8125rem',textTransform:'uppercase',letterSpacing:'var(--tracking-eyebrow)'}}>{label}</span>}
    <El type={textarea?undefined:type} rows={textarea?4:undefined} style={field} onFocus={e=>e.target.style.borderColor='var(--accent-primary)'} onBlur={e=>e.target.style.borderColor=fg} {...rest}/>
  </label>;
}
