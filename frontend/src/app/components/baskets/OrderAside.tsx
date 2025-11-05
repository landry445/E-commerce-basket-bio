"use client";

import Image from "next/image";
import ButtonGeneric from "../button/ButtonGeneric";

export default function OrderAside() {
  return (
    <aside className="space-y-4 md:mr-5">
      {/* Carte info commande */}
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ background: "var(--color-yellow)" }}
      >
        <div
          className="w-full
          bg-white
          rounded-2xl
          shadow
          px-5 sm:px-8 md:px-8
          py-8 md:py-10"
        >
          <h3
            className="text-center text-3xl md:text-3xl mb-4"
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Pour commander
          </h3>

          <p className="text-base leading-relaxed">
            Merci de passer vos commandes en ligne à l’aide du formulaire.
            Préparation de votre commande et mise à disposition à
            l’exploitation.
          </p>

          <p className="text-base mt-2 leading-relaxed">
            Possibilité de demander la liste des fruits et légumes de la
            semaine.
          </p>
        </div>
      </div>

      {/* Encart “Vente directe” — responsive comme la carte au-dessus */}
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ background: "var(--color-yellow)" }}
      >
        <div
          className="
            relative w-full rounded-2xl overflow-hidden shadow
            /* Hauteur fluide selon le viewport */
            min-h-[240px] sm:min-h-[280px] md:min-h-[220px] lg:min-h-[260px]
          "
        >
          {/* Fond image en full-bleed */}
          <Image
            src="/Aside.png"
            alt="Vente directe aux particuliers"
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 320px, 100vw"
            className="object-cover"
            priority
          />

          {/* Contenu centré et lisible */}
          <div className="relative z-[1] h-full grid place-items-center px-5 sm:px-8 py-8 md:py-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/Icone-aside.svg"
                alt="icone-aside"
                width={40}
                height={40}
              />

              <div className="text-white drop-shadow">
                <p className="text-base sm:text-lg font-semibold">
                  Vente directe aux particuliers
                </p>
                <p className="text-sm sm:text-base opacity-90">
                  Ouvert toute l’année (sauf jours fériés)
                </p>
                <p className="text-sm sm:text-base opacity-90">
                  Le lundi et le jeudi de 16h30 à 18h30
                </p>
              </div>

              <div className="mt-1">
                <ButtonGeneric href="/votre-maraicher" tone="cta">
                  Contactez nous
                </ButtonGeneric>
              </div>
            </div>
          </div>

          {/* Légère superposition sombre optionnelle pour le contraste du texte
              (décommenter si besoin de contraste plus élevé)
          <div className="absolute inset-0 bg-black/10" />
          */}
        </div>
      </div>
    </aside>
  );
}
