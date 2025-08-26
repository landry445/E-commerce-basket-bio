"use client";

type Basket = {
  id: string;
  name_basket: string;
  price_basket: number;
  actif: boolean;
};

type BasketDetails = {
  description?: string | null;
  composition?: string[] | null;
};

type Props = {
  baskets: Basket[];
  selectedId: string;
  onSelect: (id: string) => void;
  activeDetails?: BasketDetails;
  quantity: number;
  onQuantity: (q: number) => void;
  disabled?: boolean;
  required?: boolean;
};

export default function BasketCard({
  baskets,
  selectedId,
  onSelect,
  activeDetails,
  quantity,
  onQuantity,
  disabled,
  required,
}: Props) {
  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label="Taille du panier">
        <p className="text-lg font-semibold mb-2">
          Sélection de la taille du panier&nbsp;*
        </p>

        <div className="mt-3 space-y-2">
          {baskets
            .filter((b) => b.actif)
            .map((b, idx) => {
              const active = selectedId === b.id;
              const icon = ["🥬", "🍅", "🥕", "🧺"][idx % 4];

              return (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white shadow-sm border border-gray-200"
                >
                  <label
                    className={[
                      "flex items-center justify-between rounded-2xl p-4 transition cursor-pointer",
                      active
                        ? "border-2 border-[var(--color-primary)]"
                        : "border-2 border-transparent hover:border-[var(--color-dark)]/30",
                    ].join(" ")}
                    role="radio"
                    aria-checked={active}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden>
                        {icon}
                      </span>
                      <input
                        type="radio"
                        name="basket"
                        value={b.id}
                        checked={active}
                        onChange={(e) => onSelect(e.target.value)}
                        disabled={disabled}
                        required={required}
                        className="sr-only"
                      />
                      <span className="font-medium">{b.name_basket}</span>
                    </div>
                    <span className="text-sm">{b.price_basket} €</span>
                  </label>

                  <div
                    className={[
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
                      active ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
                    ].join(" ")}
                    aria-hidden={!active}
                  >
                    <div className="px-4 pb-4 pt-0 text-sm text-gray-700">
                      {activeDetails?.description ? (
                        <p className="mb-2">{activeDetails.description}</p>
                      ) : null}

                      {activeDetails?.composition?.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {activeDetails.composition.map((item, i) => (
                            <li
                              key={i}
                              className="rounded-full px-3 py-1 border border-[#E9E6D8] bg-[var(--background)]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : !activeDetails?.description ? (
                        <p className="text-gray-500">
                          Composition disponible selon le stock du moment.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Quantité</label>
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => onQuantity(Math.max(1, quantity - 1))}
            className="cursor-pointer rounded-full border px-4 py-2 bg-white border-gray-200 hover:bg-gray-50"
            aria-label="Diminuer"
          >
            −
          </button>

          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-center
                       appearance-textfield
                       [&::-webkit-inner-spin-button]:appearance-none
                       [&::-webkit-outer-spin-button]:appearance-none"
            value={quantity}
            onChange={(e) => onQuantity(Number(e.target.value))}
            min={1}
            max={5}
            disabled={disabled}
            required={required}
            inputMode="numeric"
          />

          <button
            type="button"
            onClick={() => onQuantity(Math.min(5, quantity + 1))}
            className="cursor-pointer rounded-full border px-4 py-2 bg-white border-gray-200 hover:bg-gray-50"
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
