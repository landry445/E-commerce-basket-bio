export default function ConditionsReservationPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold">
          Conditions générales de réservation
        </h1>

        {/* Article 1 – Objet */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Article 1 – Objet</h2>
          <p>
            Les présentes conditions générales de réservation définissent le
            cadre du service proposé sur le site de réservation de paniers de
            légumes bio «DU JARDIN DES RAINETTES».
          </p>
          <p>
            Le service permet la réservation de paniers de légumes pour un
            retrait sur place. Le règlement se fait lors du retrait. Aucun
            paiement ne passe par le Site.
          </p>
        </section>

        {/* Article 2 – Parties */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Article 2 – Parties</h2>
          <p>
            Le service est proposé par DU JARDIN DES RAINETTES, exploitant
            agricole, domicilié à 9 TRESNARD 44630 PLESSE, joignable à
            l&apos;adresse e-mail gaecdesrainettes@mailo.com et au numéro
            07&nbsp;88&nbsp;27&nbsp;94&nbsp;07.
          </p>
          <p>
            Toute personne physique majeure qui effectue une réservation via le
            Site a la qualité de Client.
          </p>
        </section>

        {/* Article 3 – Description du service */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">
            Article 3 – Description du service
          </h2>
          <p>
            Le Site affiche des paniers de légumes bio, des dates de retrait et
            des lieux de retrait. Les descriptions et la composition des paniers
            reflètent la production du moment.
          </p>
          <p>
            Le prix indiqué pour chaque panier correspond au montant à régler
            lors du retrait sur place, sauf erreur manifeste ou ajustement lié à
            une variation de production. Une information peut précéder le
            retrait en cas de modification notable lorsque les coordonnées du
            Client le permettent.
          </p>
        </section>

        {/* Article 4 – Processus de réservation */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">
            Article 4 – Processus de réservation
          </h2>
          <p>
            Le Client sélectionne un panier, un lieu et une date proposés sur le
            Site, puis renseigne ses coordonnées et valide la demande de
            réservation.
          </p>
          <p>
            Une confirmation peut parvenir au Client par e-mail, à
            l&apos;adresse fournie lors de la demande, sous réserve d&apos;une
            adresse valide.
          </p>
          <p>
            La réservation garde un caractère indicatif tant que le retrait
            n&apos;a pas lieu. La vente se conclut lors du retrait sur place et
            du règlement du panier par le Client.
          </p>
        </section>

        {/* Article 5 – Annulation et non-retrait */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">
            Article 5 – Annulation et non-retrait
          </h2>
          <p>
            En cas d&apos;imprévu, une information transmise dès que possible à
            l&apos;exploitant facilite la gestion des paniers. Les coordonnées
            utiles figurent sur le Site ou dans les messages de confirmation.
          </p>
          <p>
            En cas d&apos;absence du Client lors du créneau convenu, le panier
            peut rester indisponible pour une autre personne et peut faire
            l&apos;objet d&apos;une nouvelle organisation selon les possibilités
            de l&apos;exploitant.
          </p>
          <p>
            Des règles plus précises (délai pour prévenir, conditions de
            maintien d&apos;un panier, etc.) peuvent rejoindre le Site ou les
            messages envoyés au Client si une organisation plus stricte devient
            nécessaire.
          </p>
        </section>

        {/* Article 6 – Produits frais */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Article 6 – Produits frais</h2>
          <p>
            Les paniers contiennent des denrées périssables. La conservation de
            ces produits nécessite une chaîne du froid et une consommation dans
            des délais adaptés.
          </p>
          <p>
            La réglementation sur le droit de rétractation prévoit des
            exceptions pour ce type de produits. La vente se forme lors du
            retrait sur place, ce qui limite le champ d&apos;application de ce
            droit.
          </p>
        </section>

        {/* Article 7 – Responsabilité et droit applicable */}
        <section className="mb-2 space-y-2">
          <h2 className="text-xl font-semibold">
            Article 7 – Responsabilité et droit applicable
          </h2>
          <p>
            Le Site repose sur un service en ligne soumis à des aléas
            techniques. La responsabilité de l&apos;exploitant ne couvre pas les
            interruptions de service ou les dommages liés à des causes
            extérieures au Site ou à un usage non conforme.
          </p>
          <p>
            Le droit français encadre les présentes conditions générales de
            réservation et le service proposé. Une solution amiable reste
            recherchée en priorité en cas de désaccord entre le Client et
            l&apos;exploitant.
          </p>
        </section>
      </section>
    </main>
  );
}
