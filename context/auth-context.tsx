"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
    type User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

type AuthContextType = {
    currentUser: User | null
    isLoading: boolean
    isLoggedIn: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setIsLoading(false)
        })

        // Cleanup subscription
        return unsubscribe
    }, [])

    // Login with email and password
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    // Sign up with email and password
    const signup = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error("Signup error:", error)
            throw error
        }
    }

    // Login with Google
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error("Google login error:", error)
            throw error
        }
    }

    // Logout
    const logout = async () => {
        try {
            await signOut(auth)
            router.push("/")
        } catch (error) {
            console.error("Logout error:", error)
            throw error
        }
    }

    const value = {
        currentUser,
        isLoading,
        isLoggedIn: !!currentUser,
        login,
        signup,
        loginWithGoogle,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
