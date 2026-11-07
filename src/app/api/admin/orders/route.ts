import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getAllOrders } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized access to admin orders" }, { status: 401 });
    }

    const orders = await getAllOrders();

    return NextResponse.json({
      success: true,
      orders,
      totalCount: orders.length,
    });
  } catch (error: any) {
    console.error("Fetch admin orders error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load orders" }, { status: 500 });
  }
}
