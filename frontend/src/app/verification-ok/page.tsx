"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/navbar/Navbar";
import { useSearchParams } from "next/navigation";

export default function VerificationOkPage(): React.ReactElement {
  const sp = useSearchParams();

  // Valeur "next" éventuelle depuis l'URL
  const candidate = sp.get("next") ?? "/login";

  // Garde anti open-redirect : uniquement un chemin interne commençant par "/"
  const safeNext = candidate.startsWith("/") ? candidate : "/login";

  // Lien de connexion : conserve ?next=... si pertinent
  const loginHref =
    safeNext === "/login"
      ? "/login"
      : `/login?next=${encodeURIComponent(safeNext)}`;

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
              E-mail vérifié
            </h1>
            <p className="mt-2 text-gray-700">
              Ton adresse e-mail est confirmée. Tu peux te connecter.
            </p>
          </div>

          <div className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8">
            <div className="flex justify-center mb-4">
              <div
                aria-hidden
                className="h-16 w-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                  <path
                    d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <p className="text-center text-gray-700">
              Connexion possible dès maintenant.
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href={loginHref}
                className="text-center bg-[var(--color-primary)] text-white font-semibold rounded-full px-6 py-2 hover:opacity-90 transition"
              >
                Se connecter
              </Link>
            </div>

            <div className="flex justify-center mt-6">
              <Image
                src="/logo-jardins-des-rainettes.jpeg"
                alt="Logo"
                width={48}
                height={48}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
