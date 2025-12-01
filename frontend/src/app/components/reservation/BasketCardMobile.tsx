import Image from "next/image";
import React from "react";

type Basket = {
  id: string;
  name_basket: string;
  price_basket: number;
  description_basket?: string | null;
};

type Props = {
  basket: Basket;
  imageUrl: string;
  quantity: number;
  onChangeQuantity: (id: string, next: number) => void;
  onOpenDetails: (id: string) => void;
  currency: (n: number) => string; // ex: new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format
};

export default function BasketCardMobile({
  basket,
  imageUrl,
  quantity,
  onChangeQuantity,
  onOpenDetails,
  currency,
}: Props): React.ReactElement {
  const q = quantity < 0 ? 0 : quantity;

  return (
    <article
      className="
        sm:hidden w-full max-w-xs rounded-2xl overflow-hidden border bg-white
        shadow-sm flex flex-col"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {/* Media */}
      <div className="relative w-full aspect-[4/3] bg-gray-50">
        <Image
          src={imageUrl}
          alt={basket.name_basket}
          fill
          sizes="320px"
          className="object-cover"
          unoptimized
          crossOrigin="anonymous"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/panier-legumes.webp";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center text-center gap-2">
        <h3 className="font-medium leading-tight">{basket.name_basket}</h3>

        <p className="text-lg font-semibold text-[var(--color-primary)] tabular-nums">
          {currency(basket.price_basket)}
        </p>

        {/* Détail */}
        <button
          type="button"
          onClick={() => onOpenDetails(basket.id)}
          className="
            w-full max-w-[220px] rounded-xl border px-4 py-2 text-sm
            hover:bg-gray-50 transition
          "
          aria-label={`Détails ${basket.name_basket}`}
        >
          Détail
        </button>
      </div>

      {/* Stepper */}
      <div className="px-4 pb-4">
        <div
          className="
            grid grid-cols-3 items-center
            rounded-2xl border bg-white"
        >
          <button
            type="button"
            onClick={() => onChangeQuantity(basket.id, q - 1)}
            aria-label={`Retirer 1 ${basket.name_basket}`}
            className="
              m-3 h-10 w-10 rounded-full border
              inline-flex items-center justify-center
              text-xl"
          >
            −
          </button>

          <div className="text-center select-none">{q}</div>

          <button
            type="button"
            onClick={() => onChangeQuantity(basket.id, q + 1)}
            aria-label={`Ajouter 1 ${basket.name_basket}`}
            className="
              m-3 h-10 w-10 rounded-full
              inline-flex items-center justify-center text-xl
              text-white
              bg-[var(--color-primary)]
              hover:brightness-95 active:brightness-90 transition
            "
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
