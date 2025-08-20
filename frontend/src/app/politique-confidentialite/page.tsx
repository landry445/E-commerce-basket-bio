import Footer from "../components/Footer";
import Navbar from "../components/navbar/Navbar";

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        <section className="container mx-auto px-4 py-10">
          <h1
            className="text-3xl md:text-4xl text-center mb-8"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Politique de Confidentialité
          </h1>

          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed">
            {/* Données collectées */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Données que nous collectons
              </h2>
              <p>
                Lors de la création d’un compte et des réservations, nous
                enregistrons vos informations : nom, prénom, email, téléphone et
                historique de réservation. Ces données servent uniquement à
                assurer le bon fonctionnement de votre compte et de vos
                réservations.
              </p>
            </section>

            {/* Finalités */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Pourquoi nous les utilisons
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gérer vos réservations de paniers</li>
                <li>Vous envoyer des rappels par e-mail ou SMS</li>
                <li>Garantir la sécurité de votre compte</li>
              </ul>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Durée de conservation
              </h2>
              <p>
                Vos données restent associées à votre compte tant qu’il est
                actif. Si vous supprimez votre compte, elles sont supprimées,
                sauf obligations légales.
              </p>
            </section>

            {/* Accès */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Qui a accès à vos données
              </h2>
              <p>
                Seuls les administrateurs de <strong>[Nom du site]</strong> ont
                accès à vos informations. Elles ne sont jamais revendues.
              </p>
            </section>

            {/* Droits */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Vos droits
              </h2>
              <p>
                Vous pouvez demander à consulter, modifier ou supprimer vos
                données. Pour cela, contactez-nous à{" "}
                <a href="mailto:[ton-email]">[ton-email]</a>.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Cookies
              </h2>
              <p>
                Nous utilisons uniquement des cookies techniques pour la
                connexion et les sessions. Aucun suivi publicitaire.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
