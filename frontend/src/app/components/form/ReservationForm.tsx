"use client";

import { useEffect, useMemo, useState } from "react";
import ReservationHero from "../reservation/ReservationHero";
import ReservationIntro from "../reservation/ReservationIntro";
import ActionChoice from "../reservation/ActionChoice";
import PickupCard from "../reservation/PickupCard";
import Toast from "../reservation/ReservationToast";

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
  day_of_week: number; // 0..6
  actif: boolean;
};

const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const JOURS: ReadonlyArray<string> = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export default function ReservationForm() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState<"order" | "contact">("order");
  const [locationId, setLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");

  // panier d’articles : { basketId -> quantité }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [toast, setToast] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [bRes, lRes] = await Promise.all([
        fetch(`${API_BASE}/baskets?actif=true`, { credentials: "include" }),
        fetch(`${API_BASE}/pickup?actif=true`, { credentials: "include" }),
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

  // lignes du panier sélectionné
  const cartLines = useMemo(
    () =>
      baskets
        .map((b) => ({
          basket: b,
          quantity: quantities[b.id] ?? 0,
          lineTotal: (quantities[b.id] ?? 0) * b.price_basket,
        }))
        .filter((l) => l.quantity > 0),
    [baskets, quantities]
  );

  const total = useMemo(
    () => cartLines.reduce((s, l) => s + l.lineTotal, 0),
    [cartLines]
  );

  function setQuantity(id: string, q: number) {
    setQuantities((prev) => {
      const next = { ...prev };
      if (q <= 0) {
        delete next[id];
      } else {
        next[id] = Math.min(99, q);
      }
      return next;
    });
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

    if (!locationId || !pickupDate) {
      setToast({ type: "err", text: "Choisir un lieu et une date." });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    if (cartLines.length === 0) {
      setToast({
        type: "err",
        text: "Choisir au moins un type de panier (quantité > 0).",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    // garde jour/lieu côté client (évite le rejet par trigger SQL)
    const loc = locations.find((l) => l.id === locationId);
    const dow = new Date(pickupDate + "T00:00:00").getDay();
    if (loc && dow !== loc.day_of_week) {
      setToast({
        type: "err",
        text: `Ce lieu est disponible le ${JOURS[loc.day_of_week]}.`,
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    // un POST /reservations par ligne du panier
    const errors: string[] = [];
    for (const line of cartLines) {
      const payload = {
        basket_id: line.basket.id,
        location_id: locationId,
        pickup_date: pickupDate,
        quantity: line.quantity,
      };

      const res = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const msg = Array.isArray(body?.message)
          ? body!.message.join(" • ")
          : body?.message ?? "Requête invalide";
        errors.push(`${line.basket.name_basket} : ${msg}`);
      }
    }

    if (errors.length > 0) {
      setToast({ type: "err", text: errors.join(" • ") });
    } else {
      setToast({
        type: "ok",
        text: `Réservations enregistrées. Total estimé : ${eur.format(total)}.`,
      });
      setQuantities({});
      setLocationId("");
      setPickupDate("");
      setMessage("");
    }
    setTimeout(() => setToast(null), 3200);
  }

  if (loading) return <p className="text-center py-10">Chargement…</p>;

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

          {/* Sélecteur multi-paniers avec sous-totaux */}
          {action === "order" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Vos paniers</h3>
              <div className="divide-y rounded-xl border">
                {baskets.map((b) => {
                  const q = quantities[b.id] ?? 0;
                  const lineTotal = q * b.price_basket;
                  return (
                    <div
                      key={b.id}
                      className="grid grid-cols-12 items-center gap-3 p-3"
                    >
                      <div className="col-span-6">
                        <p className="font-medium">{b.name_basket}</p>
                        {b.description_basket ? (
                          <p className="text-xs text-gray-600">
                            {b.description_basket}
                          </p>
                        ) : null}
                      </div>

                      <div className="col-span-3 text-right">
                        <p className="tabular-nums">
                          {eur.format(b.price_basket)}
                        </p>
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(b.id, q - 1)}
                          className="w-8 h-8 rounded-full border text-lg leading-none"
                          aria-label={`Retirer 1 ${b.name_basket}`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={q}
                          onChange={(e) =>
                            setQuantity(b.id, Number(e.target.value))
                          }
                          className="w-14 text-center rounded border px-2 py-1"
                          aria-label={`Quantité ${b.name_basket}`}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(b.id, q + 1)}
                          className="w-8 h-8 rounded-full border text-lg leading-none"
                          aria-label={`Ajouter 1 ${b.name_basket}`}
                        >
                          +
                        </button>
                      </div>

                      {q > 0 && (
                        <div className="col-span-12 text-right text-sm text-gray-700">
                          Sous-total {b.name_basket} :{" "}
                          <span className="font-semibold">
                            {eur.format(lineTotal)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total général */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-700">Total estimé à régler sur place</p>
                <p className="text-xl font-semibold">{eur.format(total)}</p>
              </div>
            </div>
          )}

          {/* Lieu + date avec garde jour/lieu */}
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

          {/* Message libre (non transmis au /reservations) */}
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
            {action === "order" && (
              <p className="text-xs text-gray-600 mt-2">
                Le montant affiché sert d’estimation. Le total final reste
                calculé sur le serveur.
              </p>
            )}
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
