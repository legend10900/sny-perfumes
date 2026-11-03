import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Truck, Clock, Mail, Phone, MapPin, QrCode } from "lucide-react";

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
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-light">
              SNY Perfumes redefines modern luxury by combining authentic French perfume oils with obsessive attention to sillage and longevity. Formulated for connoisseurs who refuse to blend in.
            </p>
            <div className="flex items-center gap-2 text-zinc-300 text-xs pt-1">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Extrait De Parfum (35% French Fragrance Oils)</span>
            </div>
          </div>

          {/* Quick Links */}
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
                <Link href="/#bundles" className="hover:text-gold transition-colors">
                  Discovery Set (4x 8ml)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Customer Care
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors flex items-center gap-1.5 text-gold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <a href="#scents" className="hover:text-gold transition-colors">
                  Olfactory Notes Guide
                </a>
              </li>
              <li>
                <span className="text-zinc-500">Shipping & Delivery (Shiprocket)</span>
              </li>
              <li>
                <span className="text-zinc-500">Authenticity Guarantee</span>
              </li>
              <li>
                <span className="text-zinc-500">Terms of Service & Privacy</span>
              </li>
            </ul>
          </div>

          {/* Contact & Atelier */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              SNY Atelier
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span>SNY Perfumes Atelier, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>concierge@snyperfumes.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>+91 98765 43210 (10 AM - 7 PM)</span>
              </div>
              <div className="pt-2 text-[11px] text-zinc-500">
                Payment: Direct UPI QR (0% Fee) • GPay • PhonePe • Paytm • Cash on Delivery (COD)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 bg-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} SNY PERFUMES. All rights reserved. Haute Parfumerie.
          </div>
          <div className="flex items-center gap-6">
            <span>French Fragrance Formulation</span>
            <span>•</span>
            <span>Automated Shiprocket Logistics</span>
            <span>•</span>
            <span>Zero-Fee Direct UPI & COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
