import { ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline-white" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-magenta text-white font-bold hover:bg-brand-crimson active:bg-brand-crimson disabled:bg-neutral-border disabled:text-text-muted disabled:cursor-not-allowed",
  secondary:
    "bg-transparent text-brand-ink border border-brand-ink font-bold hover:bg-brand-ink hover:text-white disabled:border-neutral-border disabled:text-text-muted disabled:cursor-not-allowed",
  "outline-white":
    "bg-transparent text-white border border-white/30 hover:border-white/60 active:border-white/80",
  ghost:
    "font-mono text-xs text-brand-crimson underline underline-offset-2 uppercase tracking-wider",
};

export default function Button({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 min-h-[44px] min-w-[44px] rounded-sm text-sm transition-colors duration-150 cursor-pointer";
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
