// components/product-page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingCart,
  Star,
  StarHalf,
  X,
} from "lucide-react";
import type { Product } from "@/types/product";
import Breadcrumb from "./breadcrumb";

type Category = {
  id: string;
  name: string;
};

type ProductPageProps = {
  title: string;
  description: string;
  products: Product[];
  categories: Category[];
  heroImage?: string;
};

export default function ProductPage({
  title,
  description,
  products,
  categories,
  heroImage,
}: ProductPageProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  const productsPerPage = 8;

  useEffect(() => {
    let result = [...products];

    result = result.filter((product) => {
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedCategories.length) {
      result = result.filter((product) =>
        selectedCategories.includes(product.subcategoryId)
      );
    }

    if (selectedRating !== null) {
      result = result.filter((product) => product.rating >= selectedRating);
    }

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, priceRange, selectedCategories, selectedRating, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCategories([]);
    setSelectedRating(null);
    setSortOption("featured");
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="fill-current text-yellow-400"
          size={16}
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="fill-current text-yellow-400"
          size={16}
        />
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-gray-300" size={16} />
      );
    }
    return stars;
  };

  const getBreadcrumbPath = () => {
    const map: Record<string, string> = {};
    return map[title] || "/";
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="w-full h-96 md:h-96 relative">
          <Image
            src={heroImage || "/placeholder.svg?height=800&width=1920"}
            alt={`${title} hero`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 pt-20 flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-4xl font-serif text-white">
              {title}
            </h1>
            <p className="text-gray-200 mt-2 text-center">{description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile: Filter toggle + sort dropdown */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md"
            >
              <Filter size={18} />
              Filters
            </button>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronRight
                className="absolute right-2 top-1/2 transform -translate-y-1/2 -rotate-90"
                size={16}
              />
            </div>
          </div>

          {/* Desktop filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
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
                <h2 className="font-medium">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">
                    £{priceRange[0]}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">
                    £{priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded text-black focus:ring-black"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="text-black focus:ring-black"
                      />
                      <div className="flex items-center">
                        {renderRating(rating)}
                        <span className="text-sm ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
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
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
              isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`fixed top-0 left-0 h-full w-80 max-w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-auto ${
                isFilterOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-medium text-lg">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Price */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">
                      £{priceRange[0]}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">
                      £{priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* Mobile Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="rounded text-black focus:ring-black"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Rating */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="text-black focus:ring-black"
                        />
                        <div className="flex items-center">
                          {renderRating(rating)}
                          <span className="text-sm ml-1">& Up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-8">
                  <button
                    onClick={resetFilters}
                    className="flex-1 border border-gray-300 py-2 rounded-md text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 bg-black text-white py-2 rounded-md text-sm"
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
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products match your filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-black text-white px-6 py-2 rounded-md text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md group"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative h-64">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={(e) => addToCart(product, e)}
                          className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center mt-1">
                          {renderRating(product.rating)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviews})
                          </span>
                        </div>
                        <p className="mt-2 font-medium">
                          £{parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
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
  );
}
