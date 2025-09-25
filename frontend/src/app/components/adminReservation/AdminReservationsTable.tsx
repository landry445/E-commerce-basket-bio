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

  async function exportSelectedPdf() {
    const jsPDFModule = await import("jspdf"); // import dynamique
    const doc = new jsPDFModule.default();

    const picked = rows.filter((r) => selected[r.id]);
    const title = `Réservations sélectionnées (${picked.length})`;
    doc.setFontSize(14);
    doc.text(title, 14, 18);

    let y = 28;
    doc.setFontSize(11);
    picked.forEach((r, idx) => {
      const line = `${idx + 1}. ${r.client_name} — ${r.basket_name} — ${
        r.pickup_date
      } — x${r.quantity}`;
      doc.text(line, 14, y);
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
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
            className="px-3 py-1.5 rounded-full text-white"
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
                    className="px-2 py-1 rounded-full text-white bg-red-600"
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
