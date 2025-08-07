import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-12"
      style={{ background: "var(--color-yellow)" }}
    >
      {/* Zone principale */}
      <div
        className="
          max-w-4xl mx-auto px-6 py-6
          grid grid-cols-2 gap-y-4      /* Mobile : grille 2 colonnes */
          md:flex md:items-start md:justify-between /* Desktop : flex ligne */
        "
      >
        {/* Logo frog (mobile : ligne 2 / col 1) */}
        <div className="col-start-1 row-start-2 md:order-1">
          <Image
            src="/logo-frog.png"
            alt="Logo ferme"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* Adresse (mobile : ligne 1 / col 1) */}
        <address className="col-start-1 row-start-1 not-italic text-[0.95rem] md:order-2">
          <p>
            <strong>Joan &amp; Magalie VINCE</strong>
          </p>
          <p>8&nbsp;Les&nbsp;Escarts – Le Coudray</p>
          <p>
            <strong>44490 PLESSÉ</strong>
          </p>
          <p>Tél.&nbsp;: 06&nbsp;74&nbsp;76&nbsp;79&nbsp;90</p>
        </address>

        {/* Liens (mobile : ligne 1 / col 2 - alignés à droite) */}
        <nav
          className="
            col-start-2 row-start-1 justify-self-end
            flex flex-col gap-1 text-sm text-[var(--foreground)]
            md:order-3
          "
        >
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Mentions légales
          </a>
          <a href="#" className="hover:underline">
            Politique de confidentialité
          </a>
        </nav>

        {/* Logo AB (mobile : ligne 2 / col 2) */}
        <div className="col-start-2 row-start-2 justify-self-end md:order-4">
          <Image
            src="/logo-ab.svg"
            alt="Label Agriculture Biologique"
            width={60}
            height={60}
          />
        </div>
      </div>

      {/* Barre copyright */}
      <div className="text-center py-2 text-[0.93rem] text-[var(--foreground)] opacity-90">
        © {year} SARL Les Paniers de Plessé. Tous droits réservés.
      </div>
    </footer>
  );
}
