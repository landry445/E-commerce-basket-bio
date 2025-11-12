import Image from "next/image";

type SalesPointCardProps = {
  title: string;
  imgSrc: string;
  imgAlt: string;
  children: React.ReactNode;
};

function SalesPointCard({
  title,
  imgSrc,
  imgAlt,
  children,
}: SalesPointCardProps) {
  return (
    <div className="bg-white text-[var(--foreground)] rounded-2xl shadow p-6 flex flex-col md:flex-row items-start gap-6 m-8">
      {/* Image */}
      <div className="w-full md:w-1/3">
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={500}
          height={333}
          className="w-full h-auto rounded-xl"
          sizes="(min-width: 768px) 320px, 100vw"
          priority={false}
        />
      </div>

      {/* Texte */}
      <div className="md:w-2/3">
        <h3
          className="text-2xl mb-3"
          style={{
            color: "var(--color-dark)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          {title}
        </h3>
        <div className="text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function SalesPoints() {
  return (
    <>
      <section
        className="bg-[url('/background-yellow.png')] bg-cover bg-center] py-6 px-2"
        style={{ backgroundColor: "var(--color-yellow)" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl text-center mb-8"
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Nos Différents Points de ventes
          </h2>

          <div className="space-y-8">
            {/* <SalesPointCard
              title="Directement à l'exploitation"
              imgSrc="/panier-legumes.webp"
              imgAlt="Directement à l'exploitation"
            >
              <p>
                Vente sur place du mardi au samedi de 10h à 12h et de 14h à
                18h30. Légumes en vrac ou en paniers, produits transformés (jus,
                confitures, soupes). Œufs issus de poules élevées en plein air.
              </p>
            </SalesPointCard> */}

            <SalesPointCard
              title="Sur les marchés"
              imgSrc="/marché.jpg"
              imgAlt="Sur les marchés"
            >
              <p className="mb-2">
                Présence sur plusieurs marchés de la région&nbsp;:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>mardi&nbsp;: Boulevard des Américains (Nantes)</li>
                <li>mercredi&nbsp;: marché de la Nantaise (Rezé)</li>
                <li>vendredi&nbsp;: Saint-Étienne-de-Montluc / Talmont</li>
                <li>samedi&nbsp;: Pornic &amp; Clisson</li>
                <li>dimanche&nbsp;: Petit Chantilly (Orvault)</li>
              </ul>
            </SalesPointCard>

            <SalesPointCard
              title="À la gare de Savigny"
              imgSrc="/gare.jpg"
              imgAlt="À la gare de Savigny"
            >
              <p>
                Point de vente ouvert depuis 2021 à la gare de Savigny-sur-Orge.
                Produits frais et de saison, paniers hebdomadaires et produits
                transformés. Horaires étendus en semaine.
              </p>
            </SalesPointCard>
          </div>
        </div>
      </section>

      {/* Légende/accroche sous la section */}
      <div className="text-center mt-8">
        <p className="text-xl font-bold ml-1 mr-1">
          Retrouvez les différents points de vente
        </p>
        <Image
          src="/arrow-icon.svg"
          alt="Flèche vers le bas"
          width={50}
          height={50}
          className="mx-auto m-6"
        />
      </div>
    </>
  );
}
