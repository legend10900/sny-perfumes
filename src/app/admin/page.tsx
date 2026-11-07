"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Search,
  RefreshCw,
  Truck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  ExternalLink,
  Package,
  QrCode,
  Banknote,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  MapPin,
  Mail,
  User,
  Hash,
  Send,
} from "lucide-react";
import { OrderRecord, OrderStatus, PaymentMethod } from "@/lib/types";

export default function AdminPortalPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem("sny_admin_token");
      if (savedToken) {
        setAuthToken(savedToken);
      }
    } catch (e) {
      console.warn("Session storage inaccessible:", e);
    }
  }, []);

  // Fetch orders whenever token becomes available
  useEffect(() => {
    if (authToken) {
      loadOrders(authToken);
    }
  }, [authToken]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      const token = data.token;
      setAuthToken(token);
      try {
        sessionStorage.setItem("sny_admin_token", token);
      } catch (storageErr) {
        console.warn("Could not save to session storage:", storageErr);
      }
      setPassword("");
    } catch (err: any) {
      setLoginError(err.message || "Invalid master password. Please verify.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    try {
      sessionStorage.removeItem("sny_admin_token");
    } catch (e) {
      console.warn("Storage removal error:", e);
    }
    setOrders([]);
  };

  const loadOrders = async (token = authToken) => {
    if (!token) return;
    setLoadingOrders(true);

    try {
      const res = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.error || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      console.error("Load orders error:", err);
      showToast(err.message || "Failed to fetch orders", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Dispatch / Take Order Action
  const handleDispatch = async (orderId: string) => {
    if (!authToken) return;
    if (!confirm(`Are you sure you want to dispatch order ${orderId} via Shiprocket?`)) return;

    setActionLoading(orderId);
    try {
      const res = await fetch("/api/admin/orders/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch order");
      }

      showToast(`Order ${orderId} dispatched! AWB: ${data.order?.awb_code || "Generated"}`);
      // Refresh orders
      loadOrders(authToken);
    } catch (err: any) {
      showToast(err.message || "Dispatch failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel Order Action
  const handleCancel = async (orderId: string) => {
    if (!authToken) return;
    const reason = prompt("Enter cancellation reason (e.g., Unresponsive on call, Wrong phone, Customer requested):");
    if (reason === null) return; // User pressed cancel

    setActionLoading(orderId);
    try {
      const res = await fetch("/api/admin/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ orderId, reason: reason || "Cancelled by Atelier Operations" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel order");
      }

      showToast(`Order ${orderId} has been cancelled.`);
      loadOrders(authToken);
    } catch (err: any) {
      showToast(err.message || "Cancel failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Build WhatsApp pre-filled chat link
  const getWhatsAppLink = (order: OrderRecord) => {
    const rawPhone = (order.customer_phone || "").replace(/\D/g, "").slice(-10);
    const trackingLink = order.tracking_url || `https://snyperfumes.com/track-order?q=${order.id}`;

    let msg = `Hello ${order.customer_name || "Valued Customer"}! ✨\nThis is SNY Perfumes regarding your Order #${order.id}.\n\n`;
    if (order.status === "DISPATCHED") {
      msg += `📦 Your order has been dispatched via ${order.courier_name || "Shiprocket Express"}.\nAWB Tracking Code: ${order.awb_code || "Manifested"}\nLive Tracking: ${trackingLink}\n\n`;
    } else if (order.status === "CANCELLED") {
      msg += `Your order has been cancelled: ${order.cancel_reason || "As requested"}.\n\n`;
    } else {
      msg += `Your order for ₹${order.total_amount} (${order.payment_method}) is received and being prepped in our Surat atelier.\n\n`;
    }
    msg += `Thank you for choosing SNY Perfumes. Luxury inspired, long-lasting fragrances.`;

    return `https://wa.me/91${rawPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      if (statusFilter !== "ALL" && ord.status !== statusFilter) {
        return false;
      }
      // Payment filter
      if (paymentFilter !== "ALL" && ord.payment_method !== paymentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = ord.id?.toLowerCase().includes(q);
        const matchesName = ord.customer_name?.toLowerCase().includes(q);
        const matchesPhone = ord.customer_phone?.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
        const matchesEmail = ord.customer_email?.toLowerCase().includes(q);
        const matchesCity = ord.city?.toLowerCase().includes(q);
        const matchesUtr = ord.utr_number?.toLowerCase().includes(q);
        const matchesAwb = ord.awb_code?.toLowerCase().includes(q);
        return matchesId || matchesName || matchesPhone || matchesEmail || matchesCity || matchesUtr || matchesAwb;
      }
      return true;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => (o.status !== "CANCELLED" ? acc + (o.total_amount || 0) : acc), 0);
    const dispatched = orders.filter((o) => o.status === "DISPATCHED" || o.status === "DELIVERED").length;
    const pending = orders.filter((o) => o.status === "PENDING_APPROVAL" || o.status === "PENDING_VERIFICATION").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

    return {
      total: orders.length,
      totalRevenue,
      dispatched,
      pending,
      cancelled,
    };
  }, [orders]);

  // Export orders to CSV
  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Address",
      "City",
      "State",
      "Pincode",
      "Payment Mode",
      "UTR Number",
      "Total Amount",
      "Status",
      "Courier",
      "AWB",
      "Shiprocket Order ID",
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.created_at).toLocaleString("en-IN")}"`,
      `"${(o.customer_name || "").replace(/"/g, '""')}"`,
      `"${o.customer_phone || ""}"`,
      `"${o.customer_email || ""}"`,
      `"${(o.shipping_address || "").replace(/"/g, '""')}"`,
      `"${o.city || ""}"`,
      `"${o.state || ""}"`,
      `"${o.pincode || ""}"`,
      `"${o.payment_method || ""}"`,
      `"${o.utr_number || ""}"`,
      o.total_amount || 0,
      `"${o.status || ""}"`,
      `"${o.courier_name || ""}"`,
      `"${o.awb_code || ""}"`,
      `"${o.shiprocket_order_id || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sny_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: Password Gate (If not logged in)
  // -------------------------------------------------------------
  if (!authToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto shadow-gold-glow">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
                SNY Fragrance Atelier
              </span>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide mt-1">
                Executive Portal
              </h1>
            </div>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Private operations console for viewing past & current orders, customer contacts, and live Shiprocket dispatch.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Master Admin Password</span>
                <span className="text-[10px] text-zinc-500">Encrypted Gate</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3.5 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Passphrase...</span>
                </div>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Operations Console</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-900 text-center">
            <p className="text-[11px] text-zinc-600 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Protected administrative console • SNY Perfumes</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: Authenticated Admin Portal
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border text-xs shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            notification.type === "success"
              ? "bg-zinc-900 border-gold text-white"
              : "bg-red-950 border-red-500 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Operations Header */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                SNY Concierge & Operations
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Surat, Gujarat</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Master Order Management & History
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadOrders()}
              disabled={loadingOrders}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-gold text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin text-gold" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-gold text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-gold" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:border-red-500 text-xs text-red-300 hover:text-red-100 transition-colors flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Total Orders</span>
            <div className="text-2xl font-serif font-bold text-white">{metrics.total}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-gold font-medium">Net Revenue</span>
            <div className="text-2xl font-mono font-bold text-gold">₹{metrics.totalRevenue}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400">Dispatched (Shiprocket)</span>
            <div className="text-2xl font-serif font-bold text-emerald-400">{metrics.dispatched}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-300">Pending Action</span>
            <div className="text-2xl font-serif font-bold text-amber-300">{metrics.pending}</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-red-400">Cancelled</span>
            <div className="text-2xl font-serif font-bold text-red-400">{metrics.cancelled}</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 md:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, 10-digit phone, order ID, city, or UTR..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-gold text-xs text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="DIRECT_UPI">Direct UPI (with UTR)</option>
              <option value="CARD">Credit / Debit Card</option>
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
            {[
              { id: "ALL", label: "All Orders", count: orders.length },
              {
                id: "PENDING_VERIFICATION",
                label: "Pending Verification",
                count: orders.filter((o) => o.status === "PENDING_VERIFICATION" || o.status === "PENDING_APPROVAL").length,
              },
              {
                id: "DISPATCHED",
                label: "Dispatched (Shiprocket)",
                count: orders.filter((o) => o.status === "DISPATCHED").length,
              },
              {
                id: "DELIVERED",
                label: "Delivered",
                count: orders.filter((o) => o.status === "DELIVERED").length,
              },
              {
                id: "CANCELLED",
                label: "Cancelled",
                count: orders.filter((o) => o.status === "CANCELLED").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "gold-gradient-bg text-black font-semibold shadow-gold-glow"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id ? "bg-black/20 text-black font-bold" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Listing */}
        {loadingOrders ? (
          <div className="p-16 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-zinc-400">Loading Orders History...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <Package className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-serif font-bold text-white">No Matching Orders Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "ALL" || paymentFilter !== "ALL"
                ? "Try clearing filters to review all past orders."
                : "No customer orders have been received yet. Any new order placed will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const isDispatched = ord.status === "DISPATCHED" || ord.status === "DELIVERED";
              const isCancelled = ord.status === "CANCELLED";
              const isPending = !isDispatched && !isCancelled;
              const cleanPhone = (ord.customer_phone || "").replace(/\D/g, "").slice(-10);

              return (
                <div
                  key={ord.id}
                  className="p-6 md:p-7 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-900">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white tracking-wide">{ord.id}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-400">{formatDate(ord.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Payment Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300">
                        {ord.payment_method === "DIRECT_UPI" ? (
                          <>
                            <QrCode className="w-3 h-3 text-gold" />
                            <span>Direct UPI</span>
                          </>
                        ) : ord.payment_method === "CARD" ? (
                          <>
                            <CreditCard className="w-3 h-3 text-amber-400" />
                            <span>Card</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-3 h-3 text-emerald-400" />
                            <span>Cash on Delivery</span>
                          </>
                        )}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                          isDispatched
                            ? "bg-emerald-950/70 text-emerald-400 border-emerald-500/40"
                            : isCancelled
                            ? "bg-red-950/70 text-red-400 border-red-500/40"
                            : "bg-amber-950/70 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {ord.status ? ord.status.replace(/_/g, " ") : "CONFIRMED"}
                      </span>

                      <span className="font-mono text-base font-bold text-gold ml-2">₹{ord.total_amount}</span>
                    </div>
                  </div>

                  {/* Main Details Grid: Customer Info | Items | Logistics */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                    {/* Customer Destination (5 cols) */}
                    <div className="md:col-span-5 space-y-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gold" />
                        <span>Customer & Destination</span>
                      </span>

                      <div className="space-y-1">
                        <div className="font-semibold text-white text-sm">{ord.customer_name}</div>
                        <div className="text-zinc-400 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-mono text-zinc-200">{ord.customer_phone}</span>
                        </div>
                        {ord.customer_email && (
                          <div className="text-zinc-400 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{ord.customer_email}</span>
                          </div>
                        )}
                        <div className="text-zinc-400 flex items-start gap-2 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">
                            {ord.shipping_address}, {ord.city}, {ord.state} - {ord.pincode}
                          </span>
                        </div>
                      </div>

                      {/* Quick Contact Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <a
                          href={getWhatsAppLink(ord)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Update</span>
                        </a>

                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    {/* Fragrance Items Purchased (4 cols) */}
                    <div className="md:col-span-4 space-y-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-gold" />
                        <span>Fragrance Formulation Items</span>
                      </span>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-900 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-semibold text-zinc-200">{it.product_name}</div>
                                <div className="text-[11px] text-zinc-500">
                                  {it.size ? `${it.size} • ` : ""}Qty: {it.quantity}
                                </div>
                              </div>
                              <span className="font-mono text-zinc-300">₹{it.price * it.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-zinc-500 italic">Standard Perfume Flacon (₹{ord.total_amount})</div>
                        )}
                      </div>

                      {/* Direct UPI UTR Highlight */}
                      {ord.payment_method === "DIRECT_UPI" && (
                        <div className="p-2.5 rounded-xl bg-gold/5 border border-gold/30 space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                            Customer Submitted UTR / Ref Number:
                          </span>
                          <div className="font-mono text-xs font-bold text-white tracking-widest">
                            {ord.utr_number || "Awaiting UTR submission from buyer"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shiprocket Logistics & Controls (3 cols) */}
                    <div className="md:col-span-3 space-y-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-gold" />
                        <span>Shiprocket Logistics</span>
                      </span>

                      <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                        <div className="text-[11px] text-zinc-400">
                          <span className="text-zinc-500">Courier:</span>{" "}
                          <span className="text-white font-medium">{ord.courier_name || "Shiprocket Express"}</span>
                        </div>

                        <div className="text-[11px] text-zinc-400 truncate">
                          <span className="text-zinc-500">AWB:</span>{" "}
                          <span className="font-mono text-gold font-bold">{ord.awb_code || "Not generated"}</span>
                        </div>

                        {ord.shiprocket_order_id && (
                          <div className="text-[10px] text-zinc-500 font-mono">
                            SR Order ID: {ord.shiprocket_order_id}
                          </div>
                        )}

                        {ord.tracking_url && (
                          <a
                            href={ord.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-gold hover:underline pt-1"
                          >
                            <span>Live Tracking Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Operational Actions */}
                      <div className="space-y-2 pt-1">
                        {isPending && (
                          <button
                            onClick={() => handleDispatch(ord.id)}
                            disabled={actionLoading === ord.id}
                            className="w-full py-2 px-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {actionLoading === ord.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Truck className="w-3.5 h-3.5" />
                                <span>Accept & Dispatch</span>
                              </>
                            )}
                          </button>
                        )}

                        {!isCancelled && (
                          <button
                            onClick={() => handleCancel(ord.id)}
                            disabled={actionLoading === ord.id}
                            className="w-full py-1.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-red-300 transition-colors text-xs flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>Cancel Order</span>
                          </button>
                        )}

                        {isCancelled && (
                          <div className="text-[11px] text-red-400 italic">
                            Cancelled: {ord.cancel_reason || "By operations"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
