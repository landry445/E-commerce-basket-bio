"use client";

import Link from "next/link";
import Image from "next/image";
import NavbarLinks from "./NavbarLinks";
import NavbarUserButton from "./NavbarUserButton";

type DesktopBarProps = {
  className?: string;
  isAuthenticated: boolean;
  user?: AuthUser;
  onMenuOpen: () => void;
  onLogout: () => void;
};

type AuthUser = {
  firstname: string;
  is_admin: boolean;
};

export default function DesktopBar({
  className,
  isAuthenticated,
  user,
  onMenuOpen,
  onLogout,
}: DesktopBarProps) {
  return (
    <header className={className}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" aria-label="Aller à l’accueil" className="shrink-0">
          <Image
            src="/logo-jardins-des-rainettes.jpeg"
            alt="Logo"
            width={56}
            height={80}
            priority
          />
        </Link>

        <div className="hidden md:block">
          <NavbarLinks isAuthenticated={isAuthenticated} variant="desktop" />
        </div>

        {/* Burger mobile */}
        <button
          onClick={onMenuOpen}
          className="flex md:hidden cursor-pointer p-2 rounded hover:bg-primary/10 transition"
          aria-label="Ouvrir le menu"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-8 h-8">
            <rect y="4" width="20" height="2" rx="1" fill="#5B8C51" />
            <rect y="9" width="20" height="2" rx="1" fill="#5B8C51" />
            <rect y="14" width="20" height="2" rx="1" fill="#5B8C51" />
          </svg>
        </button>

        {/* Zone utilisateur desktop */}
        <div className="hidden md:block">
          <NavbarUserButton
            user={
              user
                ? { firstname: user.firstname, isAdmin: user.is_admin }
                : undefined
            }
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
