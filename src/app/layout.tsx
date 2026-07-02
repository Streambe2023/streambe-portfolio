import type { Metadata } from "next";
import { Familjen_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-familjen",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Streambe | Portfolio de proyectos",
  description: "Portfolio comercial de los proyectos de Streambe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${familjenGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
