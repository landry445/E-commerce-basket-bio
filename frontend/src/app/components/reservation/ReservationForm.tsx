"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";

import ReservationHero from "../reservation/ReservationHero";
import ReservationIntro from "../reservation/ReservationIntro";
import ActionChoice from "../reservation/ActionChoice";
import PickupCard from "../reservation/PickupCard";
import Toast from "../reservation/ReservationToast";
import { isBookingOpenClient } from "@/app/lib/bookingWindow";
import Image from "next/image";

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
  day_of_week?: number[] | null;
  actif: boolean;
};

type BulkResponse = { groupId: string };

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

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeekMonday(base: Date): Date {
  const d = new Date(base);
  const dow = d.getDay();
  const diffToMonday = (dow + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}
function nextDowOnOrAfter(from: Date, targetDow: number): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  while (d.getDay() !== targetDow) d.setDate(d.getDate() + 1);
  return d;
}
function allowedPickupDate(now = new Date()): string {
  // Choisit automatiquement la prochaine date de retrait conforme à la fenêtre en cours
  // Si fenêtre "mardi" ouverte -> mardi courant ; si "vendredi" ouverte -> vendredi courant
  // Sinon prochain mardi/vendredi cohérent.
  const d = new Date(now);
  d.setSeconds(0, 0);

  const weekMonday = startOfWeekMonday(d);
  const tuesday = new Date(weekMonday);
  tuesday.setDate(weekMonday.getDate() + 1);
  const thursday = new Date(weekMonday);
  thursday.setDate(weekMonday.getDate() + 3);
  const friday = new Date(weekMonday);
  friday.setDate(weekMonday.getDate() + 4);

  // fenêtres
  const tueStart = new Date(friday);
  tueStart.setDate(friday.getDate() - 0 - 0);
  tueStart.setHours(18, 0, 0, 0); // ven 18:00
  const tueEnd = new Date(tuesday);
  tueEnd.setHours(8, 0, 0, 0); // mar 08:00

  const friStart = new Date(tuesday);
  friStart.setHours(18, 0, 0, 0); // mar 18:00
  const friEnd = new Date(thursday);
  friEnd.setHours(8, 0, 0, 0); // jeu 08:00

  if (d >= tueStart && d < tueEnd) return toYMD(tuesday); // mardi courant
  if (d >= friStart && d < friEnd) return toYMD(friday); // vendredi courant

  // sinon, choisir le prochain créneau logique (prochain mardi ou vendredi)
  const nextTue = nextDowOnOrAfter(d, 2);
  const nextFri = nextDowOnOrAfter(d, 5);
  // heuristique simple : prendre le plus proche
  return toYMD(nextTue <= nextFri ? nextTue : nextFri);
}

