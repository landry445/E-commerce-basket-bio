"use client";

type NavbarProps = {
  user?: { firstname: string; isAdmin: boolean };
  onLogout?: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-dark text-white">
      {/* Logo */}
      <div className="text-xl font-bold font-script tracking-wide">
        Paniers Bio
      </div>
      {/* Liens principaux */}
      <ul className="flex gap-4 font-sans">
        <li>
          <a href="/" className="hover:underline">
            Accueil
          </a>
        </li>
        <li>
          <a href="/paniers" className="hover:underline">
            Nos paniers
          </a>
        </li>
        <li>
          <a href="/maraicher" className="hover:underline">
            Maraîcher
          </a>
        </li>
        {user ? (
          <>
            {user.isAdmin ? (
              <li>
                <a href="/admin/paniers" className="hover:underline">
                  Admin
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a href="/reserver" className="hover:underline">
                    Réserver
                  </a>
                </li>
                <li>
                  <a href="/mes-reservations" className="hover:underline">
                    Mes réservations
                  </a>
                </li>
              </>
            )}
            <li>
              <button
                type="button"
                onClick={onLogout}
                className="ml-4 px-3 py-1 rounded bg-primary hover:brightness-90 text-white text-sm"
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/login" className="hover:underline">
                Se connecter
              </a>
            </li>
            <li>
              <a href="/register" className="hover:underline">
                S’inscrire
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
