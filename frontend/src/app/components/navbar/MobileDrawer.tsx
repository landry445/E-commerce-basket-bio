"use client";

import Link from "next/link";
import Image from "next/image";
import { RefObject } from "react";
import DrawerHeader from "./DrawerHeader";
import { DrawerTextLink, DrawerButtonLink } from "./DrawerLinks";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  firstFocusableRef: RefObject<HTMLButtonElement | null>;
  isAuthenticated: boolean;
  user?: AuthUser;
  reserveHref: string;
  onLogout: () => void;
};

type AuthUser = {
  firstname: string;
  is_admin: boolean;
};

const panelWidthClass = "w-[40vw] max-w-[420px] min-w-[320px]";

export default function MobileDrawer({
  open,
  onClose,
  firstFocusableRef,
  isAuthenticated,
  user,
  reserveHref,
  onLogout,
}: MobileDrawerProps) {
  return (
    <div
      className={[
        "fixed inset-0 z-[60] md:hidden",
        open ? "" : "pointer-events-none",
      ].join(" ")}
    >
      {/* Overlay à gauche */}
      <div
        onClick={onClose}
        className={[
          "absolute top-0 bottom-0 left-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ right: "40vw" }}
      />

      {/* Panneau à droite, plein écran vertical */}
      <aside
        aria-label="Menu principal"
        role="dialog"
        aria-modal="true"
        className={[
          "absolute top-0 right-0 h-full",
          panelWidthClass,
          "bg-[var(--background)] shadow-2xl ring-1 ring-black/10",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
      >
        <DrawerHeader
          firstFocusableRef={firstFocusableRef}
          initial={isAuthenticated ? user?.firstname?.[0] ?? "U" : "U"}
          onClose={onClose}
        />

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 pt-5 flex flex-col items-center">
          <nav className="flex flex-col gap-4 text-[var(--color-dark)] font-medium items-center">
            {isAuthenticated && (
              <div className="mt-2 mb-2 flex flex-col gap-3 w-full">
                <DrawerButtonLink
                  href="/mon-compte"
                  label="Mon compte"
                  onClick={onClose}
                />
                {user?.is_admin && (
                  <DrawerButtonLink
                    href="/admin/paniers"
                    label="Espace admin"
                    onClick={onClose}
                  />
                )}
              </div>
            )}

            <Link href="/" aria-label="Aller à l’accueil" className="shrink-0">
              <Image
                src="/logo-frog.png"
                alt="Logo"
                width={100}
                height={100}
                priority
              />
            </Link>

            <DrawerTextLink href="/" label="Accueil" onClick={onClose} />
            <DrawerTextLink
              href="/paniers"
              label="Nos paniers"
              onClick={onClose}
            />
            <DrawerTextLink
              href="/votre-maraicher"
              label="Votre maraîcher"
              onClick={onClose}
            />
          </nav>

          <div className="mt-6">
            <Link
              href={reserveHref}
              onClick={onClose}
              className={[
                "inline-flex items-center justify-center",
                "rounded-full px-5 h-11 font-semibold",
                "bg-[var(--color-yellow)] text-[var(--color-dark)] ring-1 ring-black/10 shadow-sm",
                "hover:bg-[var(--color-primary)] hover:text-white transition-all",
              ].join(" ")}
            >
              Réservez
              <svg
                className="ml-2"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                aria-hidden
                fill="currentColor"
              >
                <path d="M7 4l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Action bas de panneau */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-black/5 bg-[var(--background)]">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              className="w-full h-11 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
            >
              Se déconnecter
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full h-11 text-center leading-[2.75rem] rounded-full border font-semibold hover:bg-black/5 transition"
            >
              Se connecter
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
