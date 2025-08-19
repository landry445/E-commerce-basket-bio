import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full flex flex-col items-center"
      style={{ background: "var(--background)" }}
    >
      <div
        className="
          w-[90%]
          max-w-none            /* largeur libre, gérée par le padding */
          bg-[var(--color-yellow)]
          mx-auto
          px-4 sm:px-8 md:px-12 lg:px-24   /* marge responsive */
          py-6
        "
      >
        <div
          className="
            grid grid-cols-2 gap-y-4
            md:flex md:items-start md:justify-between
          "
        >
          {/* Logo frog */}
          <div className="col-start-1 row-start-2 md:order-1">
            <Image
              src="/logo-frog.png"
              alt="Logo ferme"
              width={110}
              height={110}
              priority
            />
          </div>

          {/* Adresse */}
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

          {/* Liens */}
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
            <Link href="/mentions-legales" className="hover:underline">
              Mentions légales
            </Link>
            <a href="#" className="hover:underline">
              Politique de confidentialité
            </a>
          </nav>

          {/* Logo AB */}
          <div className="col-start-2 row-start-2 justify-self-end md:order-4">
            <Image src="/logo-ab.svg" alt="Label AB" width={60} height={60} />
          </div>
        </div>

        <div className="w-full text-center pt-3 text-[0.93rem] text-[var(--foreground)] opacity-90">
          © {year} SARL Les Paniers de Plessé. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
