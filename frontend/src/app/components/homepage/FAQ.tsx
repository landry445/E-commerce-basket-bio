// components/FAQ.tsx
"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ReactNode } from "react";

export type FAQItem = { id: string; question: string; answer: ReactNode };

type FAQProps = {
  items: FAQItem[]; // requis
  defaultOpenId?: string; // optionnel
};

export default function FAQ({ items, defaultOpenId }: FAQProps) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section className="w-full py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-neutral-500">
          Aucune question pour le moment.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 md:py-14 px-4">
      <h2
        className="text-center text-3xl md:text-4xl mb-8 md:mb-10"
        style={{
          color: "var(--color-dark)",
          fontFamily: "var(--font-pacifico), var(--font-sans)",
        }}
      >
        Une réponse à toutes vos questions
      </h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {items.map((item) => (
          <Disclosure key={item.id} defaultOpen={item.id === defaultOpenId}>
            {({ open }) => (
              <div className="rounded-xl shadow-sm overflow-hidden">
                <DisclosureButton
                  className={[
                    "w-full flex items-center justify-between gap-4 px-4 md:px-5 py-4 font-medium transition-colors",
                    open
                      ? "bg-[var(--color-primary)] text-[var(--color-light)]"
                      : "bg-white text-[var(--foreground)]",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-sm md:text-base">
                      {item.question}
                    </span>
                  </span>
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </DisclosureButton>

                <DisclosurePanel className="px-4 md:px-5 py-4 text-sm md:text-base text-[var(--foreground)]/80 bg-white">
                  {item.answer}
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
