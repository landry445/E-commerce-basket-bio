"use client";

import { FormEvent, useState } from "react";
import { BasketItemForm, NewsletterFormData } from "./newsletterTypes";
import { buildNewsletterBody, formatDateTitle } from "./newsletterHtml";

type NewsletterFormProps = {
  totalSubscribers: number;
  sending: boolean;
  remoteError: string | null;
  remoteSuccess: string | null;
  onSend: (form: NewsletterFormData) => Promise<void> | void;
};

export function NewsletterForm(props: NewsletterFormProps) {
  const { totalSubscribers, sending, remoteError, remoteSuccess, onSend } =
    props;

  const [subject, setSubject] = useState<string>("");
  const [pickupDateISO, setPickupDateISO] = useState<string>("");

  // prix par défaut
  const [basket10PriceEuro, setBasket10PriceEuro] = useState<string>("10");
  const [basket15PriceEuro, setBasket15PriceEuro] = useState<string>("15");

  const [basket10Items, setBasket10Items] = useState<BasketItemForm[]>([
    { label: "", price: "" },
  ]);
  const [basket15Items, setBasket15Items] = useState<BasketItemForm[]>([
    { label: "", price: "" },
  ]);

  const [localError, setLocalError] = useState<string | null>(null);

  function handleItemChange(
    kind: "10" | "15",
    index: number,
    field: "label" | "price",
    value: string
  ): void {
    const updater = (items: BasketItemForm[]): BasketItemForm[] =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );

    if (kind === "10") {
      setBasket10Items((prev) => updater(prev));
    } else {
      setBasket15Items((prev) => updater(prev));
    }
  }

  function addItem(kind: "10" | "15"): void {
    const empty: BasketItemForm = { label: "", price: "" };
    if (kind === "10") {
      setBasket10Items((prev) => [...prev, empty]);
    } else {
      setBasket15Items((prev) => [...prev, empty]);
    }
  }

  function removeItem(kind: "10" | "15", index: number): void {
    if (kind === "10") {
      setBasket10Items((prev) => prev.filter((_, i) => i !== index));
    } else {
      setBasket15Items((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function hasAtLeastOneItem(): boolean {
    const ten = basket10Items.some((i) => i.label.trim() && i.price.trim());
    const fifteen = basket15Items.some((i) => i.label.trim() && i.price.trim());
    return ten || fifteen;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setLocalError(null);

    const trimmedSubject = subject.trim();

    if (!trimmedSubject || !pickupDateISO || !hasAtLeastOneItem()) {
      setLocalError(
        "Sujet, date et au moins une ligne de panier restent nécessaires."
      );
      return;
    }

    if (totalSubscribers === 0) {
      setLocalError("Aucun abonné pour cette newsletter.");
      return;
    }

    const confirmed = window.confirm(
      `Envoi de la newsletter à ${totalSubscribers} abonné(s).`
    );
    if (!confirmed) return;

    const formData: NewsletterFormData = {
      subject: trimmedSubject,
      pickupDateISO,
      basket10Items,
      basket15Items,
      basket10PriceEuro,
      basket15PriceEuro,
    };

    await onSend(formData);
  }

  const previewBody = buildNewsletterBody(
    {
      pickupDateISO,
      basket10Items,
      basket15Items,
      basket10PriceEuro,
      basket15PriceEuro,
    },
    "preview"
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
      <h2
        className="mb-4 text-xl"
        style={{ fontFamily: "var(--font-pacifico)" }}
      >
        Rédiger une newsletter
      </h2>

      <p className="mb-4 text-xs text-gray-600">
        Description des paniers pour le mardi ou le vendredi. Aucune publicité,
        uniquement les compositions et les informations pratiques.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Sujet */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sujet
          </label>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            placeholder="Paniers du vendredi 18 novembre"
          />
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date de retrait
          </label>
          <input
            type="date"
            value={pickupDateISO}
            onChange={(event) => setPickupDateISO(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
          />
          {pickupDateISO && (
            <p className="mt-1 text-xs text-gray-500">
              Titre généré : {formatDateTitle(pickupDateISO)}
            </p>
          )}
        </div>

        {/* Colonnes paniers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Panier 10 € */}
          <div>
            <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-800">
              <span>Panier à</span>
              <input
                type="number"
                min={0}
                step="0.5"
                value={basket10PriceEuro}
                onChange={(event) => setBasket10PriceEuro(event.target.value)}
                className="w-16 rounded-md border border-gray-300 px-2 py-0.5 text-right text-sm"
              />
              <span>€</span>
            </h3>
            <div className="space-y-2">
              {basket10Items.map((item, index) => (
                <div
                  key={`b10-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_80px_auto] gap-2"
                >
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="125 g mâche"
                    value={item.label}
                    onChange={(event) =>
                      handleItemChange("10", index, "label", event.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm text-right"
                    placeholder="1,50"
                    value={item.price}
                    onChange={(event) =>
                      handleItemChange("10", index, "price", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 underline"
                    onClick={() => removeItem("10", index)}
                    disabled={basket10Items.length === 1}
                  >
                    Retrait
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-xs text-[var(--color-primary)] underline"
              onClick={() => addItem("10")}
            >
              Nouvelle ligne
            </button>
          </div>

          {/* Panier 15 € */}
          <div>
            <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-800">
              <span>Panier à</span>
              <input
                type="number"
                min={0}
                step="0.5"
                value={basket15PriceEuro}
                onChange={(event) => setBasket15PriceEuro(event.target.value)}
                className="w-16 rounded-md border border-gray-300 px-2 py-0.5 text-right text-sm"
              />
              <span>€</span>
            </h3>
            <div className="space-y-2">
              {basket15Items.map((item, index) => (
                <div
                  key={`b15-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_80px_auto] gap-2"
                >
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="200 g mélange de salades"
                    value={item.label}
                    onChange={(event) =>
                      handleItemChange("15", index, "label", event.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm text-right"
                    placeholder="2,00"
                    value={item.price}
                    onChange={(event) =>
                      handleItemChange("15", index, "price", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 underline"
                    onClick={() => removeItem("15", index)}
                    disabled={basket15Items.length === 1}
                  >
                    Retrait
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-xs text-[var(--color-primary)] underline"
              onClick={() => addItem("15")}
            >
              Nouvelle ligne
            </button>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-800">
            Prévisualisation
          </h3>
          <div className="max-w-full overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm leading-relaxed">
            {pickupDateISO || previewBody.includes("PANIER") ? (
              <div dangerouslySetInnerHTML={{ __html: previewBody }} />
            ) : (
              <p className="text-xs text-gray-500">
                Prévisualisation vide pour le moment.
              </p>
            )}
          </div>
        </div>

        {localError && <p className="text-sm text-red-600">{localError}</p>}
        {remoteError && <p className="text-sm text-red-600">{remoteError}</p>}
        {remoteSuccess && (
          <p className="text-sm text-green-700">{remoteSuccess}</p>
        )}

        <p className="text-xs text-gray-500">
          Envoi immédiat à {totalSubscribers} abonné(s) après validation.
        </p>

        <button
          type="submit"
          disabled={
            sending ||
            totalSubscribers === 0 ||
            !subject.trim() ||
            !pickupDateISO
          }
          className={[
            "mt-1 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold shadow",
            sending ||
            totalSubscribers === 0 ||
            !subject.trim() ||
            !pickupDateISO
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[var(--color-primary)] text-white hover:opacity-90",
          ].join(" ")}
        >
          {sending ? "Envoi en cours…" : "Envoyer la newsletter"}
        </button>
      </form>
    </div>
  );
}
