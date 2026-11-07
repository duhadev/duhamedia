# Duha Media website: copy reply, round 1

**From:** copywriter. **To:** developer. **Date:** 2026-11-07. **Replies to:** "Duha Media website: copy to write" (2026-11-07).

Row IDs match your file. Paste the **New copy** exactly as written. `[ASK]` means a fact only Abdurrahman can give; the slot stays hidden or unchanged until he answers (list in section 3).

**How this file is organized**
- **Section 0** is the discrepancy register: every place the live site (checked 2026-11-07: `/`, `/services`, `/services/shopify-theme-development`, `/services/marketing`, `/about`, `/faq`) says something different from what Duha Media needs to convey. The source of truth is the brochure (2026-11-07), then the Copywriting Memory doc. Each row points to the fix.
- **Sections 1–6** are the fixes: decisions, structural changes, open questions, and the new copy by row ID.

Priority: **P1** = false, unapproved or visibly broken on the live site; fix first. **P2** = contradicts the brochure's message or uses banned words. **P3** = polish or SEO.

---

## 0. Discrepancy register

### Site-wide

| # | P | Where | Live site says | What we need to convey | Fix |
|---|---|---|---|---|---|
| X1 | P1 | `/services`, `/services/*`, `/about`, `/faq` | Visible labels "[STRATEGIC PLACEHOLDER — final copy TBD]", "[Placeholder copy.]", "[Placeholder — final copy TBD.]" in headlines and body | No brackets in public view | Remove every label as each row is replaced (section 4). Until then, `noindex` the affected pages. |
| X2 | P1 | `/services`, `/services/shopify-theme-development`, `/faq`, homepage meta description | Builds start at **$5K** | Builds start at **$7K** | D1 |
| X3 | P1 | `/services`, `/services/marketing`, `/faq`, homepage | Marketing "starts at **$1K/mo**", "you only pay for what you use", "the mix is priced on the call" | Three plans, settled quarterly (Standard, Prepaid, Ramp-up); fixed rate at $100,000 a year; ad spend separate | D2, D2a, FAQ-1, FAQ-8 |
| X4 | P1 | Homepage, `/services`, `/about`, `/faq`, `/services/marketing` | A third phase: "Build · Operate · Hand over", "Build independence", "Phase 3 is a scheduled handover", "handover date", "trains your team to take over", "Leaving is the deliverable", "06 Independence", "Typical handover [Month N]" | Two phases: Build your store, then Grow your store (optional, ongoing). The client owns everything from the start. No handover. | D3, SVC-3, SVC-6, ABT-6, ABT-9, FAQ-2, FAQ-10, section 4 extra rows |
| X5 | P1 | `/services`, `/services/marketing`, `/about`, `/faq` | "One dashboard", "dashboard access", "Dashboard shows…" on every channel | No client dashboard is offered | D4; MKT-1 and the E-01 to E-05 rows |
| X6 | P1 | `/services`, `/services/marketing`, `/about`, `/faq` | CRM (E-06, "attribution and CRM wired"), email flows (welcome, browse-abandon, cart, post-purchase, win-back) | Not offered. Email = a newsletter through Shopify Email only | D4; remove E-06; rewrite E-01 |
| X7 | P1 | `/services/marketing` E-02 | Paid ads on "Meta and Google" | Meta Ads (Facebook and Instagram) | E-02 row |
| X8 | P1 | Homepage hero, homepage map alt, `/about` hero and "Based" field | "Local to Chicago and DuPage", "Lombard" (3×) | Chicago only; "Chicago and the Chicagoland area" allowed | D7 |
| X9 | P1 | Homepage, `/services` | Placeholder testimonial live under "Sheikh Yaseen Palwala"; placeholder metric "[N]%" | No quotes or figures until the client approves them in writing | Hide T-1, HOME-1 to HOME-3, SVC-11, T-2 (section 1) |
| X10 | P1 | `/about`, `/faq`, `/book-a-call` | "Client revenue band we serve: $500K–$5M", "businesses netting $500K to $5M" | Not approved. Audience is owner-operated businesses in Chicago with a proven product whose store doesn't show it yet | ABT stats row, FAQ-9, BAC-H2 |
| X11 | P1 | Homepage, `/about`, `/services/shopify-theme-development` | "Abdur-Rahman Ch", alt text "Abdur-Rahman's profile" | Abdurrahman Choudhary | D10 |
| X12 | P1 | Homepage, `/services`, `/about`, `/services/*` | Abu Oud case study card live; client record "Abu OUd" | Client sign-off on the case study is still open (brochure open item). Spelling "Abu Oud" | `[ASK]` Q12: has Abu Oud approved the wording, name and figures? If not, hide the card. Fix the spelling either way. |
| X13 | P2 | Site-wide | "engine" in headings, buttons, FAQ and prices; "converts / conversion"; "funnel"-style language | Banned words (Copywriting Memory) | D12 |
| X14 | P2 | `/services/marketing` closing, `/services/shopify-theme-development` FAQ, `/services` "Why both together" | "Every client runs a build and an engine together under the same cap"; "A build with no engine is a parked car"; "ads can't be bought alone" | Marketing is optional; build-only clients are welcome (brochure pages 4 and 7) | Extra rows in section 4 |
| X15 | P2 | `/services/marketing` closing | "3 engines running. We cap at 7." | "We cap at 7" with its reason; the live count is builds, not marketing clients | MKT closing row |
| X16 | P2 | `/services/shopify-theme-development` | Process "Intake, Research, Positioning, Design, Development, Launch"; "Most start with a revision"; "Start with a revision" button | Brochure Phase 1: Discovery, Research, Brand, Design, Build, Launch. Every store designed and coded from scratch | SHP step rows; Q5 decides the revision path |
| X17 | P2 | `/services/shopify-theme-development` D-01, D-04, D-05, D-06 | "Conversion build… measured by conversion and add-to-cart"; "store revenue reconciles with ad accounts"; "Core Web Vitals pass at launch"; "monitored first stretch, theme walkthrough" | CRO is not offered. Tracking is Shopify Analytics plus Microsoft Clarity. The other promises aren't confirmed anywhere | D-row fixes in section 4; Q13 |
| X18 | P2 | Homepage process | "Eight steps on one calendar" but seven steps shown; "Development" as one step | Eight steps in two phases; Build and Launch are separate steps | Homepage table, section 4 |
| X19 | P2 | `/services` "Why both together" | "Sold to you as" claims shown struck through | Show the difference through what we do, not jabs at others (voice rule) | Extra rows in section 4 |
| X20 | P2 | Footer (every page), `/newsletter` | "First we build. Then we scale."; "One useful email a month. Numbers included." | Brochure beats: "Made by hand. Then made known." No client numbers without approval | Homepage table; NEWS-H1 |
| X21 | P2 | `/services` steps 01–03 | "Your numbers and what's leaking"; "A fixed scope"; "Dashboard access and a named contact" | Scope and price in writing (confirmed). "Fixed scope" isn't confirmed. No dashboard | Extra rows in section 4 |
| X22 | P2 | `/services/marketing` rollout | "Audit (tracking, list, spend history)", "Foundations: attribution and CRM", "Email flows" | Monthly cadence: planning call, then in-person filming; ads first, then what fits | Section 2; MKT step rows |
| X23 | P2 | Homepage "Stores we've run numbers for" | Implies results | No results claims until approved | Label → "Stores we've built" |
| X24 | P3 | Homepage `<title>` and meta | "Integrated Ecommerce Growth Partner, Chicago"; description has $5K, "growth engine", "take over" | Target "custom Shopify stores Chicago"; $7K; no banned words | SEO-1 |
| X25 | P3 | `/services/marketing`, `/services/shopify-theme-development`, `/about`, `/faq` | No custom search titles or descriptions | One target phrase per page | Section 6 |
| X26 | P3 | `/lp/sample-campaign` | Live with bracketed template text | Not public until there's a real campaign | Unpublish or `noindex` |

