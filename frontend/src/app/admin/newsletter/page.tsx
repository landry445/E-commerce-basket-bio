import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";
import { AdminNewsletterScreen } from "../../components/newsletter/AdminNewsletterScreen";

export default function AdminNewsletterPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <section className="container mx-auto max-w-5xl px-4 py-8">
          <h1
            className="mt-3 mb-6 text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Newsletter
          </h1>

          <AdminNewsletterScreen />
        </section>
      </main>

      <Footer />
    </>
  );
}
