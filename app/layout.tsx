import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "E-DEVY - Algorithmique, MATLAB et Méthodes Numériques",
  description:
    "Plateforme pédagogique pour les étudiants de l'Université d'Antananarivo. Apprenez l'algorithmique, les organigrammes, MATLAB et les méthodes numériques.",
  keywords:
    "algorithmique, matlab, méthodes numériques, dichotomie, Newton, Simpson, trapèzes, université Antananarivo",
  authors: [{ name: "E-DEVY" }],
  openGraph: {
    title: "E-DEVY - Algorithmique, MATLAB et Méthodes Numériques",
    description:
      "Plateforme pédagogique pour les étudiants de l'Université d'Antananarivo.",
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
