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
          bg-[var(--color-yellow)]
          mx-auto
          px-4 sm:px-8 md:px-12 lg:px-24
          py-6
          rounded-md
        "
      >
        {/* Layout harmonisé : colonne en mobile, grille en desktop */}
        <div
          className="
            flex flex-col items-center text-center gap-4
            md:grid md:grid-cols-4 md:items-start md:text-left md:gap-6
          "
        >
          {/* Adresse */}
          <address className="not-italic text-[0.95rem] md:col-span-2">
            <p>
              <strong>Joan &amp; Magalie VINCE</strong>
            </p>
            <p>8&nbsp;Les&nbsp;Escarts – Le Coudray</p>
            <p>
              <strong>44490 PLESSÉ</strong>
            </p>
            <p>Tél.&nbsp;: 06&nbsp;74&nbsp;76&nbsp;79&nbsp;90</p>
          </address>

          {/* Liens légaux — centrés en mobile, espacés ; colonne dédiée en desktop */}
          <nav
            className="
              flex flex-col items-center gap-1 text-sm text-[var(--foreground)]
              md:items-start md:col-span-1
            "
            aria-label="Liens légaux"
          >
            <Link href="/mentions-legales" className="hover:underline">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:underline">
              Politique de confidentialité
            </Link>
            <Link href="/cgu" className="hover:underline">
              CGU
            </Link>
          </nav>

          {/* Logos — groupés et alignés proprement */}
          <div
            className="
              flex items-center gap-4
              md:justify-end md:col-span-1
            "
          >
            <Image
              src="/logo-jardins-des-rainettes.jpeg"
              alt="Logo ferme"
              width={110}
              height={110}
              priority
              className="h-[60px] w-auto md:h-[70px]"
            />
            <Image
              src="/logo-ab.svg"
              alt="Label AB"
              width={60}
              height={60}
              className="h-[48px] w-auto md:h-[56px]"
            />
          </div>
        </div>

        {/* Ligne séparatrice + baseline */}
        <div className="mt-5 border-t border-black/10 pt-3 text-center text-[0.93rem] text-[var(--foreground)]/90">
          © {year} SARL Les Paniers de Plessé. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
