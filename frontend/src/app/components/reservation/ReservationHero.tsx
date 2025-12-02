"use client";

import Image from "next/image";

type Props = { title?: string };

export default function ReservationHero({
  title = "Commander votre panier",
}: Props) {
  return (
    <section className="relative h-[340px] md:h-[380px]">
      <Image
        src="/fourche.jpg"
        alt="Votre maraîcher"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="text-white text-4xl md:text-6xl text-center px-4 drop-shadow"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
