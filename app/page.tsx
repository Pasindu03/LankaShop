"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ChevronRight } from 'lucide-react'
import Navbar from "@/components/navbar"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TestimonialCarousel from "@/components/home/testimonial-carousel"
import WhatsAppButton from "@/components/home/whatsapp-button"
import { getDocs, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

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

// Sri Lankan cultural patterns for backgrounds
const patterns = [
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23815c3d' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23815c3d' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23815c3d' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")"
]

// Sri Lankan color palette
const sriLankanColors = {
  primary: "#8D3F2D", // Deep terracotta red
  secondary: "#D9A566", // Golden amber
  accent: "#2D5E3D", // Forest green
  dark: "#2A1A0A", // Deep brown
  light: "#F5EFE0", // Warm cream
  highlight: "#C14D33", // Cinnamon
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const keyId = "15cbcf57-9552-4be0-aa05-97a7ceffa5b3"
  const { setTheme } = useTheme()
  const heroRef = useRef<HTMLDivElement>(null)
  const [pattern, setPattern] = useState(patterns[0])

  // Set theme to dark on component mount
  useEffect(() => {
    setTheme("dark")

    // Randomly select a pattern for the background
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
    setPattern(randomPattern)

    // Scroll event listener for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setTheme])

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  }

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
      <main className="min-h-screen bg-[#1A1209] text-[#F5EFE0]" style={{ backgroundImage: pattern }}>
        <JsonLd data={structuredData} />
        <Navbar />
        <WhatsAppButton />

        {/* Hero Section - Enhanced with animated text and multiple CTAs */}
        <section
            ref={heroRef}
            className="w-full h-[calc(100vh-80px)] md:h-[600px] lg:h-[800px] relative overflow-hidden"
        >
          <div
              className="absolute inset-0 z-0"
              style={{
                transform: `translateY(${scrollY * 0.4}px)`,
                transition: "transform 0.1s ease-out"
              }}
          >
            <Image
                src="https://img.freepik.com/premium-photo/close-up-abandoned-statue-by-leaves_1048944-11809102.jpg?w=900"
                alt="Authentic Sri Lankan products showcase - traditional statues and artifacts"
                fill
                priority
                sizes="100vw"
                className="object-cover brightness-75"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1209]/90 to-[#1A1209]/70 flex flex-col items-center justify-center text-[#F5EFE0] p-4 z-10">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <Badge className="mb-4 bg-[#D9A566] hover:bg-[#C89550] text-[#1A1209] font-medium">
                  Official UK Distributor
                </Badge>
              </motion.div>

              <motion.h1
                  className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 text-center"
                  variants={slideUp}
              >
                <span className="block text-[#D9A566]">Discover</span>
                <span className="relative inline-block">
                Authentic
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#8D3F2D]"></span>
              </span>
                <span className="block mt-2">Sri Lankan Treasures</span>
              </motion.h1>

              <motion.p
                  className="text-lg md:text-xl max-w-2xl mx-auto text-center mb-4 text-[#F5EFE0]/90"
                  variants={slideUp}
              >
                Unique blends of ingredients and aromas from the heart of Sri Lanka
              </motion.p>

              <motion.p
                  className="text-base md:text-lg max-w-2xl mx-auto text-center mb-8 text-[#F5EFE0]/80"
                  variants={slideUp}
              >
                Authentic Sri Lankan exporter in the United Kingdom with official authorizations from Sri Lankan companies
              </motion.p>

              <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  variants={slideUp}
              >
                <Link href={`/categories/${keyId}`}>
                  <Button
                      size="lg"
                      className="bg-[#8D3F2D] hover:bg-[#7A3526] text-[#F5EFE0] border-0 px-8 relative overflow-hidden group"
                  >
                    <span className="relative z-10">SHOP NOW</span>
                    <span className="absolute inset-0 bg-[#C14D33] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Button>
                </Link>
                <Link href={"/conf/about"}>
                  <Button
                      size="lg"
                      variant="outline"
                      className="bg-[#D9A566] border-[#D9A566] text-black hover:bg-[#D9A566]/20 hover:text-[#F5EFE0] relative overflow-hidden group"
                  >
                    <span className="relative z-10">EXPLORE OUR STORY</span>
                    <span className="absolute inset-0 bg-[#D9A566]/10 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#1A1209] to-transparent z-10"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#1A1209] to-transparent z-10"></div>
        </section>

        {/* Features Section with Sri Lankan-inspired design */}
        <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #1A1209, #2A1A0A)" }}>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
              <motion.h2
                  className="text-3xl font-serif text-center mb-4 text-[#D9A566]"
                  variants={slideUp}
              >
                Why Choose Lanka Shop
              </motion.h2>
              <motion.p
                  className="text-[#F5EFE0]/80 text-center max-w-2xl mx-auto mb-12"
                  variants={slideUp}
              >
                We're committed to bringing you the finest products from Sri Lanka with authenticity and quality
              </motion.p>

              <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
              >
                <motion.div
                    className="bg-[#2A1A0A]/80 border border-[#D9A566]/30 p-8 rounded-lg text-center relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="absolute inset-0 bg-[#D9A566]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="bg-[#8D3F2D]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#D9A566]"
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
                    <div className="absolute -inset-1 rounded-full border border-[#D9A566]/30 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-[#D9A566]">Free Shipping</h3>
                  <p className="text-[#F5EFE0]/70 mt-2">
                    Enjoy complimentary delivery on all orders above £100, bringing Sri Lankan treasures to your doorstep.
                  </p>
                </motion.div>

                <motion.div
                    className="bg-[#2A1A0A]/80 border border-[#D9A566]/30 p-8 rounded-lg text-center relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="absolute inset-0 bg-[#D9A566]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="bg-[#8D3F2D]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#D9A566]"
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
                    <div className="absolute -inset-1 rounded-full border border-[#D9A566]/30 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-[#D9A566]">100% Payment Secured</h3>
                  <p className="text-[#F5EFE0]/70 mt-2">
                    Shop with confidence using our secure payment systems that protect your personal information.
                  </p>
                </motion.div>

                <motion.div
                    className="bg-[#2A1A0A]/80 border border-[#D9A566]/30 p-8 rounded-lg text-center relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="absolute inset-0 bg-[#D9A566]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="bg-[#8D3F2D]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#D9A566]"
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
                    <div className="absolute -inset-1 rounded-full border border-[#D9A566]/30 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-[#D9A566]">Handpicked Treasures from Sri Lanka</h3>
                  <p className="text-[#F5EFE0]/70 mt-2">
                    Carefully selected authentic Sri Lankan products delivered directly to you from Epsom to your door steps.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-40 pointer-events-none opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
              <path fill="#D9A566" fillOpacity="0.3" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
        </section>

        {/* Dynamic Product Categories Section with Sri Lankan-inspired design */}
        <section className="py-16 relative" style={{ background: "linear-gradient(to bottom, #2A1A0A, #1A1209)" }}>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
              <motion.h2
                  className="text-3xl font-serif text-center mb-4 text-[#D9A566]"
                  variants={slideUp}
              >
                Our Product Categories
              </motion.h2>
              <motion.p
                  className="text-[#F5EFE0]/80 text-center max-w-2xl mx-auto mb-12"
                  variants={slideUp}
              >
                Explore our carefully curated selection of authentic Sri Lankan products, each telling a story of tradition
                and craftsmanship
              </motion.p>

              {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D9A566]"></div>
                  </div>
              ) : (
                  <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                      variants={staggerContainer}
                  >
                    {categories.map((category, index) => {
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

                      // Generate accent color based on category name
                      const getAccentColor = (name) => {
                        if (name.toLowerCase().includes("ayurvedic")) return "text-[#2D5E3D] border-[#2D5E3D]/30"
                        if (name.toLowerCase().includes("handicraft")) return "text-[#D9A566] border-[#D9A566]/30"
                        if (name.toLowerCase().includes("spice")) return "text-[#C14D33] border-[#C14D33]/30"
                        if (name.toLowerCase().includes("tea")) return "text-[#2D5E3D] border-[#2D5E3D]/30"
                        return "text-[#D9A566] border-[#D9A566]/30" // Default
                      }

                      return (
                          <motion.div
                              key={category.id}
                              className="rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl bg-[#2A1A0A]/80 border border-[#D9A566]/20 relative"
                              variants={fadeIn}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: index * 0.1 }}
                              whileHover={{
                                y: -10,
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.3 }
                              }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-[#D9A566]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-6 flex flex-col flex-grow relative z-10">
                              <div
                                  className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${getAccentColor(category.name)} bg-[#1A1209]/50 relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}
                              >
                                <CategoryIcon />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                              </div>

                              <h3 className="text-xl font-medium mb-3 text-[#D9A566]">{category.name}</h3>

                              <div
                                  className={`w-12 h-1 mb-4 ${getAccentColor(category.name).replace("text-", "bg-").split(" ")[0]}`}
                              ></div>

                              <p className="text-[#F5EFE0]/70 mb-6 flex-grow">{getCategoryDescription(category.name)}</p>

                              <div className="mt-auto">
                                <Link
                                    href={`/categories/${category.id}`}
                                    className={`inline-flex items-center px-4 py-2 rounded-md border ${getAccentColor(category.name)} hover:bg-[#1A1209]/30 transition-colors duration-300 group-hover:border-opacity-100`}
                                >
                                  Explore <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                              </div>
                            </div>

                            {/* Decorative corner element */}
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                              <div
                                  className={`absolute transform rotate-45 translate-x-8 -translate-y-8 w-16 h-16 ${getAccentColor(category.name).replace("text-", "bg-").split(" ")[0]} opacity-20`}
                              ></div>
                            </div>
                          </motion.div>
                      )
                    })}
                  </motion.div>
              )}
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
              <path fill="#8D3F2D" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Testimonials Section with Sri Lankan-inspired design */}
        <section className="py-16 relative bg-gradient-to-b from-[#1A1209] to-[#2A1A0A]">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
              <motion.h2
                  className="text-3xl font-serif text-center mb-4 text-[#D9A566] "
                  variants={slideUp}
              >
                What Our Customers Say
              </motion.h2>
              <motion.p
                  className="text-[#F5EFE0]/80 text-center max-w-2xl mx-auto mb-12"
                  variants={slideUp}
              >
                Don't just take our word for it - hear from our satisfied customers across the UK
              </motion.p>
              <motion.div variants={fadeIn}>
                <TestimonialCarousel testimonials={testimonials} />
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-5">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#D9A566" d="M47.1,-57.5C59.9,-47.3,68.7,-31.6,73.2,-14.2C77.7,3.2,77.9,22.3,69.2,35.8C60.5,49.3,42.8,57.2,25.3,63.1C7.8,69,-9.5,72.9,-27.4,69.3C-45.3,65.7,-63.8,54.5,-71.9,38.1C-80,21.7,-77.7,0,-70.4,-17.5C-63.1,-35,-50.8,-48.3,-36.8,-58C-22.8,-67.7,-7.1,-73.8,7.9,-73.1C22.9,-72.4,34.3,-67.8,47.1,-57.5Z" transform="translate(100 100)" />
            </svg>
          </div>
        </section>

        {/* Enhanced Footer with Sri Lankan-inspired design */}
        <footer className="bg-[#1A1209] text-[#F5EFE0]/90 py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: pattern }}></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <motion.div
                    className="mb-4 flex items-center gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <Image
                      src="/lankaShop.jpeg"
                      alt="Lanka Shop Logo"
                      width={80}
                      height={80}
                      className="object-contain bg-white rounded-lg p-2 hover:shadow-lg transition-shadow duration-300"
                  />
                </motion.div>
                <p className="text-[#F5EFE0]/70 mb-4">
                  Bringing authentic Sri Lankan treasures to the United Kingdom since 2018.
                </p>
                <div className="flex space-x-4">
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Facebook"
                      className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors"
                  >
                    <Facebook size={20} className="hover:scale-110 transition-transform duration-300" />
                  </Link>
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Instagram"
                      className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors"
                  >
                    <Instagram size={20} className="hover:scale-110 transition-transform duration-300" />
                  </Link>
                  <Link
                      href="#"
                      aria-label="Follow Lanka Shop on Twitter"
                      className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors"
                  >
                    <Twitter size={20} className="hover:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-[#D9A566]">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/conf/about" className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-px bg-[#D9A566]"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/blog" className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-px bg-[#D9A566]"></span>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/faq" className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-px bg-[#D9A566]"></span>
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/conf/contact" className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-px bg-[#D9A566]"></span>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-[#D9A566]">Categories</h3>
                <ul className="space-y-2">
                  {isLoading ? (
                      <li className="text-[#F5EFE0]/70">Loading categories...</li>
                  ) : (
                      categories.slice(0, 6).map((category) => (
                          <li key={category.id}>
                            <Link
                                href={`/categories/${category.id}`}
                                className="text-[#F5EFE0]/70 hover:text-[#D9A566] transition-colors flex items-center group"
                            >
                              <span className="w-0 group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 h-px bg-[#D9A566]"></span>
                              {category.name}
                            </Link>
                          </li>
                      ))
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-[#D9A566]">Contact Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-start group">
                    <MapPin className="h-5 w-5 text-[#D9A566] mr-2 mt-0.5 group-hover:animate-bounce" />
                    <span className="text-[#F5EFE0]/70 group-hover:text-[#F5EFE0] transition-colors">29 Firswood Avenue, Epsom, KT19 0PU, London</span>
                  </li>
                  <li className="flex items-center group">
                    <Phone className="h-5 w-5 text-[#D9A566] mr-2 group-hover:animate-bounce" />
                    <span className="text-[#F5EFE0]/70 group-hover:text-[#F5EFE0] transition-colors">+44 7850 283839</span>
                  </li>
                  <li className="flex items-center group">
                    <Mail className="h-5 w-5 text-[#D9A566] mr-2 group-hover:animate-bounce" />
                    <span className="text-[#F5EFE0]/70 group-hover:text-[#F5EFE0] transition-colors">info@lankashop.co.uk</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#D9A566]/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-[#F5EFE0]/70">© {new Date().getFullYear()} Lanka Shop. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-4 text-sm text-[#F5EFE0]/70">
                  <li>
                    <Link href="/terms-and-conditions/privacy" className="hover:text-[#D9A566] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions/terms" className="hover:text-[#D9A566] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions/shipping" className="hover:text-[#D9A566] transition-colors">
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
