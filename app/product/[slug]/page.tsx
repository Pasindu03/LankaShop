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
import { motion } from "framer-motion"

type CategoryMeta = {
  id: string
  name: string
  heroImage?: string
  description?: string
}

// Sri Lankan patterns for backgrounds
const patterns = [
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23815c3d' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23815c3d' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
]

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<CategoryMeta | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pattern, setPattern] = useState(patterns[0])

  useEffect(() => {
    // Randomly select a pattern for the background
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
    setPattern(randomPattern)

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
        <div
            className="min-h-screen bg-[#1A1209] text-[#F5EFE0] pt-28 flex items-center justify-center"
            style={{ backgroundImage: pattern }}
        >
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="w-16 h-16 border-4 border-[#D9A566] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-[#F5EFE0]/70">Loading product information...</p>
          </div>
        </div>
    )
  }

  if (!product) {
    return (
        <div className="min-h-screen bg-[#1A1209] text-[#F5EFE0] pt-28" style={{ backgroundImage: pattern }}>
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4 text-[#D9A566]">Product Not Found</h1>
            <p className="text-[#F5EFE0]/70">This product does not exist or has been removed.</p>
          </div>
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
      weight: product.weight,
      weightUnit: product.weightUnit,
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
      <main className="min-h-screen bg-[#1A1209] text-[#F5EFE0]">
        <Navbar />
        <div className="container mx-auto pt-28 px-4 py-8">
          {/* Breadcrumb */}
          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Breadcrumb items={breadcrumbItems} />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <motion.div className="space-y-4" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-[#D9A566]/20">
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
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#1A1209]/70 text-[#F5EFE0] rounded-full p-2 hover:bg-[#D9A566]/70 transition-colors"
                          aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1A1209]/70 text-[#F5EFE0] rounded-full p-2 hover:bg-[#D9A566]/70 transition-colors"
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
                            className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                                currentImageIndex === idx ? "border-[#D9A566]" : "border-[#D9A566]/30 hover:border-[#D9A566]/60"
                            }`}
                        >
                          <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                  </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div className="flex flex-col" initial="hidden" animate="visible" variants={slideUp}>
              <h1 className="text-2xl md:text-3xl font-bold text-[#D9A566]">{product.name}</h1>
              <div className="text-2xl font-bold mb-2 text-[#F5EFE0]">£{Number.parseFloat(product.price).toFixed(2)}</div>

              {/* Stock and Weight Information */}
              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex items-center">
                  <Package size={18} className="mr-2 text-[#D9A566]" />
                  {Number.parseInt((product as any).stock) > 0 ? (
                      <span className="text-[#2D5E3D] font-medium">{(product as any).stock} in stock</span>
                  ) : (
                      <span className="text-[#C14D33] font-medium">Out of stock</span>
                  )}
                </div>

                {formatWeight() && (
                    <div className="flex items-center">
                      <Scale size={18} className="mr-2 text-[#D9A566]" />
                      <span className="font-medium text-[#F5EFE0]/90">{formatWeight()}</span>
                    </div>
                )}
              </div>

              <p className="text-[#F5EFE0]/80 mb-8">{product.description}</p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#F5EFE0] mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                      onClick={decrement}
                      className="p-2 border border-[#D9A566]/30 rounded-l-md hover:bg-[#2A1A0A] text-[#F5EFE0]"
                      aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="px-4 py-2 border-t border-b border-[#D9A566]/30 min-w-[50px] text-center bg-[#2A1A0A]/50">
                    {quantity}
                  </div>
                  <button
                      onClick={increment}
                      className="p-2 border border-[#D9A566]/30 rounded-r-md hover:bg-[#2A1A0A] text-[#F5EFE0]"
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
                  className="flex items-center justify-center bg-[#8D3F2D] text-[#F5EFE0] py-3 px-6 rounded-md hover:bg-[#C14D33] transition-colors disabled:bg-[#2A1A0A] disabled:text-[#F5EFE0]/50 disabled:cursor-not-allowed group relative overflow-hidden"
                  disabled={Number.parseInt((product as any).stock) <= 0}
              >
                <span className="absolute inset-0 bg-[#D9A566]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <ShoppingBag size={20} className="mr-2 relative z-10" />
                <span className="relative z-10">
                {Number.parseInt((product as any).stock) > 0 ? "Add to Cart" : "Out of Stock"}
              </span>
              </button>

              {/* Extra Details */}
              <div className="mt-8 pt-8 border-t border-[#D9A566]/20">
                <h2 className="text-lg font-semibold mb-4 text-[#D9A566]">Product Details</h2>
                <ul className="list-disc pl-5 space-y-2 text-[#F5EFE0]/80">
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
            </motion.div>
          </div>
        </div>
      </main>
  )
}
