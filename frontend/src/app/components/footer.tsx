import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-yellow mt-10 py-6 text-center text-gray-700 text-sm">
      <div className="mx-auto px-4 flex flex-col items-center gap-2">
        <Image src="/logo-frog.png" alt="Logo" width={12} height={12} />
        <div>
          SCEA du Plessis &copy; {new Date().getFullYear()} &mdash; Exploitation
          maraîchère bio à Chaussee en Retz.
        </div>
        <div className="flex gap-2 justify-center">
          <Image src="/logo-ab.svg" alt="Label AB" width={32} height={16} />
          <Image src="/ecocert.png" alt="Ecocert" width={32} height={16} />
        </div>
        <div>
          <a href="mailto:contact@exploplessis.fr" className="underline">
            contact@exploplessis.fr
          </a>
        </div>
      </div>
    </footer>
  );
}
