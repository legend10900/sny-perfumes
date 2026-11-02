import { createClient } from "@supabase/supabase-js";
import { OrderRecord, OrderItem } from "./types";
import { createShiprocketOrder } from "./shiprocket";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// Built-in in-memory fallback cache for development & instant previews
const memoryOrders: Map<string, OrderRecord> = new Map([
  [
    "ord_demo_9842",
    {
      id: "ord_demo_9842",
      customer_name: "Aarav Sharma",
      customer_email: "aarav.sharma@example.com",
      customer_phone: "9876543210",
      shipping_address: "B-402, Signature Heights, MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      total_amount: 698,
      payment_method: "DIRECT_UPI",
      utr_number: "419283719028",
      status: "DISPATCHED",
      shiprocket_order_id: 8841920,
      shiprocket_shipment_id: 771920,
      awb_code: "SR881920381IN",
      courier_name: "Blue Dart Express",
      tracking_url: "https://shiprocket.co/tracking/771920",
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      items: [
        {
          product_name: "Midnight Oud (30ml)",
          price: 349,
          quantity: 1,
        },
        {
          product_name: "Titan Aura (30ml)",
          price: 349,
          quantity: 1,
        },
      ],
    },
  ],
]);

// Helper to save order and items
export async function createOrder(
  orderData: Omit<OrderRecord, "id" | "created_at">,
  items: OrderItem[]
): Promise<OrderRecord> {
  const generatedId = `sny_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  let finalOrder: OrderRecord = {
    ...orderData,
    id: generatedId,
    created_at: now,
    items,
  };

  // If COD, dispatch immediately via Shiprocket
  if (finalOrder.payment_method === "COD") {
    try {
      const shipment = await createShiprocketOrder(finalOrder, items);
      if (shipment.success) {
        finalOrder.shiprocket_order_id = shipment.order_id;
        finalOrder.shiprocket_shipment_id = shipment.shipment_id;
        finalOrder.awb_code = shipment.awb_code;
        finalOrder.courier_name = shipment.courier_name;
        finalOrder.tracking_url = shipment.tracking_url;
        finalOrder.status = "DISPATCHED";
      }
    } catch (shipErr) {
      console.warn("Shiprocket COD automated generation error:", shipErr);
    }
  }

  // Save to memory cache
  memoryOrders.set(finalOrder.id, finalOrder);

  // If Supabase is connected, write to Supabase tables
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: insertedOrder, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: finalOrder.customer_name,
          customer_email: finalOrder.customer_email,
          customer_phone: finalOrder.customer_phone,
          shipping_address: finalOrder.shipping_address,
          city: finalOrder.city,
          state: finalOrder.state,
          pincode: finalOrder.pincode,
          total_amount: finalOrder.total_amount,
          payment_method: finalOrder.payment_method,
          utr_number: finalOrder.utr_number || null,
          status: finalOrder.status,
          shiprocket_order_id: finalOrder.shiprocket_order_id || null,
          shiprocket_shipment_id: finalOrder.shiprocket_shipment_id || null,
          awb_code: finalOrder.awb_code || null,
          courier_name: finalOrder.courier_name || null,
          tracking_url: finalOrder.tracking_url || null,
        })
        .select()
        .single();

      if (!orderErr && insertedOrder) {
        finalOrder.id = insertedOrder.id;
        memoryOrders.set(finalOrder.id, finalOrder);

        // Insert order_items
        if (items.length > 0) {
          const itemsPayload = items.map((i) => ({
            order_id: insertedOrder.id,
            product_name: i.product_name,
            price: i.price,
            quantity: i.quantity,
          }));
          await supabase.from("order_items").insert(itemsPayload);
        }
      }
    } catch (dbErr) {
      console.warn("Supabase insert order error:", dbErr);
    }
  }

  return finalOrder;
}

// Update order with 12-digit UTR
export async function updateOrderUTR(orderId: string, utrNumber: string): Promise<OrderRecord | null> {
  const cleanUTR = utrNumber.trim();
  let order = memoryOrders.get(orderId);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          utr_number: cleanUTR,
          status: "PENDING_VERIFICATION",
        })
        .eq("id", orderId)
        .select()
        .single();

      if (!error && data) {
        const updated: OrderRecord = {
          ...data,
          items: order?.items || [],
        };
        memoryOrders.set(orderId, updated);
        return updated;
      }
    } catch (err) {
      console.warn("Supabase update UTR error:", err);
    }
  }

  if (order) {
    order.utr_number = cleanUTR;
    order.status = "PENDING_VERIFICATION";
    memoryOrders.set(orderId, order);
    return order;
  }

  return null;
}

// Admin action: Verify payment and trigger automated Shiprocket dispatch
export async function verifyAndDispatchOrder(orderId: string): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
  let order = await getOrderById(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  try {
    // Trigger Shiprocket ad-hoc API with payment_method: "Prepaid"
    const shipment = await createShiprocketOrder(order, order.items || []);

    const updatedData: Partial<OrderRecord> = {
      status: "DISPATCHED",
      shiprocket_order_id: shipment.order_id,
      shiprocket_shipment_id: shipment.shipment_id,
      awb_code: shipment.awb_code,
      courier_name: shipment.courier_name,
      tracking_url: shipment.tracking_url,
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from("orders").update(updatedData).eq("id", orderId);
    }

    const mergedOrder: OrderRecord = {
      ...order,
      ...updatedData,
    };
    memoryOrders.set(orderId, mergedOrder);

    return { success: true, order: mergedOrder };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to dispatch via Shiprocket" };
  }
}

// Fetch order by ID
export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  // Check memory first
  const memoryMatch = memoryOrders.get(orderId);
  if (memoryMatch) return memoryMatch;

  // Search case-insensitive or partial
  for (const ord of Array.from(memoryOrders.values())) {
    if (ord.id.toLowerCase() === orderId.toLowerCase() || ord.customer_phone === orderId) {
      return ord;
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .or(`id.eq.${orderId},customer_phone.eq.${orderId}`)
        .limit(1)
        .maybeSingle();

      if (!error && orderData) {
        const mapped: OrderRecord = {
          ...orderData,
          items: orderData.order_items || [],
        };
        memoryOrders.set(mapped.id, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("Supabase getOrderById error:", err);
    }
  }

  return null;
}

// Fetch all orders for admin review
export async function getAllOrders(): Promise<OrderRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          items: d.order_items || [],
        }));
      }
    } catch (err) {
      console.warn("Supabase getAllOrders error:", err);
    }
  }

  return Array.from(memoryOrders.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
