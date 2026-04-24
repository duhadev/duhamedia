const SITE_URL = "https://duhamedia.com";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Duha Media",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Web design and conversion rate optimization for Shopify brands. Heuristic CRO and structured A/B testing, backed by live reporting and the Conversion Guarantee.",
    sameAs: [],
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
  tier: "A" | "B" | "C";
  priceDescription: string;
}

export function serviceSchema({ name, description, path, tier, priceDescription }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: {
      "@type": "Organization",
      name: "Duha Media",
      url: SITE_URL,
    },
    serviceType:
      tier === "A"
        ? "Growth Intensive — CRO + A/B testing retainer"
        : tier === "B"
          ? "CRO Core — heuristic CRO retainer"
          : "Foundation — Shopify design & build",
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      description: priceDescription,
      priceCurrency: "USD",
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function jsonLd(schema: unknown) {
  return { __html: JSON.stringify(schema) };
}
