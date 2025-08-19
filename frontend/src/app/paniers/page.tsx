import BasketsHero from "@/app/components/baskets/BasketsHero";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import BasketsContent from "../components/baskets/BasketsContent";
import OrderAside from "../components/baskets/OrderAside";

export default function BasketsPage() {
  return (
    <>
      <Navbar />
      <main className="">
        <BasketsHero />

        {/* <768px : OrderAside au-dessus avec marge. ≥768px : 2/3 contenu, 1/3 aside */}
        <section className="mt-10 grid gap-6 md:grid-cols-3 max-w-[1440px] mx-auto">
          <div className="order-1 md:order-2 md:col-span-1 m-6 md:m-0">
            <OrderAside />
          </div>

          <div className="order-2 md:order-1 md:col-span-2">
            <BasketsContent />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
