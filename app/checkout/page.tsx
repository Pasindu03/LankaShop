"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Navbar from "@/components/navbar"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function CheckoutPage() {
    const { cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    // Shipping cost calculation (simplified)
    const shippingCost = subtotal > 50 ? 0 : 4.99
    const totalCost = subtotal + shippingCost

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            // Call the API route to create a checkout session
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems,
                    subtotal, // Optionally send subtotal if needed
                }),
            })

            const data = await response.json()

            if (response.ok) {
                const stripe = await stripePromise
                if (!stripe) {
                    console.error("Stripe failed to initialize.")
                    setIsProcessing(false)
                    return
                }
                // Redirect to Stripe Checkout
                const { error } = await stripe.redirectToCheckout({
                    sessionId: data.sessionId,
                })
                if (error) {
                    console.error("Stripe error", error)
                    setIsProcessing(false)
                }
            } else {
                console.error("Error creating checkout session", data.error)
                setIsProcessing(false)
            }
        } catch (error) {
            console.error("Checkout error", error)
            setIsProcessing(false)
        }
    }

    if (cartItems.length === 0) {
        return (
            <main>
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven&apos;t added any products to your cart yet.
                        </p>
                        <Link
                            href="/"
                            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main>
            <Navbar />
            <div className="container mx-auto pt-28 px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items (Left Column) */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

                            <div className="divide-y">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="py-4 flex items-start">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="font-medium">
                                                    £{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                £{item.price.toFixed(2)} each
                                            </p>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        className="p-1 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="p-1 hover:bg-gray-100"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-sm text-red-500 hover:text-red-700 flex items-center"
                                                >
                                                    <Trash2 size={14} className="mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <Link
                                    href="/"
                                    className="text-black hover:underline flex items-center"
                                >
                                    <ArrowLeft size={16} className="mr-2" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary (Right Column) */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p>£{subtotal.toFixed(2)}</p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-gray-600">Shipping</p>
                                    <p>
                                        {shippingCost === 0
                                            ? "Free"
                                            : `£${shippingCost.toFixed(2)}`}
                                    </p>
                                </div>

                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-semibold">
                                        <p>Total</p>
                                        <p>£{totalCost.toFixed(2)}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                                </div>
                            </div>

                            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full bg-black text-white py-3 px-6 rounded flex items-center justify-center ${
                                        isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                                    }`}
                                >
                                    {isProcessing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <CreditCard size={18} className="mr-2" />
                                            Complete Order
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-4 text-xs text-gray-500">
                                <p>
                                    By completing your purchase, you agree to our Terms of Service
                                    and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
