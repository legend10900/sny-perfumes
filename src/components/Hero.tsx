"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Clock, Volume2, ShieldCheck, ArrowRight, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black py-16 lg:py-24 border-b border-zinc-900">
      {/* Ambient background gold glow spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle background radial pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Compelling Typography & Brand Value Props */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-gold/40 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                HAUTE PARFUMERIE • FRENCH OIL BLEND
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Wear Your <br />
                <span className="gold-gradient-text italic font-normal">Signature.</span>
              </h1>
              <p className="text-lg sm:text-xl font-light tracking-[0.2em] uppercase text-zinc-400">
                Scent. Style. Statement.
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-300 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Crafted with authentic Grade-A French perfume oils, <strong className="text-gold font-medium">SNY Perfumes</strong> delivers unmatched sillage and high-concentration luxury at accessible pricing. Formulated to dominate every room you step into.
            </p>

            {/* Brand Value Props Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-gold/50 p-3.5 rounded-xl transition-all duration-300 text-left group">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white tracking-wide">French Oils</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">35% Extrait Oil</div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-gold/50 p-3.5 rounded-xl transition-all duration-300 text-left group">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white tracking-wide">12+ Hours</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Certified Longevity</div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-gold/50 p-3.5 rounded-xl transition-all duration-300 text-left group">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white tracking-wide">Beast Mode</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Strong Projection</div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-gold/50 p-3.5 rounded-xl transition-all duration-300 text-left group">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white tracking-wide">Luxury Unisex</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Versatile DNA</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#scents"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-gradient-bg text-black font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 transition-all duration-300"
              >
                <span>Shop Fragrances (₹349)</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#bundles"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-gold/60 text-zinc-200 hover:text-white font-medium tracking-wider text-xs uppercase transition-all duration-300 text-center"
              >
                View Special Bundles
              </a>
            </div>
          </div>

          {/* Right Column: Framed portrait showcasing brand ambassador holding Midnight Oud */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[420px] group">
              {/* Glowing ambient background lighting */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-gold/30 via-amber-500/20 to-purple-900/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulseGlow" />

              {/* Framed luxury container */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border-2 border-gold/40 shadow-2xl transition-all duration-500 group-hover:border-gold/80">
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold z-20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold z-20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold z-20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold z-20 pointer-events-none" />

                {/* Hero Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/branding/hero-model.jpg"
                    alt="SNY Brand Ambassador holding Midnight Oud"
                    fill
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                </div>

                {/* Floating Bottom Card Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-gold border border-gold/40 backdrop-blur-md z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                        ICONIC FORMULATION
                      </div>
                      <div className="text-base font-serif font-bold text-white tracking-wide mt-0.5">
                        Midnight Oud • Extrait
                      </div>
                      <div className="text-[11px] text-zinc-300 flex items-center gap-2 mt-1">
                        <span>Saffron • Oud • Amber</span>
                        <span className="text-gold">•</span>
                        <span className="text-gold font-semibold">₹349</span>
                      </div>
                    </div>

                    <a
                      href="#scents"
                      className="p-2.5 rounded-full bg-gold/20 hover:bg-gold text-gold hover:text-black transition-colors"
                      title="Explore Midnight Oud"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
