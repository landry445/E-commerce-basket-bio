import Footer from "../components/Footer";
import Navbar from "../components/navbar/Navbar";

export default function LegalNoticePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        <section className="container mx-auto px-4 py-10">
          <h1
            className="text-3xl md:text-4xl text-center mb-8"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Mentions Légales
          </h1>

          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed">
            {/* Éditeur */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Directeur de la publication :
              </h2>
              <p>
                Le site <strong>Bio Culture – Les Paniers Bio</strong> est édité
                par la <strong>SAS LES PANIERS DE CULTURE BIO</strong>.
              </p>
              <p className="mt-2">
                <strong>Siège social :</strong>
                <br />
                28 rue des Violettes
                <br />
                93100 Sevran
              </p>
              <p className="mt-2">
                <strong>Siret :</strong> 942 075 999 RCS NANTERRE
              </p>
            </section>

            {/* Conception / hébergement */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Conception, réalisation et hébergement
              </h2>
              <p>
                <strong>Logiciel de vente en ligne :</strong> SAS LES PANIERS DE
                CULTURE BIO
                <br />
                <strong>Siège social :</strong> 28 rue des Violettes, 93100
                Sevran
                <br />
                <strong>Siret :</strong> 942 075 999 RCS NANTERRE
              </p>
              <p className="mt-2">
                <strong>Direction artistique :</strong> Romane DUEPLA
              </p>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Propriété intellectuelle :
              </h2>
              <p>
                L’ensemble du site relève de la législation française et
                internationale sur les droits d’auteur et la propriété
                intellectuelle.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Tous droits de reproduction réservés pour les textes et les
                  photographies du site.
                </li>
                <li>
                  La reproduction de tout ou partie du site sur un support
                  électronique ou autre, quel qu’il soit, reste formellement
                  interdite sans autorisation écrite de l’auteur, conformément à
                  l’article L.122‑4 du Code de la Propriété Intellectuelle.
                </li>
              </ul>
              <p className="mt-2">
                <strong>Crédits photos :</strong> images décoratives ©
                Shutterstock.
                <br />
                <strong>Crédits icônes/pictos :</strong> © Bio Culture.
              </p>
            </section>

            {/* Liens hypertextes */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Liens hypertextes :
              </h2>
              <p>
                Les liens hypertextes mis en place dans le cadre du présent site
                Internet en direction d’autres ressources présentes sur le
                réseau Internet, et notamment vers des partenaires, ont été
                faits après obtention d’une autorisation préalable, valable
                après vérification.
              </p>
            </section>

            {/* Droit de réponse */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Droit de réponse :
              </h2>
              <p>
                Toute personne citée sur le site peut faire valoir un droit de
                réponse. Une simple demande reste adressée par courriel. La page
                Contact fournit un accès au mode de correspondance.
              </p>
            </section>

            {/* Politique de confidentialité */}
            <section>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Politique de confidentialité :
              </h2>
              <p>
                En cas de données recueillies sur le site Bio Culture – Les
                Paniers Bio, ces données sont dédiées à des usages de vente et
                de logistique. Aucune cession à des tiers extérieurs des données
                clients ou prospects n’a lieu hors impératifs légaux. Les
                informations recueillies sur le formulaire Contact servent au
                suivi d’une prise de contact ou d’une réservation et restent
                conservées pendant une durée proportionnée aux échanges.
              </p>
              <p className="mt-2">
                L’accès, la rectification et la suppression des données
                s’exercent par message via la page Contact ou directement lors
                des permanences à l’exploitation. La sécurité et la
                confidentialité des données bénéficient des mesures techniques
                et organisationnelles en vigueur.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
