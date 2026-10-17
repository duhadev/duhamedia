import React from 'react';
/** headline text with one accent-colored segment. `accent` marks the substring to color. */
export function AccentHeadline({as='h2', text, accent, level=1, style}) {
  const Tag = as;
  const sizes = {1:'var(--text-h1)',2:'var(--text-h2)',3:'var(--text-h3)'};
  const leads = {1:'var(--leading-h1)',2:'var(--leading-h2)',3:'var(--leading-h3)'};
  let parts = [text];
  if (accent && text.includes(accent)) {
    const i = text.indexOf(accent);
    parts = [text.slice(0,i), <span key="a" style={{color:'var(--accent-primary)'}}>{accent}</span>, text.slice(i+accent.length)];
  }
  return <Tag style={{fontFamily:'var(--font-display)',fontWeight:400,fontSize:sizes[level],lineHeight:leads[level],color:'var(--ink)',margin:0,textTransform:'uppercase',letterSpacing:'-0.01em',textWrap:'balance',...style}}>{parts}</Tag>;
}
