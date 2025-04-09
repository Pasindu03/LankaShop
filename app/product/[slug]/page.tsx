"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Minus, Plus, ShoppingBag, Star, StarHalf } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import { ayurvedicProducts, handicraftProducts, spicesProducts, teaProducts } from "@/data/products"
import type { Product } from "@/types/product"
import Navbar from "@/components/navbar"
import { useCart } from "@/context/cart-context"

// Helper function to get category name from product
const getCategoryInfo = (product: Product) => {
    const categoryMap: Record<string, { name: string; path: string }> = {
        herbs: { name: "Ayurvedic", path: "/ayurveda" },
        oils: { name: "Ayurvedic", path: "/ayurveda" },
        supplements: { name: "Ayurvedic", path: "/ayurveda" },
        skincare: { name: "Ayurvedic", path: "/ayurveda" },
        masks: { name: "Handicraft", path: "/handicraft" },
        textiles: { name: "Handicraft", path: "/handicraft" },
        woodwork: { name: "Handicraft", path: "/handicraft" },
        jewelry: { name: "Handicraft", path: "/handicraft" },
        cinnamon: { name: "Spices", path: "/spices" },
        cardamom: { name: "Spices", path: "/spices" },
        cloves: { name: "Spices", path: "/spices" },
        pepper: { name: "Spices", path: "/spices" },
        black: { name: "Ceylon Tea", path: "/tea" },
        green: { name: "Ceylon Tea", path: "/tea" },
        white: { name: "Ceylon Tea", path: "/tea" },
        herbal: { name: "Ceylon Tea", path: "/tea" },
    }

    return categoryMap[product.category] || { name: "Products", path: "/" }
}

export default function ProductPage() {
    const { slug } = useParams()
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()

    // Combine all products to find the one with matching slug
    const allProducts = [...ayurvedicProducts, ...handicraftProducts, ...spicesProducts, ...teaProducts]

    const product = allProducts.find((p) => p.id === slug)

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
            </div>
        )
    }

    const categoryInfo = getCategoryInfo(product)

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1)
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1)
        }
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image || "/placeholder.svg",
            category: product.category,
        })

        // You can add a toast notification here if you have a toast library
        // toast.success(`Added ${quantity} ${product.name} to cart`)
    }

    // Render star ratings
    const renderRating = (rating: number) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`star-${i}`} className="fill-current text-yellow-400" size={16} />)
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half-star" className="fill-current text-yellow-400" size={16} />)
        }

        const emptyStars = 5 - stars.length
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={16} />)
        }

        return stars
    }

    return (
        <main>
            <Navbar />
            <div className="container mx-auto pt-7 px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: categoryInfo.name, href: categoryInfo.path },
                            { label: product.name, href: `/product/${product.id}`, isCurrent: true },
                        ]}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Product Image */}
                    <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

                        <div className="flex items-center mt-2 mb-4">
                            <div className="flex mr-2">{renderRating(product.rating)}</div>
                            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                        </div>

                        <div className="text-2xl font-bold mb-6">£{product.price.toFixed(2)}</div>

                        <p className="text-gray-600 mb-8">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center">
                                <button
                                    onClick={decrementQuantity}
                                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                                >
                                    <Minus size={16} />
                                </button>
                                <div className="px-4 py-2 border-t border-b border-gray-300 min-w-[50px] text-center">{quantity}</div>
                                <button
                                    onClick={incrementQuantity}
                                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            <ShoppingBag size={20} className="mr-2" />
                            Add to Cart
                        </button>

                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li>Authentic Sri Lankan product</li>
                                <li>Premium quality</li>
                                <li>Ethically sourced</li>
                                <li>Ships from UK warehouse</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
