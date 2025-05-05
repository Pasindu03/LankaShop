import { NextResponse } from "next/server";
import { createOrderWithStockUpdate, Order } from "@/lib/services/orderService";

export async function POST(request: Request) {
  try {
    const order = (await request.json()) as Order;

    const {
      stripeSessionId,
      paymentProvider,
      paymentStatus,
      products,
      shippingAddressId,
      subtotal,
      totalAmount,
      userId,
      orderId,
    } = order;

    if (
      !stripeSessionId ||
      !paymentProvider ||
      !paymentStatus ||
      !Array.isArray(products) ||
      !shippingAddressId ||
      !subtotal ||
      !totalAmount ||
      !userId ||
      !orderId
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    await createOrderWithStockUpdate(order);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Failed to process order:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
