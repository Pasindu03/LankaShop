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
    twitter: {
        card: "summary_large_image",
        title: "Lanka Shop | Authentic Sri Lankan Products in the UK",
        description:
            "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea.",
        images: ["https://lankashop.co.uk/twitter-image.jpg"], // You'll need to create this image
        creator: "@lankashop", // Replace with your Twitter handle if you have one
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
        google: "APGjbAgisZCr_TfS3x-0-BmLslCSbFPbuMt2DHKNMZw",
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#5bbad5",
            },
        ],
    },
    manifest: "/site.webmanifest",
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
