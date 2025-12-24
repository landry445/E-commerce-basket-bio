import Image from "next/image";
import BasketIcon from "../SVG/bassketIcon/BasketIcon";
import ButtonGeneric from "../button/ButtonGeneric";

type BioBasketsProps = {
  imageSrc?: string;
  imageAlt?: string;
};

export default function BioBaskets({
  imageSrc = "/legume-frog.jpg",
  imageAlt = "Panier de légumes bio",
}: BioBasketsProps) {
  return (
    <section
      className="relative w-full flex justify-center p-5 sm:p-6 md:p-7  bg-[url('/background-yellow.png')] bg-cover bg-center]"
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
            className="text-2xl md:text-4xl text-center"
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
                Panier de légumes à 10&nbsp;€
              </h3>
              <p className="mt-1 text-sm md:text-base text-[var(--foreground)]/80">
                Composé de 5 à 6 légumes de saison, le petit panier idéal pour 2
                personnes.
              </p>
            </div>
          </article>

          <article className="flex items-start gap-4">
            <BasketIcon />
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[var(--foreground)]">
                Panier de légumes à 15&nbsp;€
              </h3>
              <p className="mt-1 text-sm md:text-base text-[var(--foreground)]/80">
                Dans le panier à 15&nbsp;€, vous trouverez 6 à 7 légumes.
                Parfait pour une famille de 3 à 4 personnes.
              </p>
            </div>
          </article>

          <div className="pt-2 flex justify-center">
            <ButtonGeneric href="/paniers" className="text-center">
              NOS PANIERS DE LÉGUMES EN DÉTAIL
            </ButtonGeneric>
          </div>
        </div>

        {/* Colonne image */}
        <div className="md:justify-self-end ">
          <div className="relative w-full  md:w-[360px] md:h-[270px] rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className=" "
              sizes="(min-width: 768px) 360px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
