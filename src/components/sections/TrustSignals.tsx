const pains = [
  {
    num: "01",
    title: "Traffic not converting",
    body: "Sessions go up. Revenue doesn't follow. Something is breaking after the click — and you don't know what.",
    stat: "~97%",
    statLabel: "of visitors leave without buying",
    accent: "#c20e59",
  },
  {
    num: "02",
    title: "Blind experimentation",
    body: "Changes made on instinct. No baseline. No way to know what actually worked — or what made things worse.",
    stat: "0",
    statLabel: "tests documented before the change",
    accent: "#e82561",
  },
  {
    num: "03",
    title: "Leaky sales funnels",
    body: "Ad spend landing on pages that lose people at the same point every time. The leak never gets fixed.",
    stat: "$$",
    statLabel: "spent on ads to a broken page",
    accent: "#f5c842",
  },
];

export default function TrustSignals() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">The problem</p>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-ink leading-snug" style={{ letterSpacing: "-0.01em" }}>
            Most Shopify brands have the same three problems.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {pains.map((p) => (
            <div
              key={p.num}
              className="relative overflow-hidden border border-black/10 rounded-sm p-6 flex flex-col"
              style={{ borderTopColor: p.accent, borderTopWidth: "3px" }}
            >
              {/* Watermark number */}
              <p
                className="absolute -bottom-4 -right-2 font-mono font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: "7rem", color: p.num === "03" ? "#0F172A" : p.accent, opacity: p.num === "03" ? 0.06 : 0.07 }}
                aria-hidden="true"
              >
                {p.num}
              </p>
              {/* Content */}
              <p className="font-mono text-xs mb-4" style={{ color: p.accent }}>{p.num}</p>
              <h3 className="font-bold text-brand-ink text-base mb-3 leading-snug">{p.title}</h3>
              <p className="text-base text-brand-ink/55 leading-relaxed flex-1">{p.body}</p>
              <div className="border-t border-black/10 pt-4 mt-6 h-16">
                <p className="font-mono text-xl font-bold leading-none mb-1" style={{ color: p.accent }}>{p.stat}</p>
                <p className="font-mono text-xs text-brand-ink/40 leading-snug">{p.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
