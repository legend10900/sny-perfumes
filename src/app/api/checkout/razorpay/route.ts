import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: amount,
      receipt: receipt || `rec_${Date.now()}`,
      notes,
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_luxury_preview",
      isSimulated: razorpayOrder.isSimulated || false,
    });
  } catch (error: any) {
    console.error("Razorpay order route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
