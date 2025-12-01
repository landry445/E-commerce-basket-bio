"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[400px]">
      <Image
        src="/exploitation-serre.jpg"
        alt="Votre maraîcher"
        fill
        className="object-cover brightness-90"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="text-5xl md:text-6xl text-center px-4"
          style={{
            fontFamily: "var(--font-pacifico)",
            color: "var(--color-light)",
          }}
        >
          Maraîcher bio depuis 2002
        </h1>
      </div>
    </section>
  );
}
