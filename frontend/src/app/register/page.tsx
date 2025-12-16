"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/navbar/Navbar";

type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  newsletterOptIn: boolean;
};

type ApiMsg = { message?: string };

function RegisterPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  // permet de revenir directement là où l’utilisateur allait (ex: /reserver)
  const next = params.get("next") ?? "/reserver";

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full mt-1 rounded-full border border-gray-300 bg-white px-4 py-2 " +
    "text-[var(--color-dark)] placeholder-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 " +
    "focus:border-[var(--color-primary)]";

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, password, phone }),
    });

    if (!res.ok) {
      const text = await res.text();
      setError(text || "Inscription impossible");
      return;
    }

    const target = `/register/success?email=${encodeURIComponent(email)}`;
    router.replace(target);
  } catch {
    setError("Serveur injoignable");
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <Navbar />

      <main className="py-30 bg-[var(--color-light)] flex items-center justify-center px-4">
        <section className="w-full max-w-xl">
          {/* Bandeau UX commun à la page login */}
          <div className="text-center mb-6">
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Créer un compte
            </h1>
            <p className="mt-2 text-gray-700">
              Un compte permet de réserver vos paniers et de suivre vos
              retraits.
            </p>
          </div>
          {/* Carte + formulaire */}
          <div className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-frog-jdr.png"
                alt="Logo"
                width={70}
                height={100}
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="text-sm font-semibold">
                    Prénom
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    className={inputClass}
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="text-sm font-semibold">
                    Nom
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    className={inputClass}
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-semibold">
                  Téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Utilisé pour les rappels de retrait (jamais partagé).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="text-sm font-semibold">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    8 caractères min. avec une majuscule, une minuscule, un
                    chiffre et un caractère spécial.
                  </p>
                </div>
                <div>
                  <label htmlFor="confirm" className="text-sm font-semibold">
                    Confirmer
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    className={inputClass}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-4 rounded-2xl border border-yellow-300 bg-yellow-50/80 px-4 py-4 shadow-md sm:px-5 sm:py-5">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Newsletter des paniers
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    2 e-mails par semaine
                  </span>
                </div>

                <p className="text-xs text-gray-700 sm:text-sm">
                  Composition détaillée du panier du mardi et du panier du
                  vendredi.
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Aucun autre contenu, aucune publicité.
                </p>

                <label className="mt-3 flex items-start gap-2 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(event) =>
                      setNewsletterOptIn(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 accent-[var(--color-primary)] shadow-sm"
                  />
                  <span>
                    Recevoir par e-mail la composition des paniers du mardi et
                    du vendredi.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold rounded-full py-2 mt-2 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Création en cours..." : "S’enregistrer"}
              </button>

              <p className="text-center text-sm text-gray-700">
                Déjà inscrit ?{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(next)}`}
                  className="text-[var(--color-accent)] font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="py-30 bg-[var(--color-light)] flex items-center justify-center px-4">
            <p className="text-gray-700">
              Chargement de la page d’inscription...
            </p>
          </main>
        </>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
