"use client";

import { useState } from "react";
import clsx from "clsx";

type Reservation = {
  id: string;
  client: string;
  panier: string;
  lieu: string;
  date: string; // YYYY-MM-DD
  statut: "active" | "archived";
};

type Props = {
  reservations: Reservation[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TableReservations({
  reservations,
  // onArchive,
  onDelete,
}: Props) {
  const [filterStatut, setFilterStatut] = useState<
    "all" | "active" | "archived"
  >("all");

  // Filtres par colonne
  const [filterClient, setFilterClient] = useState("");
  const [filterPanier, setFilterPanier] = useState("");
  const [filterLieu, setFilterLieu] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const reservationsFiltered = reservations.filter((c) => {
    const statutOK = filterStatut === "all" || c.statut === filterStatut;
    const clientOK = c.client
      .toLowerCase()
      .includes(filterClient.toLowerCase());
    const panierOK = c.panier
      .toLowerCase()
      .includes(filterPanier.toLowerCase());
    const lieuOK = c.lieu.toLowerCase().includes(filterLieu.toLowerCase());
    const dateOK = filterDate === "" || c.date === filterDate;
    return statutOK && clientOK && panierOK && lieuOK && dateOK;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filtres par statut */}
      <div className="flex gap-4 mb-2">
        {(["all", "active", "archived"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilterStatut(key)}
            className={clsx(
              "px-4 py-1 rounded-full border text-sm font-semibold transition",
              filterStatut === key
                ? "bg-accent text-white"
                : "bg-white border-dark hover:bg-gray-100"
            )}
          >
            {key === "all"
              ? "Toutes"
              : key === "active"
              ? "Actives"
              : "Archivées"}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-yellow text-dark">
            <tr>
              <th className="py-2 px-4 text-left">Client</th>
              <th className="py-2 px-4 text-left">Panier</th>
              <th className="py-2 px-4 text-left">Lieu</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
            <tr className="bg-white text-dark border-b">
              <th className="px-4 py-1">
                <input
                  type="text"
                  placeholder="Filtrer..."
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                  className="border rounded px-2 py-1 w-full text-sm"
                />
              </th>
              <th className="px-4 py-1">
                <input
                  type="text"
                  placeholder="Filtrer..."
                  value={filterPanier}
                  onChange={(e) => setFilterPanier(e.target.value)}
                  className="border rounded px-2 py-1 w-full text-sm"
                />
              </th>
              <th className="px-4 py-1">
                <input
                  type="text"
                  placeholder="Filtrer..."
                  value={filterLieu}
                  onChange={(e) => setFilterLieu(e.target.value)}
                  className="border rounded px-2 py-1 w-full text-sm"
                />
              </th>
              <th className="px-4 py-1">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border rounded px-2 py-1 w-full text-sm"
                />
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservationsFiltered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 italic text-gray-500">
                  Aucune reservation.
                </td>
              </tr>
            ) : (
              reservationsFiltered.map((cmd) => (
                <tr key={cmd.id} className="border-b">
                  <td className="py-2 px-4">{cmd.client}</td>
                  <td className="py-2 px-4">{cmd.panier}</td>
                  <td className="py-2 px-4">{cmd.lieu}</td>
                  <td className="py-2 px-4">{cmd.date}</td>
                  <td className="py-2 px-4">
                    {cmd.statut === "active" ? "🟢 Active" : "📦 Archivée"}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    {/* {cmd.statut === "active" && (
                      <button
                        onClick={() => onArchive(cmd.id)}
                        className="text-xs px-3 py-1 rounded-full border border-dark hover:bg-yellow/80"
                      >
                        Archiver
                      </button>
                    )} */}
                    <button
                      onClick={() => onDelete(cmd.id)}
                      className="text-xs cursor-pointer px-3 py-1 rounded-full border border-red-600 text-red-600 hover:bg-red-50"
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
