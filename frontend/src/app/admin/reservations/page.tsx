"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmModal from "@/app/components/modal/ConfirmModal";
import AdminReservationsTable from "@/app/components/adminReservation/AdminReservationsTable";
import type { AdminReservationRow } from "@/app/components/adminReservation/AdminReservationTypes";

export const dynamic = "force-dynamic";

export default function AdminReservationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const status: "active" | "archived" =
    tabParam === "archives" ? "archived" : "active";

  // --- État local
  const [rows, setRows] = useState<AdminReservationRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // suppression simple via modal existante
  const [selected, setSelected] = useState<AdminReservationRow | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // --- Pagination locale
  const PAGE_SIZE = 50;
  const [page, setPage] = useState<number>(1);

  // --- Récupération liste
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations?status=${status}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        console.error(
          "GET /api/admin/reservations a échoué:",
          res.status,
          res.statusText
        );
        setRows([]);
        return;
      }
      const data: AdminReservationRow[] = await res.json();
      setRows(data);
      // retour première page lors d’un changement d’onglet
      setPage(1);
    } catch (e) {
      console.error("Erreur chargement réservations:", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  // --- Découpage sur 50
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const rowsPage = useMemo(
    () => rows.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE),
    [rows, pageSafe]
  );

  // --- Changement d’onglet
  const onTab = (next: "active" | "archived") => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("tab", next === "archived" ? "archives" : "actives");
    router.replace(`/admin/reservations?${q.toString()}`);
  };

  const title = useMemo(
    () =>
      status === "archived"
        ? "Réservations  Archives"
        : "Réservations  Actives",
    [status]
  );

  // --- Suppression (1 ligne)
  const requestDelete = (row: AdminReservationRow) => {
    setSelected(row);
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/admin/reservations?id=${selected.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok && res.status !== 204) {
        console.error("DELETE a échoué:", res.status, res.statusText);
      }
      setRows((prev) => prev.filter((r) => r.id !== selected.id));
    } catch (e) {
      console.error("Erreur suppression réservation:", e);
    } finally {
      setShowConfirm(false);
      setSelected(null);
    }
  };
  const cancelDelete = () => {
    setShowConfirm(false);
    setSelected(null);
  };

  // --- Suppression multiple (optimiste)
  const deleteMany = async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return;
    // appels parallèles ; l’API actuelle supprime déjà via ?id=...
    const calls = ids.map((id) =>
      fetch(`/api/admin/reservations?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
    );
    await Promise.allSettled(calls);
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-[var(--font-pacifico)]">{title}</h1>
        <nav className="flex gap-2">
          <button
            type="button"
            onClick={() => onTab("active")}
            className={[
              "px-3 py-1.5 rounded-full border cursor-pointer",
              status === "active"
                ? "bg-accent text-white font-bold"
                : "bg-white border-accent",
            ].join(" ")}
          >
            Actives
          </button>
          <button
            type="button"
            onClick={() => onTab("archived")}
            className={[
              "px-3 py-1.5 rounded-full border cursor-pointer",
              status === "archived"
                ? "bg-accent text-white font-bold"
                : "bg-white border-accent",
            ].join(" ")}
          >
            Archives
          </button>
        </nav>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <AdminReservationsTable
          rows={rowsPage}
          totalCount={total}
          page={pageSafe}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onDelete={async (id: string) => {
            const row = rows.find((r) => r.id === id);
            if (!row) return;
            requestDelete(row);
          }}
          onDeleteMany={deleteMany}
        />
      )}

      <ConfirmModal
        open={showConfirm}
        message="Supprimer cette réservation ?"
        subtext="Cette action est irréversible."
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
