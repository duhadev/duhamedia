/* @ds-bundle: {"format":4,"namespace":"DuhaMediaDesignSystem_a9da48","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"FAQItem","sourcePath":"components/core/FAQItem.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"AccentHeadline","sourcePath":"components/display/AccentHeadline.jsx"},{"name":"CaseStudyCard","sourcePath":"components/display/CaseStudyCard.jsx"},{"name":"Metric","sourcePath":"components/display/Metric.jsx"},{"name":"MetricStrip","sourcePath":"components/display/Metric.jsx"},{"name":"PhaseTimeline","sourcePath":"components/display/PhaseTimeline.jsx"},{"name":"Testimonial","sourcePath":"components/display/Testimonial.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"29ba92bf2e57","components/core/Button.jsx":"ab79862ccebd","components/core/Eyebrow.jsx":"de66b01c518b","components/core/FAQItem.jsx":"13cf165ec2b5","components/core/Input.jsx":"941d0f605314","components/display/AccentHeadline.jsx":"9d4a87d327e2","components/display/CaseStudyCard.jsx":"ec5478e4e162","components/display/Metric.jsx":"417df4bf4503","components/display/PhaseTimeline.jsx":"9d010d441563","components/display/Testimonial.jsx":"6f20afd76292","ui_kits/website/App.jsx":"f88ae0ab2c2c","ui_kits/website/Chrome.jsx":"b6f45cbc105d","ui_kits/website/Hero.jsx":"6b17b89c75b5","ui_kits/website/HomeSections.jsx":"93e5362bd3a4","ui_kits/website/Pages.jsx":"5e285d783d6d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DuhaMediaDesignSystem_a9da48 = window.DuhaMediaDesignSystem_a9da48 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'outline',
  icon,
  children,
  style
}) {
  const tones = {
    outline: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '2px solid var(--ink)'
    },
    fill: {
      background: 'var(--ink)',
      color: 'var(--cream)',
      border: '2px solid var(--ink)'
    },
    accent: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-accent)',
      border: '2px solid var(--accent-primary)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      padding: '8px 16px',
      borderRadius: 'var(--radius-badge)',
      lineHeight: 1.2,
      ...tones[tone],
      ...style
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  style,
  ...rest
}) {
  const pad = size === 'lg' ? '18px 32px' : size === 'sm' ? '10px 18px' : '14px 26px';
  const fs = size === 'lg' ? 17 : size === 'sm' ? 14 : 15;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: fs,
    padding: pad,
    minHeight: 'var(--target-min)',
    border: '2px solid transparent',
    borderRadius: 'var(--radius-none)',
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: 1,
    transition: 'all var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-accent)',
      borderColor: 'var(--accent-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      borderColor: 'var(--ink)'
    },
    'ghost-light': {
      background: 'transparent',
      color: 'var(--cream)',
      borderColor: 'var(--cream)'
    },
    dark: {
      background: 'var(--ink)',
      color: 'var(--cream)',
      borderColor: 'var(--ink)'
    }
  };
  const s = {
    ...base,
    ...variants[variant],
    ...style
  };
  const hover = e => {
    if (variant === 'primary') e.currentTarget.style.filter = 'brightness(.9)';else if (variant === 'ghost') {
      e.currentTarget.style.background = 'var(--ink)';
      e.currentTarget.style.color = 'var(--cream)';
    } else if (variant === 'ghost-light') {
      e.currentTarget.style.background = 'var(--cream)';
      e.currentTarget.style.color = 'var(--ink)';
    } else e.currentTarget.style.filter = 'brightness(1.15)';
  };
  const unhover = e => {
    e.currentTarget.style.filter = '';
    e.currentTarget.style.background = s.background;
    e.currentTarget.style.color = s.color;
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: s,
    onMouseEnter: hover,
    onMouseLeave: unhover,
    onMouseDown: e => e.currentTarget.style.transform = 'translateY(1px)',
    onMouseUp: e => e.currentTarget.style.transform = ''
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  muted,
  tick = false,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: tick ? 'flex' : 'block',
      alignItems: tick ? 'center' : undefined,
      gap: tick ? 10 : undefined,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--text-small)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: muted ? 'var(--gray-warm)' : 'currentColor',
      ...style
    }
  }, tick && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      background: 'var(--ground-accent)',
      transform: 'rotate(45deg)',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/FAQItem.jsx
try { (() => {
const {
  useState
} = React;
function FAQItem({
  question,
  children,
  defaultOpen = false
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--border-hairline)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '18px 0',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '1.125rem',
      color: 'var(--ink)',
      minHeight: 'var(--target-min)'
    }
  }, question, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: open ? 'var(--accent-primary)' : 'var(--ink)',
      transition: 'transform var(--dur-fast) var(--ease-out)',
      transform: open ? 'rotate(45deg)' : 'none',
      lineHeight: 1
    }
  }, "+")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 0 20px',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 'var(--leading-body)',
      color: 'var(--ink)',
      maxWidth: '62ch'
    }
  }, children));
}
Object.assign(__ds_scope, { FAQItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FAQItem.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  type = 'text',
  textarea,
  dark,
  style,
  ...rest
}) {
  const fg = dark ? 'var(--cream)' : 'var(--ink)';
  const field = {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '12px 14px',
    minHeight: 'var(--target-min)',
    background: dark ? 'transparent' : 'var(--cream)',
    color: fg,
    border: `2px solid ${fg}`,
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    ...style
  };
  const El = textarea ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      color: fg
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)'
    }
  }, label), /*#__PURE__*/React.createElement(El, _extends({
    type: textarea ? undefined : type,
    rows: textarea ? 4 : undefined,
    style: field,
    onFocus: e => e.target.style.borderColor = 'var(--accent-primary)',
    onBlur: e => e.target.style.borderColor = fg
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/display/AccentHeadline.jsx
try { (() => {
/** headline text with one accent-colored segment. `accent` marks the substring to color. */
function AccentHeadline({
  as = 'h2',
  text,
  accent,
  level = 1,
  style
}) {
  const Tag = as;
  const sizes = {
    1: 'var(--text-h1)',
    2: 'var(--text-h2)',
    3: 'var(--text-h3)'
  };
  const leads = {
    1: 'var(--leading-h1)',
    2: 'var(--leading-h2)',
    3: 'var(--leading-h3)'
  };
  let parts = [text];
  if (accent && text.includes(accent)) {
    const i = text.indexOf(accent);
    parts = [text.slice(0, i), /*#__PURE__*/React.createElement("span", {
      key: "a",
      style: {
        color: 'var(--accent-primary)'
      }
    }, accent), text.slice(i + accent.length)];
  }
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: sizes[level],
      lineHeight: leads[level],
      color: 'var(--ink)',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      textWrap: 'balance',
      ...style
    }
  }, parts);
}
Object.assign(__ds_scope, { AccentHeadline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/AccentHeadline.jsx", error: String((e && e.message) || e) }); }

// components/display/CaseStudyCard.jsx
try { (() => {
function CaseStudyCard({
  client,
  metric,
  metricLabel,
  summary,
  href = '#',
  image,
  tall = false,
  style
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--gray-light)',
      textDecoration: 'none',
      color: 'var(--ink)',
      fontFamily: 'var(--font-body)',
      transition: 'box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-lift)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = '';
      e.currentTarget.style.transform = '';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: tall ? '4/3' : '16/9',
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--cream)',
      fontWeight: 500,
      fontSize: '0.8125rem',
      opacity: .6
    }
  }, "dashboard screenshot")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--gray-warm)'
    }
  }, client), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontSize: '2.5rem',
      lineHeight: 1.05,
      marginTop: 8,
      color: 'var(--accent-primary)'
    }
  }, metric), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 700,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginTop: 4
    }
  }, metricLabel), summary && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontWeight: 500,
      fontSize: '0.9375rem',
      lineHeight: 1.5
    }
  }, summary), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      marginTop: 14,
      fontWeight: 700,
      fontSize: '0.875rem',
      borderBottom: '2px solid var(--ink)'
    }
  }, "Read the case study")));
}
Object.assign(__ds_scope, { CaseStudyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/CaseStudyCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Metric.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Metric({
  value,
  label,
  sub,
  accent = false,
  size = 'md',
  style
}) {
  const fs = size === 'lg' ? 'var(--text-metric)' : size === 'sm' ? '2rem' : '3rem';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontSize: fs,
      lineHeight: 1,
      color: accent ? 'var(--accent-primary)' : 'var(--ink)'
    }
  }, value), label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 8,
      fontWeight: 700,
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: 'var(--ink)'
    }
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 4,
      fontWeight: 500,
      fontSize: '0.8125rem',
      color: 'var(--gray-warm)'
    }
  }, sub));
}
function MetricStrip({
  items,
  dark = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-7)',
      padding: 'var(--space-6)',
      background: dark ? 'var(--ink)' : 'var(--gray-light)',
      ...style
    }
  }, items.map((m, i) => /*#__PURE__*/React.createElement(Metric, _extends({
    key: i
  }, m, {
    style: dark ? {
      '--ink': 'var(--cream)',
      '--gray-warm': 'rgba(250,247,242,.6)'
    } : undefined
  }))));
}
Object.assign(__ds_scope, { Metric, MetricStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Metric.jsx", error: String((e && e.message) || e) }); }

// components/display/PhaseTimeline.jsx
try { (() => {
const PHASES = [{
  n: '01',
  name: 'Build Foundation',
  desc: 'Store built or rebuilt. Shopify theme, conversion-ready.'
}, {
  n: '02',
  name: 'Operate Engine',
  desc: 'Email, ads, content, SEO, GBP — one team runs it all.'
}, {
  n: '03',
  name: 'Build Independence',
  desc: 'Your team trained to run it without us. The endgame.'
}];
function PhaseTimeline({
  phases = PHASES,
  active,
  compact = false,
  style
}) {
  return /*#__PURE__*/React.createElement("ol", {
    style: {
      display: 'flex',
      flexDirection: compact ? 'column' : 'row',
      flexWrap: compact ? undefined : 'wrap',
      gap: compact ? 'var(--space-4)' : 'var(--space-5)',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, phases.map((p, i) => {
    const isActive = active === i,
      isLast = i === phases.length - 1;
    const showHandover = isLast && !/independence handover/i.test(p.name);
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        flex: 1,
        minWidth: compact ? undefined : 140,
        borderTop: `4px solid ${isActive ? 'var(--accent-primary)' : isLast ? 'var(--ink)' : 'var(--border-divider)'}`,
        paddingTop: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: '1.75rem',
        color: isActive ? 'var(--accent-primary)' : 'var(--ink)',
        display: 'block'
      }
    }, p.n), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        marginTop: 6,
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--ink)'
      }
    }, p.name, isLast && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true"
    }, " \u2192")), !compact && p.desc && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        marginTop: 6,
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: 'var(--gray-warm)'
      }
    }, p.desc), showHandover && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        marginTop: 8,
        fontWeight: 700,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--ink)',
        borderBottom: '2px solid var(--ink)'
      }
    }, "independence handover"));
  }));
}
Object.assign(__ds_scope, { PhaseTimeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/PhaseTimeline.jsx", error: String((e && e.message) || e) }); }

// components/display/Testimonial.jsx
try { (() => {
function Testimonial({
  quote,
  name,
  role,
  dark = false,
  style
}) {
  const fg = dark ? 'var(--cream)' : 'var(--ink)';
  const muted = dark ? 'rgba(250,247,242,.6)' : 'var(--gray-warm)';
  const Star = (i) => /*#__PURE__*/React.createElement("svg", {
    key: i, width: 15, height: 15, viewBox: "0 0 256 256", fill: "var(--accent-primary)", "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M239.2 97.29a16 16 0 0 0-13.81-11L166 81.17l-23.28-55.36a15.95 15.95 0 0 0-29.44 0L90 81.17l-59.44 5.15a16 16 0 0 0-9.11 28.06l45.11 39.42-13.52 58.54a16 16 0 0 0 23.84 17.34l51.11-31 51.11 31a16 16 0 0 0 23.84-17.34l-13.51-58.54 45.1-39.42a16 16 0 0 0 4.67-17.09Z"
  }));
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      padding: 'var(--space-5)',
      background: dark ? 'var(--ink)' : 'var(--cream)',
      color: fg,
      fontFamily: 'var(--font-body)',
      border: dark ? '1px solid rgba(250,247,242,.25)' : '1px solid var(--border-divider)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }
  }, /*#__PURE__*/React.createElement("span", {
    style: { display: 'flex', gap: 2 }
  }, [0, 1, 2, 3, 4].map(Star)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: muted
    }
  }, "Google review")), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 'var(--space-4) 0 0',
      fontWeight: 500,
      fontSize: '1.0625rem',
      lineHeight: 1.5,
      textWrap: 'pretty'
    }
  }, quote), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontSize: '0.8125rem',
      fontWeight: 700
    }
  }, name, role && /*#__PURE__*/React.createElement("span", {
    style: { fontWeight: 500, color: muted }
  }, " \u00B7 ", role)));
}
Object.assign(__ds_scope, { Testimonial });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Testimonial.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
function Home({
  nav
}) {
  return /*#__PURE__*/React.createElement("main", {
    "data-screen-label": "Homepage"
  }, /*#__PURE__*/React.createElement(Hero, {
    nav: nav
  }), /*#__PURE__*/React.createElement(ScarcityStrip, null), /*#__PURE__*/React.createElement(LogoStrip, null), /*#__PURE__*/React.createElement(ProofSection, {
    nav: nav
  }), /*#__PURE__*/React.createElement(WhatWeDo, {
    nav: nav
  }), /*#__PURE__*/React.createElement(Process, null), /*#__PURE__*/React.createElement(Founder, null), /*#__PURE__*/React.createElement(FinalCTA, {
    nav: nav
  }));
}
function App() {
  const [page, setPage] = React.useState('home');
  const nav = p => {
    setPage(['home', 'services', 'faq', 'book'].includes(p) ? p : 'home');
    window.scrollTo(0, 0);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    nav: nav,
    page: page
  }), page === 'home' && /*#__PURE__*/React.createElement(Home, {
    nav: nav
  }), page === 'services' && /*#__PURE__*/React.createElement(ServicesHub, {
    nav: nav
  }), page === 'faq' && /*#__PURE__*/React.createElement(FAQPage, {
    nav: nav
  }), page === 'book' && /*#__PURE__*/React.createElement(BookACall, null), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Chrome.jsx
