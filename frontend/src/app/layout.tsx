import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lejardindesrainettes.fr"),
  title: {
    default: "GAEC du Jardin des Rainettes – Paniers de légumes bio à Savenay",
    template: "%s – Jardin des Rainettes",
  },
  description:
    "Réservation de paniers de légumes bio, locaux et de saison à Savenay. Maraîcher bio en circuit court. Vente de légumes frais au marché de Blain",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "GAEC du Jardin des Rainettes",
    description:
      "Paniers de légumes bio, locaux et de saison. Réservation en ligne.",
    url: "https://www.lejardindesrainettes.fr",
    siteName: "Jardin des Rainettes",
    locale: "fr_FR",
    type: "website",
  },
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
