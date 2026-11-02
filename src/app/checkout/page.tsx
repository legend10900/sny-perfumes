"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  QrCode,
  Banknote,
  Lock,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { PaymentMethod, ShippingAddress, OrderRecord } from "@/lib/types";
import DirectUPIPayment from "@/components/DirectUPIPayment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("DIRECT_UPI");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeUpiOrder, setActiveUpiOrder] = useState<OrderRecord | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!address.fullName.trim()) return "Please enter your full name";
    if (!address.email.trim() || !address.email.includes("@")) return "Please enter a valid email address";
    if (!address.phone.trim() || address.phone.replace(/\D/g, "").length < 10)
      return "Please enter a valid 10-digit mobile number";
    if (!address.street.trim()) return "Please enter your street address / apartment details";
    if (!address.city.trim()) return "Please enter your city";
    if (!address.state.trim()) return "Please enter your state";
    if (!address.pincode.trim() || address.pincode.length < 6)
      return "Please enter a valid 6-digit PIN code";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: address,
          items,
          total,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.error || "Failed to create order");
      }

      const createdOrder: OrderRecord = data.order;

      if (paymentMethod === "DIRECT_UPI") {
        // Show interactive Direct UPI screen with QR Code and UTR submission
        clearCart();
        setActiveUpiOrder(createdOrder);
        setLoading(false);
      } else {
        // COD order: Shiprocket is generated immediately
        clearCart();
        router.push(`/account/orders/${createdOrder.id}`);
      }
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(err.message || "An error occurred during checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Collection</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        {/* If Direct UPI order was created, render interactive payment screen */}
        {activeUpiOrder ? (
          <div className="space-y-6">
            <DirectUPIPayment order={activeUpiOrder} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
            <h2 className="text-xl font-serif font-bold text-white">Your Atelier Bag is Empty</h2>
            <p className="text-xs text-zinc-400">
              Please choose your signature fragrance before proceeding to the checkout.
            </p>
            <Link
              href="/#scents"
              className="inline-block px-6 py-3 rounded-full gold-gradient-bg text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow"
            >
              Discover Fragrances
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Checkout Form */}
            <div className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Customer Contact & Shipping Address */}
                <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/40 text-gold flex items-center justify-center text-xs font-mono font-bold">
                      1
                    </span>
                    <h3 className="text-base font-serif font-bold text-white tracking-wide">
                      Shipping Destination
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={address.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Arjun Kapoor"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Email Address <span className="text-gold">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={address.email}
                        onChange={handleInputChange}
                        placeholder="arjun@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Phone Number (for Courier SMS) <span className="text-gold">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={address.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Street Address & Apartment / Landmark <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        value={address.street}
                        onChange={handleInputChange}
                        placeholder="Apartment, Street name, Landmark"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        City <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={address.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        State <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={address.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        PIN Code <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={address.pincode}
                        onChange={handleInputChange}
                        placeholder="6 digits"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Zero-Fee Payment Selection */}
                <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/40 text-gold flex items-center justify-center text-xs font-mono font-bold">
                      2
                    </span>
                    <h3 className="text-base font-serif font-bold text-white tracking-wide">
                      Select Payment Mode
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Direct UPI (Default, 0% fee) */}
                    <label
                      onClick={() => setPaymentMethod("DIRECT_UPI")}
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "DIRECT_UPI"
                          ? "bg-zinc-900 border-gold shadow-gold-glow"
                          : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "DIRECT_UPI"}
                        onChange={() => setPaymentMethod("DIRECT_UPI")}
                        className="mt-1 text-gold focus:ring-gold"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-gold" />
                            <span>Direct UPI (0% Fee, Instant GPay/PhonePe/Paytm QR)</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-[10px] text-gold font-semibold uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Scan QR on desktop or tap to open your preferred UPI app on mobile. No gateway markups.
                        </p>
                      </div>
                    </label>

                    {/* Cash On Delivery Option */}
                    <label
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "bg-zinc-900 border-gold shadow-gold-glow"
                          : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mt-1 text-gold focus:ring-gold"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-zinc-400" />
                            <span>Cash on Delivery (COD)</span>
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            Pay at Doorstep
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Pay cash or UPI directly to the courier agent when your parcel arrives.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Creating Atelier Order...</span>
                    </div>
                  ) : paymentMethod === "DIRECT_UPI" ? (
                    <span>Proceed to Direct UPI QR (₹{total})</span>
                  ) : (
                    <span>Confirm Cash On Delivery Order (₹{total})</span>
                  )}
                </button>
              </form>
            </div>

            {/* Right 5 Columns: Sticky Order Summary */}
            <div className="lg:col-span-5">
              <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 sticky top-28">
                <h3 className="text-base font-serif font-bold text-white tracking-wide border-b border-zinc-800 pb-4">
                  Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                          <span>{item.size}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-zinc-200">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Delivery (Shiprocket)</span>
                    <span className="font-mono">
                      {shippingFee === 0 ? (
                        <span className="text-gold font-semibold uppercase">Free</span>
                      ) : (
                        <span className="text-white">₹{shippingFee}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                    <span className="font-serif">Grand Total</span>
                    <span className="font-mono text-gold">₹{total}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 space-y-2.5 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Automated courier dispatch via Shiprocket</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Zero payment processing fees on Direct UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
