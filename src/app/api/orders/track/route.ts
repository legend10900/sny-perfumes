import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/supabase";
import { TrackingStep, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Order ID or Phone number is required" }, { status: 400 });
    }

    const order = await getOrder(query);

    if (!order) {
      return NextResponse.json({ error: "Order not found. Please verify your details." }, { status: 404 });
    }

    // Generate real-time timeline steps based on orderStatus
    const statusOrder: OrderStatus[] = [
      "CONFIRMED",
      "DISPATCHED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const steps: TrackingStep[] = [
      {
        status: "CONFIRMED",
        label: "Order Confirmed",
        description: "Your luxury formulation has been reserved and queued for packaging.",
        timestamp: new Date(order.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        completed: safeIndex >= 0,
        current: safeIndex === 0,
      },
      {
        status: "DISPATCHED",
        label: "Dispatched from Atelier",
        description: "Assigned to courier partner via Shiprocket. High-grade safety sealed.",
        timestamp: safeIndex >= 1 ? "Within 12 hours of order" : undefined,
        completed: safeIndex >= 1,
        current: safeIndex === 1,
      },
      {
        status: "IN_TRANSIT",
        label: "In Transit",
        description: "Safely speeding across express air/surface hub networks to your destination.",
        timestamp: safeIndex >= 2 ? "Currently at Regional Distribution Hub" : undefined,
        completed: safeIndex >= 2,
        current: safeIndex === 2,
      },
      {
        status: "OUT_FOR_DELIVERY",
        label: "Out For Delivery",
        description: "The delivery agent will deliver your SNY signature scent at your doorstep.",
        completed: safeIndex >= 3,
        current: safeIndex === 3,
      },
      {
        status: "DELIVERED",
        label: "Delivered",
        description: "Delivered into your hands. Unbox and wear your signature scent.",
        completed: safeIndex >= 4,
        current: safeIndex === 4,
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
