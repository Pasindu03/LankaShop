"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TestimonialCarousel from "@/components/home/testimonial-carousel"
import WhatsAppButton from "@/components/home/whatsapp-button"
import { getDocs, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Category {
  id: string
  name: string
}

// This metadata needs to be moved to a separate metadata.ts file for App Router
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Lanka Shop",
  description:
      "Authentic Sri Lankan products in the UK including Ayurvedic remedies, handicrafts, spices, and Ceylon tea.",
  url: "https://lankashop.co.uk",
  telephone: "+447850283839",
  address: {
    "@type": "PostalAddress",
    streetAddress: "29 Firswood Avenue",
    addressLocality: "Epsom",
    postalCode: "KT19 0PU",
    addressRegion: "London",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.363683,
    longitude: -0.256268,
  },
  openingHours: "Mo-Fr 09:00-17:00",
  priceRange: "££",
  image: "https://lankashop.co.uk/og-image.jpg",
  sameAs: [
    "https://www.facebook.com/lankashop",
    "https://www.instagram.com/lankashop",
    "https://twitter.com/lankashop",
  ],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lankashop.co.uk/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tea Enthusiast",
    content:
        "The Ceylon tea from Lanka Shop is absolutely divine! The authentic flavor takes me right back to my travels in Sri Lanka. Excellent quality and fast shipping.",
    avatar:
        "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Wellness Coach",
    content:
        "I've been using their Ayurvedic products for months now and have seen remarkable improvements in my clients' wellbeing. The quality is unmatched!",
    avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Interior Designer",
    content:
        "The handicrafts from Lanka Shop have become a staple in my design projects. Each piece tells a story and brings authentic Sri Lankan artistry to my clients' homes.",
    avatar:
        "https://images.pexels.com/photos/3866555/pexels-photo-3866555.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
  },
]

// Category images mapping
const categoryImages = {
  "Ayurvedic Products": "https://images.pexels.com/photos/8940745/pexels-photo-8940745.jpeg?height=400&width=400",
  Handicrafts:
      "https://images.pexels.com/photos/2113125/pexels-photo-2113125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  Spices:
      "https://images.pexels.com/photos/2632292/pexels-photo-2632292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "Ceylon Tea":
      "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  // Default image for other categories
  default: "/placeholder.svg?height=400&width=400",
}

// Category descriptions mapping
const categoryDescriptions = {
  "Ayurvedic Products": "Traditional healing remedies from Sri Lanka",
  Handicrafts: "Handmade crafts with traditional techniques",
  Spices: "Premium quality spices from Sri Lanka",
  "Ceylon Tea": "World-famous tea from the highlands of Sri Lanka",
  // Default description
  default: "Authentic Sri Lankan products",
}

