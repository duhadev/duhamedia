function Home({nav}) {
  return <main data-screen-label="Homepage">
    <Hero nav={nav}/>
    <ScarcityStrip/>
    <LogoStrip/>
    <ProofSection nav={nav}/>
    <WhatWeDo nav={nav}/>
    <Process/>
    <Founder/>
    <FinalCTA nav={nav}/>
  </main>;
}
function App() {
  const [page, setPage] = React.useState('home');
  const nav = p => { setPage(['home','services','faq','book'].includes(p)?p:'home'); window.scrollTo(0,0); };
  return <div style={{background:'var(--cream)',minHeight:'100vh'}}>
    <Header nav={nav} page={page}/>
    {page==='home' && <Home nav={nav}/>}
    {page==='services' && <ServicesHub nav={nav}/>}
    {page==='faq' && <FAQPage nav={nav}/>}
    {page==='book' && <BookACall/>}
    <Footer/>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
