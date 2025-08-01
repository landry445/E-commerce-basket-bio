"use client";
import Image from "next/image";

type Basket = {
  id: string;
  name: string;
  price: string;
  description: string;
  actif: boolean;
};

type Props = {
  baskets: Basket[];
  onEdit: (basket: Basket) => void;
  onDelete: (basket: Basket) => void;
};

export default function TableBaskets({ baskets, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="w-full table-auto text-sm">
        <thead className="bg-yellow text-dark">
          <tr>
            <th className="text-left py-2 px-4">Nom</th>
            <th className="text-left py-2 px-4">Prix (€)</th>
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
                Aucun basket.
              </td>
            </tr>
          ) : (
            baskets.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.price}</td>
                <td className="py-2 px-4">{p.description}</td>
                <td className="py-2 px-4">
                  <Image
                    src={`http://localhost:3001/baskets/${p.id}/image`}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="rounded shadow inline-block"
                    unoptimized
                    crossOrigin="anonymous"
                    style={{ width: "40px", height: "40px" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/panier-default.png";
                    }}
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.actif}
                    readOnly
                    className="w-4 h-4 accent-green-600 cursor-default"
                  />
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
