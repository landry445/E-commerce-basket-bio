import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gaec du Jardin Des Rainettes - Votre Maraîcher Bio",
  description:
    "Réservation de paniers de légumes bio, locaux et de saison à la gare de Savenay.",
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
