"use client";

type Props = {
  initialValues?: { nom?: string; adresse?: string; jour?: string };
  onSubmit: (values: { nom: string; adresse: string; jour: string }) => void;
  mode?: "create" | "edit";
};

import { useRef } from "react";

export default function FormPointRetrait({
  initialValues = {},
  onSubmit,
  mode = "create",
}: Props) {
  const nomRef = useRef<HTMLInputElement>(null);
  const adresseRef = useRef<HTMLInputElement>(null);
  const jourRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      nom: nomRef.current?.value || "",
      adresse: adresseRef.current?.value || "",
      jour: jourRef.current?.value || "",
    });
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        ref={nomRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="Nom du point de retrait"
        defaultValue={initialValues.nom}
      />
      <input
        ref={adresseRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="Adresse"
        defaultValue={initialValues.adresse}
      />
      <input
        ref={jourRef}
        className="rounded border px-4 py-2 bg-white"
        type="text"
        placeholder="Jour (ex : Mardi)"
        defaultValue={initialValues.jour}
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
