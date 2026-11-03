"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, ArrowRight, Truck } from "lucide-react";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getTotal,
    getFreeShippingProgress,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const { remaining, progressPercent, isFree } = getFreeShippingProgress();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop blur overlay */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800/80 shadow-2xl flex flex-col text-zinc-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Your Atelier Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-900/80 p-4 border-b border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Truck className="w-3.5 h-3.5 text-gold" />
                {isFree ? (
                  <span className="text-gold font-semibold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>Add <strong className="text-white">₹{remaining}</strong> more for Free Shipping</span>
                )}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                ₹{subtotal} / ₹{FREE_SHIPPING_THRESHOLD}
              </span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="gold-gradient-bg h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Explore our French oil formulations and wear a signature scent that turns heads.
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-all"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5 hover:border-zinc-700 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-gold font-mono">
                        {item.size}
                      </span>
                      <span>₹{item.price}</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-800/80">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-gold transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-gold transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-white ml-auto">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/60 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-gold font-semibold uppercase">Free</span>
                    ) : (
                      <span className="text-white">₹{shippingFee}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span className="font-serif">Total</span>
                  <span className="font-mono text-gold">₹{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-4 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Direct UPI (0% Fee) • COD Available • 📦 Pan India Delivery from Surat</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
