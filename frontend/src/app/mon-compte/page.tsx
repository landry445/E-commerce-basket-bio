// app/mon-compte/page.tsx
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

type Me = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_admin: boolean;
  date_creation?: string;
};

type ReservationItem = {
  id: string;
  pickup_date: string; // YYYY-MM-DD
  statut: "active" | "archived";
  quantity: number;
  price_reservation: number; // en centimes
  basket_name?: string;
  location_name?: string;
  basket?: { name_basket: string };
  location?: { name_pickup: string };
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
export const dynamic = "force-dynamic";

function formatDateFR(d: string): string {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

async function fetchMe(cookieHeader: string): Promise<Me | null> {
  const r = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!r.ok) return null;
  return (await r.json()) as Me;
}

async function fetchMyReservations(
  cookieHeader: string
): Promise<ReservationItem[]> {
  const r = await fetch(`${API_BASE}/reservations/me`, {
    method: "GET",
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!r.ok) return [];
  return (await r.json()) as ReservationItem[];
}

export default async function AccountPage() {
  // On transmet uniquement le cookie jwt au backend
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const cookieHeader = jwt ? `jwt=${jwt}` : "";

  const [me, reservations] = await Promise.all([
    fetchMe(cookieHeader),
    fetchMyReservations(cookieHeader),
  ]);

  // Sécurité : si token invalide, affichage soft (le middleware bloque déjà l’accès direct)
  if (!me) {
    return (
      <main className="grid min-h-[calc(100svh-56px)] place-items-center bg-[var(--color-light)] px-4 py-10">
        <section className="w-full max-w-xl bg-white rounded-2xl border border-black/10 shadow-xl p-8 text-center">
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Session expirée
          </h1>
          <p className="text-gray-700">Merci de vous reconnecter.</p>
          <Link
            href="/login"
            className="inline-block mt-5 rounded-full bg-[var(--color-primary)] text-white px-5 py-2 hover:opacity-90 transition"
          >
            Aller à la connexion
          </Link>
        </section>
      </main>
    );
  }

  // Préparation des données de la table
  const rows = reservations.map((r) => ({
    id: r.id,
    date: formatDateFR(r.pickup_date),
    panier: r.basket?.name_basket ?? r.basket_name ?? "—",
    lieu: r.location?.name_pickup ?? r.location_name ?? "—",
    quantite: r.quantity,
    prix: eur.format(r.price_reservation / 100),
    statut: r.statut,
  }));

  const created = me.date_creation
    ? new Date(me.date_creation).toLocaleDateString("fr-FR")
    : "—";

  return (
    <main className="bg-[var(--color-light)] px-4 py-8">
      <section className="mx-auto max-w-5xl space-y-6">
        {/* En-tête chaleureux, cohérent login/register */}
        <div className="text-center">
          <h1
            className="text-3xl"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Mon compte
          </h1>
          <p className="mt-2 text-gray-700">
            Réservations, coordonnées, historique.
          </p>
        </div>

        {/* Carte infos client */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-full bg-[var(--color-yellow)]/60 w-14 h-14 grid place-items-center">
              <Image src="/logo-frog.png" alt="Logo" width={34} height={34} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-[var(--color-dark)]">
                {me.firstname} {me.lastname}
              </p>
              <p className="text-sm text-gray-600">
                Client depuis le {created}
              </p>
            </div>
            <Link
              href="/reserver"
              className="rounded-full bg-[var(--color-primary)] text-white px-4 py-2 shadow hover:opacity-90 transition"
            >
              Réserver un panier
            </Link>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-black/10 p-3">
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{me.email}</p>
            </div>
            <div className="rounded-xl border border-black/10 p-3">
              <p className="text-gray-500">Téléphone</p>
              <p className="font-medium">{me.phone}</p>
            </div>
          </div>

          <div className="mt-4 text-right">
            <Link
              href="/mon-compte/profil"
              className="text-[var(--color-accent)] font-medium hover:underline"
            >
              Mettre à jour mes informations
            </Link>
          </div>
        </div>

        {/* Historique / à venir */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mes réservations</h2>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 border border-emerald-200">
                • actives
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-1 border border-gray-200">
                • archivées
              </span>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="text-center text-gray-600">
              Aucune réservation pour le moment.
              <div className="mt-3">
                <Link
                  href="/reserver"
                  className="inline-block rounded-full bg-[var(--color-primary)] text-white px-4 py-2 hover:opacity-90 transition"
                >
                  Réserver maintenant
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Panier</th>
                    <th className="py-2 pr-3">Lieu</th>
                    <th className="py-2 pr-3">Qté</th>
                    <th className="py-2 pr-3">Prix</th>
                    <th className="py-2 pr-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="py-3 pr-3">{r.date}</td>
                      <td className="py-3 pr-3">{r.panier}</td>
                      <td className="py-3 pr-3">{r.lieu}</td>
                      <td className="py-3 pr-3">{r.quantite}</td>
                      <td className="py-3 pr-3">{r.prix}</td>
                      <td className="py-3 pr-3">
                        {r.statut === "active" ? (
                          <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200">
                            active
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 border border-gray-200">
                            archivée
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Aide / explications */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-gray-800">
          <p className="font-medium">Besoin d’aide ?</p>
          <ul className="mt-1 list-disc pl-5">
            <li>
              Annulation la veille avant 18h en répondant au mail de
              confirmation.
            </li>
            <li>Rappel automatique par email le jour du retrait.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
