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

export const metadata: Metadata = {
  title: "SNY Perfumes — Wear Your Signature | Haute Parfumerie",
  description:
    "Experience luxury French perfume oils, 6 to 8 hours certified longevity, and beast-mode sillage with SNY Perfumes. Featuring Titan Aura, Midnight Oud, Aqua Tide, and more.",
  keywords: [
    "SNY Perfumes",
    "French Perfume Oils",
    "Long Lasting Perfume",
    "Extrait De Parfum",
    "Midnight Oud",
    "Titan Aura",
    "Luxury Perfume India",
  ],
  authors: [{ name: "SNY Perfumes" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark scroll-smooth`}>
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
