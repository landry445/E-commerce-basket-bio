"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/Navbar";

export default function LoginPage() {
  const router = useRouter();

  // ⬇️ mêmes states que ton fichier initial
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ⬇️ même handleSubmit (mécanique inchangée)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { message?: string }).message || "Erreur inconnue");
      } else {
        // ⬇️ redirection identique à ton code
        router.push("/admin/reservations");
      }
    } catch {
      setError("Erreur réseau, veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4 py-10">
        <section className="w-full max-w-md">
          {/* Onglets visuels (login actif) */}
          <div className="flex">
            <div className="flex-1 rounded-t-xl bg-white/80 border border-black/10 border-b-0 px-6 py-3 text-center font-semibold text-[var(--color-dark)] shadow-sm">
              Se connecter
            </div>
            <Link
              href="/register"
              className="flex-1 rounded-t-xl bg-[var(--color-light)] border border-black/10 border-b-0 px-6 py-3 text-center font-semibold text-[var(--color-dark)] hover:bg-white/70 transition"
            >
              S’enregistrer
            </Link>
          </div>

          {/* Carte + formulaire (mécanique identique) */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8 flex flex-col gap-5"
          >
            {error && (
              <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm text-[var(--color-dark)] font-semibold"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm text-[var(--color-dark)] font-semibold"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[var(--color-accent)] cursor-pointer hover:brightness-105 text-white font-bold rounded-full py-2 mt-2 transition"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
