"use client";

import { useEffect, useMemo, useState } from "react";
import ReservationHero from "../reservation/ReservationHero";
import ReservationIntro from "../reservation/ReservationIntro";
import ActionChoice from "../reservation/ActionChoice";
import BasketCards from "../reservation/BasketCards";
import PickupCard from "../reservation/PickupCard";
import Toast from "../reservation/ReservationToast";

/* ---- Types ---- */
type Basket = {
  id: string;
  name_basket: string;
  price_basket: number;
  actif: boolean;
  // facultatifs si déjà fournis par /baskets
  description_basket?: string | null;
  composition?: string[] | null;
};

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week: number; // 0..6
  actif: boolean;
};

type BasketDetails = {
  description?: string | null;
  composition?: string[] | null;
};

type ReservationPayload = {
  basket_id: string;
  location_id: string;
  pickup_date: string; // YYYY-MM-DD
  quantity: number;
  message?: string | null;
};

export default function ReservationForm() {
  /* ---- Données listes ---- */
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---- Détails panier (cache local) ---- */
  const [basketDetailsMap, setBasketDetailsMap] = useState<
    Record<string, BasketDetails>
  >({});

  /* ---- Action / champs ---- */
  const [action, setAction] = useState<"order" | "contact">("order");
  const [basketId, setBasketId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  /* ---- Toast ---- */
  const [toast, setToast] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* ---- Chargement des listes ---- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [bRes, lRes] = await Promise.all([
        fetch("http://localhost:3001/baskets?actif=true", {
          credentials: "include",
        }),
        fetch("http://localhost:3001/pickup?actif=true", {
          credentials: "include",
        }),
      ]);
      const bJson = (await bRes.json()) as Basket[];
      const lJson = (await lRes.json()) as PickupLocation[];
      setBaskets(bJson);
      setLocations(lJson);
      setLoading(false);
    })();
  }, []);

  /* ---- Bornes de date ---- */
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().slice(0, 10);
  }, []);

  /* ---- Chargeur de détails d’un panier ---- */
  async function loadBasketDetails(id: string) {
    // si la liste contient déjà des infos exploitables
    const fromList = baskets.find((b) => b.id === id);
    if (fromList && (fromList.description_basket || fromList.composition)) {
      setBasketDetailsMap((prev) => ({
        ...prev,
        [id]: {
          description: fromList.description_basket ?? null,
          composition: fromList.composition ?? null,
        },
      }));
      return;
    }

    // si déjà en cache
    if (basketDetailsMap[id]) return;

    // requête dédiée
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/baskets/${id}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        const details: BasketDetails = {
          description: data.description_basket ?? data.description ?? null,
          composition: data.composition ?? null,
        };
        setBasketDetailsMap((prev) => ({ ...prev, [id]: details }));
      }
    } catch {
      // silencieux : absence de détails = pas de rendu additionnel
    }
  }

  /* ---- Submit ---- */
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (action !== "order") {
      setToast({
        type: "ok",
        text: "Message prêt. Un endpoint /contact peut le recevoir.",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    const payload: ReservationPayload = {
      basket_id: basketId,
      location_id: locationId,
      pickup_date: pickupDate,
      quantity,
      message: message || null,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservations`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      setToast({ type: "ok", text: "Réservation enregistrée." });
      setBasketId("");
      setLocationId("");
      setPickupDate("");
      setQuantity(1);
      setMessage("");
    } else {
      const err = await res.text();
      setToast({ type: "err", text: err || "Erreur inconnue" });
    }
    setTimeout(() => setToast(null), 2800);
  }

  if (loading) return <p className="text-center py-10">Chargement…</p>;

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
      <ReservationHero />
      <ReservationIntro />

      <section className="container mx-auto px-4 py-6">
        <ActionChoice value={action} onChange={setAction} />

        <form
          onSubmit={submit}
          className={
            action === "order"
              ? "mx-auto mt-6 grid gap-6 max-w-5xl md:grid-cols-2"
              : "mx-auto mt-6 max-w-3xl"
          }
        >
          {/* ----- Mode COMMANDER : cartes panier + carte retrait ----- */}
          {action === "order" && (
            <>
              <BasketCards
                baskets={baskets}
                selectedId={basketId}
                onSelect={(id) => {
                  setBasketId(id);
                  loadBasketDetails(id);
                }}
                disabled={false}
                required={true}
                quantity={quantity}
                onQuantity={setQuantity}
                activeDetails={
                  basketId ? basketDetailsMap[basketId] : undefined
                }
              />

              <PickupCard
                locations={locations}
                locationId={locationId}
                onLocation={setLocationId}
                pickupDate={pickupDate}
                onDate={setPickupDate}
                minDate={minDate}
                maxDate={maxDate}
                disabled={false}
                required={true}
              />
            </>
          )}

          {/* ----- Zone message : seule section visible en mode NOUS ÉCRIRE ----- */}
          <div className={action === "order" ? "md:col-span-2" : ""}>
            <label className="block text-sm mb-1">Votre message</label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-28"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              // champ requis uniquement en mode "nous écrire"
              required={action === "contact"}
              placeholder={
                action === "contact" ? "Écrire le message ici…" : undefined
              }
            />
          </div>

          {/* ----- Bouton ----- */}
          <div className={action === "order" ? "md:col-span-2" : "mt-4"}>
            <button
              type="submit"
              className="cursor-pointer rounded-full px-6 py-2 text-white bg-[var(--color-primary)]
                   shadow-sm hover:brightness-95 active:brightness-90 transition
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            >
              {action === "order"
                ? "Je confirme ma réservation"
                : "Envoyer le message"}
            </button>
          </div>
        </form>

        {/* Bloc adresse en bas, inchangé */}
        <div className="mx-auto max-w-xl mt-10 text-center">
          <h2
            className="text-xl mb-2"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Pour vous rendre à l’exploitation
          </h2>
          <p>EARL Dureau</p>
          <p>203 rue des Fontenelles</p>
          <p>44320 CHAUMES-EN-RETZ</p>
          <p>TEL : 02 40 21 82 63</p>
        </div>
      </section>

      {toast ? <Toast type={toast.type} text={toast.text} /> : null}
    </main>
  );
}
