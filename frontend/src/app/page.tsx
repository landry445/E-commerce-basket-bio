import Navbar from "./components/navbar/Navbar";
import HeroBanner from "./components/homepage/HeroBanner";
import BioBaskets from "./components/homepage/BioBaskets";
import SellingPoints from "./components/homepage/SellingPoints";
import type { FAQItem } from "./components/homepage/FAQ";
import FAQ from "./components/homepage/FAQ";
import Footer from "./components/Footer";
import ScrollingBanner from "./components/homepage/ScrollingBanner";

const faqItems: FAQItem[] = [
  { id: "q1", question: "Commande", answer: "Procédure simple sur le site." },
  { id: "q2", question: "Retrait", answer: "Plusieurs points de retrait." },
  { id: "q3", question: "Paiement", answer: "Paiement sécurisé en ligne." },
  {
    id: "q4",
    question: "Produits",
    answer: "Fruits et légumes bio de saison.",
  },
  {
    id: "q5",
    question: "Contact",
    answer: "Nous contacter par email ou téléphone.",
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
            className="text-3xl md:text-5xl text-center "
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            SARL : votre exploitation maraîchère bio
          </h1>
          <h2
            className="text-3xl md:text-3xl text-center"
            style={{
              color: "var(--color-dark)",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Fruits et légumes bio à Chaumes en Retz
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
