"use client";

import React, { useState } from "react";
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

  // Default UPI VPA ID (configurable in .env)
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "snyperfumes@okaxis";
  const businessName = "SNY Perfumes";
  const amount = order.total_amount;
  const orderRef = order.id;

  // Standard NPCI UPI URI Specification
  // upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={transactionNote}
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    businessName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order_${orderRef}`)}`;

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
          <span>100% Free Direct UPI • Zero Convenience Fee</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Scan or Tap to Complete Payment
        </h3>
        <p className="text-xs text-zinc-400">
          Order Total: <strong className="text-gold font-mono text-base font-semibold">₹{amount}</strong> • Order ID: <span className="font-mono text-zinc-300">{order.id}</span>
        </p>
      </div>

      {/* Mobile One-Tap Pay Button */}
      <div className="block sm:hidden space-y-3">
        <a
          href={upiUrl}
          className="w-full py-4 px-6 rounded-2xl gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow active:scale-95 transition-all text-center"
        >
          <Smartphone className="w-4 h-4" />
          <span>Pay via Any UPI App (GPay, PhonePe, Paytm)</span>
        </a>
        <div className="text-center text-[11px] text-zinc-500">
          Or scan the QR code below if using a secondary device:
        </div>
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <QRCodeSVG
            value={upiUrl}
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

      {/* Step 2: 12-digit UTR submission */}
      <form onSubmit={handleConfirmUTR} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Enter 12-digit UPI Reference / UTR Number</span>
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
            maxLength={12}
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 419283719028 (12 digits)"
            className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white font-mono tracking-widest text-center text-sm placeholder:tracking-normal placeholder:text-zinc-500 transition-colors"
          />

          {showHelper && (
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5 animate-in fade-in">
              <div className="font-semibold text-white">How to locate your 12-digit UTR / Ref No:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                <li><strong>Google Pay:</strong> View Transaction ➔ "UPI transaction ID"</li>
                <li><strong>PhonePe:</strong> View Details ➔ "UTR" number (12 digits)</li>
                <li><strong>Paytm:</strong> Order Summary ➔ "UPI Ref No"</li>
                <li><strong>CRED / Any Bank:</strong> Transaction Receipt ➔ "Ref / UTR"</li>
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || utrNumber.length < 12}
          className="w-full py-4 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying Reference...</span>
            </div>
          ) : (
            <>
              <span>Submit UTR & Confirm Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-zinc-500 text-center">
          Once submitted, your order status updates to <strong className="text-zinc-300">PENDING_VERIFICATION</strong>. The atelier confirms and dispatches via Shiprocket within 24 hours.
        </p>
      </form>
    </div>
  );
}
