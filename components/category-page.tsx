"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Filter, Plus, X, Package, Scale } from 'lucide-react'
import { Range, getTrackBackground } from "react-range"
import type { Product } from "@/types/product"
import Breadcrumb from "./breadcrumb"
import { useCart } from "@/context/cart-context"
import { motion } from "framer-motion"

type Category = {
  id: string
  name: string
}

type ProductPageProps = {
  title: string
  description: string
  products: Product[]
  categories: Category[]
  heroImage?: string
}

// Sri Lankan patterns for backgrounds
const patterns = [
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23815c3d' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23815c3d' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
]

export default function CategoryPage({ title, description, products, categories, heroImage }: ProductPageProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<string>("featured")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [pattern, setPattern] = useState(patterns[0])

  const productsPerPage = 8

  useEffect(() => {
    // Randomly select a pattern for the background
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
    setPattern(randomPattern)
  }, [])

  // Re-filter & sort whenever inputs change
  useEffect(() => {
    let result = [...products]

    // price filter
    result = result.filter((p) => {
      const price = Number.parseFloat(p.price as unknown as string)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // category filter
    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes((p as any).subcategoryId))
    }

    // sorting
    switch (sortOption) {
      case "price-low":
        result.sort(
            (a, b) => Number.parseFloat(a.price as unknown as string) - Number.parseFloat(b.price as unknown as string)
        )
        break
      case "price-high":
        result.sort(
            (a, b) => Number.parseFloat(b.price as unknown as string) - Number.parseFloat(a.price as unknown as string)
        )
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      default:
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, priceRange, selectedCategories, sortOption])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
        prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const resetFilters = () => {
    setPriceRange([0, 100])
    setSelectedCategories([])
    setSortOption("featured")
  }

  const getBreadcrumbPath = () => {
    const map: Record<string, string> = {}
    return map[title] || "/"
  }

  // helper to look up category name from subcategoryId on product
  const getCategoryName = (product: Product) => {
    const cat = categories.find((c) => c.id === (product as any).subcategoryId)
    return cat?.name || "Uncategorized"
  }

  // Get the primary image for a product
  const getProductImage = (product: Product) => {
    return (product as any).image1 || (product as any).image || "/placeholder.svg"
  }

  const getWeight = (product: Product) => {
    return (product as any).weight || ""
  }

  const getWeightUnit = (products: Product) => {
    return (products as any).weightUnit || "g"
  }

  // Get all product images
  const getProductImages = (product: Product) => {
    const images = []
    if ((product as any).image) images.push((product as any).image)
    if ((product as any).image1) images.push((product as any).image1)
    if ((product as any).image2) images.push((product as any).image2)
    if ((product as any).image3) images.push((product as any).image3)
    return images.filter(Boolean)
  }

  // Format weight with unit
  const formatWeight = (product: Product) => {
    const weight = (product as any).weight
    const unit = (product as any).weightUnit || "g"

    if (!weight) return null
    return `${weight} ${unit}`
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price as unknown as string),
      quantity,
      image: getProductImage(product),
      category: getCategoryName(product),
      weight: getWeight(product),
      weightUnit: getWeightUnit(product),
    })
    setQuantity(1)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
      <div className="min-h-screen bg-[#1A1209] text-[#F5EFE0]">
        {/* Hero section */}
        <div className="relative">
          <div className="w-full h-96 md:h-96 relative">
            <Image
                src={heroImage || "/placeholder.svg?height=800&width=1920"}
                alt={`${title} hero`}
                fill
                className="object-cover brightness-75"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1209]/90 to-[#1A1209]/70 pt-20 flex flex-col justify-center items-center">
              <motion.h1
                  className="text-3xl md:text-4xl font-serif text-[#D9A566]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                {title}
              </motion.h1>
              <motion.p
                  className="text-[#F5EFE0]/80 mt-2 text-center max-w-2xl px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                {description}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile: Filter toggle + sort dropdown */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 bg-[#2A1A0A] border border-[#D9A566]/30 px-4 py-2 rounded-md text-[#F5EFE0]"
              >
                <Filter size={18} className="text-[#D9A566]" />
                Filters
              </button>
              <div className="relative">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-[#2A1A0A] border border-[#D9A566]/30 px-4 py-2 pr-8 rounded-md text-[#F5EFE0]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-[#D9A566]" size={16} />
              </div>
            </div>

            {/* Desktop filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-[#2A1A0A]/80 border border-[#D9A566]/30 rounded-lg p-4">
                <div className="mb-4">
                  <Breadcrumb
                      items={[
                        {
                          label: title,
                          href: getBreadcrumbPath(),
                          isCurrent: true,
                        },
                      ]}
                  />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-[#D9A566]">Filters</h2>
                  <button onClick={resetFilters} className="text-sm text-[#F5EFE0]/70 hover:text-[#D9A566]">
                    Reset
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 text-[#F5EFE0]">Price Range</h3>
                  <div className="flex justify-between text-sm text-[#F5EFE0]/70 mb-2">
                    <span>£{priceRange[0]}</span>
                    <span>£{priceRange[1]}</span>
                  </div>
                  <Range
                      values={priceRange}
                      step={1}
                      min={0}
                      max={100}
                      onChange={(values) => setPriceRange(values as [number, number])}
                      renderTrack={({ props, children }) => (
                          <div
                              {...props}
                              className="relative h-2 w-full rounded bg-[#1A1209]"
                              style={{
                                background: getTrackBackground({
                                  values: priceRange,
                                  colors: ["#1A1209", "#D9A566", "#1A1209"],
                                  min: 0,
                                  max: 100,
                                }),
                              }}
                          >
                            {children}
                          </div>
                      )}
                      renderThumb={({ props }) => (
                          <div {...props} className="h-4 w-4 rounded-full bg-[#D9A566] border border-[#1A1209] shadow-sm" />
                      )}
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 text-[#F5EFE0]">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.id)}
                              onChange={() => toggleCategory(cat.id)}
                              className="rounded text-[#D9A566] bg-[#1A1209] border-[#D9A566]/50 focus:ring-[#D9A566]/30"
                          />
                          <span className="text-sm text-[#F5EFE0]/90">{cat.name}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium mb-2 text-[#F5EFE0]">Sort By</h3>
                  <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full bg-[#1A1209] border border-[#D9A566]/30 rounded-md px-3 py-2 text-sm text-[#F5EFE0]"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Mobile Sidebar Filters */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity duration-300 md:hidden backdrop-blur-sm ${
                    isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <div
                  className={`fixed top-0 left-0 h-full w-80 max-w-full bg-[#2A1A0A] shadow-lg transform transition-transform duration-300 ease-in-out overflow-auto ${
                      isFilterOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-medium text-lg text-[#D9A566]">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <X size={20} className="text-[#D9A566]" />
                    </button>
                  </div>

                  {/* Mobile Price Range */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-[#F5EFE0]">Price Range</h3>
                    <div className="flex justify-between text-sm text-[#F5EFE0]/70 mb-2">
                      <span>£{priceRange[0]}</span>
                      <span>£{priceRange[1]}</span>
                    </div>
                    <Range
                        values={priceRange}
                        step={1}
                        min={0}
                        max={100}
                        onChange={(values) => setPriceRange(values as [number, number])}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                className="relative h-2 w-full rounded bg-[#1A1209]"
                                style={{
                                  background: getTrackBackground({
                                    values: priceRange,
                                    colors: ["#1A1209", "#D9A566", "#1A1209"],
                                    min: 0,
                                    max: 100,
                                  }),
                                }}
                            >
                              {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div {...props} className="h-4 w-4 rounded-full bg-[#D9A566] border border-[#1A1209] shadow-sm" />
                        )}
                    />
                  </div>

                  {/* Mobile Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-[#F5EFE0]">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                                className="rounded text-[#D9A566] bg-[#1A1209] border-[#D9A566]/50 focus:ring-[#D9A566]/30"
                            />
                            <span className="text-sm text-[#F5EFE0]/90">{cat.name}</span>
                          </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-8">
                    <button
                        onClick={resetFilters}
                        className="flex-1 border border-[#D9A566]/30 py-2 rounded-md text-sm text-[#F5EFE0]"
                    >
                      Reset
                    </button>
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 bg-[#8D3F2D] text-[#F5EFE0] py-2 rounded-md text-sm hover:bg-[#C14D33] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <section className="flex-1">
              <div className="mb-6">
                <p className="text-sm text-[#F5EFE0]/70">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              {currentProducts.length === 0 ? (
                  <div className="text-center py-12 bg-[#2A1A0A]/50 rounded-lg border border-[#D9A566]/20">
                    <p className="text-[#F5EFE0]/70">No products match your filters.</p>
                    <button
                        onClick={resetFilters}
                        className="mt-4 bg-[#8D3F2D] text-[#F5EFE0] px-6 py-2 rounded-md text-sm hover:bg-[#C14D33] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
              ) : (
                  <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                  >
                    {currentProducts.map((product, index) => (
                        <Link href={`/product/${product.id}`}>
                          <motion.div
                              key={product.id}
                              className="bg-[#2A1A0A]/80 border border-[#D9A566]/20 rounded-lg overflow-hidden hover:shadow-md group"
                              variants={itemVariant}
                              whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <div className="relative h-64">
                              <Image
                                  src={getProductImage(product) || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1209]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <button
                                  onClick={() => handleAddToCart(product)}
                                  className="absolute bottom-3 right-3 bg-[#8D3F2D] text-[#F5EFE0] p-2 rounded-full transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                  aria-label="Add to cart"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-[#F5EFE0] group-hover:text-[#D9A566] transition-colors">{product.name}</h3>
                              <div className="flex justify-between items-center mt-2">
                                <p className="font-medium text-[#D9A566]">
                                  £{Number.parseFloat(product.price as unknown as string).toFixed(2)}
                                </p>
                                <div className="flex items-center text-sm">
                                  <Package size={14} className="mr-1 text-[#F5EFE0]/70" />
                                  {Number.parseInt((product as any).stock) > 0 ? (
                                      <span className="text-[#2D5E3D]">{(product as any).stock} in stock</span>
                                  ) : (
                                      <span className="text-[#C14D33]">Out of stock</span>
                                  )}
                                </div>
                              </div>

                              {formatWeight(product) && (
                                  <div className="flex items-center mt-1 text-sm text-[#F5EFE0]/70">
                                    <Scale size={14} className="mr-1" />
                                    <span>{formatWeight(product)}</span>
                                  </div>
                              )}
                            </div>
                          </motion.div>
                        </Link>
                    ))}
                  </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                            currentPage === 1
                                ? "text-[#F5EFE0]/30 cursor-not-allowed"
                                : "text-[#F5EFE0] hover:bg-[#2A1A0A] hover:text-[#D9A566]"
                        }`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-md ${
                                currentPage === page
                                    ? "bg-[#8D3F2D] text-[#F5EFE0]"
                                    : "text-[#F5EFE0] hover:bg-[#2A1A0A] hover:text-[#D9A566]"
                            }`}
                        >
                          {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                            currentPage === totalPages
                                ? "text-[#F5EFE0]/30 cursor-not-allowed"
                                : "text-[#F5EFE0] hover:bg-[#2A1A0A] hover:text-[#D9A566]"
                        }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
              )}
            </section>
          </div>
        </div>
      </div>
  )
}
