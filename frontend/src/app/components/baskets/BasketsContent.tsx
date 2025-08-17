"use client";

import Image from "next/image";
import BasketIcon from "../SVG/BasketIcon";
import ButtonGeneric from "../button/ButtonGeneric";

/** Assets locaux — modifier uniquement les chemins si besoin */
const CONTENT_IMAGE_SRC = "/panier-legumes.webp"; // photo réelle existante

export default function BasketsContent() {
  return (
    <div className="space-y-8 px-4 md:px-8 mb-8">
      {/* Nos paniers */}
      <section>
        <h2
          className="text-xl mb-2"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Nos Paniers
        </h2>

        <p className="text-base leading-relaxed">
          Votre maraîcher propose chaque semaine des paniers de légumes bio
          composés de légumes de l’exploitation, frais et de saison.
        </p>

        <p className="text-base mt-3 leading-relaxed">
          3 tailles de paniers sont proposées :
        </p>

        <ul className="mt-3 space-y-2 text-base">
          <li className="flex items-center gap-2">
            <span>
              <BasketIcon />
            </span>
            <span>
              <strong>Le petit panier</strong>, pour 2 personnes,
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
          Choix de la taille avec ou sans œufs, retrait à la ferme toutes les
          semaines. Des œufs peuvent être ajoutés au panier hebdomadaire.
        </p>
      </section>

      {/* Composition par saison */}
      <section>
        <h3
          className="text-lg mb-2"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Composition des paniers par saison
        </h3>

        <p className="text-base leading-relaxed">
          Exemples indicatifs de paniers. Les quantités varient selon la taille
          du panier.
        </p>

        <ul className="mt-3 space-y-1.5 text-base">
          <li>
            <span className="mr-2">🌱</span> en hiver : pommes de terre,
            carottes, salade, cardes, céleri, choux blanc, oignons,
          </li>
          <li>
            <span className="mr-2">🌷</span> au printemps : pommes de terre,
            carottes, salade, poireaux, navets, oignons blancs,
          </li>
          <li>
            <span className="mr-2">🌞</span> en été : pommes de terre, carottes,
            salade, tomates, maïs, concombre, poivron, courgettes,
          </li>
          <li>
            <span className="mr-2">🍂</span> en automne : pommes de terre,
            carottes, salade, potiron, panais, endives, persil.
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
          <ButtonGeneric href="/points-retrait" tone="primary">
            RESERVER
          </ButtonGeneric>
        </div>
      </section>

      {/* Conditions et tarifs */}
      <section className="space-y-4">
        <h3 className="text-lg" style={{ fontFamily: "var(--font-pacifico)" }}>
          Nos conditions et tarifs
        </h3>

        <div className="space-y-4 text-base leading-relaxed">
          <p>
            L’abonnement aux paniers de légumes bio reste sans engagement.
            Possibilité d’arrêter les paniers à tout moment. À titre
            exceptionnel, annulation possible de certains paniers (ex.
            vacances). Merci d’annuler 24 h à l’avance.
          </p>
          <p>
            Pour les commandes ponctuelles, passage des commandes avant 12 h le
            lundi ou le jeudi (selon le jour de distribution).
          </p>
          <p>
            Facturation en fin de mois, règlement par chèque ou espèces. Carte
            bancaire ou autre moyen de paiement envisagé si besoin.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4
              className="text-base mb-2"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Tarifs des paniers de légumes
            </h4>
            <ul className="text-base space-y-1.5">
              <li className="flex items-center gap-2">
                <span>
                  {" "}
                  <BasketIcon />
                </span>{" "}
                Petit panier : <strong>14 €</strong>
              </li>
              <li className="flex items-center gap-2">
                <span>
                  {" "}
                  <BasketIcon />
                </span>{" "}
                Panier moyen : <strong>17 €</strong>
              </li>
              <li className="flex items-center gap-2">
                <span>
                  {" "}
                  <BasketIcon />
                </span>{" "}
                Grand panier : <strong>21 €</strong>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="text-base mb-2"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Tarifs des œufs frais
            </h4>
            <ul className="text-base space-y-1.5">
              <li className="flex items-center gap-2">
                <span>🥚</span> La boîte de 6 œufs : <strong>2,20 €</strong>
              </li>
              <li className="flex items-center gap-2">
                <span>🥚</span> La boîte de 12 œufs : <strong>4,40 €</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
