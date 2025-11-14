import HeroBanner from "./components/homepage/HeroBanner";
import BioBaskets from "./components/homepage/BioBaskets";
import SellingPoints from "./components/homepage/SellingPoints";
import type { FAQItem } from "./components/homepage/FAQ";
import FAQ from "./components/homepage/FAQ";
import Footer from "./components/Footer";
import ScrollingBanner from "./components/ScrollingBanner";
import Navbar from "./components/navbar/Navbar";

const faqItems: FAQItem[] = [
  {
    id: "q1",
    question: "Commande",
    answer:
      "Pour les paniers du mardi, vous avez du vendredi soir 18h jusqu'au mardi matin 8h pour vos commandes. Pour les paniers du vendredi, même principe vous pouvez du mardi 18h jusqu'au vendredi matin 8h.",
  },
  {
    id: "q2",
    question: "Retrait",
    answer:
      "Pour le retrait, venez récupéré en main propre directement devant le hall de la gare SNCF de Savenay.",
  },
  {
    id: "q3",
    question: "Paiement",
    answer: "Paiement sur place en espèce, chèques ou carte bancaire.",
  },
  {
    id: "q4",
    question: "Paniers",
    answer:
      "Les paniers sont composés de nos légumes qui varient selon les saisons.",
  },
  {
    id: "q5",
    question: "Contact",
    answer:
      "Vous pouvez nous contacter par email au jardindesrainettes@netcourrier.com",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <div className=" flex items-center justify-center flex-col gap-10 mt-8 mb-8">
          <h1
            className="text-2xl md:text-5xl text-center "
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Gaec du Jardin Des Rainettes
          </h1>
          <h2
            className="text-2xl md:text-3xl text-center"
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Producteur de Légumes Bio à Plessé
          </h2>
        </div>
        <BioBaskets />
        <ScrollingBanner direction="rtl" /> {/* droite → gauche */}
        <SellingPoints />
        <FAQ items={faqItems} defaultOpenId="q1" />
      </main>
      <Footer />
    </>
  );
}
