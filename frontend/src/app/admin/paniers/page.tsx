"use client";
import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/adminLayout/AdminHeader";
import Tablebaskets from "@/app/components/table/TableBaskets";
import Formbasket from "@/app/components/form/FormBasket";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

type Basket = {
  id: string;
  name: string;
  price: string;
  description: string;
  actif: boolean;
};

type Backendbasket = {
  id: string;
  name_basket: string;
  price_basket: number;
  description: string;
  actif: boolean;
};

export default function AdminbasketsPage() {
  const [step, setStep] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Basket | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [baskets, setBaskets] = useState<Basket[]>([]);

  const fetchbaskets = async () => {
    const res = await fetch("http://localhost:3001/baskets", {
      credentials: "include",
    });
    const data: Backendbasket[] = await res.json();
    const mapped: Basket[] = data.map((b) => ({
      id: b.id,
      name: b.name_basket,
      price: (b.price_basket / 100).toFixed(2),
      description: b.description,
      actif: b.actif,
    }));
    setBaskets(mapped);
  };

  useEffect(() => {
    fetchbaskets();
  }, []);

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await fetch(`http://localhost:3001/baskets/${selected.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setBaskets((prev) => prev.filter((p) => p.id !== selected.id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
    setShowConfirm(false);
    setSelected(null);
  };

  // Création
  const handleCreate = (formData: FormData) => {
    void (async () => {
      try {
        await fetch("http://localhost:3001/baskets", {
          method: "POST",
          credentials: "include",
          body: formData, // pas d’en-tête Content-Type ici !
        });
        await fetchbaskets();
        setStep("list");
      } catch (err) {
        console.error("Erreur création :", err);
      }
    })();
  };

  // Edition
  const handleUpdate = (formData: FormData) => {
    void (async () => {
      try {
        const id = formData.get("id") as string;
        await fetch(`http://localhost:3001/baskets/${id}`, {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        await fetchbaskets();
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
          <Tablebaskets
            baskets={baskets}
            onEdit={(basket) => {
              setSelected(basket);
              setStep("edit");
            }}
            onDelete={(basket) => {
              setSelected(basket);
              setShowConfirm(true);
            }}
          />
        </>
      )}

      {step === "create" && (
        <Formbasket
          mode="create"
          onSubmit={handleCreate}
          initialValues={{
            name: "",
            price: "",
            description: "",
            actif: true,
          }}
        />
      )}

      {step === "edit" && selected && (
        <Formbasket
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
