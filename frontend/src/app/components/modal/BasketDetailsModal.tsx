"use client";
import { useEffect, useRef } from "react";

export type BasketForModal = {
  id: string;
  name_basket: string;
  price_basket: number;
  description?: string | null;
  imageUrl?: string | null;
};

type Props = {
  basket: BasketForModal | null;
  open: boolean;
  onClose: () => void;
};

export default function BasketDetailsModal({ basket, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onClick = (e: MouseEvent) => {
      const r = dlg.getBoundingClientRect();
      const outside =
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom;
      if (outside) onClose();
    };
    dlg.addEventListener("click", onClick);
    return () => dlg.removeEventListener("click", onClick);
  }, [onClose]);

  const title = basket?.name_basket ?? "Panier";

  return (
    <dialog
      ref={ref}
      aria-labelledby="basket-title"
      className="
    fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    z-50
    m-0 p-0
    w-[min(92vw,42rem)]
    rounded-xl shadow-xl
    open:flex open:flex-col
    bg-[var(--color-light)]
    backdrop:bg-black/40
  "
      onClose={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
        <h3
          id="basket-title"
          className="text-lg font-semibold text-[var(--color-dark)]"
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 transition"
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="text-sm text-neutral-700">
          <div className="font-medium text-[var(--color-dark)] mb-1">
            Composition :
          </div>
          <p className="whitespace-pre-wrap leading-6">
            {basket?.description ?? "Aucune description disponible."}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-neutral-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition"
        >
          Fermer
        </button>
      </div>
    </dialog>
  );
}
