interface PageHeroProps {
  label: string;
  heading: string;
  /** Default: "white". Use "magenta" for lead-magnet/offer pages. */
  headingColor?: "white" | "magenta";
  /** Default: "lg" (text-4xl/5xl). Use "sm" (text-3xl/4xl) for tier + form pages. */
  headingSize?: "sm" | "lg";
  subhead?: string;
  /** Default: "base". Use "sm" for tighter subheads with max-w-xl constraint. */
  subheadSize?: "sm" | "base";
  /** Single line of mono metadata shown below the subhead (e.g. pricing). */
  meta?: string;
  /** Optional second mono line shown below meta (e.g. guarantee callout). */
  subNote?: string;
  /** Flex-wrapped tag spans shown below the subhead (e.g. qualifying criteria). */
  tags?: string[];
}

export default function PageHero({
  label,
  heading,
  headingColor = "white",
  headingSize = "lg",
  subhead,
  subheadSize = "base",
  meta,
  subNote,
  tags,
}: PageHeroProps) {
  const headingColorClass = headingColor === "magenta" ? "text-brand-magenta" : "text-white";
  const headingSizeClass = headingSize === "sm" ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl";

  const subheadClasses = [
    subheadSize === "sm" ? "text-sm text-white/55 leading-relaxed max-w-xl" : "text-base text-white/55 leading-relaxed",
    tags || meta ? "mb-5" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="bg-brand-ink px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-white/35 uppercase tracking-widest mb-4">{label}</p>
        <h1
          className={`${headingSizeClass} font-bold ${headingColorClass} leading-tight mb-5`}
          style={{ letterSpacing: "-0.02em" }}
        >
          {heading}
        </h1>
        {subhead && <p className={subheadClasses}>{subhead}</p>}
        {meta && <p className="font-mono text-xs text-white/35">{meta}</p>}
        {subNote && <p className="font-mono text-xs text-brand-magenta mt-1">{subNote}</p>}
        {tags && tags.length > 0 && (
          <p className="font-mono text-xs text-white/35 flex flex-wrap gap-x-6 gap-y-1">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
