import { SeasonIconBase } from "./SeasonIconBase";

type IconProps = {
  className?: string;
};

export function AutumnIcon({ className }: IconProps) {
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
        {/* grande feuille */}
        <path d="M12 4.5c-2.4 0-4.3 1.7-4.3 4.4 0 3.3 2 5.8 4.3 7 2.3-1.2 4.3-3.7 4.3-7 0-2.7-1.9-4.4-4.3-4.4z" />
        {/* nervure centrale */}
        <path d="M12 6.2v8" />
        {/* petite feuille qui tombe */}
        <path d="M7.2 14.4c-1.2.1-2 .6-2.5 1.5.9.3 1.8.2 2.6-.3" />
      </svg>
    </SeasonIconBase>
  );
}
