import { createClient } from "@supabase/supabase-js";
import { OrderRecord } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// Built-in in-memory / demo fallback store when Supabase environment variables are being set up
const fallbackOrders: Map<string, OrderRecord> = new Map([
  [
    "SNY-2026-9842",
    {
      id: "ord_demo_9842",
      orderNumber: "SNY-2026-9842",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      customer: {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "9876543210",
        street: "B-402, Signature Heights, MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      items: [
        {
          id: "midnight-oud-30ml",
          productId: "midnight-oud",
          name: "Midnight Oud (Extrait)",
          size: "30ml",
          price: 349,
          originalPrice: 499,
          image: "/branding/midnight-oud.jpg",
          quantity: 1,
          accentColor: "#c084fc",
        },
        {
          id: "titan-aura-30ml",
          productId: "titan-aura",
          name: "Titan Aura",
          size: "30ml",
          price: 349,
          originalPrice: 499,
          image: "/branding/titan-aura.jpg",
          quantity: 1,
          accentColor: "#f59e0b",
        },
      ],
      subtotal: 698,
      shippingFee: 0,
      total: 698,
      paymentMethod: "razorpay",
      paymentStatus: "PAID",
      orderStatus: "IN_TRANSIT",
      razorpayPaymentId: "pay_Ordx9281729K",
      razorpayOrderId: "order_K8192837190",
      shiprocketOrderId: "SR-8841920",
      shiprocketShipmentId: "SR_SHP_771920",
      shiprocketTrackingUrl: "https://shiprocket.co/tracking/SR_SHP_771920",
      estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    },
  ],
]);

export async function saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
  // Always save to local map for instant query consistency
  fallbackOrders.set(order.orderNumber, order);
  fallbackOrders.set(order.id, order);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("orders").upsert({
        id: order.id,
        order_number: order.orderNumber,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        razorpay_payment_id: order.razorpayPaymentId || null,
        razorpay_order_id: order.razorpayOrderId || null,
        shiprocket_order_id: order.shiprocketOrderId || null,
        shiprocket_shipment_id: order.shiprocketShipmentId || null,
        shiprocket_tracking_url: order.shiprocketTrackingUrl || null,
        created_at: order.createdAt,
      });

      if (error) {
        console.warn("Supabase upsert warning:", error.message);
        return { success: true }; // Continue with local fallback
      }
    } catch (err: unknown) {
      console.warn("Supabase error:", err);
    }
  }

  return { success: true };
}

export async function updateOrderPayment(
  orderIdOrNumber: string,
  paymentId: string,
  status: "PAID" | "FAILED" = "PAID"
): Promise<OrderRecord | null> {
  let order = fallbackOrders.get(orderIdOrNumber);

  if (!order) {
    for (const ord of Array.from(fallbackOrders.values())) {
      if (ord.razorpayOrderId === orderIdOrNumber || ord.id === orderIdOrNumber) {
        order = ord;
        break;
      }
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .update({
          payment_status: status,
          order_status: status === "PAID" ? "CONFIRMED" : "PENDING",
          razorpay_payment_id: paymentId,
        })
        .or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber},razorpay_order_id.eq.${orderIdOrNumber}`)
        .select()
        .single();

      if (data) {
        const mapped: OrderRecord = {
          id: data.id,
          orderNumber: data.order_number,
          createdAt: data.created_at,
          customer: data.customer,
          items: data.items,
          subtotal: data.subtotal,
          shippingFee: data.shipping_fee,
          total: data.total,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpayOrderId: data.razorpay_order_id,
          shiprocketOrderId: data.shiprocket_order_id,
          shiprocketShipmentId: data.shiprocket_shipment_id,
          shiprocketTrackingUrl: data.shiprocket_tracking_url,
        };
        fallbackOrders.set(mapped.orderNumber, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  if (order) {
    order.paymentStatus = status;
    if (status === "PAID") order.orderStatus = "CONFIRMED";
    order.razorpayPaymentId = paymentId;
    fallbackOrders.set(order.orderNumber, order);
    return order;
  }

  return null;
}

export async function updateOrderShipment(
  orderNumber: string,
  shipmentData: {
    shiprocketOrderId: string;
    shiprocketShipmentId: string;
    shiprocketTrackingUrl: string;
    orderStatus?: OrderRecord["orderStatus"];
  }
): Promise<OrderRecord | null> {
  const order = fallbackOrders.get(orderNumber);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .update({
          shiprocket_order_id: shipmentData.shiprocketOrderId,
          shiprocket_shipment_id: shipmentData.shiprocketShipmentId,
          shiprocket_tracking_url: shipmentData.shiprocketTrackingUrl,
          order_status: shipmentData.orderStatus || "DISPATCHED",
        })
        .eq("order_number", orderNumber)
        .select()
        .single();

      if (data) {
        const mapped: OrderRecord = {
          id: data.id,
          orderNumber: data.order_number,
          createdAt: data.created_at,
          customer: data.customer,
          items: data.items,
          subtotal: data.subtotal,
          shippingFee: data.shipping_fee,
          total: data.total,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpayOrderId: data.razorpay_order_id,
          shiprocketOrderId: data.shiprocket_order_id,
          shiprocketShipmentId: data.shiprocket_shipment_id,
          shiprocketTrackingUrl: data.shiprocket_tracking_url,
        };
        fallbackOrders.set(orderNumber, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  if (order) {
    order.shiprocketOrderId = shipmentData.shiprocketOrderId;
    order.shiprocketShipmentId = shipmentData.shiprocketShipmentId;
    order.shiprocketTrackingUrl = shipmentData.shiprocketTrackingUrl;
    order.orderStatus = shipmentData.orderStatus || "DISPATCHED";
    fallbackOrders.set(orderNumber, order);
    return order;
  }

  return null;
}

export async function getOrder(query: string): Promise<OrderRecord | null> {
  const clean = query.trim().toUpperCase();

  // Check fallback cache first
  for (const ord of Array.from(fallbackOrders.values())) {
    if (
      ord.orderNumber.toUpperCase() === clean ||
      ord.id.toUpperCase() === clean ||
      ord.customer.phone.replace(/\D/g, "") === clean.replace(/\D/g, "")
    ) {
      return ord;
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`order_number.ilike.%${query}%,customer->>phone.ilike.%${query}%,id.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          createdAt: data.created_at,
          customer: data.customer,
          items: data.items,
          subtotal: data.subtotal,
          shippingFee: data.shipping_fee,
          total: data.total,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpayOrderId: data.razorpay_order_id,
          shiprocketOrderId: data.shiprocket_order_id,
          shiprocketShipmentId: data.shiprocket_shipment_id,
          shiprocketTrackingUrl: data.shiprocket_tracking_url,
        };
      }
    } catch (err) {
      console.warn("Supabase getOrder error:", err);
    }
  }

  return null;
}
