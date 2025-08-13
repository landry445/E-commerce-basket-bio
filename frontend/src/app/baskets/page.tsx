import BasketsHero from "@/app/components/baskets/BasketsHero";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

export default function BasketsPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <BasketsHero />
        <section className="mt-10 grid gap-6">
          <h2
            className="text-2xl md:text-3xl"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Nos paniers
          </h2>
          <p className="max-w-2xl text-[var(--color-dark)]">
            Sélection locale et de saison, disponible en trois tailles. Retrait
            sur place uniquement, pas de livraison.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
