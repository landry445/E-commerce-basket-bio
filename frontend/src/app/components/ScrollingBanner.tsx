"use client";

type Direction = "ltr" | "rtl";
type Speed = "slow" | "normal" | "fast";

type ScrollingBannerProps = {
  items?: string[];
  direction?: Direction;
  speed?: Speed;
  pauseOnHover?: boolean;
  className?: string;
};

const DURATIONS: Record<Speed, string> = {
  slow: "36s",
  normal: "24s",
  fast: "16s",
};

export default function ScrollingBanner({
  items = [
    "Le Jardin Des Rainettes",
    "Agriculture Bio Locale",
    "Les Paniers Fraîcheur",
    "Légumes de Saison",
  ],
  direction = "ltr",
  speed = "normal",
  pauseOnHover = true,
  className = "",
}: ScrollingBannerProps) {
  const cssVars = {
    ["--marquee-duration" as string]: DURATIONS[speed],
    ["--marquee-direction" as string]:
      direction === "rtl" ? ("reverse" as const) : ("normal" as const),
  } as React.CSSProperties;

  const Row = (
    <ul className="flex items-center gap-10">
      {items.map((txt) => (
        <li key={txt} className="flex items-center gap-4">
          <span
            aria-hidden
            className="text-xl md:text-2xl"
            style={{ color: "var(--color-primary)" }}
          >
            ✻
          </span>
          <span className="marquee-text whitespace-nowrap text-3xl md:text-5xl">
            {txt}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className={`marquee w-full py-6 md:py-8 ${
        pauseOnHover ? "marquee--pause" : ""
      } ${className}`}
      style={cssVars}
    >
      <div className="marquee__track">
        {Row}
        <div aria-hidden className="flex items-center gap-10">
          {Row}
        </div>
      </div>
    </section>
  );
}
