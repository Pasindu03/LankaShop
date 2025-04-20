"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import ShoppingCart from "./shopping-cart"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Handle user icon click based on login status
  const handleUserClick = (e : any) => {
    e.preventDefault() // Prevent default link behavior
    if (isLoggedIn) {
      router.push("/user")
    } else {
      router.push("/login")
    }
  }

  return (
      <header className="w-full bg-white text-black shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="w-auto">
              <Link href="/">
                <Image
                    src="/lankaShop.jpeg"
                    alt="Lanka Shop"
                    width={75}
                    height={75}
                    className="object-contain h-12 w-auto sm:h-16"
                />
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
              {/* User icon with conditional navigation */}
              <a href="#" onClick={handleUserClick} className="cursor-pointer">
                <User />
                {/* Optional: Show login status indicator */}
                <span className="sr-only">{isLoggedIn ? "My Account" : "Login"}</span>
              </a>
            </nav>

            {/* Mobile Navigation Toggle and Cart */}
            <div className="flex md:hidden items-center space-x-4">
              <ShoppingCart />
              {/* Mobile user icon with conditional navigation */}
              <a href="#" onClick={handleUserClick} className="cursor-pointer">
                <User size={20} />
              </a>
              <button
                  className="text-sm tracking-wider flex items-center p-2"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="ml-2 sr-only sm:not-sr-only">MENU</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t mt-2">
                <nav className="flex flex-col">
                  <Link
                      href="/ayurveda"
                      className="hover:bg-gray-50 transition-colors py-3 px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AYURVEDIC
                  </Link>
                  <Link
                      href="/handicraft"
                      className="hover:bg-gray-50 transition-colors py-3 px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    HANDICRAFT
                  </Link>
                  <Link
                      href="/spices"
                      className="hover:bg-gray-50 transition-colors py-3 px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SPICES
                  </Link>
                  <Link
                      href="/tea"
                      className="hover:bg-gray-50 transition-colors py-3 px-2"
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
