export default function AdminActionsBar() {
  return (
    <div className="flex justify-end items-center gap-3 p-5">
      <button
        className="px-3 py-1 cursor-pointer rounded-full border border-dark bg-white font-sans text-dark text-xs shadow-sm hover:bg-gray-100 transition"
        style={{ minWidth: 92 }}
        onClick={() => {
          /* log out ici */
        }}
      >
        Se déconnecter
      </button>
      <a
        href="/"
        className="px-3 py-1 rounded-full border border-dark bg-white font-sans text-dark text-xs shadow-sm hover:bg-gray-100 transition"
        target="_blank"
        rel="noopener noreferrer"
        style={{ minWidth: 82 }}
      >
        Voir le site
      </a>
    </div>
  );
}
