import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lejardindesrainettes.fr"),

  title: {
    default: "Paniers de légumes bio à Savenay | Du Jardin des Rainettes",
    template: "%s | Jardin des Rainettes",
  },

  description:
    "Réservation de paniers de légumes bio à Savenay. Circuit court, légumes de saison. Retrait à la Gare de Savenay.",

  alternates: { canonical: "/" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://lejardindesrainettes.fr",
    siteName: "Jardin des Rainettes",
    locale: "fr_FR",
    title: "Paniers de légumes bio à Savenay | Du Jardin des Rainettes",
    description:
      "Réservation de paniers bio. Retrait à la Gare de Savenay. Circuit court, légumes de saison.",
    images: [
      {
        url: "/logo-jardins-des-rainettes.jpeg",
        width: 1200,
        height: 630,
        alt: "Jardin des Rainettes – paniers de légumes bio à Savenay",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Paniers de légumes bio à Savenay | Jardin des Rainettes",
    description:
      "Réservation en ligne de paniers bio. Retrait à la Gare de Savenay.",
    images: ["/logo-jardins-des-rainettes.jpeg"],
  },

  icons: {
    icon: [{ url: "/logo-frog-jdr.png" }],
    apple: [{ url: "/logo-frog-jdr.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B8C51",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