---

## 1. Read this first: what changed since your file was written

Abdurrahman has confirmed that **the brochure is the authority over the website**. The brochure was finished today (2026-11-07) and it settles most of Part A. Where the live site disagrees with it, the brochure wins. Above the brochure sits the approved Abu Oud marketing agreement, and nothing else.

### Decisions you can apply now

| # | Decision | What it changes on the site |
|---|---|---|
| D1 | **Builds start at $7K.** (Answers A1.) | Every "Builds start at" note, FAQ-1, the homepage meta description. Format: `Builds start at $7K.` |
| D2 | **Marketing is not "$1K/mo" and not "pay for what you use."** It is sold through three plans, settled quarterly: **Standard** (20% of online revenue or 30% of online profit, nothing upfront), **Prepaid** ($1,000 flat the first quarter, then $1,500 a quarter), **Ramp-up** (10% of online revenue the first quarter, then the Standard rate). Every plan moves to a fixed rate at $100,000 a year in online revenue. Ad spend and influencer costs are paid by the client. | Replace every "Engines start at $1K/mo" and "Marketing starts at $1K/mo" with the inline note in D2a. FAQ-1 and a new FAQ give the details. |
| D2a | **Inline marketing price note** (replaces "Engines start at $1K/mo" everywhere): `Marketing: three plans, settled quarterly. Ad spend is separate.` | All price notes |
| D3 | **There is no handover phase.** The brochure has two phases: Build your store, then Grow your store (optional, ongoing). The client owns the store, theme code, domain, content, ads and accounts from the start. "Leaving is the deliverable", "Build · Operate · Hand over", "trains your team to take over" and "handover date" all come out. | SVC-3, SVC-6, ABT-H1, ABT-6, ABT-9, FAQ-2, FAQ-10, homepage eyebrow and meta description. Phase 03 slot is rewritten as **"You own it"** (SVC-6). |
| D4 | **Not offered: CRM, email flows/automations, a client dashboard, CRO.** Email *is* offered only as a newsletter sent through Shopify Email. | SVC-2, SVC-5, MKT-H2, MKT-1, MKT-2 and the "Email flows" step. See section 2 for the structural changes. |
| D5 | **The marketing toolkit** (brochure page 3): Meta ads on Facebook and Instagram with campaign landing pages · organic social on Facebook, Instagram, Reels and TikTok, filmed in person each month · influencer collaborations · Google Business Profile · SEO · GEO (getting recommended by AI tools like ChatGPT) · newsletter through Shopify Email · flyers on request. Paid ads are where we start. | MKT page, SVC page |
| D6 | **Monthly cadence:** a planning call (up to 1 hour, usually less) and a 3–4 hour in-person filming session. | MKT page |
| D7 | **Location: Chicago only. Never mention DuPage or Lombard.** "Chicago and the Chicagoland area" is allowed. | Homepage hero, ABT-H2, homepage map alt text ("Duha Media service area, Lombard") |
| D8 | **Contract (answers A3 and A4 for site copy):** two-quarter terms that renew. Either side can cancel with notice before the next term starts. Clients own all content, ads and accounts. No guaranteed results. The legal pages still need counsel; the FAQ can state this now because the brochure already does. | FAQ-3, FAQ-7, MKT-3, MKT-9, MKT-10 |
| D9 | **Capacity: we cap at 7 clients**, because Abdurrahman does the work himself. | WORK-1, ABT-3, ABT-4, LP-7 |
| D10 | **Founder name:** Abdurrahman Choudhary. Title: Founder, Duha Media. The homepage founder card currently says "Abdur-Rahman Ch". | Founder card |
| D11 | **Contact email:** hello@duhamedia.com. Phone: 312-296-4564. Company line: Al-Amanah LLC, operating as Duha Media. | Contact page, footer, BAC-2 |
| D12 | **Words that must not appear anywhere on the site:** engine, funnel, convert/converts/conversion, dashboard, CRM, handover/handoff/hand over, leverage, seamless, robust, optimize, streamline, innovative. "Engine" is used across your field names and page labels ("The marketing engine", "Engines start at"); all visible instances go. | Site-wide |
| D13 | **Voice.** Your house rule 1 says "unsentimental." The brochure is warmer: plain, direct, confident, never salesy, "like talking to an owner across a table," and it states the mission openly (we stay with owners hand in hand until the business is set up to succeed). Keep the short sentences and numbers; drop the "operator" tone where it fights the mission. | Site-wide |

### Urgent, before anything else

