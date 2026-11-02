"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  Banknote,
  Search,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { OrderRecord } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING_VERIFICATION" | "DISPATCHED">("ALL");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/verify-dispatch");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleVerify = async (orderId: string) => {
    setVerifyingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/verify-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? data.order : ord))
        );
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to dispatch order");
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter !== "ALL" && order.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.customer_phone.includes(q) ||
        (order.utr_number && order.utr_number.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                SNY ATELIER OPERATIONS
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Shiprocket & Direct UPI Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Order Fulfillment Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={loading}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-gold/50 text-zinc-300 hover:text-white transition-all"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-gold" : ""}`} />
            </button>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-gold/50 transition-all uppercase tracking-wider"
            >
              Back to Store
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === "ALL"
                  ? "gold-gradient-bg text-black shadow-gold-glow"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter("PENDING_VERIFICATION")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === "PENDING_VERIFICATION"
                  ? "bg-amber-500 text-black shadow-md"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Needs UTR Verify ({orders.filter((o) => o.status === "PENDING_VERIFICATION").length})
            </button>
            <button
              onClick={() => setFilter("DISPATCHED")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === "DISPATCHED"
                  ? "bg-emerald-500 text-black shadow-md"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Dispatched ({orders.filter((o) => o.status === "DISPATCHED").length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name, Phone, or UTR..."
              className="w-full sm:w-80 px-4 py-2.5 pl-9 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment & UTR</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Shiprocket AWB</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      No orders found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="font-semibold text-white">{order.id}</div>
                        <div className="text-[10px] text-zinc-500">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-white">{order.customer_name}</div>
                        <div className="text-[11px] text-zinc-400">{order.customer_phone}</div>
                        <div className="text-[10px] text-zinc-500 truncate max-w-[160px]">
                          {order.city}, {order.state}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          {order.payment_method === "DIRECT_UPI" ? (
                            <>
                              <QrCode className="w-3.5 h-3.5 text-gold" />
                              <span className="text-white">Direct UPI</span>
                            </>
                          ) : (
                            <>
                              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-white">COD</span>
                            </>
                          )}
                        </div>
                        {order.utr_number ? (
                          <div className="font-mono text-[11px] text-emerald-400 mt-0.5">
                            UTR: {order.utr_number}
                          </div>
                        ) : order.payment_method === "DIRECT_UPI" ? (
                          <div className="text-[10px] text-amber-400 italic">No UTR yet</div>
                        ) : null}
                      </td>

                      <td className="p-4 font-mono font-bold text-white">
                        ₹{order.total_amount}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            order.status === "DISPATCHED"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-950 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        {order.tracking_url ? (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline flex items-center gap-1"
                          >
                            <span>{order.awb_code || "Shiprocket Live"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {order.status === "PENDING_VERIFICATION" ? (
                          <button
                            onClick={() => handleVerify(order.id)}
                            disabled={verifyingId === order.id}
                            className="px-3.5 py-1.5 rounded-lg gold-gradient-bg text-black font-semibold text-[11px] uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                          >
                            {verifyingId === order.id ? (
                              "Dispatching..."
                            ) : (
                              "Verify & Dispatch via Shiprocket"
                            )}
                          </button>
                        ) : (
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="text-xs text-zinc-400 hover:text-gold transition-colors inline-flex items-center gap-1"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
