import Link from "next/link";
import { ReactNode } from "react";

type Tone = "primary" | "accent" | "cta";

type ButtonGenericProps = {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
  disabled?: boolean;
};

const toneClasses: Record<Tone, string> = {
  primary:
    "bg-[var(--color-primary)] hover:bg-[var(--color-dark)] text-[var(--color-light)] hover:text-[var(--color-light)]",
  accent:
    "bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-[var(--color-light)] hover:text-[var(--color-light)]",
  cta: "bg-[var(--color-light)] hover:bg-[var(--color-yellow)] text-[var(--foreground)] hover:text-[var(--foreground)]",
};

export default function ButtonGeneric({
  href,
  children,
  tone = "primary",
  className = "",
  disabled = false,
}: ButtonGenericProps) {
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={[
        "inline-block font-bold px-4 py-2 text-[15px] rounded-lg transition-colors ",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[var(--color-light)] focus-visible:ring-offset-[var(--color-yellow)]",
        "btn-press", // effet Uiverse.io adapté
        toneClasses[tone],
        disabled ? "pointer-events-none opacity-60" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
