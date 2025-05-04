import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Search, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import TestimonialCarousel from "@/components/home/testimonial-carousel"
import ProductCarousel from "@/components/home/product-carousel"
import NewsletterSignup from "@/components/home/newsletter-signup"
import WhatsAppButton from "@/components/home/whatsapp-button"

export const metadata = {
  title: "Authentic Sri Lankan Products in the UK | Lanka Shop",
  description:
      "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea. Official UK distributor with Sri Lankan authorizations.",
  alternates: {
    canonical: "https://lankashop.co.uk",
  },
  openGraph: {
    title: "Authentic Sri Lankan Products in the UK | Lanka Shop",
    description:
        "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea.",
    url: "https://lankashop.co.uk",
    siteName: "Lanka Shop",
    images: [
      {
        url: "https://lankashop.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lanka Shop - Authentic Sri Lankan Products",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentic Sri Lankan Products in the UK | Lanka Shop",
    description:
        "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea.",
    images: ["https://lankashop.co.uk/og-image.jpg"],
  },
}

export default function Home() {
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
      avatar: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Wellness Coach",
      content:
          "I've been using their Ayurvedic products for months now and have seen remarkable improvements in my clients' wellbeing. The quality is unmatched!",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Interior Designer",
      content:
          "The handicrafts from Lanka Shop have become a staple in my design projects. Each piece tells a story and brings authentic Sri Lankan artistry to my clients' homes.",
      avatar: "https://images.pexels.com/photos/3866555/pexels-photo-3866555.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
  ]

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
                <Link href={"/handicraft"} >
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 px-8">
                    SHOP NOW
                  </Button>
                </Link>
                <Link href={"/about"} >
                  <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
                    EXPLORE OUR STORY
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Authentic Products</h3>
                <p className="text-gray-600">
                  We source directly from Sri Lanka with official authorizations, ensuring authenticity and quality.
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
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Ethical Sourcing</h3>
                <p className="text-gray-600">
                  We work with local artisans and farmers, ensuring fair compensation and sustainable practices.
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Fast UK Shipping</h3>
                <p className="text-gray-600">
                  We maintain inventory in the UK, allowing for quick delivery throughout the United Kingdom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Section - Enhanced with hover effects */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-4">Our Product Categories</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Explore our carefully curated selection of authentic Sri Lankan products, each telling a story of tradition
              and craftsmanship
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Category 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                      src="https://images.pexels.com/photos/8940745/pexels-photo-8940745.jpeg?height=400&width=400"
                      alt="Ayurvedic Products from Sri Lanka - natural remedies and wellness items"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Discover ancient wellness traditions</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2">Ayurvedic Products</h3>
                  <p className="text-gray-600 mb-4 flex-grow">Traditional healing remedies from Sri Lanka</p>
                  <Link href="/ayurveda" className="text-amber-600 font-medium hover:text-amber-700 flex items-center">
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Category 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                      src="https://images.pexels.com/photos/2113125/pexels-photo-2113125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Sri Lankan Handicrafts - handmade traditional crafts and decorative items"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Handcrafted with generations of expertise</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2">Handicrafts</h3>
                  <p className="text-gray-600 mb-4 flex-grow">Handmade crafts with traditional techniques</p>
                  <Link href="/handicraft" className="text-amber-600 font-medium hover:text-amber-700 flex items-center">
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Category 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                      src="https://images.pexels.com/photos/2632292/pexels-photo-2632292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Premium Sri Lankan Spices - authentic spices and seasonings"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Elevate your culinary creations</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2">Spices</h3>
                  <p className="text-gray-600 mb-4 flex-grow">Premium quality spices from Sri Lanka</p>
                  <Link href="/spices" className="text-amber-600 font-medium hover:text-amber-700 flex items-center">
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Category 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <Image
                      src="https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Ceylon Tea from Sri Lanka - premium tea varieties from the highlands"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Experience the world's finest tea</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2">Ceylon Tea</h3>
                  <p className="text-gray-600 mb-4 flex-grow">World-famous tea from the highlands of Sri Lanka</p>
                  <Link href="/tea" className="text-amber-600 font-medium hover:text-amber-700 flex items-center">
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
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
                  <li>
                    <Link href="/ayurveda" className="text-gray-400 hover:text-white transition-colors">
                      Ayurvedic Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/handicraft" className="text-gray-400 hover:text-white transition-colors">
                      Handicrafts
                    </Link>
                  </li>
                  <li>
                    <Link href="/spices" className="text-gray-400 hover:text-white transition-colors">
                      Spices
                    </Link>
                  </li>
                  <li>
                    <Link href="/tea" className="text-gray-400 hover:text-white transition-colors">
                      Ceylon Tea
                    </Link>
                  </li>
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
