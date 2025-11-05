"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/navbar/Navbar";

export default function VerificationErreurPage(): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function resend(): Promise<void> {
    setLoading(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="py-30 bg-[var(--color-light)] flex items-center justify-center px-4">
        <section className="w-full max-w-xl">
          <div className="text-center mb-6">
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Lien invalide ou expiré
            </h1>
            <p className="mt-2 text-gray-700">
              Un nouveau lien peut être envoyé.
            </p>
          </div>

          <div className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8">
            {!sent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void resend();
                }}
                className="space-y-4"
              >
                <label className="block text-sm text-gray-700 text-left">
                  Adresse e-mail utilisée lors de l’inscription
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton.email@exemple.com"
                  className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-primary)] text-white font-semibold rounded-full px-6 py-2 hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Envoi…" : "Recevoir un nouveau lien"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Si un compte correspond à cet e-mail, un message part dans
                  quelques instants.
                </p>
              </form>
            ) : (
              <p className="text-center text-gray-700">
                Si un compte correspond à cet e-mail, un nouveau lien vient
                d’être envoyé.
              </p>
            )}

            <div className="flex justify-center mt-6">
              <Image src="/logo-frog.png" alt="Logo" width={48} height={48} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
