"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User, X, Sun, Moon } from 'lucide-react'
import { useRouter } from "next/navigation"
import ShoppingCart from "./shopping-cart"
import { useAuth } from "@/context/auth-context"
import { getDocs, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface Category {
  id: string
  name: string
}

// Sri Lankan color palette
const sriLankanColors = {
  primary: "#8D3F2D", // Deep terracotta red
  secondary: "#D9A566", // Golden amber
  accent: "#2D5E3D", // Forest green
  dark: "#1A1209", // Deep brown
  light: "#F5EFE0", // Warm cream
  highlight: "#C14D33", // Cinnamon
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

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
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    fetchCategories()

    // Add scroll listener for navbar shadow
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(isLoggedIn ? "/user" : "/login")
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
      <header
          className={`w-full bg-[#1A1209] text-[#F5EFE0] fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? "shadow-md shadow-black/30" : ""
          }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Image
                    src="/lankaShop.jpeg"
                    alt="Lanka Shop"
                    width={50}
                    height={50}
                    className="object-contain h-12 w-auto sm:h-16 rounded-md border border-[#D9A566]/30"
                    priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 ml-10">
              {categories.map((cat) => (
                  <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="text-sm font-medium tracking-wider py-2 border-b-2 border-transparent hover:border-[#D9A566] hover:text-[#D9A566] transition-colors duration-200"
                  >
                    {cat.name.toUpperCase()}
                  </Link>
              ))}
            </nav>

            {/* Desktop Right Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-[#2A1A0A] rounded-full transition-colors"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                    <Sun size={20} className="text-[#D9A566]" />
                ) : (
                    <Moon size={20} className="text-[#D9A566]" />
                )}
              </button>
              <ShoppingCart />
              <button
                  onClick={handleUserClick}
                  className="flex items-center space-x-1 hover:text-[#D9A566] transition-colors"
                  aria-label={isLoggedIn ? "My Account" : "Login"}
              >
                <User size={20} />
                <span className="text-sm font-medium">{isLoggedIn ? "Account" : "Login"}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-[#2A1A0A] rounded-full transition-colors"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                    <Sun size={20} className="text-[#D9A566]" />
                ) : (
                    <Moon size={20} className="text-[#D9A566]" />
                )}
              </button>
              <ShoppingCart />
              <button
                  onClick={handleUserClick}
                  className="p-2 hover:bg-[#2A1A0A] rounded-full transition-colors"
                  aria-label={isLoggedIn ? "My Account" : "Login"}
              >
                <User size={20} className="text-[#D9A566]" />
              </button>
              <button
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                  className="p-2 hover:bg-[#2A1A0A] rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} className="text-[#D9A566]" /> : <Menu size={20} className="text-[#D9A566]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden backdrop-blur-sm"
                onClick={closeMobileMenu}
                aria-hidden="true"
            />
        )}

        {/* Mobile Menu Drawer */}
        <div
            className={`fixed top-0 right-0 h-full w-[280px] bg-[#2A1A0A] shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-[#D9A566]/20">
            <h2 className="font-bold text-lg text-[#D9A566]">Menu</h2>
            <button
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="p-2 hover:bg-[#1A1209] rounded-full transition-colors"
            >
              <X size={20} className="text-[#D9A566]" />
            </button>
          </div>

          <nav className="py-4">
            <div className="px-4 py-2 text-xs font-semibold text-[#D9A566]/70 uppercase">Categories</div>
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="block px-4 py-3 hover:bg-[#1A1209] transition-colors text-sm font-medium text-[#F5EFE0] hover:text-[#D9A566] border-l-2 border-transparent hover:border-[#D9A566]"
                    onClick={closeMobileMenu}
                >
                  {cat.name.toUpperCase()}
                </Link>
            ))}

            <div className="border-t border-[#D9A566]/20 my-4"></div>

            <Link
                href={isLoggedIn ? "/user" : "/login"}
                className="flex items-center px-4 py-3 hover:bg-[#1A1209] text-[#F5EFE0] hover:text-[#D9A566]"
                onClick={closeMobileMenu}
            >
              <User size={18} className="mr-3" />
              <span>{isLoggedIn ? "My Account" : "Login / Register"}</span>
            </Link>
          </nav>
        </div>
      </header>
  )
}
