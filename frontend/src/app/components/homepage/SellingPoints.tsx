"use client";

import Image from "next/image";
import ButtonGeneric from "../button/ButtonGeneric";

type Point = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type SellingPointsProps = {
  items?: Point[];
  ctaHref?: string;
  ctaLabel?: string;
};

const defaults: Point[] = [
  {
    title: "Sur les marchés",
    description: "Retrouvez nous les samedis matins au marché de blin (44130).",
    imageSrc: "/marché.jpg",
    imageAlt: "maeché",
  },
  {
    title: "Retrait paniers à la gare de Savenay",
    description:
      "Retrait disponible les mardis de 16h30 à 19h et les vendredis de 16h30 à 18h30, paiement sur place.",
    imageSrc: "/gare.jpg",
    imageAlt: "Champ de légumes en culture",
  },
];

export default function SellingPoints({
  items = defaults,
}: SellingPointsProps) {
  return (
    <section
      className="relative w-full py-10 md:py-14 bg-[url('/background-green.png')] bg-cover bg-center"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="relative max-w-5xl mx-auto px-4 md:px-6">
        {/* Titre */}
        <h1
          className="text-center text-3xl md:text-4xl mb-8 md:mb-10"
          style={{
            color: "var(--color-light)",
            fontFamily: "var(--font-pacifico), var(--font-sans)",
          }}
        >
          Nos points de vente
        </h1>

        {/* Cartes */}
        <div className="grid gap-6 md:gap-10 md:grid-cols-2">
          {items.map((p) => (
            <article
              key={p.title}
              className="bg-white rounded-2xl shadow px-5 md:px-6 pt-5 pb-8 md:pb-12"
            >
              <div className="relative w-full h-[180px] md:h-[210px] rounded-xl overflow-hidden">
                <Image
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 520px, 100vw"
                  priority
                />
              </div>

              <h3 className="mt-5 text-lg md:text-xl font-semibold text-[var(--foreground)]">
                {p.title}
              </h3>
              <hr className="mt-3 mb-4 border-t border-black/10" />

              <p className="text-sm md:text-base text-[var(--foreground)]/80">
                {p.description}
              </p>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-10">
          <ButtonGeneric href="/votre-maraicher" tone="cta">
            Lieux et Horaires
          </ButtonGeneric>
        </div>
      </div>
    </section>
  );
}
