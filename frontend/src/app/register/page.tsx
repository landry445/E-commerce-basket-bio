"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
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

      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as ApiMsg;

      if (!res.ok) {
        setError(data.message || "Inscription impossible.");
      } else {
        // redirection simple (n’affecte pas la mécanique du login)
        router.push("/login");
      }
    } catch {
      setError("Erreur réseau, réessayer.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4 py-10">
        <section className="w-full max-w-md">
          {/* Onglets visuels (register actif) */}
          <div className="flex">
            <Link
              href="/login"
              className="flex-1 rounded-t-xl bg-[var(--color-light)] border border-black/10 border-b-0 px-6 py-3 text-center font-semibold text-[var(--color-dark)] hover:bg-white/70 transition"
            >
              Se connecter
            </Link>
            <div className="flex-1 rounded-t-xl bg-white/80 border border-black/10 border-b-0 px-6 py-3 text-center font-semibold text-[var(--color-dark)] shadow-sm">
              S’enregistrer
            </div>
          </div>

          {/* Carte + formulaire */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8 flex flex-col gap-5"
          >
            {error && (
              <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstname"
                  className="text-sm font-semibold text-[var(--color-dark)]"
                >
                  Prénom
                </label>
                <input
                  id="firstname"
                  type="text"
                  className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastname"
                  className="text-sm font-semibold text-[var(--color-dark)]"
                >
                  Nom
                </label>
                <input
                  id="lastname"
                  type="text"
                  className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[var(--color-dark)]"
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
                htmlFor="phone"
                className="text-sm font-semibold text-[var(--color-dark)]"
              >
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06XXXXXXXX"
                autoComplete="tel"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[var(--color-dark)]"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirm"
                  className="text-sm font-semibold text-[var(--color-dark)]"
                >
                  Confirmer
                </label>
                <input
                  id="confirm"
                  type="password"
                  className="border border-black/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[var(--color-accent)] cursor-pointer hover:brightness-105 text-white font-bold rounded-full py-2 mt-2 transition"
              disabled={loading}
            >
              {loading ? "Création en cours..." : "S’enregistrer"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
