"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Package,
  QrCode,
  ArrowLeft,
  Sparkles,
  Banknote,
} from "lucide-react";
import { OrderRecord, TrackingStep } from "@/lib/types";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/track?q=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
          setSteps(data.steps || []);
        } else {
          setError(data.error || "Order not found");
        }
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setError("Failed to load order details");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-gold">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest">Retrieving Atelier Order...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">Order Record Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          {error || "Could not retrieve the specified order reference."}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Collection</span>
          </Link>

          <Link
            href="/track-order"
            className="text-xs text-zinc-400 hover:text-gold transition-colors flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>Track Another Parcel</span>
          </Link>
        </div>

        {/* Order Status Header Card */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Order Reference
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {order.id}
              </h1>
            </div>

            {/* Direct Shiprocket Button */}
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all self-start sm:self-center"
              >
                <span>Live Shiprocket Tracking</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Payment & UTR Meta Banner */}
          {order.status === "CANCELLED" && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-white">Order Cancelled</div>
                <div className="text-zinc-400 mt-0.5">
                  {order.cancel_reason || "This order was cancelled by Atelier Operations."}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Payment Method */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Payment Mode
              </span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                {order.payment_method === "DIRECT_UPI" ? (
                  <>
                    <QrCode className="w-4 h-4 text-gold" />
                    <span>Direct UPI (0% Fee)</span>
                  </>
                ) : order.payment_method === "CARD" ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Credit / Debit Card</span>
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Delivery</span>
                  </>
                )}
              </div>
              <div className="text-[11px] font-mono text-gold font-bold">
                Total: ₹{order.total_amount}
              </div>
            </div>

            {/* UTR Status */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                UTR / Verification Status
              </span>
              <div className="font-mono text-xs font-semibold text-white truncate">
                {order.utr_number ? (
                  <span className="text-emerald-400">UTR: {order.utr_number}</span>
                ) : order.payment_method === "COD" ? (
                  <span className="text-zinc-300">Pay at Doorstep</span>
                ) : (
                  <span className="text-amber-400">UTR Pending Submission</span>
                )}
              </div>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  order.status === "DISPATCHED" || order.status === "DELIVERED"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-950 text-amber-300 border border-amber-500/30"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* Courier & AWB Code */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Courier Partner
              </span>
              <div className="font-semibold text-white">
                {order.courier_name || "Shiprocket Express"}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 truncate">
                AWB: {order.awb_code || "Pending Dispatch"}
              </div>
            </div>
          </div>

          {/* Real-time Logistics Timeline */}
          <div className="pt-6 border-t border-zinc-800 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Shipment Progression</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
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

          {/* Destination Details */}
          <div className="pt-6 border-t border-zinc-800 space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              Delivery Destination
            </span>
            <div className="text-sm font-semibold text-white">{order.customer_name}</div>
            <div className="text-zinc-400 leading-relaxed">
              {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Contact: {order.customer_phone} • {order.customer_email}
            </div>
          </div>

          {/* Items Summary */}
          {order.items && order.items.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Fragrance Formulation Items
              </span>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{item.product_name}</div>
                      <div className="text-[11px] text-zinc-400">Qty: {item.quantity}</div>
                    </div>
                    <span className="font-mono font-semibold text-gold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
