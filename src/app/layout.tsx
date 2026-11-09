import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.snyonline.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SNY Perfumes — Wear Your Signature | Luxury French Fragrances",
    template: "%s | SNY Perfumes",
  },
  description:
    "Discover SNY Perfumes — artisanal French perfume oils formulated with 6 to 8 hours certified longevity and beast-mode projection. Crafted in Surat, Gujarat with Pan-India delivery. Featuring Titan Aura, Midnight Oud, Aqua Tide, and more.",
  keywords: [
    "SNY",
    "sny online",
    "snyonline",
    "snyonline.in",
    "SNY Perfumes",
    "SNY Perfume",
    "SNY Fragrances",
    "SNY Surat",
    "SNY perfumes Surat",
    "sny_perfumes",
    "French Perfume Oils",
    "Long Lasting Perfume India",
    "Extrait De Parfum",
    "Midnight Oud",
    "Titan Aura",
    "Aqua Tide",
    "Arabian Gold",
    "Silk Oud",
    "Floral Desire",
    "Luxury Perfume India",
  ],
  authors: [{ name: "SNY Perfumes", url: siteUrl }],
  creator: "SNY Perfumes",
  publisher: "SNY Perfumes",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SNY Perfumes — Wear Your Signature | Luxury French Fragrances",
    description:
      "Artisanal French perfume oils formulated with 6 to 8 hours certified longevity and beast-mode projection. Handcrafted in Surat, Gujarat. Pan-India Delivery.",
    url: siteUrl,
    siteName: "SNY Perfumes",
    images: [
      {
        url: "/branding/hero-model.jpg",
        width: 1200,
        height: 630,
        alt: "SNY Perfumes Luxury Flacon Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SNY Perfumes — Luxury French Fragrance Oils",
    description:
      "6 to 8 hours certified longevity • Beast-mode projection • Pan India Delivery from Surat, Gujarat.",
    images: ["/branding/hero-model.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google9464e3186bdb289a",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "SNY Perfumes",
      "url": siteUrl,
      "logo": `${siteUrl}/branding/signature.jpg`,
      "description":
        "Luxury French perfume oil formulations with 6-8 hours certified longevity, beast-mode projection, and Pan-India delivery from Surat, Gujarat.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "addressCountry": "IN",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "supportsny@gmail.com",
        "contactType": "customer service",
      },
      "sameAs": ["https://www.instagram.com/sny_perfumes"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "SNY Perfumes",
      "publisher": {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-foreground antialiased selection:bg-gold selection:text-black min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <CartDrawer />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
