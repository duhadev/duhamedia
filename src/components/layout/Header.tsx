"use client";

import { useState } from "react";
import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";

interface NavChild {
  label: string;
  href: string;
  desc?: string;
  featured?: boolean;
}

interface NavLink {
  label: string;
  href: string;
  mega?: boolean;
  children?: NavChild[];
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Services",
    href: "/services",
    mega: true,
    children: [
      {
        label: "Class B — Optimization",
        href: "/services/class-b",
        desc: "Monthly CRO retainer — ongoing split tests, heatmaps, and conversion improvements.",
        featured: true,
      },
      {
        label: "Class A — Design & Build",
        href: "/services/class-a",
        desc: "Full Shopify store design and development from scratch.",
      },
      {
        label: "Class C — Audit",
        href: "/services/class-c",
        desc: "One-time conversion audit with a prioritized fix list.",
      },
    ],
  },
  { label: "How it works", href: "/how-it-works" },
  {
    label: "Results",
    href: "/results",
    children: [
      { label: "Case Studies", href: "/results/case-studies" },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    mega: true,
    children: [
      {
        label: "Blog",
        href: "/insights/blog",
        desc: "Practitioner-level CRO articles from people running tests every week.",
      },
      {
        label: "Teardowns",
        href: "/insights/teardowns",
        desc: "Page-by-page breakdowns of real Shopify stores with actionable fixes.",
      },
    ],
  },
  { label: "About", href: "/about" },
];

interface HeaderProps {
  activePage?: string;
}

