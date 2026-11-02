"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  AlertCircle,
  Package,
  Sparkles,
} from "lucide-react";
import { OrderRecord, TrackingStep } from "@/lib/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (searchStr: string) => {
    if (!searchStr.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setOrder(data.order);
        setSteps(data.steps || []);
      } else {
        setOrder(null);
        setSteps([]);
        setError(data.error || "No order found matching your inquiry.");
      }
    } catch (err: any) {
      console.error("Tracking lookup error:", err);
      setError("Failed to reach logistics network. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    } else {
      // Auto-load demo order so user can immediately view timeline
      fetchTracking("SNY-2026-9842");
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>REAL-TIME SILLAGE DISPATCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Track Your <span className="gold-gradient-text italic">Order.</span>
          </h1>
          <p className="text-sm text-zinc-400 font-light">
            Enter your SNY Order Reference or 10-digit mobile number to monitor your package from the atelier to your doorstep.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SNY-2026-9842 or 9876543210"
              className="w-full px-6 py-4 pr-32 rounded-full bg-zinc-950 border border-zinc-800 focus:border-gold focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-500 shadow-2xl transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-5 py-2.5 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Pill */}
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-zinc-500">
            <span>Try demo active order:</span>
            <button
              type="button"
              onClick={() => {
                setQuery("SNY-2026-9842");
                fetchTracking("SNY-2026-9842");
              }}
              className="text-gold underline hover:text-white transition-colors font-mono"
            >
              SNY-2026-9842
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs max-w-md mx-auto flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details Results */}
        {order && (
          <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-10 animate-in fade-in duration-500">
            {/* Top Shipment Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Shipment Identification
                </span>
                <div className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <span>{order.orderNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/40 text-[10px] text-gold font-mono font-medium uppercase">
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </div>
              </div>

              {/* Direct Shiprocket Live Tracking Button */}
              {order.shiprocketTrackingUrl && (
                <a
                  href={order.shiprocketTrackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-gold/60 text-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-center"
                >
                  <span>Open Shiprocket Tracking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Real-time Status Steps Timeline */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Live Logistics Progression</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? "bg-gold text-black shadow-gold-glow"
                          : step.current
                          ? "bg-zinc-900 border-2 border-gold text-gold animate-pulse"
                          : "bg-zinc-900 border border-zinc-700 text-zinc-600"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-black text-gold" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-semibold tracking-wide ${
                            step.completed || step.current ? "text-white" : "text-zinc-500"
                          }`}
                        >
                          {step.label}
                        </h4>
                        {step.timestamp && (
                          <span className="text-[11px] font-mono text-zinc-400">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier & Delivery Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800 text-xs">
              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Courier Partner</div>
                <div className="font-semibold text-white">Blue Dart / Delhivery (Shiprocket)</div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  AWB: {order.shiprocketShipmentId || "SR_AIR_8829"}
                </div>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Destination</div>
                <div className="font-semibold text-white truncate">{order.customer.fullName}</div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                </div>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Estimated Delivery</div>
                <div className="font-semibold text-gold font-mono">
                  {order.estimatedDelivery || "Expected in 48h"}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Payment: {order.paymentMethod === "cod" ? "Cash On Delivery" : "Prepaid"}
                </div>
              </div>
            </div>

            {/* Items Included */}
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                Fragrance Items in Parcel
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/60">
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{item.size} • Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-gold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-gold">
          Loading tracking system...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
