"use client";

import { useMemo, useState } from "react";
import type { AdminReservationRow } from "./AdminReservationTypes.ts";

type Props = {
  rows: AdminReservationRow[];
  onDelete: (id: string) => Promise<void>;
  // pagination
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  // suppression multiple
  onDeleteMany: (ids: string[]) => Promise<void>;
};

export default function AdminReservationsTable({
  rows,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onDeleteMany,
}: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const allChecked = useMemo(
    () => rows.length > 0 && rows.every((r) => selected[r.id]),
    [rows, selected]
  );

  function toggleAll(): void {
    const next: Record<string, boolean> = {};
    if (!allChecked) rows.forEach((r) => (next[r.id] = true));
    setSelected(next);
  }
  function toggleOne(id: string): void {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const selectedIds = useMemo(
    () => rows.filter((r) => selected[r.id]).map((r) => r.id),
    [rows, selected]
  );
  const selectedCount = selectedIds.length;

  // export PDF inchangé
  type RowExport = {
    client: string;
    basket: string;
    date: string;
    quantity: string;
    message: string;
  };

  async function exportSelectedPdf(): Promise<void> {
    const [jsPDFModule, autoTable] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const jsPDF = jsPDFModule.default;

    // paysage = plus proche d’un tableau large (changer en portrait si besoin)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const picked = rows.filter((r) => selected[r.id]);
    const data: RowExport[] = picked.map((r) => ({
      client: r.client_name,
      quantity: `x${r.quantity}`,
      basket: r.basket_name,
      message:
        r.customer_note && r.customer_note.trim().length > 0
          ? r.customer_note
          : "—",
      date: r.pickup_date,
    }));

    // Titre
    doc.setProperties({ title: "Réservations paniers" });
    doc.setFontSize(18);
    doc.text(`Réservations (${data.length})`, 40, 42);

    // Couleurs proches de l’UI (jaune d’en-tête, gris de bordure)
    const headerYellow: [number, number, number] = [245, 229, 105];
    const borderGray: [number, number, number] = [210, 210, 210];

    autoTable.default(doc, {
      // colonnes dans le même ordre que le tableau admin
      head: [["Client", "Quantité", "Panier", "Message", "Date"]],
      body: data.map((r) => [
        r.client,
        r.quantity,
        r.basket,
        r.message,
        r.date,
      ]),

      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 6,
        overflow: "linebreak", // messages sur plusieurs lignes
        lineColor: borderGray,
        lineWidth: 0.5,
        valign: "top", // alignement haut comme dans l’UI
      },
      headStyles: {
        fillColor: headerYellow,
        textColor: [0, 0, 0],
        halign: "left",
        lineColor: borderGray,
        lineWidth: 0.5,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [30, 30, 30],
      },

      // Largeurs proportionnelles (proches de : 22% / 10% / 18% / 30% / 10%)
      // L’unité est en points ; sur A4 paysage ~ 842pt de large hors marges
      tableWidth: "auto",
      margin: { left: 40, right: 40 },
      columnStyles: {
        0: { cellWidth: 0.22 * 762 }, // Client
        1: { cellWidth: 0.1 * 762, halign: "center" }, // Quantité
        2: { cellWidth: 0.18 * 762 }, // Panier
        3: { cellWidth: 0.3 * 762 }, // Message (wrap)
        4: { cellWidth: 0.1 * 762 }, // Date
      },

      // Numéro de page en pied
      didDrawPage: (dataCtx) => {
        const pageN = dataCtx.pageNumber;
        doc.setFontSize(9);
        doc.text(
          `Page ${pageN}`,
          doc.internal.pageSize.getWidth() - 60,
          doc.internal.pageSize.getHeight() - 20
        );

        // Légère ligne top du tableau pour coller au style
        if (dataCtx.pageNumber === 1) return;
      },
    });

    doc.save("reservations-selection.pdf");
  }

  // Pagination calculs
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  async function handleDeleteMany(): Promise<void> {
    await onDeleteMany(selectedIds);
    setSelected({});
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-gray-600">
          {totalCount} ligne{totalCount > 1 ? "s" : ""}
          {selectedCount > 0
            ? ` • ${selectedCount} sélectionnée${selectedCount > 1 ? "s" : ""}`
            : ""}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDeleteMany}
            disabled={selectedCount === 0}
            className="cursor-pointer px-4 py-2 rounded-full border border-red-600 text-red-600
                       hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Supprimer sélection
          </button>

          <button
            type="button"
            onClick={exportSelectedPdf}
            disabled={selectedCount === 0}
            className="cursor-pointer px-4 py-2 rounded-full bg-accent text-white font-bold shadow
                       disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
          >
            Exporter PDF (sélection)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        {/* table-fixed + layout stable */}
        <table className="w-full table-fixed text-sm">
          <thead className="bg-yellow text-dark">
            <tr>
              <th className="py-2 px-4 w-10">
                <input
                  type="checkbox"
                  aria-label="Tout sélectionner"
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </th>
              <th className="text-left py-2 px-4 w-[22%]">Client</th>
              <th className="text-left py-2 px-4 w-[10%]">Quantité</th>
              <th className="text-left py-2 px-4 w-[18%]">Panier</th>
              <th className="text-left py-2 px-4 w-[30%]">Message</th>
              <th className="text-left py-2 px-4 w-[10%]">Date</th>
              <th className="py-2 px-4" />
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 px-4 italic text-gray-500">
                  Aucune réservation.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b align-top">
                  {/* align-top pour toute la ligne */}
                  <td className="py-2 px-4 align-top">
                    <input
                      type="checkbox"
                      aria-label={`Sélectionner ${r.id}`}
                      checked={!!selected[r.id]}
                      onChange={() => toggleOne(r.id)}
                    />
                  </td>
                  <td className="py-2 px-4 align-top">{r.client_name}</td>
                  <td className="py-2 px-4 align-top">x{r.quantity}</td>
                  <td className="py-2 px-4 align-top">{r.basket_name}</td>
                  {/* ✅ Zone message multi-ligne, retour chariot respecté, coupure des mots longs */}
                  <td className="py-2 px-4 align-top">
                    <div className="whitespace-pre-wrap break-words">
                      {r.customer_note && r.customer_note.trim().length > 0
                        ? r.customer_note
                        : "—"}
                    </div>
                  </td>
                  <td className="py-2 px-4 align-top">{r.pickup_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination simple */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="px-3 py-1.5 rounded-full border cursor-pointer disabled:opacity-40"
        >
          Précédent
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="px-3 py-1.5 rounded-full border cursor-pointer disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
