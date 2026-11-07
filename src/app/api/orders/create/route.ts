import { NextRequest, NextResponse } from "next/server";
import { ShippingAddress, CartItem, PaymentMethod, OrderItem } from "@/lib/types";
import { createOrder } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      total,
      paymentMethod,
    }: {
      customer: ShippingAddress;
      items: CartItem[];
      total: number;
      paymentMethod: PaymentMethod;
    } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      product_name: `${item.name} (${item.size})`,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    }));

    const orderPayload = {
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.street,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      total_amount: total,
      payment_method: paymentMethod || "DIRECT_UPI",
      status:
        paymentMethod === "COD" || paymentMethod === "CARD"
          ? ("DISPATCHED" as const)
          : ("PENDING_VERIFICATION" as const),
    };

    const newOrder = await createOrder(orderPayload, orderItems);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
