"use client";

import { useState } from "react";

interface CommonQuestionsProps {
  heading: string;
  items: { q: string; a: string }[];
  bg?: string;
}

export default function CommonQuestions({
  heading,
  items,
  bg = "bg-brand-offwhite",
}: CommonQuestionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`${bg} px-6 py-16`}>
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
          Common questions
        </p>
        <h2
          className="text-2xl font-bold text-brand-ink mb-8"
          style={{ letterSpacing: "-0.01em" }}
        >
          {heading}
        </h2>
        <div className="border border-black/10 rounded-sm overflow-hidden divide-y divide-black/10">
          {items.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-black/[0.03] transition-colors min-h-[52px]"
              >
                <p className="font-bold text-brand-ink text-sm leading-snug">
                  {item.q}
                </p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-crimson"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 bg-white border-t border-black/10">
                  <p className="text-base text-brand-ink/60 leading-relaxed pt-4">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
