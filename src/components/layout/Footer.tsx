import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";
import FooterNewsletter from "@/components/ui/FooterNewsletter";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Methodology", href: "/methodology" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Results", href: "/results" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Conversion Guarantee", href: "/services/class-b#conversion-guarantee" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-ink border-t border-white/10 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={20} />
              <span className="font-bold text-white text-base">duha media</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Web design, development &amp; CRO for Shopify brands.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-bold text-white text-sm mb-3">Navigation</p>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-white/40 hover:text-white/70 transition-colors mb-1.5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p className="font-bold text-white text-sm mb-3">Legal</p>
            <Link
              href="/privacy"
              className="block text-sm text-white/40 hover:text-white/70 transition-colors mb-1.5"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="block text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Terms of service
            </Link>
          </div>

          {/* Newsletter */}
          <FooterNewsletter />
        </div>

        <p className="font-mono text-sm text-white/20 border-t border-white/10 pt-6">
          © Duha Media · duhamedia.com
        </p>
      </div>
    </footer>
  );
}
