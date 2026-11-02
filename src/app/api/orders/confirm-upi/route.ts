import { NextRequest, NextResponse } from "next/server";
import { updateOrderUTR } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, utrNumber } = body;

    if (!orderId || !utrNumber) {
      return NextResponse.json(
        { error: "Order ID and 12-digit UTR are required" },
        { status: 400 }
      );
    }

    const clean = utrNumber.trim();
    if (!/^\d{12}$/.test(clean)) {
      return NextResponse.json(
        { error: "Invalid UTR format. Must be a 12-digit number." },
        { status: 400 }
      );
    }

    const updated = await updateOrderUTR(orderId, clean);

    if (!updated) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (err: any) {
    console.error("Confirm UPI route error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to confirm UTR" },
      { status: 500 }
    );
  }
}
