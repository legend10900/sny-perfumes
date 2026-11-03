"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SPECIAL_BUNDLES } from "@/data/products";
import { Check, Sparkles, ShoppingBag, Gift, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function BundlesSection() {
  const { addItem } = useCartStore();
  const [selectedDuoSize, setSelectedDuoSize] = useState<"30ml" | "50ml">("30ml");

  const handleAddSpecialOffer = (tier: "2x30ml" | "2x50ml" | "100ml") => {
    if (tier === "2x30ml") {
      addItem({
        id: "offer-2x30ml-free8ml",
        productId: "offer-2x30ml",
        name: "Special Offer: 2x 30ml + 1x 8ml FREE",
        size: "Bundle",
        price: 599,
        originalPrice: 1098,
        image: "/branding/special-offers-banner.jpg",
        accentColor: "#D4AF37",
      });
    } else if (tier === "2x50ml") {
      addItem({
        id: "offer-2x50ml-free2x8ml",
        productId: "offer-2x50ml",
        name: "Special Offer: 2x 50ml + 2x 8ml FREE",
        size: "Bundle",
        price: 799,
        originalPrice: 1598,
        image: "/branding/special-offers-banner.jpg",
        accentColor: "#D4AF37",
      });
    } else {
      addItem({
        id: "offer-100ml-discovery",
        productId: "offer-100ml-discovery",
        name: "Special Offer: 1x 100ml + Discovery Set FREE",
        size: "Bundle",
        price: 999,
        originalPrice: 1898,
        image: "/branding/special-offers-banner.jpg",
        accentColor: "#D4AF37",
      });
    }
  };

  const handleAddBundle = (bundleId: string) => {
    const bundle = SPECIAL_BUNDLES.find((b) => b.id === bundleId);
    if (!bundle) return;

    addItem({
      id: `${bundle.id}`,
      productId: bundle.id,
      name: bundle.title,
      size: bundle.id === "discovery-set" ? "Discovery Set" : "Bundle",
      price: bundle.price,
      originalPrice: bundle.originalPrice,
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
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Gift className="w-3.5 h-3.5 text-gold" />
            <span>VALUE BUNDLES & SPECIAL OFFERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Curate Your <span className="gold-gradient-text italic">Signature Set.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            Unlock exclusive tier savings when pairing your day and night fragrances or testing our complete atelier collection.
          </p>
        </div>

        {/* FEATURED: Official Special Offers Graphic Banner Card */}
        <div className="mb-16 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-gold/50 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Graphic Poster */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-gold/40 shadow-gold-glow group">
                <Image
                  src="/branding/special-offers-banner.jpg"
                  alt="SNY Perfumes Official Special Offers Banner"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold/50 text-[10px] uppercase tracking-widest text-gold font-semibold">
                    OFFICIAL ATELIER PROMOTION
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 3 Tier Interactive Direct Select */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>LIMITED PERIOD PROMOTION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Buy More, Receive Free Luxury Gifts
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-light">
                  Direct from the SNY Parfumerie: Each special offer includes free travel spray atomizers or complete discovery collections.
                </p>
              </div>

              {/* 3 Offer Action Cards */}
              <div className="space-y-3">
                {/* Offer 1 */}
                <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 hover:border-gold/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">TIER 1</span>
                      <span className="text-xs text-zinc-400">• Buy 2x 30ml Perfumes</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Get 1x 8ml Travel Flacon FREE
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Certified Extrait Oils • 900+ Beast-mode Sprays
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-serif font-bold text-white">₹599</div>
                      <div className="text-[10px] text-zinc-500 line-through">₹1,098</div>
                    </div>
                    <button
                      onClick={() => handleAddSpecialOffer("2x30ml")}
                      className="px-4 py-2 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add ₹599</span>
                    </button>
                  </div>
                </div>

                {/* Offer 2 */}
                <div className="p-4 rounded-2xl bg-black/70 border-2 border-gold/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative shadow-gold-glow">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">TIER 2 (POPULAR)</span>
                      <span className="text-xs text-zinc-400">• Buy 2x 50ml Perfumes</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Get 2x 8ml Travel Flacons FREE
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Maximum Value • 1,500+ Luxury Sprays • Free Delivery
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-serif font-bold text-white">₹799</div>
                      <div className="text-[10px] text-zinc-500 line-through">₹1,598</div>
                    </div>
                    <button
                      onClick={() => handleAddSpecialOffer("2x50ml")}
                      className="px-4 py-2 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add ₹799</span>
                    </button>
                  </div>
                </div>

                {/* Offer 3 */}
                <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 hover:border-gold/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">TIER 3 (PRESTIGE)</span>
                      <span className="text-xs text-zinc-400">• Buy 1x 100ml Perfume</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Get Complete Discovery Set (4x 8ml) FREE
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Rush 7 or Blue Aura • Includes Full Discovery Box (₹399 Value)
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-serif font-bold text-white">₹999</div>
                      <div className="text-[10px] text-zinc-500 line-through">₹1,898</div>
                    </div>
                    <button
                      onClick={() => handleAddSpecialOffer("100ml")}
                      className="px-4 py-2 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add ₹999</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Bundles Grid */}
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
              <span>SPECIAL OFFER TIER</span>
            </div>

            <div>
              <div className="flex items-center justify-between mt-2">
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[11px] font-semibold text-gold uppercase tracking-wider">
                  DAY + NIGHT PAIRING
                </span>
                <span className="text-xs text-amber-400 font-semibold">Save Up To 50%</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mt-4">
                Signature Duo Pack
              </h3>
              <p className="text-xs text-zinc-300 mt-2 font-light">
                Combine two fragrances (e.g. Titan Aura for morning freshness + Midnight Oud for evening magnetic charm) with free 8ml travel gifts!
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
                  2x 30ml (₹599 + Free 8ml)
                </button>
                <button
                  onClick={() => setSelectedDuoSize("50ml")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDuoSize === "50ml"
                      ? "bg-gold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  2x 50ml (₹799 + 2 Free 8ml)
                </button>
              </div>

              <div className="my-6 pt-4 border-t border-zinc-800 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-white">
                  ₹{selectedDuoSize === "30ml" ? 599 : 799}
                </span>
                <span className="text-sm text-zinc-500 line-through">
                  ₹{selectedDuoSize === "30ml" ? 1098 : 1598}
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
                  <span>
                    {selectedDuoSize === "30ml" ? "1x 8ml Travel Flacon FREE" : "2x 8ml Travel Flacons FREE"}
                  </span>
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
              onClick={() => handleAddSpecialOffer(selectedDuoSize === "30ml" ? "2x30ml" : "2x50ml")}
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
              onClick={() => handleAddBundle("discovery-set")}
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
