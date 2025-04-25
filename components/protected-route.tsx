"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push("/login")
        }
    }, [isLoggedIn, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading...</span>
            </div>
        )
    }

    return isLoggedIn ? children : null
}
