// frontend/src/app/reserver/confirmee/[groupId]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

interface ConfirmReservationItem {
  basketId: string;
  basketName: string;
  unitPriceCents: number;
  quantity: number;
  subtotalCents: number;
}

interface ConfirmReservationDto {
  groupId: string;
  pickupDateISO: string; // ex: "2025-11-07T00:00:00.000+01:00"
  pickupLocationName: string; // ex: "Gare"
  totalCents: number;
  items: ConfirmReservationItem[];
}

function formatEUR(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
function ymd(iso: string): string {
  // attente d’un ISO valide côté API
  return iso.slice(0, 10);
}

export default async function Page(props: { params: { groupId: string } }) {
  const { groupId } = props.params;

  const cookieStore = await cookies();
  const cookieStr = cookieStore.toString();

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

  const res = await fetch(`${base}/reservations/confirm/${groupId}`, {
    cache: "no-store",
    headers: { Cookie: cookieStr },
  });

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border bg-white p-8">
          <h1 className="text-xl font-semibold">Erreur</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Impossible d’afficher la réservation. Un nouvel essai depuis
            <span> </span>
            <Link href="/mon-compte" className="underline">
              Mon compte
            </Link>
            <span> </span>
            peut résoudre le problème.
          </p>
        </div>
      </main>
    );
  }

  const data: ConfirmReservationDto = await res.json();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1
        className="text-center text-[2rem] leading-none"
        style={{ fontFamily: "var(--font-pacifico)" }}
      >
        Réservation confirmée
      </h1>

      <p className="mt-4 text-center text-sm text-neutral-700">
        Un e-mail récapitulatif est envoyé.
      </p>

      <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-neutral-600">Lieu et date de retrait :</span>
          <span className="font-medium">
            Gare de Savenay • {ymd(data.pickupDateISO)}
          </span>
        </div>

        {/* Lignes */}
        <div className="mt-3 divide-y rounded-xl border">
          <div className="hidden" aria-hidden />{" "}
          {/* pour le premier border-top */}
          {data.items.map((it) => (
            <div
              key={it.basketId}
              className="flex items-center justify-between px-5 py-3 text-sm"
            >
              <span>
                {it.basketName} × {it.quantity}
              </span>
              <span className="tabular-nums">
                {formatEUR(it.subtotalCents)}
              </span>
            </div>
          ))}
          {/* Total */}
          <div className="flex items-center justify-between px-5 py-3 text-sm font-semibold">
            <span>Total à régler sur place</span>
            <span className="tabular-nums">{formatEUR(data.totalCents)}</span>
          </div>
        </div>

        {/* Actions */}
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
  );
}
