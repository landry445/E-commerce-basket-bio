import Link from "next/link";
import { IconLogin, IconLogout } from "../SVG/NavbarConnectIcon";

type Props = {
  user?: { firstname: string; isAdmin: boolean };
  onLogout?: () => void;
  isMobile?: boolean;
  onAfterClick?: () => void;
};

export default function NavbarUserButton({
  user,
  onLogout,
  isMobile,
  onAfterClick,
}: Props) {
  const circleSize = isMobile ? "w-10 h-10" : "w-8 h-8";
  const iconSize = isMobile ? 22 : 20;

  if (user) {
    // Bouton déconnexion
    return (
      <button
        onClick={() => {
          onAfterClick?.();
          onLogout?.();
        }}
        className={`${isMobile ? "w-full px-3 py-2" : "ml-4 px-3 py-1"}
                    rounded cursor-pointer bg-[var(--color-accent)] 
                    hover:brightness-95 text-white text-sm
                    inline-flex items-center gap-2`}
        aria-label="Se déconnecter"
      >
        <IconLogout size={iconSize} />
        <span>Déconnexion</span>
      </button>
    );
  }

  // Lien connexion
  return (
    <Link
      href="/login"
      onClick={onAfterClick}
      className={`inline-flex items-center justify-center rounded-full border
                 
                 bg-[var(--color-primary)] text-white transition
                  ${circleSize} bg-[var(--color-light)]`}
      aria-label="Connexion"
    >
      <IconLogin size={iconSize} />
    </Link>
  );
}
