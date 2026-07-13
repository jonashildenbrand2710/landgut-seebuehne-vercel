import type { Metadata, Viewport } from "next";
import { Inclusive_Sans, Noto_Serif_Georgian } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { GoogleAdsLeadConversionFromQuery } from "@/components/GoogleAdsTracking";
import { Header } from "@/components/Header";
import { MetaConversionFromQuery } from "@/components/MetaConversionTracking";
import { MetaPixel } from "@/components/MetaPixel";
import { GOOGLE_CONSENT_BOOTSTRAP_SCRIPT } from "@/lib/google-ads";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteJsonLd } from "@/components/StructuredData";
import { imageLibrary, siteConfig } from "@/data/site";
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

const googleSiteVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION?.trim();
const siteVerification: Metadata["verification"] = {
  ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
  ...(bingSiteVerification ? { other: { "msvalidate.01": bingSiteVerification } } : {})
};

// Pinch-Zoom bewusst deaktiviert (Kundenwunsch): verhindert versehentliches
// Zoomen auf Mobilgeraeten, Schriftgroessen sind dafuer durchgehend gross genug.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Landgut Seebühne | Hochzeitslocation am See",
    template: "%s | Landgut Seebühne"
  },
  description:
    "Naturnahe Hochzeitslocation am See in Mittelfranken: privat, herzlich und professionell begleitet.",
  applicationName: "Landgut Seebühne",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Landgut Seebühne",
    url: `${siteConfig.domain}/`,
    images: [
      {
        url: `${siteConfig.domain}${imageLibrary.hero.src}`,
        width: 1920,
        height: 1277,
        alt: imageLibrary.hero.alt
      }
    ]
  },
  twitter: {
    card: "summary_large_image"
  },
  verification: siteVerification
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inclusiveSans.variable} ${notoSerif.variable}`}>
      <body>
        {/* Muss vor allen Google-Kommandos laufen: gtag-Stub + Consent Mode v2
            Default (alle vier Signale denied). gtag.js lädt erst nach Opt-in. */}
        <script
          dangerouslySetInnerHTML={{ __html: GOOGLE_CONSENT_BOOTSTRAP_SCRIPT }}
          id="google-consent-bootstrap"
        />
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        <MetaPixel />
        <MetaConversionFromQuery />
        <GoogleAdsTag />
        <GoogleAdsLeadConversionFromQuery />
        <SiteJsonLd />
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <ConsentBanner />
        <ScrollReveal />
      </body>
    </html>
  );
}
