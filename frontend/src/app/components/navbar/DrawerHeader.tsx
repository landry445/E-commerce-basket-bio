"use client";

import { RefObject } from "react";

type DrawerHeaderProps = {
  initial: string;
  onClose: () => void;
  firstFocusableRef: RefObject<HTMLButtonElement | null>; // ← ici
};

export default function DrawerHeader({
  onClose,
  firstFocusableRef,
}: DrawerHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center flex-row-reverse  justify-between p-4 border-b border-black/5 bg-[var(--background)]">
      <button
        ref={firstFocusableRef}
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 text-[var(--color-primary)]"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M6 6l12 12M18 6l-12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
