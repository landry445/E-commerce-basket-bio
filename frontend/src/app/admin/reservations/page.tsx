import AdminReservationsTable from "../../components/adminReservation/AdminReservationsTable";
import type { AdminReservationRow } from "../../components/adminReservation/AdminReservationTypes";
import { headers } from "next/headers";

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

async function fetchRows(
  status: "active" | "archived"
): Promise<AdminReservationRow[]> {
  const baseUrl = await getBaseUrl();
  const cookie = (await headers()).get("cookie") ?? "";

  const res = await fetch(
    `${baseUrl}/api/admin/reservations?status=${status}`,
    {
      headers: { Cookie: cookie, Accept: "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error(
      "GET /api/admin/reservations a échoué :",
      `${res.status} ${res.statusText}`
    );
    return [];
  }
  return (await res.json()) as AdminReservationRow[];
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const tab = searchParams?.tab === "archives" ? "archived" : "active";
  const rows = await fetchRows(tab);

  async function onDelete(id: string) {
    "use server";
    const baseUrl = await getBaseUrl();
    const cookie = (await headers()).get("cookie") ?? "";
    await fetch(`${baseUrl}/api/admin/reservations?id=${id}`, {
      method: "DELETE",
      headers: { Cookie: cookie },
      cache: "no-store",
    });
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Réservations</h1>
        <nav className="flex gap-2">
          <a
            href="/admin/reservations?tab=actives"
            className={[
              "px-3 py-1.5 rounded-full border",
              tab === "active" ? "bg-black text-white" : "bg-white",
            ].join(" ")}
          >
            Actives
          </a>
          <a
            href="/admin/reservations?tab=archives"
            className={[
              "px-3 py-1.5 rounded-full border",
              tab === "archived" ? "bg-black text-white" : "bg-white",
            ].join(" ")}
          >
            Archives
          </a>
        </nav>
      </div>

      <AdminReservationsTable rows={rows} onDelete={onDelete} />
    </main>
  );
}
