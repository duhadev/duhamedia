"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    color: "#c20e59",
    title: "Audit",
    body: "Shopify Analytics, GA4, Clarity heatmaps, and session recordings surface exactly where visitors drop off — before anything changes.",
  },
  {
    num: "02",
    color: "#e82561",
    title: "Build",
    body: "UX and copy redesigned around conversion architecture. Every decision tied to a finding from the audit.",
  },
  {
    num: "03",
    color: "#f5c842",
    title: "Optimise",
    body: "Fixes deployed against real behavioural data, with before/after measurement on every change. Class A clients also run structured A/B tests via GrowthBook once traffic supports significance (25,000+ monthly sessions).",
  },
  {
    num: "04",
    color: "#0F172A",
    title: "Report",
    body: "Monthly performance reports against baseline, plus a live client dashboard with the full change log and the rationale behind every update.",
  },
];

interface StepCardProps {
  step: (typeof steps)[number];
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fire once when the card first enters the viewport — triggers the entrance animation
    const entryObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          entryObs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    entryObs.observe(el);

    // Track whether this card is in the central "focus zone" of the viewport
    const focusObs = new IntersectionObserver(
      ([entry]) => setFocused(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 }
    );
    focusObs.observe(el);

    return () => {
      entryObs.disconnect();
      focusObs.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative bg-white p-6 flex flex-col gap-4"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "0.4s",
        transitionDelay: `${index * 0.08}s`,
        transitionTimingFunction: "ease-out",
      }}
    >
      {/*
        Mobile-only colored left accent bar.
        Uses inset box-shadow so it doesn't affect layout or create
        gaps against adjacent cards in the stacked column.
        Fades between focused/unfocused as user scrolls.
      */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] md:hidden"
        style={{
          background: step.color,
          opacity: focused ? 1 : 0.2,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden="true"
      />

      {/* Top row: step number + colour dot */}
      <div className="flex items-center justify-between">
        <p
          className="font-mono text-xs transition-colors duration-300"
          style={{ color: focused ? step.color : "rgba(15,23,42,0.25)" }}
        >
          {step.num}
        </p>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }} />
      </div>

      {/* Coloured rule */}
      <div className="h-px w-full" style={{ background: step.color, opacity: 0.5 }} />

      {/* Content */}
      <p className="font-bold text-brand-ink text-base">{step.title}</p>
      <p className="text-sm text-brand-ink/55 leading-relaxed">{step.body}</p>
    </div>
  );
}

export default function Methodology() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-4">How we work</p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-ink leading-snug" style={{ letterSpacing: "-0.01em" }}>
              Most agencies work in a black box.<br />We don&apos;t.
            </h2>
          </div>
          <Link
            href="/how-it-works"
            className="font-mono text-xs text-brand-crimson underline underline-offset-2 flex-shrink-0"
          >
            See the full methodology →
          </Link>
        </div>

        {/*
          Steps grid.
          Mobile: 1 column, divided by thin borders — no gap so the absolute
          accent bar on each card runs flush top-to-bottom without breaks.
          Desktop (md+): 4 columns, gap-px with bg-black/10 for thin separators.
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y divide-black/10 md:divide-y-0 md:gap-px md:bg-black/10">
          {steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="font-mono text-xs text-brand-ink/30 mt-8">
          Every change documented. Every test has a rationale. Every result measured.
        </p>
      </div>
    </section>
  );
}
