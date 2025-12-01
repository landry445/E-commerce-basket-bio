import { SeasonIconBase } from "./SeasonIconBase";

type IconProps = {
  className?: string;
};

export function SpringIcon({ className }: IconProps) {
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
        {/* fleur */}
        <circle cx="12" cy="7.5" r="0.9" />
        <path d="M12 4.5c-1 .3-1.7.9-2 1.8.1 1 .7 1.7 1.7 2" />
        <path d="M12 4.5c1 .3 1.7.9 2 1.8-.1 1-.7 1.7-1.7 2" />
        <path d="M9.7 6.5c-.9 0-1.6.3-2.1.9.2 1 .8 1.6 1.8 1.8" />
        <path d="M14.3 6.5c.9 0 1.6.3 2.1.9-.2 1-.8 1.6-1.8 1.8" />
        {/* tige */}
        <path d="M12 8.8V17" />
        {/* feuille printanière */}
        <path d="M12 12.2c-2 0-3.4 1-4 2.7 1.8.3 3.3-.1 4.4-1.2" />
      </svg>
    </SeasonIconBase>
  );
}
