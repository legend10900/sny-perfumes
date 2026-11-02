"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Layers, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml">("30ml");
  const { addItem, openProductModal } = useCartStore();

  const currentPrice = selectedSize === "30ml" ? product.price30ml : product.price50ml;
  const originalPrice = selectedSize === "30ml" ? product.originalPrice30ml : product.originalPrice50ml;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: `${product.name}`,
      size: selectedSize,
      price: currentPrice,
      originalPrice,
      image: product.image,
      accentColor: product.accentColor,
    });
  };

  const handleOpenPyramid = () => {
    openProductModal(product);
  };

  return (
    <div
      onClick={handleOpenPyramid}
      className="group relative rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-gold/60 transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-black"
    >
      {/* Ambient hover glow using product accent color */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ backgroundColor: product.accentColor }}
      />

      {/* Top Media Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
        <Image
          src={product.image}
          alt={`${product.name} luxury perfume bottle`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((badge, idx) => (
              <span
                key={badge}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider backdrop-blur-md border shadow-md ${
                  idx === 0
                    ? "bg-black/70 border-gold/40 text-gold"
                    : "bg-black/50 border-white/10 text-zinc-300"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Scent Pyramid Trigger Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPyramid();
            }}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-zinc-300 hover:text-gold hover:border-gold/50 transition-all shadow-md group/btn"
            title="View Olfactory Notes Pyramid"
          >
            <Layers className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>

        {/* Floating Rating Pill */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="font-semibold text-white">{product.rating}</span>
          <span className="text-zinc-400">({product.reviewCount})</span>
        </div>
      </div>

      {/* Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Inspired By */}
          <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
            Inspired by <span className="text-zinc-200 font-semibold">{product.inspiredBy}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Key Notes preview */}
          <p className="text-xs text-zinc-400 font-light flex items-center gap-1.5 flex-wrap">
            <span className="text-zinc-500">Notes:</span>
            <span>{product.notes.top.slice(0, 2).join(", ")}, {product.notes.heart[0]}</span>
          </p>
        </div>

        {/* Size Selector */}
        <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Size:</span>
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSize("30ml")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                selectedSize === "30ml"
                  ? "bg-gold text-black shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              30ml
            </button>
            <button
              onClick={() => setSelectedSize("50ml")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                selectedSize === "50ml"
                  ? "bg-gold text-black shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              50ml
            </button>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-lg font-serif font-bold text-white">
              ₹{currentPrice}
            </div>
            <div className="text-[11px] text-zinc-500 line-through">
              ₹{originalPrice}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-gold text-zinc-200 hover:text-black border border-zinc-800 hover:border-gold font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 group/cart shadow-sm"
            aria-label={`Add ${product.name} to Cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold group-hover/cart:text-black transition-colors" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
