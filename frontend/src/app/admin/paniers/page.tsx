"use client";
import { useState } from "react";
import AdminHeader from "@/app/components/adminLayout/AdminHeader";
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

const PANIER_MOCK: Panier[] = [
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

  const handleDelete = () => {
    setShowConfirm(false);
    setSelected(null);
    // TODO: API DELETE
  };

  return (
    <>
      <AdminHeader
        title="Panier"
        onBack={
          step !== "list"
            ? () => {
                setSelected(null);
                setStep("list");
              }
            : undefined
        }
      />

      {step === "list" && (
        <>
          <button
            className="self-end mb-4 px-6 py-2 rounded-full bg-accent text-white font-bold shadow hover:brightness-105 transition"
            onClick={() => setStep("create")}
          >
            + Créer panier
          </button>
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
        </>
      )}

      {step === "create" && (
        <FormPanier
          mode="create"
          onSubmit={() => setStep("list")}
          initialValues={{}}
        />
      )}

      {step === "edit" && selected && (
        <FormPanier
          mode="edit"
          initialValues={selected}
          onSubmit={() => {
            setSelected(null);
            setStep("list");
          }}
        />
      )}

      <ConfirmModal
        open={showConfirm}
        message="Êtes-vous sûr de vouloir supprimer ce panier ?"
        subtext="Cette action est irréversible."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
