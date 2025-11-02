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

  function toggleAll(): void {
    const next: Record<string, boolean> = {};
    if (!allChecked) rows.forEach((r) => (next[r.id] = true));
    setSelected(next);
  }
  function toggleOne(id: string): void {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  type RowExport = {
    client: string;
    basket: string;
    date: string;
    quantity: string;
    status: string;
  };

  async function exportSelectedPdf(): Promise<void> {
    const [jsPDFModule, autoTable] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const jsPDF = jsPDFModule.default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const picked = rows.filter((r) => selected[r.id]);

    const body: RowExport[] = picked.map((r) => ({
      client: r.client_name,
      basket: r.basket_name,
      date: r.pickup_date,
      quantity: `x${r.quantity}`,
      status: r.statut,
    }));

    doc.setProperties({ title: "Réservations paniers" });
    doc.setFontSize(14);
    doc.text(`Réservations (${body.length})`, 40, 40);

    autoTable.default(doc, {
      head: [["Client", "Panier", "Date", "Quantité"]],
      body: body.map((r) => [r.client, r.basket, r.date, r.quantity]),
      startY: 60,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [34, 34, 34], textColor: 255 },
      margin: { left: 40, right: 40 },
      didDrawPage: () => {
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

  const selectedCount = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]).length,
    [selected]
  );

  async function handleDelete(id: string): Promise<void> {
    await onDelete(id);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {rows.length} ligne{rows.length > 1 ? "s" : ""}
          {selectedCount > 0
            ? ` • ${selectedCount} sélectionnée${selectedCount > 1 ? "s" : ""}`
            : ""}
        </div>

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

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full table-auto text-sm">
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
              <th className="text-left py-2 px-4">Client</th>
              <th className="text-left py-2 px-4">Quantité</th>
              <th className="text-left py-2 px-4">Panier</th>
              <th className="text-left py-2 px-4">Message</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 px-4 italic text-gray-500">
                  Aucune réservation.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      aria-label={`Sélectionner ${r.id}`}
                      checked={!!selected[r.id]}
                      onChange={() => toggleOne(r.id)}
                    />
                  </td>
                  <td className="py-2 px-4">{r.client_name}</td>
                  <td className="py-2 px-4">x{r.quantity}</td>
                  <td className="py-2 px-4">{r.basket_name}</td>
                  <td className="py-2 px-4 max-w-[320px]">
                    <span title={r.customer_note} className="block truncate">
                      {r.customer_note || "—"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{r.pickup_date}</td>
                  <td className="py-2 px-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="text-xs px-3 py-1 cursor-pointer rounded-full
                                 border border-red-600 text-red-600 hover:bg-red-50 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
