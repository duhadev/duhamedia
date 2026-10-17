# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Duha Media** is a web design and optimization agency targeting small businesses. This repository contains the agency's marketing website.

**Current Status**: All primary pages implemented. Homepage, all service tiers, how-it-works, results, insights hub, about, contact, and the lead magnet page are live.

**Stack**:
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4 (no `tailwind.config.ts` — all tokens defined in `src/app/globals.css`)
- Language: TypeScript

## Reference Design Files

The `pages/` folder is **reference-only** — it is not part of the Next.js build and should never be imported or routed. It contains:

- **`pages/_brand.txt`** — authoritative brand token spec (colors, fonts, typography rules)
- **`pages/tailwind.config.extension.js`** — token values to add to `globals.css`
- **`pages/page-*.tsx`** — reference page implementations showing layout intent and component structure
- Other files (`Home.tsx`, `Programs.tsx`, etc.) are from a client project and are unrelated to this codebase

When implementing a page, read the corresponding `pages/page-*.tsx` file as a design reference for structure and copy. Do not copy its code directly — adapt it to this project's conventions.

**Implemented routes:**
| Route | Reference file |
|---|---|
| `/` | `pages/page-homepage.tsx` |
| `/services` | `pages/page-services.tsx` |
| `/services/class-a` | `pages/page-class-a.tsx` |
| `/services/class-b` | `pages/page-class-b.tsx` |
| `/services/class-c` | `pages/page-class-c.tsx` |
| `/how-it-works` | `pages/page-how-it-works.tsx` |
| `/results` | `pages/page-results.tsx` |
| `/results/case-studies` | `pages/page-case-studies.tsx` |
| `/about` | — |
| `/contact` | — |
| `/insights` | — |
| `/insights/blog` | — |
| `/insights/teardowns` | — |
| `/free-audit` | — (lead magnet landing page) |
| `/15-minute-audit` | — (redirects to `/free-audit`) |

## Design System Architecture

The project follows a **design-first approach** with comprehensive specifications before implementation. All design decisions are documented in `/design/` and `pages/_brand.txt`.

### Key Design Documents

1. **`pages/_brand.txt`** — authoritative brand token reference (colors, fonts, typography scale, button hierarchy, brand rules)
2. **`design/style-guide.md`** — full design system including accessibility, spacing, responsive patterns, component specs
3. **`design/page-layouts.md`** — detailed page structure for all routes

### Critical Design Principles

**Mobile-First**: 75%+ of traffic is mobile. Design for 320px mobile first, enhance for larger screens.

**Accessibility-First**: WCAG 2.1 AA compliance is non-negotiable. All color combinations, interactive elements, and content must meet accessibility standards.

**Performance-Conscious**: Target sub-2-second page loads. Use Next.js Image component, lazy loading, code splitting.

**Conversion-Oriented**: Clear CTAs, reduced friction, strategic placement of calls-to-action throughout.

**SMB-Focused**: Design for time-constrained small business owners. Clear, concise, transparent.

## Color System (Critical for Implementation)

Brand tokens are defined in `src/app/globals.css` under `@theme inline`. The authoritative source for values is `pages/_brand.txt`.

### Brand Color Tokens
| Token | Hex | Usage |
|---|---|---|
| `brand-ink` | `#0F172A` | Text, dark backgrounds, nav |
| `brand-crimson` | `#c20e59` | Hover states |
| `brand-magenta` | `#e82561` | CTAs, buttons, active links |
| `brand-gold` | `#f5c842` | Callouts, badges (sparingly) |
| `brand-cream` | `#fce588` | Newsletter tint, warm accents (sparingly) |
| `brand-offwhite` | `#F8F8F6` | Page backgrounds, content sections |

### Section Background Pattern (alternating)
1. Dark hero: `bg-brand-ink`
2. Content alt: `bg-brand-offwhite`
3. Content: `bg-white`
4. CTA section: `bg-brand-ink`

**IMPORTANT**: Never use brand colors on interactive elements unless they are the designated CTA colors (`brand-magenta`, `brand-crimson`). Never hardcode hex values — always use token classes.

