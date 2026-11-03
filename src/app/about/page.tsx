import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Award,
  Clock,
  Volume2,
  ShieldCheck,
  MapPin,
  Truck,
  Instagram,
  ArrowRight,
  HeartHandshake,
  Droplets,
} from "lucide-react";

export const metadata = {
  title: "About Us | SNY Perfumes — Haute Parfumerie from Surat, Gujarat",
  description:
    "Learn about SNY Perfumes. Premium, long-lasting, unisex fragrances inspired by luxury. Crafted in Surat, Gujarat with Pan India delivery.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-12 pb-24 border-b border-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-zinc-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-gold/40 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              THE STORY BEHIND THE SIGNATURE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight">
            Crafted In <span className="gold-gradient-text italic">Surat.</span> <br />
            Worn Across <span className="gold-gradient-text italic">India.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            "Wear Your Signature — Scent. Style. Statement."
          </p>

          {/* Quick Pillars Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-gold font-semibold tracking-wide">
              ✨ Premium • Long Lasting • Unisex
            </span>
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium tracking-wide">
              👑 Inspired by Luxury
            </span>
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium tracking-wide">
              📍 Surat, Gujarat
            </span>
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium tracking-wide">
              📦 Pan India Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              OUR HERITAGE & PHILOSOPHY
            </div>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              Democratizing High-End Haute Parfumerie
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              At <strong className="text-gold font-medium">SNY Perfumes</strong>, we believe that an extraordinary fragrance should not be an inaccessible luxury. Founded in the historic trading hub of <strong>Surat, Gujarat</strong>, our maison was born from a singular obsession: creating beast-mode longevity and room-commanding sillage using Grade-A French fragrance oils.
            </p>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              Every formula in our atelier is blended at high oil concentrations (25% to 35% Extrait De Parfum). We eliminate exorbitant retail markups, designer licensing premiums, and wasteful packaging—investing 100% of our focus into pure olfactory essence that evolves on your skin for 12+ hours.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/sny_perfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @sny_perfumes on Instagram</span>
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-gold/40 shadow-gold-glow group">
            <Image
              src="/branding/hero-model.jpg"
              alt="SNY Perfumes Craftsmanship in Surat"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-zinc border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                SNY PERFUMES ATELIER
              </div>
              <div className="text-lg font-serif font-bold text-white mt-1">
                Surat, Gujarat • India
              </div>
              <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span>Pan India Insured Courier via Shiprocket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="py-16 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              The Four Pillars of <span className="gold-gradient-text italic">SNY</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Why thousands of fragrance connoisseurs choose our formulations daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 hover:border-gold/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-white">
                Grade-A French Oils
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Directly sourced fragrance oils manufactured under strict IFRA safety guidelines, ensuring pure projection without synthetic harshness.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 hover:border-gold/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-white">
                12+ Hours Certified Longevity
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Concentrations up to 35% Extrait De Parfum anchor deep into fabric and skin, giving you all-day beast-mode sillage.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 hover:border-gold/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-white">
                Rooted in Surat, Gujarat
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Handcrafted, hand-bottled, and quality-inspected at our Surat atelier before every single package is dispatched.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 hover:border-gold/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-white">
                Pan India Fast Delivery
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Automated express logistics with Shiprocket covering 29,000+ PIN codes with live SMS/WhatsApp tracking and insured transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Instagram & CTA Banner */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-gold/50 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold mx-auto">
            <Instagram className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Join Our Scent Community
          </h3>

          <p className="text-sm text-zinc-300 font-light max-w-lg mx-auto">
            Discover real customer unboxings, sillage tests, upcoming seasonal releases, and behind-the-scenes fragrance bottling in Surat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://www.instagram.com/sny_perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @sny_perfumes</span>
            </a>

            <Link
              href="/#scents"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-gold/60 text-white font-medium text-xs tracking-wider uppercase transition-all"
            >
              Explore All Fragrances
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
