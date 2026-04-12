import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/sections/PageHero";

const tocItems = [
  { label: "1. Who we are", href: "#who-we-are" },
  { label: "2. What we collect", href: "#what-we-collect" },
  { label: "3. How we use it", href: "#how-we-use" },
  { label: "4. Legal basis", href: "#legal-basis" },
  { label: "5. Who we share with", href: "#sharing" },
  { label: "6. Retention", href: "#retention" },
  { label: "7. Your rights", href: "#your-rights" },
  { label: "8. Cookies", href: "#cookies" },
  { label: "9. Security", href: "#security" },
  { label: "10. Children", href: "#childrens-privacy" },
  { label: "11. Changes", href: "#changes" },
  { label: "12. Contact", href: "#contact" },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          label="Legal"
          heading="Privacy Policy"
          headingSize="sm"
          meta="Duha Media · Last updated: [DATE] · Effective: [DATE]"
          subhead="We collect a small amount of personal data to deliver our services and follow up on requests. This policy explains exactly what we collect, why we collect it, how we use it, and what your rights are. We've written it in plain language because we think that's the point of a privacy policy."
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

                <section id="who-we-are">
                  <h2 className="font-bold text-brand-ink text-base mb-3">1. Who We Are</h2>
                  <p>
                    Duha Media (&ldquo;Duha Media,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website duhamedia.com. We provide CRO consulting and web design services for Shopify brands. For the purposes of this policy, Duha Media is the data controller for personal information collected through this website.
                  </p>
                  <p className="mt-3">
                    If you have questions about this policy or how we handle your data, contact us at:{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>
                  </p>
                </section>

                <section id="what-we-collect" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">2. What Personal Data We Collect</h2>
                  <p className="mb-4">We collect personal data in the following ways:</p>

                  <div className="space-y-5">
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">When you request a PDF brief (any service page)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your email address</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your website URL</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">When you submit your site for a free audit (/free-audit)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your website URL</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">When you book a call (/contact)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your name</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your email address</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Any information you provide in the message field</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">When you apply for the founding client programme (/founding-client/apply)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your website URL</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your approximate monthly revenue range</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your approximate monthly sessions range</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Whether you run paid ads</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your description of your conversion problem</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Any additional information you choose to provide</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">When you subscribe to our newsletter (footer and Insights pages)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Your email address</li>
                      </ul>
                    </div>
                  </div>

                  <p className="mt-5">
                    We do not collect payment information directly. We do not collect sensitive personal information as defined under applicable law (such as health data, racial or ethnic origin, or financial account details).
                  </p>
                  <p className="mt-3">
                    We also collect non-personal technical data automatically when you visit our website — including browser type, device type, pages visited, and referring URL. This data is collected through Microsoft Clarity and Google Analytics 4 (GA4) and is used in aggregate to understand how visitors use the site. This data is not linked to your personal identity unless you have submitted a form on this site.
                  </p>
                </section>

                <section id="how-we-use" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">3. How We Use Your Personal Data</h2>
                  <p className="mb-4">We use the personal data we collect for the following purposes:</p>

                  <div className="space-y-5">
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">Email address (PDF gate, newsletter, contact form)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To deliver the PDF brief you requested</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To send the newsletter you subscribed to</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To follow up on your inquiry or booking request</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To send occasional relevant communications about our services</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">Website URL (PDF gate, free audit, founding client application)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To review your site as part of your audit or application</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To personalize any follow-up we send you</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>We will not share your URL with third parties for any purpose</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">Founding client application data</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To assess whether your store is a good fit for the engagement</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To communicate with you about your application</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>We do not use application data for marketing purposes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-brand-ink/80 mb-1.5">Behavioral data (Microsoft Clarity, GA4)</p>
                      <ul className="space-y-1 pl-3">
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To understand how visitors use the site</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>To improve the site&apos;s content and structure</li>
                        <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>This data is processed in aggregate and not used to identify individual visitors</li>
                      </ul>
                    </div>
                  </div>

                  <p className="mt-5">
                    We will not send unsolicited marketing emails. Every email we send includes an unsubscribe link. We will honor unsubscribe requests promptly — within 10 business days.
                  </p>
                </section>

                <section id="legal-basis" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">4. Legal Basis for Processing (US and International Visitors)</h2>
                  <p>
                    For visitors based in the United States, we process your personal data on the basis of your consent (when you submit a form) and our legitimate interest in following up on genuine business inquiries.
                  </p>
                  <p className="mt-3">
                    For visitors based in the European Economic Area (EEA) or United Kingdom, we process your personal data under the following lawful bases as defined under the General Data Protection Regulation (GDPR):
                  </p>
                  <ul className="space-y-1 pl-3 mt-3">
                    <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Consent: when you submit a form, subscribe to the newsletter, or request a PDF</li>
                    <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Legitimate interests: when we follow up on a business inquiry you have initiated</li>
                  </ul>
                  <p className="mt-3">
                    You have the right to withdraw consent at any time by contacting us at{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>{" "}
                    or using the unsubscribe link in any email we send.
                  </p>
                </section>

                <section id="sharing" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">5. Who We Share Your Data With</h2>
                  <p>
                    We do not sell your personal data. We do not share it with third parties for their own marketing purposes.
                  </p>
                  <p className="mt-3 mb-5">
                    We share your data only with the following service providers, who process it on our behalf and under our instructions:
                  </p>

                  <div className="space-y-5">
                    {[
                      {
                        name: "Resend (resend.com)",
                        purpose: "Email delivery — PDF briefs, newsletter, follow-up emails",
                        data: "Your email address and the content of emails we send",
                        policy: "resend.com/privacy",
                      },
                      {
                        name: "Microsoft Clarity (clarity.microsoft.com)",
                        purpose: "Behavioral analytics — heatmaps, session recordings, aggregate traffic data",
                        data: "Behavioral and technical data (not linked to your personal identity unless you have submitted a form)",
                        policy: "privacy.microsoft.com",
                      },
                      {
                        name: "Google Analytics 4 (analytics.google.com)",
                        purpose: "Traffic analytics — sessions, sources, page performance",
                        data: "Behavioral and technical data in aggregate",
                        policy: "policies.google.com/privacy",
                      },
                    ].map((provider) => (
                      <div key={provider.name} className="border border-black/10 rounded-sm p-4">
                        <p className="font-medium text-brand-ink/80 mb-2">{provider.name}</p>
                        <ul className="space-y-1 pl-3">
                          <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Purpose: {provider.purpose}</li>
                          <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Data shared: {provider.data}</li>
                          <li className="flex gap-2"><span className="text-brand-ink/30 flex-shrink-0">—</span>Privacy policy: {provider.policy}</li>
                        </ul>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5">
                    We do not use any other third-party tools that process personal data on our behalf at this time. If this changes, we will update this policy and notify subscribers by email.
                  </p>
                </section>

                <section id="retention" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">6. How Long We Keep Your Data</h2>
                  <p>
                    Email addresses and associated inquiry data are retained for as long as the relationship is active — meaning while you are a subscriber, applicant, or active client — and for up to 24 months after the last meaningful interaction.
                  </p>
                  <p className="mt-3">
                    Founding client application data is retained for 12 months from the date of application, regardless of outcome.
                  </p>
                  <p className="mt-3">
                    Behavioral data collected through Clarity and GA4 is retained according to those platforms&apos; own retention settings, which we configure to the minimum available period.
                  </p>
                  <p className="mt-3">
                    You may request deletion of your personal data at any time by contacting{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>
                    . We will action deletion requests within 30 days.
                  </p>
                </section>

                <section id="your-rights" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">7. Your Rights</h2>
                  <p className="mb-4">
                    Depending on where you are located, you may have some or all of the following rights regarding your personal data:
                  </p>
                  <div className="space-y-3">
                    {[
                      { right: "Right to access", desc: "You can request a copy of the personal data we hold about you." },
                      { right: "Right to correction", desc: "You can ask us to correct inaccurate or incomplete personal data." },
                      { right: "Right to deletion", desc: "You can ask us to delete your personal data. We will comply unless we are required to retain it by law." },
                      { right: "Right to opt out of marketing", desc: "Every marketing email we send includes an unsubscribe link. You can also email privacy@duhamedia.com to opt out of all marketing communications." },
                    ].map((item) => (
                      <div key={item.right} className="flex gap-3">
                        <span className="text-brand-ink/30 flex-shrink-0 mt-0.5">—</span>
                        <p><span className="font-medium text-brand-ink/80">{item.right}</span> — {item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 font-medium text-brand-ink/80">California residents</p>
                  <p className="mt-1">
                    Under the California Consumer Privacy Act (CCPA), you have the right to know what personal information we collect, the right to delete it, and the right to opt out of its sale. We do not sell personal information. To exercise your rights, contact us at{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>
                    .
                  </p>
                  <p className="mt-4 font-medium text-brand-ink/80">EEA and UK residents</p>
                  <p className="mt-1">
                    Under GDPR and UK GDPR, you have the right to access, correct, delete, restrict processing of, and port your personal data. You also have the right to lodge a complaint with your local data protection authority.
                  </p>
                  <p className="mt-4">
                    To exercise any of these rights, contact us at{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>
                    . We will respond within 30 days.
                  </p>
                </section>

                <section id="cookies" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">8. Cookies</h2>
                  <p className="mb-4">
                    This website uses cookies and similar tracking technologies for the following purposes:
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-brand-ink/30 flex-shrink-0 mt-0.5">—</span>
                      <p><span className="font-medium text-brand-ink/80">Essential cookies</span> — required for the site to function. These cannot be disabled.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-brand-ink/30 flex-shrink-0 mt-0.5">—</span>
                      <p><span className="font-medium text-brand-ink/80">Analytics cookies</span> — used by Microsoft Clarity and Google Analytics 4 to understand how visitors use the site. These are not linked to your personal identity.</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    We do not use advertising cookies or retargeting cookies. We do not use cookies to build advertising profiles.
                  </p>
                  <p className="mt-3">
                    Most browsers allow you to control cookies through their settings. If you disable analytics cookies, the site will continue to function normally but we will lose the ability to understand and improve it.
                  </p>
                </section>

                <section id="security" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">9. Security</h2>
                  <p>
                    We take reasonable technical and organizational measures to protect your personal data from unauthorized access, loss, or disclosure. These include encrypted data transmission (HTTPS), access controls on systems that store personal data, and use of reputable third-party processors with their own security certifications.
                  </p>
                  <p className="mt-3">
                    No method of transmission over the internet is completely secure. We cannot guarantee absolute security, but we will notify you without undue delay if we become aware of a breach that affects your personal data.
                  </p>
                </section>

                <section id="childrens-privacy" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">10. Children&apos;s Privacy</h2>
                  <p>
                    This website is not directed at children under 13 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us at{" "}
                    <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                      privacy@duhamedia.com
                    </a>{" "}
                    and we will delete it promptly.
                  </p>
                </section>

                <section id="changes" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">11. Changes to This Policy</h2>
                  <p>
                    We may update this privacy policy from time to time. When we do, we will update the &ldquo;last updated&rdquo; date at the top of the page. If the changes are material — meaning they significantly affect how we process your data — we will notify subscribers by email before the changes take effect.
                  </p>
                  <p className="mt-3">
                    Your continued use of the site after changes are posted constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section id="contact" className="border-t border-black/10 pt-8 mt-8">
                  <h2 className="font-bold text-brand-ink text-base mb-3">12. Contact</h2>
                  <p>For any questions about this privacy policy or how we handle your personal data:</p>
                  <ul className="space-y-1 pl-3 mt-3">
                    <li className="flex gap-2">
                      <span className="text-brand-ink/30 flex-shrink-0">—</span>
                      <span>
                        Email:{" "}
                        <a href="mailto:privacy@duhamedia.com" className="text-brand-crimson underline underline-offset-2">
                          privacy@duhamedia.com
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-ink/30 flex-shrink-0">—</span>
                      <span>Website: duhamedia.com</span>
                    </li>
                  </ul>
                  <p className="mt-3">We aim to respond to all privacy-related inquiries within 5 business days.</p>
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