try { (() => {
const DS = window.DuhaMediaDesignSystem_a9da48;
const {
  Button,
  Eyebrow
} = DS;
function Header({
  nav,
  page
}) {
  const links = ['Work', 'Services', 'Testimonials', 'About', 'FAQ'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--cream)',
      borderBottom: '1px solid var(--border-divider)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-pad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 72
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav('home');
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.png",
    alt: "",
    style: {
      width: 34,
      height: 34
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      letterSpacing: '-0.01em'
    }
  }, "DUHA MEDIA")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav(l.toLowerCase());
    },
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: page === l.toLowerCase() ? 700 : 500,
      fontSize: 15,
      color: 'var(--ink)',
      textDecoration: 'none',
      borderBottom: page === l.toLowerCase() ? '2px solid var(--accent-primary)' : '2px solid transparent',
      paddingBottom: 2
    }
  }, l)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => nav('book')
  }, "Book a Call"))));
}
function Footer() {
  const col = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    fontSize: 14,
    fontWeight: 500
  };
  const a = {
    color: 'var(--cream)',
    textDecoration: 'none',
    opacity: .75
  };
  const h = {
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    opacity: 1,
    marginBottom: 4
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink)',
      color: 'var(--cream)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '64px var(--container-pad) 32px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.png",
    alt: "",
    style: {
      width: 30,
      height: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "DUHA MEDIA")), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .75,
      maxWidth: '28ch'
    }
  }, "One team. Store, engine, then yours to run. Chicago.")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: h
  }, "Pages"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Work"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "About"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Testimonials"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Book a Call")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: h
  }, "Services"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Shopify Theme Development"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Marketing")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: h
  }, "Resources"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Newsletter"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Review Hub"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "FAQ"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: h
  }, "Newsletter"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .75
    }
  }, "One useful email a month. Numbers included."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "you@store.com",
    style: {
      flex: 1,
      background: 'transparent',
      border: '2px solid var(--cream)',
      color: 'var(--cream)',
      padding: '10px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost-light",
    size: "sm"
  }, "Join")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(250,247,242,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '16px var(--container-pad)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      fontWeight: 500,
      opacity: .6
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Duha Media LLC"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "Cookies"), /*#__PURE__*/React.createElement("a", {
    style: a,
    href: "#"
  }, "GDPR")))));
}
Object.assign(window, {
  Header,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const DS2 = window.DuhaMediaDesignSystem_a9da48;
const {
  Button: HButton,
  Badge: HBadge,
  Eyebrow: HEyebrow,
  MetricStrip: HMetricStrip
} = DS2;
function Hero({
  nav
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Hero",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '-8%',
      top: '50%',
      width: 520,
      height: 520,
      transform: 'translateY(-50%) rotate(45deg)',
      background: 'var(--ground-accent)',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '24%',
      top: '8%',
      width: 120,
      height: 120,
      transform: 'rotate(45deg)',
      border: '2px solid var(--ground-accent)',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 28,
      top: '50%',
      transform: 'rotate(-90deg) translateX(50%)',
      transformOrigin: 'left',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--gray-warm)',
      whiteSpace: 'nowrap'
    }
  }, "Build \xB7 Operate \xB7 Hand over"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '96px var(--container-pad) 88px'
    }
  }, /*#__PURE__*/React.createElement(HEyebrow, {
    tick: true,
    style: {
      color: 'var(--ink)'
    }
  }, "Integrated ecommerce growth partner \u2014 Chicago"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 24,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 'var(--text-h1)',
      lineHeight: 'var(--leading-h1)',
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      color: 'var(--ink)',
      maxWidth: '14ch'
    }
  }, "Your ecommerce growth team, ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent-primary)'
    }
  }, "until you don't need one.")), /*#__PURE__*/React.createElement(HBadge, {
    tone: "fill",
    style: {
      marginTop: 8,
      flexShrink: 0
    }
  }, "$X.XM client revenue tracked")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '28px 0 0',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 'var(--text-body-size)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--ink)',
      maxWidth: '52ch'
    }
  }, "One team builds your store, runs your marketing, and trains yours to take over. Builds from $5K. Engines from $1K/mo."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--gray-warm)',
      fontFamily: 'var(--font-body)'
    }
  }, "[STRATEGIC PLACEHOLDER \u2014 hero copy client-authored]"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    size: "lg",
    onClick: () => nav('book')
  }, "Book a Call"), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    size: "lg",
    onClick: () => nav('work')
  }, "See the Work"))));
}
function ScarcityStrip() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Scarcity strip",
    style: {
      borderTop: 'var(--border-hairline)',
      borderBottom: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '28px var(--container-pad)',
      display: 'flex',
      gap: 96,
      fontFamily: 'var(--font-body)'
    }
  }, [['3 projects ongoing', 'Current load, shown transparently.'], ['Max 7 client capacity', 'The cap is our quality gate, not a countdown.']].map(([big, quiet]) => /*#__PURE__*/React.createElement("div", {
    key: big,
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      background: 'var(--ground-accent)',
      transform: 'rotate(45deg)',
      flexShrink: 0,
      marginTop: 11
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.75rem',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, big), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 4,
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: 'var(--gray-warm)'
    }
  }, quiet))))));
}
Object.assign(window, {
  Hero,
  ScarcityStrip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeSections.jsx
try { (() => {
const DS3 = window.DuhaMediaDesignSystem_a9da48;
const {
  Button: SButton,
  Eyebrow: SEyebrow,
  AccentHeadline: SHeadline,
  Metric: SMetric,
  MetricStrip: SMetricStrip,
  PhaseTimeline: STimeline,
  Testimonial: STest,
  CaseStudyCard: SCase
} = DS3;
const wrap = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 var(--container-pad)'
};
function Section({
  label,
  tight,
  band,
  dark,
  children
}) {
  const bg = dark ? 'var(--ink)' : band ? 'var(--gray-light)' : 'var(--cream)';
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": label,
    style: {
      background: bg,
      color: dark ? 'var(--cream)' : 'var(--ink)',
      padding: `${tight ? '64px' : '96px'} 0`,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, children));
}
function LogoStrip() {
  return /*#__PURE__*/React.createElement(Section, {
    label: "Client logos",
    tight: true
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    muted: true,
    style: {
      marginBottom: 24
    }
  }, "Stores we've run numbers for"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 56,
      alignItems: 'center',
      flexWrap: 'wrap',
      opacity: .55
    }
  }, ['NORTHSIDE GOODS', 'KEDZIE & CO', 'LAKE SUPPLY', 'MARROW', 'FIELDHOUSE'].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--ink)',
      letterSpacing: '0.02em'
    }
  }, n))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '14px 0 0',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--gray-warm)',
      fontFamily: 'var(--font-body)'
    }
  }, "[Demonstrative names \u2014 replace with real client marks]"));
}
function ProofSection({
  nav
}) {
  return /*#__PURE__*/React.createElement(Section, {
    label: "Proof (launch fallback)",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement(SHeadline, {
    level: 2,
    text: "No case studies yet. Numbers anyway.",
    accent: "Numbers anyway."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 32px',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1rem',
      color: 'var(--gray-warm)',
      maxWidth: '56ch'
    }
  }, "Case studies publish here as clients sign off. Until then: what clients say, and how we cap our load. No demo studies, no \"coming soon.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(STest, {
    quote: "They rebuilt the store, ran the ads, then taught my manager to run it. We stopped paying them in month nine \u2014 on their schedule.",
    name: "J. Alvarez",
    role: "3-location retailer, Chicago"
  }), /*#__PURE__*/React.createElement(STest, {
    quote: "Third agency we tried. First one that showed us the dashboard instead of a deck.",
    name: "M. Okafor",
    role: "Online-only, home goods"
  }), /*#__PURE__*/React.createElement(STest, {
    quote: "I'd spent $10k with nothing to show. Duha started with what that money should have bought.",
    name: "R. Patel",
    role: "Hybrid retail, 2 locations"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    onClick: () => nav('book')
  }, "Book a Call"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--gray-warm)'
    }
  }, "3 of 7 slots filled \u2014 capacity is the quality gate.")));
}
function WhatWeDo({
  nav
}) {
  const panel = {
    background: 'var(--cream)',
    border: '2px solid var(--ink)',
    padding: 32,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  };
  return /*#__PURE__*/React.createElement(Section, {
    label: "What we do",
    band: true
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "What we do"), /*#__PURE__*/React.createElement(SHeadline, {
    level: 2,
    text: "We build it. Then we grow it.",
    accent: "Then we grow it."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: panel,
    onClick: () => nav('services')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      textTransform: 'uppercase'
    }
  }, "01 \u2014 Shopify Theme Development"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.6
    }
  }, "Store built or rebuilt to convert. Half-built and not working? That's where most clients start. Builds from $5K."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      borderBottom: '2px solid var(--ink)',
      alignSelf: 'flex-start'
    }
  }, "Phase 1 \u2014 Build Foundation")), /*#__PURE__*/React.createElement("div", {
    style: panel,
    onClick: () => nav('services')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      textTransform: 'uppercase'
    }
  }, "02 \u2014 Marketing"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.6
    }
  }, "Email, ads, content, SEO, GBP, CRM \u2014 one team runs the whole engine. From $1K/mo."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      borderBottom: '2px solid var(--ink)',
      alignSelf: 'flex-start'
    }
  }, "Phase 2 \u2014 Operate Engine"))));
}
function Process() {
  const steps = [{
    n: '01',
    name: 'Intake'
  }, {
    n: '02',
    name: 'Research'
  }, {
    n: '03',
    name: 'Branding'
  }, {
    n: '04',
    name: 'Design'
  }, {
    n: '05',
    name: 'Development'
  }, {
    n: '06',
    name: 'Onboarding'
  }, {
    n: '07',
    name: 'Engine launch'
  }, {
    n: '08',
    name: 'Independence handover'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    label: "Process"
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: -170,
      bottom: 40,
      width: 340,
      height: 340,
      transform: 'rotate(45deg)',
      background: 'var(--ground-accent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "How it runs"), /*#__PURE__*/React.createElement(SHeadline, {
    level: 2,
    text: "Eight steps. The last one is the point.",
    accent: "the point."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(STimeline, {
    phases: steps,
    active: 7,
    compact: false
  }))));
}
function Founder() {
  return /*#__PURE__*/React.createElement(Section, {
    label: "Founder",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/5',
      background: 'var(--gray-warm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--cream)',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 13
    }
  }, "founder photo \u2014 camera-work slot"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "Who you'd work with"), /*#__PURE__*/React.createElement(SHeadline, {
    level: 2,
    text: "Chicago operators, not account managers."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.6,
      maxWidth: '52ch'
    }
  }, "You've managed five freelancers who never talked to each other. You've had an agency disappear after launch. We built Duha to be the opposite: one team, one dashboard, and a handover date."))));
}
function FinalCTA({
  nav
}) {
  return /*#__PURE__*/React.createElement(Section, {
    label: "Final CTA",
    dark: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 'var(--text-h2)',
      lineHeight: 1.05,
      textTransform: 'uppercase'
    }
  }, "Your store already has the demand. It's leaking it."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1.125rem',
      opacity: .85
    }
  }, "3 builds in progress. We cap at 7."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '0.8125rem',
      opacity: .5
    }
  }, "The cap keeps every build senior-staffed \u2014 that's the whole reason."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "lg",
    onClick: () => nav('book')
  }, "Book a Call"))));
}
Object.assign(window, {
  Section,
  LogoStrip,
  ProofSection,
  WhatWeDo,
  Process,
  Founder,
  FinalCTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pages.jsx
try { (() => {
const DS4 = window.DuhaMediaDesignSystem_a9da48;
const {
  Button: PButton,
  Eyebrow: PEyebrow,
  AccentHeadline: PHeadline,
  PhaseTimeline: PTimeline,
  FAQItem: PFAQ,
  Testimonial: PTest,
  Input: PInput
} = DS4;
function ServicesHub({
  nav
}) {
  const panel = {
    background: 'var(--cream)',
    border: '2px solid var(--ink)',
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  };
  return /*#__PURE__*/React.createElement("main", {
    "data-screen-label": "Services Hub"
  }, /*#__PURE__*/React.createElement(Section, {
    label: "Services hero"
  }, /*#__PURE__*/React.createElement(PEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "Services"), /*#__PURE__*/React.createElement(PHeadline, {
    as: "h1",
    level: 1,
    text: "We build it. We run it. Then it's yours.",
    accent: "Then it's yours.",
    style: {
      maxWidth: '16ch'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(PTimeline, null))), /*#__PURE__*/React.createElement(Section, {
    label: "Track split",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      textTransform: 'uppercase'
    }
  }, "Shopify Theme Development"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      lineHeight: 1.6
    }
  }, "Revision of a store that isn't working, or a build from scratch. Most clients arrive with the first. Builds from $5K."), /*#__PURE__*/React.createElement(PButton, {
    variant: "ghost",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Phase 1 \u2014 see the build track")), /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      textTransform: 'uppercase'
    }
  }, "Marketing"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      lineHeight: 1.6
    }
  }, "Email, paid ads, content, SEO, GBP, CRM \u2014 the full engine, one team. From $1K/mo, 6-month minimum."), /*#__PURE__*/React.createElement(PButton, {
    variant: "ghost",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Phase 2 \u2014 see the engine")))), /*#__PURE__*/React.createElement(Section, {
    label: "Why both together"
  }, /*#__PURE__*/React.createElement(PHeadline, {
    level: 2,
    text: "Two ways this usually goes wrong.",
    accent: "wrong."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      marginTop: 36,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.125rem',
      textTransform: 'uppercase'
    }
  }, "The agency that disappears"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontWeight: 500,
      lineHeight: 1.6
    }
  }, "Launch day is their finish line. Yours is month 12. The ongoing engine \u2014 and the handover at the end of it \u2014 is the structural difference.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.125rem',
      textTransform: 'uppercase'
    }
  }, "The five-vendor coordination tax"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontWeight: 500,
      lineHeight: 1.6
    }
  }, "A theme dev, an email person, an ads agency, a content freelancer, an SEO. None of them talk. You're the project manager now.")))), /*#__PURE__*/React.createElement(Section, {
    label: "Services FAQ",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement(PHeadline, {
    level: 3,
    text: "Routing questions"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(PFAQ, {
    question: "What does this cost?",
    defaultOpen: true
  }, "Builds start at $5K. Marketing engines start at $1K/mo with a 6-month minimum. Exact numbers on the call, not after it."), /*#__PURE__*/React.createElement(PFAQ, {
    question: "Do you lock clients into retainers?"
  }, "No \u2014 the endgame is your team running it. Phase 3 is a documented handover."), /*#__PURE__*/React.createElement(PFAQ, {
    question: "Can we start with just a build?"
  }, "Yes. Phase 1 stands alone. Most clients add the engine once the store stops leaking."))), /*#__PURE__*/React.createElement(FinalCTA, {
    nav: nav
  }));
}
function FAQPage({
  nav
}) {
  return /*#__PURE__*/React.createElement("main", {
    "data-screen-label": "FAQ"
  }, /*#__PURE__*/React.createElement(Section, {
    label: "FAQ hero",
    tight: true
  }, /*#__PURE__*/React.createElement(PEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "FAQ"), /*#__PURE__*/React.createElement(PHeadline, {
    as: "h1",
    level: 1,
    text: "Straight answers.",
    accent: "Straight"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 28,
      flexWrap: 'wrap'
    }
  }, ['Pricing & Contracts', 'Builds', 'Marketing', 'Process & Trust'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      border: '2px solid var(--ink)',
      padding: '10px 16px'
    }
  }, c)))), /*#__PURE__*/React.createElement(Section, {
    label: "FAQ pricing",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement(PHeadline, {
    level: 3,
    text: "Pricing & Contracts"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(PFAQ, {
    question: "What does it cost?",
    defaultOpen: true
  }, "Builds from $5K. Engines from $1K/mo, 6-month minimum. If those numbers don't work, we're not your team \u2014 no hard feelings."), /*#__PURE__*/React.createElement(PFAQ, {
    question: "Do you lock clients into retainers?"
  }, "No \u2014 the endgame is your team running it. We train yours, document everything, and hand over."), /*#__PURE__*/React.createElement(PFAQ, {
    question: "Why the 6-month minimum on marketing?"
  }, "Engines compound. Anything shorter and we'd be selling you a sprint dressed as a system.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 36,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PButton, {
    variant: "primary",
    onClick: () => nav('book')
  }, "Book a Call"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--gray-warm)'
    }
  }, "Quick question instead? Contact us."))));
}
function BookACall() {
  return /*#__PURE__*/React.createElement("main", {
    "data-screen-label": "Book a Call"
  }, /*#__PURE__*/React.createElement(Section, {
    label: "Book hero",
    tight: true
  }, /*#__PURE__*/React.createElement(PEyebrow, {
    muted: true,
    style: {
      marginBottom: 16
    }
  }, "Book a call"), /*#__PURE__*/React.createElement(PHeadline, {
    as: "h1",
    level: 1,
    text: "30 minutes. Your numbers, not a pitch.",
    accent: "Your numbers,",
    style: {
      maxWidth: '18ch'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.6,
      maxWidth: '52ch'
    }
  }, "For established stores netting $500K\u2013$5M. We'll look at where revenue is leaking and tell you whether we're the right fix \u2014 including when we're not.")), /*#__PURE__*/React.createElement(Section, {
    label: "Booking",
    tight: true,
    band: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream)',
      border: '2px solid var(--ink)',
      minHeight: 320,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 13,
      color: 'var(--gray-warm)'
    }
  }, "calendar embed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.125rem',
      textTransform: 'uppercase'
    }
  }, "Pre-call homework"), /*#__PURE__*/React.createElement(PInput, {
    label: "Store URL",
    placeholder: "https://"
  }), /*#__PURE__*/React.createElement(PInput, {
    label: "Annual revenue range",
    placeholder: "$500K\u2013$1M"
  }), /*#__PURE__*/React.createElement(PInput, {
    label: "What's not working?",
    textarea: true
  }), /*#__PURE__*/React.createElement(PButton, {
    variant: "primary",
    style: {
      alignSelf: 'flex-start'
    }
  }, "Send it"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(PTest, {
    quote: "The call was them asking hard questions about my margins. Refreshing.",
    name: "D. Kim",
    role: "Online-only, apparel"
  }))));
}
Object.assign(window, {
  ServicesHub,
  FAQPage,
  BookACall
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pages.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.FAQItem = __ds_scope.FAQItem;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.AccentHeadline = __ds_scope.AccentHeadline;

__ds_ns.CaseStudyCard = __ds_scope.CaseStudyCard;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.MetricStrip = __ds_scope.MetricStrip;

__ds_ns.PhaseTimeline = __ds_scope.PhaseTimeline;

__ds_ns.Testimonial = __ds_scope.Testimonial;

})();
