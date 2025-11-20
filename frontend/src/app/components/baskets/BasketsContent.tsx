"use client";

import Image from "next/image";
import BasketIcon from "../SVG/BasketIcon";
import ButtonGeneric from "../button/ButtonGeneric";

/** Assets locaux — modifier uniquement les chemins si besoin */
const CONTENT_IMAGE_SRC = "/legume-frog.jpg"; // photo réelle existante

export default function BasketsContent() {
  return (
    <div className="space-y-8 px-4 md:px-8 mb-8">
      {/* Nos paniers */}
      <section>
        <h2
          className="text-3xl md:text-3xl mb-2"
          style={{
            color: "var(--color-dark)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Nos Paniers
        </h2>

        <p className="text-base leading-relaxed">
          Nous vous proposons chaque semaine des paniers de légumes bio composés
          de légumes de l’exploitation, frais et de saison.
        </p>

        <p className="text-base mt-3 leading-relaxed">
          2 tailles de paniers sont proposées :
        </p>

        <ul className="mt-3 space-y-2 text-base">
          <li className="flex items-center gap-2">
            <span>
              <BasketIcon />
            </span>
            <span>
              <strong>Le petit panier</strong>, pour 2/3 personnes,
            </span>
          </li>

          <li className="flex items-center gap-2">
            <span>
              <BasketIcon />
            </span>
            <span>
              <strong>Le moyen</strong>, pour 3/4 personnes,
            </span>
          </li>
        </ul>

        <p className="text-base mt-3 leading-relaxed">
          Retrait à la Gare de Savenay toutes les semaines.
        </p>
      </section>

      {/* Composition par saison */}
      <section>
        <h3
          className="text-3xl md:text-3xl mb-2"
          style={{
            color: "var(--color-dark)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Composition des paniers par saison
        </h3>

        <p className="text-base leading-relaxed">
          Exemples indicatifs de paniers. Les quantités varient selon la taille
          du panier.
        </p>

        <ul className="mt-3 space-y-1.5 text-base">
          <li>
            <span className="mr-2">🌱</span> en hiver : pommes de terre, mache,
            poireaux, céleris, choux, légumes de conservation.
          </li>
          <li>
            <span className="mr-2">🌷</span> au printemps : légumes primeur en
            botte, carottes, radis, petit pois, pommes de terre nouvelle,
            oignons blancs.
          </li>
          <li>
            <span className="mr-2">🌞</span> en été : légumes ratatouille,
            tomates, aubergines, courgettes, melons, concombre, haricots vert.
          </li>
          <li>
            <span className="mr-2">🍂</span> en automne : courges, patate douce,
            légumes racine, cresson, épinards.
          </li>
        </ul>
      </section>

      {/* Photo + légende + CTA */}
      <section className="space-y-3">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src={CONTENT_IMAGE_SRC}
            alt="Panier de légumes frais"
            fill
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <p className="text-xs leading-relaxed text-[var(--color-dark)]">
          La distribution des paniers de légumes s’effectue tous les lundis ou
          jeudis de 17h à 18h30, directement à l’exploitation. Sur place,
          possibilité d’ajouter des œufs ou des fruits, et d’échanger un légume
          si besoin.
        </p>

        <div>
          <ButtonGeneric href="/reserver" tone="primary">
            RESERVER
          </ButtonGeneric>
        </div>
      </section>

      {/* Conditions et tarifs */}
      <section className="space-y-4">
        <h3
          className="text-3xl md:text-3xl"
          style={{
            color: "var(--color-dark)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Nos conditions et tarifs
        </h3>

        <div className="space-y-4 text-base leading-relaxed">
          <p>
            La vente de nos paniers de légumes reste sans engagement. À titre
            exceptionnel, annulation possible de certains paniers. Merci
            d’annuler dans les meilleurs délais.
          </p>
          <p>
            Les retraits sont disponible disponible les mardis de 16h30 à 19h et
            les vendredis de 16h30 à 18h30, paiement sur place.
          </p>
          <p>Règlement sur place par chèque, espèces ou carte bancaire.</p>
          <p>Les retraits de panier se fond uniquement à la gare de Savenay.</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3
              className="text-3xl md:text-3xl mb-4"
              style={{
                color: "var(--color-dark)",
                fontFamily: "var(--font-pacifico)",
              }}
            >
              Tarifs des paniers de légumes
            </h3>
            <ul className="text-base space-y-1.5">
              <li className="flex items-center gap-2">
                <span>
                  {" "}
                  <BasketIcon />
                </span>{" "}
                Petit panier : <strong>10 €</strong>
              </li>
              <li className="flex items-center gap-2">
                <span>
                  {" "}
                  <BasketIcon />
                </span>{" "}
                Grand panier : <strong>15 €</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
