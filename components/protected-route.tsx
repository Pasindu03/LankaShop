"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push("/login")
        }
    }, [isLoggedIn, isLoading, router])

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return isLoggedIn ? children : null
}
