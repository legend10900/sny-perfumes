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
  CreditCard,
  CheckCircle,
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

  // Credit / Debit card details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });

  const COD_FEE = 50;
  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const codFee = paymentMethod === "COD" ? COD_FEE : 0;
  const total = subtotal + shippingFee + codFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    // Format in groups of 4 digits
    let formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardDetails((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardDetails((prev) => ({ ...prev, expiry: raw }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardDetails((prev) => ({ ...prev, cvv: raw }));
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
    if (/^(60|65|81|82)/.test(clean)) return "RuPay";
    if (/^(34|37)/.test(clean)) return "Amex";
    return "Card";
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

    if (paymentMethod === "CARD") {
      const cleanCard = cardDetails.cardNumber.replace(/\s+/g, "");
      if (cleanCard.length < 15) return "Please enter a valid 16-digit Credit or Debit Card number";
      if (!cardDetails.cardholderName.trim()) return "Please enter the cardholder name as printed on card";
      if (!cardDetails.expiry || !cardDetails.expiry.includes("/") || cardDetails.expiry.length < 5)
        return "Please enter valid card expiry date (MM/YY)";
      if (!cardDetails.cvv || cardDetails.cvv.length < 3)
        return "Please enter 3 or 4 digit CVV/CVC code";
    }

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

      // Cache order in localStorage so order details page loads instantly without server lag
      try {
        localStorage.setItem("sny_current_order", JSON.stringify(createdOrder));
        localStorage.setItem(`sny_order_${createdOrder.id}`, JSON.stringify(createdOrder));
      } catch (storageErr) {
        console.warn("Storage error:", storageErr);
      }

      if (paymentMethod === "DIRECT_UPI") {
        // Show interactive Direct UPI screen with installed app deep-links, QR Code, and UTR submission
        clearCart();
        setActiveUpiOrder(createdOrder);
        setLoading(false);
      } else {
        // CARD or COD order: perform clean, instant top-level navigation to order confirmation
        clearCart();
        window.location.href = `/account/orders/${encodeURIComponent(createdOrder.id)}`;
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Collection</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
            <span className="text-gold font-medium">📍 Surat, Gujarat</span>
            <span>•</span>
            <span>📦 Pan India Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Lock className="w-3 h-3 text-gold" />
              <span>Direct UPI Apps, Cards & COD</span>
            </span>
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

                {/* Section 2: Payment Selection */}
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
                    {/* Direct UPI (Default, 0% fee, installed app deep link & QR) */}
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
                            <span>Online Pay (Direct UPI Apps & QR Code)</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-[10px] text-gold font-semibold uppercase">
                            0% Fee • Instant (Save ₹50)
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Tap installed GPay, PhonePe, Paytm, CRED on mobile, or scan QR on desktop. Zero transaction fees.
                        </p>
                      </div>
                    </label>

                    {/* Credit / Debit Card Option */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        paymentMethod === "CARD"
                          ? "bg-zinc-900 border-gold shadow-gold-glow"
                          : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <label
                        onClick={() => setPaymentMethod("CARD")}
                        className="flex items-start gap-4 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "CARD"}
                          onChange={() => setPaymentMethod("CARD")}
                          className="mt-1 text-gold focus:ring-gold"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-amber-400" />
                              <span>Credit & Debit Cards (Visa, Mastercard, RuPay)</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                              256-Bit SSL
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            Pay securely with any Indian or International debit or credit card.
                          </p>
                        </div>
                      </label>

                      {/* Interactive Card Input Form when CARD is selected */}
                      {paymentMethod === "CARD" && (
                        <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3.5 animate-in fade-in">
                          <div className="flex items-center justify-between text-[11px] text-zinc-400">
                            <span>Card Details</span>
                            <span className="text-gold font-mono font-medium">
                              {getCardBrand(cardDetails.cardNumber)}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400">
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={19}
                                value={cardDetails.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4000 1234 5678 9010"
                                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-600 font-mono tracking-wider transition-colors"
                              />
                              <CreditCard className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardDetails.cardholderName}
                              onChange={(e) =>
                                setCardDetails((prev) => ({
                                  ...prev,
                                  cardholderName: e.target.value.toUpperCase(),
                                }))
                              }
                              placeholder="AS PRINTED ON CARD"
                              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-600 tracking-wider transition-colors"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-medium text-zinc-400">
                                Expiry (MM/YY)
                              </label>
                              <input
                                type="text"
                                maxLength={5}
                                value={cardDetails.expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-600 font-mono tracking-wider transition-colors text-center"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-medium text-zinc-400">
                                CVV / CVC
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardDetails.cvv}
                                onChange={handleCvvChange}
                                placeholder="•••"
                                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-gold focus:outline-none text-white text-xs placeholder:text-zinc-600 font-mono tracking-widest transition-colors text-center"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 text-[10px] text-zinc-500">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            <span>PCI-DSS Compliant • Bank-grade 256-Bit SSL Encryption</span>
                          </div>
                        </div>
                      )}
                    </div>

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
                          <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-[10px] text-amber-300 font-mono font-semibold">
                            +₹50 Handling Fee
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Pay cash or UPI directly to the courier agent when your parcel arrives. A ₹50 handling charge is applied for Cash on Delivery. Pay online via UPI or Card to save ₹50.
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
                      <span>Processing Atelier Order...</span>
                    </div>
                  ) : paymentMethod === "DIRECT_UPI" ? (
                    <span>Proceed to Online Pay / UPI Apps (₹{total})</span>
                  ) : paymentMethod === "CARD" ? (
                    <span>Pay Securely with Card (₹{total})</span>
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
                  {paymentMethod === "COD" ? (
                    <div className="flex justify-between text-amber-300 animate-in fade-in">
                      <span>Cash on Delivery (COD) Fee</span>
                      <span className="font-mono font-medium">+₹{COD_FEE}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-emerald-400 text-[11px]">
                      <span>Online Pay Benefit</span>
                      <span className="font-mono font-medium">₹0 Fee (Saved ₹50)</span>
                    </div>
                  )}
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
                    <span>Zero convenience fees on Direct UPI & Cards</span>
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
