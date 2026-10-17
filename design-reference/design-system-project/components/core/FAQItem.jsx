import React, {useState} from 'react';
export function FAQItem({question, children, defaultOpen=false}) {
  const [open, setOpen] = useState(defaultOpen);
  return <div style={{borderTop:'var(--border-hairline)',fontFamily:'var(--font-body)'}}>
    <button onClick={()=>setOpen(!open)} aria-expanded={open} style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between',gap:16,background:'none',border:'none',cursor:'pointer',padding:'18px 0',textAlign:'left',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'1.125rem',color:'var(--ink)',minHeight:'var(--target-min)'}}>
      {question}
      <span style={{fontFamily:'var(--font-display)',fontSize:20,color:open?'var(--accent-primary)':'var(--ink)',transition:'transform var(--dur-fast) var(--ease-out)',transform:open?'rotate(45deg)':'none',lineHeight:1}}>+</span>
    </button>
    {open && <div style={{padding:'0 0 20px',fontWeight:500,fontSize:'1rem',lineHeight:'var(--leading-body)',color:'var(--ink)',maxWidth:'62ch'}}>{children}</div>}
  </div>;
}
