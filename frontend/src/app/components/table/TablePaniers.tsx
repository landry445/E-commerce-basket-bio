"use client";
import Image from "next/image";

type Panier = {
  id: string;
  nom: string;
  prix: string;
  description: string;
  image: string;
  actif: boolean;
};

type Props = {
  paniers: Panier[];
  onEdit: (panier: Panier) => void;
  onDelete: (panier: Panier) => void;
};

export default function TablePaniers({ paniers, onEdit, onDelete }: Props) {
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
          {paniers.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 italic text-gray-500">
                Aucun panier.
              </td>
            </tr>
          ) : (
            paniers.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4">{p.nom}</td>
                <td className="py-2 px-4">{p.prix}</td>
                <td className="py-2 px-4">{p.description}</td>
                <td className="py-2 px-4">
                  <Image
                    src={p.image}
                    alt={p.nom}
                    width={36}
                    height={36}
                    className="rounded shadow inline-block"
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
                    className="text-xs px-3 py-1 rounded-full border border-dark hover:bg-yellow/80"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-xs px-3 py-1 rounded-full border border-red-600 text-red-600 hover:bg-red-50"
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
