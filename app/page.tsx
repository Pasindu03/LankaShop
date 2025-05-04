import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import Navbar from "@/components/navbar";
import { JsonLd } from "@/components/json-ld";
import ProductShowcase from "@/components/catergory-showcase";

export const metadata = {
  title: "Authentic Sri Lankan Products in the UK | Lanka Shop",
  description:
    "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea. Official UK distributor with Sri Lankan authorizations.",
  alternates: {
    canonical: "https://lankashop.co.uk",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Lanka Shop",
    description:
      "Authentic Sri Lankan products in the UK including Ayurvedic remedies, handicrafts, spices, and Ceylon tea.",
    url: "https://lankashop.co.uk",
    telephone: "+44XXXXXXXXXX", // Replace with your actual phone number
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address", // Replace with your actual address
      addressLocality: "Your City",
      postalCode: "Your Postal Code",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5074, // Replace with your actual coordinates
      longitude: -0.1278,
    },
    openingHours: "Mo-Fr 09:00-17:00", // Replace with your actual hours
    priceRange: "££",
    image: "https://lankashop.co.uk/og-image.jpg", // Replace with your actual image
    sameAs: [
      "https://www.facebook.com/lankashop", // Replace with your actual social links
      "https://www.instagram.com/lankashop",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://lankashop.co.uk/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={structuredData} />
      <Navbar />

      {/* Hero Image Section - Full width, responsive height */}
      <section className="w-full h-[calc(100vh-80px)] md:h-[600px] lg:h-[800px] relative">
        <Image
          src="https://img.freepik.com/premium-photo/close-up-abandoned-statue-by-leaves_1048944-11809102.jpg?w=900"
          alt="Authentic Sri Lankan products showcase - traditional statues and artifacts"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-serif mb-6 text-center max-w-4xl">
            Welcome to the world of our original Sri Lankan products
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center mb-4">
            Unique blends of ingredients and aromas from the heart of Sri Lanka
          </p>
          <p className="text-base md:text-lg max-w-2xl text-center mb-8">
            Authentic Sri Lankan exporter in the United Kingdom with official
            authorizations from Sri Lankan companies
          </p>
          <button className="bg-white hover:bg-gray-200 text-gray-800 px-12 py-3 tracking-widest text-sm transition-colors">
            ORDER NOW
          </button>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">
            Our Products
          </h2>
          <ProductShowcase />
        </div>
      </section>

      <footer className="bg-white text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image
                src="/lankaShop.jpeg"
                alt="Lanka Shop Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-sm">
                © {new Date().getFullYear()} Lanka Shop. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" aria-label="Follow Lanka Shop on Facebook">
                <Facebook size={24} />
              </Link>
              <Link href="#" aria-label="Follow Lanka Shop on Instagram">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
