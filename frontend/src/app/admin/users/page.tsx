"use client";

import { useState } from "react";
import UserCardGrid from "@/app/components/table/UserCardGrid";
import UserDetailPanel from "@/app/components/table/UserDetailPanel";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

const MOCK_BASKETS = [
  { id: "b1", name_basket: "Panier légumes" },
  { id: "b2", name_basket: "Panier fruits" },
];
const MOCK_LOCATIONS = [
  { id: "l1", name_pickup: "Marché" },
  { id: "l2", name_pickup: "Gare" },
];
const MOCK_USERS = [
  {
    id: "u1",
    firstname: "Alice",
    lastname: "Durand",
    email: "alice@example.com",
    phone: "0601020304",
    date_creation: "2025-07-20",
  },
  {
    id: "u2",
    firstname: "Jean",
    lastname: "Martin",
    email: "jean@example.com",
    phone: "0607080910",
    date_creation: "2025-07-01",
  },
];
const MOCK_RESERVATIONS = [
  {
    id: "1",
    user_id: "u1",
    basket_id: "b1",
    location_id: "l1",
    price_reservation: 1299,
    pickup_date: "2025-07-25",
    statut: "active" as const,
    quantity: 1,
    non_venu: false,
  },
  {
    id: "2",
    user_id: "u1",
    basket_id: "b2",
    location_id: "l2",
    price_reservation: 999,
    pickup_date: "2025-07-10",
    statut: "archived" as const,
    quantity: 2,
    non_venu: true,
  },
  {
    id: "3",
    user_id: "u2",
    basket_id: "b1",
    location_id: "l2",
    price_reservation: 1499,
    pickup_date: "2025-06-30",
    statut: "archived" as const,
    quantity: 1,
    non_venu: false,
  },
];

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleMarkNonVenu = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === reservationId ? { ...res, non_venu: true } : res
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      setReservations((prev) => prev.filter((r) => r.user_id !== userToDelete));
      setUserToDelete(null);
      setSelectedUserId(null);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const userReservations = reservations.filter(
    (r) => r.user_id === selectedUserId
  );

  return (
    <div className="flex gap-8">
      {/* Cartes utilisateurs à gauche */}
      <div className="w-1/2">
        <UserCardGrid
          users={users}
          selectedUserId={selectedUserId}
          onSelect={setSelectedUserId}
        />
      </div>
      {/* Fiche détaillée à droite */}
      <div className="w-1/2 flex justify-center items-start">
        {selectedUser ? (
          <UserDetailPanel
            user={selectedUser}
            reservations={userReservations}
            baskets={MOCK_BASKETS}
            locations={MOCK_LOCATIONS}
            onMarkNonVenu={handleMarkNonVenu}
            onDelete={handleDeleteUser}
          />
        ) : (
          <div className="italic text-gray-400 mt-16">
            Sélectionnez un utilisateur pour afficher le détail
          </div>
        )}
      </div>
      <ConfirmModal
        open={!!userToDelete}
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        subtext="Toutes ses commandes seront également supprimées. Cette action est irréversible."
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
