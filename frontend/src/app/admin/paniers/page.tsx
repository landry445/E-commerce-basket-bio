"use client";

import { useState } from "react";
import SidebarAdmin from "@/app/components/sidebarAdmin/SidebarAdmin";
import TablePaniers from "@/app/components/table/TablePaniers";
import FormPanier from "@/app/components/form/FormPanier";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

type Panier = {
  id: string;
  nom: string;
  prix: string;
  description: string;
  image: string;
  actif: boolean;
};
// Données mock
const PANIER_MOCK = [
  {
    id: "1",
    nom: "Panier légumes",
    prix: "12 €",
    description: "Légumes bio de saison",
    image: "/panier-legumes.png",
    actif: true,
  },
  {
    id: "1",
    nom: "Panier légumes",
    prix: "12 €",
    description: "Légumes bio de saison",
    image: "/panier-legumes.png",
    actif: true,
  },
  {
    id: "2",
    nom: "Panier fruits",
    prix: "10 €",
    description: "Fruits frais et juteux",
    image: "/panier-fruits.png",
    actif: true,
  },
  {
    id: "3",
    nom: "Panier mixte",
    prix: "15 €",
    description: "Mélange de fruits et légumes",
    image: "/panier-mixte.png",
    actif: false,
  },
];

export default function AdminPaniersPage() {
  const [step, setStep] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Panier | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Ajoute ici la logique CRUD réelle plus tard
  const handleDelete = () => {
    setShowConfirm(false);
    setSelected(null);
    // ...delete panier (appel API)
  };

  return (
    <div className="flex min-h-screen bg-light">
      {/* Sidebar */}
      <SidebarAdmin activePage="panier" userName="Adri" />
      {/* Main content */}
      {/* HEADER ACTIONS */}
      <div className="absolute top-6 right-10 flex items-center gap-4 z-20">
        <button
          className="px-4 py-1 rounded-full border border-dark bg-white font-sans text-dark text-sm shadow hover:bg-gray-100"
          onClick={() => {
            /* log out ici */
          }}
        >
          Se déconnecter
        </button>
        <a
          href="/"
          className="px-4 py-1 rounded-full border border-dark bg-white font-sans text-dark text-sm shadow hover:bg-gray-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir le site
        </a>
        <button
          className="ml-8 w-12 h-12 flex items-center justify-center rounded-full border border-dark bg-white text-3xl shadow hover:bg-gray-100"
          onClick={() => window.history.back()}
          aria-label="Retour"
          type="button"
        >
          <span className="inline-block -ml-1">&#8592;</span>
        </button>
      </div>

      <main className="flex-1 p-8 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="font-[var(--font-pacifico)] text-3xl text-dark">
            Gérer votre <span className="italic">Panier</span>
          </h1>
          {step === "list" && (
            <button
              className="px-5 py-2 rounded-full bg-accent text-white font-sans font-bold hover:brightness-110"
              onClick={() => setStep("create")}
            >
              + Créer panier
            </button>
          )}
        </header>
        {/* Liste des paniers */}
        {step === "list" && (
          <TablePaniers
            paniers={PANIER_MOCK}
            onEdit={(panier) => {
              setSelected(panier);
              setStep("edit");
            }}
            onDelete={(panier) => {
              setSelected(panier);
              setShowConfirm(true);
            }}
          />
        )}
        {/* Création panier */}
        {step === "create" && (
          <FormPanier
            mode="create"
            onSubmit={() => {
              // ...save panier (API)
              setStep("list");
            }}
            initialValues={{}}
          />
        )}
        {/* Edition panier */}
        {step === "edit" && selected && (
          <FormPanier
            mode="edit"
            initialValues={selected}
            onSubmit={() => {
              // ...update panier (API)
              setSelected(null);
              setStep("list");
            }}
          />
        )}
        {/* Modale suppression */}
        <ConfirmModal
          open={showConfirm}
          message="Êtes-vous sûr de vouloir supprimer ce panier ?"
          subtext="Cette action est irréversible."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
}
