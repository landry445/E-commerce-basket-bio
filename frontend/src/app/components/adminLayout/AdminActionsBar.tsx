"use client";

import { useRouter } from "next/navigation";

export default function AdminActionsBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.replace("/login"); // remplace l’entrée dans l’historique
        router.refresh(); // invalide le rendu courant
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error("Impossible de contacter le serveur", err);
    }
  };

  return (
    <div className="flex justify-end items-center gap-3 p-5">
      <button
        className="px-3 py-1 cursor-pointer rounded-full border border-[var(--color-dark)] bg-white font-sans text-[var(--color-dark)] text-xs shadow-sm hover:bg-gray-100 transition"
        style={{ minWidth: 92 }}
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
      <a
        href="/"
        className="px-3 py-1 rounded-full border border-[var(--color-dark)] bg-white font-sans text-[var(--color-dark)] text-xs shadow-sm hover:bg-gray-100 transition"
        target="_blank"
        rel="noopener noreferrer"
        style={{ minWidth: 82 }}
      >
        Voir le site
      </a>
    </div>
  );
}
