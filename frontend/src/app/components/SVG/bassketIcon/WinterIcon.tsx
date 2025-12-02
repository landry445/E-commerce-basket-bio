import { SeasonIconBase } from "./SeasonIconBase";

type IconProps = {
  className?: string;
};

export function WinterIcon({ className }: IconProps) {
  return (
    <SeasonIconBase className={className}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* cercle central */}
        <circle cx="12" cy="12" r="2" />
        {/* axes principaux */}
        <path d="M12 4v4" />
        <path d="M12 16v4" />
        <path d="M4 12h4" />
        <path d="M16 12h4" />
        {/* diagonales */}
        <path d="M6.2 6.2l2.3 2.3" />
        <path d="M15.5 15.5l2.3 2.3" />
        <path d="M17.8 6.2l-2.3 2.3" />
        <path d="M8.5 15.5l-2.3 2.3" />
      </svg>
    </SeasonIconBase>
  );
}
