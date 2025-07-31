"use client";

import Tablereservation from "@/app/components/table/TableReservation";
import AdminHeader from "@/app/components/adminLayout/AdminHeader";
import ConfirmModal from "@/app/components/modal/ConfirmModal";
import { useEffect, useState } from "react";

type ReservationAPI = {
  id: string;
  user: { firstname: string; lastname: string };
  basket: { name_basket: string };
  location: { name_pickup: string } | null;
  pickup_date: string;
  statut: "active" | "archived";
};

type Reservation = {
  id: string;
  client: string;
  panier: string;
  lieu: string;
  date: string;
  statut: "active" | "archived";
};

export default function AdminreservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [commandeASupprimer, setCommandeASupprimer] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetch("http://localhost:3001/reservations", { credentials: "include" })
      .then((res) => res.json())
      .then((data: ReservationAPI[]) => {
        const mapped = data.map((r) => ({
          id: r.id,
          client: `${r.user.firstname} ${r.user.lastname}`,
          panier: r.basket.name_basket,
          lieu: r.location ? r.location.name_pickup : "—",
          date: r.pickup_date,
          statut: r.statut,
        }));
        setReservations(mapped);
      })
      .catch(() => setReservations([]));
  }, []);

  // Archivage (à adapter selon ton endpoint existant)
  const handleArchive = async (id: string) => {
    await fetch(`http://localhost:3001/reservations/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "archived" }), // Adapter selon DTO
    });
    setReservations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: "archived" } : c))
    );
  };

  const confirmSuppression = (id: string) => {
    setCommandeASupprimer(id);
  };

  const handleDeleteConfirm = async () => {
    if (commandeASupprimer) {
      await fetch(`http://localhost:3001/reservations/${commandeASupprimer}`, {
        method: "DELETE",
        credentials: "include",
      });
      setReservations((prev) =>
        prev.filter((c) => c.id !== commandeASupprimer)
      );
      setCommandeASupprimer(null);
    }
  };

  return (
    <>
      <AdminHeader title="Réservations" />
      <Tablereservation
        reservations={reservations}
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
