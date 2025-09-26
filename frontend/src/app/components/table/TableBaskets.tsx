"use client";
import Image from "next/image";

type Basket = {
  id: string;
  name: string;
  priceEuro: number; // <- number en euros
  description: string;
  actif: boolean;
};

type Props = {
  baskets: Basket[];
  onEdit: (basket: Basket) => void;
  onDelete: (basket: Basket) => void;
  onToggleActif: (id: string, next: boolean) => void;
};

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export default function TableBaskets({
  baskets,
  onEdit,
  onDelete,
  onToggleActif,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="w-full table-auto text-sm">
        <thead className="bg-yellow text-dark">
          <tr>
            <th className="text-left py-2 px-4">Nom</th>
            <th className="text-left py-2 px-4">Prix</th>
            <th className="text-left py-2 px-4">Description</th>
            <th className="text-left py-2 px-4">Image</th>
            <th className="text-center py-2 px-4">Activation</th>
            <th className="text-left py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {baskets.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 italic text-gray-500">
                Aucun panier.
              </td>
            </tr>
          ) : (
            baskets.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{eur.format(p.priceEuro)}</td>
                <td className="py-2 px-4">{p.description}</td>
                <td className="py-2 px-4">
                  <Image
                    src={`http://localhost:3001/baskets/${p.id}/image`}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="rounded shadow inline-block"
                    unoptimized
                    crossOrigin="anonymous"
                    style={{ width: "40px", height: "40px" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/panier-legumes.webp";
                    }}
                  />
                </td>

                {/* Bouton ON/OFF comme sur la capture 3 */}
                <td className="py-2 px-4 text-center">
                  <button
                    type="button"
                    aria-pressed={p.actif}
                    aria-label={p.actif ? "Désactiver" : "Activer"}
                    onClick={() => onToggleActif(p.id, !p.actif)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded
                               border border-gray-300 hover:bg-gray-50 transition
                               focus:outline-none focus:ring-2 focus:ring-offset-1"
                    style={{
                      background: p.actif ? "#16a34a" : "white", // vert Tailwind ~ green-600
                      color: p.actif ? "white" : "#16a34a",
                    }}
                  >
                    {p.actif ? "✔" : ""}
                  </button>
                </td>

                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-xs px-3 cursor-pointer py-1 rounded-full border border-dark hover:bg-yellow/80"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-xs px-3 py-1 cursor-pointer rounded-full border border-red-600 text-red-600 hover:bg-red-50"
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
  );
}
