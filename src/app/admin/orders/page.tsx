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
  XCircle,
  AlertTriangle,
  CreditCard,
  Ban,
} from "lucide-react";
import { OrderRecord } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "DISPATCHED" | "CANCELLED">("ALL");
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

  // Admin action: Take order & trigger automated Shiprocket courier booking
  const handleTakeOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      `Confirm & Take Order ${orderId}?\n\nThis will instantly generate the courier consignment in Shiprocket, assign an AWB tracking number, and mark the order as DISPATCHED.`
    );
    if (!confirmed) return;

    setProcessingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/verify-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "ACCEPT" }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? data.order : ord))
        );
      } else {
        alert(data.error || "Failed to dispatch order via Shiprocket.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to dispatch order");
    } finally {
      setProcessingId(null);
    }
  };

  // Admin action: Cancel order (stops courier and marks cancelled)
  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt(
      `Cancel Order ${orderId}?\n\nEnter reason for cancellation (e.g. "Customer requested", "Fake COD / Unreachable", "Out of stock"):`,
      "Customer requested cancellation"
    );
    if (reason === null) return; // user clicked cancel prompt

    setProcessingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/verify-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action: "CANCEL",
          reason: reason || "Cancelled by Atelier Operations",
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? data.order : ord))
        );
      } else {
        alert(data.error || "Failed to cancel order.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setProcessingId(null);
    }
  };

  const isPendingOrder = (status: string) =>
    status === "PENDING_APPROVAL" || status === "PENDING_VERIFICATION" || status === "VERIFIED";

  const filteredOrders = orders.filter((order) => {
    if (filter === "PENDING" && !isPendingOrder(order.status)) return false;
    if (filter === "DISPATCHED" && order.status !== "DISPATCHED") return false;
    if (filter === "CANCELLED" && order.status !== "CANCELLED") return false;

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

  const pendingCount = orders.filter((o) => isPendingOrder(o.status)).length;
  const dispatchedCount = orders.filter((o) => o.status === "DISPATCHED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

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
              <span className="text-xs text-zinc-400">Order Decision & Shiprocket Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Fulfillment Command Center
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
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === "PENDING"
                  ? "bg-amber-500 text-black shadow-md font-bold"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Needs Action ({pendingCount})</span>
            </button>
            <button
              onClick={() => setFilter("DISPATCHED")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === "DISPATCHED"
                  ? "bg-emerald-500 text-black shadow-md font-bold"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Dispatched ({dispatchedCount})</span>
            </button>
            <button
              onClick={() => setFilter("CANCELLED")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === "CANCELLED"
                  ? "bg-red-600 text-white shadow-md font-bold"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancelled ({cancelledCount})</span>
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
                  <th className="p-4">Customer & Address</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Shiprocket Courier</th>
                  <th className="p-4 text-right">Admin Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      No orders found matching this view.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isPending = isPendingOrder(order.status);
                    const isProcessing = processingId === order.id;

                    return (
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
                          <div className="text-[11px] text-gold font-mono">{order.customer_phone}</div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[200px]" title={order.shipping_address}>
                            {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-medium">
                            {order.payment_method === "DIRECT_UPI" ? (
                              <>
                                <QrCode className="w-3.5 h-3.5 text-gold" />
                                <span className="text-white">Direct UPI</span>
                              </>
                            ) : order.payment_method === "CARD" ? (
                              <>
                                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-white">Card Payment</span>
                              </>
                            ) : (
                              <>
                                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-white">Cash on Delivery</span>
                              </>
                            )}
                          </div>
                          {order.utr_number ? (
                            <div className="font-mono text-[11px] text-emerald-400 mt-0.5">
                              UTR: {order.utr_number}
                            </div>
                          ) : order.payment_method === "DIRECT_UPI" ? (
                            <div className="text-[10px] text-amber-400 italic">Awaiting UTR submission</div>
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
                                : order.status === "CANCELLED"
                                ? "bg-red-950 text-red-400 border border-red-500/30"
                                : "bg-amber-950 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                          {order.cancel_reason && (
                            <div className="text-[10px] text-red-400 mt-1 max-w-[150px] truncate" title={order.cancel_reason}>
                              Reason: {order.cancel_reason}
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-mono text-[11px]">
                          {order.tracking_url ? (
                            <div className="space-y-0.5">
                              <a
                                href={order.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline flex items-center gap-1 font-semibold"
                              >
                                <span>{order.awb_code || "Shiprocket Live"}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <div className="text-[10px] text-zinc-400">
                                {order.courier_name || "Assigned Courier"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Not booked yet</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* If order is pending approval or verification, show Take Order and Cancel Order buttons */}
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleTakeOrder(order.id)}
                                  disabled={isProcessing}
                                  className="px-3 py-1.5 rounded-lg gold-gradient-bg text-black font-semibold text-[11px] uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1"
                                  title="Approve order and create Shiprocket consignment"
                                >
                                  <Truck className="w-3 h-3" />
                                  <span>{isProcessing ? "Processing..." : "Take Order"}</span>
                                </button>

                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={isProcessing}
                                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-red-500/40 hover:bg-red-950 text-red-300 hover:text-red-200 text-[11px] uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1"
                                  title="Cancel order and prevent dispatch"
                                >
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : order.status === "DISPATCHED" ? (
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/account/orders/${order.id}`}
                                  className="text-xs text-zinc-400 hover:text-gold transition-colors inline-flex items-center gap-1"
                                >
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>

                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={isProcessing}
                                  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-[10px] text-zinc-400 hover:text-red-300 transition-all"
                                  title="Cancel dispatched shipment in Shiprocket"
                                >
                                  Cancel Parcel
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-zinc-500 italic">No action needed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
