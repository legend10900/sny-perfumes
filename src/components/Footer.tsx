import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, Clock, Mail, Phone, MapPin, Instagram, QrCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs">
      {/* Upper Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-12 w-44 overflow-hidden">
              <Image
                src="/branding/sny-logo.jpg"
                alt="SNY Perfumes"
                fill
                className="object-contain object-left"
                sizes="180px"
              />
            </div>
            <p className="text-sm font-serif italic text-gold">
              "Wear Your Signature — Scent. Style. Statement."
            </p>
            <div className="space-y-1 text-xs text-zinc-300 font-medium">
              <div className="text-gold">✨ Premium • Long Lasting • Unisex</div>
              <div>👑 Inspired by Luxury</div>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-light">
              Crafted in <strong>Surat, Gujarat</strong> using authentic French perfume oils at high concentrations (25% - 35% Extrait De Parfum). Beast-mode longevity and room-commanding sillage delivered across India.
            </p>

            {/* Instagram Link Badge */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/sny_perfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-gold/40 text-gold text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>Www.instagram.com/sny_perfumes</span>
              </a>
            </div>
          </div>

          {/* Column 2: The Collection */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              The Collection
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#scents" className="hover:text-gold transition-colors">
                  Titan Aura (Creed Aventus)
                </Link>
              </li>
              <li>
                <Link href="/#scents" className="hover:text-gold transition-colors">
                  Midnight Oud (Lamsa Harir)
                </Link>
              </li>
              <li>
                <Link href="/#scents" className="hover:text-gold transition-colors">
                  Aqua Tide (Cool Water)
                </Link>
              </li>
              <li>
                <Link href="/#scents" className="hover:text-gold transition-colors">
                  Asphalt (Harley Davidson)
                </Link>
              </li>
              <li>
                <Link href="/#scents" className="hover:text-gold transition-colors">
                  Rush 7 (Fresh Spicy Citrus)
                </Link>
              </li>
              <li>
                <Link href="/#bundles" className="hover:text-gold transition-colors text-gold">
                  Special Bundles & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Company */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Customer Care
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/customer-care" className="hover:text-gold transition-colors text-zinc-300 font-medium">
                  Customer Care & Concierge
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors flex items-center gap-1.5 text-gold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>📍 Surat, Gujarat</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span>📦 Pan India Delivery</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Policies & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/policy#shipping" className="hover:text-gold transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policy#returns" className="hover:text-gold transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/policy#privacy" className="hover:text-gold transition-colors">
                  Customer Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  Atelier Dispatch Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Atelier & Dispatch: Surat, Gujarat, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold flex-shrink-0" />
            <span>concierge@snyperfumes.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-gold flex-shrink-0" />
            <a href="https://www.instagram.com/sny_perfumes" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              @sny_perfumes
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 bg-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} SNY PERFUMES. All rights reserved. Surat, Gujarat, India.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>Premium • Long Lasting • Unisex</span>
            <span>•</span>
            <span>📍 Surat, Gujarat</span>
            <span>•</span>
            <span>📦 Pan India Delivery</span>
            <span>•</span>
            <span>0% Fee Direct UPI & COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
