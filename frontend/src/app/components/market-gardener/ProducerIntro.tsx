export default function ProducerIntro() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto p-6 rounded shadow">
        <h2
          className="text-3xl  text-center mb-4"
          style={{
            color: "var(--color-dark)",
            fontFamily: "var(--font-pacifico)",
          }}
        >
          Un producteur de fruits et légumes bio
        </h2>
        <p className="text-center">
          L&apos;EARL DUREAU est une exploitation maraîchère de 16 hectares
          créée en septembre 1989 par Jean Dureau sur la commune de
          Chaumes-en-Retz. Elle fait partie des premières exploitations à
          proposer des légumes et des fruits biologiques grâce à une production
          naturelle qui respecte la terre et évite les méthodes nocives pour
          l&apos;environnement et la santé. L&apos;exploitation est certifiée
          Agriculture Biologique (AB) par Ecocert.
        </p>
      </div>
    </section>
  );
}
