import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { cancelOrder } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const result = await cancelOrder(orderId, reason);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to cancel order" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled and Shiprocket shipment stopped.",
      order: result.order,
    });
  } catch (err: any) {
    console.error("Admin cancel route error:", err);
    return NextResponse.json({ error: err?.message || "Failed to cancel order" }, { status: 500 });
  }
}
