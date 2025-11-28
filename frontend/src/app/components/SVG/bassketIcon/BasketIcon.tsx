export default function BasketIcon() {
  return (
    <span
      className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
      style={{ background: "var(--color-yellow)" }}
      aria-hidden="true"
    >
      {/* Icône panier (SVG inline) */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6-6 6 6" />
        <path d="M3 9h18l-1.5 9a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3L3 9z" />
        <path d="M9 13h6" />
      </svg>
    </span>
  );
}
