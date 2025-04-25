import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
}

// Initialize the app only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0]

// Export Firestore and Auth instances
export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
