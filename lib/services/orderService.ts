import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  paymentProvider: string;
  paymentStatus: string;
  products: Array<{
    name: string;
    price: string;
    productId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  stripeSessionId: string;
  subtotal: string;
  totalAmount: string;
  userId: string;
  createdAt?: any;
}

export async function createOrderWithStockUpdate(order: Order) {
  await runTransaction(db, async (tx) => {
    const orderRef = doc(db, "orders", order.stripeSessionId);
    const orderSnap = await tx.get(orderRef);

    if (orderSnap.exists()) {
      return;
    }

    const agg: Record<string, number> = {};
    for (const { productId, quantity } of order.products) {
      agg[productId] = (agg[productId] || 0) + quantity;
    }

    const pids = Object.keys(agg);
    const productRefs = pids.map((id) => doc(db, "products", id));

    const snaps = await Promise.all(productRefs.map((r) => tx.get(r)));

    snaps.forEach((snap, i) => {
      const pid = pids[i];
      const qty = agg[pid];

      if (!snap.exists()) {
        throw new Error(`Product ${pid} not found`);
      }
      const current = Number(snap.data().stock ?? "0");
      const next = current - qty;
      if (next < 0) {
        throw new Error(
          `Insufficient stock for ${pid}: have ${current}, need ${qty}`
        );
      }

      tx.update(productRefs[i], { stock: next.toString() });
    });

    tx.set(orderRef, {
      ...order,
      createdAt: serverTimestamp(),
    });
  });
}
