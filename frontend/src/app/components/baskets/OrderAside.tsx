"use client";

import Image from "next/image";
import Link from "next/link";

/** Asset local — modifier uniquement le chemin si besoin */
const ASIDE_BG_IMAGE_SRC = "/images/grass-texture.jpg"; // image réelle existante (pas un logo)

export default function OrderAside() {
  return (
    <aside className="space-y-4">
      {/* Carte info commande */}
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ background: "var(--color-yellow)" }}
      >
        <h3
          className="text-lg mb-2"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Pour commander
        </h3>

        <p className="text-sm leading-relaxed">
          Merci de passer vos commandes en ligne à l’aide du formulaire.
          Préparation de votre commande et mise à disposition à l’exploitation.
        </p>

        <p className="text-sm mt-2 leading-relaxed">
          Possibilité de demander la liste des fruits et légumes de la semaine.
        </p>
      </div>

      {/* Encart “Vente directe” */}
      <div
        className="rounded-xl p-3 shadow-sm overflow-hidden"
        style={{ background: "var(--color-yellow)" }}
      >
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
          <Image
            src={ASIDE_BG_IMAGE_SRC}
            alt="Vente directe aux particuliers"
            fill
            sizes="(min-width: 768px) 22rem, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center text-white drop-shadow">
              <p className="text-sm font-semibold">
                Vente directe aux particuliers
              </p>
              <p className="text-xs opacity-90">
                Ouvert toute l’année (sauf jours fériés)
              </p>
              <p className="text-xs opacity-90">
                Le lundi et le jeudi de 16h30 à 18h30
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-block rounded-md px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--color-accent)", color: "#fff" }}
              >
                Contactez‑nous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