1. **Hide testimonial T-1 now.** A placeholder quote is live under a real person's name (Sheikh Yaseen Palwala). His spelling isn't confirmed either (Yasin, Yassin and Yaseen all appear in our notes). Hide the card until he gives and approves his own words. Fix the client record spelling "Abu OUd" → "Abu Oud" at the same time.
2. **Hide the homepage study card (HOME-1 to HOME-3) and SVC-11.** There are no client-approved result numbers (A13). Don't show a placeholder metric.
3. **Unpublish or `noindex` `/lp/sample-campaign`.** It's live with bracketed text. It waits for a real campaign (see LP rows).
4. **Remove "Stores we've run numbers for"** above the Abu Oud logo on the homepage. It implies results we can't show. Suggested replacement label: `Stores we've built`.

---

## 2. Structural changes the copy needs (not just text swaps)

These slots describe services we don't offer, so rewriting the text isn't enough. Please confirm you can make these changes; the copy below assumes you can.

- **MKT "Specification E-06 CRM":** remove the whole specification. CRM is not offered (D4).
- **MKT "One dashboard. You see what we see." section:** there is no dashboard. Replace the section heading with `You see what we see.` and use the MKT-1 copy below (a quarterly readout, which matches how plans are settled).
- **MKT "Order matters more than effort" steps:** the step "03 Email flows" is not offered. Suggested step list, matching the brochure: 01 Plan · 02 Film · 03 Ads live · 04 Social and collaborations · 05 Search and newsletter. Labels and details in the MKT rows. The timing tags stay `[ASK]` (A6).
- **SVC "Where both doors end" (3 phases):** keep three panels, but Phase 03 becomes "You own it" rather than a handover (SVC-6).
- **ABT "The company, in numbers":** replace the "Typical handover" stat with `~55` / `Hands-on hours per build` (confirmed fact). See ABT-6.
- **Review Hub and Testimonials pages:** both have no real content yet. I recommend taking them out of the main navigation until the first approved quote or review exists, and keeping them out of the sitemap. The hero copy below is ready for when they return.
- **Homepage map image:** change the alt text from "Duha Media service area, Lombard" to `Map of Chicago, Duha Media's service area`. If the map itself is centered on Lombard, it needs to be re-centered on Chicago.

---

## 3. Facts still needed from Abdurrahman (`[ASK]`)

The brochure answered A1, A3, A4 (site-copy level), A7 (no handover), A8 (cap of 7) and A10 (values: see ABT-10). These remain:

| # | Question | Blocks |
|---|---|---|
| Q1 (A2) | How long does a typical build take, in weeks? | SHP-3, SHP-4, FAQ-6 |
| Q2 (A5) | After the first call, how soon is the written plan ready, and when does work start? | SVC-8 to SVC-10 |
| Q3 (A6) | Marketing timing: when do ads go live, and when do the first filming session and the first posts happen? | MKT-4 to MKT-7 |
| Q4 (A8) | Is the live count still **3** projects in progress? | ABT-5, WORK strip if it shows a live count |
| Q5 | Do you take on revisions of an existing store (keeping some of it), or is every build a new theme from scratch? The brochure says every store is "designed and coded from scratch." | SHP-5, SHP-6, SHP-7, FAQ-4 |
| Q6 | Are there two formal sign-offs in the build (the "Six steps, two sign-offs" heading)? If so, which steps? This is also an open item in the Copywriting Memory ("dated approval checkpoints"). | SHP heading, SVC-7 |
| Q7 | Is the booking call 30 minutes, and is it free? | BAC-H1, BAC-1, CON-H2, TY-H2 |
| Q8 (A12) | Will the newsletter go out once a month? How long is an issue? | NEWS-H1, NEWS-3 |
| Q9 (A9) | The founder story for ABT-7, in his own words, or recorded. | ABT-7 |
| Q10 (A11, A13) | Client quotes and result numbers, with written permission. | Part C, HOME-1, SVC-11, LP-3, REV-2 |
| Q11 | Should the website show the three marketing plans in full, like brochure page 5? Your house rule 3 forbids a pricing section; the brochure has one. I've kept to your rule for now (inline note + FAQ), pending his answer. | Possible new pricing page |
| Q12 | Has Abu Oud approved the case study (wording, name, figures, screenshots)? The brochure lists this as open. | Every Abu Oud card, the case study page |
| Q13 | Which build promises are real: schema and a speed pass in every build? A Core Web Vitals pass at launch? A monitored period after launch and a theme walkthrough? | SHP D-05, D-06 |

---

## 4. New copy, page by page

### Homepage `/`

| ID | New copy | Notes |
|---|---|---|
| HOME-P1 | `Builds start at $7K.` | D1 |
| HOME-1 to HOME-3 | *Hide the card.* | No approved figures. When Abu Oud signs off the case study, the brochure's milestone figures can go here: `50+` / `Products listed` / `Abu Oud · Oud and attar`. Not before. |
| Marketing price note (Part F) | `Marketing: three plans, settled quarterly. Ad spend is separate.` | Replaces "Marketing starts at $1K/mo, plus ad spend." (D2a) |

**Homepage corrections the brochure requires (Part F).** This is Abdurrahman's writing, so I've changed only the words that conflict with the brochure and kept his voice.

