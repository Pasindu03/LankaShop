import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function GET(request: Request) {
    try {
        // Get the session cookie
        const sessionCookie = cookies().get("session")?.value

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Verify the session cookie
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)

        // Get the user ID from the decoded claims
        const uid = decodedClaims.uid

        // Get the user data from Firestore
        const userDoc = await adminDb.collection("users").doc(uid).get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Return the user data
        return NextResponse.json({
            id: uid,
            ...userDoc.data(),
        })
    } catch (error) {
        console.error("Error getting user data:", error)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
