"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login, loginWithGoogle } = useAuth()
    const router = useRouter()

    const handleLogin = async (e: any) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(email, password)
            router.push("/user")
        } catch (error) {
            setError("Failed to log in. Please check your credentials.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError("")
        setIsLoading(true)

        try {
            await loginWithGoogle()
            router.push("/user")
        } catch (error) {
            setError("Failed to log in with Google.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Sri Lankan pattern background (subtle)
    const pattern =
        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23815c3d' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1A1209] p-4" style={{ backgroundImage: pattern }}>
            <Card className="w-full max-w-md bg-[#2A1A0A] border-[#D9A566]/30 text-[#F5EFE0]">
                <CardHeader>
                    <CardTitle className="text-2xl text-[#D9A566]">Login</CardTitle>
                    <CardDescription className="text-[#F5EFE0]/70">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4 bg-[#8D3F2D]/20 border-[#8D3F2D] text-[#F5EFE0]">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#F5EFE0]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[#F5EFE0]">
                                    Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-[#1A1209] border-[#D9A566]/30 text-[#F5EFE0] focus:border-[#D9A566] focus:ring-[#D9A566]/20"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#8D3F2D] hover:bg-[#C14D33] text-[#F5EFE0] border-0"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#D9A566]/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#2A1A0A] text-[#F5EFE0]/70">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-[#D9A566]/30 text-[#F5EFE0] hover:bg-[#1A1209] hover:text-[#D9A566]"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-[#F5EFE0]/70">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-[#D9A566] hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
