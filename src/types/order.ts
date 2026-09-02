export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired';

export type PaymentMethod =
  | 'promptpay'
  | 'qr'
  | 'cod';

export interface OrderItem {
  bookId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  author?: string;
  condition?: string;
  originalPrice?: number;
}

export interface OrderShippingAddress {
  name: string;
  phone: string;
  address: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];

  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;

  shippingAddress: OrderShippingAddress;

  shippingMethod: string;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  status: OrderStatus;

  trackingNumber?: string;
  shippingCarrier?: string;

  createdAt: string;
  updatedAt: string;
}

export interface TrackingMilestone {
  step: number;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}
