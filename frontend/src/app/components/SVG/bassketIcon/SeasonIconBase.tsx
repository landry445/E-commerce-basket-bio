type SeasonIconBaseProps = {
  children: React.ReactNode;
  className?: string;
};

export function SeasonIconBase({ children, className }: SeasonIconBaseProps) {
  const base =
    "flex h-9 w-9 items-center justify-center rounded-full " +
    "bg-[var(--color-primary)] text-white flex-shrink-0";

  const merged = className ? `${base} ${className}` : base;

  return <div className={merged}>{children}</div>;
}
