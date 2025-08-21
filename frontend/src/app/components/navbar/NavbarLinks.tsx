"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

type NavItem = { label: string; href: string; cta?: boolean };

export default function NavbarLinks({
  onNavigate,
  className = "",
}: NavbarLinksProps) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Nos paniers", href: "/paniers" },
    { label: "Votre maraîcher", href: "/votre-maraicher" },
    // CTA en dernier sur desktop
    { label: "Réservez", href: "/reserver", cta: true },
  ];

  return (
    <ul
      className={`md:flex items-center gap-8 font-sans text-[1rem] font-semibold ${className}`}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        if (item.cta) {
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2",
                  "bg-yellow text-dark ring-1 ring-dark/10 shadow-sm",
                  "hover:bg-primary hover:text-white transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                ].join(" ")}
              >
                <span>Réservez</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M7 4l6 6-6 6" />
                </svg>
              </Link>
            </li>
          );
        }

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={[
                "transition-colors hover:text-primary cursor-pointer",
                isActive
                  ? "underline underline-offset-4 decoration-primary"
                  : "",
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
