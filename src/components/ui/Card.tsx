import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`bg-white border border-black/10 rounded-sm p-5 ${
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-black/20"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
