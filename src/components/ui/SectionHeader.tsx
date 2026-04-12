interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="font-mono text-xs text-brand-ink/40 uppercase tracking-widest mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl font-bold mb-3 ${light ? "text-white" : "text-brand-ink"}`}
        style={{ letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-sm leading-relaxed ${light ? "text-white/55" : "text-brand-ink/60"} ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
