import Link from "next/link";

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
  if (user) {
    return (
      <button
        onClick={() => {
          onAfterClick?.();
          onLogout?.();
        }}
        className={`${
          isMobile ? "w-full px-3 py-2" : "ml-4 px-3 py-1"
        } rounded cursor-pointer color-accent hover:brightness-95 text-white text-sm`}
      >
        Déconnexion
      </button>
    );
  }
  return (
    <Link
      href="/login"
      onClick={onAfterClick}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border border-dark text-dark hover:bg-primary hover:text-white transition
      ${isMobile ? "w-10 h-10 color-light" : "w-8 h-8 color-light"}`}
      aria-label="Connexion"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path
          fillRule="evenodd"
          d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a8 8 0 1116 0H4z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
