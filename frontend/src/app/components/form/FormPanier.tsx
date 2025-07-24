"use client";

import { useState } from "react";

type Panier = {
  nom: string;
  prix: string;
  description: string;
  image?: string;
};

type Props = {
  initialValues?: Partial<Panier>;
  mode?: "create" | "edit";
  onSubmit: (values: Panier) => void;
};

export default function FormPanier({ initialValues = {}, mode = "create", onSubmit }: Props) {
  const [nom, setNom] = useState(initialValues.nom ?? "");
  const [prix, setPrix] = useState(initialValues.prix ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? ""
  );
  const [image, setImage] = useState(initialValues.image ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, prix, description, image });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-8 mt-2">
      {/* Colonne gauche */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="text"
          placeholder="Petit panier de légumes – 14 €"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="text"
          placeholder="14€"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />
        <textarea
          className="rounded-xl border border-gray-300 px-6 py-4 bg-white font-sans placeholder:text-gray-400 text-base min-h-[160px] resize-none"
          placeholder="Chaque semaine, venez chercher votre panier de légumes bio directement à l’exploitation. Le petit panier à 14 €, idéal pour 2 personnes."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {/* Colonne droite */}
      <div className="flex flex-col min-w-[220px] max-w-[240px] h-full justify-between">
        <div className="rounded-xl border border-gray-300 bg-white px-5 py-4 flex-1 flex flex-col items-start mb-4">
          <span className="font-bold mb-2">Modifier l’image</span>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 text-gray-500 border hover:cursor-not-allowed"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <rect x="2" y="5" width="16" height="10" rx="2" fill="#bcbcbc" />
              <path
                d="M2 15l5.5-7 4 6 2.5-3L18 15"
                stroke="#909090"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="6.5" cy="8" r="1" fill="#909090" />
            </svg>
            Charger une image
          </button>
          {/* Zone image ou input file à brancher */}
        </div>
        <div className="flex flex-col items-end mt-3">
          <button
            type="submit"
            className="mt-6 w-full px-4 py-2 rounded-full bg-accent text-white font-sans font-bold hover:brightness-110"
            style={{ minWidth: 60 }}
          >
            {mode === "edit" ? "Modifier" : "Créer"}
          </button>
        </div>
      </div>
    </form>
  );
}
