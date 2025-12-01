import { SeasonIconBase } from "./SeasonIconBase";

type IconProps = {
  className?: string;
};

export function SummerIcon({ className }: IconProps) {
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
        {/* soleil */}
        <circle cx="12" cy="8" r="3" />
        <path d="M12 3.5v1.3" />
        <path d="M12 11.2v1.3" />
        <path d="M7.3 8H6" />
        <path d="M18 8h-1.3" />
        <path d="M8.4 5.4l-.9-.9" />
        <path d="M16.5 5.4l.9-.9" />
        <path d="M8.4 10.6l-.9.9" />
        <path d="M16.5 10.6l.9.9" />
        {/* champs */}
        <path d="M4 17h16" />
        <path d="M6 17c2-1.8 4-2.7 6-2.7s4 0.9 6 2.7" />
      </svg>
    </SeasonIconBase>
  );
}
