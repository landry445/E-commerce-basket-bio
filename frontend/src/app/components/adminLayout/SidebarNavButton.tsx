"use client";
type SidebarNavButtonProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function SidebarNavButton({
  label,
  active,
  onClick,
}: SidebarNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 cursor-pointer rounded-full border-2 transition-colors
        font-sans font-semibold text-dark
        ${
          active
            ? "bg-white border-accent shadow-sm"
            : "bg-transparent border-white hover:bg-white/90"
        }
      `}
      style={{ outline: "none" }}
    >
      {label}
    </button>
  );
}
