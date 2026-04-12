# Duha Media Page Layouts & Specifications
**Version**: 1.0
**Last Updated**: 2026-01-28
**Status**: Initial Draft for Review

---

## Table of Contents
1. [Layout Principles](#layout-principles)
2. [Global Elements](#global-elements)
3. [Homepage](#homepage)
4. [Services Overview](#services-overview)
5. [Service Detail Pages](#service-detail-pages)
6. [About Page](#about-page)
7. [Portfolio Hub](#portfolio-hub)
8. [Case Study Detail](#case-study-detail)
9. [Blog Hub](#blog-hub)
10. [Blog Post Detail](#blog-post-detail)
11. [Contact Page](#contact-page)

---

## Layout Principles

### Design Philosophy
**Based on Research Insights**:
- Function-first: Every element serves user goals
- Mobile-first: 75%+ traffic from mobile
- Conversion-focused: Clear paths to action
- Accessibility: WCAG 2.1 AA throughout
- Performance: Sub-2-second load times

### Page Structure Pattern
All pages follow consistent structure:
1. **Header/Navigation** (non-sticky)
2. **Hero Section** (above-fold impact)
3. **Main Content** (modular sections)
4. **CTA Section** (before footer)
5. **Footer** (navigation + contact)

### Content Width
- **Narrow**: 768px max (blog posts, long-form content)
- **Default**: 1280px max (most content)
- **Wide**: 1440px max (hero sections)
- **Full**: 100% (background sections)

---

## Global Elements

### Header/Navigation

#### Desktop (1024px+)

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              [Nav Items]             │
│ Left                Right                         │
└─────────────────────────────────────────────────────────┘
```

**Specifications**:
- Height: 80px
- Background: White (#FFFFFF)
- Border Bottom: 1px solid #E2E8F0
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
- Z-index: 1000
- Padding: 0 48px

**Logo**:
- Height: 40-48px
- Clickable link to homepage
- Alt text: "Duha Media - Web Design & Optimization"

**Navigation Items** (center):
- Items: Web Design & Development | Website Automation | Case Studies | About |Blog |Contact
- Font: 1rem, Weight 600
- Color: #0F172A
- Hover: Color #2563EB
- Active Page: Color #2563EB, border-bottom 2px solid #2563EB
- Spacing: 32px between items

**CTA Button** (right):
- Text: "Get Started"
- Style: Primary button (red #DC2626)
- Size: 44x44px minimum
- Padding: 12px 24px

#### Tablet (640px - 1023px)

**Same as desktop**, adjust:
- Padding: 0 32px
- May move to hamburger if nav items don't fit
- Font size: 0.9375rem (15px)

#### Mobile (320px - 639px)

**Layout**:
```
┌─────────────────────────────────┐
│ [Logo]              [☰ Menu]    │
│ Left                Right       │
└─────────────────────────────────┘
```

**Specifications**:
- Height: 64px
- Padding: 0 16px
- Logo height: 32-36px
- Hamburger: 44x44px touch target

**Mobile Menu** (when open):
- Position: Fixed, full screen
- Background: White (#FFFFFF)
- Animation: Slide in from right (0.3s)
- Overlay: Semi-transparent dark background
- Close: X icon (top right) or tap outside

**Mobile Menu Items**:
- Full width
- Font: 1.125rem (18px)
- Padding: 16px
- Border bottom: 1px solid #E2E8F0
- CTA button: Full width, bottom of menu

### Footer

#### Desktop Layout (1024px+)

**Structure** (4 columns):
```
┌──────────────────────────────────────────────────────────┐
│  [Logo + Tagline]  [Quick Links]  [Resources]  [Contact] │
│                                                           │
│  ─────────────────────────────────────────────────────── │
│               © 2026 Duha Media. All rights reserved.     │
│            [Privacy Policy] | [Terms of Service]         │
└──────────────────────────────────────────────────────────┘
```

**Specifications**:
- Background: #0F172A (dark slate)
- Border Top: 4px solid #DC2626 (brand accent)
- Padding: 48px horizontal, 48px vertical
- Text Color: #F8FAFC (light)
- Max Width: 1280px container

**Column 1 - Brand**:
- Logo (white version)
- Tagline: "Modern websites for small businesses"
- Social icons (LinkedIn, Twitter, GitHub)

**Column 2 - Quick Links**:
- Title: "Services"
- Links: Web Design, SEO, CRO, All Services

**Column 3 - Resources**:
- Title: "Resources"
- Links: Blog, Case Studies, FAQ, Process

**Column 4 - Contact**:
- Title: "Get in Touch"
- Email: hello@duhamedia.com
- Phone: (if applicable)
- Address: (if applicable)

**Copyright Section**:
- Border Top: 1px solid #334155
- Padding Top: 32px
- Text Align: Center
- Font Size: 0.75rem (12px)
- Color: #64748B

**Link Styles**:
- Color: #F8FAFC
- Font Size: 0.875rem (14px)
- Hover: Color #DC2626 (action color), underline

#### Mobile Layout (320px - 639px)

**Structure** (stacked):
- All sections stack vertically
- Same content, different layout
- Padding: 32px 16px
- Center-aligned text

---

## Homepage

### Purpose
Convert visitors into leads through clear value proposition, trust signals, and strategic CTAs.

### Hero Section

#### Desktop (1024px+)

**Layout**:
```
┌────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────┐  ┌────────────────────────┐  │
│  │                 │  │                        │  │
│  │  Headline       │  │   Hero Image/         │  │
│  │  Subheadline    │  │   Illustration        │  │
│  │  [CTA Primary]  │  │                        │  │
│  │  [CTA Secondary]│  │                        │  │
│  │                 │  │                        │  │
│  └─────────────────┘  └────────────────────────┘  │
│   50% width            50% width                   │
└────────────────────────────────────────────────────┘
```

**Specifications**:
- Background: Linear gradient (#F8FAFC to #FFFFFF) or solid white
- Padding: 80px vertical, 64px horizontal
- Max Width: 1440px container
- Min Height: 600px (viewport height consideration)

**Content (Left 50%)**:
- **Eyebrow** (optional): "Small Business Web Design Expert"
  - Font: Body Small (0.875rem)
  - Color: #DC2626 (action primary)
  - Font Weight: 600
  - Letter Spacing: 0.05em
  - Text Transform: Uppercase

- **Headline (H1)**: "Modern Websites That Grow Your Business"
  - Font: Display (3.5rem / 56px)
  - Color: #0F172A
  - Weight: 700
  - Line Height: 1.1
  - Max Width: 600px

- **Subheadline**: "We design and optimize websites for small businesses. Increase your leads, improve your visibility, and convert more customers."
  - Font: Body Large (1.125rem / 18px)
  - Color: #475569
  - Line Height: 1.6
  - Max Width: 540px
  - Margin Top: 24px

- **CTA Buttons** (32px margin top):
  - Primary: "Get Started" (action primary color)
  - Secondary: "View Our Work" (outlined, spacing 16px left)
  - Layout: Horizontal, inline-flex

**Image (Right 50%)**:
- Modern illustration or high-quality hero image
- Aspect Ratio: 4:3 or 16:9
- Alt text: "Modern website design showcased on multiple devices"
- Optimization: WebP format, lazy load if below fold
- Consider: Subtle animation (fade in, slide up)

#### Tablet (640px - 1023px)

**Adjust**:
- Padding: 64px vertical, 32px horizontal
- Headline: 3rem (48px)
- Image: May reduce to 40% width, content 60%

#### Mobile (320px - 639px)

**Layout** (stacked):
```
┌─────────────────────┐
│   Hero Image        │
│                     │
├─────────────────────┤
│   Headline          │
│   Subheadline       │
│   [CTA Primary]     │
│   [CTA Secondary]   │
└─────────────────────┘
```

**Adjust**:
- Padding: 48px vertical, 16px horizontal
- Headline: 2.5rem (40px)
- Image: Top, full width, aspect ratio maintained
- CTAs: Stacked vertically, full width, 12px gap
- Text: Center-aligned

---

### Trust Signal Section

**Purpose**: Build credibility immediately (B Corp, project count, results)

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│              [Trust Signal Header]               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Icon    │  │  Icon    │  │  Icon    │      │
│  │  Metric  │  │  Metric  │  │  Metric  │      │
│  │  Label   │  │  Label   │  │  Label   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: #F8FAFC (light gray)
- Padding: 48px vertical
- Container: 1280px max width

**Header** (optional):
- Text: "Trusted by Small Businesses Across Industries"
- Font: H3 (1.5rem)
- Center-aligned
- Margin Bottom: 32px

**Stat Cards** (3 columns):
- Card Background: White
- Padding: 32px
- Border Radius: 8px
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.05))
- Gap: 24px between cards

**Card Content**:
1. **Icon**: 48x48px, color #DC2626
2. **Metric**: Large number (2.5rem, weight 700, color #0F172A)
3. **Label**: Description (1rem, color #475569)

**Example Cards**:
- Card 1: "20+ Projects" | "Websites launched in 2025"
- Card 2: "100% Satisfaction" | "Client satisfaction rate"
- Card 3: "30% Avg Increase" | "In client leads after launch"

#### Mobile Layout

**Adjust**:
- Cards stack vertically
- Full width cards
- Padding: 32px vertical, 16px horizontal

---

### Services Overview Section

**Purpose**: Introduce core services with clear CTAs

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│                 [Section Header]                  │
│                                                   │
│  ┌────────────────────┐  ┌────────────────────┐ │
│  │  Service Icon      │  │  Service Icon      │ │
│  │  Service Title     │  │  Service Title     │ │
│  │  Service Desc      │  │  Service Desc      │ │
│  │  [Learn More →]    │  │  [Learn More →]    │ │
│  └────────────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: White (#FFFFFF)
- Padding: 80px vertical, 64px horizontal
- Container: 1280px max width

**Section Header**:
- **Eyebrow**: "Our Services"
  - Font: Body Small, uppercase, letter-spacing
  - Color: #DC2626

- **Headline (H2)**: "Complete Web Solutions for Small Businesses"
  - Font: 2rem (32px), weight 700
  - Color: #0F172A
  - Margin Bottom: 16px

- **Description**:
  - Font: Body Large (1.125rem)
  - Color: #475569
  - Max Width: 700px
  - Center-aligned or left-aligned

**Service Cards** (2 columns):
- Card: White background, border 1px solid #E2E8F0
- Border Radius: 8px
- Padding: 40px
- Gap: 32px between cards
- Hover: Shadow lift (0 4px 6px rgba(0,0,0,0.1))

**Card Content**:
1. **Icon**: 64x64px, color #DC2626 or illustration
2. **Title (H3)**: "Website Design & Development"
   - Font: 1.5rem, weight 600
   - Margin Top: 16px
3. **Description**: 2-3 sentences about service
   - Font: Body (1rem)
   - Color: #475569
   - Line Height: 1.6
4. **Features List** (optional): 3-4 bullet points
   - Checkmark icon
   - Font: 0.875rem
5. **CTA Link**: "Learn More →"
   - Font: 1rem, weight 600
   - Color: #2563EB (link color)
   - Underline on hover

**Services**:
1. Website Design & Development
2. Website Optimization (SEO & CRO)

#### Mobile Layout

**Adjust**:
- Cards stack vertically (1 column)
- Padding: 48px vertical, 16px horizontal
- Card padding: 24px

---

### Portfolio Highlights Section

**Purpose**: Social proof through visual examples

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│              [Section Header]                     │
│                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Case 1 │  │ Case 2 │  │ Case 3 │            │
│  │ Image  │  │ Image  │  │ Image  │            │
│  │ Title  │  │ Title  │  │ Title  │            │
│  │ Result │  │ Result │  │ Result │            │
│  └────────┘  └────────┘  └────────┘            │
│                                                   │
│              [View All Work CTA]                  │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: #F8FAFC (light gray) or white
- Padding: 80px vertical, 64px horizontal
- Container: 1280px max width

**Section Header**:
- Headline (H2): "Recent Work"
- Description: "See how we've helped businesses grow online"
- Alignment: Center

**Portfolio Cards** (3 columns):
- Card: White background
- Border Radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.05)
- Hover: Lift effect, increased shadow
- Gap: 24px between cards

**Card Content**:
1. **Image**:
   - Aspect Ratio: 16:9
   - Full-width of card
   - Border Radius: 8px 8px 0 0
   - Alt text: Project description
2. **Content Padding**: 24px
3. **Title (H4)**: Client name or project type
4. **Description**: Brief result (1 sentence)
   - Example: "Increased leads by 40% in 3 months"
5. **Link**: "View Case Study →"

**CTA Section**:
- Center-aligned
- Margin Top: 48px
- Button: "View All Work" (secondary style)

#### Mobile Layout

**Adjust**:
- 1 column (stacked)
- Cards full width
- Or horizontal scroll carousel

---

### Testimonials Section

**Purpose**: Social proof through client quotes

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│              [Section Header]                     │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │  "Quote text..."                         │   │
│  │  — Client Name, Role, Company            │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│         [Navigation Dots or Arrows]               │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: White or light gradient
- Padding: 80px vertical, 64px horizontal
- Container: 900px max width (narrower for readability)

**Section Header**:
- Headline (H2): "What Our Clients Say"
- Alignment: Center

**Testimonial Display**:
- Layout: Single testimonial (carousel/slider)
- Or: 2 testimonials side-by-side
- Background: White card with subtle border
- Padding: 40px
- Border Radius: 8px

**Testimonial Content**:
1. **Quote Icon**: Optional, subtle
2. **Quote Text**:
   - Font: Body Large (1.125rem) or H4 (1.25rem)
   - Color: #0F172A
   - Style: Italic (optional)
   - Line Height: 1.6
3. **Attribution**:
   - Client Name: Weight 600
   - Role & Company: Color #475569
   - Font: 0.875rem
   - Margin Top: 24px
4. **Client Logo** (optional): Small, grayscale

**Navigation**:
- Dots: Below testimonial (if carousel)
- Arrows: Left/right sides
- Auto-rotate: 5-7 seconds (optional, with pause on hover)

#### Mobile Layout

**Adjust**:
- Single column
- Padding: 48px vertical, 24px horizontal
- Card padding: 24px
- Font size slightly smaller

---

### Blog Highlights Section

**Purpose**: Demonstrate thought leadership, drive content engagement

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│              [Section Header]                     │
│                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Post 1 │  │ Post 2 │  │ Post 3 │            │
│  │ Image  │  │ Image  │  │ Image  │            │
│  │ Title  │  │ Title  │  │ Title  │            │
│  │ Excerpt│  │ Excerpt│  │ Excerpt│            │
│  │ [Read] │  │ [Read] │  │ [Read] │            │
│  └────────┘  └────────┘  └────────┘            │
│                                                   │
│              [View All Posts CTA]                 │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: White (#FFFFFF)
- Padding: 80px vertical, 64px horizontal
- Container: 1280px max width

**Section Header**:
- Headline (H2): "Latest Insights"
- Description: "Practical tips for growing your business online"
- Alignment: Left or Center

**Blog Post Cards** (3 columns):
- Card: White with border or subtle shadow
- Border Radius: 8px
- Hover: Shadow lift
- Gap: 24px

**Card Content**:
1. **Featured Image**:
   - Aspect Ratio: 16:9
   - Full width
2. **Category Tag** (optional):
   - Small pill/badge
   - Font: 0.75rem, uppercase
   - Color: #DC2626 background
3. **Content Padding**: 24px
4. **Title (H4)**: Post headline
   - Font: 1.25rem, weight 600
   - 2 lines max (truncate)
5. **Excerpt**: 2 sentences
   - Font: 0.875rem
   - Color: #475569
   - 3 lines max
6. **Meta**: Date & read time
   - Font: 0.75rem
   - Color: #64748B
7. **Link**: "Read More →"
   - Link color

**CTA Section**:
- Button: "View All Posts"
- Center-aligned
- Margin Top: 48px

#### Mobile Layout

**Adjust**:
- 1 column or 2 columns (if screen allows)
- Smaller images
- Truncate text aggressively

---

### Final CTA Section

**Purpose**: Convert visitors before they leave

#### Desktop Layout

**Structure**:
```
┌──────────────────────────────────────────────────┐
│                                                   │
│              [Headline]                           │
│              [Subheadline]                        │
│         [Primary CTA] [Secondary CTA]             │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- Background: Gradient (#1E40AF to #2563EB) or solid brand color
- Text Color: White (#FFFFFF)
- Padding: 80px vertical
- Container: 800px max width
- Text Align: Center

**Content**:
- **Headline (H2)**: "Ready to Grow Your Business?"
  - Color: White
  - Font: 2rem
- **Subheadline**: "Let's discuss how we can help you succeed online."
  - Color: White (opacity 90%)
  - Font: 1.125rem
  - Margin Top: 16px
- **CTAs**:
  - Primary: "Get Started" (white background, brand text color)
  - Secondary: "Schedule a Call" (outlined white)
  - Margin Top: 32px
  - Gap: 16px

#### Mobile Layout

**Adjust**:
- Padding: 48px vertical, 24px horizontal
- CTAs stack vertically, full width
- Font sizes slightly smaller

---

## Services Overview

### Purpose
Present both services clearly with paths to detail pages

### Hero Section

**Layout**: Similar to homepage hero but simpler

**Content**:
- **Headline (H1)**: "Web Design & Optimization Services"
- **Subheadline**: "Complete solutions to grow your business online"
- **Breadcrumb**: Home > Services

**Specifications**:
- Background: Light gradient or solid
- Padding: 64px vertical
- No image (text-focused)
- Center-aligned content

---

### Services Grid Section

**Layout**: 2-column grid with detailed service cards

**Structure**:
```
┌──────────────────────────────────────────────────┐
│  ┌─────────────────────┐  ┌──────────────────┐  │
│  │ Website Design      │  │ Website          │  │
│  │ & Development       │  │ Optimization     │  │
│  │                     │  │                   │  │
│  │ - Feature 1         │  │ - SEO            │  │
│  │ - Feature 2         │  │ - CRO            │  │
│  │ - Feature 3         │  │ - Analytics      │  │
│  │                     │  │                   │  │
│  │ [Learn More]        │  │ [Learn More]     │  │
│  └─────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Service Cards**:
- White background
- Border: 1px solid #E2E8F0
- Padding: 48px
- Border Radius: 8px
- Shadow on hover

**Card Content**:
1. **Icon**: 64x64px
2. **Title (H2)**: Service name
3. **Description**: 2-3 paragraphs
4. **Features List**: 5-7 key features with checkmarks
5. **CTA Button**: "Learn More" (primary style)

---

### Process Overview Section

**Purpose**: Explain how working together works

**Layout**: 4-step horizontal process (desktop)

**Structure**:
```
┌──────────────────────────────────────────────────┐
│              [Section Header]                     │
│                                                   │
│  [Step 1] → [Step 2] → [Step 3] → [Step 4]      │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Steps**:
1. Discovery: We learn about your business
2. Strategy: We plan the approach
3. Execution: We design and build
4. Launch: We deploy and optimize

**Each Step**:
- Number badge (1, 2, 3, 4)
- Icon
- Title (H4)
- Description (2 sentences)

**Mobile**: Stack vertically with connecting lines

---

### FAQ Section

**Purpose**: Address common questions, reduce friction

**Layout**: Single column, accordion-style FAQs

**Common Questions**:
- "How long does a website project take?"
- "What's included in your services?"
- "Do you offer ongoing support?"
- "How much does a website cost?"
- "What platforms do you work with?"

**Accordion Specs**:
- Question: H4, clickable, icon (chevron)
- Answer: Body text, revealed on click
- Border between items
- Padding: 24px

---

## Service Detail Pages

### Purpose
Detail page for each service (Web Design, SEO, CRO)

### Hero Section

**Content**:
- **Headline (H1)**: "Website Design & Development"
- **Subheadline**: "Modern, high-performing websites for small businesses"
- **Breadcrumb**: Home > Services > Website Design
- **CTA Button**: "Get Started"

---

### Service Overview Section

**Two-Column Layout**:

**Left Column (60%)**:
- **What It Is**: 2-3 paragraphs explaining service
- **Who It's For**: Target audience description
- **What You Get**: Detailed list of deliverables

**Right Column (40%)**:
- **Quick Facts Box**:
  - Timeline: "4-8 weeks typical"
  - Investment: "Starting at $X" or "Custom quote"
  - Includes: Top 5 features
  - CTA: "Request Quote"

---

### Features/Benefits Section

**Layout**: Alternating image/text sections

**Structure**:
```
┌──────────────────────────────────────────────────┐
│  [Image]              [Text]                     │
│  Left 50%             Right 50%                  │
├──────────────────────────────────────────────────┤
│  [Text]               [Image]                    │
│  Left 50%             Right 50%                  │
└──────────────────────────────────────────────────┘
```

**3-4 Features**, each with:
- Image or illustration
- Feature title (H3)
- Description (2-3 sentences)
- Benefit statement

---

### Case Studies Section

**Layout**: 2 relevant case studies

**Each Case Study Card**:
- Client (anonymous or with permission)
- Challenge
- Solution
- Results (with metrics)
- CTA: "View Full Case Study"

---

### Pricing/Packages Section (optional)

**Layout**: 1-3 pricing tiers

**Tier Card**:
- Package name
- Price or "Custom"
- Features included (checkmarks)
- CTA: "Get Started" or "Contact Us"

---

### Final CTA Section

**Same as homepage final CTA**

---

## About Page

### Purpose
Build trust through company story, values, and team

### Hero Section

**Content**:
- **Headline (H1)**: "About Duha Media"
- **Subheadline**: "We help small businesses succeed online"
- **Breadcrumb**: Home > About

---

### Story Section

**Layout**: Single column, narrow width (768px)

**Content**:
- **Who We Are**: 2-3 paragraphs
- **Mission**: 1-2 paragraphs
- **Values**: 3-5 key values with icons
- **Approach**: What makes us different

---

### Values/Principles Section

**Layout**: 3-column grid

**Each Value Card**:
- Icon
- Title (H4)
- Description (2-3 sentences)

**Values (examples)**:
- Accessibility First
- Results-Focused
- Transparent Process
- Client Partnership

---

### Team Section (if applicable)

**Layout**: Grid of team members

**Team Card**:
- Photo (optional)
- Name
- Role
- Bio (2-3 sentences)
- LinkedIn link (optional)

---

### Why Choose Us Section

**Layout**: 2-column comparison or bullet points

**Reasons**:
- SMB specialization
- Modern technology
- Accessibility commitment
- Transparent pricing
- Ongoing support

---

### CTA Section

**Different from homepage**:
- **Headline**: "Let's Work Together"
- **Subheadline**: "Schedule a free consultation"
- **CTA**: "Get in Touch"

---

## Portfolio Hub

### Purpose
Showcase all work, filter by category/industry

### Hero Section

**Content**:
- **Headline (H1)**: "Our Work"
- **Subheadline**: "See how we've helped businesses grow"
- **Breadcrumb**: Home > Portfolio

---

### Filter Section (optional)

**Layout**: Horizontal filter tabs

**Filters**:
- All
- By Industry (e.g., Healthcare, Retail, Professional Services)
- By Service (Web Design, SEO, CRO)

---

### Portfolio Grid

**Layout**: 3-column grid (desktop), 2-column (tablet), 1-column (mobile)

**Portfolio Card**:
- Featured image (16:9)
- Client/Project name
- Industry tag
- Brief result headline
- "View Case Study" link

**Specifications**:
- Gap: 32px between cards
- Hover: Shadow lift, slight scale
- Lazy load images

---

### Load More

**Pagination Options**:
- Load More button (append cards)
- Infinite scroll (load on scroll)
- Traditional pagination (numbered pages)

**Recommended**: Load More button (better UX control)

---

## Case Study Detail

### Purpose
Detailed project story with results

### Hero Section

**Layout**: Full-width with overlay text

**Content**:
- **Featured Image**: Project hero image
- **Overlay**:
  - Client Name (H1)
  - Tagline/Result
  - Breadcrumb: Home > Portfolio > [Client]

---

### Project Overview Section

**Layout**: Two columns

**Left Column (70%)**:
- **Challenge**: What problem needed solving
- **Approach**: How we solved it
- **Solution**: What we implemented

**Right Column (30%)**:
- **Project Info Box**:
  - Client: Name
  - Industry: Category
  - Services: List
  - Timeline: Duration
  - Website: Link (if allowed)

---

### Results Section

**Layout**: Stats highlight

**Structure**:
```
┌──────────────────────────────────────────────────┐
│         [Results Headline]                        │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ +40%     │  │ +26%     │  │ -25%     │       │
│  │ Leads    │  │ Traffic  │  │ Bounce   │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────┘
```

**Metric Cards**:
- Large number (3rem, weight 700)
- Metric label
- Color: Green for positive, red for negative (with context)

---

### Detailed Process Section

**Layout**: Step-by-step with images

**Each Step**:
- Step number/title
- Description
- Screenshot or image
- Outcome

---

### Testimonial Section

**Layout**: Single, featured testimonial from client

**Content**:
- Quote
- Client name, role, company
- Photo (optional)
- Company logo

---

### Images Gallery (optional)

**Layout**: Grid of project screenshots

**Specifications**:
- Lightbox on click (full-size view)
- Captions
- 2-3 column grid

---

### Next Project CTA

**Layout**: Card or section

**Content**:
- "Next Project"
- Thumbnail
- Client name
- Link to next case study

---

## Blog Hub

### Purpose
Educational content hub, SEO driver

### Hero Section

**Content**:
- **Headline (H1)**: "Duha Media Blog"
- **Subheadline**: "Tips and insights for growing your business online"
- **Breadcrumb**: Home > Blog

---

### Featured Post Section

**Layout**: Large card with image

**Content**:
- Featured image (16:9, large)
- Category tag
- Title (H2)
- Excerpt (2-3 sentences)
- Author, date, read time
- "Read More" CTA

---

### Blog Grid

**Layout**: 3-column grid (desktop)

**Blog Card** (same as homepage):
- Thumbnail image
- Category
- Title
- Excerpt
- Meta (date, read time)
- "Read More" link

---

### Sidebar (optional, desktop)

**Content**:
- Search box
- Categories list
- Recent posts
- Newsletter signup
- Tags cloud (optional)

---

### Pagination

**Options**:
- Numbered pages (1, 2, 3...)
- Previous/Next buttons
- Load More

**Recommended**: Numbered pagination for SEO

---

## Blog Post Detail

### Purpose
Educational long-form content

### Hero Section

**Layout**: Narrow width (768px)

**Content**:
- **Category Tag**
- **Headline (H1)**
- **Meta Info**:
  - Author name
  - Published date
  - Updated date (if applicable)
  - Read time estimate
- **Featured Image** (below or above headline)

---

### Article Content

**Layout**: Single column, narrow (768px max)

**Content Structure**:
- Table of contents (for long posts, auto-generated)
- Body content with proper heading hierarchy
- Images/screenshots with captions
- Pull quotes for emphasis
- Code blocks (if applicable)
- Lists (bullet and numbered)
- Embedded videos (YouTube, etc.)

**Typography**:
- H2 for main sections
- H3 for subsections
- Body text: 1rem (16px), line-height 1.6
- Max line length: 75 characters

**Images**:
- Full width or centered
- Captions below
- Click to enlarge (optional)
- Lazy load

---

### Author Bio Section

**Layout**: Card with author info

**Content**:
- Author photo
- Author name
- Bio (2-3 sentences)
- Social links
- "View all posts by [Author]" link

---

### Related Posts Section

**Layout**: 3-column grid

**Content**:
- "Related Articles" headline
- 3 related posts (by category or tag)
- Same card format as blog hub

---

### Newsletter Signup CTA

**Layout**: Centered card

**Content**:
- Headline: "Get More Tips Like This"
- Description: "Join our newsletter"
- Email input
- Submit button
- Privacy note

---

### Comments Section (optional)

**Options**:
- Native comment system
- Disqus or similar
- No comments (drive discussion to social)

**Recommended**: No comments initially (reduces moderation needs)

---

## Contact Page

### Purpose
Convert inquiries into leads

### Hero Section

**Content**:
- **Headline (H1)**: "Get in Touch"
- **Subheadline**: "Let's discuss your project"
- **Breadcrumb**: Home > Contact

---

### Contact Form Section

**Layout**: Two columns

**Left Column (60%) - Form**:

**Form Fields** (vertical layout):
1. **Name** (required)
   - Label: "Your Name *"
   - Input type: text
   - Placeholder: "John Smith"

2. **Email** (required)
   - Label: "Email Address *"
   - Input type: email
   - Placeholder: "john@example.com"

3. **Phone** (optional)
   - Label: "Phone Number (Optional)"
   - Input type: tel

4. **Service Interest** (optional)
   - Label: "What service are you interested in?"
   - Input type: select
   - Options: Web Design, SEO, CRO, Not Sure

5. **Message** (required)
   - Label: "Tell Us About Your Project *"
   - Input type: textarea
   - Placeholder: "Share details about your business and goals..."
   - Rows: 6

**Submit Button**:
- Text: "Send Message"
- Style: Primary button
- Full width on mobile
- Loading state when submitting

**Form Notes**:
- Required fields marked with *
- Privacy note below: "We respect your privacy. Your information will never be shared."
- Success message: "Thanks! We'll be in touch within 24 hours."
- Error message: Clear, specific errors

**Right Column (40%) - Info**:

**Contact Information**:
- **Email**: hello@duhamedia.com
  - Icon: Envelope
  - Clickable mailto link

- **Phone** (if applicable): (123) 456-7890
  - Icon: Phone
  - Clickable tel link

- **Location** (if applicable): City, State
  - Icon: Map pin

- **Hours** (if applicable):
  - "Monday - Friday: 9am - 5pm"
  - "Response time: Within 24 hours"

**Social Links** (optional):
- LinkedIn
- Twitter
- GitHub

**Alternative CTAs**:
- "Schedule a Call" button (links to Calendly)
- "View Our Work" link

---

### FAQ Section

**Purpose**: Answer questions before they ask

**Layout**: Accordion style

**Common Questions**:
- "What information do you need?"
- "How quickly will you respond?"
- "Do you offer free consultations?"
- "What's the typical project timeline?"

---

### Map Section (optional, if physical location)

**Layout**: Full-width embedded map

**Specifications**:
- Google Maps embed
- Shows office location
- Link to directions

---

### Final CTA

**Different approach**:
- **Headline**: "Prefer to Email?"
- **CTA**: Large email button or link
- **Alternative**: "Or schedule a call"

---

## Responsive Behavior Summary

### Mobile (320px - 639px)
- All layouts: Single column
- Navigation: Hamburger menu
- Forms: Full-width inputs, stacked
- Cards: Full width, stacked
- CTAs: Full-width buttons
- Images: Full width, maintain aspect ratio
- Typography: Scaled down (display 2.5rem → 2rem)
- Spacing: Reduced (80px → 48px)
- Touch targets: Minimum 44x44px

### Tablet (640px - 1023px)
- Layouts: 2 columns where appropriate
- Navigation: Horizontal or hamburger (depends on fit)
- Forms: Full width or 2-column
- Cards: 2-column grid
- Typography: Medium scale
- Spacing: Medium (64px vertical)

### Desktop (1024px+)
- Layouts: Full multi-column (2-4 columns)
- Navigation: Full horizontal
- Forms: Optimized width (not full)
- Cards: 3-column grid
- Typography: Full scale
- Spacing: Generous (80px+ vertical)
- Max width containers (1280px-1440px)

---

## Accessibility Checklist Per Page

### All Pages Must Have:
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Skip to main content link
- [ ] All images have descriptive alt text
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators (2px outline)
- [ ] Color contrast ratios minimum 4.5:1
- [ ] Forms have associated labels
- [ ] Error messages are clear and announced
- [ ] Touch targets minimum 44x44px
- [ ] Semantic HTML (nav, main, article, footer)
- [ ] ARIA labels where needed
- [ ] Language attribute on html element
- [ ] Page title unique and descriptive
- [ ] Landmark regions defined
- [ ] No keyboard traps

---

## Performance Targets Per Page Type

### Homepage
- **LCP**: < 2.0s
- **FID**: < 75ms
- **CLS**: < 0.05
- **Page Size**: < 1MB
- **Requests**: < 40

### Service Pages
- **LCP**: < 2.5s
- **Page Size**: < 800KB
- **Requests**: < 35

### Blog Posts
- **LCP**: < 2.5s (text optimized)
- **Page Size**: < 600KB
- **Requests**: < 30

### Portfolio Pages
- **LCP**: < 3.0s (image-heavy, optimized)
- **Page Size**: < 1.5MB (with optimizations)
- **Requests**: < 50

**Optimization Strategies**:
- Next.js Image component for all images
- Lazy loading for below-fold content
- Code splitting by route
- Minimal JavaScript
- Critical CSS inlined
- Fonts preloaded
- CDN for assets

---

## Next Steps

### For Design Phase:
1. Create high-fidelity mockups based on these layouts
2. Design in Figma/Sketch with components from style guide
3. Ensure all specifications match style guide
4. Include all breakpoints (mobile, tablet, desktop)
5. Add interactive prototype for user testing

### For Development Phase:
1. Set up Next.js project structure
2. Create reusable React components per style guide
3. Implement responsive layouts with Tailwind
4. Build page templates following these layouts
5. Integrate CMS (if applicable)
6. Test accessibility (automated + manual)
7. Test performance (Lighthouse audits)
8. Test across devices and browsers

---

**Document Status**: Draft for Review
**Dependencies**: Style Guide (design/style-guide.md)
**Review Needed By**: Design team, Development team, Content team, Stakeholders

---

*These layouts provide structure while allowing creative interpretation. Use this as a foundation, not a rigid constraint.*
