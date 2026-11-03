import React from "react";
import Link from "next/link";
import { ShieldAlert, FileText, CheckCircle, MapPin, Mail, Instagram, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | SNY Perfumes",
  description:
    "Terms and Conditions governing the purchase of SNY Perfumes fragrances. Jurisdiction: Surat, Gujarat, India.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-12 pb-24 border-b border-zinc-900">
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <FileText className="w-3.5 h-3.5 text-gold" />
            <span>LEGAL TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Terms and <span className="gold-gradient-text italic">Conditions</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto">
            Please review these terms before making a purchase on SNY Perfumes. By placing an order, you agree to these conditions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
        {/* Section 1 */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            1. Overview & Acceptance
          </h2>
          <p>
            Welcome to <strong>SNY Perfumes</strong> ("we", "our", "us"). We operate the e-commerce website offering premium, long-lasting unisex fragrances. Headquartered and formulated in <strong>Surat, Gujarat, India</strong>, our products are dispatched across India through authorized logistics partners. By accessing our platform or purchasing any products, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </div>

        {/* Section 2: Inspired By Olfactory Disclaimer */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-gold/40 space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-serif font-bold text-white">
              2. Fragrance Formulations & "Inspired By" Comparative Reference
            </h2>
          </div>
          <p>
            All fragrances sold by <strong>SNY Perfumes</strong> are proprietary formulas manufactured using imported French perfume oils at high concentrations (25% to 35% Extrait De Parfum). Any reference to trademarked designer or niche names (such as Creed Aventus, Davidoff Cool Water, Azzaro Most Wanted, Harley Davidson, Swiss Arabian, Kayali, Bleu de Chanel, or Gucci Flora) is made strictly for <strong>comparative olfactory guidance</strong> to help customers understand the aroma family and profile of our original formulations.
          </p>
          <p>
            SNY Perfumes is not affiliated with, sponsored by, or associated with these trademark holders. All trademarks remain the property of their respective owners.
          </p>
        </div>

        {/* Section 3: Pricing & Payments */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            3. Pricing, Orders & Direct UPI / COD Payment Verification
          </h2>
          <p>
            All prices listed on our website are in <strong>Indian Rupees (INR)</strong> and inclusive of applicable taxes. We offer two payment methods:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Direct UPI (NPCI QR Code / Deep-Link):</strong> When paying via Direct UPI, the customer transfers the exact order amount directly to our merchant VPA. The customer must submit the authentic <strong>12-digit UPI Reference / UTR Number</strong> from their payment confirmation receipt. Submitting fraudulent, reused, or fake UTR numbers constitutes a breach of contract and will lead to automatic order cancellation and fraud reporting.
            </li>
            <li>
              <strong>Cash on Delivery (COD):</strong> For COD orders, payment must be handed over in cash to the delivery agent upon courier arrival. We reserve the right to call or message the customer to re-verify mobile and address credentials prior to dispatch.
            </li>
          </ul>
        </div>

        {/* Section 4: Shipping & Pan India Delivery */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            4. Shipping, Transit & Pan India Fulfillment
          </h2>
          <p>
            Orders are dispatched from our central facility in <strong>Surat, Gujarat</strong> via <strong>Shiprocket</strong> air/surface courier networks. While typical delivery timelines range from 2 to 6 business days, transit delays caused by extreme weather, national holidays, courier strikes, or regional disruptions are beyond our direct control. You can monitor progress on our <Link href="/track-order" className="text-gold underline hover:text-white">Track Order</Link> page.
          </p>
        </div>

        {/* Section 5: Returns & Replacements */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            5. Fragrance Hygiene, Returns & Damaged Flacon Claims
          </h2>
          <p>
            Due to cosmetic safety and personal care hygiene regulations, perfumes cannot be returned for preference mismatches or change of mind once delivered.
          </p>
          <p>
            In the event of manufacturing defect or in-transit breakage/leakage, a free replacement will be dispatched provided the customer notifies customer care within <strong>48 hours of delivery</strong> accompanied by an unedited unboxing video.
          </p>
        </div>

        {/* Section 6: Governing Law */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            6. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms and Conditions and any disputes arising out of your purchase from SNY Perfumes shall be governed by and construed in accordance with the laws of <strong>India</strong>, and the courts at <strong>Surat, Gujarat, India</strong> shall have exclusive jurisdiction.
          </p>
        </div>

        {/* Customer Care Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-gold/40 text-center space-y-4">
          <h3 className="text-lg font-serif font-bold text-white">
            Customer Care & Contact Coordinates
          </h3>
          <div className="space-y-1 text-xs text-zinc-300">
            <p className="font-semibold text-gold">SNY PERFUMES</p>
            <p>Premium • Long Lasting • Unisex | Inspired by Luxury</p>
            <p>📍 Surat, Gujarat, India</p>
            <p>📦 Pan India Delivery</p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href="https://www.instagram.com/sny_perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gold hover:underline"
            >
              <Instagram className="w-4 h-4 text-gold" />
              <span>Www.instagram.com/sny_perfumes</span>
            </a>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">concierge@snyperfumes.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