export default function ReservationForm(): JSX.Element {
  const router = useRouter();

  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState<"order" | "contact">("order");
  const [locationId, setLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const kind: "tuesday" | "friday" | null = useMemo(() => {
    if (!pickupDate) return null;
    const d = new Date(pickupDate + "T00:00:00");
    return d.getDay() === 2 ? "tuesday" : d.getDay() === 5 ? "friday" : null;
  }, [pickupDate]);

  const open: boolean = useMemo(() => {
    if (!kind || !pickupDate) return false;
    return isBookingOpenClient(kind, pickupDate);
  }, [kind, pickupDate]);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return toYMD(d);
  }, []);

  useEffect(() => {
    setPickupDate(allowedPickupDate(new Date()));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [bRes, lRes] = await Promise.all([
        fetch(`${API_BASE}/baskets?actif=true`, { credentials: "include" }),
        fetch(`${API_BASE}/pickup?actif=true`, { credentials: "include" }),
      ]);

      const bJson = (await bRes.json()) as Basket[];
      const lJson = (await lRes.json()) as PickupLocation[];

      const onlyActiveBaskets = bJson.filter((b) => b.actif === true);
      const onlyActiveLocations = lJson.filter((l) => l.actif === true);

      setBaskets(onlyActiveBaskets);
      setLocations(onlyActiveLocations);

      const gare = onlyActiveLocations.find(
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
      const clamped = Math.max(0, Math.min(99, Math.trunc(q)));
      if (clamped <= 0) delete next[id];
      else next[id] = clamped;
      return next;
    });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (action !== "order") {
      const payload = {
        message: message.trim(),
        // subject: "Message client – réservation", // optionnel si tu ajoutes un champ sujet
      };

      if (!payload.message || payload.message.length < 3) {
        setToast({ type: "err", text: "Message trop court." });
        setTimeout(() => setToast(null), 2600);
        return;
      }

      if (!API_BASE) {
        setToast({
          type: "err",
          text: "NEXT_PUBLIC_API_BASE_URL manquant côté frontend.",
        });
        setTimeout(() => setToast(null), 2600);
        return;
      }

      const res = await fetch(`${API_BASE}/mail/contact`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (res.status === 401) {
        setToast({ type: "err", text: "Connexion requise." });
        setTimeout(() => setToast(null), 2600);
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const msg = Array.isArray(body?.message)
          ? body!.message.join(" • ")
          : body?.message ?? "Échec de l’envoi.";
        setToast({ type: "err", text: msg });
        setTimeout(() => setToast(null), 3200);
        return;
      }

      setToast({
        type: "ok",
        text: "Merci pour votre message, on revient vers vous au plus vite !",
      });
      setMessage("");
      setTimeout(() => setToast(null), 5000);
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

    const d = new Date(pickupDate + "T00:00:00");
    const dow = d.getDay();
    if (!(dow === 2 || dow === 5)) {
      setToast({ type: "err", text: "Retrait le mardi ou le vendredi." });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    const loc = locations.find((l) => l.id === locationId);
    if (
      loc?.day_of_week &&
      Array.isArray(loc.day_of_week) &&
      loc.day_of_week.length > 0
    ) {
      if (!loc.day_of_week.includes(dow)) {
        const joursLisibles = loc.day_of_week
          .map((n) => JOURS[n] ?? String(n))
          .join(" ou ");
        setToast({
          type: "err",
          text: `Ce lieu est disponible le ${joursLisibles}.`,
        });
        setTimeout(() => setToast(null), 2600);
        return;
      }
    }

    // ---- POST /reservations/bulk ----
    const payload = {
      location_id: locationId,
      pickup_date: pickupDate,
      customer_note: message.trim() || undefined,
      items: cartLines.map((l) => ({
        basket_id: l.basket.id,
        quantity: l.quantity,
      })),
    };

    const res = await fetch(`${API_BASE}/reservations/bulk`, {
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
      setToast({ type: "err", text: msg });
      setTimeout(() => setToast(null), 3200);
      return;
    }

    const data = (await res.json()) as BulkResponse;
    // const firstId: string | undefined =
    //   Array.isArray(data.groupId) && data.groupId.length > 0
    //     ? data.groupId[0]
    //     : undefined;

    setToast({
      type: "ok",
      text: `Réservation enregistrée. Un e-mail de confirmation vient d’être envoyé. Total à régler : ${eur.format(
        total
      )}.`,
    });

    router.replace(`/reserver/confirmee/${data.groupId}`);
  }

  const allowedDate = useMemo(() => allowedPickupDate(new Date()), []);

  const hasItems = cartLines.length > 0;

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
      <ReservationHero />
      <ReservationIntro />

      <section className="container mx-auto px-4 py-8">
        <form
          onSubmit={submit}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <ActionChoice value={action} onChange={setAction} />

          {action === "order" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Vos paniers</h3>

              {/* Liste des paniers */}
              <div className="divide-y rounded-xl border bg-white">
                {baskets
                  .filter((b) => b.actif === true)
                  .map((b) => {
                    const q = quantities[b.id] ?? 0;
                    const lineTotal = q * b.price_basket;

                    return (
                      <div key={b.id} className="p-3 md:p-4">
                        {/* Grille responsive anti-chevauchement */}
                        <div
                          className="
                            grid items-center gap-3 md:gap-4
                            grid-cols-[56px_1fr_auto]
                            md:grid-cols-[56px_minmax(0,1fr)_110px_160px_92px]
                            max-[600px]:grid-cols-[56px_minmax(0,1fr)]"
                        >
                          {/* Image */}
                          <div className="col-span-1">
                            <Image
                              src={`${API_BASE}/baskets/${b.id}/image`}
                              alt={b.name_basket}
                              width={56}
                              height={56}
                              className="rounded shadow"
                              unoptimized
                              crossOrigin="anonymous"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "/panier-legumes.webp";
                              }}
                            />
                          </div>

                          {/* Infos + lien Détails (mobile: en dessous) */}
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {b.name_basket}
                            </p>
                            {b.description_basket ? (
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {b.description_basket}
                              </p>
                            ) : null}

                            {/* Détails visible ici en mobile uniquement */}
                            <div className="mt-2 md:hidden">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                                aria-label={`Détails ${b.name_basket}`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    stroke="currentColor"
                                  />
                                  <rect
                                    x="11"
                                    y="10"
                                    width="2"
                                    height="7"
                                    rx="1"
                                  />
                                  <rect
                                    x="11"
                                    y="7"
                                    width="2"
                                    height="2"
                                    rx="1"
                                  />
                                </svg>
                                Détails
                              </button>
                            </div>
                          </div>

                          {/* Prix */}
                          <div className="hidden md:block text-right tabular-nums whitespace-nowrap">
                            {eur.format(b.price_basket)}
                          </div>

                          {/* Stepper : largeur et espace garantis */}
                          <div
                            className="justify-self-end
                            max-[600px]:col-span-2     
                            max-[600px]:mt-2           
                            max-[600px]:justify-self-end"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <button
                                type="button"
                                onClick={() => setQuantity(b.id, q - 1)}
                                aria-label={`Retirer 1 ${b.name_basket}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2"
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
                                className="no-spinner w-12 text-center rounded border-2 px-2 py-2"
                                aria-label={`Quantité ${b.name_basket}`}
                                inputMode="numeric"
                              />

                              <button
                                type="button"
                                onClick={() => setQuantity(b.id, q + 1)}
                                aria-label={`Ajouter 1 ${b.name_basket}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Détails (≥ md) : zone dédiée à l’extrémité droite */}
                          <div className="hidden md:block justify-self-end">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                              aria-label={`Détails ${b.name_basket}`}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                aria-hidden
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  fill="none"
                                  stroke="currentColor"
                                />
                                <rect
                                  x="11"
                                  y="10"
                                  width="2"
                                  height="7"
                                  rx="1"
                                />
                                <rect
                                  x="11"
                                  y="7"
                                  width="2"
                                  height="2"
                                  rx="1"
                                />
                              </svg>
                              Détails
                            </button>
                          </div>

                          {/* Sous-total si q > 0, toute largeur sous la rangée */}
                          {q > 0 && (
                            <div className="col-span-3 md:col-span-5 order-last text-right text-sm text-gray-700">
                              Sous-total {b.name_basket} :{" "}
                              <span className="font-semibold">
                                {eur.format(lineTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Total (desktop/tablette) */}
              <div className="mt-4 hidden sm:flex items-center justify-between">
                <p className="text-gray-700">Total à régler sur place</p>
                <p className="text-xl font-semibold">{eur.format(total)}</p>
              </div>
            </div>
          )}

          {action === "order" && (
            <PickupCard
              locations={locations}
              locationId={locationId}
              onLocation={setLocationId}
              pickupDate={pickupDate}
              onDate={setPickupDate}
              maxDate={maxDate}
              allowedDate={allowedDate}
              disabled={loading}
              required
            />
          )}

          {/* Message client */}
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
                action === "contact"
                  ? "Besoin d’une précision ?"
                  : "Exemple : remplacer le fenouil par des carottes"
              }
            />
          </div>

          {/* CTA principal (desktop/tablette) */}
          <div className="pt-4 border-t text-center hidden sm:block">
            <button
              type="submit"
              disabled={action === "order" && !open}
              className="cursor-pointer rounded-full px-6 py-2 text-white bg-[var(--color-primary)]
               shadow hover:brightness-95 active:brightness-90 transition
               focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40
               disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {action === "order"
                ? "Je confirme ma réservation"
                : "Envoyer le message"}
            </button>
            {action === "order" && kind ? (
              <p className="text-sm mt-2">
                {open
                  ? "Réservations ouvertes pour ce créneau"
                  : "Réservations fermées pour ce créneau"}
              </p>
            ) : null}
          </div>
        </form>

        {/* Infos contact inchangées */}
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

      {/* NEW — barre récap mobile collée en bas */}
      {action === "order" && hasItems && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t">
          <div className="mx-auto max-w-3xl flex items-center justify-between gap-3 px-4 py-3">
            <div className="text-base">
              <span className="text-gray-600">Total</span>{" "}
              <span className="font-semibold">{eur.format(total)}</span>
            </div>
            <button
              type="button"
              // onClick du formulaire parent via submit programmatique :
              onClick={() => {
                const form = document.querySelector("form");
                form?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
              disabled={!open}
              className="rounded-full px-5 py-2 text-white bg-[var(--color-primary)]
               shadow hover:brightness-95 active:brightness-90 transition
               disabled:opacity-40"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {toast ? <Toast type={toast.type} text={toast.text} /> : null}
    </main>
  );
}
