import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Mail,
  MapPin,
  Instagram,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Policies | SNY Perfumes — Shipping, Returns & Privacy",
  description:
    "Official policies of SNY Perfumes. Details on Pan India shipping from Surat, Gujarat, 48-hour damage replacement guarantee, and customer privacy.",
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-12 pb-24 border-b border-zinc-900">
      {/* Header */}
      <section className="relative overflow-hidden py-16 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>TRANSPARENCY & ASSURANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Policies & <span className="gold-gradient-text italic">Guarantees</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto">
            Everything you need to know about our Pan India shipping from Surat, Gujarat, transit damage replacement guarantee, and customer data privacy.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4 text-xs">
            <a href="#shipping" className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-zinc-800 transition-colors">
              📦 Shipping & Delivery
            </a>
            <a href="#returns" className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-zinc-800 transition-colors">
              🔄 Returns & Replacements
            </a>
            <a href="#privacy" className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-gold hover:text-black border border-zinc-800 transition-colors">
              🔒 Privacy Policy
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Section 1: Shipping & Delivery Policy */}
        <section id="shipping" className="scroll-mt-24 space-y-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                1. Shipping & Delivery Policy
              </h2>
              <p className="text-xs text-zinc-400">Pan India Delivery originating from Surat, Gujarat</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">A. Dispatch & Processing Timeline</h3>
              <p>
                All orders placed on <strong>SNY Perfumes</strong> are processed, hand-bottled, and packaged with shock-absorbing foam at our central atelier in <strong>Surat, Gujarat</strong>. Orders are typically dispatched within <strong>24 to 48 business hours</strong> after payment confirmation (Direct UPI verification or COD order booking).
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">B. Transit & Delivery Schedules</h3>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li><strong>Gujarat & Western India:</strong> 2 to 3 business days.</li>
                <li><strong>Metro Cities (Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Kolkata):</strong> 3 to 4 business days.</li>
                <li><strong>Rest of India & Tier 2/3 Towns:</strong> 4 to 6 business days.</li>
                <li><strong>North-East & Remote Locations:</strong> 5 to 7 business days.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">C. Courier Partners & Live GPS Tracking</h3>
              <p>
                We partner with <strong>Shiprocket</strong>, leveraging premier courier networks (BlueDart, Delhivery, DTDC, Xpressbees, Shadowfax). Upon parcel dispatch, an automated AWB tracking number is generated and your order status updates with a direct link to live tracking. You can also track your shipment at any time via our <Link href="/track-order" className="text-gold underline hover:text-white">Track Order Page</Link>.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">D. Shipping Charges</h3>
              <p>
                <strong>FREE Express Shipping</strong> applies automatically to all orders over ₹600 and all special value bundles (e.g., Duo Packs, Discovery Boxes). For single orders below ₹600, a nominal flat courier fee of ₹49 is applied at checkout.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Returns & Replacement Policy */}
        <section id="returns" className="scroll-mt-24 space-y-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                2. Return & Replacement Policy
              </h2>
              <p className="text-xs text-zinc-400">Fragrance hygiene standards and transit damage guarantees</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">A. Hygiene & Non-Returnable Nature of Fragrances</h3>
              <p>
                In accordance with personal care and cosmetic hygiene regulations, perfume bottles once delivered, unsealed, or sprayed <strong>cannot be returned or exchanged for change of preference</strong>. We strongly recommend sampling our <Link href="/#bundles" className="text-gold underline hover:text-white">Discovery Box (4x 8ml)</Link> to test scents on skin before committing to 50ml or 100ml flacons.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">B. 100% Free Transit Damage & Leakage Replacement</h3>
              <p>
                If your bottle arrives broken, cracked, defective atomizer, or experiencing in-transit leakage, we provide an immediate <strong>100% Free Replacement</strong>.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-gold/30 space-y-2 text-xs">
                <div className="font-semibold text-gold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <span>How to Claim a Free Replacement (Within 48 Hours):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300">
                  <li>Capture a continuous unboxing video showing the outer sealed parcel and damaged flacon.</li>
                  <li>WhatsApp or email our concierge team with your Order ID and the unboxing video within 48 hours of courier delivery.</li>
                  <li>Once verified, a fresh replacement flacon is booked and dispatched within 24 hours at zero cost to you.</li>
                </ol>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">C. Order Cancellation</h3>
              <p>
                Orders can be canceled free of charge before they are handed over to the courier partner. To cancel an order, please message our support concierge with your Order ID immediately after purchase.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Privacy Policy */}
        <section id="privacy" className="scroll-mt-24 space-y-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                3. Customer Privacy Policy
              </h2>
              <p className="text-xs text-zinc-400">Zero data selling and secure Direct UPI payment privacy</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">A. Information We Collect</h3>
              <p>
                When you place an order, we collect only necessary delivery coordinates: your Full Name, Mobile Phone Number, Delivery Address, City, State, PIN Code, and Email Address. This data is exclusively utilized to generate your courier manifest via Shiprocket and send order status notifications.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">B. Direct UPI Payment Confidentiality</h3>
              <p>
                All prepaid orders are executed through direct NPCI UPI deep-links and bank QR codes. <strong>SNY Perfumes does not store, request, or handle your bank account numbers, UPI PINs, or debit/credit card CVVs.</strong> Payments happen securely on your own trusted UPI app (Google Pay, PhonePe, Paytm, or BHIM).
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-sm">C. Zero Marketing Spam Guarantee</h3>
              <p>
                We do not sell, rent, or lease your contact information to third-party telemarketers or external advertising networks. Any email or SMS sent from SNY Perfumes relates strictly to your active orders, tracking updates, or requested customer care inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Customer Care Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-gold/40 text-center space-y-4">
          <h3 className="text-xl font-serif font-bold text-white">
            Have Questions About An Order?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto">
            Our customer care concierge based in <strong>Surat, Gujarat</strong> is available daily to assist you with order tracking, fragrance recommendations, or damage claims.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Surat, Gujarat, India</span>
            </span>
            <a href="mailto:supportsny@gmail.com" className="flex items-center gap-1.5 text-zinc-300 hover:text-gold transition-colors">
              <Mail className="w-4 h-4 text-gold" />
              <span>supportsny@gmail.com</span>
            </a>
            <a
              href="https://www.instagram.com/sny_perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gold hover:underline"
            >
              <Instagram className="w-4 h-4 text-gold" />
              <span>@sny_perfumes</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
