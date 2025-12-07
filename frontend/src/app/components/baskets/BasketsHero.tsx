"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ButtonGeneric from "../button/ButtonGeneric";

type Slide = {
  src: string;
  alt: string;
};

const SLIDES: ReadonlyArray<Slide> = [
  { src: "/legume-frog.jpg", alt: "Serre de tomates" },
  { src: "/celeri-rave.jpg", alt: "Céléri rave" },
  { src: "/_DSC0817.jpg", alt: "Panier de légumes de saison" },
];

const AUTOPLAY_MS = 5000;

export default function BasketsHero() {
  const [index, setIndex] = useState<number>(0);

  // boucle auto (pause si pas de slides)
  const slides = useMemo(() => SLIDES, []);
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      className="rounded-xl overflow-hidden "
      style={{ background: "var(--color-light)" }}
      aria-label="Présentation des paniers"
    >
      <div className="grid md:grid-cols-2">
        {/* Left panel (texte fixe) */}
        <div
          className="flex items-center px-6 pt-20 pb-10 md:px-10 md:py-16 justify-center"
          style={{ background: "var(--color-primary)" }}
        >
          <div className="max-w-xl text-center">
            <h1
              className="mb-6 text-[clamp(32px,6vw,52px)] leading-tight"
              style={{ fontFamily: "var(--font-pacifico)", color: "#fff" }}
            >
              Paniers de légumes hebdomadaires
            </h1>

            <div className="flex justify-center mt-8 md:mt-10">
              <ButtonGeneric href="/reserver" tone="cta">
                RESERVER VOTRE PANIER
              </ButtonGeneric>
            </div>
          </div>
        </div>

        {/* Right panel (carrousel simple) */}
        <div className="relative min-h-[260px] md:min-h-[420px] overflow-hidden">
          {/* Track */}
          <div
            className="h-full w-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div
                key={s.src}
                className="relative w-full h-auto min-h-[260px] md:min-h-[420px] shrink-0"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ))}
          </div>

          {/* Label AB en overlay */}
          <div className="absolute bottom-4 right-4 drop-shadow-lg">
            <Image
              src="/logo-ab-eurofeuille.webp"
              alt="Label AB"
              width={96}
              height={58}
            />
          </div>

          {/* Bullets (indicateurs cliquables) */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à l’image ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-2.5 w-2.5 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.9)",
                  background:
                    i === index ? "rgba(255,255,255,0.95)" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
