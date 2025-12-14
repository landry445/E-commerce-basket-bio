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
          bg-yellow
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
              <strong>Gaec du Jardin Des Rainettes</strong>
            </p>
            9, tresnard
            <p>
              <strong>44630 PLESSE</strong>
            </p>
            <p>Tél.&nbsp;: 07&nbsp;88&nbsp;27&nbsp;94&nbsp;07</p>
          </address>

          {/* Liens légaux — centrés en mobile, espacés ; colonne dédiée en desktop */}
          <nav
            className="
              flex flex-col items-center gap-1 text-sm text-foreground
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
              src="/logo-frog-jdr.png"
              alt="Logo ferme"
              width={100}
              height={100}
              priority
            />
            <Image
              src="/logo-ab-eurofeuille.webp"
              alt="Label AB"
              width={80}
              height={48}
              className="w-auto"
              priority
            />
          </div>
        </div>

        {/* Ligne séparatrice + baseline */}
        <div className="mt-5 border-t border-black/10 pt-3 text-center text-[0.93rem] text-foreground/90">
          © {year} Gaec du Jardin Des Rainettes. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
