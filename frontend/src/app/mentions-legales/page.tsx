export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Mentions légales</h1>

        {/* Éditeur du site */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Éditeur du site</h2>
          <p>
            Le site de réservation de paniers de légumes bio « DU JARDIN DES
            RAINETTES » a pour éditeur :
          </p>
          <p>
            <strong>Nom&nbsp;:</strong> GAEC DU JARDIN DES RAINETTES
            <br />
            <strong>Adresse&nbsp;:</strong> 9 TRESNARD 44630 PLESSE
            <br />
            <strong>SIRET n°&nbsp;:</strong> 98842463600013
          </p>
          <p>
            <strong>Directeur artistique&nbsp;:</strong> Landry Dupont
          </p>
        </section>

        {/* Hébergeur */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Hébergeur</h2>
          <p>
            Le Site se trouve hébergé par&nbsp;:
            <br />
            <strong>Raison sociale&nbsp;:</strong> SARL ALWAYSDATA
            <br />
            <strong>Adresse&nbsp;:</strong> 91 rue du Faubourg Saint-Honoré,
            75008 Paris, France
            <br />
            <strong>Téléphone&nbsp;:</strong> +33 (0)1 84 16 23 49
            <br />
            <strong>Site web&nbsp;:</strong>{" "}
            <a
              href="https://www.alwaysdata.com/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              https://www.alwaysdata.com/
            </a>
          </p>
        </section>

        {/* Activité */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Activité</h2>
          <p>
            Le Site présente une activité de maraîchage et une offre de paniers
            de légumes bio, locaux et de saison.
          </p>
          <p>
            Le Site permet la réservation de paniers pour un retrait sur place.
            Aucun paiement ne s&apos;effectue en ligne.
          </p>
        </section>

        {/* Propriété intellectuelle */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
          <p>
            Les textes, photographies, illustrations, logos et éléments
            graphiques affichés sur le Site restent protégés par la législation
            française sur la propriété intellectuelle.
          </p>
          <p>
            Sauf mention différente, Landry Dupont détient les droits sur ces
            contenus. Toute reproduction ou diffusion en dehors d&apos;un usage
            privé demande une autorisation écrite de l&apos;éditeur.
          </p>
        </section>

        {/* Données personnelles */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Données personnelles</h2>
          <p>
            Des données à caractère personnel peuvent figurer dans les échanges
            liés à l&apos;usage du Site, en particulier lors de la création
            d&apos;un compte, d&apos;une réservation ou d&apos;une inscription à
            une éventuelle newsletter.
          </p>
          <p>
            <strong>Responsable du traitement&nbsp;:</strong> DU JARDIN DES
            RAINETTES
          </p>
          <p>
            <strong>Données traitées&nbsp;:</strong> nom, prénom, adresse
            e-mail, numéro de téléphone, informations de réservation (date,
            panier, lieu de retrait, message éventuel), préférence liée à la
            newsletter le cas échéant.
          </p>
          <p>
            Ces données servent à la gestion des comptes, aux réservations de
            paniers et à l&apos;envoi de messages liés au service. Aucune
            cession à des tiers à des fins commerciales ne figure au programme.
          </p>
          <p>
            Chaque utilisateur dispose d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, de limitation, d&apos;opposition
            et, dans les cas prévus par la loi, d&apos;un droit à la
            portabilité.
          </p>
          <p>
            Une demande s&apos;adresse par e-mail à&nbsp;:{" "}
            <strong>gaecdesrainettes@mailo.com</strong> ou par courrier à
            l&apos;adresse de l&apos;éditeur.
          </p>
          <p>
            Une réclamation peut se déposer auprès de la CNIL en cas de
            difficulté persistante.
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p>
            Le Site peut utiliser des cookies techniques utiles au
            fonctionnement du service ou à une mesure de fréquentation simple.
          </p>
          <p>
            Le navigateur de l&apos;utilisateur offre un contrôle sur ces
            cookies par ses paramètres.
          </p>
        </section>

        {/* Responsabilité et droit applicable */}
        <section className="mb-2 space-y-2">
          <h2 className="text-xl font-semibold">
            Responsabilité et droit applicable
          </h2>
          <p>
            Les informations présentes sur le Site possèdent un caractère
            informatif. Une mise à jour régulière reste recherchée sans garantie
            absolue d&apos;absence d&apos;erreur.
          </p>
          <p>
            La responsabilité de l&apos;éditeur ne se trouve pas engagée en cas
            d&apos;indisponibilité du Site ou de dommage lié à un usage du Site
            inadapté ou à des causes extérieures.
          </p>
          <p>
            Le droit français s&apos;applique aux présentes mentions et à
            l&apos;usage du Site. En cas de litige, une solution amiable reste
            recherchée en priorité avant toute saisine des tribunaux compétents.
          </p>
        </section>
      </section>
    </main>
  );
}
