"use client";

import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function normalizeOne(v: string | string[] | undefined): string | null {
  if (!v) return null;
  if (Array.isArray(v)) return v[0] ?? null;
  return v;
}

export default function RegisterSuccessPage({ searchParams }: Props) {
  const email = normalizeOne(searchParams?.email);

  const displayedEmail =
    email && email.trim().length > 0 ? email : "adresse inconnue";

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-light flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl text-center">
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Compte créé
          </h1>

          <p className="mt-3 text-gray-800">
            Bienvenue. Un e-mail de confirmation part sur{" "}
            <span className="font-semibold">{displayedEmail}</span>.
          </p>

          <div className="mt-8 bg-white rounded-2xl shadow-lg p-10">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl">
              ✓
            </div>

            <p className="mt-6 text-gray-800">
              Inscription validée. Un e-mail de confirmation vous est envoyé. Si
              vous ne le voyez pas, pensez à vérifier vos spams.
            </p>

            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-green-700 text-white font-bold shadow hover:brightness-105 transition"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