## Typography System

**Font Families** (both loaded in `src/app/layout.tsx` via `next/font/google`):
- `IBM Plex Sans` — headings and body text (`font-sans`)
- `IBM Plex Mono` — labels, metadata, tags, tier identifiers (`font-mono`)

**Type Scale** (Tailwind classes):
| Role | Class |
|---|---|
| Display | `text-5xl font-bold tracking-tightest` |
| H1 | `text-4xl font-bold tracking-tighter` |
| H2 | `text-2xl font-bold tracking-tight` |
| H3 | `text-xl font-medium` |
| Body | `text-base font-normal leading-relaxed` |
| Label | `text-xs font-mono font-medium uppercase tracking-widest` |
| Metadata | `text-xs font-mono text-brand-ink/40` |

**Hierarchy Rules**:
- One H1 per page
- Never skip heading levels (H1 → H2 → H3, never H1 → H3)
- Maximum line length: 75 characters

## Responsive Breakpoints

```
Mobile:        320px–639px   (4-column grid)
Tablet (md):   640px–1023px  (8-column grid)
Desktop (lg):  1024px–1279px (12-column grid)
Large (xl):    1280px–1535px
Extra (2xl):   1536px+
```

**Container Widths**:
- Narrow: 768px (blog posts, long-form content)
- Default: 1280px (most content)
- Wide: 1440px (hero sections)

**Hero section pattern** (consistent across all pages):
```tsx
<section className="bg-brand-ink px-6 py-20">
  <div className="max-w-3xl mx-auto">
    <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">Label</p>
    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>...</h1>
    <p className="text-base text-white/55 leading-relaxed">...</p>
  </div>
</section>
```
Do not use `md:py-28` or widen beyond `max-w-3xl` on hero containers — breaks visual consistency.

## Accessibility Requirements

All implementations must meet:

- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text (18px+)
- **Touch Targets**: 44×44px minimum for all interactive elements
- **Keyboard Navigation**: All interactive elements must be keyboard accessible with visible focus indicators (2px outline)
- **Screen Readers**: Semantic HTML first, ARIA only when semantic HTML insufficient
- **Forms**: Labels always visible (not placeholder-only), error messages announced
- **Heading Hierarchy**: No skipped levels, one H1 per page

**Testing Requirements**:
- Lighthouse accessibility audit: Target 100
- Axe DevTools: 0 violations
- Manual keyboard navigation test
- Screen reader test (NVDA/VoiceOver)

## Component Specifications

### Buttons
- **Primary**: `bg-brand-magenta text-white font-bold text-sm rounded-sm px-5 py-2.5`
- **Secondary**: `border border-brand-ink text-brand-ink text-sm rounded-sm px-5 py-2.5`
- **Ghost**: `font-mono text-xs text-brand-crimson underline uppercase tracking-wider`
- **Minimum size**: 44×44px (accessibility)
- **Text**: Always descriptive ("Get Started", never "Click Here")
- **States**: Default, Hover (`brand-crimson`), Active, Focus (2px outline), Disabled, Loading

### Forms
- **Optimal fields**: 4 fields maximum for best conversion
- **Labels**: Always visible, positioned above input
- **Input height**: 44px minimum
- **Font size**: 1rem (16px) to prevent iOS zoom
- **Validation**: Inline, on blur or submit
- **Error messages**: Clear, specific, with error icon

### Cards
- **Background**: White (`bg-white`)
- **Border**: `border border-neutral-200`
- **Border Radius**: `rounded-sm` (3–4px — sharp corners signal precision)
- **Padding**: 24px standard, 40–48px feature cards
- **Shadow**: Subtle default, lifted on hover
- **Hover**: `translateY(-2px to -4px)`, increased shadow
- **No gradients** — flat color only

### Navigation
- **Desktop**: 80px height, horizontal layout, sticky top
- **Mobile**: 64px height, hamburger menu (full-screen slide-in)
- **Logo**: 40–48px height (desktop), 32–36px (mobile)
- **Links**: `text-base font-semibold`, active page has bottom border
- **CTA**: Single "Get free audit" button → `/free-audit`

