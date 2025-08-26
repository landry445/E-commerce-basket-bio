"use client";

import { useEffect, useMemo, useState } from "react";
import ReservationHero from "../reservation/ReservationHero";
import ReservationIntro from "../reservation/ReservationIntro";
import ActionChoice from "../reservation/ActionChoice";
import PickupCard from "../reservation/PickupCard";
import Toast from "../reservation/ReservationToast";
import BasketCard from "../reservation/BasketCards";

type Basket = {
  id: string;
  name_basket: string;
  price_basket: number;
  actif: boolean;
  description_basket?: string | null;
  composition?: string[] | null;
};

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week: number;
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
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [basketDetailsMap, setBasketDetailsMap] = useState<
    Record<string, BasketDetails>
  >({});

  const [action, setAction] = useState<"order" | "contact">("order");
  const [basketId, setBasketId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const [toast, setToast] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

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

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().slice(0, 10);
  }, []);

  async function loadBasketDetails(id: string) {
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
    if (basketDetailsMap[id]) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/baskets/${id}`,
        {
          credentials: "include",
        }
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
      // silencieux
    }
  }

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

  const activeDetails = basketId ? basketDetailsMap[basketId] : undefined;

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
      <ReservationHero />
      <ReservationIntro />

      <section className="container mx-auto px-4 py-8">
        <form
          onSubmit={submit}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6"
        >
          <ActionChoice value={action} onChange={setAction} />

          {action === "order" && (
            <BasketCard
              baskets={baskets}
              selectedId={basketId}
              onSelect={(id) => {
                setBasketId(id);
                loadBasketDetails(id);
              }}
              activeDetails={activeDetails}
              quantity={quantity}
              onQuantity={setQuantity}
              disabled={false}
              required={true}
            />
          )}

          {action === "order" && (
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
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Votre message
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-28"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required={action === "contact"}
              placeholder={
                action === "contact" ? "Écrire le message ici…" : undefined
              }
            />
          </div>

          <div className="pt-4 border-t text-center">
            <button
              type="submit"
              className="cursor-pointer rounded-full px-6 py-2 text-white bg-[var(--color-primary)]
                         shadow hover:brightness-95 active:brightness-90 transition
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            >
              {action === "order"
                ? "Je confirme ma réservation"
                : "Envoyer le message"}
            </button>
          </div>
        </form>

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
