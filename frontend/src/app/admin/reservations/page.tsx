"use client";

import Tablereservation from "@/app/components/table/TableReservation";
import AdminHeader from "@/app/components/adminLayout/AdminHeader";
import ConfirmModal from "@/app/components/modal/ConfirmModal";
import { useState } from "react";

const MOCK_reservation = [
  {
    id: "1",
    client: "Marie Curie",
    panier: "Panier légumes",
    lieu: "Marché",
    date: "2025-07-27",
    statut: "active" as const,
  },
  {
    id: "2",
    client: "Albert Einstein",
    panier: "Panier mixte",
    lieu: "Gare",
    date: "2025-07-24",
    statut: "archived" as const,
  },
];

export default function AdminreservationPage() {
  const [reservation, setReservation] = useState(MOCK_reservation);
  const [commandeASupprimer, setCommandeASupprimer] = useState<string | null>(
    null
  );

  const handleArchive = (id: string) => {
    setReservation((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: "archived" as const } : c))
    );
  };

  const confirmSuppression = (id: string) => {
    setCommandeASupprimer(id);
  };

  const handleDeleteConfirm = () => {
    if (commandeASupprimer) {
      setReservation((prev) => prev.filter((c) => c.id !== commandeASupprimer));
      setCommandeASupprimer(null);
    }
  };

  return (
    <>
      <AdminHeader title="reservation" />
      <Tablereservation
        reservations={reservation}
        onArchive={handleArchive}
        onDelete={confirmSuppression}
      />

      <ConfirmModal
        open={!!commandeASupprimer}
        message="Êtes-vous sûr de vouloir supprimer cette commande ?"
        subtext="Cette action est irréversible."
        onCancel={() => setCommandeASupprimer(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
