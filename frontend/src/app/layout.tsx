import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paniers Bio – Chaussée de Plessis",
  description: "Réservation de paniers de légumes bio, locaux et de saison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className="antialiased bg-[var(--background)] text-[var(--foreground)]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
