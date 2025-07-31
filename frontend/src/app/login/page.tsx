"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/navbar/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mauvais (demande au frontend Next.js, 404 logique)
      // const res = await fetch("/auth/login", { ... });

      // Bon (demande directe au backend NestJS)
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Erreur inconnue");
      } else {
        // Connexion réussie, redirige l'admin (ou client) vers la bonne page
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl px-8 py-10 w-full max-w-sm flex flex-col gap-5"
        >
          <h1 className="text-2xl font-bold text-dark text-center mb-2">
            Connexion
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-dark font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border rounded-full px-4 py-2 focus:outline-accent"
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
              className="text-sm text-dark font-semibold"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="border rounded-full px-4 py-2 focus:outline-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-accent cursor-pointer hover:brightness-105 text-white font-bold rounded-full py-2 mt-3 transition"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </>
  );
}
