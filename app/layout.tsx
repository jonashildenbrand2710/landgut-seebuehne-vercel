import type { Metadata } from "next";
import { Inclusive_Sans, Noto_Serif_Georgian } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const notoSerif = Noto_Serif_Georgian({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Landgut Seebühne | Hochzeitslocation am See",
    template: "%s | Landgut Seebühne"
  },
  description:
    "Naturnahe Hochzeitslocation am See in Mittelfranken: privat, herzlich und professionell begleitet.",
  applicationName: "Landgut Seebühne",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Landgut Seebühne",
    url: siteConfig.domain
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inclusiveSans.variable} ${notoSerif.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
