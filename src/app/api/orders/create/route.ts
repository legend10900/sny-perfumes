import { NextRequest, NextResponse } from "next/server";
import { OrderRecord, ShippingAddress, CartItem, PaymentMethod } from "@/lib/types";
import { saveOrder } from "@/lib/supabase";
import { createShiprocketOrder } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
    }: {
      customer: ShippingAddress;
      items: CartItem[];
      subtotal: number;
      shippingFee: number;
      total: number;
      paymentMethod: PaymentMethod;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
    } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SNY-2026-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;

    const isPrepaid = paymentMethod === "razorpay";
    const paymentStatus = isPrepaid ? (razorpayPaymentId ? "PAID" : "PENDING") : "PENDING";
    const initialOrderStatus = isPrepaid ? (razorpayPaymentId ? "CONFIRMED" : "PENDING") : "CONFIRMED";

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: initialOrderStatus,
      razorpayOrderId,
      razorpayPaymentId,
      estimatedDelivery: new Date(Date.now() + 72 * 3600 * 1000).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };

    // If Cash On Delivery or prepaid already confirmed, dispatch Shiprocket order immediately
    if (paymentMethod === "cod" || (isPrepaid && razorpayPaymentId)) {
      try {
        const shipment = await createShiprocketOrder(newOrder);
        if (shipment.success) {
          newOrder.shiprocketOrderId = shipment.orderId;
          newOrder.shiprocketShipmentId = shipment.shipmentId;
          newOrder.shiprocketTrackingUrl = shipment.trackingUrl;
          newOrder.orderStatus = "DISPATCHED";
        }
      } catch (shipErr) {
        console.warn("Automated Shiprocket generation deferred:", shipErr);
      }
    }

    await saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