// Category hover text mapping
const categoryHoverText = {
  "Ayurvedic Products": "Discover ancient wellness traditions",
  Handicrafts: "Handcrafted with generations of expertise",
  Spices: "Elevate your culinary creations",
  "Ceylon Tea": "Experience the world's finest tea",
  // Default hover text
  default: "Explore authentic Sri Lankan treasures",
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const keyId = "15cbcf57-9552-4be0-aa05-97a7ceffa5b3";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), orderBy("name", "asc"))
        const snap = await getDocs(q)
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          name: (doc.data() as any).name,
        }))
        setCategories(items)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load categories:", err)
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Function to get image URL for a category
  const getCategoryImage = (categoryName: string) => {
    return categoryImages[categoryName as keyof typeof categoryImages] || categoryImages.default
  }

  // Function to get description for a category
  const getCategoryDescription = (categoryName: string) => {
    return categoryDescriptions[categoryName as keyof typeof categoryDescriptions] || categoryDescriptions.default
  }

  // Function to get hover text for a category
  const getCategoryHoverText = (categoryName: string) => {
    return categoryHoverText[categoryName as keyof typeof categoryHoverText] || categoryHoverText.default
  }

  // Function to get URL slug for a category
  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, "-")
  }

  return (
      <main className="min-h-screen bg-white">
        <JsonLd data={structuredData} />
        <Navbar />
        <WhatsAppButton />

        {/* Hero Section - Enhanced with animated text and multiple CTAs */}
        <section className="w-full h-[calc(100vh-80px)] md:h-[600px] lg:h-[800px] relative">
          <Image
              src="https://img.freepik.com/premium-photo/close-up-abandoned-statue-by-leaves_1048944-11809102.jpg?w=900"
              alt="Authentic Sri Lankan products showcase - traditional statues and artifacts"
              fill
              priority
              sizes="100vw"
              className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-500 hover:bg-amber-600 text-white">Official UK Distributor</Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 text-center animate-fade-in">
                Discover Authentic Sri Lankan Treasures
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-center mb-4">
                Unique blends of ingredients and aromas from the heart of Sri Lanka
              </p>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-center mb-8">
                Authentic Sri Lankan exporter in the United Kingdom with official authorizations from Sri Lankan companies
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/categories/${keyId}`}>
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 px-8">
                    SHOP NOW
                  </Button>
                </Link>
                <Link href={"/conf/about"}>
                  <Button size="lg" variant="outline" className="text-black border-white hover:bg-black hover:text-white">
                    EXPLORE OUR STORY
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Why Choose Lanka Shop</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              We're committed to bringing you the finest products from Sri Lanka with authenticity and quality
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-amber-50 p-8 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Free Shipping</h3>
                <p className="text-gray-600 mt-2">
                  Enjoy complimentary delivery on all orders above £100, bringing Sri Lankan treasures to your doorstep.
                </p>
              </div>

              <div className="bg-amber-50 p-8 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">100% Payment Secured</h3>
                <p className="text-gray-600 mt-2">
                  Shop with confidence using our secure payment systems that protect your personal information.
                </p>
              </div>

              <div className="bg-amber-50 p-8 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Handpicked Treasures from Sri Lanka</h3>
                <p className="text-gray-600 mt-2">
                  Carefully selected authentic Sri Lankan products delivered directly to you from Epsom to your door steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Product Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Our Product Categories</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Explore our carefully curated selection of authentic Sri Lankan products, each telling a story of tradition
              and craftsmanship
            </p>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {categories.map((category) => {
                    // Determine which icon to use based on category name
                    let CategoryIcon
                    if (category.name.toLowerCase().includes("ayurvedic")) {
                      CategoryIcon = () => (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                          </svg>
                      )
                    } else if (category.name.toLowerCase().includes("handicraft")) {
                      CategoryIcon = () => (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
                          </svg>
                      )
                    } else if (category.name.toLowerCase().includes("spice")) {
                      CategoryIcon = () => (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                            <path d="M21 3v3a2 2 0 0 0 2 2h3"></path>
                            <path d="M3 21v-3a2 2 0 0 1 2-2h3"></path>
                            <path d="M21 21v-3a2 2 0 0 0-2-2h-3"></path>
                            <circle cx="12" cy="12" r="4"></circle>
                          </svg>
                      )
                    } else if (category.name.toLowerCase().includes("tea")) {
                      CategoryIcon = () => (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                            <line x1="6" y1="2" x2="6" y2="4"></line>
                            <line x1="10" y1="2" x2="10" y2="4"></line>
                            <line x1="14" y1="2" x2="14" y2="4"></line>
                          </svg>
                      )
                    } else {
                      CategoryIcon = () => (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                      )
                    }

                    // Generate a background color based on category name
                    const getBackgroundColor = (name) => {
                      if (name.toLowerCase().includes("ayurvedic")) return "from-green-50 to-green-100"
                      if (name.toLowerCase().includes("handicraft")) return "from-amber-50 to-amber-100"
                      if (name.toLowerCase().includes("spice")) return "from-red-50 to-red-100"
                      if (name.toLowerCase().includes("tea")) return "from-emerald-50 to-emerald-100"
                      return "from-amber-50 to-amber-100" // Default
                    }

                    // Generate accent color based on category name
                    const getAccentColor = (name) => {
                      if (name.toLowerCase().includes("ayurvedic")) return "text-green-600 border-green-200"
                      if (name.toLowerCase().includes("handicraft")) return "text-amber-600 border-amber-200"
                      if (name.toLowerCase().includes("spice")) return "text-red-600 border-red-200"
                      if (name.toLowerCase().includes("tea")) return "text-emerald-600 border-emerald-200"
                      return "text-amber-600 border-amber-200" // Default
                    }

                    return (
                        <div
                            key={category.id}
                            className={`rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getBackgroundColor(category.name)} border border-gray-100`}
                        >
                          <div className="p-6 flex flex-col flex-grow">
                            <div
                                className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${getAccentColor(category.name)} bg-white`}
                            >
                              <CategoryIcon />
                            </div>

                            <h3 className="text-xl font-medium mb-3">{category.name}</h3>

                            <div
                                className={`w-12 h-1 mb-4 ${getAccentColor(category.name).replace("text-", "bg-").split(" ")[0]}`}
                            ></div>

                            <p className="text-gray-600 mb-6 flex-grow">{getCategoryDescription(category.name)}</p>

                            <div className="mt-auto">
                              <Link
                                  href={`/categories/${category.id}`}
                                  className={`inline-flex items-center px-4 py-2 rounded-md border ${getAccentColor(category.name)} hover:bg-white transition-colors duration-300`}
                              >
                                Explore <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            </div>
                          </div>

                          {/* Decorative corner element */}
                          <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}>
                            <div
                                className={`absolute transform rotate-45 translate-x-8 -translate-y-8 w-16 h-16 ${getAccentColor(category.name).replace("text-", "bg-").split(" ")[0]} opacity-20`}
                            ></div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Don't just take our word for it - hear from our satisfied customers across the UK
            </p>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="mb-4 flex items-center">
                  <Image
                      src="/lankaShop.jpeg"
                      alt="Lanka Shop Logo"
                      width={80}
                      height={80}
                      className="object-contain bg-white rounded-lg p-2"
                  />
                </div>
                <p className="text-gray-400 mb-4">
                  Bringing authentic Sri Lankan treasures to the United Kingdom since 2018.
                </p>
                <div className="flex space-x-4">
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Facebook"
                      className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook size={20} />
                  </Link>
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Instagram"
                      className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Twitter"
                      className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Twitter size={20} />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/conf/about" className="text-gray-400 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/blog" className="text-gray-400 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/faq" className="text-gray-400 hover:text-white transition-colors">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/contact" className="text-gray-400 hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Categories</h3>
                <ul className="space-y-2">
                  {isLoading ? (
                      <li className="text-gray-400">Loading categories...</li>
                  ) : (
                      categories.slice(0, 6).map((category) => (
                          <li key={category.id}>
                            <Link
                                href={`/categories/${category.id}`}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                              {category.name}
                            </Link>
                          </li>
                      ))
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Contact Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <span className="text-gray-400">29 Firswood Avenue, Epsom, KT19 0PU, London</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400">+44 7850 283839</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-gray-400">info@lankashop.co.uk</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Lanka Shop. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-4 text-sm text-gray-400">
                  <li>
                    <Link href="/terms-and-conditions/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions/shipping" className="hover:text-white transition-colors">
                      Shipping Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
  )
}
