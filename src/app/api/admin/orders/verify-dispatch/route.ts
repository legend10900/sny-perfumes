import { NextRequest, NextResponse } from "next/server";
import { acceptAndDispatchOrder, cancelOrder, getAllOrders } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, action = "ACCEPT", reason } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    if (action === "CANCEL") {
      const cancelResult = await cancelOrder(orderId, reason);
      if (!cancelResult.success) {
        return NextResponse.json(
          { error: cancelResult.error || "Failed to cancel order" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        order: cancelResult.order,
        message: "Order successfully cancelled and logistics stopped.",
      });
    }

    // Default: ACCEPT / TAKE ORDER & DISPATCH
    const result = await acceptAndDispatchOrder(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Verification and dispatch failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: "Order accepted and automated Shiprocket courier consignment created!",
    });
  } catch (err: any) {
    console.error("Admin order action error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process order action" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load orders" }, { status: 500 });
  }
}
