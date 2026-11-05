"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Smartphone,
  QrCode,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { OrderRecord } from "@/lib/types";

interface DirectUPIPaymentProps {
  order: OrderRecord;
  onSuccess?: () => void;
}

export default function DirectUPIPayment({ order, onSuccess }: DirectUPIPaymentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  // Dynamic state loaded from Vercel environment variables via /api/config/payment
  const [upiConfig, setUpiConfig] = useState({
    upiId: process.env.NEXT_PUBLIC_UPI_ID || "snyperfumes@okhdfcbank",
    businessName: "SNY Perfumes",
  });

  useEffect(() => {
    fetch("/api/config/payment")
      .then((res) => res.json())
      .then((data) => {
        if (data?.upiId) {
          setUpiConfig({
            upiId: data.upiId,
            businessName: data.businessName || "SNY Perfumes",
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic UPI config, falling back to build-time env:", err);
      });
  }, []);

  const upiId = upiConfig.upiId;
  const businessName = upiConfig.businessName;
  const amount = order.total_amount;
  const orderRef = order.id;

  const encodedUpiId = encodeURIComponent(upiId);
  const encodedName = encodeURIComponent(businessName);
  const encodedNote = encodeURIComponent(`SNY_Order_${orderRef}`);

  // Standard NPCI generic URI
  const genericUpiUrl = `upi://pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;

  // App-specific direct intent URIs
  const upiAppIntents = [
    {
      name: "Google Pay",
      tagline: "Pay with GPay",
      iconBg: "bg-white text-zinc-900 border-zinc-200",
      accent: "#4285F4",
      intentUrl: `gpay://upi/pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`,
      fallbackUrl: genericUpiUrl,
      badge: "Fastest",
    },
    {
      name: "PhonePe",
      tagline: "Pay with PhonePe",
      iconBg: "bg-[#5f259f] text-white border-[#5f259f]",
      accent: "#5f259f",
      intentUrl: `phonepe://pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`,
      fallbackUrl: genericUpiUrl,
      badge: "Popular",
    },
    {
      name: "Paytm",
      tagline: "Pay with Paytm UPI",
      iconBg: "bg-[#002e6e] text-[#00b9f5] border-[#00b9f5]/40",
      accent: "#00b9f5",
      intentUrl: `paytmmp://pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`,
      fallbackUrl: genericUpiUrl,
      badge: "Instant",
    },
    {
      name: "CRED",
      tagline: "Pay with CRED UPI",
      iconBg: "bg-black text-white border-zinc-700",
      accent: "#f59e0b",
      intentUrl: `credpay://upi/pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`,
      fallbackUrl: genericUpiUrl,
      badge: "Rewards",
    },
    {
      name: "BHIM UPI",
      tagline: "Pay with BHIM",
      iconBg: "bg-[#007b48] text-white border-[#007b48]",
      accent: "#007b48",
      intentUrl: `bhim://upi/pay?pa=${encodedUpiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`,
      fallbackUrl: genericUpiUrl,
      badge: "Govt / NPCI",
    },
    {
      name: "Any Installed UPI App",
      tagline: "Choose from All Apps",
      iconBg: "bg-gradient-to-r from-amber-500 to-amber-700 text-black border-amber-400",
      accent: "#D4AF37",
      intentUrl: genericUpiUrl,
      fallbackUrl: genericUpiUrl,
      badge: "Auto-Detect",
    },
  ];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmUTR = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = utrNumber.trim();
    if (!clean || clean.length < 12 || !/^\d{12}$/.test(clean)) {
      setError("Please enter a valid 12-digit numeric UPI Reference / UTR Number from your receipt.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/confirm-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          utrNumber: clean,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onSuccess) onSuccess();
        router.push(`/account/orders/${order.id}`);
      } else {
        throw new Error(data.error || "Failed to confirm UTR. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please verify your UTR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-zinc-950 border border-gold/40 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100 max-w-xl mx-auto">
      {/* Top Header */}
      <div className="text-center space-y-2 pb-4 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Free Direct UPI • 0% Gateway Charges</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Choose Your UPI App to Pay
        </h3>
        <p className="text-xs text-zinc-400">
          Order Total: <strong className="text-gold font-mono text-base font-semibold">₹{amount}</strong> • Order ID: <span className="font-mono text-zinc-300">{order.id}</span>
        </p>
      </div>

      {/* Installed UPI Apps Grid for Mobile & Desktop Direct Deep-Linking */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Smartphone className="w-4 h-4 text-gold" />
            <span>Tap Your Installed App:</span>
          </span>
          <span className="text-[11px] text-zinc-500">Direct NPCI Deep-Link</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {upiAppIntents.map((app) => (
            <a
              key={app.name}
              href={app.intentUrl}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-gold/60 hover:bg-zinc-850 active:scale-98 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border ${app.iconBg}`}
                >
                  {app.name.charAt(0)}
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-semibold text-white group-hover:text-gold transition-colors truncate">
                    {app.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {app.tagline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  {app.badge}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-gold transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* QR Code Container (Desktop / Scan from another phone) */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
            <QrCode className="w-4 h-4 text-gold" />
            <span>Or Scan via Any Banking / UPI App</span>
          </span>
          <p className="text-[11px] text-zinc-400">
            Open GPay, PhonePe, Paytm, or your banking app and scan this dynamic QR
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <QRCodeSVG
            value={genericUpiUrl}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* UPI ID Copy Row */}
        <div className="w-full max-w-xs flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800 text-xs">
          <div className="flex flex-col truncate pr-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Merchant VPA ID</span>
            <span className="font-mono font-medium text-gold truncate">{upiId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white flex items-center gap-1.5 text-[11px] font-medium transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: 12-Digit UTR Input Form */}
      <form onSubmit={handleConfirmUTR} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Step 2: Enter 12-Digit UPI Ref / UTR Number</span>
              <span className="text-gold">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="text-[11px] text-gold hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Where to find UTR?</span>
            </button>
          </div>

          <input
            type="text"
            required
            maxLength={12}
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 419283719028 (12 numeric digits)"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 font-mono tracking-wider transition-colors"
          />
          <p className="text-[11px] text-zinc-500">
            Found on your GPay/PhonePe payment receipt as &quot;UPI Ref No.&quot; or &quot;UTR&quot;.
          </p>
        </div>

        {/* UTR helper collapsible */}
        {showHelper && (
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-[11px] text-zinc-300 space-y-1.5 animate-in fade-in">
            <p className="font-semibold text-gold">How to locate your 12-digit UTR:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong>Google Pay:</strong> Tap the transaction → look for &quot;UPI transaction ID&quot; (12 digits).</li>
              <li><strong>PhonePe:</strong> Open history → tap payment → find &quot;UTR&quot; under Transfer Details.</li>
              <li><strong>Paytm:</strong> Open Passbook / Order History → copy &quot;UPI Ref No.&quot;</li>
            </ul>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit UTR Button */}
        <button
          type="submit"
          disabled={loading || utrNumber.length < 12}
          className="w-full py-4 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying UTR...</span>
            </div>
          ) : (
            <>
              <span>Confirm Payment & Unlock Express Shipping</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Safety Note */}
      <div className="text-center text-[11px] text-zinc-500 border-t border-zinc-900 pt-3">
        Once submitted, your order status updates to <strong className="text-zinc-300">PENDING_VERIFICATION</strong>. The atelier confirms and dispatches via Shiprocket within 24 hours.
      </div>
    </div>
  );
}
