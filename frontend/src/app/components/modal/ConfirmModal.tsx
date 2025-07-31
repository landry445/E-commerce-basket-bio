"use client";

type Props = {
  open: boolean;
  message: string;
  subtext?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  message,
  subtext,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl p-8 shadow-xl min-w-[320px] text-center">
        <p className="font-bold text-lg mb-2">{message}</p>
        {subtext && <p className="text-sm text-gray-500 mb-4">{subtext}</p>}
        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 cursor-pointer rounded-full bg-green-100 text-green-700 hover:bg-green-200 font-bold"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded-full cursor-pointer bg-red-600 text-white hover:bg-red-700 font-bold"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
