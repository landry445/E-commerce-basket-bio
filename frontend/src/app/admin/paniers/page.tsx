import { useState } from "react";
import SidebarAdmin from "@/app/components/sidebarAdmin/SidebarAdmin";
import TablePaniers from "@/app/components/table/TablePaniers";
import FormPanier from "@/app/components/form/FormPanier";
import ConfirmModal from "@/app/components/modal/ConfirmModal";
import AdminActionsBar from "./AdminActionsBar";

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
    <div className="flex min-h-screen bg-light ">
      <SidebarAdmin activePage="panier" userName="Adri" />
      {/* ActionsBar en haut à droite, toujours visible */}
      <div className="flex-1 flex-col">
        <AdminActionsBar />
        <main className="flex-1 px-12 py-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-[var(--font-pacifico)] text-3xl text-dark">
              Gérer votre <span className="italic">Panier</span>
            </h1>
            {step === "list" ? (
              <button
                className="px-6 py-2 rounded-full bg-accent text-white font-bold shadow hover:brightness-105 transition"
                onClick={() => setStep("create")}
              >
                + Créer panier
              </button>
            ) : (
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border border-dark bg-white text-2xl shadow-sm hover:bg-gray-100 transition"
                onClick={() => {
                  setSelected(null);
                  setStep("list");
                }}
                aria-label="Retour"
                type="button"
              >
                <span className="inline-block -ml-1">&#8592;</span>
              </button>
            )}
          </div>
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
        </main>
      </div>
    </div>
  );
}
