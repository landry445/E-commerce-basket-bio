"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";

type UserMe = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

type ReservationItem = {
  id: string;
  basketName: string;
  pickupLocation: string;
  pickupDate: string; // YYYY-MM-DD
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<UserMe | null>(null);
  const [reservations, setReservations] = useState<ReservationItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/users/me`, { credentials: "include" }),
          fetch(`${API_BASE}/reservations/me?scope=past`, {
            credentials: "include",
          }),
        ]);

        if (uRes.status === 401 || rRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (!uRes.ok || !rRes.ok) {
          throw new Error("Erreur de chargement");
        }

        const [uJson, rJson] = await Promise.all([uRes.json(), rRes.json()]);
        if (!cancelled) {
          setMe(uJson as UserMe);
          setReservations(rJson as ReservationItem[]);
        }
      } catch {
        // Option douce : retour page login en cas d’échec auth
        router.replace("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans min-h-screen">
        <section className="container mx-auto px-4 py-8 max-w-5xl">
          <h1
            className="text-3xl md:text-4xl mb-6"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Mon compte
          </h1>

          {/* État de chargement */}
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-white rounded-2xl shadow" />
              <div className="h-40 bg-white rounded-2xl shadow" />
            </div>
          )}

          {/* Bloc Infos client */}
          {!loading && me && (
            <div className="bg-white rounded-2xl shadow p-5 mb-8">
              <h2
                className="text-xl mb-4"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Mes informations
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <InfoRow label="Nom">{me.lastname}</InfoRow>
                <InfoRow label="Prénom">{me.firstname}</InfoRow>
                <InfoRow label="Email">{me.email}</InfoRow>
                <InfoRow label="Téléphone">{me.phone}</InfoRow>
              </div>
            </div>
          )}

          {/* Historique des réservations */}
          {!loading && reservations && (
            <div className="bg-white rounded-2xl shadow p-5">
              <h2
                className="text-xl mb-4"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Mes réservations passées
              </h2>

              {reservations.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Aucune réservation passée.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Panier</th>
                        <th className="py-2 pr-4">Lieu de retrait</th>
                        <th className="py-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                          <td className="py-3 pr-4">
                            {new Date(r.pickupDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 pr-4">{r.basketName}</td>
                          <td className="py-3 pr-4">{r.pickupLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

// function StatusPill({
//   status,
// }: {
//   status: "completed" | "no_show" | "cancelled";
// }) {
//   const labelMap: Record<typeof status, string> = {
//     completed: "Retiré",
//     no_show: "Non venu",
//     cancelled: "Annulé",
//   };
//   const colorMap: Record<typeof status, string> = {
//     completed: "bg-green-100 text-green-800",
//     no_show: "bg-yellow-100 text-yellow-800",
//     cancelled: "bg-red-100 text-red-800",
//   };
//   return (
//     <span className={`px-2 py-1 rounded-full text-xs ${colorMap[status]}`}>
//       {labelMap[status]}
//     </span>
//   );
// }
