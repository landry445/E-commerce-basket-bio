type IconProps = {
  size?: number;
  className?: string;
  title?: string;
  strokeWidth?: number;
};

// Icône Connexion (silhouette + signe +)
export function IconLogin({
  size = 20,
  className,
  title,
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {/* Silhouette */}
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
      {/* Signe + */}
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  );
}

// Icône Déconnexion (silhouette + flèche sortante)
export function IconLogout({
  size = 20,
  className,
  title,
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {/* Silhouette */}
      <circle cx="10" cy="8" r="4" />
      <path d="M2 20c0-3.5 3.6-6 8-6" />
      {/* Flèche sortante */}
      <path d="M16 17l5-5-5-5" />
      <line x1="21" y1="12" x2="12" y2="12" />
    </svg>
  );
}
