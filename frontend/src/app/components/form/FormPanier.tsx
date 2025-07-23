"use client";

type Props = {
  initialValues?: {
    nom?: string;
    prix?: string;
    description?: string;
  };
  onSubmit: (values: {
    nom: string;
    prix: string;
    description: string;
  }) => void;
  mode?: "create" | "edit";
};

import React, { useState } from "react";

export default function FormPanier({
  initialValues = {},
  onSubmit,
  mode = "create",
}: Props) {
  const [nom, setNom] = useState(initialValues.nom || "");
  const [prix, setPrix] = useState(initialValues.prix || "");
  const [description, setDescription] = useState(
    initialValues.description || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nom, prix, description });
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="Nom du panier"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="Prix (€)"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
      />
      <textarea
        className="rounded border px-4 py-2 bg-white"
        rows={3}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="self-end px-4 py-2 rounded bg-primary text-white hover:brightness-90"
      >
        {mode === "edit" ? "Modifier" : "Créer"}
      </button>
    </form>
  );
}
