import Link from "next/link";

type NavbarLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

export default function NavbarLinks({
  onNavigate,
  className = "",
}: NavbarLinksProps) {
  return (
    <ul
      className={`md:flex gap-8 font-sans text-[1rem] font-semibold color-dark ${className}`}
    >
      <li>
        <Link
          href="/"
          onClick={onNavigate}
          className="transition-colors  hover:text-primary cursor-pointer"
        >
          Accueil
        </Link>
      </li>
      <li>
        <Link
          href="/baskets"
          onClick={onNavigate}
          className="transition-colors  hover:text-primary cursor-pointer"
        >
          Nos paniers
        </Link>
      </li>
      <li>
        <Link
          href="/market-gardener"
          onClick={onNavigate}
          className="transition-colors cursor-pointer  hover:text-primary"
        >
          Votre maraîcher
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          onClick={onNavigate}
          className="transition-colors cursor-pointer  hover:text-primary"
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}