### Primary CTA Destination
All site-wide CTAs (header button, hero button, `FinalCTA` section) link to **`/free-audit`** — the dedicated lead magnet landing page for the "15-Minute Shopify Conversion Leak Audit". The legacy `/15-minute-audit` URL redirects to `/free-audit`. Do not route these CTAs to `/contact`. The `/contact` page is for general enquiries. The exception is `DualCTA`, which currently links to `/contact`.

### Shared Section Components
- **`DualCTA`** (`src/components/sections/DualCTA.tsx`) — reusable dark CTA section used at the bottom of service pages. Accepts a `heading` prop.
- **`ConversionGuarantee`** (`src/components/sections/ConversionGuarantee.tsx`) — Class B guarantee section, placed on the homepage between `Results` and `FinalCTA`.
- **`FinalCTA`** (`src/components/sections/FinalCTA.tsx`) — homepage-specific CTA with URL input field, links to `/free-audit`.

### Logo Mark
- Four-band SVG (top to bottom): `brand-cream`, `brand-gold`, `brand-magenta`, `brand-crimson`
- Clipped to circle. See `pages/page-homepage.tsx` for the inline SVG reference.

## Performance Targets

### Homepage
- LCP: < 2.0s
- FID: < 75ms
- CLS: < 0.05
- Page Size: < 1MB

### All Pages
- Use `next/image` (`Image`) — never `<img>` tags
- Preload critical fonts
- Code splitting by route
- Minimal JavaScript

## Development Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

TypeScript check: `npx tsc --noEmit`

## Implementation Guidelines

### When Building Components
1. **Check reference first**: Read the relevant `pages/page-*.tsx` for layout and copy intent
2. **Check existing components**: Look in `src/components/ui/`, `src/components/layout/`, `src/components/sections/` before creating new ones
3. **Mobile-first CSS**: Write mobile styles first, use `md:` / `lg:` prefixes for larger screens
4. **Accessibility by default**: Include ARIA labels, keyboard handlers, focus states from the start
5. **Use token classes only**: Never hardcode colors or font names
6. **Test responsively**: Verify at 320px, 768px, 1280px

### Page Structure Pattern
All pages follow this structure:
1. `<Header />` (sticky)
2. Hero Section (above-fold impact)
3. Main Content (modular sections)
4. CTA Section (before footer)
5. `<Footer />`

### Spacing Usage
- **Component internal**: 16–24px padding
- **Component groups**: 32px spacing
- **Sections**: 48–80px spacing
- **Hero/Large sections**: 64–128px padding

### Forms Pattern
- Limit to 4 fields for optimal conversion
- Vertical layout (labels above inputs)
- Single column on all screen sizes
- Full-width submit button on mobile
- Clear error messages with solutions

## Critical Don'ts

- **Never mix color purposes**: `brand-magenta` / `brand-crimson` are for interactive elements only; `brand-ink` is for text/dark backgrounds
- **Never hardcode hex values**: Always use token classes
- **Never use gradients**: Flat color only
- **Never use stock photography of people**
- **Never use border-radius > 4px**: `rounded-sm` is the maximum for cards and buttons
- **Never skip accessibility**: No interactive element without keyboard support, ARIA labels, and focus states
- **Never ignore mobile**: No desktop-first design or missing 44px touch targets
- **Never hide labels**: No placeholder-only forms
- **Never skip heading levels**: No H1 → H3
- **Never use low contrast**: All text must meet 4.5:1 minimum
- **Never add animations that flash**: Respect `prefers-reduced-motion`
- **One primary CTA per section maximum**

## File Structure

