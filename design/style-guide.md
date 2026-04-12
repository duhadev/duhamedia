# Duha Media Design System & Style Guide
**Version**: 1.0
**Last Updated**: 2026-01-28
**Status**: Initial Draft for Review

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Accessibility Standards](#accessibility-standards)
7. [Responsive Design](#responsive-design)
8. [Animation & Motion](#animation--motion)

---

## Design Principles

### 1. Function Over Form
Every design element must serve a clear purpose. Remove anything that doesn't help users accomplish their goals.

### 2. Accessibility First
WCAG 2.1 AA compliance is non-negotiable. Design with accessibility from the start, not as an afterthought.

### 3. Mobile-First
75%+ of traffic comes from mobile. Design for mobile, enhance for desktop.

### 4. Performance Conscious
Every design decision impacts load time. Target sub-2-second page loads.

### 5. Conversion Oriented
Guide users toward desired actions while respecting their autonomy. Clear CTAs, reduced friction.

### 6. SMB Focused
Design for time-constrained small business owners. Clear, concise, transparent.

---

## Color System

### Primary Palette

**Research Insight**: Separate action colors from brand colors improves usability (Orbit Media best practice)

#### Brand Colors
Used for: Logo, headers, non-interactive brand elements

```
Primary Brand: #1E40AF (Blue 800)
- Hex: #1E40AF
- RGB: 30, 64, 175
- Use: Main brand color, primary headings, logo
- Accessibility: Use only on light backgrounds

Secondary Brand: #0F172A (Slate 900)
- Hex: #0F172A
- RGB: 15, 23, 42
- Use: Body text, secondary headings
- Accessibility: 15.5:1 contrast on white

Accent Brand: #06B6D4 (Cyan 500)
- Hex: #06B6D4
- RGB: 6, 182, 212
- Use: Highlights, visual interest (non-interactive)
- Accessibility: 3.2:1 contrast on white (large text only)
```

#### Action Colors
Used for: Buttons, links, interactive elements, CTAs

```
Primary Action: #DC2626 (Red 600)
- Hex: #DC2626
- RGB: 220, 38, 38
- Use: Primary CTAs, important actions
- Accessibility: 5.1:1 contrast on white
- Rationale: Distinct from brand blue, high visibility

Secondary Action: #7C3AED (Violet 600)
- Hex: #7C3AED
- RGB: 124, 58, 237
- Use: Secondary CTAs, less prominent actions
- Accessibility: 6.2:1 contrast on white

Link Color: #2563EB (Blue 600)
- Hex: #2563EB
- RGB: 37, 99, 235
- Use: Text links, navigation links
- Accessibility: 5.9:1 contrast on white
- Must have underline for accessibility
```

#### Neutral Colors

```
Background Light: #FFFFFF (White)
- Hex: #FFFFFF
- Use: Primary background, cards

Background Gray: #F8FAFC (Slate 50)
- Hex: #F8FAFC
- Use: Alternate sections, subtle backgrounds

Border: #E2E8F0 (Slate 200)
- Hex: #E2E8F0
- Use: Borders, dividers, subtle separations

Text Primary: #0F172A (Slate 900)
- Hex: #0F172A
- Use: Body text, primary content
- Accessibility: 15.5:1 contrast on white

Text Secondary: #475569 (Slate 600)
- Hex: #475569
- Use: Supporting text, captions
- Accessibility: 7.5:1 contrast on white

Text Muted: #64748B (Slate 500)
- Hex: #64748B
- Use: Placeholder text, disabled text
- Accessibility: 4.9:1 contrast on white
```

#### Semantic Colors

```
Success: #059669 (Emerald 600)
- Hex: #059669
- Use: Success messages, positive feedback
- Accessibility: 4.7:1 contrast on white

Warning: #D97706 (Amber 600)
- Hex: #D97706
- Use: Warning messages, caution
- Accessibility: 5.3:1 contrast on white

Error: #DC2626 (Red 600)
- Hex: #DC2626
- Use: Error messages, validation errors
- Accessibility: 5.1:1 contrast on white

Info: #0284C7 (Sky 600)
- Hex: #0284C7
- Use: Informational messages
- Accessibility: 4.8:1 contrast on white
```

### Color Usage Guidelines

**DO**:
- Use action colors exclusively for interactive elements
- Maintain 4.5:1 contrast ratio minimum for normal text
- Maintain 3:1 contrast ratio minimum for large text (18px+)
- Test all color combinations with contrast checker
- Use multiple visual cues beyond color (icons, text, underlines)

**DON'T**:
- Don't use action colors for non-interactive elements
- Don't rely on color alone to convey information
- Don't use brand colors for buttons or links
- Don't use low-contrast color combinations

---

## Typography

### Font Stack

**Research Insight**: Sans-serif for modern, clean feel. Large readable text (minimum 16px body).

#### Primary Font (Headings & UI)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Rationale**:
- Inter: Excellent readability at all sizes
- Optimized for digital screens
- Professional yet approachable
- Excellent accessibility features

**Loading**:
- Use next/font/google for optimization
- Load weights: 400 (regular), 600 (semi-bold), 700 (bold)

#### Secondary Font (Body Text)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Rationale**: Use same font for consistency and performance (single font family loads faster)

### Type Scale

**Base Size**: 16px (1rem) - Research shows this is minimum for optimal readability

```
Display (H1 - Hero):
- Desktop: 3.5rem (56px) / Line height: 1.1
- Tablet: 3rem (48px) / Line height: 1.1
- Mobile: 2.5rem (40px) / Line height: 1.1
- Weight: 700 (Bold)
- Letter spacing: -0.02em

Heading 1 (H1 - Page Title):
- Desktop: 2.5rem (40px) / Line height: 1.2
- Tablet: 2.25rem (36px) / Line height: 1.2
- Mobile: 2rem (32px) / Line height: 1.2
- Weight: 700 (Bold)
- Letter spacing: -0.01em

Heading 2 (H2 - Section Title):
- Desktop: 2rem (32px) / Line height: 1.3
- Tablet: 1.75rem (28px) / Line height: 1.3
- Mobile: 1.5rem (24px) / Line height: 1.3
- Weight: 700 (Bold)

Heading 3 (H3 - Subsection):
- Desktop: 1.5rem (24px) / Line height: 1.4
- Tablet: 1.375rem (22px) / Line height: 1.4
- Mobile: 1.25rem (20px) / Line height: 1.4
- Weight: 600 (Semi-bold)

Heading 4 (H4):
- All: 1.25rem (20px) / Line height: 1.5
- Weight: 600 (Semi-bold)

Heading 5 (H5):
- All: 1.125rem (18px) / Line height: 1.5
- Weight: 600 (Semi-bold)

Heading 6 (H6):
- All: 1rem (16px) / Line height: 1.5
- Weight: 600 (Semi-bold)

Body Large:
- Size: 1.125rem (18px)
- Line height: 1.6
- Weight: 400
- Use: Intro paragraphs, important body text

Body (Default):
- Size: 1rem (16px)
- Line height: 1.6
- Weight: 400
- Use: Standard body text

Body Small:
- Size: 0.875rem (14px)
- Line height: 1.5
- Weight: 400
- Use: Captions, supporting text, fine print

Caption:
- Size: 0.75rem (12px)
- Line height: 1.4
- Weight: 400
- Use: Image captions, metadata, labels
```

### Typography Guidelines

**Hierarchy Rules**:
1. One H1 per page (for SEO and accessibility)
2. Heading levels should not skip (H1 → H2 → H3, never H1 → H3)
3. Use headings for structure, not styling
4. Maintain visual hierarchy: bigger = more important

**Readability**:
- Maximum line length: 75 characters (optimal 50-60)
- Line height for body text: 1.5-1.6
- Paragraph spacing: 1em between paragraphs
- Avoid all-caps for long text (harder to read)
- Use bold for emphasis, not italics (better accessibility)

**Accessibility**:
- Minimum 16px for body text (WCAG AAA recommendation)
- Sufficient color contrast (see color section)
- Allow text resize up to 200%
- Don't use text in images (except logos)

---

## Spacing & Layout

### Spacing Scale

**Research Insight**: Generous white space improves readability and creates sophisticated feel.

**Base Unit**: 4px (0.25rem)

```
Space 0: 0px (0rem)
Space 1: 4px (0.25rem)
Space 2: 8px (0.5rem)
Space 3: 12px (0.75rem)
Space 4: 16px (1rem) - Base spacing unit
Space 5: 20px (1.25rem)
Space 6: 24px (1.5rem)
Space 8: 32px (2rem) - Component spacing
Space 10: 40px (2.5rem)
Space 12: 48px (3rem) - Section spacing
Space 16: 64px (4rem)
Space 20: 80px (5rem) - Large section spacing
Space 24: 96px (6rem)
Space 32: 128px (8rem) - Hero spacing
```

### Grid System

**Type**: 12-column grid with flexible gutters

#### Breakpoints

**Research Insight**: Mobile-first design is mandatory (75%+ traffic from mobile)

```
Mobile (sm): 320px - 639px
- Columns: 4
- Gutter: 16px
- Margin: 16px

Tablet (md): 640px - 1023px
- Columns: 8
- Gutter: 24px
- Margin: 32px

Desktop (lg): 1024px - 1279px
- Columns: 12
- Gutter: 24px
- Margin: 48px

Large Desktop (xl): 1280px - 1535px
- Columns: 12
- Gutter: 32px
- Margin: 64px

Extra Large (2xl): 1536px+
- Columns: 12
- Gutter: 32px
- Margin: Auto (max-width: 1440px)
```

### Container Widths

```
Container Narrow: max-width: 768px
- Use: Blog posts, long-form content
- Optimal line length for readability

Container Default: max-width: 1280px
- Use: Most page content
- Standard content container

Container Wide: max-width: 1440px
- Use: Homepage hero, full-width sections

Container Full: 100%
- Use: Background sections, images
```

### Layout Patterns

#### Single Column (Mobile)
- All content stacks vertically
- Full-width elements
- Simplified navigation

#### Two Column (Tablet+)
- Main content: 2/3 width
- Sidebar: 1/3 width
- Or 50/50 split for features

#### Multi-Column (Desktop)
- 3-4 columns for feature grids
- 2 columns for service cards
- Maintain readability

### Spacing Usage

**Component Internal Spacing**:
- Padding: Space-4 to Space-6 (16-24px)
- Button padding: Space-3 vertical, Space-6 horizontal
- Form field padding: Space-3 (12px)

**Component Relationships**:
- Related elements: Space-4 (16px)
- Component groups: Space-8 (32px)
- Sections: Space-12 to Space-20 (48-80px)

**Page Structure**:
- Hero padding: Space-16 to Space-32 (64-128px)
- Section padding: Space-12 to Space-20 (48-80px)
- Footer padding: Space-12 (48px)

---

## Components

### Buttons

**Research Insight**:
- Clear CTAs critical for conversion
- Action colors for all buttons
- Minimum 44x44px touch targets (accessibility)

#### Primary Button (Main CTAs)

**Visual Specs**:
```
Background: Primary Action (#DC2626)
Text: White (#FFFFFF)
Font Size: 1rem (16px)
Font Weight: 600 (Semi-bold)
Padding: 12px 24px (Space-3 vertical, Space-6 horizontal)
Border Radius: 6px
Minimum Touch Target: 44x44px
Border: None
Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
```

**States**:
```
Default: As above
Hover: Background #B91C1C (darker), shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
Active: Background #991B1B, shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1)
Focus: 2px outline, color: #2563EB, offset: 2px
Disabled: Background #E5E7EB, text #9CA3AF, cursor: not-allowed
Loading: Same as disabled + spinner icon
```

**Usage**:
- Primary conversion actions (Contact Us, Get Started, Request Quote)
- One primary button per section maximum
- Always describe action (not "Click Here" or "Submit")

#### Secondary Button

**Visual Specs**:
```
Background: Transparent
Text: Primary Action (#DC2626)
Font Size: 1rem (16px)
Font Weight: 600
Padding: 12px 24px
Border: 2px solid Primary Action (#DC2626)
Border Radius: 6px
Minimum Touch Target: 44x44px
```

**States**:
```
Default: As above
Hover: Background #FEF2F2 (light red), border #B91C1C
Active: Background #FEE2E2
Focus: 2px outline, color: #2563EB, offset: 2px
Disabled: Border #E5E7EB, text #9CA3AF, cursor: not-allowed
```

**Usage**:
- Secondary actions (Learn More, View Portfolio)
- Alternative options
- Less critical CTAs

#### Text Button/Link

**Visual Specs**:
```
Background: Transparent
Text: Link Color (#2563EB)
Font Size: 1rem (16px)
Font Weight: 400
Padding: 0
Text Decoration: Underline (accessibility requirement)
```

**States**:
```
Default: As above
Hover: Text #1D4ED8 (darker), text-decoration: underline
Focus: 2px outline, color: #2563EB, offset: 2px
Visited: #7C3AED (different color for accessibility)
```

**Usage**:
- In-text links
- Navigation links
- Tertiary actions

#### Icon Button

**Visual Specs**:
```
Size: 44x44px minimum (touch target)
Icon Size: 24x24px
Background: Transparent
Padding: 10px
Border Radius: 6px
```

**States**:
```
Default: Icon color #475569
Hover: Background #F8FAFC, icon color #0F172A
Focus: 2px outline, color: #2563EB
Active: Background #E2E8F0
```

**Accessibility**:
- Must have aria-label describing action
- Include visible label or tooltip
- Sufficient contrast for icon

### Forms

**Research Insight**:
- 4 fields optimal for conversions
- Clear labels and error messages
- Mobile-friendly touch targets

#### Text Input

**Visual Specs**:
```
Width: 100% of container
Height: 44px minimum (touch target)
Padding: 12px 16px
Border: 1px solid #E2E8F0
Border Radius: 6px
Font Size: 1rem (16px) - prevents zoom on iOS
Background: #FFFFFF
Text Color: #0F172A
Placeholder Color: #64748B
```

**States**:
```
Default: As above
Hover: Border #CBD5E1
Focus: Border 2px solid #2563EB, outline: none (custom focus)
Error: Border 2px solid #DC2626
Success: Border 2px solid #059669
Disabled: Background #F8FAFC, border #E2E8F0, cursor: not-allowed
```

**Label Requirements**:
- Always visible (not placeholder-only)
- Font size: 0.875rem (14px)
- Font weight: 600
- Color: #0F172A
- Positioned above input
- Associated with for/id attributes

**Error Message**:
- Font size: 0.875rem (14px)
- Color: #DC2626
- Icon: Error icon
- Positioned below input
- Announced to screen readers

#### Textarea

**Same as text input, plus**:
```
Minimum Height: 120px
Resize: vertical (allow user control)
Max Height: 400px (prevent excessive expansion)
```

#### Select Dropdown

**Visual Specs**:
```
Same as text input
Icon: Chevron down (24x24px), right side
Icon Color: #64748B
```

**Accessibility**:
- Use native <select> for best support
- Custom dropdowns must have ARIA roles
- Keyboard navigable (arrow keys)

#### Checkbox

**Visual Specs**:
```
Size: 20x20px (larger than default)
Border: 2px solid #E2E8F0
Border Radius: 4px
Background: #FFFFFF (unchecked)
Checkmark: White on Primary Action (#DC2626) background when checked
Touch Target: 44x44px minimum (add padding)
```

**Label**:
- Positioned to the right of checkbox
- Clickable (toggles checkbox)
- Font size: 1rem (16px)

#### Radio Button

**Visual Specs**:
```
Size: 20x20px
Border: 2px solid #E2E8F0
Border Radius: 50% (circle)
Background: #FFFFFF (unselected)
Dot: Primary Action (#DC2626) when selected
Touch Target: 44x44px minimum
```

#### Form Layout

**Best Practices**:
- Vertical layout (labels above inputs)
- Single column for forms
- Group related fields
- Required fields: asterisk (*) + "(required)" text
- Optional fields: "(optional)" text
- Submit button: Full width on mobile, auto width on desktop
- Form validation: Inline, on blur or submit

**Accessibility**:
- Proper label association (for/id)
- Error messages in aria-live region
- Required attribute on required fields
- Autocomplete attributes where appropriate
- Fieldset and legend for grouped inputs

### Cards

**Research Insight**: Modular block design for content organization

**Visual Specs**:
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border Radius: 8px
Padding: Space-6 (24px)
Shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
```

**Hover State** (for clickable cards):
```
Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
Transform: translateY(-2px)
Transition: all 0.2s ease
Border: 1px solid #CBD5E1
```

**Card Anatomy**:
- Image (optional): Full-width, 16:9 or 4:3 aspect ratio
- Title: H3 or H4
- Description: Body text
- Action (optional): Button or link

**Usage**:
- Service cards
- Blog post previews
- Team members
- Testimonials
- Portfolio items

### Navigation

#### Desktop Navigation

**Visual Specs**:
```
Height: 80px
Background: #FFFFFF
Border Bottom: 1px solid #E2E8F0
Padding: Space-4 (16px) horizontal
Shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
Position: Sticky top
Z-index: 1000
```

**Logo**:
- Height: 40-48px
- Left aligned
- Link to homepage

**Navigation Links**:
```
Font Size: 1rem (16px)
Font Weight: 600
Color: #0F172A
Padding: 12px 16px
Hover: Color #2563EB (link color)
Active Page: Color #2563EB, border-bottom 2px solid #2563EB
```

**CTA Button** (in nav):
- Primary button style
- Right aligned
- "Get Started" or "Contact Us"

#### Mobile Navigation

**Hamburger Menu**:
```
Icon: Three lines, 24x24px
Touch Target: 44x44px
Position: Top right
Color: #0F172A
```

**Mobile Menu**:
```
Position: Fixed, full screen
Background: #FFFFFF
Animation: Slide in from right
Padding: Space-6
```

**Mobile Links**:
```
Full width
Padding: 16px
Font Size: 1.125rem (18px)
Border Bottom: 1px solid #E2E8F0
```

**Accessibility**:
- aria-label on hamburger button
- aria-expanded state
- Focus trap in open menu
- Escape key closes menu
- No scroll when menu open

### Footer

**Visual Specs**:
```
Background: #0F172A (dark)
Color: #F8FAFC (light text)
Padding: Space-12 (48px) vertical, Space-6 horizontal
Border Top: 4px solid #DC2626 (brand accent)
```

**Footer Sections** (Desktop - 4 columns):
1. Logo + tagline
2. Quick links (Services, About, Contact)
3. Resources (Blog, Case Studies, FAQ)
4. Contact info + social icons

**Footer Links**:
```
Color: #F8FAFC
Font Size: 0.875rem (14px)
Hover: Color #DC2626 (action color)
Underline: On hover
```

**Copyright**:
```
Text align: center
Font size: 0.75rem (12px)
Color: #64748B
Padding top: Space-8
Border top: 1px solid #334155
```

**Mobile Footer**: Stack all sections vertically

---

## Accessibility Standards

**Target**: WCAG 2.1 AA Minimum (AAA where feasible)

### Color Contrast

**Requirements**:
- Normal text (under 18px): 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

**Testing**: Use WebAIM Contrast Checker for all color combinations

### Keyboard Navigation

**Requirements**:
- All interactive elements keyboard accessible
- Logical tab order (left-to-right, top-to-bottom)
- Visible focus indicators (2px outline minimum)
- Skip to main content link
- No keyboard traps

**Focus Indicator**:
```
Outline: 2px solid #2563EB
Outline Offset: 2px
Never: outline: none (unless custom focus state provided)
```

### Screen Reader Support

**Requirements**:
- Semantic HTML (nav, main, article, footer, etc.)
- Proper heading hierarchy (no skipped levels)
- Alt text for all images (descriptive, not "image of")
- ARIA labels for icons and icon buttons
- Form labels properly associated
- Error messages announced
- Loading states announced
- Dynamic content updates announced (aria-live)

**ARIA Usage**:
- Use semantic HTML first
- ARIA only when semantic HTML insufficient
- Common: aria-label, aria-labelledby, aria-describedby
- Navigation: aria-current="page" for current page
- Modals: aria-modal, role="dialog"
- Buttons: Never use div with onclick (use <button>)

### Touch Targets

**Research Insight**: 44x44px minimum for accessibility and usability

**Requirements**:
- All interactive elements: 44x44px minimum
- Spacing between touch targets: 8px minimum
- Exception: Inline text links (but generous padding)

### Content Accessibility

**Requirements**:
- No content that flashes more than 3 times per second
- Text resizable up to 200% without loss of function
- Content readable without horizontal scroll
- Meaningful link text (not "click here")
- Language attribute on html element
- Captions for video
- Transcripts for audio
- Descriptive error messages

### Testing Checklist

**Automated Testing**:
- [ ] Lighthouse accessibility audit (target: 100)
- [ ] Axe DevTools (0 violations)
- [ ] WAVE (0 errors)

**Manual Testing**:
- [ ] Keyboard navigation complete flow
- [ ] Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- [ ] Color contrast verification
- [ ] Focus indicator visibility
- [ ] Form accessibility (labels, errors, validation)
- [ ] Zoom to 200% test
- [ ] Mobile screen reader test

---

## Responsive Design

**Philosophy**: Mobile-first design (75%+ traffic from mobile)

### Approach

1. **Design for mobile first** (320px)
2. **Enhance for tablet** (640px+)
3. **Optimize for desktop** (1024px+)
4. **Refine for large screens** (1440px+)

### Responsive Patterns

#### Navigation
- Mobile: Hamburger menu
- Tablet: Horizontal nav (may overflow to hamburger)
- Desktop: Full horizontal nav with all items visible

#### Typography
- Mobile: Smaller headings, maintain readability
- Tablet: Medium headings
- Desktop: Full-size headings with optimal hierarchy

#### Images
- Mobile: Full width, vertical orientation preferred
- Tablet: Side-by-side possible
- Desktop: Large, high-quality images

#### Layout
- Mobile: Single column, everything stacks
- Tablet: 2 columns where appropriate
- Desktop: Multi-column layouts (2-4 columns)

#### Spacing
- Mobile: Tighter spacing (Space-4 to Space-8)
- Tablet: Medium spacing (Space-8 to Space-12)
- Desktop: Generous spacing (Space-12 to Space-20)

### Implementation

**CSS Approach**: Mobile-first media queries
```css
/* Mobile first (default styles) */
.element { font-size: 1rem; }

/* Tablet and up */
@media (min-width: 640px) {
  .element { font-size: 1.125rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { font-size: 1.25rem; }
}
```

**Next.js Image**: Use next/image for responsive images
```jsx
<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={false} // true for above-fold images
/>
```

### Testing

**Test on Real Devices**:
- iPhone (various models)
- Android phones (various)
- iPad / Android tablets
- Various desktop resolutions

**Browser Testing**:
- Chrome (mobile and desktop)
- Safari (iOS and macOS)
- Firefox
- Edge

**Responsive Testing Tools**:
- Chrome DevTools device emulation
- BrowserStack for real device testing
- Responsive design mode in Firefox

---

## Animation & Motion

**Research Insight**: Micro-animations improve UX when purpose-driven

### Principles

1. **Purpose-Driven**: Every animation should serve a function
2. **Subtle**: Animations should enhance, not distract
3. **Fast**: Keep transitions quick (150-300ms)
4. **Respect Preferences**: Honor prefers-reduced-motion

### Timing

**Duration Guidelines**:
```
Instant: 0ms (immediate state changes)
Very Fast: 100-150ms (button feedback)
Fast: 150-250ms (most transitions)
Medium: 250-400ms (complex state changes)
Slow: 400ms+ (page transitions, rare)
```

**Easing Functions**:
```
Default: cubic-bezier(0.4, 0.0, 0.2, 1) - ease-in-out
Entrance: cubic-bezier(0.0, 0.0, 0.2, 1) - ease-out
Exit: cubic-bezier(0.4, 0.0, 1, 1) - ease-in
```

### Common Animations

#### Button Hover
```css
transition: all 0.2s ease-in-out;
transform: translateY(-2px); /* subtle lift */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

#### Card Hover
```css
transition: all 0.2s ease-in-out;
transform: translateY(-4px);
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
```

#### Link Hover
```css
transition: color 0.15s ease-in-out;
```

#### Fade In (page load)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 0.3s ease-in-out;
```

#### Slide In (mobile menu)
```css
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
animation: slideIn 0.3s ease-out;
```

### Accessibility

**Reduced Motion**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Guidelines**:
- Never use animations that flash or strobe
- Provide pause/stop controls for auto-playing content
- Don't rely on animation to convey critical information
- Test with reduced motion preference enabled

---

## Design Tokens (React/Tailwind)

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-primary': '#1E40AF',
        'brand-secondary': '#0F172A',
        'brand-accent': '#06B6D4',

        // Action Colors
        'action-primary': '#DC2626',
        'action-secondary': '#7C3AED',
        'action-link': '#2563EB',

        // Semantic Colors
        'success': '#059669',
        'warning': '#D97706',
        'error': '#DC2626',
        'info': '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.5' }],
        'h5': ['1.125rem', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        // Custom spacing scale
      },
    },
  },
}
```

---

## Usage Guidelines

### Component Usage

**Buttons**:
- Maximum one primary button per section
- Use secondary button for alternative actions
- Always use descriptive text ("Get Started", not "Click Here")
- Ensure 44x44px minimum touch target

**Forms**:
- Limit to 4 fields for optimal conversion
- Always show labels (don't hide in placeholders)
- Provide inline validation
- Clear error messages with solutions

**Cards**:
- Maintain consistent card height in grids
- Use aspect ratio containers for images
- Ensure clickable cards have hover states
- Include clear action if card is clickable

**Navigation**:
- Use descriptive labels ("Web Design Services", not "Services")
- Position important items first or last (serial-position effect)
- Highlight current page
- Maintain sticky navigation on scroll

### Performance Guidelines

**Images**:
- Use next/image for all images
- WebP format preferred
- Lazy load below-fold images
- Provide proper alt text
- Specify width/height to prevent CLS

**Fonts**:
- Use next/font for font optimization
- Preload critical fonts
- Subset fonts if possible
- Limit to 2-3 font weights

**Code**:
- Code splitting with Next.js
- Minimize JavaScript bundle
- Tree-shake unused code
- Use CSS modules or Tailwind (no runtime CSS-in-JS)

---

## Next Steps

### For Designers
1. Create high-fidelity mockups using this style guide
2. Ensure all designs meet accessibility contrast ratios
3. Specify responsive behavior for all components
4. Provide design files in Figma/Sketch/XD

### For Developers
1. Set up Tailwind with design tokens
2. Create reusable React components
3. Implement accessibility features (ARIA, keyboard nav)
4. Test on real devices and browsers
5. Run Lighthouse audits (target 90+ all categories)

### For Content Creators
1. Follow typography hierarchy for content structure
2. Write descriptive link and button text
3. Provide image alt text
4. Keep forms simple (4 fields maximum)
5. Use clear, action-oriented language

---

**Document Status**: Draft for Review
**Review Needed By**: Design team, Development team, Stakeholders
**Questions or Feedback**: Document in project management system

---

*This style guide is a living document and should be updated as the design system evolves.*
