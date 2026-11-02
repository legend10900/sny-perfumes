"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";
import { Sparkles, Filter, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Fragrances" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "ouds", label: "Rich Oud & Amber" },
  { id: "fresh", label: "Aquatic & Citrus" },
  { id: "men", label: "Men's Power" },
  { id: "unisex", label: "Unisex Signatures" },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "bestsellers") {
      return product.badges.includes("Best Seller") || product.badges.includes("Signature Scent");
    }
    if (activeCategory === "ouds") {
      return (
        product.notes.heart.some((n) => n.toLowerCase().includes("oud")) ||
        product.notes.base.some((n) => n.toLowerCase().includes("oud") || n.toLowerCase().includes("amber"))
      );
    }
    if (activeCategory === "fresh") {
      return (
        product.notes.top.some(
          (n) =>
            n.toLowerCase().includes("marine") ||
            n.toLowerCase().includes("lemon") ||
            n.toLowerCase().includes("bergamot") ||
            n.toLowerCase().includes("citrus")
        )
      );
    }
    if (activeCategory === "men") {
      return product.gender === "Men";
    }
    if (activeCategory === "unisex") {
      return product.gender === "Unisex";
    }
    return true;
  });

  return (
    <section id="scents" className="py-24 bg-black border-b border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/80 border border-gold/30 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>THE ATELIER COLLECTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Curated For The <span className="gold-gradient-text italic">Extraordinary.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            Formulated with 25-35% pure French perfume oil concentration. No fillers. Just lingering, beast-mode projection that commands attention.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? "gold-gradient-bg text-black font-semibold shadow-gold-glow scale-105"
                  : "bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Brand Reassurance Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-wide">Express Insured Delivery</h4>
            <p className="text-xs text-zinc-400 font-light max-w-xs">
              Shipped within 24 hours via Shiprocket express air network with real-time live GPS tracking.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 border-y md:border-y-0 md:border-x border-zinc-900 py-4 md:py-0">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-wide">100% Authentic French Oil</h4>
            <p className="text-xs text-zinc-400 font-light max-w-xs">
              Directly sourced from Grasse, France. Tested for 12+ hours skin and garment endurance.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-wide">Secure Checkout & COD</h4>
            <p className="text-xs text-zinc-400 font-light max-w-xs">
              Razorpay 256-bit encrypted UPI/Card payments and Cash On Delivery available across India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
