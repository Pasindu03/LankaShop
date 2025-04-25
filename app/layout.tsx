import type React from "react"
import "./globals.css"
import { Nunito_Sans, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
// Nunito Sans as an alternative to Avenir
const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito-sans",
})

// Playfair Display for descriptions
const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair-display",
})

export const metadata = {
    metadataBase: new URL("https://lankashop.co.uk"),
    title: {
        default: "Lanka Shop | Authentic Sri Lankan Products in the UK",
        template: "%s | Lanka Shop",
    },
    description:
        "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea. Official UK distributor with Sri Lankan authorizations.",
    keywords: [
        "Sri Lankan products",
        "Ayurvedic",
        "Ceylon tea",
        "Sri Lankan spices",
        "handicrafts",
        "UK Sri Lankan shop",
    ],
    authors: [{ name: "Lanka Shop" }],
    creator: "Lanka Shop",
    publisher: "Lanka Shop",
    formatDetection: {
        email: false,
        telephone: false,
        address: false,
    },
    openGraph: {
        type: "website",
        locale: "en_GB",
        url: "https://lankashop.co.uk",
        siteName: "Lanka Shop",
        title: "Lanka Shop | Authentic Sri Lankan Products in the UK",
        description:
            "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea.",
        images: [
            {
                url: "https://lankashop.co.uk/og-image.jpg", // You'll need to create this image
                width: 1200,
                height: 630,
                alt: "Lanka Shop - Authentic Sri Lankan Products",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://lankashop.co.uk",
        languages: {
            "en-GB": "https://lankashop.co.uk",
        },
    },
    verification: {
        // Add your verification codes if you have them
        google: "google-site-verification-code",
        // yandex: "yandex-verification-code",
        // bing: "bing-verification-code",
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${nunitoSans.variable} ${playfairDisplay.variable}`}>
        <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
                <AuthProvider>{children}</AuthProvider>
            </CartProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
