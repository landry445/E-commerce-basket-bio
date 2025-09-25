import AdminReservationsTable from "../../components/adminReservation/AdminReservationsTable";
import type { AdminReservationRow } from "../../components/adminReservation/AdminReservationTypes";
import { headers } from "next/headers";

// Réponse plate du DTO AdminReservationListDto
type ApiAdminRow = {
  id: string;
  client_name: string;
  basket_name: string;
  pickup_date: string; // 'YYYY-MM-DD'
  statut: "active" | "archived";
  quantity: number;
};

async function fetchRows(): Promise<AdminReservationRow[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const cookie = (await headers()).get("cookie") ?? "";

  const res = await fetch(`${base}/reservations/admin-list`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "GET /reservations/admin-list a échoué :",
      `${res.status} ${res.statusText}`
    );
    return [];
  }

  const data = (await res.json()) as ApiAdminRow[];

  // Pas de mapping compliqué : les noms correspondent déjà au tableau
  return data;
}

export default async function Page() {
  const rows = await fetchRows();

  async function onDelete(id: string) {
    "use server";
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
    const cookie = (await headers()).get("cookie") ?? "";

    await fetch(`${base}/reservations/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookie },
      cache: "no-store",
    });
  }

  return <AdminReservationsTable rows={rows} onDelete={onDelete} />;
}
