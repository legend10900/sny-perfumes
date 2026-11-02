import { NextRequest, NextResponse } from "next/server";
import { verifyAndDispatchOrder, getAllOrders } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const result = await verifyAndDispatchOrder(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Verification failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: "Order verified and automated Shiprocket courier consignment created!",
    });
  } catch (err: any) {
    console.error("Admin verify dispatch error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to dispatch order" },
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
