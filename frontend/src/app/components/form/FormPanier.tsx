"use client";
import { useState } from "react";

type Panier = {
  id: string;
  nom: string;
  prix: string;
  description: string;
  image: string;
  actif: boolean;
};
type PanierSansId = Omit<Panier, "id">;

type FormPanierProps =
  | {
      mode: "create";
      initialValues?: Partial<PanierSansId>;
      onSubmit: (values: PanierSansId) => void;
    }
  | {
      mode: "edit";
      initialValues: Panier;
      onSubmit: (values: Panier) => void;
    };

export default function FormPanier(props: FormPanierProps) {
  const { mode, onSubmit } = props;
  const initial = props.initialValues ?? {};

  // Pour edit, on récupère l’id ; pour create, il n’existe pas.
  const [nom, setNom] = useState(initial.nom ?? "");
  const [prix, setPrix] = useState(initial.prix ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [image, setImage] = useState(initial.image ?? "");
  const [actif, setActif] = useState(
    mode === "edit" ? (initial as Panier).actif : initial.actif ?? true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit") {
      // Typescript : l’id est garanti présent
      const { id } = initial as Panier;
      onSubmit({ id, nom, prix, description, image, actif });
    } else {
      onSubmit({ nom, prix, description, image, actif });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-8 mt-2">
      <div className="flex-1 flex flex-col gap-4">
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="text"
          placeholder="Petit panier de légumes – 14"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="number"
          step="0.01"
          placeholder="Prix (ex : 14.00)"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />
        <textarea
          className="rounded-xl border border-gray-300 px-6 py-4 bg-white font-sans placeholder:text-gray-400 text-base min-h-[160px] resize-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="rounded-full border border-gray-300 px-6 py-2 bg-white font-sans placeholder:text-gray-400 text-base"
          type="text"
          placeholder="URL de l'image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={actif}
            onChange={(e) => setActif(e.target.checked)}
            id="actif"
            className="w-4 h-4 accent-green-600"
          />
          <label htmlFor="actif" className="text-base font-medium">
            Panier actif
          </label>
        </div>
      </div>
      <div className="flex flex-col items-end mt-3">
        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 rounded-full bg-accent text-white font-sans font-bold hover:brightness-110"
        >
          {mode === "edit" ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
}