```
/pages                   # REFERENCE ONLY — not part of Next.js build
  _brand.txt             # Authoritative brand token spec
  tailwind.config.extension.js
  page-homepage.tsx / page-services.tsx / page-class-a.tsx / etc.
/src
  /app                   # Next.js App Router
    layout.tsx           # Root layout — fonts loaded here (IBM Plex Sans + Mono)
    globals.css          # Tailwind v4 @theme inline — all design tokens live here
    page.tsx             # Homepage (/)
    /free-audit/         # Lead magnet landing page (primary CTA destination)
    /15-minute-audit/    # Redirects → /free-audit
    /about/
    /contact/
    /how-it-works/
    /insights/           # Hub + /blog/ + /teardowns/
    /results/            # + /case-studies/
    /services/           # + /class-a/ /class-b/ /class-c/
  /components
    /ui                  # Button, Card, SectionHeader, LogoMark, ScrollReveal,
                         # PDFLeadCapture, NewsletterFloat, CaseStudiesComingSoon
    /layout              # Header (client, mega-menu), Footer
    /sections            # Hero, TrustSignals, CROBridge, Methodology (client, scroll animations),
                         # ServicesOverview, Results, ConversionGuarantee, FinalCTA,
                         # DualCTA, WhatWeTrack, CaseStudies
/public                  # Static assets
/design                  # Design documentation
```

**Client components** (require `"use client"`): `Header`, `Methodology` (IntersectionObserver scroll animations), `PDFLeadCapture`, `NewsletterFloat`, and any page with form state.

## Content Strategy

**Target Audience**: Small business owners (time-constrained, non-technical)

**Tone**: Professional yet approachable, clear, transparent

**Services Offered**:
1. Website Design & Development
2. Website Optimization (SEO & CRO)

## User Input Locations

All places in the codebase where user input is captured. Most forms show a local success state only — backend integration is pending.

| File | Fields | Purpose | API route |
|---|---|---|---|
| `src/app/free-audit/page.tsx` | storeUrl, name, email, phone (optional) | Claim free 15-min audit | `POST /api/audit-request` |
| `src/app/contact/page.tsx` | name, email, website, reason (radio), message (optional) | General contact enquiry | `POST /api/contact` |
| `src/app/founding-client/apply/page.tsx` | store, revenue, sessions, ads, problem, other (optional) | Founding client application | `POST /api/founding-client-apply` |
| `src/components/ui/PDFLeadCapture.tsx` | email, url (optional), tier | Download service brief PDF | `POST /api/pdf-lead` |
| `src/components/ui/NewsletterFloat.tsx` | email | Newsletter signup (floating widget) | `POST /api/newsletter` (source: `newsletter-float`) |
| `src/components/ui/CaseStudiesComingSoon.tsx` | email | Notify me (accepts a `source` prop) | `POST /api/newsletter` |
| `src/app/insights/page.tsx` (inline newsletter) | email | CRO insights newsletter | `POST /api/newsletter` (source: `insights-newsletter`) |
| `src/app/about/page.tsx` (inline newsletter) | email | Insights newsletter | `POST /api/newsletter` (source: `about-newsletter`) |
| `src/components/sections/FinalCTA.tsx` | store URL (uncontrolled) | Quick entry — navigates to `/free-audit` | Navigation only |

**CaseStudiesComingSoon source values in use:**
- `notify-teardowns` (insights teardowns section)
- `notify-blog` (insights blog section)
- `notify-case-studies` (default / results pages)

**Sanitization:** All API routes use `src/lib/sanitize.ts` (built on `validator` npm package) — trims, strips ASCII control characters, enforces max lengths, validates email format, and allowlist-checks enum fields.

**DB integration:** All routes log to console and have a `TODO` comment showing where to insert the DB write. Set `DATABASE_URL` in `.env.local` before wiring the DB client.

## Testing Checklist

Before considering any page complete:
- [ ] Mobile responsive (320px, 768px, 1280px)
- [ ] Lighthouse score 90+ (all categories)
- [ ] Axe DevTools 0 violations
- [ ] Keyboard navigation works completely
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Touch targets minimum 44×44px
- [ ] Forms have visible labels and clear errors
- [ ] Page load < 2 seconds (homepage)
- [ ] Images have descriptive alt text
- [ ] Heading hierarchy correct (no skipped levels)

## Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this project. Follow them for every Figma-driven implementation task.

### Required Flow (do not skip steps)

1. Run `get_design_context` first to fetch the structured representation for the target node(s)
2. If the response is too large or truncated, run `get_metadata` to get the high-level node map, then re-fetch only the required nodes with `get_design_context`
3. Run `get_screenshot` for a visual reference of the node being implemented
4. Download any required assets, then begin implementation
5. Validate the final UI against the Figma screenshot for 1:1 visual parity before marking complete

### Component Organization

- IMPORTANT: Always check `src/components/ui/`, `src/components/layout/`, and `src/components/sections/` for existing components before creating new ones
- New base UI components (Button, Input, Card, Badge, etc.) go in `src/components/ui/`
- New layout components (Header, Footer, Sidebar) go in `src/components/layout/`
- New page sections (Hero, CTA, Testimonials, etc.) go in `src/components/sections/`
- Page files go in `src/app/[route]/page.tsx` following Next.js App Router conventions

### Styling Rules

- IMPORTANT: This project uses **Tailwind CSS v4**. There is no `tailwind.config.ts`. All design tokens are CSS custom properties defined in `src/app/globals.css` under the `@theme inline` block.
- IMPORTANT: Never hardcode color hex values. Always use the Tailwind token classes that map to CSS variables (e.g., `bg-brand-magenta`, `text-brand-ink`, `bg-brand-offwhite`).
- Use Tailwind utility classes for all styling. Do not add CSS modules or inline styles unless absolutely unavoidable.
- Spacing uses Tailwind's default scale (4px base unit)
- Typography uses the custom text-scale tokens: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`

### Color Token Reference

Use these Tailwind utility class prefixes (`bg-`, `text-`, `border-`) with these token names:

| Purpose | Token | Usage |
|---|---|---|
| Dark text / dark backgrounds | `brand-ink` | Non-interactive (text, nav bg, dark sections) |
| Hover state | `brand-crimson` | Button hover, link hover |
| Primary CTA / active links | `brand-magenta` | Buttons, active links only |
| Callouts / badges | `brand-gold` | Sparingly |
| Warm accents | `brand-cream` | Sparingly |
| Page / section background | `brand-offwhite` | Alternating content sections |

- IMPORTANT: Never use `brand-magenta` or `brand-crimson` on non-interactive decorative elements
- IMPORTANT: Never use `brand-ink` as a button background — it is for text and dark section backgrounds only

### React / Next.js Conventions

- Translate Figma MCP output (React + Tailwind) into this project's conventions before committing
- Components are Server Components by default. Add `"use client"` only when the component uses React hooks (`useState`, `useEffect`, etc.) or browser-only APIs
- Use `next/image` (`Image`) for all raster images — never `<img>` tags
- Use `next/link` (`Link`) for internal navigation — never `<a>` for internal routes
- Fonts are loaded once in `src/app/layout.tsx` via `next/font/google` — never import fonts again in child components

### Accessibility (Non-Negotiable)

- All interactive elements must have accessible labels (`aria-label`, `aria-labelledby`, or visible text)
- Minimum touch target: 44×44px (enforced by `min-h-[44px] min-w-[44px]` on interactive elements)
- Keyboard navigation: all interactive elements must be reachable via Tab; visible focus ring is set globally via `*:focus-visible` in `globals.css`
- Heading hierarchy must never skip levels (H1 → H2 → H3)
- One `<h1>` per page

### Asset Handling

- IMPORTANT: If the Figma MCP server returns a `localhost` source for an image or SVG, use that source directly — do not create placeholders
- IMPORTANT: Do not install new icon packages. Use inline SVG elements for all icons, as the existing codebase does
- Store downloaded static assets in `public/`

### What the Figma MCP Output Represents

Treat the Figma MCP output as a **design and behavior specification**, not as final production code. Always:
- Replace Tailwind utility classes with this project's token-based classes where applicable
- Reuse existing components from `src/components/` instead of duplicating functionality
- Apply this project's accessibility, routing, and font conventions regardless of what the MCP output suggests
