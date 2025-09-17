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

/* ------------------------ Utils date (local) ------------------------ */
function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function toYMDLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function nextWeekday(date: Date, targetDow: number): Date {
  const d = new Date(date);
  const diff = (targetDow + 7 - d.getDay()) % 7 || 7; // prochain jour strict
  d.setDate(d.getDate() + diff);
  return d;
}

function computeAllowedDate(now: Date): string | null {
  const dow = now.getDay(); // 0=dim .. 6=sam
  const h = now.getHours();

  // Fenêtre vers MARDI : vendredi 00:00 -> lundi < 18:00
  const inTueWindow =
    dow === 5 || dow === 6 || dow === 0 || (dow === 1 && h < 18);

  if (inTueWindow) {
    const d = startOfDay(nextWeekday(now, 2)); // prochain mardi (strict)
    return toYMDLocal(d);
  }

  // Fenêtre vers VENDREDI : mardi 00:00 -> jeudi < 18:00
  const inFriWindow = dow === 2 || dow === 3 || (dow === 4 && h < 18);

  if (inFriWindow) {
    const d = startOfDay(nextWeekday(now, 5)); // prochain vendredi (strict)
    return toYMDLocal(d);
  }

  // Sinon : fermé
  return null;
}

export default function ReservationForm() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [, setLoading] = useState<boolean>(true);

  const [action, setAction] = useState<"order" | "contact">("order");
  const [locationId, setLocationId] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // panier d’articles : { basketId -> quantité }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [toast, setToast] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // bornes visuelles “neutres” du calendrier
  const today: Date = useMemo(() => startOfDay(new Date()), []);
  const minVisu: string = useMemo(() => toYMDLocal(today), [today]);
  const maxVisu: string = useMemo(() => toYMDLocal(today), [today]);

  // date autorisée unique selon la règle métier
  const [allowedDate, setAllowedDate] = useState<string | null>(null);
  useEffect(() => {
    const a = computeAllowedDate(new Date());
    setAllowedDate(a);
  }, []);

  // calage de la valeur contrôlée sur la date autorisée
  useEffect(() => {
    if (allowedDate && allowedDate !== pickupDate) setPickupDate(allowedDate);
    if (!allowedDate && pickupDate) setPickupDate("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedDate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [bRes, lRes] = await Promise.all([
        fetch(`${API_BASE}/baskets?actif=true`, { credentials: "include" }),
        fetch(`${API_BASE}/pickup?actif=true`, { credentials: "include" }),
      ]);
      const bJson = (await bRes.json()) as Basket[];
      const lJson = (await lRes.json()) as PickupLocation[];

      setBaskets(bJson.filter((b) => b.actif === true));
      const locs = lJson.filter((l) => l.actif === true);
      setLocations(locs);

      // auto-sélection “Gare”
      const gare = locs.find(
        (l) => l.name_pickup.trim().toLowerCase() === "gare"
      );
      setLocationId(gare ? gare.id : "");
      setLoading(false);
    })();
  }, []);

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
      const n = Math.max(0, Math.min(99, Math.trunc(q)));
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }

  function toOrderPayload(params: {
    locationId: string;
    pickupDate: string;
    cartLines: { basket: Basket; quantity: number }[];
  }) {
    return {
      locationId: params.locationId || undefined,
      pickupDate: params.pickupDate, // 'YYYY-MM-DD'
      items: params.cartLines.map((l) => ({
        basketId: l.basket.id,
        quantity: l.quantity, // 1..99 (la DB contraint à 1..5 si tu l’as en CHECK)
      })),
    };
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

    if (pickupDate !== allowedDate) {
      setToast({
        type: "err",
        text: "Créneau fermé. Commande possible uniquement pour le mardi ou le vendredi selon la fenêtre d’ouverture.",
      });
      setTimeout(() => setToast(null), 3000);
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
    // Cohérence jour/lieu côté client (info visuelle)
    const dow = new Date(pickupDate + "T00:00:00").getDay();
    const loc = locations.find((l) => l.id === locationId);
    if (typeof loc?.day_of_week === "number" && dow !== loc.day_of_week) {
      setToast({
        type: "err",
        text: `Ce lieu est disponible le ${JOURS[loc.day_of_week]}.`,
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    // Normalisation des quantités (1..5)
    const normalizedLines = cartLines.map((l) => {
      const q = Math.max(1, Math.min(5, l.quantity));
      return { basket: l.basket, quantity: q };
    });

    if (normalizedLines.some((l, i) => l.quantity !== cartLines[i].quantity)) {
      setToast({
        type: "err",
        text: "Quantité maximale par type de panier : 5.",
      });
      setTimeout(() => setToast(null), 2600);
    }

    // --- construire le payload avec normalizedLines ---
    const payload = toOrderPayload({
      locationId,
      pickupDate,
      cartLines: normalizedLines,
    });

    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Message d’erreur lisible (limite journalière, jour invalide, etc.)
      let msg = `Erreur ${res.status}`;
      try {
        const body = (await res.json()) as { message?: string | string[] };
        msg = Array.isArray(body?.message)
          ? body.message.join(" • ")
          : body?.message ?? msg;
      } catch {
        // noop
      }
      setToast({ type: "err", text: msg });
      setTimeout(() => setToast(null), 3200);
      return;
    }

    // Succès
    setToast({
      type: "ok",
      text: `Réservation enregistrée. Total à régler sur place : ${eur.format(
        total
      )}.`,
    });

    // Remise à zéro douce
    setQuantities({});
    setLocationId("");
    setPickupDate("");
    setMessage("");
    setTimeout(() => setToast(null), 3200);
  }

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
                {baskets
                  .filter((b) => b.actif === true)
                  .map((b) => {
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
                            className="w-8 h-8 rounded-full border-2 text-lg leading-none"
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
                            className="w-14 text-center rounded border-2 px-2 py-1"
                            aria-label={`Quantité ${b.name_basket}`}
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(b.id, q + 1)}
                            className="w-8 h-8 rounded-full border-2 text-lg leading-none"
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
                <p className="text-gray-700">Total à régler sur place</p>
                <p className="text-xl font-semibold">{eur.format(total)}</p>
              </div>
            </div>
          )}

          {/* Lieu + date */}
          {action === "order" && (
            <PickupCard
              locations={locations}
              locationId={locationId}
              onLocation={setLocationId}
              pickupDate={pickupDate}
              onDate={setPickupDate}
              minDate={minVisu}
              maxDate={maxVisu}
              allowedDate={allowedDate}
              disabled={!allowedDate}
              required={true}
            />
          )}

          {/* Message libre */}
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
