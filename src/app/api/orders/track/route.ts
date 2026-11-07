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

    if (order.status === "CANCELLED") {
      const cancelledSteps: TrackingStep[] = [
        {
          status: "CANCELLED",
          label: "Order Cancelled",
          description: order.cancel_reason || "This order was cancelled by Atelier Operations or at customer request.",
          timestamp: new Date(order.created_at).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          completed: true,
          current: true,
        },
      ];

      return NextResponse.json({
        success: true,
        order,
        steps: cancelledSteps,
      });
    }

    const statusList: OrderStatus[] = [
      "PENDING_APPROVAL",
      "PENDING_VERIFICATION",
      "VERIFIED",
      "DISPATCHED",
      "DELIVERED",
    ];

    const isPending = order.status === "PENDING_APPROVAL" || order.status === "PENDING_VERIFICATION";
    const currentIndex = statusList.indexOf(order.status);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const steps: TrackingStep[] = [
      {
        status: "PENDING_APPROVAL",
        label:
          order.payment_method === "COD"
            ? "Order Placed (COD Processing)"
            : order.payment_method === "CARD"
            ? "Order Placed (Card Authorized)"
            : "Payment Reference Submitted",
        description:
          order.payment_method === "COD"
            ? "Order received for Cash on Delivery. Atelier reviewing and prepping packaging."
            : order.payment_method === "CARD"
            ? "Card payment received. Queued for formulation and dispatch."
            : order.utr_number
            ? `12-digit UTR (${order.utr_number}) received. Atelier verifying bank notification.`
            : "Direct UPI initiated. Awaiting 12-digit UTR confirmation.",
        timestamp: new Date(order.created_at).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        completed: true,
        current: isPending,
      },
      {
        status: "VERIFIED",
        label: "Atelier Formulated & Approved",
        description: "Order verified. Authentic French perfume oil flacon sealed with luxury packaging.",
        completed: safeIndex >= 2,
        current: order.status === "VERIFIED",
      },
      {
        status: "DISPATCHED",
        label: "Dispatched via Shiprocket Express",
        description: order.courier_name
          ? `In transit with ${order.courier_name}. AWB: ${order.awb_code || "Generated"}.`
          : "Dispatched to courier network. Safely moving to your city.",
        completed: safeIndex >= 3,
        current: order.status === "DISPATCHED",
      },
      {
        status: "DELIVERED",
        label: "Delivered to Doorstep",
        description: "Delivered into your hands. Unbox and wear your signature scent.",
        completed: safeIndex >= 4,
        current: order.status === "DELIVERED",
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
