import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { acceptAndDispatchOrder } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const result = await acceptAndDispatchOrder(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to dispatch order" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Order dispatched via Shiprocket successfully!",
      order: result.order,
    });
  } catch (err: any) {
    console.error("Admin dispatch route error:", err);
    return NextResponse.json({ error: err?.message || "Failed to dispatch order" }, { status: 500 });
  }
}
