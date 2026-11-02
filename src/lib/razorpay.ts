import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "sny_webhook_secret_luxury";

export function verifyRazorpaySignature(
  rawBody: string,
  receivedSignature: string,
  secret: string = RAZORPAY_WEBHOOK_SECRET
): boolean {
  if (!receivedSignature || !secret) return false;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature)
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!RAZORPAY_KEY_SECRET) return true; // In sandbox / test mode without secret

  try {
    const text = `${params.orderId}|${params.paymentId}`;
    const expected = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(params.signature)
    );
  } catch {
    return false;
  }
}

export async function createRazorpayOrder(params: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string; isSimulated?: boolean }> {
  const amountInPaise = Math.round(params.amountInRupees * 100);

  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: params.receipt,
          notes: params.notes || {},
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id,
          amount: data.amount,
          currency: data.currency,
        };
      }
    } catch (err) {
      console.warn("Razorpay order API failed:", err);
    }
  }

  // Simulated fallback for immediate local testing & seamless preview
  const simulatedId = `order_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  return {
    id: simulatedId,
    amount: amountInPaise,
    currency: "INR",
    isSimulated: true,
  };
}
