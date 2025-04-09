"use client"

import { useState } from "react"
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

export default function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, updateQuantity, removeItem, totalItems, subtotal } = useCart()

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  return (
      <>
        {/* Cart Icon Button */}
        <button onClick={toggleCart} className="relative" aria-label="Shopping Cart">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
          )}
        </button>

        {/* Cart Sidebar */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={closeCart}
        >
          <div
              className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
              onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Your Cart ({totalItems})</h2>
                <button onClick={closeCart} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-grow overflow-auto p-4">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ShoppingBag size={64} className="text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <button onClick={closeCart} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                        Continue Shopping
                      </button>
                    </div>
                ) : (
                    <ul className="divide-y">
                      {cartItems.map((item) => (
                          <li key={item.id} className="py-4 flex">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link href={`/product/${item.id}`} onClick={closeCart}>
                                      {item.name}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">£{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">£{item.price.toFixed(2)} each</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center border rounded">
                                  <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="p-1 hover:bg-gray-100"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-2">{item.quantity}</span>
                                  <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="p-1 hover:bg-gray-100"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                  <div className="border-t p-4 space-y-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>£{subtotal.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <Link href="/checkout" onClick={closeCart}>
                        <button className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800">Checkout</button>
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <button type="button" className="font-medium text-black hover:underline" onClick={closeCart}>
                          Continue Shopping
                        </button>
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </>
  )
}
