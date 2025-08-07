import Navbar from "./components/navbar/Navbar";
import HeroBanner from "./components/homepage/HeroBanner";
// import BioBaskets from "@/components/homepage/BioBaskets";
// import ValuesBand from "@/components/homepage/ValuesBand";
// import SellingPoints from "@/components/homepage/SellingPoints";
// import FAQ from "./components/homepage/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        {/* <BioBaskets />
        <ValuesBand />
        <SellingPoints />
        <FAQ /> */}
      </main>
      <Footer />
    </>
  );
}
