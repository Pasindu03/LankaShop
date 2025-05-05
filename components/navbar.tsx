"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import ShoppingCart from "./shopping-cart";
import { useAuth } from "@/context/auth-context";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Category {
  id: string;
  name: string;
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), orderBy("name", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          name: (doc.data() as any).name,
        }));
        setCategories(items);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(isLoggedIn ? "/user" : "/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
<<<<<<< HEAD
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
=======
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
              <a href="/user" onClick={handleUserClick} className="cursor-pointer">
                <User />
                {/* Optional: Show login status indicator */}
                <span className="sr-only">{isLoggedIn ? "My Account" : "Login"}</span>
              </a>
            </nav>

            {/* Mobile Navigation Toggle and Cart */}
            <div className="flex md:hidden items-center space-x-4">
              <ShoppingCart />
              {/* Mobile user icon with conditional navigation */}
              <a href="/user" onClick={handleUserClick} className="cursor-pointer">
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
>>>>>>> 97e250c29cdebd5a01fe66510ae59b3456a58f02
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wider">
            {categories.map((cat) => {
              const slug = cat.name.split(" ")[0].toLowerCase();
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="hover:underline transition-colors"
                >
                  {cat.name.toUpperCase()}
                </Link>
              );
            })}
            <div className="ml-4">
              <ShoppingCart />
            </div>
            <a
              href="#"
              onClick={handleUserClick}
              className="cursor-pointer flex items-center"
            >
              <User />
              <span className="sr-only">
                {isLoggedIn ? "My Account" : "Login"}
              </span>
            </a>
          </nav>

          {/* Mobile Toggle & Icons */}
          <div className="flex md:hidden items-center space-x-4">
            <ShoppingCart />
            <a href="#" onClick={handleUserClick} className="cursor-pointer">
              <User size={20} />
            </a>
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t mt-2">
            <nav className="flex flex-col">
              {categories.map((cat) => {
                const slug = cat.name.split(" ")[0].toLowerCase();
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="hover:bg-gray-50 transition-colors py-3 px-2"
                    onClick={closeMobileMenu}
                  >
                    {cat.name.toUpperCase()}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
