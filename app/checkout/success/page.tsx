"use client"

import Link from "next/link"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Navbar from "@/components/navbar"

export default function CheckoutSuccessPage() {
    return (
        <main>
            <Navbar />
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                        <CheckCircle size={64} className="text-green-500" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Order Confirmed!</h1>

                    <p className="text-gray-600 mb-8">
                        Thank you for your purchase. We've received your order and will begin processing it right away. You'll
                        receive an email confirmation shortly.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <h2 className="font-semibold mb-2">What happens next?</h2>
                        <p className="text-gray-600 text-sm">
                            Your order will be processed and shipped within 1-3 business days. You'll receive tracking information
                            once your package is on its way.
                        </p>
                    </div>

                    <Link href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-flex items-center">
                        <ShoppingBag size={18} className="mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    )
}
