"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
        <Image src="/logo-frog.png" alt="Logo frog" width={90} height={90} />
      </div>
      {/* Liens */}
      <ul className="flex gap-8 font-sans text-[1rem] font-semibold text-dark">
        <li>
          <Link href="/" className="hover:underline">
            Accueil
          </Link>
        </li>
        <li>
          <Link href="/paniers" className="hover:underline">
            Nos paniers
          </Link>
        </li>
        <li>
          <Link href="/maraicher" className="hover:underline">
            Votre maraîcher
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
      {/* Bouton utilisateur desktop */}
      <div className="hidden md:flex items-center">
        {user ? (
          <button
            onClick={onLogout}
            className="ml-4 px-3 py-1 rounded bg-primary hover:brightness-95 text-white text-sm"
          >
            Déconnexion
          </button>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-dark text-dark hover:bg-primary hover:text-white transition"
            aria-label="Connexion"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a8 8 0 1116 0H4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
      {/* Bouton burger (mobile uniquement) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex md:hidden p-2 rounded hover:bg-primary/10 transition"
        aria-label="Ouvrir le menu"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-7 h-7 text-dark"
        >
          <path d="M3 6h14M3 10h14M3 14h14" />
        </svg>
      </button>
      {/* Menu mobile déroulant */}
      {open && (
        <div className="absolute left-0 top-full w-full bg-light shadow-md border-b md:hidden z-40">
          <ul className="flex flex-col items-center gap-3 py-4 font-sans font-semibold text-dark">
            <li>
              <Link href="/" onClick={() => setOpen(false)}>
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/paniers" onClick={() => setOpen(false)}>
                Nos paniers
              </Link>
            </li>
            <li>
              <Link href="/maraicher" onClick={() => setOpen(false)}>
                Votre maraîcher
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="mt-2">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="px-3 py-1 rounded bg-primary hover:brightness-95 text-white text-sm"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-dark text-dark hover:bg-primary hover:text-white transition"
                  aria-label="Connexion"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a8 8 0 1116 0H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
