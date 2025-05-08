"use client"

import {
  useState,
  useEffect,
  type JSXElementConstructor,
  type Key,
  type PromiseLikeOfReactNode,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Minus, Plus, ShoppingBag, Package, ChevronLeft, ChevronRight, Scale } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import Navbar from "@/components/navbar"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types/product"
import { getProduct } from "@/lib/services/productService"
import { getCategoryById } from "@/lib/services/categoryService"

type CategoryMeta = {
  id: string
  name: string
  heroImage?: string
  description?: string
}

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<CategoryMeta | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!slug) return
    async function fetchData() {
      try {
        const prod = await getProduct(Array.isArray(slug) ? slug[0] : slug)
        if (!prod) {
          setProduct(null)
          return
        }
        setProduct(prod)

        const cat = await getCategoryById(prod.categoryId)
        if (cat) setCategory(cat)
      } catch (err) {
        console.error("Error loading product page:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading…</p>
        </div>
    )
  }
  if (!product) {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>This product does not exist.</p>
        </div>
    )
  }

  const increment = () => setQuantity((q) => q + 1)
  const decrement = () => setQuantity((q) => Math.max(1, q - 1))

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price),
      quantity,
      image: getProductImages()[0] || "/placeholder.svg",
      category: category?.name || "Uncategorized",
    })
    setQuantity(1)
  }

  // Get all product images
  const getProductImages = () => {
    const images = []
    if ((product as any).image) images.push((product as any).image)
    if ((product as any).image1) images.push((product as any).image1)
    if ((product as any).image2) images.push((product as any).image2)
    if ((product as any).image3) images.push((product as any).image3)
    if (images.length === 0) images.push("/placeholder.svg")
    return images.filter(Boolean) // Remove any undefined or null values
  }

  // Format weight with unit
  const formatWeight = () => {
    const weight = (product as any).weight
    const unit = (product as any).weightUnit || "g"

    if (!weight) return null
    return `${weight} ${unit}`
  }

  const productImages = getProductImages()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: category?.name || "Products",
      href: `/categories/${product.categoryId ?? ""}`,
    },
    {
      label: product.name,
      href: `/product/${product.id}`,
      isCurrent: true,
    },
  ]

  return (
      <main>
        <Navbar />
        <div className="container mx-auto pt-28 px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <Image
                    src={productImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
                {productImages.length > 1 && (
                    <>
                      <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity"
                          aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity"
                          aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => selectImage(idx)}
                            className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                                currentImageIndex === idx ? "border-black" : "border-transparent"
                            }`}
                        >
                          <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                  </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="text-2xl font-bold mb-2">£{Number.parseFloat(product.price).toFixed(2)}</div>

              {/* Stock and Weight Information */}
              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex items-center">
                  <Package size={18} className="mr-2" />
                  {Number.parseInt((product as any).stock) > 0 ? (
                      <span className="text-green-600 font-medium">{(product as any).stock} in stock</span>
                  ) : (
                      <span className="text-red-500 font-medium">Out of stock</span>
                  )}
                </div>

                {formatWeight() && (
                    <div className="flex items-center">
                      <Scale size={18} className="mr-2" />
                      <span className="font-medium">{formatWeight()}</span>
                    </div>
                )}
              </div>

              <p className="text-gray-600 mb-8">{product.description}</p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                      onClick={decrement}
                      className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                      aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="px-4 py-2 border-t border-b border-gray-300 min-w-[50px] text-center">{quantity}</div>
                  <button
                      onClick={increment}
                      className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                      aria-label="Increase quantity"
                      disabled={quantity >= Number.parseInt((product as any).stock)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={Number.parseInt((product as any).stock) <= 0}
              >
                <ShoppingBag size={20} className="mr-2" />
                {Number.parseInt((product as any).stock) > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              {/* Extra Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {product.productDetails?.map(
                      (
                          line:
                              | string
                              | number
                              | boolean
                              | ReactElement<any, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | ReactPortal
                              | PromiseLikeOfReactNode
                              | null
                              | undefined,
                          i: Key | null | undefined,
                      ) => <li key={i}>{line}</li>,
                  ) || (
                      <>
                        <li>Authentic Sri Lankan product</li>
                        <li>Premium quality</li>
                        <li>Ethically sourced</li>
                        <li>Ships from UK warehouse</li>
                      </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
  )
}
