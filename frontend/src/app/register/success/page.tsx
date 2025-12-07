import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/navbar/Navbar";

type Search = {
  email?: string;
  next?: string;
};

function maskEmail(e?: string): string {
  if (!e || !e.includes("@")) return "adresse inconnue";
  const [local, domain] = e.split("@");
  if (local.length <= 2) return `*@${domain}`;
  return `${local[0]}***${local.slice(-1)}@${domain}`;
}

export default function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const email = searchParams.email ?? "";
  const next = searchParams.next ?? "/reserver";
  const masked = maskEmail(email);

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
              Compte créé
            </h1>
            <p className="mt-2 text-gray-700">
              Bienvenue. Un e-mail de confirmation part sur{" "}
              <strong>{masked}</strong>.
            </p>
          </div>

          <div className="bg-white rounded-b-xl border border-black/10 shadow-xl px-8 py-8">
            <div className="flex justify-center mb-4">
              <div
                aria-hidden
                className="h-16 w-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center"
              >
                {/* Check icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <p className="text-center text-gray-700">
              Inscription validée. Un e-mail de confirmation vous est envoyé.
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="text-center p-10 bg-[var(--color-primary)] text-white font-semibold rounded-full py-2 hover:opacity-90 transition"
              >
                Se connecter
              </Link>
            </div>

            <div className="flex justify-center mt-6">
              <Image
                src="/logo-frog-jdr.png"
                alt="Logo"
                width={80}
                height={110}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
