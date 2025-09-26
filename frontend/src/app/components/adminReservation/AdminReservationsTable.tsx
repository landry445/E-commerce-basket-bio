"use client";

import { useMemo, useState } from "react";
import type { AdminReservationRow } from "./AdminReservationTypes.ts";

type Props = {
  rows: AdminReservationRow[];
  onDelete: (id: string) => Promise<void>;
};

export default function AdminReservationsTable({ rows, onDelete }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const allChecked = useMemo(
    () => rows.length > 0 && rows.every((r) => selected[r.id]),
    [rows, selected]
  );

  function toggleAll() {
    const next: Record<string, boolean> = {};
    if (!allChecked) rows.forEach((r) => (next[r.id] = true));
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  type RowExport = {
    client: string;
    basket: string;
    date: string;
    quantity: string;
    status: string;
  };

  async function exportSelectedPdf() {
    const [jsPDFModule, autoTable] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const jsPDF = jsPDFModule.default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const picked = rows.filter((r) => selected[r.id]);

    // Données structurées pour le tableau
    const body: RowExport[] = picked.map((r) => ({
      client: r.client_name,
      basket: r.basket_name,
      date: r.pickup_date,
      quantity: `x${r.quantity}`,
      status: r.statut,
    }));

    // Titre + méta
    doc.setProperties({ title: "Réservations paniers" });
    doc.setFontSize(14);
    doc.text(`Réservations(${body.length})`, 40, 40);

    // Tableau
    autoTable.default(doc, {
      head: [["Client", "Panier", "Date", "Quantité"]],
      body: body.map((r) => [r.client, r.basket, r.date, r.quantity]),
      startY: 60,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [34, 34, 34], textColor: 255 },
      margin: { left: 40, right: 40 },
      didDrawPage: () => {
        // Pied de page : pagination
        const page = doc.internal.getNumberOfPages();
        const str = `Page ${page}`;
        doc.setFontSize(9);
        doc.text(
          str,
          doc.internal.pageSize.getWidth() - 60,
          doc.internal.pageSize.getHeight() - 20
        );
      },
    });

    doc.save("reservations-selection.pdf");
  }

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-gray-600">{rows.length} lignes</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportSelectedPdf}
            className="px-3 py-1.5 rounded-full text-white cursor-pointer"
            style={{ background: "var(--color-dark)" }}
          >
            Exporter PDF (sélection)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-3 py-2 w-[48px]">
                <input
                  type="checkbox"
                  aria-label="Tout sélectionner"
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Quantité</th>
              <th className="px-3 py-2">Panier</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner ${r.id}`}
                    checked={!!selected[r.id]}
                    onChange={() => toggleOne(r.id)}
                  />
                </td>
                <td className="px-3 py-2">{r.client_name}</td>
                <td className="px-3 py-2">x{r.quantity}</td>
                <td className="px-3 py-2">{r.basket_name}</td>
                <td className="px-3 py-2">{r.pickup_date}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="px-2 py-1 rounded-full text-white bg-red-600 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-3 py-8 text-center text-gray-500" colSpan={6}>
                  Aucune réservation
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
