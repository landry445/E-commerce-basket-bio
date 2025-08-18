import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import ScrollingBanner from "../components/ScrollingBanner";

import Hero from "../components/market-gardener/Hero";
import ProducerIntro from "../components/market-gardener/ProducerIntro";
import Features from "../components/market-gardener/Features";
import SalesPoints from "../components/market-gardener/SalesPoints";
import MapEmbed from "../components/market-gardener/MapEmbed";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        <Hero />
        <ProducerIntro />
        <Features />
        <ScrollingBanner />
        <SalesPoints />
        <MapEmbed />
        <Footer />
      </main>
    </>
  );
}
