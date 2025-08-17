import BasketsHero from "@/app/components/baskets/BasketsHero";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import BasketsContent from "../components/baskets/BasketsContent";
import OrderAside from "../components/baskets/OrderAside";

export default function BasketsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto">
        {/* Bandeau en haut si tu le gardes */}
        <BasketsHero />

        {/* Contenu + aside */}
        <section className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
          <BasketsContent />
          <OrderAside />
        </section>
      </main>
      <Footer />
    </>
  );
}
