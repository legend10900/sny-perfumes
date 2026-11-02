export interface OlfactoryNotes {
  top: string[];     // 0 - 15m
  heart: string[];   // 2 - 4h
  base: string[];    // 6+h
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
  accentColor: string; // Hex color for glow and pill accents
  image: string;
  secondaryImage?: string;
  badges: string[];
  gender: 'Unisex' | 'Men' | 'Women';
  notes: OlfactoryNotes;
  season: string;
  longevity: string;
  projection: string;
  concentration: string; // 'Eau De Parfum' | 'Extrait De Parfum'
}

export interface CartItem {
  id: string; // combination of productId and size e.g. "titan-aura-30ml"
  productId: string;
  name: string;
  size: '30ml' | '50ml' | 'Bundle' | 'Discovery Set';
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

export type PaymentMethod = 'razorpay' | 'cod';
export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: OrderStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  shiprocketTrackingUrl?: string;
  estimatedDelivery?: string;
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}
