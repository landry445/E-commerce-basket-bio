"use client";
import { useEffect, useState } from "react";
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

type PanierSansId = Omit<Panier, "id">;

type BackendPanier = {
  id: string;
  name_basket: string;
  price_basket: number;
  description: string;
  image_basket: string;
  actif: boolean;
};

export default function AdminPaniersPage() {
  const [step, setStep] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Panier | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paniers, setPaniers] = useState<Panier[]>([]);

  const fetchPaniers = async () => {
    const res = await fetch("http://localhost:3001/baskets", {
      credentials: "include",
    });
    const data: BackendPanier[] = await res.json();
    const mapped: Panier[] = data.map((b) => ({
      id: b.id,
      nom: b.name_basket,
      prix: (b.price_basket / 100).toFixed(2),
      description: b.description,
      image: b.image_basket,
      actif: b.actif,
    }));
    setPaniers(mapped);
  };

  useEffect(() => {
    fetchPaniers();
  }, []);

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await fetch(`http://localhost:3001/baskets/${selected.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setPaniers((prev) => prev.filter((p) => p.id !== selected.id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
    setShowConfirm(false);
    setSelected(null);
  };

  // Doit recevoir un PanierSansId
  const handleCreate = (data: PanierSansId) => {
    void (async () => {
      try {
        const toSend = {
          name_basket: data.nom,
          price_basket: Math.round(parseFloat(data.prix) * 100),
          description: data.description,
          image_basket: data.image,
          actif: data.actif,
        };
        await fetch("http://localhost:3001/baskets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(toSend),
        });
        await fetchPaniers();
        setStep("list");
      } catch (err) {
        console.error("Erreur création :", err);
      }
    })();
  };

  // Doit recevoir un Panier (avec id)
  const handleUpdate = (data: Panier) => {
    void (async () => {
      try {
        const toSend = {
          name_basket: data.nom,
          price_basket: Math.round(parseFloat(data.prix) * 100),
          description: data.description,
          image_basket: data.image,
          actif: data.actif,
        };
        await fetch(`http://localhost:3001/baskets/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(toSend),
        });
        await fetchPaniers();
        setStep("list");
        setSelected(null);
      } catch (err) {
        console.error("Erreur modification :", err);
      }
    })();
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
            paniers={paniers}
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
          onSubmit={handleCreate}
          initialValues={{
            nom: "",
            prix: "",
            description: "",
            image: "",
            actif: true,
          }}
        />
      )}

      {step === "edit" && selected && (
        <FormPanier
          mode="edit"
          onSubmit={handleUpdate}
          initialValues={selected}
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
