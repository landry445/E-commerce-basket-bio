import Image from "next/image";
import BasketIcon from "../SVG/BasketIcon";
import ButtonGeneric from "../ButtonGeneric";

type BioBasketsProps = {
  imageSrc?: string;
  imageAlt?: string;
};

export default function BioBaskets({
  imageSrc = "/panier-legumes.webp",
  imageAlt = "Panier de légumes bio",
}: BioBasketsProps) {
  return (
    <section
      className="relative w-full flex justify-center p-5 sm:p-6 md:p-10 mt-10 bg-[url('/background-yellow.png')] bg-cover bg-center]"
      style={{ backgroundColor: "var(--color-yellow)" }}
    >
      <div
        className="
          w-full max-w-5xl
          bg-white
          rounded-2xl
          shadow
          px-5 sm:px-8 md:px-10
          py-8 md:py-10
          grid gap-8
          md:grid-cols-[1fr_360px]
        "
      >
        <header className="md:col-span-2">
          <h2
            className="text-3xl md:text-4xl"
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico), var(--font-sans)",
            }}
          >
            NOS PANIERS BIO
          </h2>
        </header>

        <div className="space-y-7">
          <article className="flex items-start gap-4">
            <BasketIcon />
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--foreground)]">
                Panier moyen de légumes — 17&nbsp;€
              </h3>
              <p className="mt-1 text-sm md:text-base text-[var(--foreground)]/80">
                La distribution des paniers de légumes s’effectue tous les
                lundis ou jeudis de 16h30 à 18h30. Une famille de 3/4 personnes
                peut utiliser nos paniers moyens.
              </p>
            </div>
          </article>

          <article className="flex items-start gap-4">
            <BasketIcon />
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--foreground)]">
                Petit panier de légumes — 14&nbsp;€
              </h3>
              <p className="mt-1 text-sm md:text-base text-[var(--foreground)]/80">
                Chaque semaine, retrait du panier directement à l’exploitation.
                Le petit panier à 14&nbsp;€, idéal pour 2&nbsp;personnes.
              </p>
            </div>
          </article>

          <div className="pt-2 flex justify-center">
            <ButtonGeneric href="/paniers">
              NOS PANIERS DE LÉGUMES EN DÉTAIL
            </ButtonGeneric>
          </div>
        </div>

        {/* Colonne image */}
        <div className="md:justify-self-end">
          <div className="relative w-full aspect-[4/3] md:w-[360px] md:h-[270px] rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 360px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
