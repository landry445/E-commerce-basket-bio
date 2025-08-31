"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NavbarLinks from "./NavbarLinks";
import { useAuth } from "@/app/hooks/useAuth";
import NavbarUserButton from "./NavbarUserButton";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y <= 8);
      setHidden(y > lastY.current && y > 64);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrouillage scroll + focus
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.style.overflow = "hidden";
      firstFocusable.current?.focus();
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  // Échap pour fermer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleLogout(): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // silencieux
    } finally {
      setOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

  const headerClass = [
    "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
    hidden ? "-translate-y-full" : "translate-y-0",
    atTop
      ? "bg-[var(--background)]"
      : "bg-[var(--background)]/90 backdrop-blur-sm border-b border-black/5 shadow-sm",
  ].join(" ");

  const reserveHref = isAuthenticated ? "/reserver" : "/login";
  const panelWidthClass = "w-[40vw] max-w-[420px] min-w-[320px]";

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <Link href="/" aria-label="Aller à l’accueil" className="shrink-0">
            <Image
              src="/logo-frog.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            />
          </Link>

          <div className="hidden md:block">
            <NavbarLinks isAuthenticated={isAuthenticated} variant="desktop" />
          </div>

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

          <div className="hidden md:block">
            <NavbarUserButton
              user={
                user
                  ? { firstname: user.firstname, isAdmin: user.is_admin }
                  : undefined
              }
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Drawer mobile au-dessus du header (z-[60]) */}
      <div
        className={[
          "fixed inset-0 z-[60] md:hidden",
          open ? "" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Overlay à gauche */}
        <div
          onClick={() => setOpen(false)}
          className={[
            "absolute top-0 bottom-0 left-0 bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ right: "40vw" }}
        />

        {/* Panneau à droite plein écran vertical, démarre tout en haut */}
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
          {/* En-tête sticky avec bouton Fermer présent dès l’ouverture */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-black/5 bg-[var(--background)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full  text-white flex items-center justify-center font-bold">
                {(isAuthenticated ? user?.firstname?.[0] : "U")?.toUpperCase()}
              </div>
            </div>
            <button
              ref={firstFocusable}
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 text-[var(--color-primary)]"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  d="M6 6l12 12M18 6l-12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-24 pt-5 flex flex-col items-center">
            <nav className="flex flex-col gap-4 text-[var(--color-dark)] font-medium items-center">
              {isAuthenticated && (
                <div className="mt-6 flex flex-col gap-3">
                  <DrawerButtonLink
                    href="/mon-compte"
                    onClick={() => setOpen(false)}
                    label="Mon compte"
                  />
                  {user?.is_admin && (
                    <DrawerButtonLink
                      href="/admin/paniers"
                      onClick={() => setOpen(false)}
                      label="Espace admin"
                    />
                  )}
                </div>
              )}
              <Link
                href="/"
                aria-label="Aller à l’accueil"
                className="shrink-0"
              >
                <Image
                  src="/logo-frog.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                />
              </Link>
              <DrawerTextLink
                href="/"
                onClick={() => setOpen(false)}
                label="Accueil"
              />
              <DrawerTextLink
                href="/paniers"
                onClick={() => setOpen(false)}
                label="Nos paniers"
              />
              <DrawerTextLink
                href="/votre-maraicher"
                onClick={() => setOpen(false)}
                label="Votre maraîcher"
              />
            </nav>

            <div className="mt-6">
              <Link
                href={reserveHref}
                onClick={() => setOpen(false)}
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
                onClick={handleLogout}
                className="w-full h-11 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
              >
                Se déconnecter
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full h-11 text-center leading-[2.75rem] rounded-full border font-semibold hover:bg-black/5 transition"
              >
                Se connecter
              </Link>
            )}
          </div>
        </aside>
      </div>

      {/* Espace sous header fixe */}
      <div className="h-16 md:h-[68px]" />
    </>
  );
}

/* ---------- Liens du drawer ---------- */

function DrawerTextLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
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

function DrawerButtonLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
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
