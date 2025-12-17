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
  priceEuro: number;
  description: string;
  actif: boolean;
};

type Backendbasket = {
  id: string;
  name_basket: string;
  price_basket: number | string;
  description: string;
  actif: boolean;
};

type ApiError = { message?: string } | null;

async function readErrorMessage(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (ct.includes("application/json")) {
    try {
      const json = JSON.parse(text) as { message?: string };
      return json.message ?? `HTTP ${res.status}`;
    } catch {
      return `HTTP ${res.status}`;
    }
  }

  if (text.includes("<!DOCTYPE")) return `HTTP ${res.status} (réponse HTML)`;
  return text || `HTTP ${res.status}`;
}

async function readJsonOrText(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

async function requestJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const payload = await readJsonOrText(res);
    if (typeof payload === "string") {
      throw new Error(payload || `HTTP ${res.status}`);
    }
    const maybe = payload as ApiError;
    throw new Error(maybe?.message || `HTTP ${res.status}`);
  }

  const payload = await readJsonOrText(res);
  return payload as T;
}

export default function AdminbasketsPage() {
  const [step, setStep] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Basket | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchbaskets = async () => {
    const res = await fetch("/api/baskets", { credentials: "include" });

    if (!res.ok) {
      const msg = await readErrorMessage(res);
      console.error("Erreur fetch baskets:", msg);
      setBaskets([]);
      return;
    }

    const data = (await res.json()) as Backendbasket[];
    const mapped: Basket[] = data.map((b) => ({
      id: b.id,
      name: b.name_basket,
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

    const id = selected.id;

    const res = await fetch(`/api/baskets/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const msg = await readErrorMessage(res);
      console.error("Erreur suppression panier:", msg);
      setShowConfirm(false);
      setSelected(null);
      return;
    }

    setBaskets((prev) => prev.filter((b) => b.id !== id));
    setShowConfirm(false);
    setSelected(null);
  };

  async function toggleActif(id: string, next: boolean) {
    setError(null);

    setBaskets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, actif: next } : b))
    );

    try {
      await requestJson<unknown>(`/api/baskets/${id}/actif`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: next }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur activation panier");
      setBaskets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, actif: !next } : b))
      );
    }
  }

  const handleCreate = (formData: FormData) => {
    void (async () => {
      const res = await fetch("/api/baskets", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const msg = await readErrorMessage(res);
        console.error("Erreur création panier:", msg);
        return;
      }

      await fetchbaskets();
      setStep("list");
    })();
  };

  const handleUpdate = (formData: FormData) => {
    void (async () => {
      const id = String(formData.get("id") ?? "");
      if (!id) {
        console.error("Impossible de modifier : id manquant");
        return;
      }

      const res = await fetch(`/api/baskets/${encodeURIComponent(id)}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const msg = await readErrorMessage(res);
        console.error("Erreur modification panier:", msg);
        return;
      }

      await fetchbaskets();
      setStep("list");
      setSelected(null);
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

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

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
            onToggleActif={toggleActif}
          />
        </>
      )}

      {step === "create" && (
        <Formbasket
          mode="create"
          onSubmit={handleCreate}
          initialValues={{ name: "", price: "", description: "", actif: true }}
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
