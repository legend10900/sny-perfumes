export interface OlfactoryNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  inspiredBy: string;
  description: string;
  price30ml: number;
  originalPrice30ml: number;
  price50ml: number;
  originalPrice50ml: number;
  rating: number;
  reviewCount: number;
  accentColor: string;
  image: string;
  secondaryImage?: string;
  badges: string[];
  gender: 'Unisex' | 'Men' | 'Women';
  notes: OlfactoryNotes;
  season: string;
  longevity: string;
  projection: string;
  concentration: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: '30ml' | '50ml' | 'Bundle' | 'Discovery Box' | 'Discovery Set';
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  accentColor: string;
}

export interface SpecialBundle {
  id: string;
  title: string;
  badge: string;
  price: number;
  originalPrice: number;
  savings: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export type PaymentMethod = 'DIRECT_UPI' | 'COD';
export type OrderStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'DISPATCHED' | 'DELIVERED';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: PaymentMethod;
  utr_number?: string | null;
  status: OrderStatus;
  shiprocket_order_id?: number | null;
  shiprocket_shipment_id?: number | null;
  awb_code?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}
