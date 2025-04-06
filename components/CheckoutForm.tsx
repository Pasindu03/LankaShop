// components/CheckoutForm.js
import React, { useState } from 'react';

const CheckoutForm = () => {
    const [weight, setWeight] = useState('');
    const [count, setCount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the weight and count to the API
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weight: parseFloat(weight), count: parseInt(count, 10) }),
        });
        const session = await response.json();

        // Redirect to Stripe Checkout
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        if (error) console.error('Stripe Checkout error', error);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Weight (kg):</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} step="0.01" required />
            </div>
            <div>
                <label>Item Count:</label>
                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} required />
            </div>
            <button type="submit">Checkout</button>
        </form>
    );
};

export default CheckoutForm;
