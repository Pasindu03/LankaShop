import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

// Define which routes require authentication
const protectedRoutes = ["/user", "/orders", "/checkout"]

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value

    // Check if the route requires authentication
    const requiresAuth = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    // If the route doesn't require auth, continue
    if (!requiresAuth) {
        return NextResponse.next()
    }

    // If there's no session cookie, redirect to login
    if (!session) {
        const url = new URL("/login", request.url)
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    try {
        // Verify the session cookie
        await adminAuth.verifySessionCookie(session, true)
        return NextResponse.next()
    } catch (error) {
        const url = new URL("/login", request.url)
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
}

export const config = {
    matcher: ["/user/:path*", "/orders/:path*", "/checkout/:path*"],
}
