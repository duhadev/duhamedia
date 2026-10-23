# Big step 6 plan — pages 13–21 (planner, 2026-10-23)

Read with `.claude/handoff/block-brief-common.md`. Fixtures from coders go to `.claude/handoff/pending-s6-integration.md` (same format as S5).

## Sources
- `pages` docs: p15 `lp/<campaign>` (zeroLeakage, noindex), p16 `newsletter`, p17 `links` (header none, noindex, legal-only), p19 `reviews`, p20 `privacy|terms|cookies|gdpr`, p21 reserved `404` doc.
- Templates (like CaseStudyView): p13/p14 posts → `src/app/(frontend)/insights/[slug]/page.tsx`; newsletter issues → `newsletter/[slug]/page.tsx` (`/newsletter` stays the p16 pages doc); p18 lead-magnets → `resources/[slug]/page.tsx`. Paths fixed by docPath/TEMPLATE_PREFIXES.

## Page → block (EXISTS / EXTEND / NEW)
- p13 DEV-SEO: Hero article +`standfirst` (EXT) · RichContent article +`callout` (EXT) · RichContent `band` DIY + facts≤3, price→pricingNote (EXT) · CaseStudyCards cards from post.proof, fallback testimonials · RichContent band (R Educational) · AccordionFAQ mini inline items view (EXT) · NewsletterBand · FinalCTA builds-line.
- p14 MKT-SEO: Hero article+standfirst · RichContent article · band DIY · band framed light (R How Duha does it) · CaseStudyCards fallback metric-strip · FAQ inline · NewsletterBand · FinalCTA engines-line.
- p15 Campaign LP: logo-only header · Hero `vsl` (EXT) / typographic · ProofStrip `metrics` (EXT) · MiniCTAStrip `button` (EXT) · OfferBlock (NEW) · CaseStudyCards · MiniCTAStrip button · TestimonialRow +`ctaStyle` (EXT) · legal-only footer.
- p16 Newsletter: Hero typographic + form slot (EXT: form→fallback site-settings.newsletterForm, formStyle card|inline, formHeading, formBody, submitLabel, formNote) · PostList (NEW) · TestimonialRow +`leadMetric` (EXT).
- p17 Link-in-Bio: LinkStack (NEW) · legal-only footer.
- p18 Lead Magnet: Hero form slot inline · SpecLedger `list` (EXT) · NewsletterBand `cross-sell` (EXT; delivered heading h2 at h1 scale; never an asset link).
- p19 Review Hub: Hero compact rating (EXISTS) · ReviewWall `wall` + inserts metric/client/scarcity (EXT) · CaseStudyCards fallback note · FinalCTA.
- p20 Legal: RichContent `legal` (EXT; h1 owner; H2-derived anchors w/ reserved+dup guard; sticky sidebar desktop / horizontal nav mobile; lastUpdated; placeholder-only content).
- p21 404: Error404 (NEW; heading = h1, "404" aria-hidden; links 1–3) + `Error404View` for not-found fallback.

## Units
S6-1 Hero vsl+form slot+standfirst (opus) · S6-2 RichContent band/legal/callout (opus) · S6-3 AccordionFAQ items view · S6-4 ProofStrip metrics (+capacityStatement scarcityRef) · S6-5 OfferBlock · S6-6 MiniCTAStrip button · S6-7 TestimonialRow leadMetric+ctaStyle · S6-8 PostList · S6-9 LinkStack (opus) · S6-10 SpecLedger list · S6-11 NewsletterBand cross-sell · S6-12 ReviewWall wall · S6-13 Error404 · S6-S site-settings `postLabels` (schema-architect) · S6-I1 integrator (register OfferBlock/LinkStack/PostList/Error404, showcase, ONE migration `b6_pages_13_21_blocks`, watch 63-char enum names, export buildMetadata) · S6-T1 posts templates + router (insights/newsletter routes, PostView, lib/posts.ts, postMetadata/postJsonLd, sitemap, Posts preview) · S6-T2 lead-magnet template + 404 wiring (resources route, LeadMagnetView + states island, PayloadForm `cmsform:submitted` event, not-found from 404 doc, LeadMagnets/Pages preview).

## Batches (max 3 browser agents; one owner per file)
0. Close S5 (migration, QA re-check, commit/push).
A. S6-1, S6-2, S6-12 (+ S6-S no browser).
B. S6-9, S6-8, LP smalls serial (S6-4 → S6-6 → S6-5).
C. S6-7→S6-3 serial; S6-10→S6-13 serial; S6-11.
I1 integrator → QA Gate 1 (public + admin, human login) + Gate 2 → S6-T1 ∥ S6-T2 → template QA, page-scope SEO ×9, dev-docs, marketing-docs, commit + push.
After step 6: Gate A integration units (newsletter double opt-in + Resend Contacts/Segment/Topic; lead_magnet delivery email); keep lead magnets draft until then; page SEO; Gate K.

## Open questions → safe defaults (batch to human at the end; F110+)
1/2 Proof placement → SCHEMA. 3 derived designs for p14 How-we-do-it + p13 Educational → design sign-off. 4 post labels → site-settings postLabels. 5 prices in prose → seed without prices. 6 no /insights hub → no breadcrumb/BreadcrumbList on posts. 7 newsletter issue layout derived. 8 LP Hero B grey ground deferred. 9 LP TestimonialRow study links (leakage) → keep, only after a study is published. 10 capacity 7 from scarcity, not typed. 11 quiet reason always rendered (rule 2). 12 F43 dark legal-only footer. 13 lead magnet delivered heading h2@h1 scale. 14 p16 form fallback to site-settings. 15 404 heading = h1. 16 legal blocks Gate 3 until counsel copy. 17 legal/404 own h1. 18 p19 rating from testimonials (S5-1). 19 reading progress on issues too. 20 wrong-track post URL 308 → canonical. 21 ctaStyle default link. 22 Error404 in all pickers accepted. 23 social icons duplicated (consolidate later).
