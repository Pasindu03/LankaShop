import Link from "next/link"
import { ShoppingBag, Facebook, Instagram } from "lucide-react"
import Image from "next/image";
import HeroComponent from "@/components/HeroComponent";

export default function Home() {
  return (
      <main className="min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Left Panel - Dark */}
          <div className="relative bg-black text-white flex flex-col p-8 md:p-12">
            {/* Logo */}
            <div className="mb-16 md:mb-24">
              <div className="w-48 md:w-64 mx-auto md:mx-0">
                <div className="text-3xl md:text-4xl font-serif text-center md:text-left">
                  LANKA SHOP
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="max-w-xs mx-auto md:mx-0 md:ml-auto text-center md:text-right mb-8">
              <p className="font-serif text-lg md:text-xl font-light leading-relaxed">
                Welcome to the world of our four original kombucha flavors - unique blends of ingredients and aromas.
              </p>
            </div>

            {/* Product Image Area - Will be replaced with actual image */}
            <div className="flex-grow relative mt-4">
              <div className="aspect-[4/3] relative">
                {/* This will be replaced with your product image */}
                <div className="absolute inset-0 flex items-end justify-center">
                  <Image src={""} alt={""} width={800} height={800}/>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Light */}
          <div className="relative bg-gray-100 flex flex-col p-8 md:p-12">
            {/* Navigation */}
            <nav className="hidden md:flex justify-center space-x-6 text-sm tracking-wider mb-16">
              <Link href="#" className="hover:underline">
                OUR KOMBUCHA
              </Link>
              <Link href="#" className="hover:underline">
                FEAT & PROD
              </Link>
              <Link href="#" className="hover:underline">
                STORY
              </Link>
              <Link href="#" className="hover:underline">
                TASTES
              </Link>
              <Link href="#" className="hover:underline">
                More
              </Link>
              <Link href="#" className="ml-4">
                <ShoppingBag size={20} />
                <img src={"https://img.icons8.com/?size=100&id=Qen4bzysydKM&format=png&color=000000"} />
              </Link>
            </nav>



            {/* Mobile Navigation */}
            <nav className="flex md:hidden justify-between items-center mb-12">
              <button className="text-sm tracking-wider">MENU</button>
              <Link href="#" className="ml-4">
                <ShoppingBag size={20} />
              </Link>
            </nav>

            {/* Product Image Area - Will be replaced with actual image */}
            <div className="flex-grow flex items-center justify-center relative">
              <div className="aspect-[4/3] relative w-full">
                {/* This will be replaced with your product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Product image will be placed here</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-8 mb-12">
              <button className="bg-white hover:bg-gray-200 text-gray-800 px-12 py-3 tracking-widest text-sm transition-colors">
                ORDER NOW
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6">
              <Link href="#" aria-label="Facebook">
                <Facebook size={24} />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>

        <HeroComponent />
      </main>
  )
}

