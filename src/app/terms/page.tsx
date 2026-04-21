import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";

const tocItems = [
  { label: "1. Who these terms apply to", href: "#who-applies" },
  { label: "2. Use of the site", href: "#use-of-site" },
  { label: "3. Services", href: "#services" },
  { label: "4. Free audit & founding client", href: "#free-audit" },
  { label: "5. Intellectual property", href: "#ip" },
  { label: "6. Third-party links", href: "#third-party" },
  { label: "7. Disclaimer of warranties", href: "#disclaimer" },
  { label: "8. Limitation of liability", href: "#limitation" },
  { label: "9. Indemnification", href: "#indemnification" },
  { label: "10. Governing law", href: "#governing-law" },
  { label: "11. Changes to terms", href: "#changes" },
  { label: "12. Contact", href: "#contact" },
];

function LegalReviewNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-brand-gold bg-brand-gold/5 px-4 py-3 mt-4" role="note" aria-label="Legal review required">
      <p className="text-xs font-mono text-brand-ink/60 leading-relaxed">{children}</p>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          label="Legal"
          heading="Terms of Service"
          headingSize="sm"
          meta="Duha Media · Last updated: [DATE] · Effective: [DATE]"
          subhead="These terms govern your use of the Duha Media website and the services we provide. By using this site or engaging our services, you agree to these terms. If anything here is unclear, contact us before proceeding."
        />

        <section className="bg-white px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 items-start">

              {/* TOC — desktop only */}
              <nav aria-label="Jump to section" className="hidden md:block sticky top-24">
                <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">Contents</p>
                <ul className="space-y-2">
                  {tocItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="font-mono text-xs text-brand-crimson hover:text-brand-magenta transition-colors leading-relaxed"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Prose body */}
              <div className="text-sm text-brand-ink/70 leading-relaxed">

                <section id="who-applies">
                  <h2 className="font-bold text-brand-ink text-base mb-3">1. Who These Terms Apply To</h2>
                  <p>
                    These Terms of Service (&ldquo;Terms&rdquo;) apply to anyone who uses the Duha Media website at duhamedia.com (&ldquo;Site&rdquo;) or who engages Duha Media (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) for services. By accessing the Site or submitting any form, you agree to be bound by these Terms.
                  </p>
                  <p className="mt-3">
                    If you are accessing the Site on behalf of a business, you represent that you have authority to bind that business to these Terms.
                  </p>
                </section>

                <section id="use-of-site" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">2. Use of the Site</h2>
                  <p className="mb-4">You may use this Site for lawful purposes only. You agree not to:</p>
                  <ul className="space-y-2 pl-3">
                    {[
                      "Use the Site in any way that violates applicable laws or regulations",
                      "Attempt to gain unauthorized access to any part of the Site or its underlying systems",
                      "Scrape, copy, or reproduce Site content without our written permission",
                      "Use the Site to transmit spam, malware, or any harmful content",
                      "Misrepresent your identity or affiliation when submitting any form",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-brand-ink/30 flex-shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    We reserve the right to refuse access to the Site to anyone for any reason at our sole discretion.
                  </p>
                </section>

                <section id="services" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">3. Services</h2>
                  <p>
                    Duha Media provides CRO consulting and web design services for Shopify brands. The specific scope, deliverables, timeline, and fees for any engagement are governed by a separate written agreement between Duha Media and the client. These Terms do not constitute a service agreement.
                  </p>
                  <p className="mt-3">
                    Nothing on this website — including descriptions of service tiers, pricing ranges, or expected outcomes — constitutes a binding offer or guarantee. All service engagements begin with a written agreement signed by both parties.
                  </p>
                </section>

                <section id="free-audit" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">4. Free Audit and Founding Client Programme</h2>
                  <p>
                    Submitting your website URL for a free audit or applying for the founding client programme does not create a contractual relationship between you and Duha Media. These are inquiry processes only.
                  </p>
                  <p className="mt-3">
                    Duha Media reserves the right to decline any audit request or founding client application at its sole discretion, without obligation to provide a reason.
                  </p>
                  <p className="mt-3">
                    If selected as a founding client, the terms of that engagement — including deliverables, timeline, what you provide in return, and all associated rights — will be set out in a separate written agreement before any work begins.
                  </p>
                </section>

                <section id="ip" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">5. Intellectual Property</h2>
                  <p>
                    All content on this Site — including text, design, graphics, code, and brand elements — is owned by or licensed to Duha Media and is protected by applicable intellectual property laws.
                  </p>
                  <p className="mt-3">
                    You may not reproduce, distribute, modify, or create derivative works from any Site content without our prior written consent.
                  </p>
                  <p className="mt-3">
                    Content we produce for clients as part of a service engagement is governed by the intellectual property terms in the relevant service agreement — not by these Terms.
                  </p>
                </section>

                <section id="third-party" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">6. Third-Party Links and Tools</h2>
                  <p>
                    This Site may reference or link to third-party websites, tools, or services — including Microsoft Clarity, Google Analytics, Resend, and GrowthBook. These are provided for reference only. Duha Media has no control over third-party content or practices and accepts no responsibility for them. Your use of any third-party service is governed by that service&apos;s own terms and privacy policy.
                  </p>
                </section>

                <section id="disclaimer" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">7. Disclaimer of Warranties</h2>
                  <p>
                    This Site and all content on it are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. Duha Media does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
                  </p>
                  <p className="mt-3">
                    Descriptions of services, outcomes, and case study results on this Site are provided for informational purposes only and do not constitute guarantees. Conversion rate improvements and other results described are specific to the engagements documented and may not be representative of results for other clients.
                  </p>
                </section>

                <section id="limitation" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">8. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by applicable law, Duha Media shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of this Site or our services — including but not limited to loss of revenue, loss of data, or loss of business opportunity — even if Duha Media has been advised of the possibility of such damages.
                  </p>
                  <p className="mt-3">
                    Our total liability to you for any claim arising out of or related to these Terms or the Site shall not exceed the amount you paid to Duha Media in the 12 months preceding the claim, or $100, whichever is greater.
                  </p>
                  <p className="mt-3">
                    Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In those jurisdictions, our liability is limited to the fullest extent permitted by law.
                  </p>
                  <LegalReviewNote>
                    ⚠ NOTE FOR LEGAL REVIEW: The limitation of liability cap above is a placeholder. The appropriate cap for a service business of this type should be reviewed by a qualified attorney before publication.
                  </LegalReviewNote>
                </section>

                <section id="indemnification" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">9. Indemnification</h2>
                  <p>
                    You agree to indemnify, defend, and hold harmless Duha Media and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising out of your use of the Site, your violation of these Terms, or your violation of any third party&apos;s rights.
                  </p>
                </section>

                <section id="governing-law" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">10. Governing Law and Disputes</h2>
                  <p>
                    These Terms are governed by the laws of the United States, without regard to conflict of law principles.
                  </p>
                  <LegalReviewNote>
                    ⚠ NOTE FOR LEGAL REVIEW: A specific state should be inserted here based on where Duha Media is incorporated or primarily operates (e.g., &ldquo;the State of [STATE]&rdquo;). The governing law clause should be finalized by a qualified attorney.
                  </LegalReviewNote>
                  <p className="mt-4">
                    Any dispute arising out of or relating to these Terms or the Site that cannot be resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction to prevent irreparable harm.
                  </p>
                </section>

                <section id="changes" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">11. Changes to These Terms</h2>
                  <p>
                    We may update these Terms at any time. When we do, we will update the &ldquo;last updated&rdquo; date at the top of the page. Material changes will be communicated to subscribers by email before they take effect.
                  </p>
                  <p className="mt-3">
                    Your continued use of the Site after changes are posted constitutes acceptance of the updated Terms. If you do not agree to the updated Terms, you should stop using the Site.
                  </p>
                </section>

                <section id="contact" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">12. Contact</h2>
                  <p>For any questions about these Terms:</p>
                  <ul className="space-y-1 pl-3 mt-3">
                    <li className="flex gap-2">
                      <span className="text-brand-ink/30 flex-shrink-0">—</span>
                      <span>
                        Email:{" "}
                        <a href="mailto:legal@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                          legal@duhamedia.com
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-ink/30 flex-shrink-0">—</span>
                      <span>Website: duhamedia.com</span>
                    </li>
                  </ul>
                  <p className="mt-3">We aim to respond to all legal inquiries within 5 business days.</p>
                </section>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
