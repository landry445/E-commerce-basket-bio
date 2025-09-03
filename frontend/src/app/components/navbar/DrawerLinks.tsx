"use client";

import Link from "next/link";

type DrawerTextLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

export function DrawerTextLink({ href, label, onClick }: DrawerTextLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-1 py-2 rounded-md hover:bg-[var(--color-primary)] hover:text-white transition"
    >
      {label}
    </Link>
  );
}

type DrawerButtonLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

export function DrawerButtonLink({
  href,
  label,
  onClick,
}: DrawerButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "flex items-center justify-between h-11 rounded-full px-4",
        "border hover:bg-[var(--color-primary)] hover:text-white transition",
        "text-[var(--color-dark)] font-medium",
      ].join(" ")}
    >
      <span>{label}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Link>
  );
}
