// components/ButtonGeneric.tsx
import Link from "next/link";
import { ReactNode } from "react";

type Tone = "primary" | "accent";

type ButtonGenericProps = {
  href: string;
  children: ReactNode;
  tone?: Tone; // "primary" (par défaut) ou "accent"
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  primary: "bg-[var(--color-primary)] hover:bg-[var(--color-dark)]",
  accent: "bg-[var(--color-accent)]  hover:bg-[var(--color-primary)]",
};

export default function ButtonGeneric({
  href,
  children,
  tone = "primary",
  className = "",
}: ButtonGenericProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-block rounded-md px-5 py-3 font-medium",
        "text-[var(--color-light)]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[var(--color-yellow)] focus-visible:ring-offset-[var(--color-light)]",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
