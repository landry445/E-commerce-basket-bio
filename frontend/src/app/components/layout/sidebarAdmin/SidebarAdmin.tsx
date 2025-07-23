"use client";
import Image from "next/image";
import SidebarNavButton from "./SidebarNavButton";

type SidebarAdminProps = {
  userName?: string; // Prénom ou pseudo de l’admin
  activePage?: "commande" | "panier" | "utilisateur";
  onNavigate?: (section: string) => void;
};

export default function SidebarAdmin({
  userName = "Adri",
  activePage,
  onNavigate,
}: SidebarAdminProps) {
  return (
    <aside className="h-full w-56 flex flex-col items-center bg-yellow rounded-2xl py-6 px-4 shadow-sm select-none">
      {/* Titre */}
      <span className="font-sans text-lg font-bold text-dark mb-4 text-center">
        Palette
        <br />
        Administrateur
      </span>
      {/* Logo */}
      <Image
        src="/logo-frog.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto my-2"
      />
      {/* Bonjour */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-dark text-sm">Bonjour,</span>
        <span className="font-pacifico italic text-accent text-base">
          {userName}
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-4 w-full">
        <SidebarNavButton
          label="Commande"
          active={activePage === "commande"}
          onClick={() => onNavigate?.("commande")}
        />
        <SidebarNavButton
          label="Panier"
          active={activePage === "panier"}
          onClick={() => onNavigate?.("panier")}
        />
        <SidebarNavButton
          label="Utilisateur"
          active={activePage === "utilisateur"}
          onClick={() => onNavigate?.("utilisateur")}
        />
      </nav>
    </aside>
  );
}
