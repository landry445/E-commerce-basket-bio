"use client";

import { useState } from "react";

type PanierOption = { id: string; label: string; prix: string };
type PickupOption = { id: string; label: string };

type ReservationFormValues = {
  panier: string;
  pickup: string;
  objet: "commande" | "contact";
  message: string;
};

type Props = {
  user?: { nom: string; email: string; telephone: string };
  paniers: PanierOption[];
  pickups: PickupOption[];
  onSubmit: (values: ReservationFormValues) => void;
};

export default function FormReservation({
  user,
  paniers,
  pickups,
  onSubmit,
}: Props) {
  const [panier, setPanier] = useState(paniers[0]?.id ?? "");
  const [pickup, setPickup] = useState(pickups[0]?.id ?? "");
  const [objet, setObjet] = useState<"commande" | "contact">("commande");
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto bg-light p-6 rounded-lg border"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ panier, pickup, objet, message });
      }}
    >
      {/* Bloc infos utilisateur */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center flex-1 gap-2 bg-white border rounded px-4 py-2">
          <span className="text-accent">👤</span>
          <span className="font-semibold text-dark">
            {user?.nom ?? "Nom & Prénom"}
          </span>
        </div>
        <div className="flex items-center flex-1 gap-2 bg-white border rounded px-4 py-2">
          <span className="text-accent">✉️</span>
          <span>{user?.email ?? "Email"}</span>
        </div>
        <div className="flex items-center flex-1 gap-2 bg-white border rounded px-4 py-2">
          <span className="text-accent">📞</span>
          <span className="font-bold">{user?.telephone ?? "Téléphone"}</span>
        </div>
      </div>
      {/* Choix action */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Que souhaitez-vous faire ? *</label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="objet"
              value="commande"
              checked={objet === "commande"}
              onChange={() => setObjet("commande")}
              className="accent-primary"
            />
            Commander un panier et légumes
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="objet"
              value="contact"
              checked={objet === "contact"}
              onChange={() => setObjet("contact")}
              className="accent-primary"
            />
            Nous écrire
          </label>
        </div>
      </div>
      {/* Choix panier */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Sélectionnez votre taille de panier *
          </label>
          {paniers.map((opt) => (
            <label key={opt.id} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="panier"
                value={opt.id}
                checked={panier === opt.id}
                onChange={() => setPanier(opt.id)}
                className="accent-primary"
              />
              {opt.label} <span className="text-gray-500">({opt.prix})</span>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Sélectionnez le jour de retrait *
          </label>
          <select
            className="rounded border px-3 py-2 bg-white"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          >
            {pickups.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Message */}
      <textarea
        className="rounded border px-4 py-2 bg-white min-h-[90px] mt-2"
        placeholder="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Bouton submit */}
      <button
        type="submit"
        className="self-start px-5 py-2 rounded-full bg-accent text-white hover:brightness-110 font-sans font-bold"
      >
        Envoyer
      </button>
    </form>
  );
}