function MegaMenu({
  label,
  tagline,
  footerHint,
  children,
  href,
  onClose,
}: {
  label: string;
  tagline: string;
  footerHint: React.ReactNode;
  children: NavChild[];
  href: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[440px] z-50">
      {/* Invisible bridge to prevent gap-triggered close */}
      <div className="absolute -top-3 left-0 w-full h-3" />
      <div className="bg-white border border-black/10 rounded-sm shadow-xl overflow-hidden">
        {/* Header row */}
        <div className="px-5 pt-5 pb-4 border-b border-black/8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] text-brand-ink/35 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-brand-ink leading-snug">
                {tagline}
              </p>
            </div>
            <Link
              href={href}
              className="font-mono text-[10px] text-brand-crimson underline underline-offset-2 whitespace-nowrap mt-0.5"
              onClick={onClose}
            >
              All {label.toLowerCase()} →
            </Link>
          </div>
        </div>

        {/* Tier cards */}
        <div className="p-3 flex flex-col gap-1.5">
          {children.map((child) =>
            child.featured ? (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="group relative flex items-start gap-4 px-4 py-3.5 rounded-sm bg-brand-offwhite border border-brand-magenta/20 hover:border-brand-magenta/50 transition-all"
              >
                {/* Accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-magenta rounded-l-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-brand-magenta uppercase tracking-widest">
                      {child.label}
                    </span>
                    <span className="font-mono text-[9px] bg-brand-magenta text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                  <p className="text-xs text-brand-ink/70 leading-relaxed group-hover:text-brand-ink/90 transition-colors">
                    {child.desc}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-magenta/40 group-hover:text-brand-magenta mt-0.5 flex-shrink-0 transition-colors"
                  aria-hidden="true"
                >
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8,3 12,7 8,11" />
                </svg>
              </Link>
            ) : (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="group flex items-start gap-4 px-4 py-3 rounded-sm hover:bg-brand-offwhite transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] font-bold text-brand-ink/50 uppercase tracking-widest mb-1 group-hover:text-brand-ink/70 transition-colors">
                    {child.label}
                  </p>
                  <p className="text-xs text-brand-ink/55 leading-relaxed group-hover:text-brand-ink/80 transition-colors">
                    {child.desc}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-ink/20 group-hover:text-brand-ink/50 mt-0.5 flex-shrink-0 transition-colors"
                  aria-hidden="true"
                >
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8,3 12,7 8,11" />
                </svg>
              </Link>
            )
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-black/6 bg-brand-offwhite/50">
          <p className="font-mono text-[10px] text-brand-ink/35">{footerHint}</p>
        </div>
      </div>
    </div>
  );
}

function SimpleDropdown({
  children,
  onClose,
}: {
  children: NavChild[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-0 pt-2 min-w-[160px] z-50">
      <div className="absolute -top-2 left-0 w-full h-2" />
      <div className="bg-white border border-black/10 rounded-sm shadow-lg py-1">
        {children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="block px-4 py-2.5 text-sm text-brand-ink/65 hover:text-brand-ink hover:bg-brand-offwhite transition-colors"
            onClick={onClose}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header({ activePage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/10">
      <div className="px-6 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Duha Media — Home"
        >
          <LogoMark size={32} />
          <span className="font-bold text-brand-ink text-lg">duha media</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    activePage === link.label
                      ? "text-brand-crimson border-b border-brand-crimson pb-0.5"
                      : "text-brand-ink/60 hover:text-brand-ink"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === link.label}
                  onClick={() =>
                    setOpenDropdown(openDropdown === link.label ? null : link.label)
                  }
                >
                  {link.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-150 ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <polyline points="1,3 5,7 9,3" />
                  </svg>
                </button>

                {openDropdown === link.label &&
                  (link.mega ? (
                    <MegaMenu
                      label={link.label}
                      tagline={
                        link.label === "Services"
                          ? "CRO and web design for Shopify stores."
                          : "Practitioner-level CRO content from people running tests every week."
                      }
                      footerHint={
                        link.label === "Services" ? (
                          <>
                            Not sure which fits? The{" "}
                            <Link
                              href="/how-it-works"
                              className="text-brand-crimson underline underline-offset-2"
                              onClick={() => setOpenDropdown(null)}
                            >
                              How it works
                            </Link>{" "}
                            page explains the difference.
                          </>
                        ) : (
                          <>
                            One teardown or CRO insight per month —{" "}
                            <Link
                              href="/insights"
                              className="text-brand-crimson underline underline-offset-2"
                              onClick={() => setOpenDropdown(null)}
                            >
                              subscribe to the newsletter
                            </Link>
                            .
                          </>
                        )
                      }
                      children={link.children}
                      href={link.href}
                      onClose={() => setOpenDropdown(null)}
                    />
                  ) : (
                    <SimpleDropdown
                      children={link.children}
                      onClose={() => setOpenDropdown(null)}
                    />
                  ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  activePage === link.label
                    ? "text-brand-crimson border-b border-brand-crimson pb-0.5"
                    : "text-brand-ink/60 hover:text-brand-ink"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/free-audit"
            className="font-mono text-xs text-brand-crimson underline underline-offset-2 hover:text-brand-magenta transition-colors"
          >
            Free audit
          </Link>
          <Link
            href="/contact"
            className="bg-brand-crimson text-white text-xs font-bold px-3 py-2 rounded-sm hover:bg-brand-magenta transition-colors min-h-[44px] flex items-center"
          >
            Book a call
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 text-brand-ink"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] bg-white z-40 overflow-y-auto border-t border-black/10">
          <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <>
                    <button
                      className={`w-full flex items-center justify-between text-base font-medium py-4 border-b border-black/10 transition-colors ${
                        activePage === link.label
                          ? "text-brand-crimson"
                          : "text-brand-ink hover:text-brand-crimson"
                      }`}
                      aria-expanded={expandedMobile === link.label}
                      onClick={() =>
                        setExpandedMobile(
                          expandedMobile === link.label ? null : link.label
                        )
                      }
                    >
                      {link.label}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-150 ${
                          expandedMobile === link.label ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <polyline points="3,5 8,10 13,5" />
                      </svg>
                    </button>
                    {expandedMobile === link.label && (
                      <div className="border-b border-black/10">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center justify-between pl-5 pr-4 py-3.5 border-b border-black/5 last:border-0 transition-colors ${
                              child.featured
                                ? "text-brand-magenta hover:text-brand-crimson"
                                : "text-brand-ink/65 hover:text-brand-crimson"
                            }`}
                            onClick={() => {
                              setMenuOpen(false);
                              setExpandedMobile(null);
                            }}
                          >
                            <span className="text-sm font-medium">{child.label}</span>
                            {child.featured && (
                              <span className="font-mono text-[9px] bg-brand-magenta text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                Popular
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`block text-base font-medium py-4 border-b border-black/10 transition-colors ${
                      activePage === link.label
                        ? "text-brand-crimson"
                        : "text-brand-ink hover:text-brand-crimson"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/free-audit"
                className="block text-center py-3 bg-brand-crimson rounded-sm text-white text-sm font-bold hover:bg-brand-magenta transition-colors min-h-[44px] flex items-center justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Free audit
              </Link>
              <Link
                href="/contact"
                className="block text-center py-3 border border-brand-ink/20 rounded-sm text-brand-ink text-sm font-medium hover:border-brand-ink/40 transition-colors min-h-[44px] flex items-center justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Book a call
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
