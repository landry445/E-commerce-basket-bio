"use client";

import { useState } from "react";
import Image from "next/image";
import NavbarLinks from "./NavbarLinks";
import NavbarUserButton from "./NavbarUserButton";

type NavbarProps = {
  user?: { firstname: string; isAdmin: boolean };
  onLogout?: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-2 bg-light border-b relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo-frog.png" alt="Logo frog" width={40} height={40} />
      </div>

      {/* Liens desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <NavbarLinks />
      </div>

      {/* Utilisateur desktop */}
      <div className="hidden md:flex items-center">
        <NavbarUserButton user={user} onLogout={onLogout} />
      </div>

      {/* Burger mobile */}
      <button
        onClick={() => setOpen(true)}
        className="flex md:hidden p-2 rounded hover:bg-primary/10 transition"
        aria-label="Ouvrir le menu"
      >
        {/* Logo burger SVG */}
        <svg viewBox="0 0 20 20" fill="none" className="w-8 h-8">
          <rect y="4" width="20" height="2" rx="1" fill="#5B8C51" />
          <rect y="9" width="20" height="2" rx="1" fill="#5B8C51" />
          <rect y="14" width="20" height="2" rx="1" fill="#5B8C51" />
        </svg>
      </button>

      {/* Drawer menu mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-light border-l z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="mt-4">
              <NavbarUserButton
                user={user}
                onLogout={onLogout}
                isMobile
                onAfterClick={() => setOpen(false)}
              />
            </div>
            <button
              className="p-2 rounded hover:bg-primary/10"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6">
                <line
                  x1="4"
                  y1="4"
                  x2="16"
                  y2="16"
                  stroke="#5B8C51"
                  strokeWidth="2"
                />
                <line
                  x1="16"
                  y1="4"
                  x2="4"
                  y2="16"
                  stroke="#5B8C51"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          <NavbarLinks
            onNavigate={() => setOpen(false)}
            className="flex flex-col gap-6"
          />
        </div>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </nav>
  );
}
