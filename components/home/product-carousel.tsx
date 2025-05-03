"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  badge?: string
}

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMobile()
  const itemsPerPage = isMobile ? 1 : 4
  const totalPages = Math.ceil(products.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1))
  }

  const visibleProducts = products.slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage)

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous products</span>
        </Button>

        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / totalPages)}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2">
                <Link href={`/product/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && <Badge className="absolute top-2 right-2 bg-amber-500">{product.badge}</Badge>}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold">£{product.price}</p>
                      <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next products</span>
        </Button>
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-amber-500" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
