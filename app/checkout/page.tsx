"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Scale } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Navbar from "@/components/navbar"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function CheckoutPage() {
    const { cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    // Calculate total weight and shipping cost
    const { totalWeight, shippingCost, formattedWeight, shippingTier } = useMemo(() => {
        // Calculate total weight in grams for consistency
        let weightInGrams = 0

        cartItems.forEach((item) => {
            if (item.weight && item.weightUnit) {
                let itemWeightInGrams = item.weight

                // Convert to grams based on unit
                if (item.weightUnit === "kg") {
                    itemWeightInGrams *= 1000
                } else if (item.weightUnit === "mg") {
                    itemWeightInGrams /= 1000
                }

                weightInGrams += itemWeightInGrams * item.quantity
            }
        })

        // Determine shipping cost based on weight
        let cost = 0
        let tier = ""

        if (weightInGrams <= 0) {
            // If no weight data or cart is empty
            cost = subtotal > 50 ? 0 : 4.99
            tier = "default"
        } else if (weightInGrams <= 500) {
            cost = 5.0
            tier = "tier1"
        } else if (weightInGrams <= 1750) {
            cost = 4.25
            tier = "tier2"
        } else if (weightInGrams <= 3000) {
            cost = 7.0
            tier = "tier3"
        } else if (weightInGrams <= 5000) {
            cost = 4.0
            tier = "tier4"
        } else {
            cost = 0 // Free shipping for over 5kg
            tier = "tier5"
        }

        // Format weight for display
        let formattedWeight = ""
        if (weightInGrams === 0) {
            formattedWeight = "N/A"
        } else if (weightInGrams < 1000) {
            formattedWeight = `${weightInGrams.toFixed(2)}g`
        } else {
            formattedWeight = `${(weightInGrams / 1000).toFixed(2)}kg`
        }

        return { totalWeight: weightInGrams, shippingCost: cost, formattedWeight, shippingTier: tier }
    }, [cartItems, subtotal])

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
                    subtotal,
                    shippingCost,
                    totalWeight,
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
                <div className="container mx-auto px-4 pt-20 py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
                        <Link href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    // Helper function to get shipping tier description
    const getShippingDescription = () => {
        switch (shippingTier) {
            case "tier1":
                return "Up to 500g: £5.00"
            case "tier2":
                return "500g to 1.75kg: £4.25"
            case "tier3":
                return "1.75kg to 3kg: £7.00"
            case "tier4":
                return "3kg to 5kg: £4.00"
            case "tier5":
                return "Above 5kg: Free"
            default:
                return shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`
        }
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
                                            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                        </div>

                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">£{item.price.toFixed(2)} each</p>

                                            {item.weight && item.weightUnit && (
                                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <Scale size={14} className="mr-1" />
                                                    {item.weight} {item.weightUnit} × {item.quantity}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                                <Link href="/" className="text-black hover:underline flex items-center">
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

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600">Shipping</p>
                                        {totalWeight > 0 && (
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                <Scale size={12} className="mr-1" />
                                                {formattedWeight}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p>{shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`}</p>
                                        <p className="text-xs text-gray-500 mt-1">{getShippingDescription()}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-semibold">
                                        <p>Total</p>
                                        <p>£{totalCost.toFixed(2)}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
                                <h3 className="font-medium mb-1">Shipping Cost Breakdown:</h3>
                                <ul className="space-y-1">
                                    <li className={shippingTier === "tier1" ? "font-medium" : ""}>• Up to 500g: £5.00</li>
                                    <li className={shippingTier === "tier2" ? "font-medium" : ""}>• 500g to 1.75kg: £4.25</li>
                                    <li className={shippingTier === "tier3" ? "font-medium" : ""}>• 1.75kg to 3kg: £7.00</li>
                                    <li className={shippingTier === "tier4" ? "font-medium" : ""}>• 3kg to 5kg: £4.00</li>
                                    <li className={shippingTier === "tier5" ? "font-medium" : ""}>• Above 5kg: Free</li>
                                </ul>
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
                                <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
