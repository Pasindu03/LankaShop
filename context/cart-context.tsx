"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    category: string
    weight: number
    weightUnit : string
}

type CartContextType = {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    updateQuantity: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
    totalItems: number
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const updatedItems = [...prevItems]
                updatedItems[existingItemIndex].quantity += item.quantity
                return updatedItems
            } else {
                // Item doesn't exist, add new item
                return [...prevItems, item]
            }
        })
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return

        setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }

    const removeItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }

    const clearCart = () => {
        setCartItems([])
    }

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
