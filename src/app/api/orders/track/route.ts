import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/supabase";
import { TrackingStep, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Order ID or Phone number is required" }, { status: 400 });
    }

    const order = await getOrderById(query.trim());

    if (!order) {
      return NextResponse.json(
        { error: "No order record found. Please verify your reference or contact concierge." },
        { status: 404 }
      );
    }

    const statusList: OrderStatus[] = [
      "PENDING_VERIFICATION",
      "VERIFIED",
      "DISPATCHED",
      "DELIVERED",
    ];

    const currentIndex = statusList.indexOf(order.status);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const steps: TrackingStep[] = [
      {
        status: "PENDING_VERIFICATION",
        label: order.payment_method === "COD" ? "Order Confirmed (COD)" : "Payment Reference Submitted",
        description:
          order.payment_method === "COD"
            ? "Order accepted for Cash on Delivery. Queued for packaging."
            : order.utr_number
            ? `12-digit UTR (${order.utr_number}) received. Atelier verifying bank notification.`
            : "Direct UPI initiated. Awaiting 12-digit UTR confirmation.",
        timestamp: new Date(order.created_at).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        completed: safeIndex >= 0,
        current: safeIndex === 0,
      },
      {
        status: "VERIFIED",
        label: "Atelier Verified & Formulated",
        description: "Payment confirmed. Authentic French perfume oil batch sealed in luxury matte bottle.",
        completed: safeIndex >= 1,
        current: safeIndex === 1,
      },
      {
        status: "DISPATCHED",
        label: "Dispatched via Shiprocket Express",
        description: order.courier_name
          ? `In transit with ${order.courier_name}. AWB: ${order.awb_code || "Generated"}.`
          : "Dispatched to courier network. Safely moving to your city.",
        completed: safeIndex >= 2,
        current: safeIndex === 2,
      },
      {
        status: "DELIVERED",
        label: "Delivered to Doorstep",
        description: "Delivered into your hands. Unbox and wear your signature scent.",
        completed: safeIndex >= 3,
        current: safeIndex === 3,
      },
    ];

    return NextResponse.json({
      success: true,
      order,
      steps,
    });
  } catch (error: any) {
    console.error("Tracking route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch tracking data" },
      { status: 500 }
    );
  }
}
