'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Stripe from 'stripe'

export default function CheckoutSuccessPage() {
    const params = useSearchParams()
    const sessionId = params.get('session_id')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!sessionId) return

            ;(async () => {
            try {
                const stripeRes = await fetch(
                    `/api/stripe-session?session_id=${sessionId}`
                )
                const session = await stripeRes.json()
                if (stripeRes.ok && session.line_items) {
                    // 2) Build our Order payload
                    const lineItems = session.line_items.data.map(
                        (li: {
                            price: { product: Stripe.Product; unit_amount: number }
                            quantity: number
                        }) => {
                            const product = li.price.product as Stripe.Product
                            return {
                                name: product.name,
                                price: ((li.price.unit_amount ?? 0) / 100).toFixed(2),
                                productId: product.metadata.localProductId!,
                                quantity: li.quantity!,
                            }
                        }
                    )

                    const orderPayload = {
                        orderId: `ORD-${Date.now()}`,         // dynamic orderId
                        paymentProvider: 'stripe',
                        paymentStatus: session.payment_status, // e.g. "paid"
                        products: lineItems,
                        shippingAddressId:
                            session.customer_details?.address?.postal_code ?? 'unknown',
                        stripeSessionId: session.id,
                        subtotal: (session.amount_subtotal / 100).toFixed(2),
                        totalAmount: (session.amount_total / 100).toFixed(2),
                        userId: session.client_reference_id ?? 'guest',
                    }

                    // 3) Persist to Firestore
                    await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderPayload),
                    })

                    setSaved(true)
                } else {
                    console.error('Stripe session fetch error', session)
                }
            } catch (err) {
                console.error('Failed to save order', err)
            }
        })()
    }, [sessionId])

    return (
        <main>
            <Navbar />
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                        Order Confirmed!
                    </h1>
                    {saved ? (
                        <p className="text-gray-600 mb-8">
                            Thank you! Your order has been saved and is being processed.
                        </p>
                    ) : (
                        <p className="text-gray-600 mb-8">
                            Finalizing your order… please wait.
                        </p>
                    )}
                    <Link
                        href="/"
                        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-flex items-center"
                    >
                        <ShoppingBag size={18} className="mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    )
}
