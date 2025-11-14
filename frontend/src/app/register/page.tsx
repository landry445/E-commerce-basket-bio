"use client";

import { useState, FormEvent } from "react";
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
};
type ApiMsg = { message?: string };

export default function RegisterPage() {
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full mt-1 rounded-full border border-gray-300 bg-white px-4 py-2 " +
    "text-[var(--color-dark)] placeholder-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 " +
    "focus:border-[var(--color-primary)]";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // simple garde-fou pour le numéro FR (optionnel, serveur fait foi)
    if (!/^0[1-9]\d{8}$/.test(phone)) {
      setError("Format de téléphone invalide (ex. 06XXXXXXXX).");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        firstname,
        lastname,
        email,
        phone,
        password,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json().catch(() => ({}))) as ApiMsg;

      if (!res.ok) {
        setError(data.message || "Inscription impossible.");
      } else {
        router.push(
          `/register/success?email=${encodeURIComponent(
            email
          )}&next=${encodeURIComponent(next)}`
        );
      }
    } catch {
      setError("Erreur réseau, réessayer.");
    }
    setLoading(false);
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
                src="/logo-jardins-des-rainettes.jpeg"
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
                    8 caractères min. Conseillé : chiffres + lettres.
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
