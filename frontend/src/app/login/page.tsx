"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/navbar/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/reserver";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!cancelled && res.ok) {
          // déjà connecté → vers la page de réservation (ou params ?next=…)
          router.replace(next);
        }
      } catch {
        // silence UI
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message ?? "Identifiants incorrects");
        setLoading(false);
        return;
      }

      router.replace(next);
    } catch {
      setError("Impossible de contacter le serveur");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="px-4 py-50 flex flex-col items-center justify-center bg-[var(--color-light)]">
        {/* Bannière UX */}
        <div className="max-w-md w-full text-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Connexion requise
          </h1>
          <p className="mt-2 text-gray-700">
            Connectez-vous pour réserver votre panier bio et suivre vos
            retraits.
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo-frog.png" alt="Logo" width={60} height={60} />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full mt-1 rounded-full border border-gray-300 bg-white
             px-4 py-2 text-[var(--color-dark)] placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30
             focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full mt-1 rounded-full border border-gray-300 bg-white
             px-4 py-2 text-[var(--color-dark)] placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30
             focus:border-[var(--color-primary)]"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-2 rounded-full shadow hover:opacity-90 transition"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Nouveau client ?{" "}
            <a
              href="/register"
              className="text-[var(--color-accent)] font-medium hover:underline"
            >
              Créez un compte
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
