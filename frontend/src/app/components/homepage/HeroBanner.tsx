"use client";

import Image from "next/image";
import ButtonGeneric from "../ButtonGeneric";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <Image
        src="/champ-bio (1).webp"
        alt="Champs maraîcher bio"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
        style={{ zIndex: 1 }}
      />

      {/* Voile sombre pour contraste texte */}

      {/* Contenu slogan */}
      <div className="relative z-10 text-center px-4 font-sans">
        <h1
          className="text-3xl md:text-5xl drop-shadow-lg"
          style={{
            color: "var(--color-light)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Paniers Bio frais à Chaussée de Plessis
        </h1>
        <div className="pt-2 md:pt-15">
          <ButtonGeneric href="/paniers">RESERVER VOTRE PANIER</ButtonGeneric>
        </div>
      </div>
    </section>
  );
}
