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

function safeInternalNext(value: string | null): string {
  if (!value) return "/reserver";
  if (value.startsWith("/")) return value;
  return "/reserver";
}

function LoginPageInner(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();

  const nextParam = params.get("next");
  const nextPath = safeInternalNext(nextParam);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchMe(): Promise<MeResponse | null> {
    try {
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!meRes.ok) return null;

      const me: MeResponse = (await meRes.json()) as MeResponse;
      return me;
    } catch {
      return null;
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body: { message?: string } | null = await res
          .json()
          .catch(() => null);
        setError(body?.message ?? "Identifiants incorrects");
        setLoading(false);
        return;
      }

      const me = await fetchMe();
      if (!me) {
        setError("Session non disponible");
        setLoading(false);
        return;
      }

      if (me.is_admin) {
        const target =
          nextPath.startsWith("/admin/reservations") &&
          nextPath !== "/admin/reservations"
            ? nextPath
            : "/admin/reservations";
        router.replace(target);
        return;
      }

      const target = nextPath.startsWith("/admin") ? "/reserver" : nextPath;
      router.replace(target);
    } catch {
      setError("Serveur non joignable");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="px-4 py-50 flex flex-col items-center justify-center bg-light">
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
                onChange={(ev) => setEmail(ev.target.value)}
                autoComplete="email"
                className="w-full mt-1 rounded-full border border-gray-300 bg-white
                  px-4 py-2 text-dark placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-primary/30
                  focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                autoComplete="current-password"
                className="w-full mt-1 rounded-full border border-gray-300 bg-white
                  px-4 py-2 text-dark placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-primary/30
                  focus:border-primary"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-full shadow hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Nouveau client ?{" "}
            <a
              href="/register"
              className="text-accent font-medium hover:underline"
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

export default function LoginPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="px-4 py-50 flex flex-col items-center justify-center bg-light">
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
