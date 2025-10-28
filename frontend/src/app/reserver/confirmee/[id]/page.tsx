import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "@/app/components/navbar/Navbar";

type LineItem = { name: string; qty: number; price: number };
type ReservationView = {
  id: string;
  pickup_label: string; // ex. "2025-10-28 • Gare"
  items: LineItem[];
  total: number;
};

type ParamsPromise = Promise<{ id: string }>;

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export default async function Page({ params }: { params: ParamsPromise }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieStr = cookieStore.toString();

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const res = await fetch(`${base}/reservations/view/${id}`, {
    cache: "no-store",
    headers: { Cookie: cookieStr },
  });

  if (!res.ok) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1
            className="text-center text-[2rem] leading-none"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Réservation
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Page inaccessible.
          </p>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-8 shadow-xl">
            <p className="text-center text-sm text-neutral-700">
              Connexion requise ou référence introuvable.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Link
                href="/login"
                className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm text-white"
              >
                Se connecter
              </Link>
              <Link
                href="/reserver"
                className="rounded-full border px-5 py-2 text-sm hover:bg-neutral-50"
              >
                Retour
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const r = (await res.json()) as ReservationView;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        {/* Titre + sous-titre centrés, comme "Compte créé" */}
        <h1
          className="text-center text-[2rem] leading-none"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Réservation confirmée
        </h1>

        {/* Carte centrale */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-8 shadow-xl">
          {/* Pastille check */}
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M9.55 17.4 5.1 13l1.4-1.4 3.05 3.05 7-7L18.9 9z"
              />
            </svg>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-700">
            Reservation validée. Un e-mail récapitulatif vous est envoyé.
          </p>

          {/* Récap lignes dans la carte */}
          <div className="mt-6 rounded-xl border">
            <div className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-neutral-600">Retrait</span>
              <span className="font-medium">{r.pickup_label}</span>
            </div>

            <div className="border-t px-5 py-1">
              <ul className="divide-y">
                {r.items.map((it) => (
                  <li
                    key={`${it.name}-${it.qty}`}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span>
                      {it.name} × {it.qty}
                    </span>
                    <span className="tabular-nums">{eur.format(it.price)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t px-5 py-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total à régler sur place</span>
                <span className="tabular-nums">{eur.format(r.total)}</span>
              </div>
            </div>
          </div>

          {/* Bouton principal + actions secondaires */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/mon-compte"
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:brightness-95"
            >
              Mes réservations
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
