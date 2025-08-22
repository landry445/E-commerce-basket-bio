"use client";

import { useState, useEffect } from "react";
import UserCardGrid from "@/app/components/table/UserCardGrid";
import UserDetailPanel from "@/app/components/table/UserDetailPanel";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

export const dynamic = "force-dynamic";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  date_creation: string;
};

type Reservation = {
  id: string;
  user_id: string;
  basket_id: string;
  location_id: string;
  price_reservation: number;
  pickup_date: string;
  statut: "active" | "archived";
  quantity: number;
  non_venu: boolean;
};

type ReservationApiResponse = {
  id: string;
  user: { id: string } | null;
  basket: { id: string } | null;
  location: { id: string } | null;
  price_reservation: number;
  pickup_date: string;
  statut: "active" | "archived";
  quantity: number;
  non_venu: boolean;
};

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    fetch("/api/reservations", { credentials: "include" })
      .then((res) => res.json())
      .then((data: ReservationApiResponse[]) => {
        const mapped = data.map<Reservation>((r) => ({
          id: r.id,
          user_id: r.user?.id ?? "",
          basket_id: r.basket?.id ?? "",
          location_id: r.location?.id ?? "",
          price_reservation: r.price_reservation,
          pickup_date: r.pickup_date,
          statut: r.statut,
          quantity: r.quantity,
          non_venu: r.non_venu,
        }));
        setReservations(mapped);
      })
      .catch(() => setReservations([]));
  }, []);

  const handleDeleteUser = (userId: string) => setUserToDelete(userId);

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await fetch(`/api/admin/users/${userToDelete}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
    setReservations((prev) => prev.filter((r) => r.user_id !== userToDelete));
    setUserToDelete(null);
    setSelectedUserId(null);
  };

  const handleMarkNonVenu = async (reservationId: string) => {
    await fetch(`/api/reservations/${reservationId}/non-venu`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ non_venu: true }),
    });
    setReservations((prev) =>
      prev.map((res) =>
        res.id === reservationId ? { ...res, non_venu: true } : res
      )
    );
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const userReservations = reservations.filter(
    (r) => r.user_id === selectedUserId
  );

  return (
    <div className="flex gap-8">
      <div className="w-1/2">
        <UserCardGrid
          users={users}
          selectedUserId={selectedUserId}
          onSelect={setSelectedUserId}
        />
      </div>
      <div className="w-1/2 flex justify-center items-start">
        {selectedUser ? (
          <UserDetailPanel
            user={selectedUser}
            reservations={userReservations}
            baskets={[]}
            locations={[]}
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
