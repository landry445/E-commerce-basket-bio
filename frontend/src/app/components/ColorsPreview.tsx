"use client";

export default function ColorsPreview() {
  const colors = [
    { name: "primary", className: "bg-primary", text: "text-white" },
    { name: "dark", className: "bg-dark", text: "text-white" },
    { name: "accent", className: "bg-accent", text: "text-white" },
    { name: "yellow", className: "bg-yellow", text: "text-dark" },
    { name: "light", className: "bg-light", text: "text-dark" },
    { name: "white", className: "bg-white", text: "text-dark border" },
  ];
  return (
    <div className="p-8 space-y-3">
      <div className="bg-red-500 p-4 text-white">Test Tailwind</div>

      <h2 className="font-bold text-lg mb-4">Palette personnalisée Tailwind</h2>
      <div className="flex flex-col gap-3">
        {colors.map(({ name, className, text }) => (
          <div
            key={name}
            className={`flex items-center rounded shadow border px-4 py-3 ${className} ${text}`}
          >
            <span className="w-36 font-mono">{name}</span>
            <span className="ml-6 text-sm opacity-70">{className}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
