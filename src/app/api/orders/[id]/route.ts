import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error("Fetch order route error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
