"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Truck, Sparkles, ArrowRight, Package, Clock, QrCode } from "lucide-react";
import { OrderRecord } from "@/lib/types";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/track?q=${encodeURIComponent(orderId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 flex items-center justify-center">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in duration-500">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold mx-auto shadow-gold-glow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <Sparkles className="w-5 h-5 text-gold absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            CONFIRMED • HAUTE PARFUMERIE
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Your Signature is Queued.
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-md mx-auto">
            Thank you for ordering with SNY Perfumes. Your high-sillage formulation has been registered at our atelier.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Order Reference
              </span>
              <div className="text-base font-mono font-bold text-gold">
                {orderId || "SNY-CONFIRMED"}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/40 text-[11px] font-semibold text-gold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span>{order?.status?.replace(/_/g, " ") || "Registered"}</span>
            </span>
          </div>

          {order && (
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Recipient:</span>
                <span className="font-medium text-white">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping to:</span>
                <span className="font-medium text-white text-right max-w-xs truncate">
                  {order.shipping_address}, {order.city} - {order.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Mode:</span>
                <span className="font-medium uppercase text-white flex items-center gap-1">
                  {order.payment_method === "DIRECT_UPI" ? (
                    <>
                      <QrCode className="w-3.5 h-3.5 text-gold" />
                      <span>Direct UPI ({order.utr_number ? `UTR: ${order.utr_number}` : "Submitted"})</span>
                    </>
                  ) : (
                    <span>Cash On Delivery</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total:</span>
                <span className="font-mono text-gold font-bold">₹{order.total_amount}</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
            <Truck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Automated courier dispatch active via Shiprocket Express.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/account/orders/${orderId || ""}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>View Order & Tracking</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-gold/50 text-zinc-200 hover:text-white font-medium text-xs uppercase tracking-wider text-center transition-all"
          >
            Back to Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-gold">
          Loading order status...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
