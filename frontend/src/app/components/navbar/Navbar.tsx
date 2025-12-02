"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import DesktopBar from "./DesktopBar";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const firstFocusable = useRef<HTMLButtonElement | null>(null);

  // Header masqué au scroll
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

  // Verrouillage du scroll + focus initial
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

  // Fermeture via Échap
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

  return (
    <>
      <DesktopBar
        className={headerClass}
        isAuthenticated={isAuthenticated}
        user={user ?? undefined}
        onMenuOpen={() => setOpen(true)}
        onLogout={handleLogout}
      />

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        firstFocusableRef={firstFocusable}
        isAuthenticated={isAuthenticated}
        user={user ?? undefined}
        reserveHref={reserveHref}
        onLogout={handleLogout}
      />

      {/* Espace sous header fixe */}
      <div className="h-16 md:h-[68px]" />
    </>
  );
}
