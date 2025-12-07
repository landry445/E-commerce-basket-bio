"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, Suspense } from "react";
import Image from "next/image";
import Footer from "../components/footer";
import Navbar from "../components/navbar/Navbar";

type MeResponse = {
  id: string;
  email: string;
  is_admin: boolean;
};

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  // Si aucun "next" n'est fourni, cible par défaut = page réserver
  const next = params.get("next") ?? "/reserver";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchMe(): Promise<MeResponse | null> {
    try {
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
        { credentials: "include" }
      );
      if (!meRes.ok) return null;
      const me: MeResponse = await meRes.json();
      return me;
    } catch {
      return null;
    }
  }

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

      // À ce stade, le cookie httpOnly est posé par le backend.
      const me = await fetchMe();

      if (me?.is_admin) {
        // Admin: priorité à l’admin. Si un "next" admin est présent, on le respecte.
        const target =
          next.startsWith("/admin/reservations") &&
          next !== "/admin/reservations"
            ? next
            : "/admin/reservations";
        router.replace(target);
      } else {
        // Client: jamais redirigé vers l’admin, même si "next" pointe vers /admin
        const target = next.startsWith("/admin") ? "/reserver" : next;
        router.replace(target);
      }
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
            <Image src="/logo-frog-jdr.png" alt="Logo" width={80} height={48} />
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

// Composant de page exporté, avec Suspense autour de l’usage de useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="px-4 py-50 flex flex-col items-center justify-center bg-[var(--color-light)]">
            <p className="text-gray-700">
              Chargement de la page de connexion...
            </p>
          </main>
          <Footer />
        </>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
