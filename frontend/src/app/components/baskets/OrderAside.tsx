"use client";

import Image from "next/image";
import ButtonGeneric from "../button/ButtonGeneric";

/** Asset local — modifier uniquement le chemin si besoin */

export default function OrderAside() {
  return (
    <aside className="space-y-4">
      {/* Carte info commande */}
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ background: "var(--color-yellow)" }}
      >
        <div
          className="w-full max-w-5xl
          bg-white
          rounded-2xl
          shadow
          px-5 sm:px-8 md:px-8
          py-8 md:py-10"
        >
          <h3
            className="text-center text-3xl md:text-3xl mb-4"
            style={{ fontFamily: "var(--font-pacifico)" }}
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

      {/* Encart “Vente directe” */}
      <div
        className="rounded-xl p-3 shadow-sm overflow-hidden"
        style={{ background: "var(--color-yellow)" }}
      >
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
          <Image
            src="/Aside.png"
            alt="Vente directe aux particuliers"
            fill
            sizes="(min-width: 768px) 22rem, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 grid place-items-center">
            <Image
              src="/Icone-aside.svg"
              alt="icone-aside"
              width={40}
              height={40}
            />
            <div className="text-center text-white drop-shadow">
              <p className="text-base font-semibold">
                Vente directe aux particuliers
              </p>
              <p className="text-base opacity-90">
                Ouvert toute l’année (sauf jours fériés)
              </p>
              <p className="text-base opacity-90">
                Le lundi et le jeudi de 16h30 à 18h30
              </p>
            </div>
            <ButtonGeneric href="/points-retrait" tone="cta">
              Contactez nous
            </ButtonGeneric>
          </div>
        </div>
      </div>
    </aside>
  );
}
