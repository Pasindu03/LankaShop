// components/CheckoutButton.js
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = () => {
    const handleCheckout = async () => {
        // Create a checkout session on your server
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
        });
        const session = await response.json();

        // Redirect to the Stripe hosted checkout page
        const stripe = await stripePromise;
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
