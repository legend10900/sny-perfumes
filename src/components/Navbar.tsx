"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Truck, Sparkles, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDrawer, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-gold/20 py-1.5 px-4 text-center text-xs tracking-wider text-zinc-300">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span>FRENCH PERFUME OILS • 12+ HOURS LONGEVITY • FREE EXPRESS DELIVERY OVER ₹600</span>
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
        </span>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3"
            : "bg-black/70 backdrop-blur-sm border-b border-zinc-900 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-gold transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center group py-0.5">
            <div className="relative h-9 md:h-11 w-32 md:w-36 overflow-hidden">
              <Image
                src="/branding/sny-logo.jpg"
                alt="SNY Perfumes"
                fill
                priority
                className="object-contain object-left group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 130px, 150px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-zinc-300">
            <Link
              href="/#scents"
              className="hover:text-gold transition-colors duration-200 relative group py-1"
            >
              All Scents
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#bestsellers"
              className="hover:text-gold transition-colors duration-200 relative group py-1"
            >
              Best Sellers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#bundles"
              className="hover:text-gold transition-colors duration-200 relative group py-1"
            >
              Discovery Sets
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/track-order"
              className={`flex items-center gap-1.5 hover:text-gold transition-colors duration-200 py-1 ${
                pathname === "/track-order" ? "text-gold font-semibold" : ""
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-gold" />
              <span>Track Order</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="hidden sm:flex md:hidden items-center gap-1.5 text-xs text-zinc-400 hover:text-gold p-2"
              title="Track Order"
            >
              <Truck className="w-5 h-5 text-gold" />
            </Link>

            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-full bg-zinc-900/90 border border-zinc-800 hover:border-gold/60 text-zinc-200 hover:text-gold transition-all duration-300 shadow-lg group"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-gold text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-gold-glow animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            <Link
              href="/#scents"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest text-zinc-300 hover:text-gold py-2 border-b border-zinc-900"
            >
              All Scents
            </Link>
            <Link
              href="/#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest text-zinc-300 hover:text-gold py-2 border-b border-zinc-900"
            >
              Best Sellers
            </Link>
            <Link
              href="/#bundles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest text-zinc-300 hover:text-gold py-2 border-b border-zinc-900"
            >
              Special Bundles & Discovery
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm uppercase tracking-widest text-gold py-2"
            >
              <Truck className="w-4 h-4 text-gold" />
              <span>Track Order</span>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
