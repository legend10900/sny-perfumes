"use client";

import React, { useState } from "react";
import { SPECIAL_BUNDLES } from "@/data/products";
import { Check, Sparkles, ShoppingBag, Gift, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function BundlesSection() {
  const { addItem } = useCartStore();
  const [selectedDuoSize, setSelectedDuoSize] = useState<"30ml" | "50ml">("30ml");

  const handleAddBundle = (bundle: (typeof SPECIAL_BUNDLES)[0]) => {
    let finalPrice = bundle.price;
    let finalOriginalPrice = bundle.originalPrice;
    let bundleTitle = bundle.title;
    let bundleSize: "Bundle" | "Discovery Set" = "Bundle";

    if (bundle.id.startsWith("duo-pack")) {
      finalPrice = selectedDuoSize === "30ml" ? 600 : 800;
      finalOriginalPrice = selectedDuoSize === "30ml" ? 998 : 1398;
      bundleTitle = `Signature Duo Pack (2x ${selectedDuoSize})`;
    } else if (bundle.id === "discovery-set") {
      bundleSize = "Discovery Set";
    }

    addItem({
      id: `${bundle.id}-${selectedDuoSize}`,
      productId: bundle.id,
      name: bundleTitle,
      size: bundleSize,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      image:
        bundle.id === "discovery-set"
          ? "/branding/titan-aura.jpg"
          : "/branding/midnight-oud.jpg",
      accentColor: "#D4AF37",
    });
  };

  return (
    <section id="bundles" className="py-24 bg-zinc-950 border-b border-zinc-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Gift className="w-3.5 h-3.5 text-gold" />
            <span>VALUE BUNDLES & VAULTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Curate Your <span className="gold-gradient-text italic">Signature Set.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            Unlock exclusive tier savings when pairing your day and night fragrances or testing our complete atelier collection.
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Single Flacon 30ml / 50ml */}
          <div className="rounded-3xl bg-black border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
            <div>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                ENTRY SIGNATURE
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-4">
                Single Flacon
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-light">
                Perfect to discover your holy-grail signature scent. Available in 30ml and 50ml flacons.
              </p>

              <div className="my-6 pt-6 border-t border-zinc-900 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">₹349</span>
                <span className="text-sm text-zinc-500 line-through">₹499</span>
                <span className="text-xs text-amber-500 font-medium ml-auto">Save ₹150</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>30ml (₹349) or 50ml (₹499) Flacon</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>French Oil Formulation (35% Extrait)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>450+ Beast-mode Luxury Sprays</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Travel & Pocket Friendly Flacon</span>
                </li>
              </ul>
            </div>

            <a
              href="#scents"
              className="mt-8 w-full py-3.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs tracking-wider uppercase text-center block transition-all"
            >
              Choose Fragrance
            </a>
          </div>

          {/* Card 2: Duo Pack (Featured Luxury Highlight) */}
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-black border-2 border-gold/70 p-8 flex flex-col justify-between relative shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 scale-105 z-10">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gold-gradient-bg text-black text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>MOST POPULAR DUO</span>
            </div>

            <div>
              <div className="flex items-center justify-between mt-2">
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[11px] font-semibold text-gold uppercase tracking-wider">
                  DAY + NIGHT PAIRING
                </span>
                <span className="text-xs text-amber-400 font-semibold">Save Up To 43%</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mt-4">
                Signature Duo Pack
              </h3>
              <p className="text-xs text-zinc-300 mt-2 font-light">
                Combine two fragrances (e.g. Titan Aura for morning confidence + Midnight Oud for evening magnetic charm).
              </p>

              {/* Duo Size Toggle */}
              <div className="mt-4 p-1 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDuoSize("30ml")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDuoSize === "30ml"
                      ? "bg-gold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  2x 30ml (₹600)
                </button>
                <button
                  onClick={() => setSelectedDuoSize("50ml")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDuoSize === "50ml"
                      ? "bg-gold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  2x 50ml (₹800)
                </button>
              </div>

              <div className="my-6 pt-4 border-t border-zinc-800 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">
                  ₹{selectedDuoSize === "30ml" ? 600 : 800}
                </span>
                <span className="text-sm text-zinc-500 line-through">
                  ₹{selectedDuoSize === "30ml" ? 998 : 1398}
                </span>
                <span className="text-xs text-gold font-semibold ml-auto flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Free Express Shipping</span>
                </span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Two Full Perfumes (2x {selectedDuoSize})</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Eligible for Free Delivery</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Luxury Gold Gift Presentation Box</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Complimentary Scent Layering Guide</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleAddBundle(SPECIAL_BUNDLES.find((b) => b.id === "duo-pack-30ml")!)}
              className="mt-8 w-full py-4 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Duo ({selectedDuoSize}) to Cart</span>
            </button>
          </div>

          {/* Card 3: Discovery Set (4x 8ml) */}
          <div className="rounded-3xl bg-black border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
            <div>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                RISK-FREE TRIAL
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-4">
                Discovery Set (4x 8ml)
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-light">
                Experience 4 iconic masterworks before committing to full bottles. Includes Titan Aura, Midnight Oud, Aqua Tide & Asphalt.
              </p>

              <div className="my-6 pt-6 border-t border-zinc-900 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">₹399</span>
                <span className="text-sm text-zinc-500 line-through">₹699</span>
                <span className="text-xs text-amber-500 font-medium ml-auto">Save ₹300</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>4x 8ml Travel Spray Vials (32ml total)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Includes ₹200 Cashback Voucher</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Test on Skin Before Buying Big</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Pocket-Sized Atomizers for Gym & Travel</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleAddBundle(SPECIAL_BUNDLES.find((b) => b.id === "discovery-set")!)}
              className="mt-8 w-full py-3.5 px-6 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-zinc-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Discovery Set (₹399)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
