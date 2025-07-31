export default function BackButton({
  showBack,
  onBack,
}: {
  showBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="flex justify-end items-center gap-3 p-5">
      {showBack && (
        <button
          className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full border border-dark bg-white text-2xl shadow-sm hover:bg-gray-100 transition"
          onClick={onBack}
          aria-label="Retour"
          type="button"
        >
          <span className="inline-block -ml-1">&#8592;</span>
        </button>
      )}
    </div>
  );
}
