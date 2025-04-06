// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Retrieve weight and count from the request body
            const { weight, count } = req.body;

            // Define your pricing rates (in pence)
            // For example, £10.00 per kg and £2.00 per item
            const pricePerKg = 1000;  // 1000 pence = £10.00
            const pricePerItem = 200; // 200 pence = £2.00

            // Calculate the total amount
            // Adjust the calculation as needed for your business logic
            const totalAmount = Math.round(weight * pricePerKg + count * pricePerItem);

            // Create a Checkout Session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'gbp',
                            product_data: {
                                name: 'Your Product Name',
                            },
                            // This amount is the total for the order (in pence)
                            unit_amount: totalAmount,
                        },
                        // Set quantity to 1 because totalAmount already reflects the full cost.
                        quantity: 1,
                    },
                ],
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cancel`,
            });

            res.status(200).json({ id: session.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
