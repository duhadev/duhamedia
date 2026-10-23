# S6 LP smalls fixtures (S6-4 ProofStrip metrics, S6-6 MiniCTAStrip button, S6-5 OfferBlock)

Shared: `const L = (label) => ({ type: 'custom', url: '/book-a-call', label, newTab: false })`;
`logos = { show: true, eyebrow: "Stores we've run numbers for", source: 'flagged' }`;
`rt(...paras)` = lexical root with one paragraph per string.
Capacity statements come from the `scarcity` global (dev DB has only `capacity`; `offer-line` must exist with a reason for the offer line to show).

## S6-4 ProofStrip `metrics`
1. `{ block:'proofStrip', variant:'metrics', label:'metrics: 2 metrics + capacity + pricing note + logos', data:{ variant:'metrics', metrics:[{value:'[N]',label:'[Result]',accent:true},{value:'[N]',label:'[Count]',sub:'[sub]'}], capacityStatement:'capacity', pricingNote:'Builds start at $5K · Engines start at $1K/mo', logos } }`
2. `{ ..., label:'metrics: pricing note only', data:{ variant:'metrics', metrics:[], capacityStatement:'none', pricingNote:'Builds start at $5K', logos:{show:false} } }`
3. `{ ..., label:'metrics: nothing set (renders nothing)', data:{ variant:'metrics', metrics:[], capacityStatement:'none', logos:{show:false} } }`
4. `{ ..., label:'metrics: capacity key missing in global (tile skipped, logged)', data:{ variant:'metrics', metrics:[{value:'[N]',label:'[Result]'}], capacityStatement:'offer-line', logos:{show:false} } }`

## S6-6 MiniCTAStrip `button`
1. `{ block:'miniCTAStrip', variant:'button', label:'button with lead-in line', data:{ variant:'button', text:'Ready when you are.', link:L('Book a Call') } }`
2. `... label:'button alone', data:{ variant:'button', link:L('Book a Call') }`
3. `... label:'button unresolved link (renders nothing)', data:{ variant:'button', text:'x', link:{type:'custom',url:'',label:'Book',newTab:false} }`

## S6-5 OfferBlock (`offerBlock`, local type until registered; no `variant`)
base = `{ eyebrow:'The offer', eyebrowTick:false, heading:'[Campaign-specific promise, stated as scope.]', accentPhrase:'stated as scope', body: rt('[Placeholder: what the prospect gets, in deliverable terms, with the number first. No countdown timers; capacity is the only true urgency and it carries its reason.]'), cta:L('Book a Call'), capacity:'offer-line' }`
1. `{ block:'offerBlock', label:'offer: populated (needs offer-line in scarcity global)', data: base }`
2. `{ ..., label:'offer: capacity none (button only)', data:{ ...base, capacity:'none' } }`
3. `{ ..., label:'offer: offer-line missing/no reason (no capacity line, logged)', data: base }` (same data, DB-dependent)
4. `{ ..., label:'offer: minimal', data:{ heading:'[Promise]', cta:L('Book a Call'), capacity:'none' } }`
