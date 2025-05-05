export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  mainCategory: "ayurvedic" | "handicraft" | "spices" | "tea";
  rating: number;
  reviews: number;
  date: string;
  description: string;
};

export interface OrderProduct {
  metadata?: any;
  name: string;
  price: string;
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  orderId: string;
  paymentProvider: string;
  paymentStatus: string;
  products: OrderProduct[];
  shippingAddressId: string;
  stripeSessionId: string;
  subtotal: string;
  totalAmount: string;
  userId: string;
}
