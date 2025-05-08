import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  try {
    // Pull shippingCost (and cartItems) from the client
    const { cartItems, shippingCost } = await request.json();

    // Build your product line items
    const itemLineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "GBP",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
          metadata: {
            localProductId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as its own line-item
    const shippingLineItem = {
      price_data: {
        currency: "GBP",
        product_data: {
          name: "Shipping",
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [...itemLineItems, shippingLineItem],
      mode: "payment",
      success_url: `${request.headers.get(
          "origin"
      )}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
