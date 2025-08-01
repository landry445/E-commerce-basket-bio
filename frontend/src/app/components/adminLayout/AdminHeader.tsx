// components/AdminHeader.tsx
interface AdminHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function AdminHeader({ title, onBack }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="font-[var(--font-pacifico)] text-3xl text-dark">
        Gérer votre <span className="italic">{title}</span>
      </h1>
      {onBack ? (
        <button
          className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full border border-dark bg-white text-2xl shadow-sm hover:bg-gray-100 transition"
          onClick={onBack}
          aria-label="Retour"
          type="button"
        >
          <span className="inline-block -ml-1">&#8592;</span>
        </button>
      ) : null}
    </div>
  );
}
