"use client";
import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/adminLayout/AdminHeader";
import Tablebaskets from "@/app/components/AdminBasket/TableBaskets";
import Formbasket from "@/app/components/form/FormBasketAdmin";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

export const dynamic = "force-dynamic";

type Basket = {
  id: string;
  name: string;
  priceEuro: number; // <- number en euros
  description: string;
  actif: boolean;
};

type Backendbasket = {
  id: string;
  name_basket: string;
  price_basket: number | string; // parfois string selon la sérialisation
  description: string;
  actif: boolean;
};

export default function AdminbasketsPage() {
  const [step, setStep] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Basket | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [baskets, setBaskets] = useState<Basket[]>([]);

  const fetchbaskets = async () => {
    const res = await fetch("/api/baskets", { credentials: "include" });
    const data: Backendbasket[] = await res.json();
    const mapped: Basket[] = data.map((b) => ({
      id: b.id,
      name: b.name_basket,
      // ⬇️ plus de /100 ; conversion robuste si string
      priceEuro: Number(b.price_basket),
      description: b.description,
      actif: b.actif,
    }));
    setBaskets(mapped);
  };

  useEffect(() => {
    void fetchbaskets();
  }, []);

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await fetch(`/api/baskets/${selected.id}`, {
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

  async function toggleActif(id: string, next: boolean) {
    // Optimiste local
    setBaskets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, actif: next } : b))
    );
    try {
      // Tentative PATCH partiel
      const r = await fetch(`/api/baskets/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: next }),
      });
      if (r.ok) return;

      // Plan B: certains backends exigent un PUT complet (FormData)
      const current = baskets.find((b) => b.id === id);
      if (!current) return;
      const fd = new FormData();
      fd.append("id", current.id);
      fd.append("name", current.name);
      fd.append("price", String(current.priceEuro.toFixed(2)));
      fd.append("description", current.description ?? "");
      fd.append("actif", String(next));
      const r2 = await fetch(`/api/baskets/${id}`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      });
      if (!r2.ok) throw new Error("PUT non accepté");
    } catch (e) {
      console.error("Erreur toggle actif:", e);
      // rollback
      setBaskets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, actif: !next } : b))
      );
    }
  }

  const handleCreate = (formData: FormData) => {
    void (async () => {
      try {
        await fetch("/api/baskets", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        await fetchbaskets();
        setStep("list");
      } catch (err) {
        console.error("Erreur création :", err);
      }
    })();
  };

  const handleUpdate = (formData: FormData) => {
    void (async () => {
      try {
        const id = formData.get("id") as string;
        await fetch(`/api/baskets/${id}`, {
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
            className="self-end mb-4 px-6 py-2 rounded-full bg-accent text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
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
            onToggleActif={toggleActif} // <- nouveau
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
          initialValues={{
            id: selected.id,
            name: selected.name,
            price: selected.priceEuro.toFixed(2),
            description: selected.description,
            actif: selected.actif,
          }}
        />
      )}

      <ConfirmModal
        open={showConfirm}
        message="Êtes-vous sûr de vouloir supprimer ce panier ?"
        subtext="Cette action est irréversible."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
