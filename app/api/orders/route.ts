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

        // Get the orders from Firestore
        const ordersSnapshot = await adminDb.collection("orders").where("userId", "==", uid).orderBy("date", "desc").get()

        const orders = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        // Return the orders
        return NextResponse.json({ orders })
    } catch (error) {
        console.error("Error getting orders:", error)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}
