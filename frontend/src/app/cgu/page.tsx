import Footer from "../components/Footer";
import Navbar from "../components/navbar/Navbar";

export default function CGUPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        <section className="container mx-auto px-4 py-10">
          <h1
            className="text-3xl md:text-4xl text-center mb-8"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Conditions Générales d’Utilisation
          </h1>

          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed">
            {/* Objet */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Objet du site
              </h2>
              <p>
                Le site <strong>[Nom du site]</strong> permet de réserver un
                panier de légumes bio en ligne et de le récupérer aux points de
                retrait prévus. Pas de livraison ni de paiement en ligne.
              </p>
            </section>

            {/* Inscription */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Création d’un compte
              </h2>
              <p>
                La réservation nécessite un compte utilisateur. Les informations
                fournies doivent être exactes et à jour.
              </p>
            </section>

            {/* Réservations */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Réservations
              </h2>
              <p>
                Chaque utilisateur peut réserver jusqu’à 2 paniers par jour,
                selon disponibilité. Une réservation vaut engagement de venir
                chercher son panier.
              </p>
            </section>

            {/* Retrait */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Retrait des paniers
              </h2>
              <p>
                Les paniers se retirent uniquement sur place aux lieux et dates
                indiqués.
              </p>
            </section>

            {/* Absences */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Absences
              </h2>
              <p>
                Des absences répétées peuvent entraîner la suspension ou la
                suppression du compte.
              </p>
            </section>

            {/* Responsabilités */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Responsabilités
              </h2>
              <p>
                Nous faisons notre possible pour assurer la disponibilité du
                site et la qualité des paniers. Nous ne pouvons pas être
                responsables d’une rupture exceptionnelle ou d’un problème
                technique.
              </p>
            </section>

            {/* Données perso */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Données personnelles
              </h2>
              <p>
                Vos données sont utilisées uniquement pour les réservations,
                conformément à notre{" "}
                <a href="/politique-confidentialite">
                  Politique de confidentialité
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
