// components/CheckoutButton.tsx
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

// Make sure the env variable is defined before calling loadStripe
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.');
}

// loadStripe now receives a plain string
const stripePromise = loadStripe(publishableKey);

const CheckoutButton = () => {
    const handleCheckout = async () => {
        // Create a checkout session
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
        });
        const session = await response.json();

        // Get the stripe object
        const stripe = await stripePromise;
        if (!stripe) {
            console.error('Stripe failed to initialize.');
            return;
        }

        // Now stripe is guaranteed not to be null
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (error) {
            console.error('Stripe Checkout error', error);
        }
    };

    return (
        <button onClick={handleCheckout}>
            Checkout
        </button>
    );
};

export default CheckoutButton;
