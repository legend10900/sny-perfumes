import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { updateOrderPayment, updateOrderShipment, getOrder } from "@/lib/supabase";
import { createShiprocketOrder } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // In production with live webhooks, verify the HMAC SHA256 signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.warn("Razorpay Webhook: Invalid HMAC SHA256 signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || "{}");
    const event = payload.event;
    console.log(`Razorpay Webhook received event: ${event}`);

    // Check for payment captured or order paid events
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payload?.payment?.entity || {};
      const paymentId = paymentEntity.id || `pay_${Date.now()}`;
      const razorpayOrderId = paymentEntity.order_id || payload?.payload?.order?.entity?.id;
      const orderNumber = paymentEntity.notes?.orderNumber;

      const lookupKey = orderNumber || razorpayOrderId;
      if (!lookupKey) {
        console.warn("No identifier found in webhook payload");
        return NextResponse.json({ received: true, note: "No order identifier" });
      }

      // Step b: Update order status to PAID in Supabase
      const updatedOrder = await updateOrderPayment(lookupKey, paymentId, "PAID");

      if (updatedOrder) {
        // Step c: Trigger Shiprocket API (POST /v2/ks/order/create/adhoc)
        try {
          const shipmentResult = await createShiprocketOrder(updatedOrder);

          // Step d: Save Shiprocket order_id, shipment_id, and tracking URL back to Supabase
          if (shipmentResult.success) {
            await updateOrderShipment(updatedOrder.orderNumber, {
              shiprocketOrderId: shipmentResult.orderId,
              shiprocketShipmentId: shipmentResult.shipmentId,
              shiprocketTrackingUrl: shipmentResult.trackingUrl,
              orderStatus: "DISPATCHED",
            });
            console.log(`Shiprocket automated dispatch created: ${shipmentResult.shipmentId}`);
          }
        } catch (shipErr) {
          console.error("Error creating Shiprocket shipment in webhook:", shipErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Order marked PAID and automated Shiprocket dispatch triggered",
      });
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook handling error" },
      { status: 500 }
    );
  }
}
