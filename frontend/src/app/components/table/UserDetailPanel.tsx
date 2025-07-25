"use client";

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
  basket_id: string;
  location_id: string;
  price_reservation: number;
  pickup_date: string;
  statut: "active" | "archived";
  quantity: number;
  non_venu: boolean;
};
type Basket = { id: string; name_basket: string };
type Location = { id: string; name_pickup: string };

type Props = {
  user: User;
  reservations: Reservation[];
  baskets: Basket[];
  locations: Location[];
  onMarkNonVenu: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function UserDetailPanel({
  user,
  reservations,
  baskets,
  locations,
  onMarkNonVenu,
  onDelete,
}: Props) {
  return (
    <div className="bg-gray-100 rounded-xl p-8 shadow flex flex-col gap-4 min-w-[380px] max-w-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-dark mb-1">
            {user.firstname} {user.lastname}
          </div>
          <div className="text-sm text-gray-500">
            Membre depuis le {user.date_creation}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {user.email} • {user.phone}
          </div>
        </div>
        <button
          className="rounded-full border border-red-600 px-4 py-1 text-red-600 font-semibold hover:bg-red-50"
          onClick={() => onDelete(user.id)}
        >
          Supprimer
        </button>
      </div>
      <hr />
      <div>
        <div className="font-semibold mb-2 text-dark">Commandes passées</div>
        <div className="flex flex-col gap-2">
          {reservations.length === 0 && (
            <div className="italic text-gray-400 text-sm">Aucune commande</div>
          )}
          {reservations.map((res) => (
            <div
              key={res.id}
              className="flex items-center justify-between bg-white rounded p-2 shadow"
            >
              <div>
                <span className="font-bold">
                  {baskets.find((b) => b.id === res.basket_id)?.name_basket ??
                    "?"}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  {locations.find((l) => l.id === res.location_id)
                    ?.name_pickup ?? "?"}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  {res.pickup_date}
                </span>
                <span className="text-gray-600 text-xs ml-2">
                  {res.statut === "active" ? "🟢" : "📦"}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-semibold">
                  {(res.price_reservation / 100).toFixed(2)} €
                </span>
                {res.statut === "active" && (
                  <button
                    className={`rounded-full border text-xs px-2 py-1 font-semibold transition
                      ${
                        res.non_venu
                          ? "border-gray-500 text-gray-500 bg-gray-100 cursor-not-allowed"
                          : "border-accent text-accent hover:bg-yellow/80"
                      }
                    `}
                    onClick={() => !res.non_venu && onMarkNonVenu(res.id)}
                    disabled={res.non_venu}
                  >
                    {res.non_venu ? "Non venu" : "Marquer non venu"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
