"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import ShoppingCart from "./shopping-cart"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full bg-white text-black shadow-sm">
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="w-48 mb-6 md:mb-0">
            <Link href="/">
              <Image src="/lankaShop.jpeg" alt="Lanka Shop" width={75} height={75} className="object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wider">
            <Link href="/ayurveda" className="hover:underline transition-colors">
              AYURVEDIC
            </Link>
            <Link href="/handicraft" className="hover:underline transition-colors">
              HANDICRAFT
            </Link>
            <Link href="/spices" className="hover:underline transition-colors">
              SPICES
            </Link>
            <Link href="/tea" className="hover:underline transition-colors">
              CEYLON TEA
            </Link>
            <div className="ml-4">
              <ShoppingCart />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden w-full justify-between items-center">
            <button
              className="text-sm tracking-wider flex items-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="ml-2">MENU</span>
            </button>
            <ShoppingCart />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t mt-2">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/ayurveda"
                className="hover:underline transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AYURVEDIC
              </Link>
              <Link
                href="/handicraft"
                className="hover:underline transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HANDICRAFT
              </Link>
              <Link
                href="/spices"
                className="hover:underline transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SPICES
              </Link>
              <Link
                href="/tea"
                className="hover:underline transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CEYLON TEA
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

