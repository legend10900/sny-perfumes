import React from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Truck,
  Instagram,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Search,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Customer Care | SNY Perfumes — Surat, Gujarat",
  description:
    "Contact SNY Perfumes customer care concierge. Premium, long lasting, unisex fragrances inspired by luxury. 📍 Surat, Gujarat. 📦 Pan India Delivery.",
};

export default function CustomerCarePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-12 pb-24 border-b border-zinc-900">
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>CONCIERGE & SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            SNY <span className="gold-gradient-text italic">Customer Care</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Premium • Long Lasting • Unisex <br />
            <span className="text-gold font-medium">Inspired by Luxury</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>📍 Surat, Gujarat</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold" />
              <span>📦 Pan India Delivery</span>
            </span>
            <a
              href="https://www.instagram.com/sny_perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-gold/40 text-gold font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Www.instagram.com/sny_perfumes</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Instagram Official */}
          <div className="p-8 rounded-3xl bg-zinc-950 border-2 border-gold/40 hover:border-gold transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-gold-glow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Instagram Direct
              </h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Connect directly with our social team for quick questions, fragrance advice, or to share your sillage stories.
              </p>
              <div className="text-xs text-gold font-semibold">
                @sny_perfumes
              </div>
            </div>

            <a
              href="https://www.instagram.com/sny_perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase text-center block shadow-sm hover:scale-105 transition-all"
            >
              Open Instagram
            </a>
          </div>

          {/* Card 2: Track Live Shipment */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Live Order Tracking
              </h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Need to know where your perfume package is? Look up real-time courier checkpoints across all 29,000+ PIN codes.
              </p>
              <div className="text-xs text-zinc-400">
                Powered by Shiprocket Automated Logistics
              </div>
            </div>

            <Link
              href="/track-order"
              className="w-full py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs tracking-wider uppercase text-center block transition-all"
            >
              Track Your Order
            </Link>
          </div>

          {/* Card 3: Email & WhatsApp Concierge */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Email Concierge
              </h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                For bulk gifting, corporate orders, parcel inquiries, or damage replacement requests with unboxing videos.
              </p>
              <div className="space-y-1 text-xs text-zinc-300 font-mono">
                <div>supportsny@gmail.com</div>
                <div className="text-zinc-500 text-[11px]">10:00 AM – 7:00 PM IST</div>
              </div>
            </div>

            <a
              href="mailto:supportsny@gmail.com"
              className="w-full py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs tracking-wider uppercase text-center block transition-all"
            >
              Send An Email
            </a>
          </div>
        </div>

        {/* Brand Promise Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-white">Premium French Oils</div>
            <div className="text-xs text-zinc-400 font-light">35% Extrait De Parfum formulation</div>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-zinc-800 py-3 md:py-0">
            <div className="text-sm font-semibold text-white">Crafted in Surat, Gujarat</div>
            <div className="text-xs text-zinc-400 font-light">Atelier quality control on every bottle</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-white">📦 Pan India Delivery</div>
            <div className="text-xs text-zinc-400 font-light">Delivered safely to your doorstep</div>
          </div>
        </div>
      </div>
    </div>
  );
}
