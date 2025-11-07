"use client";

import Link from "next/link";
import { useRef } from "react";

export type NavbarUserButtonProps = {
  user?: { firstname: string; isAdmin: boolean };
  onLogout?: () => void;
  isMobile?: boolean;
  onAfterClick?: () => void;
};

export default function NavbarUserButton({
  user,
  onLogout,
  isMobile,
  onAfterClick,
}: NavbarUserButtonProps) {
  const circleBase = isMobile ? "w-11 h-11" : "w-9 h-9";
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onAfterClick}
        className={[
          "inline-flex items-center justify-center ",
          circleBase,
          "focus-visible:outline-none focus-visible:ring-2 ",
        ].join(" ")}
        aria-label="Se connecter"
      >
        <svg
          className="text-[var(--color-primary)]"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
        </svg>
      </Link>
    );
  }

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className={[
          "list-none cursor-pointer select-none",
          "inline-flex items-center justify-center ",
          " text-[var(--color-dark)]",
          circleBase,
          ,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        ].join(" ")}
        aria-label="Menu utilisateur"
      >
        <svg
          className="text-[var(--color-primary)]"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
        </svg>
        <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-500 border-2 border-white"></span>
      </summary>

      <div
        className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 py-2 z-[70]"
        role="menu"
        aria-label="Menu utilisateur"
      >
        <div className="px-3 pb-2 text-xs text-gray-600">
          Connecté&nbsp;:{" "}
          <span className="font-semibold">{user.firstname}</span>
        </div>

        <MenuLink href="/mon-compte" onAfterClick={onAfterClick}>
          Compte et Réservations
        </MenuLink>
        {user.isAdmin && (
          <MenuLink href="/admin/reservations" onAfterClick={onAfterClick}>
            Espace admin
          </MenuLink>
        )}

        <button
          onClick={() => {
            detailsRef.current?.removeAttribute("open");
            onAfterClick?.();
            onLogout?.();
          }}
          className={menuItemClass()}
          role="menuitem"
        >
          <span className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
              <path
                d="M12 2v8M6.2 6.2a8 8 0 1 0 11.6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Se déconnecter
          </span>
        </button>
      </div>
    </details>
  );
}

function MenuLink({
  href,
  children,
  onAfterClick,
}: {
  href: string;
  children: React.ReactNode;
  onAfterClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className={menuItemClass()}
      role="menuitem"
      onClick={onAfterClick}
    >
      {children}
    </Link>
  );
}

function menuItemClass(): string {
  return [
    "w-full text-left px-3 py-2 text-sm",
    "hover:bg-[var(--color-primary)] hover:text-white",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    "transition flex items-center justify-between rounded-md",
  ].join(" ");
}
