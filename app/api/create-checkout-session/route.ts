import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in the environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {apiVersion: "2025-03-31.basil",});

export async function POST(request : any) {
    try {
        // Parse the incoming JSON request body
        const { cartItems, subtotal } = await request.json();

        // Map your cart items to Stripe's expected line items format
        const line_items = cartItems.map((item : any) => ({
            price_data: {
                currency: "GBP", // Adjust currency if needed
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get("origin")}/checkout`,
        });

        // Return the session ID in the response
        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err : any) {
        // Handle errors
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
