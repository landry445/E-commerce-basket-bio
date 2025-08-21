"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarLinks from "./NavbarLinks";
import NavbarUserButton from "./NavbarUserButton";

type NavbarProps = {
  user?: { firstname: string; isAdmin: boolean };
  onLogout?: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const onScrollOrResize = () => {
      const y = window.scrollY;
      const threshold = window.innerHeight * 0.5; // moitié exacte de l’écran

      setScrolled(y > 8);

      const goingDown = y > lastYRef.current + 2;
      const beyondThreshold = y > threshold;

      // Masquage seulement au-delà du seuil ET en défilement descendant
      setHidden(beyondThreshold && goingDown && !open);

      // Réapparition immédiate si on remonte ou si on repasse sous le seuil
      if (!goingDown || !beyondThreshold) setHidden(false);

      lastYRef.current = y;
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <>
      {/* Header fixe qui coulisse */}
      <nav
        className={[
          "fixed inset-x-0 top-0 z-50 transform transition-all duration-300 motion-reduce:transition-none",
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "bg-light/90 supports-[backdrop-filter]:backdrop-blur border-b border-black/5 shadow-sm"
            : "bg-light",
        ].join(" ")}
        aria-label="Barre de navigation principale"
      >
        <div className="flex items-center justify-between px-8 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Aller à l’accueil">
              <Image
                src="/logo-frog.png"
                alt="Logo frog"
                width={40}
                height={40}
              />
            </Link>
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
            className="flex md:hidden cursor-pointer p-2 rounded hover:bg-primary/10 transition"
            aria-label="Ouvrir le menu"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-8 h-8">
              <rect y="4" width="20" height="2" rx="1" fill="#5B8C51" />
              <rect y="9" width="20" height="2" rx="1" fill="#5B8C51" />
              <rect y="14" width="20" height="2" rx="1" fill="#5B8C51" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Espace réservé sous header fixe */}
      <div aria-hidden className="h-12 md:h-[56px]" />

      {/* Menu latéral mobile — un seul CTA sous l’icône login */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-light border-l z-[60] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 gap-6 pb-[env(safe-area-inset-bottom)]">
          {/* Icône / bouton utilisateur en premier */}
          <div className=" ml-20 mt-10">
            <NavbarUserButton
              user={user}
              onLogout={onLogout}
              isMobile
              onAfterClick={() => setOpen(false)}
            />
          </div>

          {/* Liens */}
          <NavbarLinks
            onNavigate={() => setOpen(false)}
            className="flex flex-col gap-6"
          />
          {/* Bouton fermer */}
          <button
            className="absolute top-3 right-3 p-2 rounded hover:bg-primary/10"
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
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-[55] md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Burger flottant visible quand le header est masqué */}
      {hidden && !open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="fixed md:hidden bottom-4 right-4 z-[65] w-12 h-12 rounded-full border border-dark/20 bg-light shadow-lg
                     hover:bg-primary hover:text-white transition"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 mx-auto"
          >
            <rect y="4" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="14" width="20" height="2" rx="1" />
          </svg>
        </button>
      )}
    </>
  );
}