| Where | Current | New |
|---|---|---|
| Eyebrow (appears twice) | Build · Operate · Hand over | `Build · Grow` |
| Sub-eyebrow | Integrated ecommerce growth partner — Chicago | `Custom Shopify stores · Chicago` (the brochure cover line) |
| Hero description, last sentence | Local to Chicago and DuPage. | `Based in Chicago.` |
| "First, we build it." body | A Shopify store that converts, built from scratch or rebuilt. No templates. Every page is designed around your brand and your products, then built and revised with you until it's right. You get a store that looks like your business and is easy to buy from. | `A Shopify store built from scratch, around your brand and your products. No templates. Every page is designed with you and revised until it's right. You get a store that looks like your business and is easy to buy from.` (Pending Q5: if he does revisions of existing stores, add back "or rebuilt".) |
| "Then we grow it." body | We start with paid ads to get customers into your store. From there, we add what fits: organic social on TikTok, Instagram, and Facebook, influencer collabs, SEO, GEO, and your Google Business Profile. You only pay for what you use, all run by the team that built your store. | `We start with paid ads to bring customers to your store. Then we shift effort to what the numbers show: social content filmed with you each month, influencer collaborations, Google Business Profile, SEO, GEO and a newsletter. Every plan includes the full toolkit, run by the team that built your store.` |
| Banner | No templates. No handoffs. One person accountable. | `No templates. No middlemen. One person accountable.` ("handoffs" is on the banned list; "No middlemen" is the approved banner wording.) |
| Process intro | Eight steps on one calendar. You approve at each checkpoint, and when we're done, the store is yours to run. | `Eight steps in two phases, so you always know what comes next. Marketing is optional.` (The brochure line. The page currently lists seven steps; the brochure has eight: Discovery, Research, Brand, Design, Build, Launch, Marketing plan, Run and refine. Please split the current "Development" step into **05 Build** — "We code the approved design into a custom theme, through our own AI-assisted build pipeline." — and **06 Launch** — "We connect your shops and push the store live. It's yours." — and renumber Marketing and Run & Refine to 07 and 08.) |
| "Build only?" note | Build only? Steps 6 and 7 are optional. | `Build only? Steps 7 and 8 are optional.` |
| Stats label | Stores we've run numbers for | `Stores we've built` |
| Founder card name | Abdur-Rahman Ch | `Abdurrahman Choudhary` / `Founder, Duha Media` |
| Footer tagline | First we build. Then we scale. | `Made by hand. Then made known.` (the brochure's Build and Grow beats) |

### Work `/work`

| ID | New copy | Notes |
|---|---|---|
| WORK-H | Accent: `so far.` | Headline stays "The work, so far." |
| WORK-1 | `7` | D9. The strip needs a reason line under it if it doesn't have one: `The founder does the work himself, so we cap the list.` |

### Services hub `/services`

| ID | New copy | Notes |
|---|---|---|
| SVC-H1 | `We build it. Then we grow it.` Accent: `grow it.` | Keep: it matches the brochure's "First, we build it. / Then we grow it." |
| SVC-H2 | `Two jobs, one team. Start with the store, or start with the marketing.` | [ASK Q-related] If marketing can't be bought without a build (an open brochure item), use instead: `Two jobs, one team. Build the store first, then grow it.` |
| SVC-1 | `For a business with no online store, or one that doesn't show what you make. A custom Shopify theme built from scratch, connected to TikTok, Instagram and Facebook Shop. Yours from launch.` | ~30 words. "Conversion-focused" and "fixed scope" removed (D12; scope isn't confirmed as fixed). |
| SVC-2 | `For a store that isn't reaching new customers. Paid ads first, then social content, collaborations, search and a newsletter, run by one team.` | ~23 words. CRM and dashboard removed (D4). |
| SVC-3 | `One team through both phases, so the person who built your store is the one marketing it.` | Handover removed (D3). |
| SVC-4 | `A Shopify theme designed and coded from scratch around your brand and products, with Shopify Analytics and Microsoft Clarity set up so you can see what visitors do.` | Phase 01. ~28 words. |
| SVC-5 | `Paid ads, social content filmed in person each month, collaborations, Google Business Profile, SEO and a newsletter, run by the people who built your store.` | Phase 02. "Dashboard" and "CRM" removed. |
| SVC-6 | **Phase 03 heading:** `You own it.` **Text:** `The store, the theme code and the domain are yours from launch. Every ad, post, landing page and account is in your name too. Nothing is held back, and nothing is rented to you.` | Phase 03 keeps its weight, but the payoff is ownership, not a handover (D3). Every claim here is confirmed (brochure pages 2, 4, 5). |
| SVC-7 | `Nothing is signed before step 02. If the plan doesn't fit, it stops there, and you've lost nothing but a call.` | Keep the promise only if Q6 confirms it's how it works. |
| SVC-8 | `Day 0` | Day of the call. Fine as is. |
| SVC-9 | `[ASK Q2]` | |
| SVC-10 | `[ASK Q2]` | |
| SVC-11 | *Hide.* | Same as HOME-1 to HOME-3. |

**Services hub: lines not in your file (X4, X5, X14, X19, X21)**

| Where | Current | New |
|---|---|---|
| Hero phase strip | 01 Build the foundation · 02 Operate the engine · 03 Build independence → | `01 Build your store` · `02 Grow your store` · `03 You own it →` |
| "Two doors" Shopify card price | Builds start at $5K. | `Builds start at $7K.` |
| "Two doors" Marketing card title + price | Marketing Engines start at $1K/mo. | Title `Marketing`. Price: `Three plans, settled quarterly.` |
| "Two doors" Marketing button | See the engine → | `See the marketing →` |
| "Why both together" H2 | Half an offer is why it didn't work. | `Two jobs. One team.` |
| "Why both together" claim 1 (struck through) | "We'll build you a beautiful store." | Remove the "Sold to you as" claim. |
| "Why both together" H3 1 | A build with no engine is a parked car. | `A store nobody visits doesn't sell.` |
| "Why both together" claim 2 (struck through) | "Just hire a specialist for each channel." | Remove the "Sold to you as" claim. |
| "Why both together" H3 2 | You became the manager you were paying to avoid. | `One person knows your store from the first sketch to the latest ad.` |
| Phase 01 H3 | Build the foundation | `Build your store` |
| Phase 02 H3 | Operate the engine | `Grow your store` |
| Phase 03 H3 | Build independence | `You own it` (body: SVC-6) |
| Step 01 H3 + body | A call, 30 minutes / Your numbers and what's leaking. We say which door fits — including "neither, yet." | `A call` (add length after Q7) / `Your business, your customers and your goals. We say which job fits, including "neither, yet."` |
| Step 01 "You leave with" | An honest read on which phase you need | Keep. |
| Step 02 body | Scope, price and the calendar in writing — deliverables, sign-off points, and the handover date. | `Scope and price in writing, with the steps and what you'll approve along the way.` |
| Step 02 "You leave with" | A fixed scope and a price, before you commit | `A written scope and price, before you commit` |
| Step 03 body | Same team through both phases, no account-manager layer. You see the dashboard we see. | `The same person through both phases. No account managers, no middlemen.` |
| Step 03 "You leave with" | Dashboard access and a named contact | `A direct line to the person doing the work` |
| "Routing questions" | Same three FAQs as `/faq` | Use FAQ-1, FAQ-5 and FAQ-2 from section 5. |
| Closing H2 | Start with a call. Leave with a dated plan. | `Start with a call. Leave with a written plan.` ("Dated" isn't confirmed until Q2.) |
| Closing lines | 3 builds in progress. We cap at 7. / Each build gets about 55 hands-on hours: design, build, revision. No templates. | `[ASK Q4: 3] builds in progress. We cap at 7.` / `Each build gets about 55 hands-on hours, about 30 of them on design. No templates.` |
| Newsletter block | Numbers included. Unsubscribe anytime. | `Straight from the work. Unsubscribe anytime.` |

### Shopify Theme Development `/services/shopify-theme-development`

| ID | New copy | Notes |
|---|---|---|
| SHP-H1 | `Your custom Shopify store` Accent: `custom Shopify store` | Puts the page's target phrase in the H1. Alt: `The store build` (current; keep if the layout needs it short). |
| SHP-H2 | `Six steps from first call to launch. Designed with you screen by screen, coded from scratch, and yours from day one.` | "Converts" removed. |
| SHP-3 | `Typical build: [ASK Q1] weeks.` | |
| SHP-4 | `[ASK Q1]` | Number only, e.g. "8 weeks". Label stays "Typical build" (change "Typical revision" pending Q5). |
| SHP-5 | `Your price is set on the call, in writing, before anything is signed.` | |
| SHP-6 | Pending Q5. **If revisions are offered:** `Keep your products, customers and domain. We redesign the store around them and rebuild the theme from scratch.` **If not:** remove the panel. | "Keep what converts, fix what leaks" uses a banned word and implies partial reuse the brochure doesn't describe. |
| SHP-7 | `A blank page and the same six steps: discovery, research, brand, design, build and launch.` | |
| SHP-8 | `Checkout: as few steps as it takes to place an order.` | ≤10 words. |
| SHP-9 | `Every page and checkout works on launch day.` | Avoids promising support length, which isn't confirmed. |
| SHP-10 | `Competitors and who's winning.` | Optional. ≤6 words. |
| SHP-11 | `Every screen, revised with you.` | Optional. ≤6 words. |

**Shopify page: lines not in your file (X2, X13, X16, X17)**

| Where | Current | New |
|---|---|---|
| Phase label | Phase 01 — build the foundation (1 of 3) | `Phase 01 — build your store` (drop "of 3") |
| Every price note (hero, revision panel, spec footer) | Builds start at $5K. | `Builds start at $7K.` |
| Revision button | Start with a revision | Pending Q5: `Talk about your current store` or remove. |
| D-01 title + body + measure | Conversion build / templates built around buyer questions, speed as a feature / measured by conversion and add-to-cart per template | Title `Custom theme` · Body: `Every template designed and coded from scratch around your products and the questions your buyers ask.` · How you'll know: `Every page works on phone and desktop at launch.` |
| D-02 title | Brand positioning | `Brand` (matches brochure step 3). Body can stay; change "signed off before design" to `approved by you before design` only if Q6 confirms. |
| D-04 body + measure | Wired and tested before launch / store revenue reconciles with ad accounts | Body: `Shopify Analytics and Microsoft Clarity set up before launch.` · How you'll know: `You can see where visitors come from and what they do on each page.` |
| D-05 measure | Indexation and Core Web Vitals pass at launch | Pending Q13. Safe version: `Pages are set up for search from launch day: titles, descriptions and structure.` |
| D-06 body | Launch checklist, monitored first stretch, theme walkthrough | Pending Q13. Measure: SHP-9. |
| Process H2 | Six steps, two sign-offs. | `Six steps, start to launch.` (keep "two sign-offs" only if Q6 confirms) |
| Process steps | 01 Intake · 02 Research · 03 Positioning · 04 Design · 05 Development · 06 Launch | `01 Discovery` (We talk through your business, your customers and your goals.) · `02 Research` (We study your competitors, your positioning and who is winning in your market.) · `03 Brand` (One meeting to set your colors, typography and look.) · `04 Design` (We design every screen of the store and revise it with you until it's right.) · `05 Build` (We code the approved design into a custom theme, through our own AI-assisted build pipeline.) · `06 Launch` (We connect your shops and push the store live. It's yours.) — brochure page 4 wording. |
| Closing line under steps | Phase 02 follows, if the numbers support it. | `Marketing comes next, if you want it.` |
| FAQ "build without the engine" | Can I do the build without the engine? | Use FAQ-5. |
| Closing H2 | Get the build scoped in writing. | Keep. |
| Closing lines | design, build, revision | `Each build gets about 55 hands-on hours, about 30 of them on design. No templates.` |
| Add | — | A shop-sync line in the spec or hero: `Connected to TikTok Shop, Instagram Shop and Facebook Shop at launch.` (brochure page 2; not on the page today) |

### Marketing `/services/marketing`

| ID | New copy | Notes |
|---|---|---|
| MKT-H1 | `Then we grow it.` Accent: `grow it.` | Matches brochure page 3. "Engine" removed. Alt: `Marketing for your Shopify store` (Accent: `Shopify store`) if you want the target phrase in the H1. |
| MKT-H2 | `Paid ads, social content, collaborations, search and a newsletter, run by the team that built your store. Every plan includes all of it.` | |
| MKT-3 | `Two-quarter terms that renew. Cancel with notice before the next term.` | D8 |
| MKT-1 | **Heading:** `You see what we see.` **Body:** `Every quarter you get the numbers your plan is settled on, what we ran, what it returned and what we'll change next. The ad and shop accounts are in your name, so you can check any of it yourself.` | Replaces the dashboard section (section 2). Confirm the quarterly readout with Abdurrahman: it follows from quarterly settlement but isn't written down anywhere yet. Flag: `[ASK]` |
| MKT-2 | *Remove the E-06 CRM specification.* | D4 |
| MKT step 01 | **Plan** — `A planning call each month: up to an hour, usually less.` Tag: `[ASK Q3]` | Replaces "Audit". |
| MKT step 02 | **Film** — `Three to four hours in person. Scripts and articles are written in the same session.` Tag: `[ASK Q3]` | Replaces "Email flows" (D4, D6). |
| MKT-6 (step 03) | **Ads live** — tag `[ASK Q3]` | |
| MKT-7 (step 04/05) | **Social and collaborations**, then **Search and newsletter** — tags `[ASK Q3]` | |
| MKT-8 | `Your Google Business Profile, run like the ads: reviews grown, replies sent promptly, results checked.` | |
| MKT-9 | `6 MO` | Two quarters (D8). |
| MKT-10 | `Two quarters: long enough to film, run ads and see what works.` | The *reason* is my wording, not his. `[ASK]` Abdurrahman to confirm before it goes live. |

**Marketing page: lines not in your file (X3, X5, X6, X7, X14, X15, X22)**

| Where | Current | New |
|---|---|---|
| Phase label + breadcrumb | Phase 02 of three — operate the engine | `Phase 02 — grow your store` |
| Hero price | Engines start at $1K/mo | `Three plans, settled quarterly. Ad spend is separate.` |
| Diagram heading + nodes | How the signal moves · E-01 Email · E-02 Ads · E-03 Content · E-04 SEO · E-05 GBP · E-06 CRM | `What every plan includes` · `Paid ads` · `Social content` · `Collaborations` · `Google Business Profile` · `SEO and GEO` · `Newsletter` |
| "No deck theatre…" line | No deck theatre. No assembling five reports yourself. | `One readout, from the person who ran the work.` |
| Spec heading | Specification — what each channel is for | Keep. |
| E-01 | Email: list you own, built first; welcome, browse-abandon, cart, post-purchase, win-back flows, campaign calendar; dashboard metrics | Title `Newsletter` · Body: `Regular emails to the customers who already know you, sent through Shopify Email. How often depends on what we have to say; every two weeks is the usual aim.` · Remove "Dashboard shows". (Frequency from the Abu Oud agreement; `[ASK]` whether it's the default for every client.) |
| E-02 | Paid ads: Meta and Google, structured around margins; attribution fixed before spend; dashboard metrics | Title `Paid ads` · Body: `Meta ads on Facebook and Instagram, with a landing page built for each campaign, so the ad and the store say the same thing. This is where we start.` · What you'll see: `What you spent, what it brought in, and what each new customer cost.` |
| E-03 | Social / content: on-site shoot days feed organic, ads, email and product pages; dashboard metrics | Title `Social content and collaborations` · Body: `We film with you in person each month, then post to Facebook, Instagram, Reels and TikTok. We also scout and manage influencer collaborations; nothing is sent without your approval.` · Remove "Dashboard shows". |
| E-04 | SEO: category and product pages first, then articles; dashboard metrics | Title `SEO and GEO` · Body: `Showing up when people search for what you sell, and getting recommended when they ask AI tools like ChatGPT.` · Remove "Dashboard shows". |
| E-05 | GBP: profile kept current, scheduled posts, a review routine staff can maintain; dashboard metrics | Title `Google Business Profile` · Body: `Your listing on Google Search and Maps, kept current, with review growth and prompt replies.` · Remove "Dashboard shows". |
| E-06 | CRM | Remove (D4). |
| Note under specs | Ads can't be bought alone; the mix is priced on the call. | `Every plan includes all of it. We start with ads, then shift effort to what the numbers show.` |
| Rollout step 02 | Foundations: attribution and CRM wired before any spend | Remove (CRM not offered). New step list in section 2. |
| Rollout step 06 | Independence: Phase 03, your team takes over | Remove (D3). |
| Rollout closing line | Your team runs it without the agency. | `Everything we run stays in your name.` |
| Value card "GBP, run on numbers" | (MKT-8) | MKT-8 |
| Abu Oud card | 30+ Hours… | Hide pending Q12. |
| FAQ "minimum term for the engine" | Placeholder | Use FAQ-7 (question reworded to "for marketing"). |
| FAQ "Can I just get ads?" | The engine runs as one system… | Use FAQ-8. |
| Closing H2 | One engine. One owner of the number. | `One team. One person accountable.` |
| Closing lines | 3 engines running. We cap at 7. / Every client runs a build and an engine together under the same cap. | `We cap at 7 clients.` / `The founder does the work himself, so every store gets the hours it needs.` (Delete the second line: marketing is optional.) |

### Testimonials `/testimonials`

| ID | New copy | Notes |
|---|---|---|
| TST-H1 | `Don't take our word for it. Take theirs.` Accent: `Take theirs.` | Keep. |
| TST-H2 | `Clients in their own words, on camera and in writing. Quoted exactly, with their permission.` | "Their numbers" removed: there are no approved numbers. Page stays out of navigation until the first approved quote (section 2). |

### About `/about`

| ID | New copy | Notes |
|---|---|---|
| ABT-H1 | `One founder. Your store, built and grown.` Accent: `built and grown.` | Handover removed (D3). Alt: `One founder, no layers.` (Accent: `no layers.`) — but that already heads a section lower on the page. |
| ABT-H2 | `Based in Chicago. We work with businesses across Chicago and the Chicagoland area.` | D7 |
| ABT-3 | `7` clients. Reason line: `The founder does the work himself, so we cap the list.` | D9 + your rule 4. |
| ABT-4 | `7` | D9 |
| ABT-5 | `[ASK Q4]` (3 if confirmed) | |
| ABT-6 | Replace stat: `~55` / `Hands-on hours per build` | Section 2. Confirmed fact (about 55, about 30 on design). |
| ABT-7 | `[ASK Q9]` | I'll shape it once he gives or records it. Nothing invented. |
| ABT-8 | `The person who plans your store is the person who builds it. I'm Abdurrahman Choudhary, a Chicago developer and entrepreneur who started out freelancing websites and now builds and markets Shopify stores for local business owners.` | Approved bio (brochure page 7). "I" is correct here: founder section. |
| ABT-9 | **Paragraph 1:** `Two phases, one team. First we build your store: discovery, research, brand, design, build and launch, with you approving the design screen by screen. The store, the theme code and the domain are yours from launch.` **Paragraph 2:** `Then, if you want it, we grow it. Paid ads come first, then social content filmed with you each month, collaborations, search and a newsletter. We shift effort to whatever the numbers show is working. Marketing is optional, and everything we run stays in your name.` | Three phases → two (D3). |
| ABT-10 | **Values:** `Local owners pour themselves into what they make. Too often, the store and the marketing behind it don't show it, and that keeps good businesses from reaching the rest of Chicago. We exist to close that gap.` / `We do it by working side by side with you: one person accountable, no middlemen, nothing built on a template. We cap the client list so every store gets the hours it needs. And we stay with you until the business is set up to succeed, because we're here to build businesses in our community, not just to make a sale.` | Built only from the mission he stated (2026-11-06) and the brochure, in our words. `[ASK]` him to read it before it goes live, since it's his values page. |
| ABT-11 | *Delete the footnote.* | It promises numbers we don't have. |

**About page: lines not in your file (X4, X8, X10, X11)**

| Where | Current | New |
|---|---|---|
| Hero fact "Based" | Lombard, IL | `Chicago, Illinois` |
| Hero fact "Scope" | Build · Operate · Hand over | `Build · Grow` |
| Stats "Client revenue band we serve" | $500K–$5M | Remove the stat (not approved). |
| Founder card name + image alt | Abdur-Rahman Ch / "Abdur-Rahman's profile photo" | `Abdurrahman Choudhary` / `Founder, Duha Media` / alt `Abdurrahman Choudhary, founder of Duha Media` |
| Closing H2 | Talk to the person who does the work. | Keep. It's on message. |
| Closing lines | 3 builds in progress. We cap at 7. / …design, build, revision. No templates. | Same fix as the services hub closing lines. |
| Abu Oud card | Live | Hide pending Q12. |

### Thank You `/thank-you`

| ID | New copy | Notes |
|---|---|---|
| TY-H1 | `Got it. See you on the call.` Accent: `See you on the call.` | |
| TY-H2 | `We'll read what you sent before we talk, so the call goes straight to your store, your customers and your goals.` | No length stated until Q7. |

### Book a Call `/book-a-call`

| ID | New copy | Notes |
|---|---|---|
| BAC-H1 | `[ASK Q7] minutes. Straight answers.` Accent: `Straight answers.` | If Q7 confirms 30: `30 minutes. Straight answers.` "Your numbers" removed: owners without a store yet may have none. |
| BAC-H2 | `For owner-operated businesses in Chicago that make something great, but whose online store doesn't show it yet.` | Replaces the "$500K–$5M netting" line, which isn't in the brochure or approved anywhere. |
| BAC-1 | `We'll talk through your business, your customers and your goals, and tell you honestly if we're the right fit. The calendar opens in a new tab; this page shows what to prepare.` | First clause is the brochure's booking line. |
| BAC-2 | `The calendar isn't loading right now. Email hello@duhamedia.com with two or three times that suit you, and we'll confirm one.` | D11 |

### FAQ `/faq`

| ID | New copy |
|---|---|
| FAQ-H | `Straight answers.` Accent: `Straight answers.` — the brochure heading. Alt: keep `We'll give it to you straight.` (Accent: `straight.`) |

Answers are in section 5.

### Contact `/contact`

| ID | New copy | Notes |
|---|---|---|
| CON-H1 | `Thinking of working with us? Book a call.` Accent: `Book a call.` | Alt: keep current. "Prospect?" is our word, not the reader's. |
| CON-H2 | `Questions about fit and pricing get real answers on a call. Everything else — press, partnerships, or if you're already a client — use the form below or email hello@duhamedia.com.` | D11 |
| CON-1 | `Message received. We'll reply by email.` | Don't promise a reply time until he confirms one. |

### Campaign landing page `/lp/sample-campaign`

**This waits for a real campaign.** Unpublish or `noindex` it now (section 1). When there's a campaign, send me the ad creative and the offer, and I'll write LP-0 to LP-7 and LP-SEO to match it. I won't write an example offer: anything I invent would be a price or promise he hasn't approved.

### Newsletter `/newsletter`

| ID | New copy | Notes |
|---|---|---|
| NEWS-H1 | `One useful email a month. Straight from the work.` Accent: `Straight from the work.` | "Numbers included" removed: we can't publish client numbers without approval. "A month" pending Q8. |
| NEWS-H2 | `What we're learning building and marketing Shopify stores for Chicago businesses: what worked, what didn't, and what we'd do differently.` | |
| NEWS-3 | `[ASK Q8]` | |
| NEWS-4 | *Hide until the count is worth showing.* Replacement proof line in the meantime: `Written by the founder, from the work he's doing that month.` | Your notes allow a different line if the count is small. |

### Link-in-bio `/links`

| ID | New copy | Notes |
|---|---|---|
| LNK-1 | `Custom Shopify stores · Chicago` | 4 words; the brochure cover line. |

### Review Hub `/reviews`

| ID | New copy | Notes |
|---|---|---|
| REV-H1 | `Reviews you can check.` Accent: `you can check.` | Keep. |
| REV-H2 | `Every review links to where it was posted, so you can read it in full.` | |
| REV-1 | `Quoted exactly as posted.` | |
| REV-2 | *Hide.* | No approved figure. Page stays out of navigation until real reviews exist (section 2). |

### Legal pages

Not mine until counsel provides the text. I'll write LEG-1 to LEG-4 then.

### Shared

| ID | New copy | Notes |
|---|---|---|
| GLB-1 | `Ready to build a store that shows what you make?` | Button: `Book a Call`. "Free consultation" removed until Q7 confirms the call is free. |

---

## 5. FAQs (Part C)

Answer first, then the reason. Wording follows the brochure's FAQ (page 7), which is approved. The order below is the brochure's.

| ID | Question | Answer |
|---|---|---|
| FAQ-1 | What does it cost? | `Builds start at $7K. Marketing is paid through one of three plans, settled quarterly: Standard (20% of online revenue or 30% of online profit, nothing upfront), Prepaid ($1,000 for the first quarter, then $1,500 a quarter), or Ramp-up (10% of online revenue the first quarter, then the Standard rate). Ad spend and influencer costs are paid by you, separately. Your exact price is set on the call, in writing, before anything is signed.` |
| NEW | What happens at $100,000 a year? | `Your plan switches to a fixed rate once your online store reaches $100,000 a year. The rate is set for your store, based on the work it needs, and agreed in writing. When your quarterly results show you're on pace, we offer the switch early. It's your choice until you reach the revenue.` |
| FAQ-2 | Do you lock clients into retainers? | `No. The marketing runs on two-quarter terms that renew, and either side can cancel with notice before the next term. You own everything we make for you: the store, the code, the domain, the content and the accounts.` |
| FAQ-3 | How long are contracts? | `Two quarters, then they renew for another two. Either side can cancel by giving notice before the next term starts, and the current term is finished in full.` |
| FAQ-4 | I already have a store. Do I have to start over? | Pending Q5. **If revisions are offered:** `No. Your products, customers and domain stay. We redesign the store around them and build the theme from scratch.` **If not:** `Your products, customers and domain stay. The design and theme are new, built from scratch for your store.` |
| FAQ-5 | Can I do the build without the marketing? | `Yes. The marketing steps are optional. We'll tell you on the call whether marketing makes sense for your store right now.` (Question reworded: "engine" removed.) |
| FAQ-6 | How long does a build take? | `About [ASK Q1] weeks. A build takes about 55 hands-on hours, about 30 of them on design alone.` |
| FAQ-7 | Is there a minimum term for marketing? | `Yes: two quarters. That's long enough to film, run ads and see what works before deciding. After that it renews for two quarters at a time, and you can cancel with notice before the next term.` (Reason pending the MKT-10 confirmation.) |
| FAQ-8 | Can I just get ads? | `Every plan includes the full toolkit, and paid ads are where we start. If the numbers show organic content or collaborations will do more for your store, we shift effort there. You pay the same plan either way.` (Resolves the conflict you flagged: D2 replaces "pay for what you use.") |
| FAQ-9 | Will this work for my business? | `It's built for owner-operated businesses in Chicago with a proven product, whose online store and marketing don't show it yet. We don't guarantee results. On the call, we'll tell you honestly whether we're the right fit.` (Revenue band removed: not approved.) |
| FAQ-10 | What makes you different? | `One person is accountable for your store, from the first call to the marketing. No templates: every store is designed and coded from scratch. No middlemen: the founder does the work, in-house. And we cap at 7 clients, so every store gets the hours it needs.` |
| NEW | Who pays for ads? | `You do. Ad spend, influencer costs and other marketing expenses are separate from our fees.` |
| NEW | Do I own my store? | `Yes. The store, the theme code and the domain are yours from launch. Ads, content and accounts are in your name too.` |
| NEW | Do you use AI? | `Yes, in our build pipeline, to code faster. The design is still planned and approved with you, screen by screen.` |
| NEW | Where are you based? | `Chicago. We film in person, so we work with businesses in Chicago and the Chicagoland area.` (The brochure says "Chicago and United States at large," which conflicts with Chicago-only positioning. I've used the Grow page wording. `[ASK]` him which is right; the brochure needs the same fix.) |

### Testimonials T-1 to T-6

No copy from me. Every quote must come from the client and be approved in writing. T-1 is urgent (section 1). Drop T-6 (newsletter reader) until the newsletter has readers.

---

## 6. Search titles and descriptions (Part E)

Targets are local service searches. I haven't checked search volumes yet; I'll confirm the target phrases with keyword research in round 2 and adjust if the data says otherwise.

| ID | Page | Title (≤60) | Description (≤155) |
|---|---|---|---|
| SEO-1 | Home | `Custom Shopify Stores in Chicago \| Duha Media` | `We design and build custom Shopify stores from scratch, then run the marketing that brings in customers. No templates. Chicago. Builds start at $7K.` |
| SEO-5 (new) | Shopify Theme Development | `Custom Shopify Store Design in Chicago \| Duha Media` | `A Shopify store designed and coded from scratch, around your brand and products. No templates. You own the store, code and domain. Builds start at $7K.` |
| SEO-6 (new) | Marketing | `Shopify Marketing in Chicago \| Duha Media` | `Paid ads, social content filmed in person, collaborations, SEO and a newsletter, run by the team that built your store. Three plans, settled quarterly.` |
| SEO-7 (new) | Services hub | `Shopify Build and Marketing Services \| Duha Media` | `Two jobs, one team. We build your custom Shopify store from scratch, then grow it with ads, social content and search. Based in Chicago.` |
| SEO-8 (new) | About | `About Duha Media: Chicago Shopify Developer` | `One founder, no layers. Abdurrahman Choudhary designs, builds and markets custom Shopify stores for owner-operated businesses in Chicago.` |
| SEO-3 | Work | `Our Work: Custom Shopify Stores \| Duha Media` | `Custom Shopify stores we've designed and built from scratch for Chicago businesses. Case studies are published once each client approves them.` |
| SEO-2 | Testimonials | `Client Testimonials \| Duha Media` | `What Chicago business owners say about working with Duha Media, quoted exactly and published with their permission.` |
| SEO-9 (new) | FAQ | `Shopify Build and Marketing FAQ \| Duha Media` | `Straight answers on cost, ownership, contracts and timelines for a custom Shopify store and marketing from Duha Media in Chicago.` |
| SEO-10 (new) | Book a Call | `Book a Call \| Duha Media` | `Talk through your business, your customers and your goals with Duha Media's founder. We'll tell you honestly if we're the right fit.` |
| SEO-11 (new) | Contact | `Contact Duha Media \| Chicago` | `Email hello@duhamedia.com or call 312-296-4564. Book a call for questions about fit and pricing.` |
| SEO-4 | Thank You, Links, 404 | Fallback is fine. Set Thank You to `noindex`. | — |

**Search articles (Part D).** The draft titled *Integrated ecommerce marketing* targets a phrase owners don't search for. I suggest retargeting it to `Shopify marketing in Chicago` once I've checked volumes. *Shopify development in Chicago* is a good target; send the draft when it's ready for an edit.

**Structured data (optional, if Payload supports it):** `FAQPage` schema on `/faq` using section 5, and `LocalBusiness` schema with the Al-Amanah LLC / Duha Media name, Chicago address area, phone and email. Both help search engines and AI tools describe the business correctly.

---

## 7. How we'll work

- I reply in a numbered md file each round (`duha-website-copy-reply-02.md`, and so on), using your row IDs.
- Send me questions or pushback the same way, by row ID.
- When Abdurrahman answers section 3, I'll send a short follow-up file with only the rows that change.
