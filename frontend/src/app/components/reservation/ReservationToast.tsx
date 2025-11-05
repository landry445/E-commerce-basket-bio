type ToastProps = { type: "ok" | "err"; text: string };

export default function Toast({ type, text }: ToastProps) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      aria-live="polite"
    >
      <div
        className={[
          "rounded-full px-4 py-2 shadow text-white",
          type === "ok" ? "bg-emerald-600" : "bg-rose-600",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}
