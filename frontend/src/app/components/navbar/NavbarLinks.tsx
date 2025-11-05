"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Variant = "desktop" | "mobile";

type NavbarLinksProps = {
  isAuthenticated: boolean;
  variant?: Variant;
  onNavigate?: () => void;
  className?: string;
};

type NavItem = { label: string; href: string; cta?: boolean };

export default function NavbarLinks({
  isAuthenticated,
  variant = "desktop",
  onNavigate,
  className = "",
}: NavbarLinksProps) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Nos paniers", href: "/paniers" },
    { label: "Votre maraîcher", href: "/votre-maraicher" },
    {
      label: "Réservez",
      href: isAuthenticated ? "/reserver" : "/login",
      cta: true,
    },
  ];

  const isDesktop = variant === "desktop";

  return (
    <ul
      className={[
        isDesktop ? "md:flex hidden items-center gap-8" : "flex flex-col gap-3",
        "font-sans font-semibold",
        className,
      ].join(" ")}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        if (item.cta) {
          // Style CTA
          const ctaClass = isDesktop
            ? [
                "inline-flex items-center gap-2 rounded-full px-4 py-2",
                "bg-[var(--color-yellow)] text-[var(--color-dark)] ring-1 ring-black/10 shadow-sm",
                "hover:bg-[var(--color-primary)] hover:text-white transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              ].join(" ")
            : [
                "block rounded-full px-4 py-2 text-center",
                "bg-[var(--color-yellow)] text-[var(--color-dark)] ring-1 ring-black/10 shadow-sm",
                "hover:bg-[var(--color-primary)] hover:text-white transition-all",
              ].join(" ");

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={ctaClass}
              >
                <span>Réservez</span>
                {isDesktop && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    aria-hidden
                    fill="currentColor"
                  >
                    <path d="M7 4l6 6-6 6" />
                  </svg>
                )}
              </Link>
            </li>
          );
        }

        // Liens simples
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={[
                "transition-colors hover:text-[var(--color-primary)] cursor-pointer",
                isActive ? "text-[var(--color-primary)]" : "",
                isDesktop ? "" : "px-2 py-2 rounded-lg hover:bg-black/5",
              ].join(" ")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
