"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Sparkles, Clock, ShieldCheck, Flame, ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/types";

export default function FragrancePyramidModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { selectedProductForModal, closeProductModal, addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml">("30ml");
  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);

  const product = selectedProductForModal;

  // Manage native <dialog> showModal / close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product) {
      setActiveImageIndex(0);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [product]);

  // Fallback for click outside
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        closeProductModal();
      }
    };

    const handleCloseEvent = () => {
      closeProductModal();
    };

    dialog.addEventListener("click", handleDialogClick);
    dialog.addEventListener("close", handleCloseEvent);

    return () => {
      dialog.removeEventListener("click", handleDialogClick);
      dialog.removeEventListener("close", handleCloseEvent);
    };
  }, [closeProductModal]);

  if (!product) return null;

  const currentPrice = selectedSize === "30ml" ? product.price30ml : product.price50ml;
  const currentOriginalPrice = selectedSize === "30ml" ? product.originalPrice30ml : product.originalPrice50ml;

  const currentImage =
    activeImageIndex === 1 && product.secondaryImage
      ? product.secondaryImage
      : product.image;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: `${product.name} (${product.concentration.split(" ")[0]})`,
      size: selectedSize,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: product.image,
      accentColor: product.accentColor,
    });
    closeProductModal();
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as any)}
      aria-labelledby="pyramid-modal-title"
      className="m-auto rounded-3xl bg-zinc-950 border border-zinc-800 text-zinc-100 max-w-2xl w-[94vw] p-0 shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md outline-none overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="relative p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: product.accentColor }}
          />
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            OLFACTORY ARCHITECTURE & DETAILS
          </span>
        </div>

        <button
          onClick={closeProductModal}
          className="p-2 rounded-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
        {/* Product Snapshot & Dual Media Gallery */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-32 h-44 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500"
                sizes="128px"
              />
            </div>

            {/* Thumbnail toggle if secondary image exists */}
            {product.secondaryImage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveImageIndex(0)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    activeImageIndex === 0
                      ? "bg-gold text-black font-semibold"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                  }`}
                >
                  Poster
                </button>
                <button
                  onClick={() => setActiveImageIndex(1)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    activeImageIndex === 1
                      ? "bg-gold text-black font-semibold"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                  }`}
                >
                  Macro
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Inspired by <span className="text-zinc-200 font-semibold">{product.inspiredBy}</span>
            </div>
            <h2 id="pyramid-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Fragrance Pyramid Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Three-Tier Olfactory Pyramid</span>
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">12+ Hours Evolution</span>
          </div>

          <div className="space-y-3">
            {/* Top Tier: 0 - 15 mins */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Top Notes (Head)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>First 15 Mins • Initial Spark</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2.5 font-light">
                The immediate aura when sprayed. Creates your instant first impression.
              </p>
              <div className="flex flex-wrap gap-2">
                {product.notes.top.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-colors shadow-sm"
                    style={{
                      borderColor: `${product.accentColor}55`,
                      backgroundColor: `${product.accentColor}15`,
                      color: product.accentColor,
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Heart Tier: 2 - 4 hours */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Heart Notes (Heart)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>2 to 4 Hours • Signature Identity</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2.5 font-light">
                The soul and character of the fragrance as the top notes mellow.
              </p>
              <div className="flex flex-wrap gap-2">
                {product.notes.heart.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-colors shadow-sm"
                    style={{
                      borderColor: `${product.accentColor}55`,
                      backgroundColor: `${product.accentColor}15`,
                      color: product.accentColor,
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Tier: 6+ hours */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Base Notes (Dry-down)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>6 to 14+ Hours • Magnetic Memory</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2.5 font-light">
                Heavy, rich fixatives that anchor the scent onto fabric and skin for enduring projection.
              </p>
              <div className="flex flex-wrap gap-2">
                {product.notes.base.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-colors shadow-sm"
                    style={{
                      borderColor: `${product.accentColor}55`,
                      backgroundColor: `${product.accentColor}15`,
                      color: product.accentColor,
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Sillage Stats */}
        <div className="grid grid-cols-3 gap-3 bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Longevity</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>{product.longevity}</span>
            </div>
          </div>
          <div className="border-x border-zinc-800">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Projection</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-gold" />
              <span>{product.projection}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Formulation</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span className="truncate">{product.concentration.split(" ")[0]}</span>
            </div>
          </div>
        </div>

        {/* Size Selection & Add to Cart Action */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium">Select Size:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSize("30ml")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSize === "30ml"
                    ? "bg-gold text-black shadow-gold-glow"
                    : "bg-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                30ml Flacon (₹{product.price30ml})
              </button>
              <button
                onClick={() => setSelectedSize("50ml")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSize === "50ml"
                    ? "bg-gold text-black shadow-gold-glow"
                    : "bg-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                50ml Flacon (₹{product.price50ml})
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-serif font-bold text-white">
                ₹{currentPrice}
              </div>
              <div className="text-xs text-zinc-400 line-through">
                ₹{currentOriginalPrice}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {selectedSize} to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
