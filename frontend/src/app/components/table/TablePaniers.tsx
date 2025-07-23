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
    <table className="w-full bg-gray-100 border text-dark">
      <thead>
        <tr>
          <th className="p-2 border">Nom du panier</th>
          <th className="p-2 border">Prix</th>
          <th className="p-2 border">Description</th>
          <th className="p-2 border">Image</th>
          <th className="p-2 border">Actions</th>
          <th className="p-2 border">Activation</th>
        </tr>
      </thead>
      <tbody>
        {paniers.map((p) => (
          <tr key={p.id} className="bg-white">
            <td className="p-2 border">{p.nom}</td>
            <td className="p-2 border">{p.prix}</td>
            <td className="p-2 border">{p.description}</td>
            <td className="p-2 border">
              <Image
                src={p.image}
                alt={p.nom}
                width={36}
                height={36}
                className="mx-auto rounded"
              />
            </td>
            <td className="p-2 border text-center">
              <button
                onClick={() => onEdit(p)}
                className="text-primary hover:underline mr-2"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(p)}
                className="text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </td>
            <td className="p-2 border text-center">
              <input type="checkbox" checked={p.actif} readOnly />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
