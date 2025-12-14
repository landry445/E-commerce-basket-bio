"use client";

export default function OrderAside() {
  return (
    <aside className="space-y-4 md:mr-5">
      {/* Carte info commande */}
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{ background: "var(--color-yellow)" }}
      >
        <div
          className="w-full
          bg-[url('/Aside.jpg')] bg-cover bg-center bg-no-repeat
          rounded-2xl
          shadow
          px-5 sm:px-8 md:px-8
          py-8 md:py-10"
        >
          <h3
            className="text-center text-3xl md:text-3xl mb-4"
            style={{
              color: "#fff",
              fontFamily: "var(--font-pacifico)",
            }}
          >
            Pour commander
          </h3>

          <p className="text-base text-white leading-relaxed ">
            Merci de passer vos commandes en ligne à l’aide du formulaire.
            Préparation de votre commande et distribution à la Gare de Savenay
          </p>

          <p className="text-base text-white mt-2 leading-relaxed">
            Retrouver la composition des paniers de légume dans la Newsletter
            pour chaque mardis et vendredis.
          </p>
        </div>
      </div>
    </aside>
  );
}
